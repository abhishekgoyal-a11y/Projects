from langgraph.graph import (
    StateGraph,
    START,
    END,
)

from models.state import State

from agents.router_agent import (
    router_node,
    route_next,
)

from agents.research_agent import (
    research_node,
)

from agents.orchestrator_agent import (
    orchestrator_node,
)

from agents.writer_agent import (
    writer_node,
)

from agents.editor_agent import (
    editor_node,
)


# ---------------------------------------------------
# Merge Sections
# ---------------------------------------------------
def merge_sections_node(
    state: State
):
    """
    Merge all generated sections.
    """

    plan = state["plan"]

    ordered_sections = sorted(
        state["sections"],
        key=lambda item: item[0]
    )

    merged_markdown = (
        f"# {plan.blog_title}\n\n"
    )

    for _, markdown in ordered_sections:

        merged_markdown += (
            markdown
            + "\n\n"
        )

    return {
        "merged_md":
            merged_markdown
    }


# ---------------------------------------------------
# Build Graph
# ---------------------------------------------------
graph = StateGraph(State)


# ---------------------------------------------------
# Nodes
# ---------------------------------------------------
graph.add_node(
    "router",
    router_node
)

graph.add_node(
    "research",
    research_node
)

graph.add_node(
    "orchestrator",
    orchestrator_node
)

graph.add_node(
    "writer",
    writer_node
)

graph.add_node(
    "merge_sections",
    merge_sections_node
)

graph.add_node(
    "editor",
    editor_node
)


# ---------------------------------------------------
# Flow
# ---------------------------------------------------
graph.add_edge(
    START,
    "router"
)

graph.add_conditional_edges(
    "router",

    route_next,

    {
        "research":
            "research",

        "orchestrator":
            "orchestrator",
    }
)

graph.add_edge(
    "research",
    "orchestrator"
)

# ---------------------------------------------------
# Sequential Writing
# ---------------------------------------------------
graph.add_edge(
    "orchestrator",
    "writer"
)

graph.add_edge(
    "writer",
    "merge_sections"
)

graph.add_edge(
    "merge_sections",
    "editor"
)

# ---------------------------------------------------
# Final Output
# ---------------------------------------------------
graph.add_edge(
    "editor",
    END
)


# ---------------------------------------------------
# Compile
# ---------------------------------------------------
app = graph.compile()