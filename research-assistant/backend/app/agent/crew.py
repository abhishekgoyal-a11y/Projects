import json
import re
import os
from crewai import Agent, Crew, Process, LLM

from app.agent.config import (
    GROQ_API_KEY,
    GROQ_MODEL,
    RETRIEVER_AGENT_ROLE,
    RETRIEVER_AGENT_GOAL,
    RETRIEVER_AGENT_BACKSTORY,
    RESEARCH_AGENT_ROLE,
    RESEARCH_AGENT_GOAL,
    RESEARCH_AGENT_BACKSTORY,
    SYNTHESIZER_AGENT_ROLE,
    SYNTHESIZER_AGENT_GOAL,
    SYNTHESIZER_AGENT_BACKSTORY,
)
from app.agent.tasks import (
    create_retrieval_task,
    create_research_task,
    create_synthesis_task,
)
from app.agent.tools import RAGSearchTool, WebResearchTool, StoreKnowledgeTool
from app.rag.memory import KnowledgeMemory
from app.rag.retriever import RAGRetriever
from app.web.search import WebSearcher
from app.utils.summarizer import Summarizer
from app.utils.logger import get_logger

logger = get_logger(__name__)


class ResearchCrew:
    def __init__(self):
        self.memory = KnowledgeMemory()
        self.retriever = RAGRetriever(self.memory)
        self.searcher = WebSearcher()
        self.summarizer = Summarizer()

        self.llm = LLM(
            model=f"groq/{GROQ_MODEL}",
            api_key=GROQ_API_KEY,
            temperature=0.2,
        )

        self.rag_tool = RAGSearchTool(retriever=self.retriever)
        self.web_tool = WebResearchTool(searcher=self.searcher, summarizer=self.summarizer)
        self.store_tool = StoreKnowledgeTool(memory=self.memory)

        self._build_agents()

    def _build_agents(self):
        self.retriever_agent = Agent(
            role=RETRIEVER_AGENT_ROLE,
            goal=RETRIEVER_AGENT_GOAL,
            backstory=RETRIEVER_AGENT_BACKSTORY,
            tools=[self.rag_tool],
            llm=self.llm,
            verbose=True,
            allow_delegation=False,
            max_iter=3,
        )

        self.research_agent = Agent(
            role=RESEARCH_AGENT_ROLE,
            goal=RESEARCH_AGENT_GOAL,
            backstory=RESEARCH_AGENT_BACKSTORY,
            tools=[self.web_tool, self.store_tool],
            llm=self.llm,
            verbose=True,
            allow_delegation=False,
            max_iter=5,
        )

        self.synthesizer_agent = Agent(
            role=SYNTHESIZER_AGENT_ROLE,
            goal=SYNTHESIZER_AGENT_GOAL,
            backstory=SYNTHESIZER_AGENT_BACKSTORY,
            tools=[],
            llm=self.llm,
            verbose=True,
            allow_delegation=False,
            max_iter=3,
        )

    def _needs_web_research(self, retrieval_output: str) -> bool:
        lower = retrieval_output.lower()
        if '"has_relevant": false' in lower or "has_relevant: false" in lower:
            return True
        if "needs_web_research" in lower or "web research needed" in lower:
            return True
        if "no strong matches" in lower or "knowledge base is empty" in lower:
            return True
        if "search failed" in lower or "task failed" in lower:
            return True
        if not retrieval_output.strip():
            return True
        return False

    def _extract_sources(self, text: str) -> list[str]:
        url_pattern = re.compile(r'https?://[^\s\)\]\'"<>]+', re.IGNORECASE)
        urls = url_pattern.findall(text)
        seen = set()
        unique = []
        for url in urls:
            url = url.rstrip(".,;:")
            if url not in seen:
                seen.add(url)
                unique.append(url)
        return unique

    async def run(self, query: str) -> dict:
        print(f"\n[CREW] Starting pipeline for: {query[:80]}")

        # --- Step 1: Retrieval ---
        print("[CREW] Step 1: RAG retrieval...")
        retrieval_task = create_retrieval_task(self.retriever_agent, query)
        retrieval_crew = Crew(
            agents=[self.retriever_agent],
            tasks=[retrieval_task],
            process=Process.sequential,
            verbose=False,
        )
        try:
            retrieval_result = retrieval_crew.kickoff()
            retrieval_output = str(retrieval_result)
            print(f"[CREW] Retrieval output: {retrieval_output[:200]}")
        except Exception as e:
            print(f"[CREW] ❌ Retrieval task FAILED: {e}")
            logger.error(f"Retrieval task failed: {e}", exc_info=True)
            retrieval_output = ""

        # --- Step 2: Web Research ---
        needs_web = self._needs_web_research(retrieval_output)
        print(f"[CREW] Needs web research: {needs_web}")

        research_output = ""
        if needs_web:
            print("[CREW] Step 2: Web research via agent...")
            research_task = create_research_task(self.research_agent, query, retrieval_output)
            research_crew = Crew(
                agents=[self.research_agent],
                tasks=[research_task],
                process=Process.sequential,
                verbose=False,
            )
            try:
                research_result = research_crew.kickoff()
                research_output = str(research_result)
                print(f"[CREW] Research output: {research_output[:200]}")
            except Exception as e:
                print(f"[CREW] ❌ Research agent FAILED: {e}. Using fallback...")
                logger.error(f"Research task failed: {e}", exc_info=True)
                research_output = self._fallback_web_search(query)
                print(f"[CREW] Fallback result: {research_output[:200]}")
        else:
            print("[CREW] Step 2: Skipped (RAG sufficient)")

        # --- Step 3: Synthesis ---
        print("[CREW] Step 3: Synthesizing answer...")
        synthesis_task = create_synthesis_task(
            self.synthesizer_agent, query, retrieval_output, research_output
        )
        synthesis_crew = Crew(
            agents=[self.synthesizer_agent],
            tasks=[synthesis_task],
            process=Process.sequential,
            verbose=False,
        )
        try:
            synthesis_result = synthesis_crew.kickoff()
            final_answer = str(synthesis_result)
            print(f"[CREW] ✅ Final answer ({len(final_answer)} chars)")
        except Exception as e:
            print(f"[CREW] ❌ Synthesis agent FAILED: {e}. Using direct summarizer...")
            logger.error(f"Synthesis task failed: {e}", exc_info=True)
            result = self.summarizer.synthesize_answer(query, retrieval_output, [])
            final_answer = result["answer"]
            print(f"[CREW] Direct synthesizer result: {final_answer[:200]}")

        combined_text = retrieval_output + " " + research_output + " " + final_answer
        sources = self._extract_sources(combined_text)
        print(f"[CREW] Sources found: {sources}\n")

        return {"answer": final_answer, "sources": sources[:10]}

    def _fallback_web_search(self, query: str) -> str:
        print("[CREW] Running fallback direct web search...")
        try:
            from app.web.scraper import scrape_url
            results = self.searcher.search(query, max_results=3)
            print(f"[CREW] Fallback found {len(results)} search results")
            summaries = []
            for item in results:
                url = item["url"]
                print(f"[CREW] Scraping: {url}")
                text = scrape_url(url)
                summary = self.summarizer.summarize_web_content(text or item.get("snippet", ""), query)
                if summary:
                    summaries.append({"url": url, "summary": summary})
                    self.memory.add_documents([summary], [{"source": url}])
            if summaries:
                parts = [f"[Source: {s['url']}]\n{s['summary']}" for s in summaries]
                return "\n\n".join(parts)
        except Exception as e:
            print(f"[CREW] ❌ Fallback web search FAILED: {e}")
            logger.error(f"Fallback web search failed: {e}", exc_info=True)
        return ""
