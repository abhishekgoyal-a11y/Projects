import { useEffect, useRef, useState } from "react";
import {
  BookOpen,
  CheckCircle2,
  Code2,
  Copy,
  Download,
  Eye,
  FileText,
  Folder,
  Github,
  History,
  Home,
  Maximize2,
  Moon,
  Sparkles,
  Sun,
  Zap
} from "lucide-react";
import { analyzeProject } from "./lib/analyzer";
import { generateReadme } from "./lib/generator";
import { renderMarkdown } from "./lib/markdown";
import { parseGitHubUrl, scanGitHubRepository, scanLocalFiles } from "./lib/scanner";
import type { AnalysisResult, GeneratorSettings, HistoryEntry, ProjectSnapshot, SourceType, TemplateId, Theme, View } from "./lib/types";

const DEFAULT_SETTINGS: GeneratorSettings = {
  template: "modern",
  includeBadges: true,
  includeEmojis: false,
  includeStructure: true
};

const navItems: Array<{ id: View; label: string; icon: typeof Home }> = [
  { id: "dashboard", label: "Dashboard", icon: Home },
  { id: "preview", label: "Preview", icon: Eye },
  { id: "history", label: "History", icon: History },
  { id: "about", label: "About", icon: BookOpen }
];

const templates: Array<{ id: TemplateId; name: string; detail: string }> = [
  { id: "modern", name: "Modern", detail: "Balanced README with setup, scripts, and project structure." },
  { id: "detailed", name: "Detailed", detail: "Adds quality notes, complexity score, and richer implementation context." },
  { id: "minimal", name: "Minimal", detail: "Short, clean README for small demos and quick projects." },
  { id: "opensource", name: "Open Source", detail: "Includes contribution, support, and community-friendly sections." }
];

const THEME_STORAGE_KEY = "readme-theme-v2";

