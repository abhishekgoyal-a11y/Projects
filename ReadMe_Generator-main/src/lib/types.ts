export type Theme = "light" | "dark";
export type SourceType = "local" | "github";
export type View = "dashboard" | "generate" | "preview" | "export" | "history" | "templates" | "settings" | "about";
export type TemplateId = "modern" | "detailed" | "minimal" | "opensource";

export interface ProjectFile {
  path: string;
  name: string;
  content?: string;
  size?: number;
}

export interface ProjectSnapshot {
  source: SourceType;
  name: string;
  description?: string;
  url?: string;
  defaultBranch?: string;
  files: ProjectFile[];
  scannedAt: string;
}

export interface DependencyGroup {
  production: string[];
  development: string[];
}

export interface AnalysisResult {
  projectName: string;
  description: string;
  projectType: string;
  techStack: string[];
  dependencies: DependencyGroup;
  features: string[];
  scripts: Record<string, string>;
  entryPoints: string[];
  packageManager: string | null;
  license: string | null;
  hasTests: boolean;
  hasEnvExample: boolean;
  installCommands: string[];
  runCommands: string[];
  folderStructure: string[];
  projectTree: string;
  supportedTechnologies: string[];
  complexityScore: number;
  warnings: string[];
  liveDemoUrl?: string;
  videoDemoUrl?: string;
}

export interface GeneratorSettings {
  template: TemplateId;
  includeBadges: boolean;
  includeEmojis: boolean;
  includeStructure: boolean;
}

export interface HistoryEntry {
  id: string;
  name: string;
  source: SourceType;
  markdown: string;
  createdAt: string;
}

