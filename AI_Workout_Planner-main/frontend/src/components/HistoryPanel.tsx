import type { WorkoutLogEntry } from "../storage";

interface HistoryPanelProps {
  logs: WorkoutLogEntry[];
  streak: number;
  onClear: () => void;
}

export default function HistoryPanel({
  logs,
  streak,
  onClear,
}: HistoryPanelProps) {

  return (
    <div>

      {/* Top Section */}

      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">

        {/* Streak Card */}

        <div className="rounded-3xl border border-emerald-500/30 bg-emerald-500/10 px-6 py-5 shadow-lg">

          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Current Streak
          </p>

          <div className="mt-2 flex items-center gap-3">

            <span className="text-3xl">
              🔥
            </span>

            <p className="text-3xl font-bold tracking-tight text-emerald-300">
              {streak} day{streak === 1 ? "" : "s"}
            </p>

          </div>

        </div>

        {/* Clear Button */}

        {logs.length > 0 && (
          <button
            type="button"
            onClick={onClear}
            className="rounded-2xl border border-slate-700 bg-slate-900 px-5 py-3 text-sm font-medium text-slate-300 transition-all duration-200 hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-300"
          >
            Clear History
          </button>
        )}

      </div>

      {/* Empty State */}

      {logs.length === 0 ? (

        <div className="flex min-h-[260px] items-center justify-center rounded-3xl border border-dashed border-slate-700 bg-slate-950/40 p-8 text-center shadow-xl">

          <div>

            <h3 className="mb-3 text-xl font-semibold text-white">
              No workouts logged yet
            </h3>

            <p className="max-w-md text-sm leading-7 text-slate-400">
              Complete workouts from your weekly plan to track
              your consistency and build your streak.
            </p>

          </div>

        </div>

      ) : (

        <div className="max-h-[520px] space-y-4 overflow-y-auto pr-2">

          {logs.map((log) => (

            <div
              key={log.id}
              className="rounded-3xl border border-slate-800 bg-slate-950/60 p-5 shadow-lg transition-all duration-200 hover:border-slate-700 hover:bg-slate-950/80"
            >

              <div className="flex flex-wrap items-start justify-between gap-4">

                {/* Left */}

                <div>

                  <div className="flex flex-wrap items-center gap-2">

                    <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
                      Workout Complete
                    </span>

                  </div>

                  <h3 className="mt-3 text-lg font-bold tracking-tight text-white">
                    {log.dayLabel}
                  </h3>

                  {log.planName && (
                    <p className="mt-2 text-sm text-slate-400">
                      {log.planName}
                    </p>
                  )}

                </div>

                {/* Right */}

                <div className="text-right">

                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    Completed
                  </p>

                  <p className="mt-2 text-sm font-medium text-slate-300">
                    {new Date(log.completedAt).toLocaleDateString()}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {new Date(log.completedAt).toLocaleTimeString()}
                  </p>

                </div>

              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}