from typing import Annotated, TypedDict
from operator import add


class AgentState(TypedDict):
    """Main state for the multi-agent workflow."""

    messages: Annotated[list, add]
    objective: str
    context: str
    current_agent: str
    iteration: int
    max_iterations: int
    human_in_the_loop: bool

    # Research results
    research_findings: list[dict]

    # Analysis results
    analysis: dict

    # Draft content
    draft: str

    # Review feedback
    review_feedback: list[dict]

    # Final output
    final_output: str
    status: str

    # Human feedback
    human_feedback: str | None
    needs_human_review: bool


class ResearchState(TypedDict):
    query: str
    sources: list[dict]
    summary: str


class AnalysisState(TypedDict):
    data: dict
    insights: list[str]
    recommendations: list[str]
