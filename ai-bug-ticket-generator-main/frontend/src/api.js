const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

async function request(path, options) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json"
    },
    ...options
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}

export function generateTicket(payload) {
  return request("/api/tickets/generate", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function createJiraTicket(ticket) {
  return request("/api/tickets/create-jira", {
    method: "POST",
    body: JSON.stringify({ ticket })
  });
}
