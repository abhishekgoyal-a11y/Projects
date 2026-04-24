# Website RAG Chatbot

Enter any public URL, scrape its content, and ask questions about it using Retrieval-Augmented Generation (RAG).

## How it works

1. Scrape the page with `requests` + `BeautifulSoup`
2. Split text into overlapping chunks (`RecursiveCharacterTextSplitter`)
3. Embed locally with `sentence-transformers/all-MiniLM-L6-v2` (no embedding API key)
4. Store vectors in Chroma (in-memory for the session)
5. Answer questions: retrieve top-4 chunks → pass to Groq LLM → display answer

## Stack

- Python 3.10+
- Streamlit
- LangChain + ChromaDB
- Hugging Face sentence-transformers (local embeddings)
- Groq API (`llama-3.3-70b-versatile`)

## Setup

```bash
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
```

Add your Groq API key to `.streamlit/secrets.toml`:

```toml
GROQ_API_KEY = "gsk_..."
```

## Run

```bash
streamlit run app.py
```

The first run downloads the embedding model weights (~22 MB). Subsequent runs use the cache.
