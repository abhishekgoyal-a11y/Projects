import { describe, expect, it } from "vitest";
import { analyzeProject } from "./analyzer";
import type { ProjectSnapshot } from "./types";

function snapshot(files: ProjectSnapshot["files"]): ProjectSnapshot {
  return { source: "local", name: "demo-app", files, scannedAt: new Date().toISOString() };
}

describe("analyzeProject", () => {
  it("detects a React Vite TypeScript project", () => {
    const result = analyzeProject(snapshot([
      {
        path: "package.json",
        name: "package.json",
        content: JSON.stringify({
          name: "demo-app",
          description: "Demo description",
          license: "MIT",
          scripts: { dev: "vite", build: "tsc -b && vite build", test: "vitest run" },
          dependencies: { react: "latest", "react-dom": "latest", "lucide-react": "latest" },
          devDependencies: { vite: "latest", typescript: "latest", vitest: "latest" }
        })
      },
      { path: "src/App.tsx", name: "App.tsx", content: "export default function App() { return null }" },
      { path: "src/App.test.tsx", name: "App.test.tsx", content: "test('ok', () => {})" }
    ]));

    expect(result.projectName).toBe("demo-app");
    expect(result.techStack).toEqual(expect.arrayContaining(["React", "Vite", "TypeScript", "Vitest"]));
    expect(result.features).toContain("Automated tests");
    expect(result.runCommands).toContain("npm run dev");
    expect(result.projectTree).toContain("src/");
    expect(result.projectTree).toContain("├──");
    expect(result.projectTree).toContain("└──");
  });

  it("detects a Python AI workflow project with agent and Streamlit tooling", () => {
    const result = analyzeProject(snapshot([
      {
        path: "requirements.txt",
        name: "requirements.txt",
        content: [
          "langgraph",
          "langchain",
          "groq",
          "streamlit",
          "tavily-python",
          "pydantic",
          "python-dotenv",
          "markdown"
        ].join("\n")
      },
      {
        path: "frontend.py",
        name: "frontend.py",
        content: "import streamlit as st\n\nst.title('AI Blog Writer')"
      },
      { path: "main.py", name: "main.py", content: "from frontend import main" },
      { path: "agents/router_agent.py", name: "router_agent.py", content: "" },
      { path: "agents/writer_agent.py", name: "writer_agent.py", content: "" },
      { path: "workflow/blog_workflow.py", name: "blog_workflow.py", content: "" },
      { path: "prompts/writer_prompt.py", name: "writer_prompt.py", content: "" },
      { path: "tools/web_search.py", name: "web_search.py", content: "" },
      { path: "models/state.py", name: "state.py", content: "" },
      { path: "generated_blogs/example.md", name: "example.md", content: "# Example Blog" },
      {
        path: "README.md",
        name: "README.md",
        content: [
          "# AI Blog Writing Agent",
          "Try it here - https://ai-blogwriter.streamlit.app/",
          "Video Demo",
          "https://github.com/user-attachments/assets/fb6747c0-5609-4a6e-9abb-a4884e281a41"
        ].join("\n")
      }
    ]));

    expect(result.projectName).toBe("demo-app");
    expect(result.projectType).toBe("Python AI workflow application");
    expect(result.techStack).toEqual(expect.arrayContaining(["Python", "LangGraph", "LangChain", "Groq API", "Tavily Search API", "Streamlit", "Pydantic", "Markdown", "python-dotenv"]));
    expect(result.features).toEqual(expect.arrayContaining([
      "Schema validation",
      "Multiple QR payload formats",
      "Client-side input validation",
      "Multi-agent workflow orchestration",
      "Graph-based execution flow",
      "Prompt engineering layer",
      "External search tool integration",
      "Structured schema and state management",
      "Persistent generated content storage",
      "Research-backed content discovery",
      "AI content generation pipeline",
      "Streamlit interface",
      "Groq LLM integration",
      "Environment-based configuration"
    ]));
    expect(result.entryPoints).toEqual(expect.arrayContaining(["frontend.py", "main.py"]));
    expect(result.runCommands).toContain("streamlit run frontend.py");
    expect(result.liveDemoUrl).toBe("https://ai-blogwriter.streamlit.app/");
    expect(result.videoDemoUrl).toBe("https://github.com/user-attachments/assets/fb6747c0-5609-4a6e-9abb-a4884e281a41");
    expect(result.projectTree).toContain("agents/");
    expect(result.projectTree).toContain("generated_blogs/");
    expect(result.projectTree).toContain("workflow/");
  });

  it("detects Flutter projects without inventing Java or MIT license", () => {
    const result = analyzeProject(snapshot([
      {
        path: "pubspec.yaml",
        name: "pubspec.yaml",
        content: [
          "name: recipe_generator_foodblog",
          "description: A Flutter recipe app.",
          "dependencies:",
          "  flutter:",
          "    sdk: flutter",
          "  provider: ^6.0.0",
          "dev_dependencies:",
          "  flutter_test:",
          "    sdk: flutter"
        ].join("\n")
      },
      { path: "lib/main.dart", name: "main.dart", content: "void main() {}" },
      { path: "android/app/build.gradle", name: "build.gradle", content: "" },
      { path: "ios/Runner/AppDelegate.swift", name: "AppDelegate.swift", content: "" },
      { path: "test/widget_test.dart", name: "widget_test.dart", content: "" }
    ]));

    expect(result.projectType).toBe("Flutter cross-platform application");
    expect(result.techStack).toEqual(expect.arrayContaining(["Flutter", "Dart", "Android", "iOS"]));
    expect(result.techStack).not.toContain("Java");
    expect(result.license).toBeNull();
    expect(result.installCommands).toEqual(["flutter pub get"]);
    expect(result.runCommands).toEqual(["flutter run"]);
    expect(result.projectTree).toContain("lib/");
    expect(result.projectTree).toContain("main.dart");
    expect(result.projectTree).toContain("├──");
  });
});

