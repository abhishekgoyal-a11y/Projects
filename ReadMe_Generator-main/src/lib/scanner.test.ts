import { describe, expect, it } from "vitest";
import { parseGitHubUrl, shouldIgnorePath, shouldReadFile } from "./scanner";

describe("scanner helpers", () => {
  it("parses public GitHub repository URLs", () => {
    expect(parseGitHubUrl("https://github.com/openai/openai-node")).toEqual({ owner: "openai", repo: "openai-node", branch: undefined });
    expect(parseGitHubUrl("https://github.com/openai/openai-node/tree/main")).toEqual({ owner: "openai", repo: "openai-node", branch: "main" });
  });

  it("filters noisy paths and oversized files", () => {
    expect(shouldIgnorePath("node_modules/react/index.js")).toBe(true);
    expect(shouldReadFile("package.json", 1000)).toBe(true);
    expect(shouldReadFile("src/App.tsx", 121_000)).toBe(false);
    expect(shouldReadFile("agents/writer_agent.py", 1000)).toBe(true);
  });
});

