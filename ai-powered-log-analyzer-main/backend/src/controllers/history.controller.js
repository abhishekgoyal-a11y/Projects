const Analysis = require("../models/Analysis");

const getHistory = async (req, res) => {
  try {
    const analyses = await Analysis.find().sort({ createdAt: -1 });

    res.json(analyses);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const clearHistory = async (req, res) => {
  try {
    await Analysis.deleteMany({});

    res.status(200).json({
      success: true,
      message: "History cleared successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getHistory,
  clearHistory,
};