# AI Content Repurposing System

A content repurposing web app that transforms one long-form article into ready-to-use assets for LinkedIn, Twitter/X, YouTube, and email.

This project uses a Python FastAPI backend and a React + Tailwind frontend to parse input content, extract insights, and generate platform-specific copy with tone and audience options.


## Tech Stack

- Frontend: React.js, Tailwind CSS, modern browser APIs
- Backend: Python, FastAPI, uvicorn
- AI Layer: OpenAI-compatible Groq integration (optional)
- Scraping: BeautifulSoup + httpx
- Export: Markdown download built into the browser UI

## What it does

- Accepts blog text, a URL, or markdown content
- Extracts topic, hook, key points, tone, and audience intent
- Generates four platform-specific outputs
- Displays preview panels for each format
- Supports optional AI generation when a Groq API key is configured

## Setup

1. Clone the repository

2. Create and activate a Python virtual environment:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

3. Install backend dependencies:

```powershell
pip install -r backend\requirements.txt
```

4. Run the app:

```powershell
uvicorn backend.main:app --reload
```

5. Open the browser at:

```text
http://127.0.0.1:8000
```

## Optional AI configuration

To enable Groq AI generation, copy the example env file and add your API key:

```powershell
Copy-Item .env.example .env
```

Then set:

```env
GROQ_API_KEY=your_key_here
GROQ_MODEL=llama-3.1-8b-instant
```

## Project structure

```text
backend/
  main.py          FastAPI app, API routes, and static file serving
  analyzer.py      Text loading, URL scraping, markdown cleanup, and insight extraction
  generators.py    Platform-specific copy generation for LinkedIn, Twitter, YouTube, and email
  ai.py            Optional OpenAI/Groq request builder and response parser
  requirements.txt Python dependencies
frontend/
  index.html       Single page application shell with React and Tailwind via CDN
  app.js           React app, request flow, preview panels, and export tools
  style.css        Basic browser styling and layout support
assets/
  Screenshot 2026-06-02 205158.png
  Screenshot 2026-06-02 205330.png
```

## Screenshots

![Main app screen](assets/Screenshot%202026-06-02%20205158.png)

*Screenshot showing the input panel, settings, and generated outputs.*

![Preview panels](assets/Screenshot%202026-06-02%20205330.png)

*Screenshot showing preview panels for LinkedIn, Twitter/X, YouTube, and email outputs.*

## Video tutorial

A companion video tutorial:

https://github.com/user-attachments/assets/69fcf5cb-2b81-46ff-b0d0-6230f697ee46


