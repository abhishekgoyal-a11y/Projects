# Smart Q&A Bot for Your Notes

A small [Streamlit](https://streamlit.io/) app that **indexes** your notes (paste or `.txt` upload) with **local Hugging Face embeddings**, stores vectors in **Chroma**, then answers questions via **Groq** (`langchain-groq` / official Groq SDK) using **LangChain** retrieval-augmented generation (**RAG**). Default chat model: `llama-3.3-70b-versatile`; default embeddings: `sentence-transformers/all-MiniLM-L6-v2` (downloaded on first index).

## Prerequisites

- Python 3.10 or newer (3.11+ recommended)
- A [Groq API key](https://console.groq.com/keys) (free tier available)

On macOS, Homebrew Python often blocks global `pip install` (PEP 668). Use a virtual environment as shown below.

## Setup

From this directory:

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

### API key (secrets)

The repo includes `.streamlit/secrets.toml` with an empty `GROQ_API_KEY`. Edit that file and set your key:

```toml
GROQ_API_KEY = "gsk_..."
```

Do not commit real keys (GitHub push protection will reject the push). Never paste the key into `app.py`.

## Run the app

Run Streamlit from **this project folder** so it picks up `.streamlit/config.toml`:

```bash
source .venv/bin/activate
streamlit run app.py
```

Then open the URL shown in the terminal (usually `http://localhost:8501`):

1. Paste notes **or** upload a plain `.txt` file.
2. Click **Build / refresh index** (embeddings + Chroma).
3. Type a question and click **Answer from my notes**.
4. Open **Sources** to see which chunks were retrieved.

## Project layout

| Path | Purpose |
|------|---------|
| `app.py` | Streamlit UI, chunking, Chroma, LangChain `RetrievalQA` |
| `requirements.txt` | Python dependencies |
| `.streamlit/config.toml` | Local Streamlit options (e.g. disable first-run email prompt) |
| `.streamlit/secrets.toml` | `GROQ_API_KEY` (empty placeholder in git; set locally) |

## Dependencies (why they exist)

- **streamlit** — Web UI
- **langchain** / **langchain-core** — Orchestration; **langchain-classic** supplies `RetrievalQA`
- **langchain-community** — Chroma vector store integration
- **langchain-groq** / **groq** — `ChatGroq` against Groq’s API
- **langchain-huggingface** / **sentence-transformers** — local embeddings (`HuggingFaceEmbeddings`)
- **langchain-text-splitters** — `RecursiveCharacterTextSplitter`
- **chromadb** — Vector database (in-memory for this demo; session only)
- **httpx** — Used by the Groq SDK for HTTPS (bundled with `groq`; we pass a tuned client from `app.py`)
- **truststore** — TLS verification uses the OS trust store (macOS Keychain); **certifi** remains as fallback

## Scope & limits (v1)

- **Plain text only** in this skeleton (paste or `.txt`). PDFs and richer loaders are a natural next step.
- **In-memory Chroma** — index is rebuilt when you click “Build / refresh index”; restarting the app clears it unless you add persistence.
- **Length cap** — `MAX_NOTES_CHARS` in `app.py` (80k) avoids accidentally sending huge blobs while learning.

## Troubleshooting

- **Import errors** — LangChain splits packages across `langchain`, `langchain-community`, etc. Re-run `pip install -r requirements.txt` inside your activated venv. If APIs moved between releases, align with the [LangChain RAG tutorial](https://python.langchain.com/docs/tutorials/rag/).
- **Missing or invalid API key** — Confirm `.streamlit/secrets.toml` exists and contains `GROQ_API_KEY`.
- **Rate limits** — Errors surface in the app; check Groq console for usage and limits.
- **First-time Streamlit terminal prompt** — `config.toml` sets `showEmailPrompt = false` when you launch from this directory.
- **`torchvision` errors / huge terminal spam on startup** — Caused by Streamlit’s file watcher probing `transformers`; harmless for this app. `config.toml` sets `fileWatcherType = "none"` to silence it (you lose automatic rerun when editing code unless you refresh manually).
- **`APIConnectionError` / `CERTIFICATE_VERIFY_FAILED` but `curl` works** — The app uses **`truststore`** so HTTPS verification follows the **macOS Keychain** (and native stores on Windows/Linux), not only **certifi**. Install deps (`pip install -r requirements.txt`), restart Streamlit, and refresh the browser so new TLS clients load. Corporate MITM proxies may still need **`SSL_CERT_FILE`** / **`REQUESTS_CA_BUNDLE`** pointing at your org’s CA PEM. Also try `unset HTTPS_PROXY HTTP_PROXY ALL_PROXY`. Status: https://status.groq.com/

## License

Use and modify freely for learning or your own projects; respect Groq’s terms of use for the API.
