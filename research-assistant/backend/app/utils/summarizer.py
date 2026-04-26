from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage, SystemMessage
from app.utils.logger import get_logger
import os

logger = get_logger(__name__)


def _get_llm() -> ChatGroq:
    return ChatGroq(
        model=os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile"),
        temperature=0.3,
        groq_api_key=os.getenv("GROQ_API_KEY"),
    )


class Summarizer:
    def __init__(self):
        self.llm = _get_llm()

    def summarize_web_content(self, content: str, query: str, max_length: int = 1500) -> str:
        if not content or not content.strip():
            return ""

        truncated = content[:6000] if len(content) > 6000 else content

        messages = [
            SystemMessage(
                content=(
                    "You are a precise research assistant. Summarize the provided web content "
                    "focusing specifically on information relevant to the user's query. "
                    "Be concise, factual, and preserve key details. "
                    "Output only the summary, no preamble."
                )
            ),
            HumanMessage(
                content=f"Query: {query}\n\nContent to summarize:\n{truncated}"
            ),
        ]

        try:
            response = self.llm.invoke(messages)
            summary = response.content.strip()
            logger.debug(f"Summarized content to {len(summary)} chars")
            return summary
        except Exception as e:
            logger.error(f"Summarization failed: {e}")
            return truncated[:max_length]

    def synthesize_answer(
        self,
        query: str,
        rag_context: str,
        web_summaries: list[dict],
    ) -> dict:
        sources = []
        web_context_parts = []

        for item in web_summaries:
            url = item.get("url", "")
            summary = item.get("summary", "")
            if summary:
                web_context_parts.append(f"[Source: {url}]\n{summary}")
                if url:
                    sources.append(url)

        web_context = "\n\n".join(web_context_parts)

        context_block = ""
        if rag_context:
            context_block += f"### Knowledge Base:\n{rag_context}\n\n"
        if web_context:
            context_block += f"### Web Research:\n{web_context}\n\n"

        if not context_block:
            context_block = "No relevant context found."

        messages = [
            SystemMessage(
                content=(
                    "You are an expert research assistant. Using only the provided context, "
                    "give a thorough, accurate, and well-structured answer to the user's question. "
                    "If citing web sources, reference them naturally. "
                    "Do not hallucinate or add information not in the context. "
                    "Format with markdown where helpful."
                )
            ),
            HumanMessage(
                content=f"Question: {query}\n\nContext:\n{context_block}"
            ),
        ]

        try:
            response = self.llm.invoke(messages)
            answer = response.content.strip()
            logger.info(f"Synthesized answer ({len(answer)} chars) with {len(sources)} sources")
            return {"answer": answer, "sources": sources}
        except Exception as e:
            print(f"[SUMMARIZER] ❌ synthesize_answer FAILED: {e}")
            logger.error(f"Synthesis failed: {e}", exc_info=True)
            return {
                "answer": "I encountered an error generating the answer. Please try again.",
                "sources": sources,
            }
