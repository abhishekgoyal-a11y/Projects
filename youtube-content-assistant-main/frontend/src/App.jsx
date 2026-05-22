import React, { useState } from "react";
import FormSection from "./features/FormSection";
import ResultsSection from "./features/ResultsSection";
import { generateContent } from "./services/api.service";

export default function App() {
  const [aiData, setAiData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFormSubmit = async ({ niche, topic }) => {
    setLoading(true);
    setError("");
    setAiData(null);

    try {
      const result = await generateContent(niche, topic);
      setAiData(result);
    } catch (err) {
      setError("Unable to connect to backend server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-wrapper">
      <div className="bg-blur bg-blur-1"></div>
      <div className="bg-blur bg-blur-2"></div>

      <header className="hero-section">
        <div className="hero-badge">AI Powered Content Workflow</div>

        <h1>
          Create Viral YouTube
          <span> Content Faster</span>
        </h1>

        <p>
          Multi-agent AI system that researches trends, writes scripts,
          generates hooks, thumbnails, and SEO optimized hashtags instantly.
        </p>
      </header>

      <main className="main-layout">
        <FormSection onSubmit={handleFormSubmit} isLoading={loading} />

        {loading && (
          <div className="loader-card">
            <div className="spinner"></div>
            <p>AI agents are generating your content strategy...</p>
          </div>
        )}

        {error && <div className="error-box">{error}</div>}

        <ResultsSection data={aiData} />
      </main>
    </div>
  );
}
