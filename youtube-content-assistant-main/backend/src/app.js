import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import contentRoutes from "./routes/content.routes.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors({ origin: "http://localhost:5173" })); // Connects to your React Vite dev server
app.use(express.json());

// Routes
app.use("/api", contentRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(500)
    .json({ error: "Something went wrong on the server orchestration layer." });
});

export default app;
