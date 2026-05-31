import type { Equipment, Goal, Injury, Level } from "../types";

const GOALS: { value: Goal; label: string }[] = [
  { value: "muscle_gain", label: "Muscle Gain" },
  { value: "fat_loss", label: "Fat Loss" },
  { value: "strength", label: "Strength" },
  { value: "fitness", label: "General Fitness" },
];

const LEVELS: { value: Level; label: string }[] = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

const INJURY_OPTIONS: { value: Injury; label: string }[] = [
  { value: "knee", label: "Knee" },
  { value: "lower_back", label: "Lower back" },
  { value: "shoulder", label: "Shoulder" },
  { value: "wrist", label: "Wrist" },
  { value: "elbow", label: "Elbow" },
];

const EQUIPMENT_OPTIONS: { value: Equipment; label: string }[] = [
  { value: "gym", label: "Full Gym" },
  { value: "dumbbells", label: "Dumbbells" },
  { value: "bench", label: "Bench" },
  { value: "bodyweight", label: "Bodyweight" },
  { value: "resistance_bands", label: "Resistance Bands" },
];

export interface FormState {
  goal: Goal;
  days: number;
  equipment: Equipment[];
  level: Level;
  use_ai: boolean;
  injuries: Injury[];
  weight_kg: number;
}

interface WorkoutFormProps {
  value: FormState;
  aiAvailable: boolean;
  loading: boolean;
  onChange: (value: FormState) => void;
  onSubmit: () => void;
}

export default function WorkoutForm({
  value,
  aiAvailable,
  loading,
  onChange,
  onSubmit,
}: WorkoutFormProps) {

  const toggleEquipment = (item: Equipment) => {
    const exists = value.equipment.includes(item);

    const equipment = exists
      ? value.equipment.filter((e) => e !== item)
      : [...value.equipment, item];

    onChange({ ...value, equipment });
  };

  const toggleInjury = (item: Injury) => {
    const exists = value.injuries.includes(item);

    const injuries = exists
      ? value.injuries.filter((i) => i !== item)
      : [...value.injuries, item];

    onChange({ ...value, injuries });
  };

  return (
    <form
      className="rounded-3xl border border-slate-800 bg-slate-950/60 p-6 shadow-xl backdrop-blur-sm"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >

      {/* Header */}

      <div className="mb-8">

        <h2 className="text-3xl font-bold tracking-tight text-emerald-400">
          Your fitness profile
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-400">
          Build a personalized workout plan based on your goals,
          equipment, injuries, and training experience.
        </p>

      </div>

      {/* Inputs */}

      <div className="grid gap-5 sm:grid-cols-2">

        {/* Goal */}

        <label className="flex flex-col gap-2 text-sm">

          <span className="font-medium text-slate-300">
            Goal
          </span>

          <select
            className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none transition-all focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20"
            value={value.goal}
            onChange={(e) =>
              onChange({
                ...value,
                goal: e.target.value as Goal,
              })
            }
          >
            {GOALS.map((g) => (
              <option key={g.value} value={g.value}>
                {g.label}
              </option>
            ))}
          </select>

        </label>

        {/* Days */}

        <label className="flex flex-col gap-2 text-sm">

          <span className="font-medium text-slate-300">
            Days per week
          </span>

          <input
            type="number"
            min={3}
            max={6}
            value={value.days}
            onChange={(e) =>
              onChange({
                ...value,
                days: Number(e.target.value),
              })
            }
            className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none transition-all focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20"
          />

        </label>

        {/* Weight */}

        <label className="flex flex-col gap-2 text-sm">

          <span className="font-medium text-slate-300">
            Weight (kg)
          </span>

          <input
            type="number"
            min={30}
            max={250}
            value={value.weight_kg}
            onChange={(e) =>
              onChange({
                ...value,
                weight_kg: Number(e.target.value),
              })
            }
            className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none transition-all focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20"
          />

        </label>

        {/* Level */}

        <label className="flex flex-col gap-2 text-sm sm:col-span-2">

          <span className="font-medium text-slate-300">
            Experience level
          </span>

          <select
            value={value.level}
            onChange={(e) =>
              onChange({
                ...value,
                level: e.target.value as Level,
              })
            }
            className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none transition-all focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20"
          >
            {LEVELS.map((l) => (
              <option key={l.value} value={l.value}>
                {l.label}
              </option>
            ))}
          </select>

        </label>

      </div>

      {/* Injuries */}

      <fieldset className="mt-8">

        <legend className="mb-3 text-sm font-medium text-slate-300">
          Injuries / limitations (optional)
        </legend>

        <div className="flex flex-wrap gap-3">

          {INJURY_OPTIONS.map((opt) => {

            const active = value.injuries.includes(opt.value);

            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => toggleInjury(opt.value)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  active
                    ? "border-amber-400 bg-amber-500/20 text-amber-200"
                    : "border-slate-700 bg-slate-800/80 text-slate-300 hover:border-slate-500 hover:bg-slate-700"
                }`}
              >
                {opt.label}
              </button>
            );
          })}

        </div>

      </fieldset>

      {/* Equipment */}

      <fieldset className="mt-8">

        <legend className="mb-3 text-sm font-medium text-slate-300">
          Equipment available
        </legend>

        <div className="flex flex-wrap gap-3">

          {EQUIPMENT_OPTIONS.map((opt) => {

            const active = value.equipment.includes(opt.value);

            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => toggleEquipment(opt.value)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  active
                    ? "border-emerald-400 bg-emerald-500/20 text-emerald-200"
                    : "border-slate-700 bg-slate-800/80 text-slate-300 hover:border-slate-500 hover:bg-slate-700"
                }`}
              >
                {opt.label}
              </button>
            );
          })}

        </div>

      </fieldset>

      {/* AI Toggle */}

      <label className="mt-8 flex items-center gap-3 text-sm text-slate-300">

        <input
          type="checkbox"
          checked={value.use_ai}
          disabled={!aiAvailable}
          onChange={(e) =>
            onChange({
              ...value,
              use_ai: e.target.checked,
            })
          }
          className="size-5 rounded accent-emerald-400"
        />

        <span className="font-medium">
          Enable Smart AI Personalization
        </span>

        {!aiAvailable && (
          <span className="text-xs text-slate-500">
            (set GROQ_API_KEY in backend/.env)
          </span>
        )}

      </label>

      {/* Submit */}

      <button
        type="submit"
        disabled={loading || value.equipment.length === 0}
        className="mt-8 w-full rounded-2xl bg-emerald-500 px-6 py-4 font-semibold text-slate-950 transition-all duration-200 hover:scale-[1.02] hover:bg-emerald-400 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Generating..." : "Generate Plan"}
      </button>

    </form>
  );
}