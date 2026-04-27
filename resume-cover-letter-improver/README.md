# Resume & Cover Letter Improver

Upload or paste your resume, optionally add a job description, and get:

- **Resume feedback** — strengths, actionable improvements, rewritten STAR bullets, and ATS keywords
- **Tailored cover letter** — 3-4 paragraph letter matched to the job description

## Stack

- Python 3.10+
- Streamlit
- Groq API (`llama-3.3-70b-versatile`)
- pypdf (PDF text extraction)

## Setup

```bash
python3 -m venv .venv && source .venv/bin/activate
pip3 install -r requirements.txt
```

Add your Groq API key to `.streamlit/secrets.toml`:

```toml
GROQ_API_KEY = "gsk_..."
```

## Run

```bash
streamlit run app.py
```

Open `http://localhost:8501`.