function App() {
  const GITHUB_SCAN_COOLDOWN_MS = 5000;
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem(THEME_STORAGE_KEY) as Theme) || "dark");
  const [view, setView] = useState<View>("dashboard");
  const [source, setSource] = useState<SourceType>("local");
  const [githubUrl, setGithubUrl] = useState("");
  const [liveDemoLink, setLiveDemoLink] = useState("");
  const [videoDemoLink, setVideoDemoLink] = useState("");
  const [snapshot, setSnapshot] = useState<ProjectSnapshot | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [settings, setSettings] = useState<GeneratorSettings>(() => {
    const saved = localStorage.getItem("readme-settings");
    return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) as GeneratorSettings } : DEFAULT_SETTINGS;
  });
  const [markdown, setMarkdown] = useState("");
  const [status, setStatus] = useState("Choose a local folder or enter a public GitHub URL to get started.");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const [fullScreenPreview, setFullScreenPreview] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>(() => JSON.parse(localStorage.getItem("readme-history") || "[]") as HistoryEntry[]);
  const [previewPanelHeight, setPreviewPanelHeight] = useState<number | null>(null);
  const [lastGithubScanAt, setLastGithubScanAt] = useState(0);
  const sourcePanelRef = useRef<HTMLElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("readme-settings", JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem("readme-history", JSON.stringify(history.slice(0, 12)));
  }, [history]);

  useEffect(() => {
    const sourcePanel = sourcePanelRef.current;
    if (!sourcePanel) return;

    const updateHeight = () => setPreviewPanelHeight(sourcePanel.getBoundingClientRect().height);
    updateHeight();

    if (typeof ResizeObserver !== "undefined") {
      const observer = new ResizeObserver(updateHeight);
      observer.observe(sourcePanel);
      return () => observer.disconnect();
    }

    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, [busy, error, status, view]);

  useEffect(() => {
    if (!analysis) return;
    const next = generateReadme({
      ...analysis,
      liveDemoUrl: liveDemoLink.trim() || analysis.liveDemoUrl,
      videoDemoUrl: videoDemoLink.trim() || analysis.videoDemoUrl
    }, settings);
    setMarkdown(next);
  }, [analysis, liveDemoLink, settings, videoDemoLink]);

  async function handleSnapshot(nextSnapshot: ProjectSnapshot) {
    const nextAnalysis = analyzeProject(nextSnapshot);
    setSnapshot(nextSnapshot);
    setAnalysis(nextAnalysis);
    setLiveDemoLink(nextAnalysis.liveDemoUrl || "");
    setVideoDemoLink(nextAnalysis.videoDemoUrl || "");
    const nextMarkdown = generateReadme({
      ...nextAnalysis
    }, settings);
    setMarkdown(nextMarkdown);
    setStatus(`Analyzed ${nextAnalysis.projectName}. Generated a heuristic README locally.`);
    setError(null);
    setView("preview");
    saveHistory(nextAnalysis.projectName, nextSnapshot.source, nextMarkdown);
  }

  function saveHistory(name: string, nextSource: SourceType, nextMarkdown: string) {
    setHistory((current) => [
      {
        id: crypto.randomUUID(),
        name,
        source: nextSource,
        markdown: nextMarkdown,
        createdAt: new Date().toISOString()
      },
      ...current.filter((entry) => entry.markdown !== nextMarkdown)
    ].slice(0, 12));
  }

  async function scanLocalSelection(files?: FileList | null) {
    if (!files?.length) return;
    setBusy(true);
    setError(null);
    setStatus("Scanning local project files...");
    try {
      await handleSnapshot(await scanLocalFiles(files));
    } catch (scanError) {
      setError(scanError instanceof Error ? scanError.message : "Unable to scan the selected folder.");
    } finally {
      setBusy(false);
    }
  }

  async function scanGitHub() {
    if (!parseGitHubUrl(githubUrl)) {
      setError("Enter a valid public GitHub repository URL.");
      return;
    }
    const now = Date.now();
    if (now - lastGithubScanAt < GITHUB_SCAN_COOLDOWN_MS) {
      setError("Please wait a few seconds before scanning GitHub again.");
      return;
    }
    setLastGithubScanAt(now);
    setBusy(true);
    setError(null);
    setStatus("Fetching repository metadata from GitHub...");
    try {
      await handleSnapshot(await scanGitHubRepository(githubUrl));
    } catch (scanError) {
      setError(scanError instanceof Error ? scanError.message : "Unable to scan this repository.");
    } finally {
      setBusy(false);
    }
  }

  async function copyMarkdown() {
    if (!markdown) return;
    await navigator.clipboard.writeText(markdown);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  function downloadMarkdown() {
    if (!markdown) return;
    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "README.md";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  const preview = <ReadmePreview markdown={markdown} />;

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark"><FileText size={29} /></div>
          <strong>README <span>Generator</span></strong>
        </div>
        <nav className="nav-list" aria-label="Application sections">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button key={id} className={view === id ? "active" : ""} type="button" onClick={() => setView(id)}>
              <Icon size={19} />
              {label}
            </button>
          ))}
        </nav>
        <div className="free-card">
          <span><CheckCircle2 size={19} /> Totally Free</span>
          <small>No sign up. No limits. Runs in your browser.</small>
          <Code2 size={22} />
        </div>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div>
            <h1>Generate README</h1>
            <p>Generate a professional README.md for your project in seconds. <span>100% Free - Open Source</span></p>
          </div>
          <div className="top-actions">
            <button className="icon-button" type="button" onClick={() => setTheme(theme === "light" ? "dark" : "light")} aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}>
              {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            <a className="github-button" href="https://github.com/Vaidehee-Bindal/ReadMe_Generator" target="_blank" rel="noreferrer"><Github size={19} /> Star on GitHub</a>
          </div>
        </header>

        {view === "dashboard" ? (
          <div className="main-grid">
            <section className="panel source-panel" ref={sourcePanelRef}>
              <PanelTitle title="Choose your source" detail="Select your project source to get started" />
              <div className="source-grid">
                <SourceCard active={source === "local"} icon={Folder} title="Local Folder" detail="Scan a project from your local machine" badge="Recommended" onClick={() => setSource("local")}>
                  <button className="wide-subtle" type="button" onClick={() => fileInputRef.current?.click()} disabled={busy}>
                    <Folder size={17} /> Browse Folder
                  </button>
                  <input
                    ref={fileInputRef}
                    className="sr-only"
                    type="file"
                    multiple
                    {...({ webkitdirectory: "", directory: "" } as Record<string, string>)}
                    onChange={(event) => scanLocalSelection(event.target.files)}
                  />
                </SourceCard>
                <SourceCard active={source === "github"} icon={Github} title="GitHub Repository" detail="Scan a public repository from GitHub" onClick={() => setSource("github")}>
                  <div className="github-input-row">
                    <input
                      value={githubUrl}
                      onChange={(event) => setGithubUrl(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") scanGitHub();
                      }}
                      placeholder="Paste a GitHub repo URL and press Enter"
                    />
                    <button className="submit-button" type="button" onClick={() => scanGitHub()} disabled={busy} aria-label="Submit GitHub URL">Submit</button>
                  </div>
                </SourceCard>
              </div>
              <StepStrip />
              <OptionalLinksPanel
                liveDemoLink={liveDemoLink}
                videoDemoLink={videoDemoLink}
                onLiveDemoLinkChange={setLiveDemoLink}
                onVideoDemoLinkChange={setVideoDemoLink}
              />
              {error && <p className="error-message">{error}</p>}
              <p className="status-line">{busy ? "Working..." : status}</p>
            </section>

            <PreviewPanel markdown={markdown} onCopy={copyMarkdown} onDownload={downloadMarkdown} onFullscreen={() => setFullScreenPreview(true)} copied={copied} panelHeight={previewPanelHeight} />
          </div>
        ) : null}

        {view === "preview" && <PreviewOnly snapshot={snapshot} analysis={analysis} preview={preview} markdown={markdown} onCopy={copyMarkdown} onDownload={downloadMarkdown} copied={copied} />}
        {view === "history" && <HistoryPanel entries={history} onRestore={(entry) => { setMarkdown(entry.markdown); setView("preview"); }} onClear={() => setHistory([])} />}
        {view === "about" && <AboutPanel />}

        {view === "dashboard" && <FeaturePanel />}
        {fullScreenPreview && <FullscreenPreview markdown={markdown} onClose={() => setFullScreenPreview(false)} />}
      </section>
    </main>
  );
}

