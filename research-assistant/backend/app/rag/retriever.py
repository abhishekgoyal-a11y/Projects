import os
from langchain_core.documents import Document

from app.rag.memory import KnowledgeMemory
from app.utils.logger import get_logger

logger = get_logger(__name__)

MIN_SIMILARITY_SCORE = float(os.getenv("MIN_SIMILARITY_SCORE", "0.3"))

# FAISS L2 distance: lower = more similar. Score > threshold = weak match.
FAISS_DISTANCE_THRESHOLD = 1.0


class RAGRetriever:
    def __init__(self, memory: KnowledgeMemory):
        self.memory = memory

    def retrieve(self, query: str, k: int = 4) -> dict:
        if self.memory.is_empty:
            logger.info("Knowledge base is empty")
            return {"context": "", "documents": [], "has_relevant": False}

        results = self.memory.similarity_search(query, k=k)

        if not results:
            return {"context": "", "documents": [], "has_relevant": False}

        strong_results = [
            (doc, score) for doc, score in results if score <= FAISS_DISTANCE_THRESHOLD
        ]

        if not strong_results:
            logger.info(f"No results above similarity threshold (best score: {results[0][1]:.3f})")
            return {"context": "", "documents": [], "has_relevant": False}

        context_parts = []
        documents = []
        for doc, score in strong_results:
            source = doc.metadata.get("source", "unknown")
            context_parts.append(f"[Source: {source}]\n{doc.page_content}")
            documents.append({"content": doc.page_content, "source": source, "score": score})

        context = "\n\n---\n\n".join(context_parts)
        best_score = strong_results[0][1]
        has_relevant = best_score <= 0.6

        logger.info(
            f"Retrieved {len(strong_results)} chunks. Best score: {best_score:.3f}. "
            f"Has relevant: {has_relevant}"
        )

        return {
            "context": context,
            "documents": documents,
            "has_relevant": has_relevant,
            "best_score": best_score,
        }
