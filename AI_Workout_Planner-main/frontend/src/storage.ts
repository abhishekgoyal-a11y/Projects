import type { FormState } from "./components/WorkoutForm";
import type { WorkoutPlan } from "./types";

const SAVED_PLANS_KEY = "ai_workout_planner_saved_plans";
const HISTORY_KEY = "ai_workout_planner_history";

export interface SavedPlanRecord {
  id: string;
  name: string;
  savedAt: string;
  profile: FormState;
  plan: WorkoutPlan;
}

export interface WorkoutLogEntry {
  id: string;
  completedAt: string;
  day: number;
  dayLabel: string;
  planName?: string;
}

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

export function loadSavedPlans(): SavedPlanRecord[] {
  return readJson<SavedPlanRecord[]>(SAVED_PLANS_KEY, []);
}

export function savePlan(
  name: string,
  profile: FormState,
  plan: WorkoutPlan,
): SavedPlanRecord {
  const record: SavedPlanRecord = {
    id: crypto.randomUUID(),
    name,
    savedAt: new Date().toISOString(),
    profile,
    plan,
  };
  const all = [record, ...loadSavedPlans()].slice(0, 20);
  writeJson(SAVED_PLANS_KEY, all);
  return record;
}

export function deleteSavedPlan(id: string): void {
  writeJson(
    SAVED_PLANS_KEY,
    loadSavedPlans().filter((p) => p.id !== id),
  );
}

export function loadHistory(): WorkoutLogEntry[] {
  return readJson<WorkoutLogEntry[]>(HISTORY_KEY, []);
}

export function logWorkout(entry: Omit<WorkoutLogEntry, "id" | "completedAt">): WorkoutLogEntry {
  const record: WorkoutLogEntry = {
    ...entry,
    id: crypto.randomUUID(),
    completedAt: new Date().toISOString(),
  };
  const all = [record, ...loadHistory()].slice(0, 100);
  writeJson(HISTORY_KEY, all);
  return record;
}

export function clearHistory(): void {
  writeJson(HISTORY_KEY, []);
}

export function computeStreak(logs: WorkoutLogEntry[]): number {
  if (logs.length === 0) return 0;

  const dates = new Set(
    logs.map((l) => l.completedAt.slice(0, 10)),
  );

  let streak = 0;
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);

  while (true) {
    const key = cursor.toISOString().slice(0, 10);
    if (dates.has(key)) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}
