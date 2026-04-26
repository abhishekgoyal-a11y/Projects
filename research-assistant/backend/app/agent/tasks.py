from crewai import Task
from app.utils.logger import get_logger

logger = get_logger(__name__)


def create_retrieval_task(agent, query: str) -> Task:
    return Task(
        description=(
            f"Search the local knowledge base for information about this query:\n\n"
            f"Query: {query}\n\n"
            f"Use the knowledge_base_search tool. Return the full context found and whether "
            f"the knowledge base has a strong relevant answer."
        ),
        expected_output=(
            "A JSON-like summary indicating: "
            "(1) whether strong relevant context was found (has_relevant: true/false), "
            "(2) the retrieved context text if available, "
            "(3) recommendation: 'use_rag' or 'needs_web_research'."
        ),
        agent=agent,
    )


def create_research_task(agent, query: str, rag_output: str = "") -> Task:
    context_note = ""
    if rag_output:
        context_note = (
            f"\nNote: The knowledge base returned limited or no relevant results:\n{rag_output}\n"
        )

    return Task(
        description=(
            f"Research this query on the web and collect up-to-date information:\n\n"
            f"Query: {query}\n"
            f"{context_note}\n"
            f"Use the web_research tool to search and summarize top results. "
            f"Then use the store_knowledge tool to save the collected information with source URLs as metadata."
        ),
        expected_output=(
            "A structured list of research findings with source URLs, "
            "each item containing a URL and summary of the content found. "
            "Also confirm that the information was stored in the knowledge base."
        ),
        agent=agent,
    )


def create_synthesis_task(agent, query: str, retrieval_output: str, research_output: str) -> Task:
    return Task(
        description=(
            f"Synthesize the following research into a final comprehensive answer.\n\n"
            f"Original question: {query}\n\n"
            f"Knowledge base findings:\n{retrieval_output}\n\n"
            f"Web research findings:\n{research_output}\n\n"
            f"Combine all relevant information into one clear, well-structured answer. "
            f"Include sources as a list at the end."
        ),
        expected_output=(
            "A comprehensive, well-structured answer to the question. "
            "Must include a 'Sources:' section at the end listing all URLs used. "
            "Use markdown formatting where appropriate."
        ),
        agent=agent,
    )
