from datetime import (
    date,
    timedelta,
)

from typing import (
    Optional,
)

from models.state import (
    State,
)

from tools.web_search import (
    tavily_search,
)


# ---------------------------------------------------
# Safe ISO Date Parsing
# ---------------------------------------------------
def iso_to_date(
    value: Optional[str]
):
    """
    Safely convert ISO string to date.
    """

    if not value:
        return None

    try:

        return date.fromisoformat(
            str(value)[:10]
        )

    except Exception:

        return None


# ---------------------------------------------------
# Safe Serialization
# ---------------------------------------------------
def safe_str(value):

    if value is None:
        return ""

    try:
        return str(value)

    except Exception:
        return ""


# ---------------------------------------------------
# Research Node
# ---------------------------------------------------
def research_node(
    state: State
) -> dict:
    """
    Advanced research collection system.

    Features:
    - stable Tavily integration
    - evidence serialization
    - deduplication
    - freshness filtering
    - topic relevance
    - frontend-safe persistence
    """

    queries = state.get(
        "queries",
        []
    )[:3]

    # ---------------------------------------------------
    # No Queries
    # ---------------------------------------------------
    if not queries:

        return {
            "evidence": []
        }

    raw_results = []

    # ---------------------------------------------------
    # Tone-Aware Search Depth
    # ---------------------------------------------------
    tone = (
        state.get(
            "tone",
            ""
        )
        .lower()
    )

    if tone in [
        "technical",
        "academic",
    ]:

        max_results = 4

    elif tone in [
        "storytelling",
        "casual",
        "conversational",
    ]:

        max_results = 2

    else:

        max_results = 3

    # ---------------------------------------------------
    # Tavily Search
    # ---------------------------------------------------
    for query in queries:

        if not query:
            continue

        try:

            results = tavily_search(
                query=query,
                max_results=max_results
            )

            if (
                isinstance(results, list)
                and results
            ):

                raw_results.extend(
                    results
                )

        except Exception as e:

            print(
                f"[Research Error] {e}"
            )

            continue

    # ---------------------------------------------------
    # Empty Results
    # ---------------------------------------------------
    if not raw_results:

        return {
            "evidence": []
        }

    # ---------------------------------------------------
    # Deduplicate + Clean
    # ---------------------------------------------------
    dedup = {}

    for item in raw_results:

        if not isinstance(
            item,
            dict
        ):
            continue

        url = safe_str(
            item.get("url")
        ).strip()

        if not url:
            continue

        # Deduplicate
        if url in dedup:
            continue

        title = safe_str(
            item.get("title")
        )[:220]

        snippet = safe_str(
            item.get("snippet")
        )[:700]

        published_at = safe_str(
            item.get("published_at")
        )

        source = safe_str(
            item.get("source")
        )

        dedup[url] = {
            "title":
                title,

            "url":
                url,

            "published_at":
                published_at,

            "snippet":
                snippet,

            "source":
                source,
        }

    evidence = list(
        dedup.values()
    )

    # ---------------------------------------------------
    # Freshness Filtering
    # ---------------------------------------------------
    if (
        state.get("mode")
        == "open_book"
    ):

        try:

            as_of = date.fromisoformat(
                state["as_of"]
            )

            cutoff = as_of - timedelta(
                days=int(
                    state.get(
                        "recency_days",
                        30
                    )
                )
            )

            filtered = []

            for item in evidence:

                parsed_date = iso_to_date(
                    item.get(
                        "published_at"
                    )
                )

                # Keep undated sources too
                if (
                    parsed_date is None
                    or parsed_date >= cutoff
                ):

                    filtered.append(
                        item
                    )

            evidence = filtered

        except Exception as e:

            print(
                f"[Freshness Filter Error] {e}"
            )

    # ---------------------------------------------------
    # Sort By Snippet Quality
    # ---------------------------------------------------
    evidence.sort(
        key=lambda x: len(
            x.get(
                "snippet",
                ""
            )
        ),
        reverse=True,
    )

    # ---------------------------------------------------
    # Evidence Limits
    # ---------------------------------------------------
    evidence = evidence[:6]

    # ---------------------------------------------------
    # FINAL SERIALIZATION FIX
    # IMPORTANT:
    # Makes frontend persistence work
    # ---------------------------------------------------
    serialized_evidence = []

    for item in evidence:

        if isinstance(
            item,
            dict
        ):

            serialized_evidence.append(
                {
                    "title":
                        safe_str(
                            item.get(
                                "title"
                            )
                        ),

                    "url":
                        safe_str(
                            item.get(
                                "url"
                            )
                        ),

                    "published_at":
                        safe_str(
                            item.get(
                                "published_at"
                            )
                        ),

                    "snippet":
                        safe_str(
                            item.get(
                                "snippet"
                            )
                        ),

                    "source":
                        safe_str(
                            item.get(
                                "source"
                            )
                        ),
                }
            )

    return {
        "evidence":
            serialized_evidence
    }