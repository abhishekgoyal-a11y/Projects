# Meeting & Lecture Summarizer

A Streamlit web app that turns meeting transcripts, lecture notes, or any text content into structured summaries with action items, decisions, and open questions — plus a built-in Q&A chatbot so you can query the content directly. Powered by the [Groq API](https://console.groq.com/) with LLaMA 3.3 70B.

## Features

- **Structured summary** — TL;DR, key discussion points, decisions made, action items with owners/deadlines, and open questions
- **Action item extractor** — outputs a markdown table with task, owner, deadline, and priority
- **Q&A chatbot** — ask follow-up questions about the transcript without re-reading it
- **File upload** — accepts `.txt` transcripts or paste directly
- **Download** — save the summary as a `.txt` file
- **6 content types** — General Meeting, Sprint Planning, Lecture/Class, Interview, 1:1, All-Hands

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

1. Select the content type from the dropdown.
2. Upload a `.txt` transcript file or paste text directly into the text area.
3. Click **Summarize** for a full structured summary, or **Extract Action Items** for a focused task table.
4. Use the **Ask About This Meeting** chat at the bottom to query the transcript.
5. Download the summary using the button that appears after generation.

## Notes

- Transcript input is capped at 15 000 characters.
- The Q&A chatbot answers only from the pasted transcript — it won't make up information.
