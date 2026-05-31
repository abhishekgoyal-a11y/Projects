import { Router } from "express";
import { z } from "zod";
import { generateBugTicket } from "../services/groqService.js";
import { createJiraIssue, getJiraCreateMetadata } from "../services/jiraService.js";
import { summarizeLogMetadata } from "../utils/logParser.js";

const router = Router();

const generateSchema = z.object({
  logs: z.string().min(20, "Please provide at least 20 characters of logs."),
  source: z.string().optional().default("unknown-service"),
  severityHint: z.string().optional().default("Auto")
});

const jiraSchema = z.object({
  ticket: z.object({
    title: z.string().min(3),
    description: z.string().min(10),
    severity: z.string().optional().default("Medium"),
    labels: z.array(z.string()).optional().default([])
  })
});

router.post("/generate", async (req, res, next) => {
  try {
    const payload = generateSchema.parse(req.body);
    const metadata = summarizeLogMetadata(payload.logs);
    const ticket = await generateBugTicket({ ...payload, metadata });

    res.json({
      ticket,
      metadata
    });
  } catch (error) {
    next(error);
  }
});

router.post("/create-jira", async (req, res, next) => {
  try {
    const { ticket } = jiraSchema.parse(req.body);
    const issue = await createJiraIssue(ticket);
    res.status(201).json(issue);
  } catch (error) {
    next(error);
  }
});

router.get("/jira-metadata", async (_req, res, next) => {
  try {
    const metadata = await getJiraCreateMetadata();
    res.json(metadata);
  } catch (error) {
    next(error);
  }
});

export default router;
