# Smart Study Assistant

A small [Streamlit](https://streamlit.io/) app that sends pasted study notes to the OpenAI API and returns a **summary**, **key points**, and a short **quiz** (default model: `gpt-4o-mini`).

## Prerequisites

- Python 3.10 or newer (3.11+ recommended)
- An [OpenAI API key](https://platform.openai.com/api-keys)

On macOS, Homebrew Python often blocks global `pip install` (PEP 668). Use a virtual environment as shown below.

## Setup

From this directory:

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

### API key (secrets)

The repo includes `.streamlit/secrets.toml` with an empty `OPENAI_API_KEY`. Edit that file and set your key:

```toml
OPENAI_API_KEY = "sk-..."
```

Do not commit real keys (GitHub push protection will reject the push). Never paste the key into `app.py`.

## Run the app

Run Streamlit from **this project folder** so it picks up `.streamlit/config.toml`:

```bash
source .venv/bin/activate
streamlit run app.py
```

Then open the URL shown in the terminal (usually `http://localhost:8501`), paste notes, and click **Generate study pack**.

## Project layout

| Path | Purpose |
|------|---------|
| `app.py` | Streamlit UI and OpenAI chat call |
| `requirements.txt` | Python dependencies |
| `.streamlit/config.toml` | Local Streamlit options (e.g. disable first-run email prompt in the terminal) |
| `.streamlit/secrets.toml` | `OPENAI_API_KEY` (empty placeholder in git; set your key locally) |

## Dependencies (why they exist)

- **streamlit** — Web UI
- **openai** — Official OpenAI Python client
- **httpx** — HTTP client passed into the OpenAI client
- **truststore** — Uses the OS certificate store for TLS verification, which helps on some macOS setups where default cert verification fails

## Troubleshooting

- **Missing or invalid API key** — Confirm `.streamlit/secrets.toml` exists next to this README’s tree and contains `OPENAI_API_KEY`.
- **Rate limits or billing** — Errors from the API are shown in the app; check your OpenAI account usage and limits.
- **First-time Streamlit terminal prompt** — This repo sets `showEmailPrompt = false` in `.streamlit/config.toml` so you should not see the onboarding email prompt when launching from this directory.

## License

Use and modify freely for learning or your own projects; respect OpenAI’s terms of use for the API.
