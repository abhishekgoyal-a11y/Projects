import { describe, expect, it } from "vitest";
import { generateReadme } from "./generator";
import type { AnalysisResult } from "./types";

const analysis: AnalysisResult = {
  projectName: "github-readme-generator",
  description: "Creates README files.",
  projectType: "Frontend web application",
  techStack: ["React", "TypeScript", "Vite"],
  dependencies: { production: ["react"], development: ["vite", "vitest"] },
  features: ["Smart Project Analysis"],
  scripts: { dev: "vite" },
  entryPoints: ["src/main.tsx"],
  packageManager: "npm",
  license: "MIT",
  hasTests: true,
  hasEnvExample: false,
  installCommands: ["npm install"],
  runCommands: ["npm run dev"],
  folderStructure: ["src/", "package.json"],
  projectTree: "github-readme-generator/\nsrc/\n  main.tsx\npackage.json",
  supportedTechnologies: ["React", "TypeScript", "Vite"],
  complexityScore: 42,
  warnings: []
};

const qrAnalysis: AnalysisResult = {
  projectName: "qr-generator",
  description: "A React and TypeScript-based QR code generator supporting multiple content formats, batch exports, and client-side validation.",
  projectType: "Frontend web application",
  techStack: ["React", "TypeScript", "Vite", "Vitest"],
  dependencies: { production: ["react", "qrcode", "jspdf", "jszip"], development: ["vite", "vitest", "typescript", "@testing-library/react", "@testing-library/jest-dom", "jsdom"] },
  features: ["Automated tests", "Icon-rich interface"],
  scripts: { dev: "vite", build: "tsc -b && vite build", preview: "vite preview", test: "vitest run" },
  entryPoints: ["src/App.tsx", "src/main.tsx"],
  packageManager: "npm",
  license: "MIT",
  hasTests: true,
  hasEnvExample: false,
  installCommands: ["npm install"],
  runCommands: ["npm run dev", "npm run build", "npm run preview", "npm run test"],
  folderStructure: ["public/", "src/"],
  projectTree: [
    "QR_Code_Generator/",
    "├── public/",
    "├── src/",
    "│   ├── App.tsx",
    "│   ├── main.tsx",
    "│   ├── styles.css",
    "│   ├── lib/",
    "│   │   ├── content.ts",
    "│   │   ├── qr.ts",
    "│   │   └── validation.ts",
    "│   ├── test/",
    "│   │   └── setup.ts",
    "│   └── utils/",
    "│       ├── content.test.ts",
    "│       ├── content.ts",
    "│       ├── qr.ts",
    "│       ├── validation.test.ts",
    "│       └── validation.ts",
    "├── index.html",
    "├── package.json",
    "├── tsconfig.app.json",
    "├── tsconfig.json",
    "├── tsconfig.node.json",
    "└── vite.config.ts"
  ].join("\n"),
  supportedTechnologies: ["React", "TypeScript", "Vite", "Vitest", "qrcode", "jsPDF", "JSZip"],
  complexityScore: 78,
  warnings: []
};

const blogAnalysis: AnalysisResult = {
  projectName: "ai-blog-writer",
  description: "An AI-powered long-form blog generation system built using LangGraph, Groq LLMs, Tavily Search, and Streamlit.",
  projectType: "Python AI workflow application",
  techStack: ["Python", "LangGraph", "LangChain", "Groq API", "Tavily Search API", "Streamlit", "Pydantic", "Markdown", "python-dotenv"],
  dependencies: { production: ["langgraph", "langchain", "groq", "streamlit", "tavily-python", "pydantic", "python-dotenv", "markdown"], development: [] },
  features: [
    "Multi-agent workflow orchestration",
    "Graph-based execution flow",
    "Prompt engineering layer",
    "External search tool integration",
    "Structured schema and state management",
    "Persistent generated content storage",
    "Publication-style frontend",
    "Research-backed content discovery",
    "AI content generation pipeline",
    "Streamlit interface",
    "Groq LLM integration",
    "Environment-based configuration"
  ],
  scripts: {},
  entryPoints: ["frontend.py", "main.py"],
  packageManager: "pip",
  license: null,
  hasTests: false,
  hasEnvExample: true,
  installCommands: ["python -m venv venv", "source venv/bin/activate", "pip install -r requirements.txt"],
  runCommands: ["streamlit run frontend.py"],
  folderStructure: ["agents/", "generated_blogs/", "models/", "prompts/", "tools/", "utils/", "workflow/"],
  projectTree: [
    "ai-blog-writer/",
    "└── ai-blog-writer/",
    "    ├── agents/",
    "    │   ├── editor_agent.py",
    "    │   ├── orchestrator_agent.py",
    "    │   ├── research_agent.py",
    "    │   ├── router_agent.py",
    "    │   └── writer_agent.py",
    "    ├── generated_blogs/",
    "    │   └── example.md",
    "    ├── models/",
    "    │   ├── schemas.py",
    "    │   └── state.py",
    "    ├── prompts/",
    "    │   ├── editor_prompt.py",
    "    │   ├── orchestrator_prompt.py",
    "    │   ├── research_prompt.py",
    "    │   ├── router_prompt.py",
    "    │   └── writer_prompt.py",
    "    ├── tools/",
    "    │   └── web_search.py",
    "    ├── utils/",
    "    │   └── config.py",
    "    ├── workflow/",
    "    │   └── blog_workflow.py",
    "    ├── .env",
    "    ├── frontend.py",
    "    ├── main.py",
    "    ├── README.md",
    "    └── requirements.txt"
  ].join("\n"),
  supportedTechnologies: ["Python", "LangGraph", "LangChain", "Groq API", "Tavily Search API", "Streamlit", "Pydantic", "Markdown", "python-dotenv"],
  complexityScore: 88,
  warnings: [],
  liveDemoUrl: "https://ai-blogwriter.streamlit.app/",
  videoDemoUrl: "https://github.com/user-attachments/assets/fb6747c0-5609-4a6e-9abb-a4884e281a41"
};

