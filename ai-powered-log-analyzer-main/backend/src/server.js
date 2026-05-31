const connectDB = require("./config/db");
require("dotenv").config();

const express = require("express");
const cors = require("cors");

const analyzeRoute = require("./routes/analyze.route");

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

connectDB();

const historyRoute = require("./routes/history.route");

app.use("/api/history", historyRoute);

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Backend Running",
  });
});

app.use("/api/analyze", analyzeRoute);

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
