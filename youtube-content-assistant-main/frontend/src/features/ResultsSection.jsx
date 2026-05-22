import React from "react";

export default function ResultsSection({ data }) {
  if (!data) return null;

  const { title, hook, script, thumbnailText, hashtags } = data;

  // Helper function to handle inline bolding for keys/headings within a single line
  const renderInlineFormatting = (text) => {
    // 1. Remove any remaining raw markdown bold markers safely
    const cleanText = text.replace(/\*\*/g, "");

    // 2. Check if the line has a title pattern like "1. Hook:" or "Introduction: This is..."
    // This looks for a colon separating a key heading from its description
    if (cleanText.includes(":")) {
      const parts = cleanText.split(":");
      const heading = parts[0];
      const restOfText = parts.slice(1).join(":"); // Rejoin in case there were multiple colons

      return (
        <>
          <strong>{heading}:</strong>
          {restOfText}
        </>
      );
    }

    // 3. Check for bullet points starting with a dash or dot to bold the phrase up to the first dash/comma
    if (
      cleanText.startsWith("-") ||
      cleanText.startsWith("•") ||
      /^\d+\./.test(cleanText)
    ) {
      const match = cleanText.match(/^([\s•\-\d\.]+\s*)([^,\-\.]+)(.*)$/);
      if (match) {
        const [_, prefix, mainHeading, bodyText] = match;
        return (
          <>
            {prefix}
            <strong>{mainHeading}</strong>
            {bodyText}
          </>
        );
      }
    }

    return cleanText;
  };

  // Main function to format long blocks of text (like the video script) into stylized blocks
  const formatScriptText = (rawText) => {
    if (!rawText) return null;

    return rawText.split("\n").map((line, index) => {
      let trimmedLine = line.trim();
      if (!trimmedLine) return <div key={index} style={{ height: "16px" }} />;

      // Strip structural markdown headings (e.g., ### Section)
      trimmedLine = trimmedLine.replace(/^#+\s*/, "");

      // Detect if the line is a major structural section boundary wrapper
      const isStructuralHeader =
        (trimmedLine.startsWith("[") && trimmedLine.endsWith("]")) ||
        (trimmedLine.toUpperCase() === trimmedLine &&
          trimmedLine.length < 30 &&
          !trimmedLine.includes(":"));

      if (isStructuralHeader) {
        // Strip structural brackets for cleaner display
        const polishedHeader = trimmedLine.replace(/[\[\]]/g, "");
        return (
          <h4 key={index} className="script-scene-header">
            🎬 {polishedHeader}
          </h4>
        );
      }

      // Standard line with potential inner inline formatting rules applied
      return (
        <p key={index} className="script-paragraph">
          {renderInlineFormatting(trimmedLine)}
        </p>
      );
    });
  };

  return (
    <section className="results-wrapper">
      <div className="result-box featured-box">
        <h3>🎯 Optimized Viral Title</h3>
        <p className="main-title">{title}</p>
      </div>

      <div className="result-box">
        <h3>🪝 Retention-Engine Hook</h3>
        <p className="hook-text">{renderInlineFormatting(hook)}</p>
      </div>

      <div className="result-box">
        <h3>📖 Multi-Agent Narrative Script</h3>
        <div className="script-area">{formatScriptText(script)}</div>
      </div>

      <div className="grid-layout">
        <div className="result-box">
          <h3>🖼️ High-CTR Thumbnail Text</h3>
          <div className="thumbnail-preview">{thumbnailText}</div>
        </div>

        <div className="result-box">
          <h3>🚀 Search Engine Tags</h3>
          <div className="tags-wrapper">
            {hashtags?.map((tag, index) => (
              <span key={index} className="tag">
                #{tag.replace("#", "").trim()}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
