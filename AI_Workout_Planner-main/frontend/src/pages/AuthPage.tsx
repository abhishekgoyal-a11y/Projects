import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import { login, register } from "../api";
import { setAuth } from "../auth";

export default function AuthPage() {

  const navigate = useNavigate();

  const [mode, setMode] = useState<"login" | "register">("register");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const submit = async (e: FormEvent) => {

    e.preventDefault();

    setLoading(true);
    setError("");

    try {

      const res =
        mode === "login"
          ? await login(email, password)
          : await register(email, password);

      setAuth(res.access_token, res.email);

      navigate("/");

    } catch (err) {

      setError(
        err instanceof Error
          ? err.message
          : "Authentication failed"
      );

    } finally {
      setLoading(false);
    }
  };

  return (

    <div className="flex min-h-screen items-center justify-center bg-[#020817] px-4">

      <div className="grid w-full max-w-6xl overflow-hidden rounded-3xl border border-slate-800 bg-slate-950 shadow-2xl lg:grid-cols-2">

        {/* LEFT SIDE */}

        <div className="hidden flex-col justify-center bg-gradient-to-br from-emerald-500/20 to-slate-950 p-12 lg:flex">

          <h1 className="text-5xl font-bold leading-tight text-white">
            AI Workout Planner
          </h1>

          <p className="mt-6 text-lg leading-8 text-slate-300">
            Personalized workout plans powered by AI,
            adaptive progression, nutrition guidance,
            and smart fitness coaching.
          </p>

          <div className="mt-10 space-y-4 text-sm text-slate-300">

            <p>✅ AI-generated workout plans</p>

            <p>✅ Nutrition guidance</p>

            <p>✅ Workout history & streaks</p>

            <p>✅ Smart AI coach</p>

            <p>✅ Injury-aware recommendations</p>

          </div>

        </div>

        {/* RIGHT SIDE */}

        <div className="p-8 sm:p-12">

          <h2 className="text-4xl font-bold text-white">
  Welcome!!!
</h2>

<p className="mt-3 text-slate-400">
  Start your fitness journey.
</p>

          <form
            onSubmit={submit}
            className="mt-10 space-y-5"
          >

            <input
              type="email"
              required
              placeholder="Email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-5 py-4 text-white outline-none focus:border-emerald-400"
            />

            <input
              type="password"
              required
              placeholder="Password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-5 py-4 text-white outline-none focus:border-emerald-400"
            />

            {error && (
              <p className="text-sm text-red-400">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-emerald-500 px-6 py-4 font-semibold text-slate-950 transition-all hover:bg-emerald-400 disabled:opacity-50"
            >

              {loading
                ? "Please wait..."
                : mode === "login"
                ? "Sign in"
                : "Create account"}

            </button>

          </form>

          <button
            type="button"
            onClick={() =>
              setMode(
                mode === "login"
                  ? "register"
                  : "login"
              )
            }
            className="mt-6 text-sm text-slate-400 hover:text-emerald-300"
          >

            {mode === "login"
              ? "Need an account? Register"
              : "Already have an account? Sign in"}

          </button>

        </div>

      </div>

    </div>
  );
}