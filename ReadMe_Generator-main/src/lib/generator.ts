import type { AnalysisResult, GeneratorSettings } from "./types";

function titleCase(value: string): string {
  const acronyms = new Map([
    ["ai", "AI"],
    ["api", "API"],
    ["ci", "CI"],
    ["cd", "CD"],
    ["css", "CSS"],
    ["csv", "CSV"],
    ["db", "DB"],
    ["dev", "Dev"],
    ["docker", "Docker"],
    ["html", "HTML"],
    ["http", "HTTP"],
    ["https", "HTTPS"],
    ["id", "ID"],
    ["img", "Img"],
    ["js", "JS"],
    ["json", "JSON"],
    ["jwt", "JWT"],
    ["llm", "LLM"],
    ["ml", "ML"],
    ["pdf", "PDF"],
    ["qr", "QR"],
    ["sdk", "SDK"],
    ["sql", "SQL"],
    ["svg", "SVG"],
    ["ts", "TS"],
    ["ui", "UI"],
    ["url", "URL"],
    ["ux", "UX"],
    ["zip", "ZIP"]
  ]);

  return value
    .replace(/[-_]+/g, " ")
    .split(" ")
    .map((part) => acronyms.get(part.toLowerCase()) || part.replace(/^\w/, (letter) => letter.toUpperCase()))
    .join(" ");
}

function section(title: string, body: string): string {
  return body.trim() ? `## ${title}\n\n${body.trim()}\n` : "";
}

function list(items: string[]): string {
  return items.length ? items.map((item) => `- ${item}`).join("\n") : "- To be documented";
}

function codeBlock(lines: string[] | string, language = "bash"): string {
  const content = Array.isArray(lines) ? lines.join("\n") : lines;
  return content.trim() ? `\`\`\`${language}\n${content}\n\`\`\`` : "";
}

function compact(items: Array<string | false | null | undefined>): string[] {
  return Array.from(new Set(items.filter(Boolean) as string[]));
}

function dependencySet(analysis: AnalysisResult): Set<string> {
  return new Set([...analysis.dependencies.production, ...analysis.dependencies.development].map((item) => item.toLowerCase()));
}

function treeText(analysis: AnalysisResult): string {
  return analysis.projectTree || analysis.folderStructure.join("\n");
}

function detectTestModules(tree: string): string[] {
  return compact(Array.from(tree.matchAll(/(?:^|\/)([\w-]+)\.(?:test|spec)\.[tj]sx?/g)).map((match) => match[1]).map((name) => titleCase(name)));
}

