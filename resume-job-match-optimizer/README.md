# Resume + Job Match Optimizer

A Streamlit web app that analyzes your resume against a job description to give you an ATS fit score, keyword gap analysis, specific improvement suggestions, and a tailored cover letter — all in one place. Powered by the [Groq API](https://console.groq.com/) with LLaMA 3.3 70B.

## Features

- **Score Fit & Analyze** — fit score out of 100, present/missing keywords, top strengths and gaps
- **Suggest Improvements** — actionable bullet points with rewritten STAR-format examples and ATS keywords to add
- **Generate Cover Letter** — tailored cover letter under 400 words, downloadable as `.txt`
- **PDF upload** — upload your resume as a PDF or paste plain text
- **Side-by-side layout** — resume and job description visible at the same time

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

1. Upload your resume as a PDF or paste the text in the left panel.
2. Paste the job description in the right panel.
3. Click one of the three action buttons:
   - **Score Fit & Analyze** — requires both resume and job description.
   - **Suggest Improvements** — works on resume alone; job description adds context.
   - **Generate Cover Letter** — requires both resume and job description.
4. Download the cover letter using the button that appears after generation.

## Notes

- Resume input is capped at 8 000 characters; job description at 5 000 characters.
- Do not paste resumes containing sensitive personal information (SSN, passport numbers, etc.) into third-party AI services unless your organization permits it.
