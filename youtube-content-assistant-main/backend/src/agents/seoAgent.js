import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

export const runSeoAgent = async (topic, scriptBlueprint) => {
  const prompt = `You are a YouTube Metadata and Search Engine Optimizer.
  Topic: ${topic}
  Script Core: ${scriptBlueprint.title}
  
  Generate punchy, bold Thumbnail overlay text and an array of high-traffic tags/hashtags.
  
  You MUST return your output strictly formatted as a valid json object with exactly these keys:
  {
    "thumbnailText": "short text string",
    "hashtags": ["tag1", "tag2", "tag3"]
  }`;

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
  });

  return JSON.parse(response.choices[0].message.content);
};
