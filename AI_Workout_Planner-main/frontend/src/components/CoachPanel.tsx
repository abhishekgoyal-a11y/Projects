import { useEffect, useRef, useState } from "react";
import type { CoachMessage } from "../types";

interface CoachPanelProps {
  aiAvailable: boolean;
  onSend: (messages: CoachMessage[]) => Promise<string>;
}

const STARTERS = [
  "What should I do today?",
  "How do I break a plateau?",
  "Best warm-up before upper body?",
];

export default function CoachPanel({
  aiAvailable,
  onSend,
}: CoachPanelProps) {

  const [messages, setMessages] = useState<CoachMessage[]>([
    {
      role: "assistant",
      content:
        "Hey! I'm your AI fitness coach. Ask about workouts, recovery, strength, nutrition, or training tips.",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  const send = async (text: string) => {

    if (!text.trim() || loading) return;

    const userMsg: CoachMessage = {
      role: "user",
      content: text.trim(),
    };

    const next = [...messages, userMsg];

    setMessages(next);
    setInput("");
    setLoading(true);

    try {

      const reply = await onSend(next);

      setMessages([
        ...next,
        {
          role: "assistant",
          content: reply,
        },
      ]);

    } catch {

      setMessages([
        ...next,
        {
          role: "assistant",
          content:
            "Couldn't reach the AI coach. Make sure the backend server is running.",
        },
      ]);

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-[620px] flex-col">

      {/* AI Warning */}

      {!aiAvailable && (
        <div className="mb-4 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
          AI mode is currently disabled. Add your{" "}
          <span className="font-semibold">
            GROQ_API_KEY
          </span>{" "}
          in backend/.env for full AI coach support.
        </div>
      )}

      {/* Chat Messages */}

      <div className="flex-1 overflow-y-auto rounded-3xl border border-slate-800 bg-slate-950/60 p-5 shadow-xl backdrop-blur-sm">

        <div className="space-y-4">

          {messages.map((m, i) => {

            const isUser = m.role === "user";

            return (
              <div
                key={i}
                className={`flex ${
                  isUser ? "justify-end" : "justify-start"
                }`}
              >

                <div
                  className={`max-w-[85%] rounded-3xl px-5 py-4 text-sm leading-7 shadow-lg ${
                    isUser
                      ? "bg-emerald-500/20 text-emerald-100 border border-emerald-500/20"
                      : "border border-slate-800 bg-slate-900 text-slate-200"
                  }`}
                >

                  <div className="mb-2 text-xs font-semibold uppercase tracking-wide opacity-70">
                    {isUser ? "You" : "AI Coach"}
                  </div>

                  <p className="whitespace-pre-wrap">
                    {m.content}
                  </p>

                </div>

              </div>
            );
          })}

          {/* Loading */}

          {loading && (
            <div className="flex justify-start">

              <div className="rounded-3xl border border-slate-800 bg-slate-900 px-5 py-4 text-sm text-slate-400 shadow-lg">

                <div className="mb-2 text-xs font-semibold uppercase tracking-wide opacity-70">
                  AI Coach
                </div>

                <div className="flex items-center gap-2">

                  <span className="h-2 w-2 animate-bounce rounded-full bg-emerald-400" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-emerald-400 [animation-delay:120ms]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-emerald-400 [animation-delay:240ms]" />

                </div>

              </div>

            </div>
          )}

          <div ref={bottomRef} />

        </div>

      </div>

      {/* Starter Questions */}

      <div className="mt-4 flex flex-wrap gap-2">

        {STARTERS.map((q) => (
          <button
            key={q}
            type="button"
            onClick={() => send(q)}
            disabled={loading}
            className="rounded-full border border-slate-700 bg-slate-900/60 px-4 py-2 text-xs font-medium text-slate-300 transition-all duration-200 hover:border-slate-500 hover:bg-slate-800 disabled:opacity-50"
          >
            {q}
          </button>
        ))}

      </div>

      {/* Input */}

      <form
        className="mt-4 flex gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
      >

        <input
          className="flex-1 rounded-2xl border border-slate-700 bg-slate-900 px-5 py-4 text-sm text-white outline-none transition-all focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20"
          placeholder="Ask your AI coach anything..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
        />

        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="rounded-2xl bg-emerald-500 px-6 py-4 text-sm font-semibold text-slate-950 transition-all duration-200 hover:scale-[1.02] hover:bg-emerald-400 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Send
        </button>

      </form>

    </div>
  );
}