function inferFeatureBuckets(analysis: AnalysisResult): { core: string[]; advanced: string[]; security: string[]; performance: string[] } {
  const deps = dependencySet(analysis);
  const tree = treeText(analysis).toLowerCase();
  const projectLabel = analysis.projectType.toLowerCase();
  const hasQrModule = tree.includes("qr.ts") || tree.includes("qr.tsx") || tree.includes("qrcode") || deps.has("qrcode");
  const hasValidationModule = tree.includes("validation.ts") || tree.includes("validation.tsx") || tree.includes("validate") || deps.has("zod") || deps.has("yup") || deps.has("pydantic");
  const hasContentModule = tree.includes("content.ts") || tree.includes("content.tsx") || tree.includes("payload");
  const hasExportDeps = deps.has("jspdf") || deps.has("jszip");
  const hasBatchSignals = /batch|bulk/.test(tree) || deps.has("jszip");
  const hasComponentTree = /components\//.test(tree) || /component\//.test(tree);
  const hasTestSetup = tree.includes("test/setup.ts") || tree.includes("test/setup.tsx") || tree.includes("test/setup.js") || tree.includes("test/setup.jsx");
  const hasFrontendStack = /react|vue|angular|next|vite/.test(analysis.techStack.join(" ").toLowerCase());

  const core = compact([
    ...analysis.features,
    hasQrModule && "QR code generation pipeline",
    hasContentModule && "Multiple QR payload formats",
    hasValidationModule && "Client-side input validation",
    hasExportDeps && "Export pipeline for generated assets",
    deps.has("qrcode") && "Renderable QR output from structured input",
    deps.has("jspdf") && "PDF export support",
    deps.has("jszip") && "ZIP archive export",
    hasBatchSignals && "Batch generation workflow",
    hasComponentTree && "Reusable component architecture",
    hasFrontendStack && "Fast client-side rendering",
    deps.has("typescript") && "Type-safe project structure",
    analysis.hasTests && "Automated regression coverage"
  ]).slice(0, 10);

  const advanced = compact([
    hasComponentTree && "Component-driven UI and utility layers",
    hasTestSetup && "Shared test setup for browser-like checks",
    hasExportDeps && "Multi-format asset export flow",
    hasBatchSignals && "Bulk output handling",
    deps.has("react") && deps.has("vite") && "Local-first preview and build workflow",
    deps.has("react-router-dom") && "Client-side navigation layer"
  ]).slice(0, 5);

  const security = compact([
    hasValidationModule && "Input validation and sanitization",
    hasValidationModule && "Malformed payload filtering before generation",
    hasFrontendStack && "Client-side processing keeps data local to the browser",
    hasExportDeps && "Safe file generation without server-side upload handling"
  ]).slice(0, 4);

  const performance = compact([
    hasFrontendStack && "Vite-backed fast local builds",
    hasFrontendStack && "Minimal runtime overhead from client-side rendering",
    hasExportDeps && "Efficient document and archive export pipeline",
    hasBatchSignals && "Batch output is handled locally to avoid network latency",
    projectLabel.includes("frontend") && "Lean UI rendering path"
  ]).slice(0, 5);

  return { core, advanced, security, performance };
}

function buildTechStackSection(analysis: AnalysisResult): string {
  const deps = dependencySet(analysis);
  const production = analysis.dependencies.production;
  const development = analysis.dependencies.development;

  const frontend = compact([
    analysis.techStack.includes("React") && "React",
    analysis.techStack.includes("React DOM") && "React DOM",
    analysis.techStack.includes("Vite") && "Vite",
    analysis.techStack.includes("TypeScript") && "TypeScript",
    deps.has("react-router-dom") && "React Router DOM",
    deps.has("tailwindcss") && "Tailwind CSS",
    deps.has("streamlit") && "Streamlit",
    deps.has("markdown") && "Markdown rendering"
  ]);

  const backend = compact([
    analysis.techStack.includes("Node.js") && "Node.js runtime",
    analysis.techStack.includes("Express") && "Express",
    analysis.techStack.includes("Fastify") && "Fastify",
    analysis.techStack.includes("Python") && "Python",
    deps.has("langgraph") && "LangGraph",
    deps.has("langchain") && "LangChain",
    deps.has("langchain-community") && "LangChain Community",
    deps.has("groq") && "Groq API",
    (deps.has("tavily-python") || deps.has("tavily")) && "Tavily Search API",
    deps.has("pydantic") && "Pydantic",
    deps.has("python-dotenv") && "python-dotenv",
    analysis.techStack.includes("Flutter") && "Flutter",
    analysis.techStack.includes("Dart") && "Dart"
  ]);

  const testing = compact([
    deps.has("vitest") && "Vitest",
    analysis.techStack.includes("Vitest") && "Vitest",
    analysis.techStack.includes("Jest") && "Jest",
    development.some((item) => item.includes("@testing-library")) && "Testing Library",
    development.some((item) => item === "jsdom") && "jsdom",
    deps.has("playwright") && "Playwright"
  ]);

  const utilities = compact([
    deps.has("qrcode") && "qrcode",
    deps.has("jspdf") && "jsPDF",
    deps.has("jszip") && "JSZip",
    deps.has("markdown") && "Markdown",
    deps.has("lucide-react") && "lucide-react",
    deps.has("zod") && "Zod",
    deps.has("yup") && "Yup"
  ]);

  const deployment = compact([
    analysis.packageManager ? `${analysis.packageManager} package manager` : null,
    analysis.techStack.includes("Vite") && "Vite build pipeline",
    deps.has("docker") && "Docker"
  ]);

  const sections = compact([
    frontend.length ? `### Frontend\n\n${list(frontend)}\n` : "",
    backend.length ? `### Backend\n\n${list(backend)}\n` : "",
    testing.length ? `### Testing\n\n${list(testing)}\n` : "",
    utilities.length ? `### Utilities\n\n${list(utilities)}\n` : "",
    deployment.length ? `### Deployment\n\n${list(deployment)}\n` : ""
  ]);

  return sections.join("\n");
}