function PanelTitle({ title, detail }: { title: string; detail?: string }) {
  return <div className="panel-title"><h2>{title}</h2>{detail && <p>{detail}</p>}</div>;
}

function SourceCard({ active, icon: Icon, title, detail, badge, children, onClick }: { active: boolean; icon: typeof Folder; title: string; detail: string; badge?: string; children: React.ReactNode; onClick: () => void }) {
  return (
    <article className={`source-card ${active ? "active" : ""}`} onClick={onClick}>
      <div className="choice-dot" />
      <div className="source-icon"><Icon size={32} /></div>
      <h3>{title}</h3>
      <p>{detail}</p>
      {badge && <span className="badge">{badge}</span>}
      {children}
    </article>
  );
}

function StepStrip() {
  return <div className="steps"><span>How it works</span>{["Select Source", "Scan & Analyze", "Generate README"].map((item, index) => <div key={item} className="step"><b>{index + 1}</b><strong>{item}</strong></div>)}</div>;
}

function OptionalLinksPanel({
  liveDemoLink,
  videoDemoLink,
  onLiveDemoLinkChange,
  onVideoDemoLinkChange
}: {
  liveDemoLink: string;
  videoDemoLink: string;
  onLiveDemoLinkChange: (value: string) => void;
  onVideoDemoLinkChange: (value: string) => void;
}) {
  return (
    <div className="panel links-panel">
      <PanelTitle title="Optional README links" detail="Fill these in if you want the generator to add Live Demo and Video Demo sections." />
      <div className="link-fields">
        <label>
          <span>Live demo link (optional)</span>
          <input value={liveDemoLink} onChange={(event) => onLiveDemoLinkChange(event.target.value)} placeholder="https://your-app.example.com" />
        </label>
        <label>
          <span>Video demo link (optional)</span>
          <input value={videoDemoLink} onChange={(event) => onVideoDemoLinkChange(event.target.value)} placeholder="https://youtube.com/watch?v=..." />
        </label>
      </div>
    </div>
  );
}

function PreviewPanel({ markdown, onCopy, onDownload, onFullscreen, copied, panelHeight }: { markdown: string; onCopy: () => void; onDownload: () => void; onFullscreen: () => void; copied: boolean; panelHeight: number | null }) {
  return (
    <aside className="panel preview-panel" style={panelHeight ? { height: `${panelHeight}px` } : undefined}>
      <div className="preview-head"><h2>README Preview</h2><span>Heuristic Preview</span></div>
      <ReadmePreview markdown={markdown} />
      <div className="preview-actions">
        <button type="button" onClick={onCopy} disabled={!markdown}><Copy size={17} /> {copied ? "Copied" : "Copy"}</button>
        <button type="button" onClick={onDownload} disabled={!markdown}><Download size={17} /> Download</button>
        <button className="primary" type="button" onClick={onFullscreen} disabled={!markdown}><Maximize2 size={17} /> Full Screen</button>
      </div>
    </aside>
  );
}

