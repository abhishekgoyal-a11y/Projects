# Customer Support Agent Simulator

A Streamlit web app that turns your product documentation into a live customer support chatbot. Upload PDFs or paste FAQ content to build a knowledge base, then let the AI agent answer customer questions using only your docs — and automatically flag cases it can't resolve for human escalation. Powered by [LangChain](https://www.langchain.com/), [Chroma](https://www.trychroma.com/), and the [Groq API](https://console.groq.com/).

## Features

- **RAG-powered answers** — responses grounded in your uploaded documentation
- **Multi-source ingestion** — accepts PDF files, TXT files, or pasted FAQ text
- **Custom persona** — configure the agent's name and the product/company name
- **Escalation detection** — automatically flags responses when the agent lacks enough information
- **Persistent chat history** within the session

## Prerequisites

- Python 3.9+
- A Groq API key from [Groq Console](https://console.groq.com/)

## Setup

### 1. Create a virtual environment

```bash
python3 -m venv venv
source venv/bin/activate
```

### 2. Install dependencies

```bash
pip3 install -r requirements.txt
```

### 3. Configure the API key

```bash
mkdir -p .streamlit
```

Create `.streamlit/secrets.toml` with:

```toml
GROQ_API_KEY = "your_groq_api_key_here"
```

### 4. Run the app

```bash
source venv/bin/activate  # skip if already active
streamlit run app.py
```

Open your browser to **http://localhost:8501**

## Usage

1. In the sidebar, enter your product/company name and agent persona name.
2. Upload PDF or TXT documentation files, or paste FAQ content into the text area.
3. Click **Build Support KB** to index the content (uses `sentence-transformers/all-MiniLM-L6-v2` for embeddings).
4. Ask customer questions in the chat interface.
5. Responses flagged for escalation are highlighted with a warning banner.

## Notes

- Documentation input is capped at 20 000 characters.
- The agent will not fabricate answers — it explicitly escalates when information is absent.
- The vector store is held in memory and resets on page refresh; rebuild the KB each session.
