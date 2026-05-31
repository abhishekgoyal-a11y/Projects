const TOKEN_KEY = "ai_workout_planner_token";
const EMAIL_KEY = "ai_workout_planner_email";

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredEmail(): string | null {
  return localStorage.getItem(EMAIL_KEY);
}

export function setAuth(token: string, email: string): void {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(EMAIL_KEY, email);
}

export function clearAuth(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(EMAIL_KEY);
}

export function isLoggedIn(): boolean {
  return Boolean(getToken());
}

export function authHeaders(): HeadersInit {
  const token = getToken();
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}
export function getAuth() {

  const token = localStorage.getItem("token");

  const email = localStorage.getItem("email");

  if (!token || !email) {
    return null;
  }

  return {
    token,
    email,
  };
}