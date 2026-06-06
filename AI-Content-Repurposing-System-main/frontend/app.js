const { useMemo, useState } = React;

const SAMPLE_BLOG = `How AI Changes Content Repurposing

Most teams create one long-form piece, publish it once, and move on. That approach wastes the strongest ideas in the article.

AI helps creators extract the main idea, supporting points, examples, and tone from a blog. Once the structure is clear, the same idea can be adapted into a LinkedIn post, a Twitter thread, a YouTube script, and an email newsletter.

The key is not copying the same text everywhere. Each platform needs a different format. LinkedIn rewards professional reflection. Twitter needs short sequential ideas. YouTube needs a hook, story, and clear transitions. Email works best when the insight feels personal and useful.

For example, one blog about productivity could become a LinkedIn post about team workflows, a Twitter thread with five practical tips, a YouTube explainer, and a newsletter with a weekly challenge.

The lesson is simple: repurposing saves time, increases consistency, and helps every strong idea reach more people.`;

const PLATFORMS = [
  { key: "linkedin_post",      label: "LinkedIn Post",      accent: "bg-sky-600",     icon: "in", idealMax: 3000 },
  { key: "twitter_thread",     label: "Twitter/X Thread",   accent: "bg-slate-900",   icon: "𝕏",  idealMax: 2800 },
  { key: "youtube_script",     label: "YouTube Script",     accent: "bg-red-600",     icon: "▶",  idealMax: 5000 },
  { key: "email_newsletter",   label: "Email Newsletter",   accent: "bg-emerald-600", icon: "✉",  idealMax: 3000 },
];