function buildWorkflowSection(analysis: AnalysisResult): string {
  const deps = dependencySet(analysis);
  const tree = treeText(analysis).toLowerCase();
  const sentences = compact([
    deps.has("langgraph") || /agents\//i.test(tree) || /workflow\//i.test(tree)
      ? "The generation pipeline is organized as a multi-step graph that can route requests through planner, researcher, writer, editor, and output stages."
      : null,
    deps.has("streamlit") || /frontend\.py$/i.test(tree)
      ? "A Streamlit frontend exposes the workflow through a simple interface for topic entry, execution, preview, and download." 
      : null,
    deps.has("groq")
      ? "Groq supplies the model inference layer so the writing pass stays fast enough for iterative blog generation."
      : null,
    deps.has("tavily-python") || deps.has("tavily")
      ? "Tavily search feeds the research step with fresh evidence before the long-form draft is produced."
      : null,
    /generated_blogs\//i.test(tree)
      ? "Completed articles are persisted as markdown files inside the generated_blogs folder for later reuse."
      : null,
    /prompts\//i.test(tree)
      ? "Separate prompt modules keep each stage focused on its own role, which makes the workflow easier to tune and extend."
      : null,
    /models\//i.test(tree)
      ? "Schemas and workflow state files keep the handoff between stages structured and predictable."
      : null,
    /validation/.test(tree) || deps.has("zod") || deps.has("yup")
      ? "Input data is validated before generation so malformed entries are filtered early in the workflow."
      : null,
    /qr|qrcode/.test(tree) || deps.has("qrcode")
      ? "Structured content is converted into QR output through a dedicated generation layer."
      : null,
    deps.has("jspdf") || deps.has("jszip")
      ? "Export helpers package the generated assets into downloadable formats such as documents or archives."
      : null,
    analysis.hasTests
      ? "The codebase keeps generator and utility logic testable so regressions can be caught quickly."
      : null
  ]);

  return sentences.length ? sentences.join("\n\n") : "";
}

function buildFunctionalitySection(analysis: AnalysisResult): string {
  const deps = dependencySet(analysis);
  const rows = compact([
    analysis.runCommands.length ? "Command discovery for development, build, preview, and test workflows." : null,
    analysis.entryPoints.length ? `Application entry points resolved from ${analysis.entryPoints.slice(0, 3).join(", ")}.` : null,
    deps.has("qrcode") ? "QR generation pipeline for structured content inputs." : null,
    /content\.(ts|tsx|js|jsx|dart)$/i.test(treeText(analysis)) ? "Multiple payload formats organized in dedicated content modules." : null,
    deps.has("jspdf") ? "PDF export path for generated output." : null,
    deps.has("jszip") ? "ZIP archive packaging for batched downloads." : null,
    /components\//i.test(treeText(analysis)) ? "Reusable UI component layout." : null,
    analysis.hasTests ? "Regression test coverage for core utilities and rendering behavior." : null,
    deps.has("langgraph") || /agents\//i.test(treeText(analysis)) ? "Multi-agent orchestration across planner, writer, editor, and router stages." : null,
    deps.has("groq") ? "Groq-backed content generation for fast LLM inference." : null,
    deps.has("tavily-python") || deps.has("tavily") ? "Tavily-powered web search for research-backed generation." : null,
    deps.has("streamlit") ? "Streamlit-based interface for interactive article creation." : null,
    /generated_blogs\//i.test(treeText(analysis)) ? "Automatic markdown persistence for generated content." : null,
    /prompts\//i.test(treeText(analysis)) ? "Dedicated prompt files for each workflow stage." : null,
    /models\//i.test(treeText(analysis)) ? "Structured schemas and workflow state management." : null,
    /workflow\//i.test(treeText(analysis)) ? "Explicit workflow graph for step-by-step execution." : null
  ]);

  return rows.length ? list(rows) : "";
}

