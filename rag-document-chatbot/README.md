# RAG Document Chatbot

A command-line chatbot that answers questions about a PDF using Retrieval-Augmented Generation (RAG). Remembers conversation history so you can ask follow-up questions.

## How it works

1. `ingest.py` loads a PDF, splits it into chunks, embeds them with OpenAI, and saves a FAISS index to disk
2. `chatbot.py` loads that index and runs an interactive chat loop — every question retrieves relevant chunks and passes them to GPT-4o-mini

## Setup

```bash
pip install -r requirements.txt
export OPENAI_API_KEY="sk-..."
```

## Usage

```bash
# Step 1 — build the index from your PDF (run once)
python ingest.py your_document.pdf

# Step 2 — start chatting
python chatbot.py
```

## Project structure

```
rag-document-chatbot/
├── ingest.py        # load → chunk → embed → save FAISS index
├── chatbot.py       # load index → RAG chain → chat loop
├── requirements.txt
└── faiss_index/     # created by ingest.py
```

## Requirements

- Python 3.10+
- OpenAI API key
