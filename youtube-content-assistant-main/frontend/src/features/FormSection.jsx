import React, { useState } from "react";

export default function FormSection({ onSubmit, isLoading }) {
  const [niche, setNiche] = useState("");
  const [topic, setTopic] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!niche || !topic) {
      return alert("Please fill all fields");
    }

    onSubmit({ niche, topic });
  };

  return (
    <section className="glass-card">
      <div className="section-heading">
        <h2>Plan Your Next Viral Video</h2>
        <p>
          Enter your niche and topic to generate a complete content blueprint
          powered by AI agents.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label>Niche</label>

          <input
            type="text"
            placeholder="Fitness, Coding, Finance..."
            value={niche}
            onChange={(e) => setNiche(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div className="input-group">
          <label>Video Topic</label>

          <input
            type="text"
            placeholder="Morning Workout Routine..."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Generating Content..." : "Generate AI Content"}
        </button>
      </form>
    </section>
  );
}
