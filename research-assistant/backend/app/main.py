import os
import asyncio
from contextlib import asynccontextmanager

from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from app.agent.crew import ResearchCrew
from app.utils.logger import get_logger

logger = get_logger(__name__)

crew: ResearchCrew | None = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    global crew

    # Print config on startup so it's easy to spot missing keys
    groq_key = os.getenv("GROQ_API_KEY", "")
    groq_model = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")
    print(f"\n{'='*50}")
    print(f"GROQ_API_KEY : {'SET (' + groq_key[:8] + '...)' if groq_key else 'NOT SET ❌'}")
    print(f"GROQ_MODEL   : {groq_model}")
    print(f"{'='*50}\n")

    if not groq_key:
        raise RuntimeError("GROQ_API_KEY is not set in .env — cannot start")

    logger.info("Initializing ResearchCrew...")
    try:
        crew = ResearchCrew()
        logger.info("ResearchCrew initialized successfully")
    except Exception as e:
        logger.error(f"Failed to initialize ResearchCrew: {e}", exc_info=True)
        raise
    yield
    logger.info("Shutting down ResearchCrew")


app = FastAPI(
    title="AI Research Assistant",
    description="Multi-agent RAG system with web search fallback",
    version="1.0.0",
    lifespan=lifespan,
)

origins = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://localhost:3000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class QueryRequest(BaseModel):
    question: str = Field(..., min_length=1, max_length=2000, description="The research question")


class QueryResponse(BaseModel):
    answer: str
    sources: list[str]


@app.get("/health")
async def health():
    return {"status": "ok", "crew_ready": crew is not None}


@app.post("/query", response_model=QueryResponse)
async def query(request: QueryRequest):
    if crew is None:
        raise HTTPException(status_code=503, detail="Research crew not initialized")

    question = request.question.strip()
    if not question:
        raise HTTPException(status_code=400, detail="Question cannot be empty")

    print(f"\n{'='*50}")
    print(f"[QUERY] {question}")
    print(f"{'='*50}")

    try:
        result = await crew.run(question)
        print(f"\n[RESULT] answer length={len(result['answer'])} sources={result['sources']}\n")
        return QueryResponse(answer=result["answer"], sources=result["sources"])
    except Exception as e:
        logger.error(f"Query processing failed: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Processing error: {str(e)}")


@app.get("/test-groq")
async def test_groq():
    """Quick smoke-test: calls Groq directly and returns the response."""
    import os
    from langchain_groq import ChatGroq
    from langchain_core.messages import HumanMessage
    try:
        llm = ChatGroq(
            model=os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile"),
            groq_api_key=os.getenv("GROQ_API_KEY"),
            temperature=0,
        )
        resp = llm.invoke([HumanMessage(content="Reply with just the word WORKING")])
        return {"status": "ok", "response": resp.content}
    except Exception as e:
        return {"status": "error", "detail": str(e)}


@app.get("/")
async def root():
    return {
        "message": "AI Research Assistant API",
        "docs": "/docs",
        "health": "/health",
        "query_endpoint": "POST /query",
    }
