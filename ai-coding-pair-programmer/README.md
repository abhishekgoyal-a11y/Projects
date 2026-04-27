# AI Coding Pair Programmer

A Streamlit web app that acts as your coding assistant. Paste any code or pseudocode and get step-by-step explanations, automated bug detection and fixes, pseudocode-to-working-code conversion, and a full code review — all powered by the [Groq API](https://console.groq.com/) with LLaMA 3.3 70B.

## Features

- **Explain Code** — step-by-step walkthrough with key concepts and gotchas
- **Find Bugs & Fix** — bug report, identified issues, and corrected code
- **Convert Pseudocode** — turn descriptions or pseudocode into production-ready code
- **Code Review** — scored review across quality, performance, security, and best practices

Supports 15 languages: Python, JavaScript, TypeScript, Java, C++, C#, Go, Rust, Ruby, PHP, Swift, Kotlin, SQL, Bash, and more.

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

Create the secrets file:

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

1. Select the programming language from the dropdown.
2. Paste your code or pseudocode in the left panel.
3. Optionally add context (e.g. "this is part of a web scraper, focus on performance").
4. Click one of the four action buttons.
5. The result appears in the right panel. Use **Download Code** to save a generated implementation.

## Notes

- Code input is capped at 8 000 characters.
- Never paste code containing credentials or secrets into a third-party AI service.
