import type { WorkoutPlan } from "./types";

export function planToMarkdown(plan: WorkoutPlan, planName?: string): string {
  const lines: string[] = [
    `# ${planName ?? "Workout Plan"}`,
    "",
    `**Goal:** ${plan.goal}`,
    `**Days/week:** ${plan.days_per_week}`,
    `**Split:** ${plan.split_type}`,
    `**Level:** ${plan.level}`,
    "",
    "---",
    "",
  ];

  for (const day of plan.weekly_plan) {
    lines.push(`## ${day.label}`);
    lines.push(`*Focus: ${day.focus}*`);
    lines.push("");
    for (const ex of day.exercises) {
      lines.push(
        `- **${ex.name}** — ${ex.sets} × ${ex.reps}, rest ${ex.rest_seconds}s`,
      );
    }
    lines.push(`- Rest guidance: ${day.rest_guidance}`);
    lines.push("");
  }

  return lines.join("\n");
}

export function downloadPlan(plan: WorkoutPlan, planName?: string): void {
  const markdown = planToMarkdown(plan, planName);
  const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${(planName ?? "workout-plan").replace(/\s+/g, "-").toLowerCase()}.md`;
  anchor.click();
  URL.revokeObjectURL(url);
}
