from __future__ import annotations

from pathlib import Path
from typing import Literal

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field

from backend.ai import generate_with_groq, groq_enabled
from backend.analyzer import analyze_content, load_content
from backend.generators import generate_all


ROOT = Path(__file__).resolve().parents[1]
FRONTEND_DIR = ROOT / "frontend"

app = FastAPI(title="AI Content Repurposing System", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class RepurposeRequest(BaseModel):
    source_text: str = Field(min_length=1)
    input_type: Literal["blog", "url", "markdown"] = "blog"
    tone: Literal["educational", "formal", "casual", "viral"] = "educational"
    audience: Literal["general", "beginners", "experts", "entrepreneurs"] = "general"
    use_ai: bool = True


class RepurposeResponse(BaseModel):
    insights: dict
    outputs: dict[str, str]
    ai_used: bool


@app.get("/api/health")
def health() -> dict:
    return {"status": "ok", "groq_enabled": groq_enabled()}


@app.post("/api/repurpose", response_model=RepurposeResponse)
def repurpose(request: RepurposeRequest) -> RepurposeResponse:
    try:
        text = load_content(request.source_text, request.input_type)
        insights = analyze_content(text, request.audience)
    except Exception as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    ai_outputs = generate_with_groq(insights, request.tone, request.audience) if request.use_ai else None
    outputs = ai_outputs or generate_all(insights, request.tone)

    return RepurposeResponse(
        insights=insights.to_dict(),
        outputs=outputs,
        ai_used=bool(ai_outputs),
    )


@app.get("/")
def index() -> FileResponse:
    return FileResponse(FRONTEND_DIR / "index.html")


app.mount("/", StaticFiles(directory=FRONTEND_DIR), name="frontend")
