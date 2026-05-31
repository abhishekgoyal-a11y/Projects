# 🤖 AI Task Execution Agent

An autonomous AI agent that accepts a high-level natural language task, breaks it into a structured plan, searches the web for real-time data, summarizes findings using an LLM, generates a professional multi-page PDF report, and optionally delivers it via email — all with a live progress dashboard in the browser.

Built as a full-stack agentic system combining a React frontend, FastAPI backend, Groq LLM inference, SerpAPI web search, and ReportLab PDF generation. The system demonstrates real-world multi-agent orchestration: a Planner Agent decomposes the task, a Summarizer Agent processes raw data into structured insights, and a Tool Router dispatches to search, report, and email tools automatically.

---

## Architecture

```
User Input (React UI)
        │
        ▼
  FastAPI Backend
        │
        ▼
  Planner Agent (Groq LLM)
        │  breaks task into steps
        ▼
  Executor (Tool Router)
  ├── Web Search Tool  (SerpAPI / Mock)
  ├── Summarizer Agent (Groq LLM)
  ├── Report Generator (ReportLab PDF)
  └── Email Sender     (SMTP)
        │
        ▼
  PDF Report + Email Delivery
```

---

## Tech Stack

| Layer     | Technology                        | Purpose                              |
|-----------|-----------------------------------|--------------------------------------|
| Frontend  | React 18 + Tailwind CSS           | Live progress UI, task input         |
| Backend   | FastAPI + Python 3.10             | REST API, background task execution  |
| AI / LLM  | Groq API — llama-3.3-70b-versatile| Task planning + summarization        |
| Search    | SerpAPI (Google Search)           | Real-time web data collection        |
| PDF       | ReportLab                         | Professional multi-page PDF reports  |
| Email     | SMTP (Gmail compatible)           | Report delivery via email            |

---

## Project Structure

```
AI Task Execution Agent/
├── backend/
│   ├── agents/
│   │   ├── planner.py        # Breaks task into ordered steps via LLM
│   │   ├── summarizer.py     # Converts raw search data into structured report
│   │   └── executor.py       # Orchestrates all tools in sequence
│   ├── tools/
│   │   ├── web_search.py     # SerpAPI integration with mock fallback
│   │   ├── report_generator.py  # ReportLab PDF builder
│   │   └── email_sender.py   # SMTP email with PDF attachment
│   ├── models/
│   │   └── task.py           # In-memory task store
│   ├── config.py             # Environment variable loader
│   └── main.py               # FastAPI app + API endpoints
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── TaskForm.jsx      # Task input form
│   │   │   ├── TaskProgress.jsx  # Live polling progress tracker
│   │   │   └── TaskHistory.jsx   # Past tasks list
│   │   └── App.jsx
│   └── package.json
├── Assets/                   # Screenshots
├── reports/                  # Generated PDFs (gitignored)
├── .env.example
├── requirements.txt
└── README.md
```

---

## Setup

