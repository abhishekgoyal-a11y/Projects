# Personalized News Digest

A Streamlit web app that fetches live news from RSS feeds across your chosen topics and uses AI to produce a curated, tone-matched digest — from beginner-friendly explanations to executive briefs. Powered by the [Groq API](https://console.groq.com/) with LLaMA 3.3 70B.

## Features

- **Topic selection** — choose from 8 categories: Technology, AI & ML, Science, Business, World News, Health, Finance, Programming
- **Custom topics** — add any topic not in the list (answered from model training data)
- **4 reading styles** — Beginner-Friendly, Technical, Executive Brief, Casual
- **Adjustable volume** — 1–5 stories per topic
- **Key Takeaway section** — cross-topic insights at the end of each digest
- **Download** — save the full digest as a dated `.txt` file

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

1. In the sidebar, select one or more topics and set your reading style and story count.
2. Optionally add a custom topic in the text field.
3. Click **Generate My Digest** on the main page.
4. The app fetches RSS feeds, then passes the articles to Groq for summarization.
5. Source links are listed at the bottom. Use **Download Digest** to save a copy.

## Notes

- The app fetches articles live each time you generate a digest; RSS availability can vary.
- Article content is capped at 1 200 characters per story before summarization.
- Custom topics are answered from the model's training knowledge, not live feeds, and are labeled clearly.
