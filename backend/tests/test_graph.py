from app.agents.graph import build_workflow_graph, should_continue
from app.agents.state import AgentState


def test_graph_builds():
    graph = build_workflow_graph()
    assert graph is not None


def test_should_continue_completed():
    state = {"status": "completed"}
    assert should_continue(state) == "end"


def test_should_continue_max_iterations():
    state = {"iteration": 10, "max_iterations": 10, "status": "running"}
    assert should_continue(state) == "end"


def test_should_continue_researcher():
    state = {
        "current_agent": "researcher",
        "research_findings": [],
        "iteration": 0,
        "max_iterations": 10,
        "status": "running",
    }
    assert should_continue(state) == "research"


def test_should_continue_researcher_done():
    state = {
        "current_agent": "researcher",
        "research_findings": [{"data": "test"}],
        "iteration": 0,
        "max_iterations": 10,
        "status": "running",
    }
    assert should_continue(state) == "analyze"


def test_should_continue_human_review():
    state = {
        "needs_human_review": True,
        "iteration": 0,
        "max_iterations": 10,
        "status": "running",
    }
    assert should_continue(state) == "human_review"