describe("generateReadme", () => {
  it("creates markdown with core sections", () => {
    const markdown = generateReadme(analysis, { template: "modern", includeBadges: true, includeEmojis: false, includeStructure: true });
    expect(markdown).toContain("# Github Readme Generator");
    expect(markdown).toContain("## Overview");
    expect(markdown).toContain("## Features");
    expect(markdown).toContain("## Functionalities");
    expect(markdown).toContain("## Security Features");
    expect(markdown).toContain("## Tech Stack");
    expect(markdown).toContain("### Frontend");
    expect(markdown).toContain("### Deployment");
    expect(markdown).toContain("## Installation");
    expect(markdown).toContain("## Usage");
    expect(markdown).toContain("## Workflow / Architecture");
    expect(markdown).toContain("## Project Structure");
    expect(markdown).toContain("## Future Improvements");
    expect(markdown).toContain("## Contribution");
    expect(markdown).toContain("```bash");
    expect(markdown).toContain("npm run dev");
    expect(markdown).not.toContain("## Live Demo");
    expect(markdown).not.toContain("## Video Demo");
  });

  it("generates a richer QR-style README with the requested structure", () => {
    const markdown = generateReadme(qrAnalysis, { template: "modern", includeBadges: true, includeEmojis: false, includeStructure: true });

    expect(markdown).toContain("# QR Generator");
    expect(markdown).toContain("## Overview");
    expect(markdown).toContain("## Features");
    expect(markdown).toContain("## Functionalities");
    expect(markdown).toContain("## Security Features");
    expect(markdown).toContain("### Input Validation and Sanitization");
    expect(markdown).toContain("### Privacy Protection");
    expect(markdown).toContain("## Tech Stack");
    expect(markdown).toContain("### Utilities");
    expect(markdown).toContain("## Installation");
    expect(markdown).toContain("## Usage");
    expect(markdown).toContain("## Workflow / Architecture");
    expect(markdown).toContain("## Project Structure");
    expect(markdown).toContain("## Testing");
    expect(markdown).toContain("## Performance Optimizations");
    expect(markdown).toContain("## Future Improvements");
    expect(markdown).toContain("├── src/");
    expect(markdown).toContain("└── vite.config.ts");
    expect(markdown).toContain("jsPDF");
    expect(markdown).toContain("JSZip");
    expect(markdown).not.toContain("## Live Demo");
    expect(markdown).not.toContain("## Video Demo");
  });

  it("generates a detailed AI blog writer README with demo links and richer sections", () => {
    const markdown = generateReadme(blogAnalysis, { template: "modern", includeBadges: false, includeEmojis: false, includeStructure: true });

    expect(markdown).toContain("# AI Blog Writer");
    expect(markdown).toContain("## Overview");
    expect(markdown).toContain("## Live Demo");
    expect(markdown).toContain("https://ai-blogwriter.streamlit.app/");
    expect(markdown).toContain("## Video Demo");
    expect(markdown).toContain("Multi-agent orchestration");
    expect(markdown).toContain("## Features");
    expect(markdown).toContain("## Functionalities");
    expect(markdown).toContain("## Security Features");
    expect(markdown).toContain("## Tech Stack");
    expect(markdown).toContain("### Frontend");
    expect(markdown).toContain("## Testing");
    expect(markdown).toContain("### Utilities");
    expect(markdown).toContain("### Deployment");
    expect(markdown).toContain("## Installation");
    expect(markdown).toContain("## Usage");
    expect(markdown).toContain("streamlit run frontend.py");
    expect(markdown).toContain("## Workflow / Architecture");
    expect(markdown).toContain("## Project Structure");
    expect(markdown).toContain("agents/");
    expect(markdown).toContain("generated_blogs/");
    expect(markdown).toContain("workflow/");
    expect(markdown).toContain("## Testing");
    expect(markdown).toContain("## Future Improvements");
    expect(markdown).not.toContain("## License");
  });

  it("supports detailed template extras", () => {
    const markdown = generateReadme(analysis, { template: "detailed", includeBadges: false, includeEmojis: false, includeStructure: false });
    expect(markdown).toContain("## Quality Notes");
    expect(markdown).toContain("42/100");
  });

  it("does not invent license or empty command sections", () => {
    const markdown = generateReadme({
      ...analysis,
      license: null,
      installCommands: [],
      runCommands: [],
      scripts: {}
    }, { template: "modern", includeBadges: true, includeEmojis: false, includeStructure: true });

    expect(markdown).not.toContain("MIT");
    expect(markdown).not.toContain("## Installation");
    expect(markdown).not.toContain("## Usage");
    expect(markdown).not.toContain("## License");
  });
});