function App() {
  const [sourceText, setSourceText] = useState(SAMPLE_BLOG);
  const [inputType, setInputType]   = useState("blog");
  const [tone, setTone]             = useState("educational");
  const [audience, setAudience]     = useState("general");
  const [useAi, setUseAi]           = useState(true);
  const [result, setResult]         = useState(null);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState("");

  const wordCount = useMemo(() => {
    return sourceText.trim().split(/\s+/).filter(Boolean).length;
  }, [sourceText]);

  // Auto-detect URL paste and switch input type
  function handleSourceChange(val) {
    setSourceText(val);
    if (/^https?:\/\/\S+$/.test(val.trim())) {
      setInputType("url");
    }
  }

  async function generateContent() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/repurpose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source_text: sourceText, input_type: inputType, tone, audience, use_ai: useAi }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Unable to generate content.");
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const exportText = useMemo(() => {
    if (!result) return "";
    return PLATFORMS.map((p) => `## ${p.label}\n\n${result.outputs[p.key]}`).join("\n\n---\n\n");
  }, [result]);

  function downloadMarkdown() {
    if (!exportText) return;
    const blob = new Blob([`# Repurposed Content\n\n${exportText}\n`], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "repurposed-content.md"; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 px-4 py-5 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-4 border-b border-slate-200 pb-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">AI Content Pipeline</p>
          <h1 className="mt-1 text-3xl font-bold text-slate-950 sm:text-4xl">🔁 AI Content Repurposing System</h1>
          <p className="mt-1 text-sm text-slate-500">Turn one long-form article into LinkedIn, Twitter, YouTube & Email content instantly.</p>
        </div>
        <div className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm">
          <span className={`h-2.5 w-2.5 rounded-full ${result?.ai_used ? "bg-emerald-500" : "bg-amber-500"}`}></span>
          {result?.ai_used ? "✨ Groq AI generation active" : "⚡ Local generator ready"}
        </div>
      </header>

      <section className="grid gap-5 lg:grid-cols-[minmax(340px,0.9fr)_minmax(0,1.1fr)]">
        {/* Input Panel */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex flex-wrap gap-3">
            <Select label="Input Type" value={inputType} onChange={setInputType} options={[
              ["blog", "📄 Blog paste"],
              ["url", "🌐 URL"],
              ["markdown", "📝 Markdown"],
            ]} />
            <Select label="Tone" value={tone} onChange={setTone} options={[
              ["educational", "🎓 Educational"],
              ["formal", "💼 Formal"],
              ["casual", "😊 Casual"],
              ["viral", "🚀 Viral"],
            ]} />
            <Select label="Audience" value={audience} onChange={setAudience} options={[
              ["general", "🌍 General"],
              ["beginners", "🌱 Beginners"],
              ["experts", "🔬 Experts"],
              ["entrepreneurs", "💡 Entrepreneurs"],
            ]} />
          </div>

          <div className="flex items-center justify-between mb-1">
            <label className="block text-sm font-semibold text-slate-800" htmlFor="source">
              {inputType === "url" ? "Article URL" : "Paste Your Content"}
            </label>
            <span className="text-xs text-slate-400">{wordCount} words</span>
          </div>
          <textarea
            id="source"
            value={sourceText}
            onChange={(e) => handleSourceChange(e.target.value)}
            className="mt-1 h-[380px] w-full resize-none rounded-lg border border-slate-300 bg-slate-50 p-4 leading-6 text-slate-900 outline-none transition focus:border-teal-600 focus:bg-white focus:ring-4 focus:ring-teal-100 text-sm"
            placeholder={inputType === "url" ? "https://example.com/your-article" : "Paste your blog post, article, or long-form content here..."}
          />

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <label className="inline-flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={useAi}
                onChange={(e) => setUseAi(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-teal-700 focus:ring-teal-600"
              />
              Use Groq AI (when configured)
            </label>
            <button
              onClick={generateContent}
              disabled={loading || !sourceText.trim()}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-teal-700 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {loading ? (
                <><span className="animate-spin">⟳</span> Generating...</>
              ) : (
                <><span>⚡</span> Generate Content</>
              )}
            </button>
          </div>
          {error && (
            <p className="mt-3 rounded-lg bg-rose-50 border border-rose-200 px-3 py-2 text-sm text-rose-700">
              ⚠️ {error}
            </p>
          )}
        </div>

        {/* Insights Panel */}
        <aside className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-slate-950">🧠 Content Understanding</h2>
            <button
              onClick={downloadMarkdown}
              disabled={!result}
              title="Export all as Markdown"
              className="flex items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              ↓ Export .md
            </button>
          </div>
          {result ? <Insights insights={result.insights} /> : <EmptyInsights />}
        </aside>
      </section>

      {/* Output Panels */}
      <section className="grid gap-5 xl:grid-cols-2">
        {PLATFORMS.map((platform) => (
          <OutputPanel key={platform.key} platform={platform} content={result?.outputs?.[platform.key]} />
        ))}
      </section>
    </main>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <label className="min-w-[9rem] flex-1 text-sm font-semibold text-slate-800">
      {label}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-teal-600 focus:ring-4 focus:ring-teal-100 text-sm"
      >
        {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
      </select>
    </label>
  );
}

function Insights({ insights }) {
  return (
    <div className="space-y-4 text-sm text-slate-700 overflow-y-auto max-h-[480px] pr-1">
      <div className="grid grid-cols-2 gap-3">
        <InfoBlock label="🎯 Topic" value={insights.topic} />
        <InfoBlock label="🎙️ Tone" value={insights.tone} />
        <InfoBlock label="👥 Audience" value={insights.audience} />
        <InfoBlock label="📌 Title" value={insights.title} />
      </div>
      <InfoBlock label="💡 Main Idea" value={insights.main_idea} />
      <InfoBlock label="🪝 Hook" value={insights.hook} />
      <div>
        <p className="mb-2 font-semibold text-slate-900">📋 Key Points</p>
        <ul className="space-y-1.5">
          {insights.key_points.map((point, i) => (
            <li key={i} className="rounded-lg bg-teal-50 border border-teal-100 px-3 py-2 text-slate-800 text-xs leading-5">
              <span className="font-bold text-teal-700 mr-1.5">{i + 1}.</span>{point}
            </li>
          ))}
        </ul>
      </div>
      {insights.examples?.length > 0 && (
        <div>
          <p className="mb-2 font-semibold text-slate-900">💼 Examples Found</p>
          {insights.examples.map((ex, i) => (
            <p key={i} className="rounded-lg bg-amber-50 border border-amber-100 px-3 py-2 text-xs text-slate-700 mb-1.5">{ex}</p>
          ))}
        </div>
      )}
      {insights.conclusion && (
        <InfoBlock label="🏁 Conclusion" value={insights.conclusion} />
      )}
    </div>
  );
}

function InfoBlock({ label, value }) {
  return (
    <div className="rounded-lg bg-slate-50 border border-slate-100 px-3 py-2">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-0.5">{label}</p>
      <p className="text-slate-900 text-sm">{value}</p>
    </div>
  );
}

function EmptyInsights() {
  return (
    <div className="flex min-h-[360px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center gap-3">
      <span className="text-4xl">🧠</span>
      <p className="text-slate-500 text-sm max-w-xs">
        Paste your article and click <strong>Generate Content</strong> to extract ideas, tone, audience, hooks, and key points.
      </p>
    </div>
  );
}

function OutputPanel({ platform, content }) {
  const [copied, setCopied] = useState(false);
  const charCount = content ? content.length : 0;
  const pct = content ? Math.min((charCount / platform.idealMax) * 100, 100) : 0;

  async function copyContent() {
    if (!content) return;
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <article className="output-panel rounded-xl border border-slate-200 bg-white shadow-sm">
      <header className="flex items-center justify-between gap-3 border-b border-slate-200 p-4">
        <div className="flex items-center gap-3">
          <span className={`grid h-10 w-10 place-items-center rounded-lg ${platform.accent} text-sm font-bold text-white`}>
            {platform.icon}
          </span>
          <div>
            <h2 className="text-base font-bold text-slate-950">{platform.label}</h2>
            {content && (
              <p className="text-xs text-slate-400">{charCount.toLocaleString()} chars</p>
            )}
          </div>
        </div>
        <button
          onClick={copyContent}
          disabled={!content}
          className={`flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-40 ${
            copied
              ? "border-emerald-300 bg-emerald-50 text-emerald-700"
              : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
          }`}
        >
          {copied ? "✓ Copied!" : "⧉ Copy"}
        </button>
      </header>

      {content && (
        <div className="px-4 pt-3">
          <div className="h-1 w-full rounded-full bg-slate-100">
            <div
              className={`h-1 rounded-full transition-all ${pct > 90 ? "bg-amber-400" : "bg-teal-500"}`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="mt-0.5 text-right text-xs text-slate-400">
            {pct > 90 ? "Near platform limit" : "Within ideal range"}
          </p>
        </div>
      )}

      <pre className="content-pre min-h-[240px] overflow-auto p-4 text-sm leading-6 text-slate-800">
        {content || (
          <span className="text-slate-400 italic">Output will appear here after generation...</span>
        )}
      </pre>
    </article>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
