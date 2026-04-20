# Smart Q&A Bot for Your Notes

A small [Streamlit](https://streamlit.io/) app that **indexes** your notes (paste or `.txt` upload) with **OpenAI embeddings**, stores vectors in **Chroma**, then answers questions using **LangChain** retrieval-augmented generation (**RAG**). Default chat model: `gpt-4o-mini`; default embeddings: `text-embedding-3-small`.

## Prerequisites

- Python 3.10 or newer (3.11+ recommended)
- An [OpenAI API key](https://platform.openai.com/api-keys)

On macOS, Homebrew Python often blocks global `pip install` (PEP 668). Use a virtual environment as shown below.

## Setup

From this directory:

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

### API key (secrets)

The repo includes `.streamlit/secrets.toml` with an empty `OPENAI_API_KEY`. Edit that file and set your key:

```toml
OPENAI_API_KEY = "sk-..."
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
| `.streamlit/secrets.toml` | `OPENAI_API_KEY` (empty placeholder in git; set locally) |

## Dependencies (why they exist)

- **streamlit** — Web UI
- **langchain** / **langchain-core** — Orchestration and RAG chain (`RetrievalQA`)
- **langchain-community** — Chroma vector store integration
- **langchain-openai** — `ChatOpenAI` and `OpenAIEmbeddings`
- **langchain-text-splitters** — `RecursiveCharacterTextSplitter`
- **chromadb** — Vector database (in-memory for this demo; session only)
- **openai** — Used by LangChain’s OpenAI integrations

## Scope & limits (v1)

- **Plain text only** in this skeleton (paste or `.txt`). PDFs and richer loaders are a natural next step.
- **In-memory Chroma** — index is rebuilt when you click “Build / refresh index”; restarting the app clears it unless you add persistence.
- **Length cap** — `MAX_NOTES_CHARS` in `app.py` (80k) avoids accidentally sending huge blobs while learning.

## Troubleshooting

- **Import errors** — LangChain splits packages across `langchain`, `langchain-community`, etc. Re-run `pip install -r requirements.txt` inside your activated venv. If APIs moved between releases, align with the [LangChain RAG tutorial](https://python.langchain.com/docs/tutorials/rag/).
- **Missing or invalid API key** — Confirm `.streamlit/secrets.toml` exists and contains `OPENAI_API_KEY`.
- **Rate limits or billing** — Errors surface in the app; check OpenAI usage and limits.
- **First-time Streamlit terminal prompt** — `config.toml` sets `showEmailPrompt = false` when you launch from this directory.

## License

Use and modify freely for learning or your own projects; respect OpenAI’s terms of use for the API.
