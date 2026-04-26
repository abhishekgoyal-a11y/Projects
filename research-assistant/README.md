# AI Agentic Research Assistant

A production-ready multi-agent AI system that answers questions using a local knowledge base (RAG) first, falls back to live web search when needed, learns from every search, and returns answers with cited sources.

---

## What It Does

1. You ask a question
2. **Retriever Agent** searches the local FAISS vector store
3. If no strong match → **Research Agent** searches DuckDuckGo, scrapes top URLs, summarizes content, and stores it in FAISS
4. **Synthesizer Agent** combines all findings into a final answer with sources
5. Next time you ask something similar → answered instantly from memory (no web search)

---

## Architecture

```
User Question
      │
      ▼
┌─────────────────────┐
│   Retriever Agent   │──── FAISS Vector Store (local, persistent)
└─────────────────────┘
      │
      │ (weak/no match)
      ▼
┌─────────────────────┐
│   Research Agent    │──── DuckDuckGo → Scraper → Summarizer → FAISS (store)
└─────────────────────┘
      │
      ▼
┌─────────────────────┐
│ Synthesizer Agent   │──── Final Answer + Sources
└─────────────────────┘
      │
      ▼
   Response
```

---

## Tech Stack

| Layer       | Technology                                           |
|-------------|------------------------------------------------------|
| Backend     | Python 3.12, FastAPI, Uvicorn                        |
| Agents      | CrewAI 0.86 (multi-agent orchestration)              |
| LLM         | Groq API — LLaMA 3.3 70B Versatile                   |
| Embeddings  | HuggingFace `all-MiniLM-L6-v2` (local, free)         |
| Vector DB   | FAISS (persisted to disk)                            |
| RAG         | LangChain (text splitting, retrieval)                |
| Web Search  | DuckDuckGo Search (no API key required)              |
| Scraping    | BeautifulSoup + aiohttp                              |
| Frontend    | React 18, Vite, Tailwind CSS, React Markdown         |
| HTTP Client | Axios                                                |

---

## Project Structure

```
research-assistant/
├── backend/
│   ├── app/
│   │   ├── main.py                  # FastAPI app, /query and /health endpoints
│   │   ├── agent/
│   │   │   ├── config.py            # Agent role/goal/backstory constants
│   │   │   ├── crew.py              # ResearchCrew — full pipeline orchestration
│   │   │   ├── tasks.py             # CrewAI Task definitions per agent
│   │   │   └── tools.py             # RAGSearchTool, WebResearchTool, StoreKnowledgeTool
│   │   ├── rag/
│   │   │   ├── embeddings.py        # HuggingFace embeddings factory
│   │   │   ├── memory.py            # FAISS load/save/chunk wrapper
│   │   │   └── retriever.py         # Similarity search with scoring threshold
│   │   ├── web/
│   │   │   ├── search.py            # DuckDuckGo search wrapper
│   │   │   └── scraper.py           # Async BeautifulSoup HTML scraper
│   │   └── utils/
│   │       ├── logger.py            # Structured stdout logging
│   │       └── summarizer.py        # LLM-based summarizer and answer synthesizer
│   ├── data/
│   │   └── vector_store/            # FAISS index persisted here
│   ├── requirements.txt
│   └── .env.example
│
└── frontend/
    ├── src/
    │   ├── App.jsx                  # Root layout + backend health polling
    │   ├── main.jsx                 # React entry point
    │   ├── api.js                   # Axios client (proxied through Vite)
    │   ├── styles.css               # Tailwind base + custom dark theme
    │   └── components/
    │       ├── Chat.jsx             # Chat state, submit handler, loading
    │       ├── Message.jsx          # Message bubble, markdown, sources list
    │       └── InputBox.jsx         # Auto-resize textarea, send button
    ├── index.html
    ├── package.json
    ├── vite.config.js               # Dev server + proxy to backend
    ├── tailwind.config.js
    └── postcss.config.js
```

---

## Prerequisites

