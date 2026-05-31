const groq = require("../config/groq");

const parseJsonResponse = (content) => {
  try {
    return JSON.parse(content);
  } catch {
    const match = content.match(/\{[\s\S]*\}/);

    if (!match) {
      return {
        rootCause: content,
        patterns: [],
        recommendations: [],
      };
    }

    try {
      return JSON.parse(match[0]);
    } catch {
      return {
        rootCause: content,
        patterns: [],
        recommendations: [],
      };
    }
  }
};

const generateRCA = async (summary) => {
  const prompt = `
You are a senior Site Reliability Engineer.

Analyze this log summary.

${JSON.stringify(summary, null, 2)}

Return:

1. Root Cause
2. Failure Patterns
3. Recommendations

Respond in JSON format:
{
  "rootCause": "",
  "patterns": [],
  "recommendations": []
}
`;

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content:
          "Return only valid JSON. Do not wrap the response in markdown.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.2,
  });

  return parseJsonResponse(response.choices[0].message.content);
};

module.exports = {
  generateRCA,
};