function FeaturePanel() {
  const features = [
    ["Auto Detect Tech Stack", "Automatically detects frameworks, libraries and tools", Zap],
    ["Smart Project Analysis", "Scans structure, dependencies and key files", Sparkles],
    ["Easy to use", "Intuitive UI — generate a README in just a few clicks", Sparkles],
    ["Export Options", "Copy, download or view your README", Download]
  ] as const;
  return <section className="panel feature-panel"><PanelTitle title="Features" /> <div className="feature-grid">{features.map(([title, detail, Icon]) => <div className="feature-item" key={title}><Icon size={24} /><span><strong>{title}</strong><small>{detail}</small></span></div>)}</div></section>;
}

function PreviewOnly({ snapshot, analysis, preview, markdown, onCopy, onDownload, copied }: { snapshot: ProjectSnapshot | null; analysis: AnalysisResult | null; preview: React.ReactNode; markdown: string; onCopy: () => void; onDownload: () => void; copied: boolean }) {
  const detail = analysis ? `${analysis.projectType} - ${analysis.techStack.join(", ") || "General project"}` : "Generate a README to see the preview.";
  return <section className="panel page-panel"><PanelTitle title="Preview" detail={detail} />{snapshot && <p className="meta-line">Source: {snapshot.source} - {snapshot.files.length} files scanned - Heuristic generator</p>}{preview}<div className="preview-actions left"><button onClick={onCopy} disabled={!markdown}><Copy size={17} /> {copied ? "Copied" : "Copy markdown"}</button><button className="primary" onClick={onDownload} disabled={!markdown}><Download size={17} /> Download README.md</button></div></section>;
}

function HistoryPanel({ entries, onRestore, onClear }: { entries: HistoryEntry[]; onRestore: (entry: HistoryEntry) => void; onClear: () => void }) {
  return <section className="panel page-panel"><div className="split-title"><PanelTitle title="History" detail="Recent generated READMEs are stored locally in this browser." /> <button onClick={onClear} disabled={!entries.length}>Clear</button></div><div className="history-list">{entries.length ? entries.map((entry) => <button key={entry.id} onClick={() => onRestore(entry)}><strong>{entry.name}</strong><small>{entry.source} - {new Date(entry.createdAt).toLocaleString()}</small></button>) : <p className="empty-state">No README history yet.</p>}</div></section>;
}

function AboutPanel() {
  return (
    <section className="panel page-panel">
      <PanelTitle title="About" detail="A privacy-first README generator for developers." />
      <p className="about-copy">This tool reads local project files in your browser or fetches metadata from public GitHub repositories. It analyzes the project structure locally, then generates a polished README with heuristic rules based on dependencies, scripts, and detected features.</p>

      <h3>Why this is different</h3>
      <p className="about-copy">Many README generators require you to fill the same fields manually. This generator minimizes manual input by using repository metadata and folder structure to infer meaningful sections automatically — it detects packages, scripts, entry points, tech stack, and likely demos so the README is tailored to your project.</p>

      <h3>Features</h3>
      <ul className="about-list">
        <li>Automatic tech stack and dependency detection from package files and imports.</li>
        <li>Extraction of install, run, build, and test commands when available.</li>
        <li>Optional Live Demo and Video Demo link support for clearer examples.</li>
        <li>Multiple templates to control verbosity and section inclusion.</li>
        <li>Local-first analysis that keeps your files private when scanning locally.</li>
      </ul>

      <h3>Security & Privacy</h3>
      <p className="about-copy">When scanning local folders the analysis runs entirely in your browser and no files are uploaded. Public GitHub scans only fetch publicly available repository metadata and files. The app includes network timeouts and scan cooldowns to reduce abusive requests.</p>

      <p className="about-copy note">NOTE: Kindly check the readme and modify it as per your need because it can make mistakes.</p>
    </section>
  );
}

function FullscreenPreview({ markdown, onClose }: { markdown: string; onClose: () => void }) {
  return <div className="modal-backdrop"><section className="modal"><button className="icon-button modal-close" onClick={onClose} aria-label="Close full screen preview">x</button><ReadmePreview markdown={markdown} /></section></div>;
}

function ReadmePreview({ markdown }: { markdown: string }) {
  if (!markdown) return <div className="readme-preview empty-preview">Your README preview will appear here after generation.</div>;
  return <div className="readme-preview rendered-readme">{renderMarkdown(markdown)}</div>;
}

export default App;