function buildTestingSection(analysis: AnalysisResult): string {
  const deps = dependencySet(analysis);
  const modules = detectTestModules(treeText(analysis));
  const bullets = compact([
    deps.has("vitest") ? "Vitest covers the main analysis and generation paths." : null,
    deps.has("@testing-library/react") || deps.has("@testing-library/jest-dom")
      ? "Testing Library supports component-level rendering checks."
      : null,
    modules.length ? `Test files target ${modules.join(", ")} modules.` : null,
    analysis.hasTests ? "Regression coverage exists for the most important utility flows." : null
    , deps.has("streamlit") ? "Smoke-test the Streamlit UI by running the app and exercising the generation flow end to end." : null,
    deps.has("langgraph") ? "Validate each graph stage independently to confirm routing and state handoffs." : null,
    deps.has("pydantic") ? "Feed malformed inputs through the schemas to verify validation and sanitization behavior." : null
  ]);

  return bullets.length ? list(bullets) : "";
}

function buildSecuritySection(analysis: AnalysisResult): string {
  const buckets = inferFeatureBuckets(analysis);
  if (!buckets.security.length) return "";

  const inputBullets = compact(buckets.security.filter((item) => /validation|payload|filtering/i.test(item)));
  const privacyBullets = compact(buckets.security.filter((item) => /browser|local|upload/i.test(item)));

  return [
    inputBullets.length ? `### Input Validation and Sanitization\n\n${list(inputBullets)}\n` : "",
    privacyBullets.length ? `### Privacy Protection\n\n${list(privacyBullets)}\n` : ""
  ].filter(Boolean).join("\n");
}

function buildFutureImprovements(analysis: AnalysisResult): string {
  const bullets = compact([
    "Add a live demo if a hosted deployment becomes available.",
    analysis.hasEnvExample ? null : "Document environment variables if the app starts relying on external services.",
    "Expand test coverage for edge cases and export flows.",
    "Add more usage examples for the most important supported formats.",
    "Document any advanced workflows or limitations as the project grows."
  ]).slice(0, 5);

  return list(bullets);
}

function buildDemoSection(title: string, url?: string): string {
  if (!url) return "";
  return `## ${title}\n\nTry it here - ${url}\n`;
}

function buildFeaturesSection(analysis: AnalysisResult, buckets: { core: string[]; advanced: string[]; security: string[]; performance: string[] }): string {
  const summary = compact([
    `The repository is organized around ${analysis.projectType.toLowerCase()} capabilities and the detected stack of ${analysis.techStack.slice(0, 5).join(", ") || "project-specific technologies"}.`,
    buckets.core.length ? `Its main surface combines ${buckets.core.slice(0, 4).join(", ")} and other supporting behaviors surfaced from the folder structure.` : null,
    buckets.advanced.length ? `The codebase also includes implementation details such as ${buckets.advanced.slice(0, 3).join(", ")}.` : null,
    buckets.performance.length ? `Performance-sensitive paths focus on ${buckets.performance.slice(0, 3).join(", ")} to keep the project responsive.` : null
  ]).join(" ");

  const blocks = compact([
    summary ? `${summary}\n` : "",
    buckets.core.length ? `### Core Functionalities\n\n${list(buckets.core)}\n` : "",
    buckets.advanced.length ? `### Advanced Features\n\n${list(buckets.advanced)}\n` : "",
    buckets.performance.length ? `### Performance Features\n\n${list(buckets.performance)}\n` : ""
  ]);

  return blocks.join("\n");
}

