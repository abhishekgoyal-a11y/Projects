const express = require("express");
const router = express.Router();

const {
  getHistory,
  clearHistory,
} = require("../controllers/history.controller");

router.get("/", getHistory);

router.delete("/clear", clearHistory);

module.exports = router;
