# AI Research Agent

A minimal AI agent built in plain Python. Give it a research goal, and it searches the web, reads the results, and writes a concise summary — all automatically.

## How it works

The agent runs a loop:

1. **Perceive** — receives your goal
2. **Think** — the LLM decides which tool to call
3. **Act** — calls the web search tool
4. **Observe** — reads the results
5. **Repeat** — loops until it has enough information, then writes the final summary

## Prerequisites

- Python 3.10+
- An [OpenAI API key](https://platform.openai.com/api-keys)
- A [Tavily API key](https://tavily.com/) (free tier available)

## Setup

```bash
# 1. Clone the repo
git clone <repo-url>
cd ai-research-agent

# 2. Create and activate a virtual environment
python3 -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate

# 3. Install dependencies
pip3 install -r requirements.txt

# 4. Set your API keys
export OPENAI_API_KEY="sk-..."
export TAVILY_API_KEY="tvly-..."
```

## Run

```bash
python3 agent.py
```

Then type your research goal when prompted:

```
Research goal: What are the top Python web frameworks in 2025?
```

The agent will search the web and print a summary.

## Extending the agent

Add more tools in `tools.py` — any Python function works. Common additions:

- `save_to_file(filename, content)` — persist the summary to disk
- `fetch_url(url)` — read a specific webpage in full
- `run_python(code)` — execute calculations via a Python REPL
