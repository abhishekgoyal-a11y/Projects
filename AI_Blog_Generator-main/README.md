# AI Blog Writing Agent

An AI-powered long-form blog generation system built using **LangGraph**, **Groq LLMs**, **Tavily Search**, and **Streamlit**.

This project generates editorial blogs with:

- Research-backed content
- Humanized writing
- Structured long-form sections
- Modern publication-style UI
- Persistent blog storage
- Table of contents navigation
- Execution plan & evidence display

---
# Live Link
Try it here - https://ai-blogwriter.streamlit.app/


# Video Demo
https://github.com/user-attachments/assets/fb6747c0-5609-4a6e-9abb-a4884e281a41

# Features

- Multi-agent AI workflow using LangGraph
- Research + writing orchestration
- Markdown blog generation
- Streamlit publication-quality frontend
- Persistent blog saving
- Session history
- Table of contents navigation
- Research evidence tracking
- Long-form structured writing
- SEO-friendly formatting
- Optimized for Groq API
- Tavily web search integration

---

# Tech Stack

- Python 3.10+
- LangGraph
- LangChain
- Groq LLM API
- Tavily Search API
- Streamlit
- Markdown Rendering

---

# Project Structure

```text
AI-BLOG-WRITER/
│
├── agents/
│   ├── editor_agent.py
│   ├── orchestrator_agent.py
│   ├── research_agent.py
│   ├── router_agent.py
│   └── writer_agent.py
│
├── generated_blogs/
│   └── Generated markdown blogs are stored here
│
├── models/
│   ├── schemas.py
│   └── state.py
│
├── prompts/
│   ├── editor_prompt.py
│   ├── orchestrator_prompt.py
│   ├── research_prompt.py
│   ├── router_prompt.py
│   └── writer_prompt.py
│
├── tools/
│   └── web_search.py
│
├── utils/
│   └── config.py
│
├── workflow/
│   └── blog_workflow.py
│
├── .env
├── frontend.py
├── main.py
├── requirements.txt
└── README.md
```

---

# Folder Explanation

## `agents/`

Contains all AI agents responsible for the workflow.

### `router_agent.py`

Decides whether web research is required.

### `research_agent.py`

Performs Tavily-based web research and evidence collection.

### `orchestrator_agent.py`

Creates the blog structure, sections, and execution plan.

### `writer_agent.py`

Generates detailed long-form blog sections.

### `editor_agent.py`

Humanizes and refines the final blog for SEO optimization.

---

## `generated_blogs/`

Stores all generated blogs automatically as `.md` markdown files.

Example:

```text
generated_blogs/
├── AI_Hallucinations.md
├── Future_of_AI.md
└── Parenting_Guide.md
```

---

## `models/`

Contains application schemas and workflow state definitions.

### `schemas.py`

Defines Pydantic schemas for plans, tasks, evidence, etc.

### `state.py`

Defines LangGraph workflow state management.

---

## `prompts/`

Contains all system prompts for the AI agents.

Each agent has its own prompt engineering file.

---

## `tools/`

Contains external integrations.

### `web_search.py`

Handles Tavily web search integration.

---

## `utils/`

Contains shared configuration utilities.

### `config.py`

Initializes:

- Groq LLM
- Tavily API
- Model configuration
- Environment variables

---

## `workflow/`

Contains LangGraph orchestration logic.

### `blog_workflow.py`

Defines:

- Nodes
- Edges
- Graph execution flow
- Sequential blog generation pipeline

---

## `frontend.py`

Main Streamlit frontend.

Features:

- Blog generation UI
- Sidebar controls
- TOC navigation
- Blog rendering
- Session history
- Evidence display
- Logs & execution plan

---

## `main.py`

Optional project entry point.

---

# Environment Setup

This project is optimized for:

- **Groq API**
- **Tavily Search API**

Create a `.env` file in the root directory.

Example:

```env
# GROQ
GROQ_API_KEY=your_groq_api_key_here

# TAVILY
TAVILY_API_KEY=your_tavily_api_key_here
```

---

# Installation

## 1. Clone Repository

```bash
git clone <your_repo_url>
cd AI-BLOG-WRITER
```

## 2. Create Virtual Environment

```bash
python -m venv venv
```

Activate:

### Windows

```bash
venv\Scripts\activate
```

### Mac/Linux

```bash
source venv/bin/activate
```

## 3. Install Dependencies

```bash
pip install -r requirements.txt
```

---

# Run Project

```bash
streamlit run frontend.py
```

---

# Workflow Overview

```text
User Input
   ↓
Router Agent
   ↓
Research Agent (Optional)
   ↓
Orchestrator Agent
   ↓
Writer Agent
   ↓
Editor Agent
   ↓
Final Blog
   ↓
Save to generated_blogs/
```

## Workflow Diagram

<img width="1622" height="969" alt="workflow" src="https://github.com/user-attachments/assets/766fcbb5-daa0-46e2-b80e-aa95b7053479" />

---

# Output Features

Generated blogs include:

- Long-form sections
- Structured headings
- TOC navigation
- Research-backed content
- Editorial formatting
- Markdown export
<img width="1917" height="974" alt="image" src="https://github.com/user-attachments/assets/60d5e107-9684-4218-b1ce-ad6091707a1e" />
<img width="1919" height="1031" alt="image" src="https://github.com/user-attachments/assets/95447de7-bd71-433a-be55-a126a8d44f73" />
<img width="1919" height="1031" alt="image" src="https://github.com/user-attachments/assets/1b1e8fe5-0932-41a7-89c9-b0d7b5f70c8a" />
<img width="1919" height="1030" alt="image" src="https://github.com/user-attachments/assets/734652ec-d64a-4580-a9d1-849b5d654039" />
<img width="1919" height="1025" alt="image" src="https://github.com/user-attachments/assets/1e1eb956-927e-477b-8553-988b51288c99" />
<img width="1919" height="1025" alt="image" src="https://github.com/user-attachments/assets/3b0f54da-565e-4a52-a04c-a82fd044acc0" />
<img width="1919" height="1014" alt="image" src="https://github.com/user-attachments/assets/8cac4e62-27b9-4dac-919f-1fea6ce3d459" />
<img width="1917" height="1028" alt="image" src="https://github.com/user-attachments/assets/b907cebd-8af8-4528-b63d-ddea95eb658a" />
<img width="1919" height="1028" alt="image" src="https://github.com/user-attachments/assets/81a4b82d-0e08-467c-856b-5c7093ccfcca" />


---

# Notes

- Optimized primarily for **Groq LLM inference speed**
- Tavily improves factual accuracy and freshness
- Streamlit frontend designed for publication-style reading
- Blogs are saved automatically

---
