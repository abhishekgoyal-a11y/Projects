import type { NutritionAdvice } from "../types";

interface NutritionPanelProps {
  advice: NutritionAdvice | null;
  loading: boolean;
  onRefresh: () => void;
}

export default function NutritionPanel({
  advice,
  loading,
  onRefresh,
}: NutritionPanelProps) {

  return (
    <div>

      {/* Header */}

      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">

        <div>

          <h3 className="text-xl font-bold tracking-tight text-white">
            Daily Nutrition Targets
          </h3>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            Estimates are generated using your weight, training frequency,
            and fitness goal to support recovery and performance.
          </p>

        </div>

        <button
          type="button"
          onClick={onRefresh}
          disabled={loading}
          className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-5 py-3 text-sm font-medium text-emerald-300 transition-all duration-200 hover:bg-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Calculating..." : "Refresh Targets"}
        </button>

      </div>

      {/* Empty State */}

      {!advice && !loading && (
        <div className="flex min-h-[220px] items-center justify-center rounded-3xl border border-dashed border-slate-700 bg-slate-950/40 p-8 text-center shadow-xl">

          <div>

            <h4 className="mb-3 text-lg font-semibold text-white">
              Nutrition targets unavailable
            </h4>

            <p className="max-w-md text-sm leading-7 text-slate-400">
              Set your body weight and workout preferences in the profile form,
              then refresh this section to generate personalized calorie and
              macro recommendations.
            </p>

          </div>

        </div>
      )}

      {/* Loading */}

      {loading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">

          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-[120px] animate-pulse rounded-3xl border border-slate-800 bg-slate-900/60"
            />
          ))}

        </div>
      )}

      {/* Stats */}

      {advice && !loading && (
        <div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">

            <StatCard
              label="Daily Calories"
              value={`${advice.daily_calories} kcal`}
            />

            <StatCard
              label="Protein"
              value={`${advice.protein_grams} g`}
            />

            <StatCard
              label="Carbohydrates"
              value={`${advice.carbs_grams} g`}
            />

            <StatCard
              label="Fats"
              value={`${advice.fats_grams} g`}
            />

            <StatCard
              label="Water Intake"
              value={`${advice.water_liters} L`}
              highlight
            />

          </div>

          {/* Recommendation */}

          <div className="mt-5 rounded-3xl border border-slate-800 bg-slate-900/60 p-5 shadow-lg">

            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-emerald-400">
              Recommendation
            </h4>

            <p className="text-sm leading-7 text-slate-300">
              {advice.note}
            </p>

          </div>

        </div>
      )}

    </div>
  );
}

function StatCard({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {

  return (
    <div
      className={`rounded-3xl border p-5 shadow-lg transition-all duration-200 ${
        highlight
          ? "border-emerald-500/30 bg-emerald-500/10"
          : "border-slate-800 bg-slate-950/70"
      }`}
    >

      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p
        className={`mt-4 text-3xl font-bold tracking-tight ${
          highlight
            ? "text-emerald-300"
            : "text-white"
        }`}
      >
        {value}
      </p>

    </div>
  );
}