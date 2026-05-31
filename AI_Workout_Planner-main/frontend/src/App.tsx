import { getAuth } from "./auth";

import { Routes, Route, Navigate, useNavigate, } from "react-router-dom";

import AuthPage from "./pages/AuthPage";
import { useCallback, useEffect, useState } from "react";
import {
  adaptPlan,
  coachChat,
  fetchExercises,
  fetchHealth,
  fetchNutrition,
  generatePlan,
} from "./api";
import toast from "react-hot-toast";

import CoachPanel from "./components/CoachPanel";
import HistoryPanel from "./components/HistoryPanel";
import NutritionPanel from "./components/NutritionPanel";
import SavedPlansPanel from "./components/SavedPlansPanel";
import WeeklyPlan from "./components/WeeklyPlan";
import WorkoutForm, { type FormState } from "./components/WorkoutForm";


import { formToProfile, normalizeForm } from "./profile";

import type {
  CoachMessage,
  ExerciseOption,
  NutritionAdvice,
  WorkoutDay,
  WorkoutPlan,
} from "./types";

import AuthModal from "./components/AuthModal";

import {
  loadPlans,
  loadWorkoutHistory,
  recordWorkout,
  removePlan,
  savePlanRecord,
  wipeHistory,
} from "./dataService";

import { downloadPlan } from "./exportPlan";
import { clearAuth, getStoredEmail } from "./auth";

import {
  computeStreak,
  type SavedPlanRecord,
  type WorkoutLogEntry,
} from "./storage";
import {
  Dumbbell,
  Bot,
  Salad,
  History,
  Save,
} from "lucide-react";


const defaultForm: FormState = {
  goal: "muscle_gain",
  days: 5,
  equipment: ["dumbbells", "bench"],
  level: "beginner",
  use_ai: false,
  injuries: [],
  weight_kg: 70,
};

type Tab = "plan" | "saved" | "history" | "nutrition" | "coach";

