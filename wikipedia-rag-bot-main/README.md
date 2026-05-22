# 📚 Wikipedia RAG Chatbot — Local AI Research Assistant

> A fully local, privacy-focused Retrieval-Augmented Generation (RAG) chatbot that researches Wikipedia articles and generates grounded, hallucination-resistant answers using local LLMs.

Built with **Python, LangChain, FAISS, Ollama, and Streamlit**, this project demonstrates a production-ready AI pipeline that runs completely offline — with **zero paid APIs**.

---

# 🚀 Features

- 🔎 Multi-page Wikipedia Retrieval
- 🧠 Local LLM Inference using Ollama
- 📦 FAISS Vector Database
- ✂️ Intelligent Text Chunking
- 💬 Interactive Streamlit Chat UI
- 📚 Source Citations & References
- 🔒 Fully Local & Privacy Friendly
- ⚡ Fast Semantic Search Pipeline

---

# 🧩 How It Works

```text
User Query
    ↓
Wikipedia Search API
    ↓
Document Retrieval
    ↓
Text Chunking
    ↓
Embedding Generation
    ↓
FAISS Vector Search
    ↓
Relevant Context Retrieved
    ↓
Local LLM (Llama 3 / Qwen)
    ↓
Grounded AI Response
```

---

# 🛠️ Tech Stack

| Category | Technology |
|---|---|
| Language | Python 3 |
| UI Framework | Streamlit |
| LLM Runtime | Ollama |
| Models | Llama 3 / Qwen |
| Framework | LangChain |
| Embeddings | HuggingFace (`all-MiniLM-L6-v2`) |
| Vector Store | FAISS |
| Data Source | Wikipedia API |

---

# ✨ Core Features

## 🔍 Intelligent Wikipedia Retrieval
Searches multiple Wikipedia pages and combines information from top-ranked results for broader and more accurate context.

## ✂️ Smart Text Chunking
Uses LangChain's `RecursiveCharacterTextSplitter` to preserve semantic meaning while splitting large documents into manageable chunks.

## 🧠 Local Embedding & Vector Search
Generates embeddings using HuggingFace models and stores them in a local FAISS vector database for fast semantic retrieval.

## 🚫 Hallucination-Resistant Responses
The LLM answers strictly from retrieved Wikipedia context, minimizing fabricated information.

## 💬 Interactive Streamlit Interface
Modern chat-style UI with:
- Conversation memory
- System health monitoring
- Expandable source citations
- Real-time response generation

## 🔒 100% Local & Private
No OpenAI API. No cloud dependency. Everything runs entirely on your machine.

---

# 🧠 System Architecture

## 1️⃣ Retrieval Layer
The chatbot searches Wikipedia and extracts relevant article content using a custom retrieval pipeline.

## 2️⃣ Processing Layer
Documents are cleaned and split into overlapping chunks to preserve contextual meaning.

## 3️⃣ Embedding Layer
Chunks are converted into vector embeddings using HuggingFace sentence transformers.

## 4️⃣ Vector Search Layer
FAISS retrieves the most semantically relevant chunks for the user query.

## 5️⃣ Generation Layer
The local LLM synthesizes a final answer using:
- Retrieved context
- Chat history
- Structured prompting

---

# 📋 Prerequisites

Make sure the following are installed on your system:

- Python 3.8+
- Git
- Ollama

## Install Ollama
Download from:

https://ollama.com/

---

# ⚙️ Installation & Setup

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/YOUR-USERNAME/wikipedia-rag-bot.git

cd wikipedia-rag-bot
```

---

## 2️⃣ Create a Virtual Environment

### Windows

```bash
python -m venv venv

venv\Scripts\activate
```

### Linux / macOS

```bash
python3 -m venv venv

source venv/bin/activate
```

---

## 3️⃣ Install Dependencies

```bash
pip install -r requirements.txt
```

---

## 4️⃣ Pull the Local LLM Model

```bash
ollama run llama3
```

> This downloads the model locally (one-time setup).

You can also use:
- `qwen`
- `mistral`

---

## 5️⃣ Run the Application

```bash
streamlit run app.py
```

---

# 📁 Project Structure

```text
wikipedia-rag-bot/
│
├── app.py
├── chat_logic.py
├── document_retriever.py
├── vector_engine.py
├── requirements.txt
└── README.md
```

---

# 📄 File Breakdown

| File | Purpose |
|---|---|
| `app.py` | Streamlit frontend and session management |
| `document_retriever.py` | Wikipedia retrieval & text chunking |
| `vector_engine.py` | Embeddings & FAISS vector storage |
| `chat_logic.py` | Prompting and response generation |
| `requirements.txt` | Python dependencies |

---

# 💻 Usage

1. Launch the Streamlit application.
2. Open the sidebar to verify system status.
3. Enter a research query.

## Example Queries

- *How do black holes form?*
- *Explain quantum entanglement*
- *History of the Roman Empire*
- *What causes earthquakes?*

The chatbot will:
- Search Wikipedia
- Retrieve relevant context
- Generate a grounded answer
- Show source references used in generation

---


# 🔒 Why This Project Matters

This project demonstrates core concepts used in modern AI systems:

- Retrieval-Augmented Generation (RAG)
- Semantic Search
- Vector Databases
- Local LLM Deployment
- Prompt Engineering
- Context Grounding
- Hallucination Reduction

It serves as a strong foundation for building:
- AI research assistants
- Enterprise knowledge bots
- Offline AI tools
- Private document assistants

---

