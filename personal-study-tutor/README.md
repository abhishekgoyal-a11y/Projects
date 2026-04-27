# Personal Study Tutor

A RAG-based Streamlit web app that turns your own notes and PDFs into an interactive study assistant. Upload your study material to build a searchable knowledge index, then ask questions or generate a multiple-choice quiz on any topic inside that material. Powered by [LangChain](https://www.langchain.com/), [Chroma](https://www.trychroma.com/), and the [Groq API](https://console.groq.com/).

## Features

- **Ask a Question** — retrieval-augmented answers grounded in your uploaded material, with source chunks shown
- **Generate Quiz** — auto-generated multiple-choice questions with answers and explanations, focused on any topic or chapter
- **Multi-source ingestion** — upload PDF and TXT files or paste notes directly
- **Semantic search** — uses `sentence-transformers/all-MiniLM-L6-v2` embeddings for relevant retrieval

## Prerequisites

- Python 3.9+
- A Groq API key from [Groq Console](https://console.groq.com/)

## Setup

### 1. Install dependencies

```bash
pip3 install -r requirements.txt
```

### 2. Configure the API key

```bash
mkdir -p .streamlit
```

Create `.streamlit/secrets.toml` with:

```toml
GROQ_API_KEY = "your_groq_api_key_here"
```

### 3. Run the app

```bash
streamlit run app.py
```

Open your browser to **http://localhost:8501**

## Usage

1. In the sidebar, upload PDF or TXT files and/or paste notes into the text area.
2. Click **Build / Refresh Index** to chunk and embed the content into a Chroma vector store.
3. Switch between the **Ask a Question** and **Generate Quiz** tabs.
   - **Ask a Question**: type your question and click **Get Answer**. Expand the *Source chunks used* section to see which parts of your notes were retrieved.
   - **Generate Quiz**: optionally enter a topic/chapter focus, choose the number of questions (3, 5, or 10), and click **Generate Quiz**.

## Notes

- Input is capped at 15 000 characters across all uploaded files.
- The vector store is in-memory and resets on page refresh — rebuild the index each session.
- The tutor only answers from your uploaded material; it will say so if information is absent.