export default function App() {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>(defaultForm);
  const [plan, setPlan] = useState<WorkoutPlan | null>(null);
  const [planName, setPlanName] = useState<string>("My Workout Plan");
  const [alternatives, setAlternatives] = useState<ExerciseOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [adapting, setAdapting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aiAvailable, setAiAvailable] = useState(false);
  const [aiProvider, setAiProvider] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("plan");
  const [savedPlans, setSavedPlans] = useState<SavedPlanRecord[]>([]);
  const [history, setHistory] = useState<WorkoutLogEntry[]>([]);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [nutrition, setNutrition] = useState<NutritionAdvice | null>(null);
  const [nutritionLoading, setNutritionLoading] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(getStoredEmail());

  useEffect(() => {

  const auth = getAuth();

  if (auth?.email) {
    setUserEmail(auth.email);
  }

}, []);


  const refreshStorage = useCallback(async () => {
    try {
      const [plans, logs] = await Promise.all([
        loadPlans(),
        loadWorkoutHistory(),
      ]);

      setSavedPlans(plans);
      setHistory(logs);
    } catch {
      setSavedPlans([]);
      setHistory([]);
    }
  }, []);

  const loadNutrition = useCallback(async () => {
    setNutritionLoading(true);

    try {
      const advice = await fetchNutrition(formToProfile(form));
      setNutrition(advice);
    } catch {
      setNutrition(null);
    } finally {
      setNutritionLoading(false);
    }
  }, [form]);

  useEffect(() => {
    fetchHealth()
      .then((h) => {
        setAiAvailable(h.ai_available);
        setAiProvider(h.ai_provider ?? null);
      })
      .catch(() => {
        setAiAvailable(false);
        setAiProvider(null);
      });

    refreshStorage();
  }, [refreshStorage]);

  useEffect(() => {
    if (!plan) return;

    fetchExercises(form.goal, form.equipment, form.injuries)
      .then(setAlternatives)
      .catch(() => setAlternatives([]));
  }, [plan, form.goal, form.equipment, form.injuries]);

  useEffect(() => {
    if (tab === "nutrition") loadNutrition();
  }, [tab, loadNutrition]);

  const handleGenerate = async () => {
    setError(null);
    setSaveMessage(null);
    setLoading(true);

    try {
      const result = await generatePlan(formToProfile(form));

      setPlan(result);
      toast.success("Workout plan generated!");
      setPlanName(`${result.goal} · ${result.days_per_week} days`);
      setTab("plan");
    } catch (err) {
      setPlan(null);
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleAdapt = async () => {
    if (!plan) return;

    setAdapting(true);
    setError(null);

    try {
      const adapted = await adaptPlan(plan, history.length);
      setPlan(adapted);
      setSaveMessage("Plan adapted based on your workout history.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Adapt failed");
    } finally {
      setAdapting(false);
    }
  };

  const handleCoach = async (messages: CoachMessage[]) => {
    const res = await coachChat(messages, formToProfile(form));
    return res.reply;
  };

  const handleSave = async () => {
    if (!plan) return;

    const name = window.prompt("Name this plan:", planName);

    if (!name?.trim()) return;

    try {
      await savePlanRecord(name.trim(), form, plan);
      toast.success("Plan saved successfully!");
      setPlanName(name.trim());

      await refreshStorage();

      setSaveMessage(
        `Saved "${name.trim()}"${userEmail ? " to your account" : ""}`
      );

      setTab("saved");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    }
  };

  const handleLoad = (record: SavedPlanRecord) => {
    setForm(normalizeForm(record.profile));
    setPlan(record.plan);
    setPlanName(record.name);
    setTab("plan");
    setSaveMessage(null);
  };

  const handleLogWorkout = async (day: WorkoutDay) => {
    try {
      await recordWorkout({
        day: day.day,
        dayLabel: day.label,
        planName,
      });
      toast.success("Workout logged!");

      await refreshStorage();
      setTab("history");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not log workout");
    }
  };

  const handleLogout = () => {
    clearAuth();
    setUserEmail(null);
    refreshStorage();
    navigate("/login");
  };

  const streak = computeStreak(history);

  const tabs = [
  {
    id: "plan",
    label: (
      <span className="flex items-center gap-2">
        <Dumbbell size={16} />
        Plan
      </span>
    ),
  },

  {
    id: "coach",
    label: (
      <span className="flex items-center gap-2">
        <Bot size={16} />
        Coach
      </span>
    ),
  },

  {
    id: "nutrition",
    label: (
      <span className="flex items-center gap-2">
        <Salad size={16} />
        Nutrition
      </span>
    ),
  },

  {
    id: "saved",
    label: (
      <span className="flex items-center gap-2">
        <Save size={16} />
        Saved ({savedPlans.length})
      </span>
    ),
  },

  {
    id: "history",
    label: (
      <span className="flex items-center gap-2">
        <History size={16} />
        History
      </span>
    ),
  },
];

  return (
    <Routes>

    <Route
      path="/login"
      element={<AuthPage />}
    />

    <Route
      path="/"
      element={
        userEmail ? ( 

    <div className="min-h-screen bg-[#020817] text-white">
      <header className="sticky top-0 z-50 border-b border-slate-800 bg-[#020817]/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-5 lg:px-8">
          <div>
            <div className="flex items-center gap-3">

  <div className="rounded-2xl bg-emerald-500/10 p-3">
    <Dumbbell className="h-7 w-7 text-emerald-400" />
  </div>

  <div>

    <h1 className="text-3xl font-bold tracking-tight text-white">
      AI Workout Planner
    </h1>

    <p className="mt-1 text-sm tracking-wide text-slate-400">
      Plan · coach · nutrition · progress
    </p>

  </div>

</div>
</div>
          <div className="flex flex-wrap items-center gap-3">
            {userEmail ? (
              <>
                <span className="text-xs text-slate-400">
                  {userEmail}
                </span>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-full border border-slate-700 bg-slate-800/80 px-4 py-2 text-xs font-medium text-slate-300 transition-all duration-200 hover:bg-slate-700 hover:text-red-300"
                >
                  Sign out
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="rounded-full border border-slate-700 bg-slate-800/80 px-4 py-2 text-xs font-medium text-emerald-300 transition-all duration-200 hover:scale-[1.02] hover:bg-slate-700"
              >
                Sign in
              </button>
            )}

            {streak > 0 && (
              <span className="rounded-full bg-amber-500/20 px-4 py-2 text-xs font-medium text-amber-200">
                🔥 {streak} day streak
              </span>
            )}

            <span
              className={`rounded-full px-4 py-2 text-xs font-semibold ${
                aiAvailable
                  ? "bg-emerald-500/20 text-emerald-300"
                  : "bg-slate-700 text-slate-300"
              }`}
            >
              {aiAvailable
                ? aiProvider === "groq"
                  ? "Groq AI"
                  : "AI Ready"
                : "Rules Engine"}
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <div className="mb-6 flex flex-wrap gap-3">
          {tabs.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`rounded-2xl px-5 py-3 text-sm font-semibold transition-all duration-200 ${
                tab === id
                  ? "bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20"
                  : "border border-slate-700 bg-slate-800/80 text-slate-300 hover:scale-[1.02] hover:bg-slate-700"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === "plan" && (
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <WorkoutForm
              value={form}
              aiAvailable={aiAvailable}
              loading={loading}
              onChange={setForm}
              onSubmit={handleGenerate}
            />

            <div className="space-y-4">
              {error && (
                <div className="rounded-2xl border border-red-500/40 bg-red-500/10 px-5 py-4 text-sm text-red-200 shadow-lg">
                  {error}
                </div>
              )}

              {saveMessage && (
                <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 px-5 py-4 text-sm text-emerald-200 shadow-lg">
                  {saveMessage}
                </div>
              )}

              {!plan && !error && (
                <div className="flex min-h-[320px] items-center justify-center rounded-3xl border border-dashed border-slate-700 bg-slate-950/40 p-10 text-center text-slate-400 shadow-xl">
                  <div>
                    <h3 className="mb-3 text-xl font-semibold text-white">
                      Ready to build your workout plan?
                    </h3>

                    <p className="max-w-md text-sm leading-7 text-slate-400">
                      Set injuries, equipment, and fitness goals to generate a
                      smart AI-powered workout routine tailored to you.
                    </p>
                  </div>
                </div>
              )}

              {plan && (
                <WeeklyPlan
                  plan={plan}
                  alternatives={alternatives}
                  planName={planName}
                  sessionsCompleted={history.length}
                  adapting={adapting}
                  onChange={setPlan}
                  onSave={handleSave}
                  onAdapt={handleAdapt}
                  onExport={() => plan && downloadPlan(plan, planName)}
                  onLogWorkout={handleLogWorkout}
                />
              )}
            </div>
          </div>
        )}

        {tab === "coach" && (
          <section className="rounded-3xl border border-slate-800 bg-slate-950/60 p-6 shadow-xl backdrop-blur-sm">
            <h2 className="mb-5 text-xl font-bold tracking-tight text-emerald-400">
              AI Fitness Coach
            </h2>

            <CoachPanel aiAvailable={aiAvailable} onSend={handleCoach} />
          </section>
        )}

        {tab === "nutrition" && (
          <section className="rounded-3xl border border-slate-800 bg-slate-950/60 p-6 shadow-xl backdrop-blur-sm">
            <h2 className="mb-5 text-xl font-bold tracking-tight text-emerald-400">
              Nutrition Targets
            </h2>

            <NutritionPanel
              advice={nutrition}
              loading={nutritionLoading}
              onRefresh={loadNutrition}
            />
          </section>
        )}

        {tab === "saved" && (
          <section className="rounded-3xl border border-slate-800 bg-slate-950/60 p-6 shadow-xl backdrop-blur-sm">
            <h2 className="mb-5 text-xl font-bold tracking-tight text-emerald-400">
              Saved Plans
            </h2>

            <SavedPlansPanel
              plans={savedPlans}
              onLoad={handleLoad}
              onDelete={async (id) => {
                await removePlan(id);
                await refreshStorage();
              }}
            />
          </section>
        )}

        {tab === "history" && (
          <section className="rounded-3xl border border-slate-800 bg-slate-950/60 p-6 shadow-xl backdrop-blur-sm">
            <h2 className="mb-5 text-xl font-bold tracking-tight text-emerald-400">
              Workout History
            </h2>

            <HistoryPanel
              logs={history}
              streak={streak}
              onClear={async () => {
                await wipeHistory();
                await refreshStorage();
              }}
            />

            {history.length >= 3 && plan && (
              <button
                type="button"
                onClick={() => {
                  setTab("plan");
                  handleAdapt();
                }}
                className="mt-5 rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-slate-950 transition-all duration-200 hover:scale-[1.02] hover:bg-emerald-400 active:scale-95"
              >
                Adapt Current Plan ({history.length} sessions logged)
              </button>
            )}
          </section>
        )}
      </main>
              </div>

        ) : (
          <Navigate to="/login" replace />
        )
      }
    />

  </Routes>

);
}
