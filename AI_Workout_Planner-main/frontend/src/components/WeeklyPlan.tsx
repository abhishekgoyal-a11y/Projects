import { useState } from "react";
import type {
  ExerciseDetail,
  ExerciseOption,
  WorkoutDay,
  WorkoutPlan,
} from "../types";

import ExerciseEditor from "./ExerciseEditor";

interface WeeklyPlanProps {
  plan: WorkoutPlan;
  alternatives: ExerciseOption[];
  planName?: string;
  sessionsCompleted: number;
  adapting: boolean;

  onChange: (plan: WorkoutPlan) => void;
  onSave: () => void;
  onAdapt: () => void;
  onExport: () => void;
  onLogWorkout: (day: WorkoutDay) => void;
}

export default function WeeklyPlan({
  plan,
  alternatives,
  planName,
  sessionsCompleted,
  adapting,
  onChange,
  onSave,
  onAdapt,
  onExport,
  onLogWorkout,
}: WeeklyPlanProps) {
  const [selectedDay, setSelectedDay] = useState(1);
  const [editing, setEditing] = useState(true);

  const day =
    plan.weekly_plan.find((d) => d.day === selectedDay) ??
    plan.weekly_plan[0];

  const updateDay = (updated: WorkoutDay) => {
    onChange({
      ...plan,
      weekly_plan: plan.weekly_plan.map((d) =>
        d.day === updated.day ? updated : d
      ),
    });
  };

  const updateExercise = (
    index: number,
    exercise: ExerciseDetail
  ) => {
    if (!day) return;

    const exercises = [...day.exercises];
    exercises[index] = exercise;

    updateDay({
      ...day,
      exercises,
    });
  };

  const removeExercise = (index: number) => {
    if (!day) return;

    updateDay({
      ...day,
      exercises: day.exercises.filter((_, i) => i !== index),
    });
  };

  const addExercise = () => {
    if (!day || alternatives.length === 0) return;

    const pick =
      alternatives.find(
        (a) => !day.exercises.some((e) => e.name === a.name)
      ) ?? alternatives[0];

    const template = day.exercises[0];

    updateDay({
      ...day,
      exercises: [
        ...day.exercises,
        {
          name: pick.name,
          sets: template?.sets ?? 3,
          reps: template?.reps ?? "10-12",
          rest_seconds: template?.rest_seconds ?? 60,
        },
      ],
    });
  };

  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-950/60 p-6 shadow-xl backdrop-blur-sm">

      {/* Header */}

      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">

        <div>
          <h2 className="text-2xl font-bold tracking-tight text-emerald-400">
            Weekly Plan
          </h2>

          <p className=" text-slate-400 capitalize">
            {plan.goal} · {plan.days_per_week} days · {plan.split_type}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">

          <button
            type="button"
            onClick={() => setEditing((e) => !e)}
            className="rounded-2xl border border-slate-700 bg-slate-800/80 px-4 py-2 text-xs font-medium text-slate-300 transition-all duration-200 hover:bg-slate-700"
          >
            {editing ? "Preview" : "Customize"}
          </button>

          {sessionsCompleted >= 3 && (
            <button
              type="button"
              onClick={onAdapt}
              disabled={adapting}
              className="rounded-2xl border border-amber-500/40 bg-amber-500/10 px-4 py-2 text-xs font-medium text-amber-200 transition-all duration-200 hover:bg-amber-500/20 disabled:opacity-50"
            >
              {adapting ? "Adapting..." : "Adapt Plan"}
            </button>
          )}

          <button
            type="button"
            onClick={onExport}
            className="rounded-2xl border border-slate-700 bg-slate-800/80 px-4 py-2 text-xs font-medium text-slate-300 transition-all duration-200 hover:bg-slate-700"
          >
            Export
          </button>

          <button
            type="button"
            onClick={onSave}
            className="rounded-2xl bg-emerald-500 px-4 py-2 text-xs font-semibold text-slate-950 transition-all duration-200 hover:scale-[1.02] hover:bg-emerald-400 active:scale-95"
          >
            Save Plan
          </button>

        </div>
      </div>

      {/* Workout Days */}

      <div className="space-y-4">

        {plan.weekly_plan.map((row) => {

          const active = selectedDay === row.day;

          return (
            <div
              key={row.day}
              onClick={() => setSelectedDay(row.day)}
              className={`cursor-pointer rounded-2xl border p-5 transition-all duration-200 ${
                active
                  ? "border-emerald-500/40 bg-emerald-500/10"
                  : "border-slate-800 bg-slate-900/40 hover:border-slate-700 hover:bg-slate-900/70"
              }`}
            >

              <div className="flex flex-wrap items-start justify-between gap-3">

                <div>

                  <div className="flex flex-wrap items-center gap-2">

                    <h3 className="text-lg font-bold text-white">
                      {row.label}
                    </h3>

                    <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
                      {row.focus}
                    </span>

                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">

                    {row.exercises.map((exercise) => (
                      <span
                        key={exercise.name}
                        className="rounded-full border border-slate-700 bg-slate-800 px-3 py-1 text-sm text-slate-300"
                      >
                        {exercise.name}
                      </span>
                    ))}

                  </div>

                </div>

              </div>

            </div>
          );
        })}

      </div>

      {/* Selected Day */}

      {day && (
        <div className="mt-8 rounded-3xl border border-slate-800 bg-slate-950/70 p-6 shadow-lg">

          <div className="flex flex-wrap items-center justify-between gap-4">

            <div>

              <h3 className="text-2xl font-bold text-emerald-400">
                {day.label}
              </h3>

              <p className="mt-2 text-sm text-slate-400">
                Focus: {day.focus}
              </p>

            </div>

            <button
              type="button"
              onClick={() => onLogWorkout(day)}
              className="rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-slate-950 transition-all duration-200 hover:scale-[1.02] hover:bg-emerald-400 active:scale-95"
            >
              Mark Complete
            </button>

          </div>

          {/* Exercises */}

          {editing ? (
            <div className="mt-5 space-y-4">

              {day.exercises.map((ex, index) => (
                <ExerciseEditor
                  key={`${day.day}-${index}-${ex.name}`}
                  exercise={ex}
                  alternatives={alternatives}
                  onChange={(updated) =>
                    updateExercise(index, updated)
                  }
                  onRemove={() => removeExercise(index)}
                />
              ))}

            </div>
          ) : (
            <div className="mt-5 space-y-3">

              {day.exercises.map((ex) => (
                <div
                  key={ex.name}
                  className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4"
                >

                  <div className="flex flex-wrap items-center justify-between gap-3">

                    <span className="font-semibold text-white">
                      {ex.name}
                    </span>

                    <span className="text-sm text-slate-400">
                      {ex.sets} sets × {ex.reps} · Rest{" "}
                      {ex.rest_seconds}s
                    </span>

                  </div>

                </div>
              ))}

            </div>
          )}

          {/* Add Exercise */}

          {editing && (
            <button
              type="button"
              onClick={addExercise}
              className="mt-5 text-sm font-medium text-emerald-400 transition-colors hover:text-emerald-300"
            >
              + Add exercise
            </button>
          )}

          <p className="mt-5 text-sm text-slate-500">
            ⏱ {day.rest_guidance}
          </p>

        </div>
      )}

    </section>
  );
}