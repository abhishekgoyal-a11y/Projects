# RAG Document Chatbot

A command-line chatbot that answers questions about a PDF using Retrieval-Augmented Generation (RAG). Remembers conversation history so you can ask follow-up questions.

## How it works

1. `ingest.py` loads a PDF, splits it into chunks, embeds them with a local HuggingFace model, and saves a FAISS index to disk
2. `chatbot.py` loads that index and runs an interactive chat loop — every question retrieves relevant chunks and passes them to Groq's LLM

## Setup

```bash
python3 -m venv .venv
source .venv/bin/activate
pip3 install -r requirements.txt

export GROQ_API_KEY="gsk_..."
```

## Usage

```bash
# Step 1 — build the index from your PDF (run once)
python3 ingest.py your_document.pdf

# Step 2 — start chatting
python3 chatbot.py
```

## Project structure

```
rag-document-chatbot/
├── ingest.py        # load → chunk → embed → save FAISS index
├── chatbot.py       # load index → RAG chain → chat loop
├── requirements.txt
└── faiss_index/     # created by ingest.py
```

## Stack

| Component | Library | Notes |
|-----------|---------|-------|
| LLM | `langchain-groq` | `llama-3.3-70b-versatile` |
| Embeddings | `langchain-huggingface` | `all-MiniLM-L6-v2`, runs locally |
| Vector store | FAISS | persisted to disk |
| SSL fix | `truststore` | required on macOS with Python 3.14 |

## Requirements

- Python 3.10+
- Groq API key (free at console.groq.com)
