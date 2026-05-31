import { authHeaders } from "./auth";
import type {
  CoachMessage,
  CoachResponse,
  Equipment,
  ExerciseOption,
  Goal,
  HealthResponse,
  Injury,
  NutritionAdvice,
  UserProfile,
  WorkoutPlan,
} from "./types";

const API_BASE = import.meta.env.VITE_API_URL ?? "";

export interface AuthResult {
  access_token: string;
  token_type: string;
  email: string;
}

async function parseError(res: Response, fallback: string): Promise<never> {
  const body = await res.json().catch(() => ({}));
  const detail = typeof body.detail === "string" ? body.detail : fallback;
  throw new Error(detail);
}

export async function register(
  email: string,
  password: string,
): Promise<AuthResult> {
  const res = await fetch(`${API_BASE}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) await parseError(res, "Registration failed");
  return res.json();
}

export async function login(
  email: string,
  password: string,
): Promise<AuthResult> {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) await parseError(res, "Login failed");
  return res.json();
}

export async function fetchUserPlans(): Promise<
  { id: string; name: string; saved_at: string; profile: object; plan: object }[]
> {
  const res = await fetch(`${API_BASE}/api/user/plans`, {
    headers: authHeaders(),
  });
  if (!res.ok) await parseError(res, "Failed to load plans");
  return res.json();
}

export async function createUserPlan(payload: {
  name: string;
  profile: object;
  plan: object;
}): Promise<{ id: string; name: string; saved_at: string }> {
  const res = await fetch(`${API_BASE}/api/user/plans`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(payload),
  });
  if (!res.ok) await parseError(res, "Failed to save plan");
  return res.json();
}

export async function deleteUserPlan(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/api/user/plans/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok) await parseError(res, "Failed to delete plan");
}

export async function fetchUserHistory(): Promise<
  {
    id: string;
    completed_at: string;
    day: number;
    day_label: string;
    plan_name: string | null;
  }[]
> {
  const res = await fetch(`${API_BASE}/api/user/history`, {
    headers: authHeaders(),
  });
  if (!res.ok) await parseError(res, "Failed to load history");
  return res.json();
}

export async function createUserHistoryEntry(payload: {
  day: number;
  day_label: string;
  plan_name?: string;
}): Promise<void> {
  const res = await fetch(`${API_BASE}/api/user/history`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(payload),
  });
  if (!res.ok) await parseError(res, "Failed to log workout");
}

export async function clearUserHistory(): Promise<void> {
  const res = await fetch(`${API_BASE}/api/user/history`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok) await parseError(res, "Failed to clear history");
}

export async function fetchHealth(): Promise<HealthResponse> {
  const res = await fetch(`${API_BASE}/health`);
  if (!res.ok) throw new Error("Backend is not reachable");
  return res.json();
}

export async function generatePlan(profile: UserProfile): Promise<WorkoutPlan> {
  const res = await fetch(`${API_BASE}/api/plan/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(profile),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const detail =
      typeof body.detail === "string"
        ? body.detail
        : "Failed to generate workout plan";
    throw new Error(detail);
  }

  return res.json();
}

export async function fetchExercises(
  goal: Goal,
  equipment: Equipment[],
  injuries: Injury[] = [],
): Promise<ExerciseOption[]> {
  const params = new URLSearchParams({
    goal,
    equipment: equipment.join(","),
    injuries: injuries.join(","),
  });
  const res = await fetch(`${API_BASE}/api/exercises?${params}`);
  if (!res.ok) throw new Error("Failed to load exercises");
  return res.json();
}

export async function fetchNutrition(
  profile: UserProfile,
): Promise<NutritionAdvice> {
  const res = await fetch(`${API_BASE}/api/nutrition`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(profile),
  });
  if (!res.ok) throw new Error("Failed to load nutrition advice");
  return res.json();
}

export async function adaptPlan(
  plan: WorkoutPlan,
  sessionsCompleted: number,
): Promise<WorkoutPlan> {
  const res = await fetch(`${API_BASE}/api/plan/adapt`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ plan, sessions_completed: sessionsCompleted }),
  });
  if (!res.ok) throw new Error("Failed to adapt plan");
  return res.json();
}

export async function coachChat(
  messages: CoachMessage[],
  profile?: UserProfile,
): Promise<CoachResponse> {
  const res = await fetch(`${API_BASE}/api/coach/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages, profile }),
  });
  if (!res.ok) throw new Error("Coach is unavailable");
  return res.json();
}
