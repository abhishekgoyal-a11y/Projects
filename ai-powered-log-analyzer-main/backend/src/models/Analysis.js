const mongoose = require("mongoose");

const analysisSchema = new mongoose.Schema(
  {
    fileName: {
      type: String,
      required: true,
    },

    summary: {
      type: Object,
      required: true,
    },

    aiAnalysis: {
      rootCause: String,
      patterns: [String],
      recommendations: [String],
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Analysis", analysisSchema);