export function generateReadme(analysis: AnalysisResult, settings: GeneratorSettings): string {
  const name = titleCase(analysis.projectName);
  const tree = treeText(analysis);
  const buckets = inferFeatureBuckets(analysis);

  const overviewWords = compact([
    analysis.description || `${name} is a ${analysis.projectType.toLowerCase()} built from the detected repository structure.`,
    `It uses ${analysis.techStack.slice(0, 4).join(", ") || "the detected project stack"} to keep the implementation focused and maintainable.`,
    buckets.core.length ? `Detected capabilities include ${buckets.core.slice(0, 4).join(", ")}.` : null
  ]);
  const overview = overviewWords.join(" ");

  const install = analysis.installCommands.length
    ? `Install the detected dependencies before running the project.\n\n${codeBlock(analysis.installCommands, "bash")}`
    : "";

  const usageParts = [
    analysis.runCommands.length ? codeBlock(analysis.runCommands, "bash") : "",
    Object.keys(analysis.scripts).length
      ? `### Available Scripts\n\n${codeBlock(Object.entries(analysis.scripts).map(([scriptName, command]) => `${scriptName}: ${command}`), "bash")}`
      : ""
  ].filter(Boolean);
  const usage = usageParts.join("\n\n");

  const featureSections = buildFeaturesSection(analysis, buckets);

  const techStack = buildTechStackSection(analysis);
  const demoSection = buildDemoSection("Live Demo", analysis.liveDemoUrl);
  const videoSection = buildDemoSection("Video Demo", analysis.videoDemoUrl);
  const security = buildSecuritySection(analysis);
  const functionalities = buildFunctionalitySection(analysis);
  const workflow = buildWorkflowSection(analysis);
  const testing = buildTestingSection(analysis);
  const futureImprovements = buildFutureImprovements(analysis);
  const structure = settings.includeStructure ? codeBlock(tree || analysis.folderStructure.join("\n"), "bash") : "";

  const core = [
    `# ${name}`,
    section("Overview", overview),
    demoSection,
    videoSection,
    featureSections ? `## Features\n\n${featureSections}` : "",
    functionalities ? section("Functionalities", functionalities) : "",
    security ? `## Security Features\n\n${security}` : "",
    techStack ? section("Tech Stack", techStack) : "",
    install ? section("Installation", install) : "",
    usage ? section("Usage", usage) : "",
    workflow ? section("Workflow / Architecture", workflow) : "",
    structure ? section("Project Structure", structure) : "",
    testing ? section("Testing", testing) : "",
    buckets.performance.length ? section("Performance Optimizations", list(buckets.performance)) : "",
    section("Future Improvements", futureImprovements),
    settings.template !== "minimal" ? section("Contribution", "Contributions are welcome. Please open an issue first for major changes so the proposed work can be discussed.") : "",
    // License section intentionally omitted to avoid exposing personal names or license details
  ].filter(Boolean).join("\n");

  if (settings.template === "detailed") {
    return `${core}\n\n## Quality Notes\n\n- Project complexity score: ${analysis.complexityScore}/100\n- Tests detected: ${analysis.hasTests ? "Yes" : "No"}\n- Generated from detected repository metadata and file structure.\n`;
  }

  if (settings.template === "opensource") {
    return `${core}\n\n## Code of Conduct\n\nPlease keep discussions respectful and constructive.\n\n## Support\n\nOpen an issue with reproduction steps, expected behavior, and screenshots when helpful.\n`;
  }

  return `${core}\n`;
}

