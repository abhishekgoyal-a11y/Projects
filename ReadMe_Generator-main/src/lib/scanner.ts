import type { ProjectFile, ProjectSnapshot } from "./types";

const TEXT_FILE_MATCHERS = [
  /(^|\/)package\.json$/i,
  /(^|\/)README\.md$/i,
  /(^|\/)LICENSE/i,
  /(^|\/)requirements\.txt$/i,
  /(^|\/)pyproject\.toml$/i,
  /(^|\/)pubspec\.ya?ml$/i,
  /(^|\/)pom\.xml$/i,
  /(^|\/)build\.gradle/i,
  /(^|\/)Cargo\.toml$/i,
  /(^|\/)go\.mod$/i,
  /(^|\/)vite\.config\./i,
  /(^|\/)next\.config\./i,
  /(^|\/)tailwind\.config\./i,
  /(^|\/)tsconfig\.json$/i,
  /(^|\/)analysis_options\.ya?ml$/i,
  /(^|\/)src\//i,
  /(^|\/)lib\//i,
  /(^|\/)app\//i,
  /(^|\/)pages\//i,
  /(^|\/)routes\//i,
  /(^|\/)server\./i,
  /(^|\/)main\./i,
  /(^|\/)app\./i,
  /(^|\/)[^/]+\.py$/i,
  /\.env\.example$/i
];

const IGNORED_SEGMENTS = new Set([
  ".git",
  "node_modules",
  "dist",
  "build",
  ".next",
  "coverage",
  "target",
  "venv",
  ".venv",
  "__pycache__",
  ".turbo"
]);

const MAX_TEXT_FILES = 140;
const MAX_FILE_BYTES = 120_000;
const GITHUB_FETCH_TIMEOUT_MS = 10_000;

function normalizePath(path: string): string {
  return path.replace(/\\/g, "/").replace(/^\/+/, "");
}

async function fetchWithTimeout(url: string, init: RequestInit = {}, timeoutMs = GITHUB_FETCH_TIMEOUT_MS): Promise<Response> {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    window.clearTimeout(timeout);
  }
}

export function shouldIgnorePath(path: string): boolean {
  return normalizePath(path).split("/").some((segment) => IGNORED_SEGMENTS.has(segment));
}

export function shouldReadFile(path: string, size = 0): boolean {
  const normalized = normalizePath(path);
  if (shouldIgnorePath(normalized) || size > MAX_FILE_BYTES) return false;
  return TEXT_FILE_MATCHERS.some((matcher) => matcher.test(normalized));
}

async function readFileText(file: File): Promise<string | undefined> {
  if (!shouldReadFile(file.webkitRelativePath || file.name, file.size)) return undefined;
  try {
    return await file.text();
  } catch {
    return undefined;
  }
}

export async function scanLocalFiles(fileList: FileList | File[]): Promise<ProjectSnapshot> {
  const files = Array.from(fileList);
  const projectFiles: ProjectFile[] = [];
  const firstPath = files[0]?.webkitRelativePath || files[0]?.name || "local-project";
  const name = normalizePath(firstPath).split("/")[0] || "local-project";

  for (const file of files) {
    const path = normalizePath(file.webkitRelativePath || file.name);
    if (shouldIgnorePath(path)) continue;
    const projectFile: ProjectFile = { path, name: file.name, size: file.size };
    if (projectFiles.length < MAX_TEXT_FILES) projectFile.content = await readFileText(file);
    projectFiles.push(projectFile);
  }

  return {
    source: "local",
    name,
    files: projectFiles,
    scannedAt: new Date().toISOString()
  };
}

export function parseGitHubUrl(rawUrl: string): { owner: string; repo: string; branch?: string } | null {
  try {
    const url = new URL(rawUrl.trim());
    if (url.hostname !== "github.com") return null;
    const [owner, repo, tree, branch] = url.pathname.split("/").filter(Boolean);
    if (!owner || !repo) return null;
    return { owner, repo: repo.replace(/\.git$/i, ""), branch: tree === "tree" ? branch : undefined };
  } catch {
    return null;
  }
}

interface GitHubTreeItem {
  path: string;
  type: "blob" | "tree";
  size?: number;
  url: string;
}

export async function scanGitHubRepository(repoUrl: string): Promise<ProjectSnapshot> {
  const parsed = parseGitHubUrl(repoUrl);
  if (!parsed) throw new Error("Enter a valid public GitHub repository URL.");

  const repoResponse = await fetchWithTimeout(`https://api.github.com/repos/${parsed.owner}/${parsed.repo}`);
  if (!repoResponse.ok) {
    if (repoResponse.status === 404) throw new Error("Repository not found or not public.");
    if (repoResponse.status === 403) throw new Error("GitHub rate limit reached. Try again later.");
    throw new Error("Unable to fetch repository details.");
  }

  const repo = await repoResponse.json() as { name: string; description?: string; html_url: string; default_branch: string };
  const branch = parsed.branch || repo.default_branch;
  const treeResponse = await fetchWithTimeout(`https://api.github.com/repos/${parsed.owner}/${parsed.repo}/git/trees/${branch}?recursive=1`);
  if (!treeResponse.ok) throw new Error("Unable to read the repository file tree.");

  const treePayload = await treeResponse.json() as { tree: GitHubTreeItem[] };
  const blobItems = treePayload.tree.filter((item) => item.type === "blob" && !shouldIgnorePath(item.path));
  const readableItems = blobItems.filter((item) => shouldReadFile(item.path, item.size ?? 0)).slice(0, MAX_TEXT_FILES);
  const contentMap = new Map<string, string>();

  await Promise.all(readableItems.map(async (item) => {
    try {
      const response = await fetchWithTimeout(`https://raw.githubusercontent.com/${parsed.owner}/${parsed.repo}/${branch}/${item.path}`);
      if (response.ok) contentMap.set(item.path, await response.text());
    } catch {
      // Missing file contents still leave structure available for analysis.
    }
  }));

  return {
    source: "github",
    name: repo.name,
    description: repo.description || undefined,
    url: repo.html_url,
    defaultBranch: branch,
    files: blobItems.map((item) => ({
      path: item.path,
      name: item.path.split("/").pop() || item.path,
      size: item.size,
      content: contentMap.get(item.path)
    })),
    scannedAt: new Date().toISOString()
  };
}

