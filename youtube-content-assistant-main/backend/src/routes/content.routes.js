import express from "express";
import { runTrendAgent } from "../agents/trendAgent.js";
import { runScriptAgent } from "../agents/scriptAgent.js";
import { runSeoAgent } from "../agents/seoAgent.js";

const router = express.Router();

router.post("/generate", async (req, res) => {
  const { niche, topic } = req.body;

  if (!niche || !topic) {
    return res
      .status(400)
      .json({ error: "Niche and Topic are required fields." });
  }

  try {
    // Agent 1: Research trends based on user inputs
    console.log("🤖 Activation: Trend Researcher Agent...");
    const trendAnalysis = await runTrendAgent(niche, topic);

    // Agent 2: Generate Title, Hook, & Script using the trend insights
    console.log("🤖 Activation: Script Writer Agent...");
    const scriptBlueprint = await runScriptAgent(topic, trendAnalysis);

    // Agent 3: Generate optimized SEO Tags and Thumbnail text using the script blueprint
    console.log("🤖 Activation: SEO Optimizer Agent...");
    const seoPack = await runSeoAgent(topic, scriptBlueprint);

    // Orchestrate everything into a structured JSON block matching your React UI structure
    const finalResponse = {
      title: scriptBlueprint.title,
      hook: scriptBlueprint.hook,
      script: scriptBlueprint.script,
      thumbnailText: seoPack.thumbnailText,
      hashtags: seoPack.hashtags,
    };

    console.log("✅ Content Generation Orchestration Complete!");
    res.json(finalResponse);
  } catch (error) {
    console.error("Multi-Agent Pipeline Error:", error);
    res
      .status(500)
      .json({
        error: "Failed to fully execute the multi-agent task workflow.",
      });
  }
});

export default router;