| Requirement   | Version  | Notes                                     |
|---------------|----------|-------------------------------------------|
| Python        | 3.12     | Must be 3.12 — CrewAI requires `<=3.13`   |
| Node.js       | 18+      |                                           |
| Groq API Key  | —        | Free at [console.groq.com](https://console.groq.com) |

---

## Setup & Installation

### 1. Clone / enter the project

```bash
cd research-assistant
```

### 2. Backend setup

```bash
cd backend

# Create virtual environment with Python 3.12 specifically
python3.12 -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

> **First install takes 3–5 minutes** — it downloads PyTorch + the HuggingFace embedding model (~90 MB cached after first run).

### 3. Configure environment

```bash
cp .env.example .env
```

Open `.env` and set your Groq API key:

```env
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

Get a free key at [console.groq.com](https://console.groq.com) → API Keys → Create Key.

### 4. Fix SSL certificates (macOS + corporate networks)

If your machine uses a corporate proxy (e.g. Zscaler), Python's certificate bundle won't trust the proxy's CA. Run this once:

```bash
# From inside backend/ with venv active
CERTIFI_PATH=$(python -c "import certifi; print(certifi.where())")
security find-certificate -a -p /Library/Keychains/System.keychain >> "$CERTIFI_PATH"
security find-certificate -a -p /System/Library/Keychains/SystemRootCertificates.keychain >> "$CERTIFI_PATH"
```

### 5. Frontend setup

```bash
cd ../frontend
npm install
```

---

## Running the App

> **Always start the backend before the frontend.**

### Terminal 1 — Backend

```bash
cd backend
source venv/bin/activate
uvicorn app.main:app --reload
```

Wait for:
```
INFO: Application startup complete.
```

The API is now live at **http://127.0.0.1:8000**

### Terminal 2 — Frontend

```bash
cd frontend
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## Environment Variables

| Variable              | Default                    | Description                                      |
|-----------------------|----------------------------|--------------------------------------------------|
| `GROQ_API_KEY`        | *(required)*               | Groq API key                                     |
| `GROQ_MODEL`          | `llama-3.3-70b-versatile`  | Groq model for all agents and summarization      |
| `EMBEDDING_MODEL`     | `all-MiniLM-L6-v2`         | Local HuggingFace model for FAISS embeddings     |
| `VECTOR_STORE_PATH`   | `./data/vector_store`      | Where FAISS index is saved                       |
| `CHUNK_SIZE`          | `800`                      | Characters per text chunk                        |
| `CHUNK_OVERLAP`       | `100`                      | Overlap between chunks                           |
| `MAX_SEARCH_RESULTS`  | `5`                        | Max DuckDuckGo URLs to fetch per query           |
| `MIN_SIMILARITY_SCORE`| `0.3`                      | RAG relevance threshold (0–1, lower = stricter)  |
| `LOG_LEVEL`           | `INFO`                     | Logging verbosity (`DEBUG`, `INFO`, `WARNING`)   |
| `CORS_ORIGINS`        | `http://localhost:5173,...` | Allowed frontend origins                        |

---

## API Reference

### `GET /health`

Check if the backend and crew are ready.

```bash
curl http://127.0.0.1:8000/health
```

```json
{"status": "ok", "crew_ready": true}
```

---

### `POST /query`

Submit a research question.

```bash
curl -X POST http://127.0.0.1:8000/query \
  -H "Content-Type: application/json" \
  -d '{"question": "What is quantum computing?"}'
```

**Request:**
```json
{
  "question": "string (1–2000 chars)"
}
```

**Response:**
```json
{
  "answer": "Markdown-formatted answer...",
  "sources": [
    "https://example.com/article-1",
    "https://example.com/article-2"
  ]
}
```

---

### `GET /test-groq`

Smoke test — verifies Groq API connectivity.

```bash
curl http://127.0.0.1:8000/test-groq
```

```json
{"status": "ok", "response": "WORKING"}
```

---

## How the Pipeline Works

```
POST /query  {"question": "..."}
      │
      ▼
ResearchCrew.run(query)
      │
      ├── [Step 1] Retriever Agent
      │       calls → knowledge_base_search tool
      │       → FAISS similarity search
      │       → returns context + has_relevant flag
      │
      ├── [Step 2] Research Agent  (only if RAG weak/empty)
      │       calls → web_research tool
      │       │         → DuckDuckGo search (top 5 URLs)
      │       │         → Async scrape each URL
      │       │         → LLM summarize each page
      │       calls → store_knowledge tool
      │                 → chunk + embed + save to FAISS
      │
      └── [Step 3] Synthesizer Agent
              receives → RAG context + web summaries
              → LLM generates final markdown answer
              → extract all URLs as sources
      │
      ▼
{"answer": "...", "sources": [...]}
```

---

## Groq Model Options

Change `GROQ_MODEL` in `.env` to swap models:

| Model                          | Speed    | Quality  | Use case                  |
|-------------------------------|----------|----------|---------------------------|
| `llama-3.3-70b-versatile`      | Fast     | High     | Default, best balance     |
| `llama-3.1-8b-instant`         | Fastest  | Medium   | Quick answers, low cost   |
| `mixtral-8x7b-32768`           | Fast     | High     | Long context queries      |
| `llama3-70b-8192`              | Fast     | High     | Alternative 70B           |

---

## Self-Test

Run these two queries in sequence to verify the full pipeline:

**Query 1** — cold start, empty knowledge base (triggers web search):
```bash
curl -s -X POST http://127.0.0.1:8000/query \
  -H "Content-Type: application/json" \
  -d '{"question": "What is retrieval augmented generation?"}' | python3 -m json.tool
```

**Query 2** — same topic (should now use stored memory, faster response):
```bash
curl -s -X POST http://127.0.0.1:8000/query \
  -H "Content-Type: application/json" \
  -d '{"question": "How does RAG improve LLM responses?"}' | python3 -m json.tool
```

The second query will skip the web search and answer from FAISS.

---

## Troubleshooting

| Problem | Cause | Fix |
|---------|-------|-----|
| `SSL: CERTIFICATE_VERIFY_FAILED` | Corporate proxy (Zscaler etc.) | Run the SSL fix in step 4 |
| `crewai` not found during install | Python 3.14 (unsupported) | Use `python3.12 -m venv venv` |
| Frontend shows `Offline` | Backend not started yet | Start backend first, then frontend |
| `ETIMEDOUT 127.0.0.1:8000` | Frontend started before backend | Restart frontend after backend is ready |
| `GROQ_API_KEY not set` | Missing `.env` file | Run `cp .env.example .env` and add key |
| Slow first startup | Downloading embedding model (~90 MB) | Wait ~30s; subsequent starts are instant |

---

## Notes

- The FAISS vector store persists in `backend/data/vector_store/`. Delete that folder to clear memory and start fresh.
- The embedding model (`all-MiniLM-L6-v2`) is downloaded once and cached by HuggingFace in `~/.cache/huggingface/`.
- Groq's free tier has rate limits. If you hit them, wait a few seconds and retry.
- The frontend proxies all API calls through Vite's dev server to avoid CORS issues.
