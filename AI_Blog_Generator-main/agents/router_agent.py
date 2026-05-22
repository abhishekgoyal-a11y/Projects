from langchain_core.messages import (
    SystemMessage,
    HumanMessage,
)

from models.state import State
from models.schemas import RouterDecision

from prompts.router_prompt import ROUTER_SYSTEM

from utils.config import llm


def router_node(state: State) -> dict:
    """
    Decide:
    - whether research is needed
    - which research mode to use
    - which search queries to generate

    Optimized for:
    - Groq free tier
    - tone-aware routing
    - technical + non-technical blogs
    - stable query generation
    """

    structured_llm = llm.with_structured_output(
        RouterDecision
    )

    try:

        decision = structured_llm.invoke(
            [
                SystemMessage(
                    content=ROUTER_SYSTEM
                ),

                HumanMessage(
                    content=(
                        f"Topic: {state['topic']}\n"
                        f"Tone: {state['tone']}\n"
                        f"As-of date: {state['as_of']}\n\n"

                        "Generate concise research queries only if needed."
                    )
                ),
            ]
        )

    except Exception:

        # ---------------------------------------------------
        # Safe Fallback
        # ---------------------------------------------------
        decision = RouterDecision(
            needs_research=False,

            mode="closed_book",

            reason="Fallback routing used.",

            queries=[],

            max_results_per_query=2,
        )

    # ---------------------------------------------------
    # Fallback Query Generation
    # ---------------------------------------------------
    if (
        decision.needs_research
        and not decision.queries
    ):
        decision.queries = [
            state["topic"]
        ]

    # ---------------------------------------------------
    # Clean Queries
    # ---------------------------------------------------
    cleaned_queries = []

    for query in decision.queries:

        if not isinstance(query, str):
            continue

        query = query.strip()

        if not query:
            continue

        cleaned_queries.append(query)

    # ---------------------------------------------------
    # Limit Query Count
    # ---------------------------------------------------
    cleaned_queries = cleaned_queries[:3]

    # ---------------------------------------------------
    # Research Result Limits
    # ---------------------------------------------------
    max_results = min(
        max(
            decision.max_results_per_query,
            1
        ),
        3
    )

    # ---------------------------------------------------
    # Tone-Aware Research Adjustment
    # ---------------------------------------------------
    tone = state["tone"].lower()

    if tone in [
        "storytelling",
        "casual",
        "conversational"
    ]:
        max_results = min(max_results, 2)

    # ---------------------------------------------------
    # Research Recency Logic
    # ---------------------------------------------------
    if decision.mode == "open_book":
        recency_days = 7

    elif decision.mode == "hybrid":
        recency_days = 45

    else:
        recency_days = 3650

    return {
        "needs_research":
            decision.needs_research,

        "mode":
            decision.mode,

        "queries":
            cleaned_queries,

        "recency_days":
            recency_days,

        "max_results_per_query":
            max_results,
    }


def route_next(state: State) -> str:
    """
    Conditional graph routing.
    """

    if state["needs_research"]:
        return "research"

    return "orchestrator"