### Prerequisites
- Python 3.10+
- Node.js 18+
- A [Groq API key](https://console.groq.com) (free)
- Optional: [SerpAPI key](https://serpapi.com) (free tier — 100 searches/month)
- Optional: Gmail App Password for email delivery

### 1. Clone the repository

```bash
git clone https://github.com/rbbhadiyar/AI-Task-Execution-Agent.git
cd "AI Task Execution Agent"
```

### 2. Configure environment

```bash
cp .env.example .env
```

Open `.env` and fill in your keys:

```env
GROQ_API_KEY=gsk_your_groq_key_here

# Leave blank to use mock search data (good for testing)
SERPAPI_KEY=your_serpapi_key_here

# Optional — leave blank to skip email delivery
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@gmail.com
SMTP_PASS=your_16_char_app_password
SMTP_FROM=your@gmail.com
```

### 3. Install backend dependencies

```bash
pip install -r requirements.txt
```

### 4. Run the backend

```bash
uvicorn backend.main:app --reload --port 8000
```

Backend runs at → `http://localhost:8000`

### 5. Install and run the frontend

```bash
cd frontend
npm install
npm start
```

Frontend runs at → `http://localhost:3000`

---

## Usage

1. Open `http://localhost:3000`
2. Enter a task — e.g. `"Research competitors of Notion and make a report"`
3. Enter your email address (used for delivery if SMTP is configured)
4. Click **Run Task**
5. Watch live progress: `Planning → Searching → Summarizing → Report → Email`
6. Click **Download Report** to get the PDF

### Example tasks
- `"Research competitors of Notion and summarize"`
- `"Make a market analysis report for AI coding tools"`
- `"Compare top 5 CRM tools with pricing and features"`
- `"Prepare an HTML quiz with 20 questions"`

---

## API Endpoints

| Method | Endpoint                  | Description                        |
|--------|---------------------------|------------------------------------|
| POST   | `/api/run-task`           | Start a new task (async)           |
| GET    | `/api/task/{id}`          | Get task status and step progress  |
| GET    | `/api/tasks`              | List all tasks                     |
| GET    | `/api/download/{path}`    | Download generated PDF             |

---

## Environment Variables

| Variable       | Required | Description                                  |
|----------------|----------|----------------------------------------------|
| `GROQ_API_KEY` | ✅ Yes   | Groq API key for LLM inference               |
| `SERPAPI_KEY`  | ❌ No    | SerpAPI key — blank uses mock search data    |
| `SMTP_HOST`    | ❌ No    | SMTP server (default: smtp.gmail.com)        |
| `SMTP_PORT`    | ❌ No    | SMTP port (default: 587)                     |
| `SMTP_USER`    | ❌ No    | Email login — blank skips email delivery     |
| `SMTP_PASS`    | ❌ No    | Gmail App Password (not your real password)  |
| `SMTP_FROM`    | ❌ No    | Sender address (defaults to SMTP_USER)       |

> Gmail users: generate an [App Password](https://support.google.com/accounts/answer/185833) under Google Account → Security → 2-Step Verification → App Passwords.

---

## Generated Report Structure

Each PDF report includes:
- **Cover page** — dark themed with task title and generation timestamp
- **Execution Plan** — numbered steps the agent followed
- **Executive Summary** — high-level overview
- **Background & Context** — history and current state of the topic
- **Key Findings** — 8+ detailed bullet points
- **Detailed Analysis** — trends, patterns, strengths and weaknesses
- **Comparison Table** — structured data comparison
- **Step-by-Step Workflow** — process breakdown
- **Insights & Recommendations** — actionable takeaways
- **Conclusion** — summary and future outlook
- **Workflow Diagram** — visual execution flow with arrows

---

## Screenshots

### Dashboard — Task Input & Live Progress
![Dashboard](Assets/Screenshot%202026-05-25%20054410.png)

### Task History & Completed Report
![Report](Assets/Screenshot%202026-05-25%20054607.png)

---

## Demo Video

Watch the full end-to-end demo — entering a task, live progress tracking, and downloading the generated PDF report.

https://github.com/user-attachments/assets/16f038b0-a737-4096-bbc7-52cce380b5df

---

## Notes

- If `SERPAPI_KEY` is blank or a placeholder, the system automatically uses mock search data — useful for testing without an API key
- Reports are saved to the `reports/` directory (gitignored)
- The backend uses FastAPI `BackgroundTasks` for async execution — the UI polls every 2 seconds for live updates
- All task state is stored in-memory — restarting the backend clears task history

---

## Sample Generated Report

> Task: **"Compare top 5 CRM tools and email me analysis"**
> Generated on May 25, 2026 at 05:44 — 5 pages, fully structured PDF

### Execution Plan

1. Research top 5 CRM tools
2. Gather features and pricing information
3. Compare tools based on key criteria
4. Analyze strengths and weaknesses of each tool
5. Compile comparison report
6. Write email with analysis and recommendations
7. Send email to recipient

### Executive Summary

The CRM software market is highly competitive, with numerous top-rated options available to businesses. This report provides an in-depth analysis of the top 5 CRM tools — Salesforce Sales Cloud, HubSpot Sales Hub, ActiveCampaign, ClickUp, and Close — consistently ranked highly by users and reviewers. The report covers key findings, detailed analysis, and a comparison of these tools, providing insights and recommendations for businesses looking to implement a CRM solution.

### Key Findings

- **Salesforce Sales Cloud** — Advanced sales forecasting, marketing automation, and customer service management. Highly scalable for large enterprises but complex and expensive to implement.
- **HubSpot Sales Hub** — Sales and marketing automation with strong ease-of-use. Affordable for SMBs but may lack advanced features of enterprise tools.
- **ActiveCampaign** — Email marketing automation combined with sales and customer service tools. Popular with SMBs for its affordability and simplicity.
- **ClickUp** — Project management + CRM hybrid with sales automation. Free tier available, ideal for small teams on a budget.
- **Close** — Sales-focused CRM with built-in calling and email automation. Strong for inside sales teams at competitive pricing.
- All 5 tools offer email integration, though depth varies significantly between platforms.
- Customization options range from basic (ClickUp, Close) to highly advanced (Salesforce).
- Pricing ranges from $0/month (ClickUp free) to custom enterprise pricing (Salesforce).

### Comparison Table

| CRM Tool | Key Features | Pricing | Customization | Email Integration |
|---|---|---|---|---|
| Salesforce Sales Cloud | Sales forecasting, marketing automation, customer service | Custom enterprise pricing | Advanced | Advanced |
| HubSpot Sales Hub | Sales automation, marketing automation, customer service | $50–$1,200/month | Limited | Basic |
| ActiveCampaign | Email marketing automation, sales automation, customer service | $9–$129/month | Limited | Basic |
| ClickUp | Project management, sales automation, customer service | $0–$19/month | Limited | Basic |
| Close | Sales automation, marketing automation, customer service | $29–$129/month | Limited | Basic |

### Insights & Recommendations

- **Large enterprises** → Salesforce Sales Cloud for its scalability and advanced feature set
- **SMBs on a budget** → HubSpot Sales Hub or ActiveCampaign for ease of use and affordability
- **Startups / small teams** → ClickUp free tier to get started with zero cost
- **Inside sales teams** → Close for its built-in calling and email-first workflow
- Always evaluate total cost of ownership — implementation, training, and integrations add to base pricing

### Execution Workflow Diagram (from PDF)

```
┌─────────────────────────────────────────┐
│  Step 1: Research top 5 CRM tools       │
└────────────────────┬────────────────────┘
                     ▼
┌─────────────────────────────────────────┐
│  Step 2: Gather features & pricing      │
└────────────────────┬────────────────────┘
                     ▼
┌─────────────────────────────────────────┐
│  Step 3: Compare tools on key criteria  │
└────────────────────┬────────────────────┘
                     ▼
┌─────────────────────────────────────────┐
│  Step 4: Analyze strengths & weaknesses │
└────────────────────┬────────────────────┘
                     ▼
┌─────────────────────────────────────────┐
│  Step 5: Compile comparison report      │
└────────────────────┬────────────────────┘
                     ▼
┌─────────────────────────────────────────┐
│  Step 6: Write email with analysis      │
└────────────────────┬────────────────────┘
                     ▼
┌─────────────────────────────────────────┐
│  Step 7: Send email to recipient        │
└─────────────────────────────────────────┘
```

> The full PDF report is a professionally formatted multi-page document with a dark cover page, blue-themed section headings, styled comparison tables, and the above workflow diagram rendered as vector graphics.
