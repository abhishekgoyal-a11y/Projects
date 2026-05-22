import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

export const runScriptAgent = async (topic, trendInsights) => {
  const prompt = `You are a world-class, professional YouTube Script Writer specializing in creating perfectly paced video scripts.
  Topic: ${topic}
  Trend Insights: ${trendInsights}
  
  Your task is to write a complete script blueprint.
  
  CRITICAL PACING & TIMESTAMPS INSTRUCTIONS:
  1. DURATION FALLBACK: Analyze the user's Topic description. If the user explicitly mentions a target time or video length (e.g., "5-minute video", "short 2 min clip", "quick 60s guide"), write the script and pace the timeline to match that request. If NO time is specified, automatically default to a comprehensive 10-15 minute video script.
  2. Map out incremental, minute-by-minute timestamps distributed across the entire script block starting from 0:00 and concluding at your calculated final duration target (e.g., use entries like "0:00 - 1:30 [Intro]", "1:30 - 5:00 [Core Point 1]").
  3. Write fully fleshed-out dialogue lines matching that total length. Do not leave blank placeholders.
  
  You MUST return your output strictly formatted as a valid json object with exactly these keys:
  {
    "title": "the script title string",
    "hook": "the opening hook sequence string",
    "script": "the main content script string containing fully detailed dialogue blocks with precise timestamps fitting the requested or default minutes duration"
  }`;

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
  });

  return JSON.parse(response.choices[0].message.content);
};
