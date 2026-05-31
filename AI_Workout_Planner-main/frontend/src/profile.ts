import type { FormState } from "./components/WorkoutForm";
import type { UserProfile } from "./types";

export function formToProfile(form: FormState): UserProfile {
  return {
    goal: form.goal,
    days: form.days,
    equipment: form.equipment,
    level: form.level,
    use_ai: form.use_ai,
    injuries: form.injuries ?? [],
    weight_kg: form.weight_kg || null,
  };
}

export function normalizeForm(profile: Partial<FormState>): FormState {
  return {
    goal: profile.goal ?? "muscle_gain",
    days: profile.days ?? 5,
    equipment: profile.equipment ?? ["dumbbells"],
    level: profile.level ?? "beginner",
    use_ai: profile.use_ai ?? false,
    injuries: profile.injuries ?? [],
    weight_kg: profile.weight_kg ?? 70,
  };
}
