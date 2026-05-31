import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import ticketRoutes from "./routes/tickets.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173"
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "ai-bug-ticket-generator-api" });
});

app.use("/api/tickets", ticketRoutes);

app.use((err, _req, res, _next) => {
  const status = err.status || 500;
  res.status(status).json({
    message: err.message || "Unexpected server error"
  });
});

app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`);
});
