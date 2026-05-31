import type { ExerciseDetail, ExerciseOption } from "../types";

interface ExerciseEditorProps {
  exercise: ExerciseDetail;
  alternatives: ExerciseOption[];
  onChange: (updated: ExerciseDetail) => void;
  onRemove: () => void;
}

export default function ExerciseEditor({
  exercise,
  alternatives,
  onChange,
  onRemove,
}: ExerciseEditorProps) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5 shadow-lg transition-all duration-200 hover:border-emerald-500/30">

      {/* Header */}

      <div className="flex flex-wrap items-start justify-between gap-3">

        <select
          className="min-w-[220px] flex-1 rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 font-medium text-white outline-none transition-all focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20"
          value={exercise.name}
          onChange={(e) =>
            onChange({
              ...exercise,
              name: e.target.value,
            })
          }
        >

          <option value={exercise.name}>
            {exercise.name}
          </option>

          {alternatives
            .filter((a) => a.name !== exercise.name)
            .map((a) => (
              <option key={a.name} value={a.name}>
                {a.name} ({a.muscles.join(", ")})
              </option>
            ))}

        </select>

        <button
          type="button"
          onClick={onRemove}
          className="text-sm font-medium text-red-400 transition-colors hover:text-red-300"
        >
          Remove
        </button>

      </div>

      {/* Inputs */}

      <div className="mt-5 grid gap-4 sm:grid-cols-3">

        {/* Sets */}

        <label className="flex flex-col gap-2 text-sm">

          <span className="font-medium text-slate-400">
            Sets
          </span>

          <input
            type="number"
            min={1}
            max={10}
            value={exercise.sets}
            onChange={(e) =>
              onChange({
                ...exercise,
                sets: Number(e.target.value),
              })
            }
            className="rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none transition-all focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20"
          />

        </label>

        {/* Reps */}

        <label className="flex flex-col gap-2 text-sm">

          <span className="font-medium text-slate-400">
            Reps
          </span>

          <input
            type="text"
            value={exercise.reps}
            onChange={(e) =>
              onChange({
                ...exercise,
                reps: e.target.value,
              })
            }
            className="rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none transition-all focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20"
          />

        </label>

        {/* Rest */}

        <label className="flex flex-col gap-2 text-sm">

          <span className="font-medium text-slate-400">
            Rest (s)
          </span>

          <input
            type="number"
            min={15}
            max={300}
            value={exercise.rest_seconds}
            onChange={(e) =>
              onChange({
                ...exercise,
                rest_seconds: Number(e.target.value),
              })
            }
            className="rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none transition-all focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20"
          />

        </label>

      </div>

    </div>
  );
}