"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!isSupabaseConfigured()) {
      document.cookie = "admin_dev_session=authenticated; path=/; max-age=86400";
      router.push("/admin");
      router.refresh();
      return;
    }

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-primary-900 px-5">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-xl bg-white p-8 shadow-card"
      >
        <h1 className="font-display text-2xl text-primary-900">Admin Login</h1>
        <p className="mt-2 text-sm text-neutral-600">
          {isSupabaseConfigured()
            ? "Sign in with your Supabase account."
            : "Dev mode: submit any credentials to continue."}
        </p>

        {isSupabaseConfigured() && (
          <>
            <div className="mt-6">
              <label className="mb-1 block text-sm font-semibold">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full min-h-12 rounded-md border border-neutral-300 px-4"
                required
              />
            </div>
            <div className="mt-4">
              <label className="mb-1 block text-sm font-semibold">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full min-h-12 rounded-md border border-neutral-300 px-4"
                required
              />
            </div>
          </>
        )}

        {error && (
          <p className="mt-4 text-sm text-error-600" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full min-h-12 rounded-full bg-primary-900 font-semibold text-white hover:bg-primary-700 disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}
