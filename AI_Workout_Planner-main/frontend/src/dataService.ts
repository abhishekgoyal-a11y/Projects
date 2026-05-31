import type { FormState } from "./components/WorkoutForm";
import {
  clearUserHistory,
  createUserHistoryEntry,
  createUserPlan,
  deleteUserPlan,
  fetchUserHistory,
  fetchUserPlans,
} from "./api";
import { isLoggedIn } from "./auth";
import { normalizeForm } from "./profile";
import type { WorkoutPlan } from "./types";
import {
  clearHistory as clearLocalHistory,
  loadHistory as loadLocalHistory,
  loadSavedPlans as loadLocalPlans,
  logWorkout as logLocalWorkout,
  savePlan as saveLocalPlan,
  deleteSavedPlan as deleteLocalPlan,
  type SavedPlanRecord,
  type WorkoutLogEntry,
} from "./storage";

export async function loadPlans(): Promise<SavedPlanRecord[]> {
  if (!isLoggedIn()) return loadLocalPlans();

  const rows = await fetchUserPlans();
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    savedAt: r.saved_at,
    profile: normalizeForm(r.profile as Partial<FormState>),
    plan: r.plan as WorkoutPlan,
  }));
}

export async function savePlanRecord(
  name: string,
  profile: FormState,
  plan: WorkoutPlan,
): Promise<void> {
  if (!isLoggedIn()) {
    saveLocalPlan(name, profile, plan);
    return;
  }
  await createUserPlan({ name, profile, plan });
}

export async function removePlan(id: string): Promise<void> {
  if (!isLoggedIn()) {
    deleteLocalPlan(id);
    return;
  }
  await deleteUserPlan(id);
}

export async function loadWorkoutHistory(): Promise<WorkoutLogEntry[]> {
  if (!isLoggedIn()) return loadLocalHistory();

  const rows = await fetchUserHistory();
  return rows.map((r) => ({
    id: r.id,
    completedAt: r.completed_at,
    day: r.day,
    dayLabel: r.day_label,
    planName: r.plan_name ?? undefined,
  }));
}

export async function recordWorkout(entry: {
  day: number;
  dayLabel: string;
  planName?: string;
}): Promise<void> {
  if (!isLoggedIn()) {
    logLocalWorkout(entry);
    return;
  }
  await createUserHistoryEntry({
    day: entry.day,
    day_label: entry.dayLabel,
    plan_name: entry.planName,
  });
}

export async function wipeHistory(): Promise<void> {
  if (!isLoggedIn()) {
    clearLocalHistory();
    return;
  }
  await clearUserHistory();
}
