import axios from "axios";

function getJiraConfig() {
  const required = ["JIRA_BASE_URL", "JIRA_EMAIL", "JIRA_API_TOKEN", "JIRA_PROJECT_KEY"];
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    const error = new Error(`Jira is not configured. Missing: ${missing.join(", ")}`);
    error.status = 400;
    throw error;
  }

  return {
    baseUrl: process.env.JIRA_BASE_URL.replace(/\/+$/, ""),
    email: process.env.JIRA_EMAIL,
    token: process.env.JIRA_API_TOKEN,
    projectKey: process.env.JIRA_PROJECT_KEY
  };
}

function toJiraLabels(labels = []) {
  const cleaned = labels
    .map((label) =>
      String(label)
        .toLowerCase()
        .replace(/[^a-z0-9_-]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 255)
    )
    .filter(Boolean);

  return Array.from(new Set(["ai-generated", "log-analysis", ...cleaned]));
}

function toAdfDescription(ticket) {
  const labels = toJiraLabels(ticket.labels);
  const text = [
    ticket.description,
    "",
    `Severity: ${ticket.severity || "Medium"}`,
    `Labels: ${labels.join(", ")}`
  ].join("\n");

  return {
    type: "doc",
    version: 1,
    content: [
      {
        type: "paragraph",
        content: [{ type: "text", text }]
      }
    ]
  };
}

function getJiraErrorMessage(error) {
  const data = error.response?.data;
  const status = error.response?.status;

  if (!data) {
    return error.message;
  }

  const messages = [
    ...(Array.isArray(data.errorMessages) ? data.errorMessages : []),
    ...Object.entries(data.errors || {}).map(([field, message]) => `${field}: ${message}`)
  ];

  if (messages.length > 0) {
    return `Jira rejected the ticket${status ? ` (${status})` : ""}: ${messages.join(" | ")}`;
  }

  return `Jira rejected the ticket${status ? ` (${status})` : ""}. Check your Jira URL, project key, issue type, and API token.`;
}

export async function createJiraIssue(ticket) {
  const config = getJiraConfig();
  const auth = Buffer.from(`${config.email}:${config.token}`).toString("base64");

  try {
    const response = await axios.post(
      `${config.baseUrl}/rest/api/3/issue`,
      {
        fields: {
          project: { key: config.projectKey },
          summary: ticket.title,
          description: toAdfDescription(ticket),
          issuetype: { name: "Bug" },
          labels: toJiraLabels(ticket.labels)
        }
      },
      {
        headers: {
          Authorization: `Basic ${auth}`,
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      }
    );

    return {
      key: response.data.key,
      url: `${config.baseUrl}/browse/${response.data.key}`
    };
  } catch (error) {
    const jiraError = new Error(getJiraErrorMessage(error));
    jiraError.status = error.response?.status || 500;
    throw jiraError;
  }
}

export async function getJiraCreateMetadata() {
  const config = getJiraConfig();
  const auth = Buffer.from(`${config.email}:${config.token}`).toString("base64");

  try {
    const response = await axios.get(`${config.baseUrl}/rest/api/3/issue/createmeta`, {
      params: {
        projectKeys: config.projectKey,
        expand: "projects.issuetypes.fields"
      },
      headers: {
        Authorization: `Basic ${auth}`,
        Accept: "application/json"
      }
    });

    const project = response.data.projects?.[0];
    return {
      projectKey: project?.key,
      projectName: project?.name,
      issueTypes: project?.issuetypes?.map((type) => type.name) || []
    }
  } catch (error) {
    const jiraError = new Error(getJiraErrorMessage(error));
    jiraError.status = error.response?.status || 500;
    throw jiraError;
  }
}
