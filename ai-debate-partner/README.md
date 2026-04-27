# AI Debate Partner

A Streamlit web app that lets you debate an AI on any topic. The AI argues its assigned side rigorously while you argue the other — sharpen your critical thinking and argumentation skills, then request an impartial verdict. Powered by the [Groq API](https://console.groq.com/) with LLaMA 3.3 70B.

## Features

- **Briefing mode** — optional overview of both sides before the debate starts
- **Live debate** — the AI responds to each of your arguments with rebuttals and new evidence
- **Verdict** — impartial judge scores both sides on argument strength, evidence, and rebuttal quality
- **7 preset topics** or enter a custom topic
- **Configurable sides** — choose whether the AI argues FOR or AGAINST

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

1. Choose a preset topic or type your own.
2. Select which side the AI will argue (FOR or AGAINST).
3. Optionally enable **briefing mode** to see both sides before starting.
4. Click **Start Debate** — the AI delivers its opening statement.
5. Type your arguments in the chat input at the bottom.
6. When finished, click **Request Verdict** for a scored analysis.
7. Click **Start New Debate** to reset.
