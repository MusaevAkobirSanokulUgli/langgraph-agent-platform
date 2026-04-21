import json
from openai import AsyncOpenAI
from app.config import settings
from app.agents.state import AgentState

WRITER_PROMPT = """You are a writing agent. Create high-quality content based on research and analysis.

Objective: {objective}
Research: {research}
Analysis: {analysis}
Review Feedback: {feedback}
Human Feedback: {human_feedback}

Write comprehensive, well-structured content that addresses the objective.
If there is review feedback, incorporate the suggestions."""


async def write_node(state: AgentState) -> dict:
    """Writer agent node - creates content."""
    client = AsyncOpenAI(api_key=settings.openai_api_key)

    prompt = WRITER_PROMPT.format(
        objective=state["objective"],
        research=json.dumps(state.get("research_findings", [])[:3], indent=2),
        analysis=json.dumps(state.get("analysis", {}), indent=2),
        feedback=json.dumps(state.get("review_feedback", []), indent=2),
        human_feedback=state.get("human_feedback", "None"),
    )

    response = await client.chat.completions.create(
        model=settings.llm_model,
        messages=[
            {
                "role": "system",
                "content": "You are an expert content writer. Write clear, comprehensive content.",
            },
            {"role": "user", "content": prompt},
        ],
        temperature=0.7,
    )

    draft = response.choices[0].message.content

    return {
        "draft": draft,
        "current_agent": "reviewer",
        "messages": state.get("messages", [])
        + [
            {
                "role": "assistant",
                "content": f"[Writer] Draft created ({len(draft)} chars)",
            }
        ],
    }
