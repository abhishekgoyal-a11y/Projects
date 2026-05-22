import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

// Pointing OpenAI SDK securely at Groq's custom hardware base URL
const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

export const runTrendAgent = async (niche, topic) => {
  const prompt = `You are an elite YouTube Trend Researcher.
  Niche: ${niche}
  Topic: ${topic}
  
  Analyze target audience psychological pain points, trending viral angles, and high click-through hook directions. 
  Provide your analysis clearly and concisely.`;

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
  });

  return response.choices[0].message.content;
};
