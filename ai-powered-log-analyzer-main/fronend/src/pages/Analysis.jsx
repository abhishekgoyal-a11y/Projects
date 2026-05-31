import { Link, useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import UploadZone from "@/components/UploadZone";
import { Button } from "@/components/ui/button";

const Stat = ({ label, value, tone = "text-white" }) => (
  <div className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-5">
    <p className="text-sm text-zinc-400">{label}</p>
    <p className={`mt-2 text-3xl font-semibold ${tone}`}>{value}</p>
  </div>
);

const Section = ({ title, children }) => (  
  <section className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-6">
    <h2 className="text-xl font-semibold text-white">{title}</h2>
    <div className="mt-4 text-zinc-300">{children}</div>
  </section>
);

export default function Analysis() {
  const { state } = useLocation();
  const result = state?.result;
  const summary = result?.summary || {};
  const aiAnalysis = result?.aiAnalysis || {};

  if (!result) {
    return (
      <main className="min-h-screen bg-black pb-16">
        <Navbar />
        <div className="mx-auto mt-16 max-w-3xl px-6 text-center">
          <h1 className="text-4xl font-bold text-white">Run a Log Analysis</h1>
          <p className="mt-4 text-zinc-400">
            Upload a .log or .txt file to generate error detection, root cause,
            patterns, and recommendations.
          </p>
        </div>
        <UploadZone />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black pb-16">
      <Navbar />

      <div className="mx-auto mt-12 max-w-6xl px-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm uppercase tracking-widest text-zinc-500">
              Analysis Result
            </p>
            <h1 className="mt-2 text-4xl font-bold text-white">
              {result.fileName}
            </h1>
          </div>

          <Link to="/">
            <Button variant="outline">Analyze Another File</Button>
          </Link>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-5">
          <Stat label="Total Logs" value={summary.totalLogs} />
          <Stat label="Critical" value={summary.critical} tone="text-red-400" />
          <Stat label="Errors" value={summary.errors} tone="text-orange-400" />
          <Stat
            label="Warnings"
            value={summary.warnings}
            tone="text-yellow-300"
          />
          <Stat label="Info" value={summary.infos} tone="text-cyan-300" />
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1fr]">
          <Section title="Root Cause">
            <p className="leading-7">
              {aiAnalysis?.rootCause || "No root cause returned by Groq."}
            </p>
          </Section>

          <Section title="Detected Issues">
            {Object.keys(summary.topIssues || {}).length > 0 ? (
              <div className="space-y-3">
                {Object.entries(summary?.topIssues || {}).map(
                  ([issue, count]) => (
                    <div
                      key={issue}
                      className="flex items-center justify-between border-b border-zinc-800 pb-2"
                    >
                      <span>{issue}</span>
                      <span className="font-semibold text-white">{count}</span>
                    </div>
                  ),
                )}
              </div>
            ) : (
              <p>No recurring issue keywords were detected.</p>
            )}
          </Section>

          <Section title="Failure Patterns">
            {aiAnalysis?.patterns?.length ? (
              <ul className="list-disc space-y-2 pl-5">
                {aiAnalysis.patterns.map((pattern, index) => (
                  <li key={`${pattern}-${index}`}>{pattern}</li>
                ))}
              </ul>
            ) : (
              <p>No failure patterns returned by Groq.</p>
            )}
          </Section>

          <Section title="Recommendations">
            {aiAnalysis?.recommendations?.length ? (
              <ul className="list-disc space-y-2 pl-5">
                {aiAnalysis.recommendations.map((recommendation, index) => (
                  <li key={`${recommendation}-${index}`}>{recommendation}</li>
                ))}
              </ul>
            ) : (
              <p>No recommendations returned by Groq.</p>
            )}
          </Section>
        </div>

        <Section title="Sample Errors">
          {summary?.samples?.errors?.length ? (
            <pre className="overflow-x-auto whitespace-pre-wrap text-sm leading-6 text-zinc-300">
              {summary.samples.errors.join("\n")}
            </pre>
          ) : (
            <p>No error samples found.</p>
          )}
        </Section>
      </div>
    </main>
  );
}
