const express = require("express");
const multer = require("multer");

const router = express.Router();

const { analyzeLog } = require("../controllers/analyze.controller");

const upload = multer({
  dest: "uploads/",
});

router.post("/", upload.single("logFile"), analyzeLog);

module.exports = router;
