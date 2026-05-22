# 📡 AI News Digest — Multi-Agent News Pipeline

AI News Digest is an intelligent news briefing system powered by a multi-agent AI pipeline. It automatically collects real-time news from RSS feeds (BBC, Reuters) and NewsAPI across three domains — Technology, Finance, and Sports — then routes each domain through a specialized AI agent that filters, deduplicates, and summarizes the articles. A final Summary Agent merges all outputs, ranks the top stories by global impact, and delivers a clean daily briefing through a modern web dashboard.

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | FastAPI, Uvicorn |
| LLM | LLaMA 3.3 70B via Groq (free) |
| News Sources | NewsAPI, BBC RSS, Reuters RSS |
| Agent Pipeline | Custom multi-agent (Filter → Chunk → Summarize → Deduplicate → Output) |
| Frontend | HTML, CSS, JavaScript |

## Setup

1. Clone the repo
   ```bash
   git clone https://github.com/rbbhadiyar/AI-News-Digest.git
   cd AI-News-Digest
   ```

2. Install dependencies
   ```bash
   pip install -r requirements.txt
   ```

3. Create `.env` from the example
   ```bash
   cp .env.example .env
   ```
   Fill in your API keys inside `.env`:
   - **GROQ_API_KEY** → [console.groq.com](https://console.groq.com) (free)
   - **NEWS_API_KEY** → [newsapi.org](https://newsapi.org) (free tier)

4. Run
   ```bash
   python main.py
   ```

5. Open [http://localhost:8000](http://localhost:8000)

---

## Screenshots

### Empty State
> The dashboard on first load. Click **Generate Digest** to trigger the full multi-agent pipeline.

![Empty State](Assets/Screenshot%202026-05-22%20191041.png)

### Live Digest
> The final AI-generated briefing rendered as cards — Top Headlines, Tech, Finance, and Sports — each summarized by a specialized agent.

![Live Digest](Assets/Screenshot%202026-05-22%20191154.png)

---

## Demo

> A full walkthrough of the app — triggering the multi-agent pipeline, watching the skeleton loader, and seeing the final AI-generated digest rendered live across all four sections.

https://github.com/user-attachments/assets/da3da0d6-2dcb-4b0e-a5f4-98a93d559653
