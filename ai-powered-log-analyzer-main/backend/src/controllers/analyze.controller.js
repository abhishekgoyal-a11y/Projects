const fs = require("fs");

const { parseLogs } = require("../services/parser.service");
const { classifyLogs } = require("../services/classifier.service");
const { generateRCA } = require("../services/groq.service");

const Analysis = require("../models/Analysis");

const analyzeLog = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const content = fs.readFileSync(req.file.path, "utf-8");

    const parsedLogs = parseLogs(content);

    const summary = classifyLogs(parsedLogs);

    const aiAnalysis = await generateRCA(summary);

    const analysis = await Analysis.create({
      fileName: req.file.originalname,
      summary,
      aiAnalysis,
    });

    return res.status(200).json({
      success: true,
      analysis,
    });
  } catch (error) {
    console.error("Analyze Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  analyzeLog,
};
