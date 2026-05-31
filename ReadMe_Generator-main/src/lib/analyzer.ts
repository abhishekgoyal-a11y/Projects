import type { AnalysisResult, ProjectFile, ProjectSnapshot } from "./types";

function findFile(snapshot: ProjectSnapshot, matcher: RegExp): ProjectFile | undefined {
  return snapshot.files.find((file) => matcher.test(file.path));
}

function hasPath(snapshot: ProjectSnapshot, matcher: RegExp): boolean {
  return snapshot.files.some((file) => matcher.test(file.path));
}

function safeJson(content?: string): Record<string, unknown> | null {
  if (!content) return null;
  try {
    return JSON.parse(content) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function safeString(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function unique(values: Array<string | false | null | undefined>): string[] {
  return Array.from(new Set(values.filter(Boolean) as string[]));
}

function matchesAny(path: string, patterns: RegExp[]): boolean {
  return patterns.some((pattern) => pattern.test(path));
}

function dependencyNames(value: unknown): string[] {
  if (!value || typeof value !== "object") return [];
  return Object.keys(value as Record<string, unknown>).sort();
}

function parseRequirements(content?: string): string[] {
  if (!content) return [];
  return unique(
    content
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#"))
      .map((line) => line.match(/^([A-Za-z0-9_.-]+)/)?.[1]?.toLowerCase().replace(/_/g, "-") || null)
  );
}

function parsePyproject(content?: string): { dependencies: string[]; devDependencies: string[] } | null {
  if (!content) return null;
  const dependencies: string[] = [];
  const devDependencies: string[] = [];
  let mode: "production" | "development" | null = null;

  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (/^\[tool\.poetry\.dependencies\]$/i.test(line) || /^\[project\]$/i.test(line)) {
      mode = "production";
      continue;
    }
    if (/^\[tool\.poetry\.group\.dev\.dependencies\]$/i.test(line) || /^\[project.optional-dependencies\]/i.test(line)) {
      mode = "development";
      continue;
    }
    if (/^\[.+\]$/.test(line)) {
      mode = null;
      continue;
    }
    const keyMatch = line.match(/^([A-Za-z0-9_.-]+)\s*=|^([A-Za-z0-9_.-]+)\s*:/);
    const packageName = keyMatch?.[1] || keyMatch?.[2];
    if (!mode || !packageName || /^(python|build-system)$/i.test(packageName)) continue;
    if (mode === "production") dependencies.push(packageName.toLowerCase().replace(/_/g, "-"));
    if (mode === "development") devDependencies.push(packageName.toLowerCase().replace(/_/g, "-"));
  }

  return { dependencies: unique(dependencies), devDependencies: unique(devDependencies) };
}

function extractDemoUrl(content?: string, labelMatchers: RegExp[] = []): string | undefined {
  if (!content) return undefined;
  const lines = content.split(/\r?\n/);
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const hasLabel = labelMatchers.some((matcher) => matcher.test(line));
    const currentMatch = line.match(/https?:\/\/[^\s)]+/i);
    if (hasLabel && currentMatch) return currentMatch[0];
    if (hasLabel) {
      const nextMatch = lines[index + 1]?.match(/https?:\/\/[^\s)]+/i);
      if (nextMatch) return nextMatch[0];
    }
  }
  return undefined;
}

function parsePubspec(content?: string): { name?: string; description?: string; dependencies: string[]; devDependencies: string[] } | null {
  if (!content) return null;
  const result = { dependencies: [] as string[], devDependencies: [] as string[] };
  const name = content.match(/^name:\s*["']?([^"'\n#]+)["']?/m)?.[1]?.trim();
  const description = content.match(/^description:\s*["']?([^"'\n#]+)["']?/m)?.[1]?.trim();
  if (name) Object.assign(result, { name });
  if (description) Object.assign(result, { description });

  let mode: "dependencies" | "devDependencies" | null = null;
  for (const line of content.split(/\r?\n/)) {
    if (/^dependencies:\s*$/.test(line)) {
      mode = "dependencies";
      continue;
    }
    if (/^dev_dependencies:\s*$/.test(line)) {
      mode = "devDependencies";
      continue;
    }
    if (/^\S/.test(line)) mode = null;
    const match = line.match(/^\s{2}([a-zA-Z_][\w-]*):/);
    if (mode && match && !["sdk", "flutter"].includes(match[1])) result[mode].push(match[1]);
  }

  return result;
}

