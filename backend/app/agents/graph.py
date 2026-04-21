from langgraph.graph import StateGraph, END
from langgraph.checkpoint.memory import MemorySaver
from app.agents.state import AgentState
from app.agents.nodes.researcher import research_node
from app.agents.nodes.analyzer import analyze_node
from app.agents.nodes.writer import write_node
from app.agents.nodes.reviewer import review_node


def should_continue(state: AgentState) -> str:
    """Route based on current state."""
    if state.get("status") == "completed":
        return "end"
    if state.get("needs_human_review", False):
        return "human_review"
    if state.get("iteration", 0) >= state.get("max_iterations", 10):
        return "end"

    current = state.get("current_agent", "researcher")
    match current:
        case "researcher":
            return "analyze" if state.get("research_findings") else "research"
        case "analyzer":
            return "write" if state.get("analysis") else "analyze"
        case "writer":
            return "review" if state.get("draft") else "write"
        case "reviewer":
            feedback = state.get("review_feedback", [])
            if feedback and feedback[-1].get("approved", False):
                return "end"
            return "write"  # Send back for revision
        case _:
            return "research"


def human_review_handler(state: AgentState) -> AgentState:
    """Handle human-in-the-loop checkpoint."""
    return {
        **state,
        "needs_human_review": False,
        "iteration": state.get("iteration", 0) + 1,
    }


def build_workflow_graph() -> StateGraph:
    """Build the multi-agent workflow graph."""
    graph = StateGraph(AgentState)

    # Add nodes
    graph.add_node("research", research_node)
    graph.add_node("analyze", analyze_node)
    graph.add_node("write", write_node)
    graph.add_node("review", review_node)
    graph.add_node("human_review", human_review_handler)

    # Set entry point
    graph.set_entry_point("research")

    # Add conditional edges from each node
    graph.add_conditional_edges(
        "research",
        should_continue,
        {
            "analyze": "analyze",
            "research": "research",
            "end": END,
            "human_review": "human_review",
        },
    )

    graph.add_conditional_edges(
        "analyze",
        should_continue,
        {
            "write": "write",
            "analyze": "analyze",
            "end": END,
            "human_review": "human_review",
        },
    )

    graph.add_conditional_edges(
        "write",
        should_continue,
        {
            "review": "review",
            "write": "write",
            "end": END,
            "human_review": "human_review",
        },
    )

    graph.add_conditional_edges(
        "review",
        should_continue,
        {
            "write": "write",
            "end": END,
            "human_review": "human_review",
        },
    )

    graph.add_edge("human_review", "research")

    return graph


def create_workflow(checkpointer=None):
    """Create a compiled workflow with optional checkpointing."""
    graph = build_workflow_graph()
    if checkpointer is None:
        checkpointer = MemorySaver()
    return graph.compile(
        checkpointer=checkpointer,
        interrupt_before=["human_review"],
    )
