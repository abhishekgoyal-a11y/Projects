import operator

from typing import (
    TypedDict,
    List,
    Optional,
    Annotated,
)

from models.schemas import (
    Plan,
    EvidenceItem,
)


class State(TypedDict):
    # ---------------------------------------------------
    # User Inputs
    # ---------------------------------------------------
    topic: str

    tone: str

    as_of: str

    # ---------------------------------------------------
    # Router
    # ---------------------------------------------------
    mode: str

    needs_research: bool

    queries: List[str]

    recency_days: int

    max_results_per_query: int

    # ---------------------------------------------------
    # Research
    # IMPORTANT:
    # Reducer prevents evidence overwrite
    # during graph node transitions
    # ---------------------------------------------------
    evidence: Annotated[
        List[EvidenceItem],
        operator.add
    ]

    # ---------------------------------------------------
    # Planning
    # ---------------------------------------------------
    plan: Optional[Plan]

    # ---------------------------------------------------
    # Writer Outputs
    # IMPORTANT:
    # Reducer prevents section overwrite
    # ---------------------------------------------------
    sections: Annotated[
        List[tuple[int, str]],
        operator.add
    ]

    # ---------------------------------------------------
    # Final Blog
    # ---------------------------------------------------
    merged_md: str

    final: str