function detectPackageManager(snapshot: ProjectSnapshot): string | null {
  if (findFile(snapshot, /(^|\/)pubspec\.ya?ml$/)) return "flutter";
  if (findFile(snapshot, /(^|\/)pyproject\.toml$/)) {
    const content = findFile(snapshot, /(^|\/)pyproject\.toml$/)?.content || "";
    if (/\[tool\.poetry\]/i.test(content)) return "poetry";
    return "pip";
  }
  if (findFile(snapshot, /(^|\/)requirements\.txt$/)) return "pip";
  if (hasPath(snapshot, /(^|\/)pnpm-lock\.yaml$/)) return "pnpm";
  if (hasPath(snapshot, /(^|\/)yarn\.lock$/)) return "yarn";
  if (hasPath(snapshot, /(^|\/)package-lock\.json$/)) return "npm";
  if (hasPath(snapshot, /(^|\/)bun\.lockb?$/)) return "bun";
  return findFile(snapshot, /(^|\/)package\.json$/) ? "npm" : null;
}

function commandPrefix(manager: string | null): string {
  if (manager === "flutter") return "flutter";
  if (manager === "poetry") return "poetry";
  if (manager === "pnpm") return "pnpm";
  if (manager === "yarn") return "yarn";
  if (manager === "bun") return "bun";
  return "npm";
}

