# AI Product Description Generator

Fill in your product details and generate compelling marketing copy — full descriptions, social blurbs, and benefit-led feature bullets — in seconds.

## Stack

- Python 3.10+
- Streamlit
- Groq API (`llama-3.3-70b-versatile`)

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

Open `http://localhost:8501`. Fill in product name, features, tone, and choose an output format, then click **Generate Descriptions**.
