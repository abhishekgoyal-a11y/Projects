import Groq from "groq-sdk";

const fallbackTicket = ({ logs, source, severityHint, metadata }) => ({
  title: `Investigate error in ${source}`,
  summary: `The logs contain ${metadata.errorCount} error-like entries and ${metadata.warningCount} warnings.`,
  description: [
    `Source: ${source}`,
    `Severity hint: ${severityHint}`,
    "",
    "Raw log excerpt:",
    logs.slice(0, 1800)
  ].join("\n"),
  severity: severityHint === "Auto" ? metadata.suggestedSeverity : severityHint,
  stepsToReproduce: [
    `Open or trigger the workflow handled by ${source}.`,
    "Use the same request path, payload, or user action shown in the logs.",
    "Watch the dependent services mentioned in the trace for warnings or failed calls.",
    "Repeat the action until the same error signature appears in the logs.",
    "Confirm the request ends with the same failing status or exception shown in the trace."
  ],
  expectedBehavior: "The workflow should complete without errors.",
  actualBehavior: "The logs show runtime failures or warnings.",
  labels: ["ai-generated", "log-analysis"],
  confidence: "Low",
  rootCauseHypothesis: "Groq API key is missing, so this fallback ticket was generated locally."
});

export async function generateBugTicket({ logs, source, severityHint, metadata }) {
  if (!process.env.GROQ_API_KEY) {
    return fallbackTicket({ logs, source, severityHint, metadata });
  }

  const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
  });

  const model = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";
  const completion = await groq.chat.completions.create({
    model,
    temperature: 0.2,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content:
          "You convert software logs into precise Jira bug tickets. Return valid JSON only with keys: title, summary, description, severity, stepsToReproduce, expectedBehavior, actualBehavior, labels, confidence, rootCauseHypothesis. The stepsToReproduce value must be an array of 5 to 8 detailed, action-oriented steps. Each step should be easy for a developer or QA tester to follow, mention concrete services, endpoints, functions, request IDs, user actions, or dependencies when the logs provide them, and avoid vague steps like only 'review logs'."
      },
      {
        role: "user",
        content: JSON.stringify({
          source,
          severityHint,
          metadata,
          logs
        })
      }
    ]
  });

  const content = completion.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("Groq did not return ticket content.");
  }

  return JSON.parse(content);
}