function detectTechStack(snapshot: ProjectSnapshot, dependencies: string[]): string[] {
  const dep = new Set(dependencies.map((item) => item.toLowerCase()));
  return unique([
    findFile(snapshot, /(^|\/)pubspec\.ya?ml$/) && "Flutter",
    findFile(snapshot, /(^|\/)pubspec\.ya?ml$/) && "Dart",
    hasPath(snapshot, /(^|\/)android\//) && "Android",
    hasPath(snapshot, /(^|\/)ios\//) && "iOS",
    hasPath(snapshot, /(^|\/)web\//) && "Web",
    findFile(snapshot, /(^|\/)package\.json$/) && "Node.js",
    dep.has("react") && "React",
    dep.has("vue") && "Vue",
    dep.has("@angular/core") && "Angular",
    dep.has("next") && "Next.js",
    dep.has("vite") && "Vite",
    dep.has("typescript") || hasPath(snapshot, /\.tsx?$/) ? "TypeScript" : false,
    dep.has("tailwindcss") && "Tailwind CSS",
    dep.has("express") && "Express",
    dep.has("fastify") && "Fastify",
    dep.has("mongoose") && "MongoDB",
    dep.has("prisma") && "Prisma",
    dep.has("jest") && "Jest",
    dep.has("vitest") && "Vitest",
    dep.has("playwright") && "Playwright",
    dep.has("qrcode") && "qrcode",
    dep.has("jspdf") && "jsPDF",
    dep.has("jszip") && "JSZip",
    findFile(snapshot, /(^|\/)requirements\.txt$/) || findFile(snapshot, /(^|\/)pyproject\.toml$/) ? "Python" : false,
    dep.has("langgraph") && "LangGraph",
    dep.has("langchain") && "LangChain",
    dep.has("langchain-community") && "LangChain Community",
    dep.has("groq") && "Groq API",
    (dep.has("tavily-python") || dep.has("tavily")) && "Tavily Search API",
    dep.has("streamlit") && "Streamlit",
    dep.has("pydantic") && "Pydantic",
    dep.has("markdown") && "Markdown",
    dep.has("python-dotenv") && "python-dotenv",
    !findFile(snapshot, /(^|\/)pubspec\.ya?ml$/) && (findFile(snapshot, /(^|\/)pom\.xml$/) || findFile(snapshot, /(^|\/)build\.gradle/)) ? "Java" : false,
    findFile(snapshot, /(^|\/)Cargo\.toml$/) && "Rust",
    findFile(snapshot, /(^|\/)go\.mod$/) && "Go"
  ]);
}

function detectFeatures(snapshot: ProjectSnapshot, dependencies: string[]): string[] {
  const dep = new Set(dependencies.map((item) => item.toLowerCase()));
  const tree = snapshot.files.map((file) => file.path).join("\n");
  const hasValidationModule = matchesAny(tree, [/validation\.ts$/i, /validation\.tsx$/i, /validate/i, /schema/i]) || dep.has("zod") || dep.has("yup") || dep.has("pydantic");
  const hasContentModule = matchesAny(tree, [/content\.ts$/i, /content\.tsx$/i, /payload/i, /prompt/i, /schema/i]);
  const hasQrModule = matchesAny(tree, [/qr\.ts$/i, /qr\.tsx$/i, /qrcode/i]) || dep.has("qrcode");
  const hasExportDeps = dep.has("jspdf") || dep.has("jszip");
  const hasBatchSignals = matchesAny(tree, [/batch/i, /bulk/i, /zip/i]) || dep.has("jszip");
  const hasComponentTree = matchesAny(tree, [/components\//i, /component\//i]);
  const hasDedicatedTests = snapshot.files.some((file) => /(?:^|\/)[\w-]+\.test\.[tj]sx?$/.test(file.path) || /(?:^|\/)[\w-]+\.spec\.[tj]sx?$/.test(file.path));
  const hasAgents = matchesAny(tree, [/agents\//i, /agent/i]);
  const hasWorkflow = matchesAny(tree, [/workflow\//i, /orchestrator/i, /graph/i]);
  const hasPrompts = matchesAny(tree, [/prompts\//i, /prompt/i]);
  const hasTools = matchesAny(tree, [/tools\//i, /web_search/i, /search/i]);
  const hasModels = matchesAny(tree, [/models\//i, /schemas?/i, /state/i]);
  const hasGeneratedContent = matchesAny(tree, [/generated_blogs\//i, /generated_/i, /blogs?\//i]);
  const hasFrontend = matchesAny(tree, [/frontend\.py$/i, /streamlit/i]);
  const hasPersistence = hasGeneratedContent || /save|persist|history/i.test(tree);
  const hasSearch = dep.has("tavily-python") || dep.has("tavily") || dep.has("serpapi");
  const hasAgenticPython = dep.has("langgraph") || dep.has("langchain") || hasAgents || hasWorkflow || hasPrompts;
  return unique([
    findFile(snapshot, /(^|\/)pubspec\.ya?ml$/) && "Cross-platform application structure",
    hasPath(snapshot, /(^|\/)lib\/.*\.dart$/) && "Dart application code",
    (dep.has("react-router-dom") || dep.has("next")) && "Client-side routing",
    (dep.has("express") || dep.has("fastify") || hasPath(snapshot, /(^|\/)(routes|api)\//)) && "REST API structure",
    (dep.has("mongoose") || dep.has("prisma") || dep.has("sequelize") || dep.has("pg")) && "Database integration",
    (dep.has("next-auth") || dep.has("passport") || hasPath(snapshot, /(^|\/)(auth|authentication)\//i) || hasPath(snapshot, /auth(service|provider|controller)\./i)) && "Authentication flow",
    (dep.has("vitest") || dep.has("jest") || dep.has("playwright") || hasDedicatedTests) && "Automated tests",
    (dep.has("tailwindcss") || dep.has("sass") || hasPath(snapshot, /\.module\.css$/)) && "Custom styling system",
    (dep.has("zod") || dep.has("yup") || hasValidationModule) && "Schema validation",
    (dep.has("lucide-react") || dep.has("react-icons") || hasPath(snapshot, /icons?\//i)) && "Icon-rich interface",
    hasQrModule && "QR code generation workflow",
    hasContentModule && "Multiple QR payload formats",
    hasValidationModule && "Client-side input validation",
    dep.has("jspdf") && "PDF export support",
    dep.has("jszip") && "ZIP batch export",
    hasExportDeps && "Export pipeline for generated assets",
    hasBatchSignals && "Batch generation workflow",
    hasComponentTree && "Reusable component architecture",
    (dep.has("react") && dep.has("vite")) && "Fast client-side rendering",
    dep.has("typescript") && "Type-safe project structure",
    hasAgents && "Multi-agent workflow orchestration",
    hasWorkflow && "Graph-based execution flow",
    hasPrompts && "Prompt engineering layer",
    hasTools && "External search tool integration",
    hasModels && "Structured schema and state management",
    hasGeneratedContent && "Persistent generated content storage",
    hasFrontend && "Publication-style frontend",
    hasSearch && "Research-backed content discovery",
    hasAgenticPython && "AI content generation pipeline",
    dep.has("streamlit") && "Streamlit interface",
    dep.has("groq") && "Groq LLM integration",
    dep.has("python-dotenv") && "Environment-based configuration",
    hasPath(snapshot, /(^|\/)Dockerfile$/i) && "Docker support",
    hasPath(snapshot, /(^|\/)\.github\/workflows\//) && "GitHub Actions workflow",
    hasPath(snapshot, /(^|\/)public\//) && "Static asset handling"
  ]).slice(0, 16);
}

function detectProjectType(snapshot: ProjectSnapshot, techStack: string[], dependencies: string[]): string {
  const dep = new Set(dependencies.map((item) => item.toLowerCase()));
  const hasFrontend = techStack.some((item) => ["React", "Vue", "Angular", "Next.js"].includes(item));
  const hasBackend = dep.has("express") || dep.has("fastify") || hasPath(snapshot, /(^|\/)(server|routes|api)\//);
  const hasPythonAi = techStack.includes("Python") && (dep.has("langgraph") || dep.has("langchain") || dep.has("groq") || dep.has("streamlit"));
  if (techStack.includes("Flutter")) return "Flutter cross-platform application";
  if (hasPythonAi) return "Python AI workflow application";
  if (hasFrontend && hasBackend) return "Full-stack web application";
  if (hasFrontend) return "Frontend web application";
  if (hasBackend) return "Backend API service";
  if (findFile(snapshot, /(^|\/)package\.json$/)) return "Node.js package or tool";
  if (techStack.includes("Python")) return "Python project";
  if (techStack.includes("Java")) return "Java project";
  if (techStack.includes("Rust")) return "Rust project";
  if (techStack.includes("Go")) return "Go project";
  return "Software project";
}

function detectEntryPoints(snapshot: ProjectSnapshot): string[] {
  const matchers = [/lib\/main\.dart$/, /src\/main\.tsx?$/, /src\/App\.tsx?$/, /index\.[jt]sx?$/, /server\.[jt]s$/, /app\.py$/, /main\.py$/, /frontend\.py$/, /src\/main\/java\//];
  return snapshot.files.filter((file) => matchers.some((matcher) => matcher.test(file.path))).map((file) => file.path).slice(0, 6);
}

function structureLines(snapshot: ProjectSnapshot): string[] {
  const topLevel = new Set<string>();
  snapshot.files.forEach((file) => {
    const [first, second] = file.path.split("/");
    if (!first) return;
    topLevel.add(second ? `${first}/` : first);
  });
  return Array.from(topLevel).sort().slice(0, 18);
}

function projectTree(snapshot: ProjectSnapshot): string {
  const paths = snapshot.files
    .map((file) => file.path)
    .filter((path) => !/(^|\/)(node_modules|dist|build|coverage|\.git)\//.test(path))
    .sort()
    .slice(0, 220);

  interface TreeNode {
    children: Map<string, TreeNode>;
    isFile: boolean;
  }

  function createNode(): TreeNode {
    return { children: new Map<string, TreeNode>(), isFile: false };
  }

  const rootNode = createNode();

  for (const path of paths) {
    const segments = path.split("/").filter(Boolean);
    let current = rootNode;
    segments.forEach((segment, index) => {
      if (!current.children.has(segment)) current.children.set(segment, createNode());
      current = current.children.get(segment)!;
      if (index === segments.length - 1) current.isFile = true;
    });
  }

  function sortEntries(entries: Array<[string, TreeNode]>): Array<[string, TreeNode]> {
    return entries.sort(([leftName, leftNode], [rightName, rightNode]) => {
      const leftIsDirectory = leftNode.children.size > 0 && !leftNode.isFile;
      const rightIsDirectory = rightNode.children.size > 0 && !rightNode.isFile;
      if (leftIsDirectory !== rightIsDirectory) return leftIsDirectory ? -1 : 1;
      return leftName.localeCompare(rightName);
    });
  }

  function renderNode(name: string, node: TreeNode, prefix: string, isLast: boolean, lines: string[], isRoot = false): void {
    if (isRoot) {
      lines.push(`${name}/`);
    } else {
      const connector = isLast ? "└── " : "├── ";
      const suffix = node.children.size > 0 && !node.isFile ? "/" : "";
      lines.push(`${prefix}${connector}${name}${suffix}`);
    }

    const childEntries = sortEntries(Array.from(node.children.entries()));
    childEntries.forEach(([childName, childNode], index) => {
      const nextPrefix = isRoot ? "" : `${prefix}${isLast ? "    " : "│   "}`;
      renderNode(childName, childNode, nextPrefix, index === childEntries.length - 1, lines, false);
    });
  }

  const lines: string[] = [];
  renderNode(snapshot.name || "project", rootNode, "", true, lines, true);
  if (snapshot.files.length > paths.length) lines.push(`... ${snapshot.files.length - paths.length} more files`);
  return lines.join("\n");
}

function supportedTechnologies(techStack: string[], dependencies: string[]): string[] {
  return unique([...techStack, ...dependencies.filter((dependency) => /flutter|firebase|provider|riverpod|bloc|dio|http|sqflite|hive|langgraph|langchain|groq|tavily|streamlit|pydantic|markdown/i.test(dependency))]);
}

export function analyzeProject(snapshot: ProjectSnapshot): AnalysisResult {
  const packageJson = safeJson(findFile(snapshot, /(^|\/)package\.json$/)?.content);
  const pubspec = parsePubspec(findFile(snapshot, /(^|\/)pubspec\.ya?ml$/)?.content);
  const requirements = parseRequirements(findFile(snapshot, /(^|\/)requirements\.txt$/)?.content);
  const pyproject = parsePyproject(findFile(snapshot, /(^|\/)pyproject\.toml$/)?.content);
  const dependencies = dependencyNames(packageJson?.dependencies);
  const devDependencies = dependencyNames(packageJson?.devDependencies);
  const productionDependencies = unique([...dependencies, ...(pubspec?.dependencies ?? []), ...requirements, ...(pyproject?.dependencies ?? [])]);
  const developmentDependencies = unique([...devDependencies, ...(pubspec?.devDependencies ?? []), ...(pyproject?.devDependencies ?? [])]);
  const allDependencies = [...productionDependencies, ...developmentDependencies];
  const scripts = packageJson?.scripts && typeof packageJson.scripts === "object" ? packageJson.scripts as Record<string, string> : {};
  const packageManager = detectPackageManager(snapshot);
  const prefix = commandPrefix(packageManager);
  const techStack = detectTechStack(snapshot, allDependencies);
  const features = detectFeatures(snapshot, allDependencies);
  const install = packageJson ? [`${prefix} install`] : pubspec ? ["flutter pub get"] : findFile(snapshot, /requirements\.txt$/) ? [packageManager === "poetry" ? "poetry install" : "pip install -r requirements.txt"] : findFile(snapshot, /(^|\/)pyproject\.toml$/) ? [packageManager === "poetry" ? "poetry install" : "pip install ."] : [];
  const runCommands = pubspec ? ["flutter run"] : findFile(snapshot, /(^|\/)frontend\.py$/) && techStack.includes("Streamlit") ? [packageManager === "poetry" ? "poetry run streamlit run frontend.py" : "streamlit run frontend.py"] : findFile(snapshot, /(^|\/)main\.py$/) && techStack.includes("Python") ? [packageManager === "poetry" ? "poetry run python main.py" : "python main.py"] : Object.keys(scripts).length
    ? Object.keys(scripts).filter((name) => /^(dev|start|serve|preview|test|build)$/.test(name)).map((name) => `${prefix} ${prefix === "npm" ? "run " : ""}${name}`.replace("npm run start", "npm start"))
    : [];

  const testCount = snapshot.files.filter((file) => /\.test\.|\.spec\.|__tests__/.test(file.path)).length;
  const folderDepth = Math.max(1, ...snapshot.files.map((file) => file.path.split("/").length));
  const complexityScore = Math.min(100, Math.round(snapshot.files.length * 0.35 + folderDepth * 8 + techStack.length * 5 + testCount * 2));
  const readmeFile = findFile(snapshot, /(^|\/)README\.md$/i)?.content;

  return {
    projectName: String(safeString(packageJson?.name) || pubspec?.name || snapshot.name || "project").replace(/^@[^/]+\//, ""),
    description: snapshot.description || safeString(packageJson?.description) || pubspec?.description || "",
    projectType: detectProjectType(snapshot, techStack, allDependencies),
    techStack,
    dependencies: { production: productionDependencies, development: developmentDependencies },
    features,
    scripts,
    entryPoints: detectEntryPoints(snapshot),
    packageManager,
    license: safeString(packageJson?.license) || (findFile(snapshot, /(^|\/)LICENSE/i) ? "See LICENSE" : null),
    hasTests: testCount > 0 || Boolean(scripts.test),
    hasEnvExample: hasPath(snapshot, /\.env\.example$/),
    installCommands: install,
    runCommands,
    folderStructure: structureLines(snapshot),
    projectTree: projectTree(snapshot),
    supportedTechnologies: supportedTechnologies(techStack, allDependencies),
    complexityScore,
    warnings: snapshot.files.length > 500 ? ["Large repository detected; README generated from the most relevant files only."] : [],
    liveDemoUrl: extractDemoUrl(readmeFile, [/live\s*demo/i, /live\s*link/i, /try it here/i]),
    videoDemoUrl: extractDemoUrl(readmeFile, [/video\s*demo/i, /video\s*link/i, /demo video/i, /watch/i])
  };
}
