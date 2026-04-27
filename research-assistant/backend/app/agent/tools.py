import json
from typing import TYPE_CHECKING
from crewai.tools import BaseTool
from pydantic import Field

from app.utils.logger import get_logger

logger = get_logger(__name__)

if TYPE_CHECKING:
    from app.rag.retriever import RAGRetriever
    from app.web.search import WebSearcher
    from app.web.scraper import scrape_url
    from app.utils.summarizer import Summarizer


class RAGSearchTool(BaseTool):
    name: str = "knowledge_base_search"
    description: str = (
        "Search the local knowledge base for information relevant to a query. "
        "Returns context snippets and whether the knowledge base has strong relevant content. "
        "Input: the search query string."
    )
    retriever: object = Field(exclude=True)

    class Config:
        arbitrary_types_allowed = True

    def _run(self, query: str) -> str:
        try:
            result = self.retriever.retrieve(query)
            if not result["has_relevant"]:
                return json.dumps({
                    "has_relevant": False,
                    "context": "",
                    "message": "No strong matches in knowledge base. Web research needed.",
                })
            return json.dumps({
                "has_relevant": True,
                "context": result["context"],
                "num_chunks": len(result["documents"]),
            })
        except Exception as e:
            logger.error(f"RAGSearchTool error: {e}")
            return json.dumps({"has_relevant": False, "context": "", "error": str(e)})


class WebResearchTool(BaseTool):
    name: str = "web_research"
    description: str = (
        "Search the web and scrape top results for information about a query. "
        "Returns summarized content from each source with URLs. "
        "Input: the search query string."
    )
    searcher: object = Field(exclude=True)
    summarizer: object = Field(exclude=True)

    class Config:
        arbitrary_types_allowed = True

    def _run(self, query: str) -> str:
        try:
            from app.web.scraper import scrape_url
            search_results = self.searcher.search(query)
            if not search_results:
                return json.dumps({"results": [], "message": "No web results found."})

            summaries = []
            for item in search_results[:4]:
                url = item["url"]
                raw_text = scrape_url(url)

                if raw_text:
                    summary = self.summarizer.summarize_web_content(raw_text, query)
                else:
                    summary = item.get("snippet", "")

                if summary:
                    summaries.append({"url": url, "title": item.get("title", ""), "summary": summary})

            logger.info(f"WebResearchTool: collected {len(summaries)} summaries")
            return json.dumps({"results": summaries})
        except Exception as e:
            logger.error(f"WebResearchTool error: {e}")
            return json.dumps({"results": [], "error": str(e)})


class StoreKnowledgeTool(BaseTool):
    name: str = "store_knowledge"
    description: str = (
        "Store new information in the knowledge base for future retrieval. "
        "Input: JSON string with 'texts' (list of strings) and 'metadatas' (list of dicts with 'source' key)."
    )
    memory: object = Field(exclude=True)

    class Config:
        arbitrary_types_allowed = True

    def _run(self, input_json: str) -> str:
        try:
            data = json.loads(input_json)
            texts = data.get("texts", [])
            metadatas = data.get("metadatas", [])
            if not texts:
                return "No texts provided to store."
            count = self.memory.add_documents(texts, metadatas)
            return f"Successfully stored {count} chunks in knowledge base."
        except Exception as e:
            logger.error(f"StoreKnowledgeTool error: {e}")
            return f"Failed to store knowledge: {e}"
