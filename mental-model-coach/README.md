# Mental Model & Learning Coach

A Streamlit web app that helps you think more clearly by applying proven thinking frameworks to your real problems. Choose a mental model, describe your situation, and get a structured analysis — or use the guided journaling mode to reflect more deeply. Powered by the [Groq API](https://console.groq.com/) with LLaMA 3.3 70B.

## Features

- **Apply a Framework** — structured analysis of your problem using 12 mental models
- **Learn a Model** — deep explanation with analogies, step-by-step application, examples, and a practice exercise
- **Reflective Journal** — AI-generated journaling prompts tailored to what you share, with a built-in writing space

### Mental models included

First Principles, Second-Order Thinking, SWOT Analysis, Inversion, Occam's Razor, The 80/20 Rule (Pareto), Circle of Competence, Feynman Technique, Systems Thinking, Pre-Mortem, Jobs To Be Done, Rubber Duck Debugging.

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

**Apply a Framework**
1. Select a mental model and optionally enter a goal.
2. Describe your situation or problem.
3. Click **Analyze with This Framework** to get a structured breakdown with insights, next actions, and reflection questions.
4. Download the analysis as a `.txt` file.

**Learn a Model**
1. Pick a model and optionally specify a domain (e.g. "startup strategy").
2. Click **Teach Me This Model** for a full lesson with examples and a practice exercise.

**Reflective Journal**
1. Describe what's on your mind.
2. Set a reflection depth (Surface / Standard / Deep).
3. Click **Generate Reflection Prompts**, then write in the journal space and download your entry.
