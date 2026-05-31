export type Goal = "fat_loss" | "muscle_gain" | "strength" | "fitness";
export type Level = "beginner" | "intermediate" | "advanced";
export type Equipment =
  | "gym"
  | "dumbbells"
  | "bodyweight"
  | "resistance_bands"
  | "bench";
export type Injury = "knee" | "lower_back" | "shoulder" | "wrist" | "elbow";

export interface UserProfile {
  goal: Goal;
  days: number;
  equipment: Equipment[];
  level: Level;
  use_ai: boolean;
  injuries: Injury[];
  weight_kg?: number | null;
}

export interface ExerciseDetail {
  name: string;
  sets: number;
  reps: string;
  rest_seconds: number;
}

export interface WorkoutDay {
  day: number;
  label: string;
  focus: string;
  exercises: ExerciseDetail[];
  rest_guidance: string;
}

export interface WorkoutPlan {
  goal: string;
  days_per_week: number;
  level: string;
  split_type: string;
  weekly_plan: WorkoutDay[];
  source: "rules" | "ai";
}

export interface HealthResponse {
  status: string;
  ai_available: boolean;
  ai_provider?: string | null;
  ai_model?: string | null;
}

export interface ExerciseOption {
  name: string;
  muscles: string[];
  equipment: string[];
}

export interface NutritionAdvice {
  daily_calories: number;
  protein_grams: number;
  carbs_grams: number;
  fats_grams: number;
  water_liters: number;
  note: string;
}

export interface CoachMessage {
  role: string;
  content: string;
}

export interface CoachResponse {
  reply: string;
  source: "ai" | "fallback" | "groq" | "openai";
}
