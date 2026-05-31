import type { SavedPlanRecord } from "../storage";

interface SavedPlansPanelProps {
  plans: SavedPlanRecord[];
  onLoad: (record: SavedPlanRecord) => void;
  onDelete: (id: string) => void;
}

export default function SavedPlansPanel({
  plans,
  onLoad,
  onDelete,
}: SavedPlansPanelProps) {

  /* Empty State */

  if (plans.length === 0) {
    return (
      <div className="flex min-h-[260px] items-center justify-center rounded-3xl border border-dashed border-slate-700 bg-slate-950/40 p-8 text-center shadow-xl">

        <div>

          <h3 className="mb-3 text-xl font-semibold text-white">
            No saved plans yet
          </h3>

          <p className="max-w-md text-sm leading-7 text-slate-400">
            Generate a workout plan and save it to quickly access
            your routines later.
          </p>

        </div>

      </div>
    );
  }

  return (
    <div className="grid gap-4">

      {plans.map((p) => (

        <div
          key={p.id}
          className="rounded-3xl border border-slate-800 bg-slate-950/60 p-5 shadow-xl transition-all duration-200 hover:border-slate-700 hover:bg-slate-950/80"
        >

          <div className="flex flex-wrap items-start justify-between gap-4">

            {/* Left */}

            <div>

              <h3 className="text-lg font-bold tracking-tight text-white">
                {p.name}
              </h3>

              <div className="mt-3 flex flex-wrap items-center gap-2">

                <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
                  {p.plan.goal.replace("_", " ")}
                </span>

                <span className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs text-slate-300">
                  {p.plan.days_per_week} days/week
                </span>

                <span className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs text-slate-400">
                  {new Date(p.savedAt).toLocaleDateString()}
                </span>

              </div>

            </div>

            {/* Right */}

            <div className="flex flex-wrap gap-3">

              <button
                type="button"
                onClick={() => onLoad(p)}
                className="rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-slate-950 transition-all duration-200 hover:scale-[1.02] hover:bg-emerald-400 active:scale-95"
              >
                Load Plan
              </button>

              <button
                type="button"
                onClick={() => onDelete(p.id)}
                className="rounded-2xl border border-slate-700 bg-slate-900 px-5 py-3 text-sm font-medium text-slate-300 transition-all duration-200 hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-300"
              >
                Delete
              </button>

            </div>

          </div>

        </div>
      ))}

    </div>
  );
}