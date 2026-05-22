from dotenv import load_dotenv
load_dotenv()

import re
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from orchestrator import run_pipeline
from summary_agent import build_digest
from ingestion import fetch_articles

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["GET"],
    allow_headers=["*"],
)

app.mount("/assets", StaticFiles(directory="frontend"), name="static")


@app.get("/")
def index():
    return FileResponse("frontend/index.html")


@app.get("/api/digest")
def get_digest():
    try:
        outputs = run_pipeline()
        digest  = build_digest(outputs)
        return {
            "status":   "ok",
            "sections": _parse_digest(digest),
            "raw":      digest,
            "agents":   [
                {"domain": o["domain"], "count": o["count"], "bullets": o["bullets"]}
                for o in outputs
            ],
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}


@app.get("/api/articles/{domain}")
def get_articles(domain: str):
    if domain not in ("tech", "finance", "sports"):
        return {"status": "error", "message": "Invalid domain. Use: tech, finance, sports"}
    try:
        articles = fetch_articles(domain)
        return {"status": "ok", "domain": domain, "count": len(articles), "articles": articles}
    except Exception as e:
        return {"status": "error", "message": str(e)}


def _parse_digest(text: str) -> dict:
    result  = {}
    pattern = re.split(r"(🔥 Top Headlines|🧠 Tech|💰 Finance|⚽ Sports)", text)
    for i in range(1, len(pattern), 2):
        key     = pattern[i].strip()
        content = pattern[i + 1].strip() if i + 1 < len(pattern) else ""
        bullets = [
            b.lstrip("- ").strip()
            for b in content.splitlines()
            if b.strip().startswith("-")
        ]
        result[key] = bullets
    return result
