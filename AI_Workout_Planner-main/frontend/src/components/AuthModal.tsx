import { useState, type FormEvent } from "react";

import { login, register } from "../api";
import { setAuth } from "../auth";

interface AuthModalProps {
  onClose: () => void;
  onSuccess: (email: string) => void;
}

export default function AuthModal({
  onClose,
  onSuccess,
}: AuthModalProps) {

  const [mode, setMode] = useState<"login" | "register">(
    "login"
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);

  const submit = async (e: FormEvent) => {

    e.preventDefault();

    setError(null);
    setLoading(true);

    try {

      const res =
        mode === "login"
          ? await login(email, password)
          : await register(email, password);

      setAuth(res.access_token, res.email);

      onSuccess(res.email);
      onClose();

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">

      {/* Modal */}

      <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-950/90 p-8 shadow-2xl">

        {/* Header */}

        <div className="mb-6 flex items-start justify-between gap-4">

          <div>

            <h2 className="text-3xl font-bold tracking-tight text-emerald-400">
              {mode === "login"
                ? "Welcome back"
                : "Create account"}
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              Save workout plans, track progress, and sync your
              fitness history across devices.
            </p>

          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-700 bg-slate-900 p-2 text-slate-400 transition-all duration-200 hover:bg-slate-800 hover:text-white"
          >
            ✕
          </button>

        </div>

        {/* Form */}

        <form
          onSubmit={submit}
          className="space-y-5"
        >

          {/* Email */}

          <div>

            <label className="mb-2 block text-sm font-medium text-slate-300">
              Email
            </label>

            <input
              type="email"
              required
              placeholder="Enter your email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-5 py-4 text-white outline-none transition-all focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20"
            />

          </div>

          {/* Password */}

          <div>

            <label className="mb-2 block text-sm font-medium text-slate-300">
              Password
            </label>

            <input
              type="password"
              required
              minLength={6}
              placeholder="Minimum 6 characters"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-5 py-4 text-white outline-none transition-all focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20"
            />

          </div>

          {/* Error */}

          {error && (
            <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          {/* Submit */}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-emerald-500 px-6 py-4 font-semibold text-slate-950 transition-all duration-200 hover:scale-[1.02] hover:bg-emerald-400 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Please wait..."
              : mode === "login"
              ? "Sign in"
              : "Create account"}
          </button>

        </form>

        {/* Footer */}

        <button
          type="button"
          onClick={() => {
            setMode(
              mode === "login"
                ? "register"
                : "login"
            );

            setError(null);
          }}
          className="mt-6 w-full text-sm font-medium text-slate-400 transition-colors hover:text-emerald-300"
        >
          {mode === "login"
            ? "Need an account? Register"
            : "Already have an account? Sign in"}
        </button>

      </div>

    </div>
  );
}