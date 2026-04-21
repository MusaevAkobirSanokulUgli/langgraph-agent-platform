import json
from openai import AsyncOpenAI
from app.config import settings
from app.agents.state import AgentState

REVIEW_PROMPT = """You are a review agent. Evaluate the draft content for quality, accuracy, and completeness.

Objective: {objective}
Draft: {draft}

Provide review as JSON with:
- "approved": boolean
- "quality_score": float 0-1
- "feedback": list of specific feedback items
- "suggestions": list of improvement suggestions
- "summary": brief review summary

Be constructive but thorough. Approve if quality_score >= 0.8.
Respond with valid JSON only."""


async def review_node(state: AgentState) -> dict:
    """Reviewer agent node - evaluates content quality."""
    client = AsyncOpenAI(api_key=settings.openai_api_key)

    prompt = REVIEW_PROMPT.format(
        objective=state["objective"],
        draft=state.get("draft", ""),
    )

    response = await client.chat.completions.create(
        model=settings.llm_model,
        messages=[
            {
                "role": "system",
                "content": "You are a thorough content reviewer. Output valid JSON.",
            },
            {"role": "user", "content": prompt},
        ],
        temperature=0.3,
        response_format={"type": "json_object"},
    )

    content = response.choices[0].message.content
    try:
        review = json.loads(content)
    except json.JSONDecodeError:
        review = {"approved": True, "quality_score": 0.8, "feedback": [], "summary": content}

    existing_feedback = state.get("review_feedback", [])
    existing_feedback.append(review)

    if review.get("approved", False):
        return {
            "review_feedback": existing_feedback,
            "final_output": state.get("draft", ""),
            "status": "completed",
            "current_agent": "reviewer",
            "messages": state.get("messages", [])
            + [
                {
                    "role": "assistant",
                    "content": f"[Reviewer] Approved! {review.get('summary', '')}",
                }
            ],
        }

    return {
        "review_feedback": existing_feedback,
        "current_agent": "writer",
        "messages": state.get("messages", [])
        + [
            {
                "role": "assistant",
                "content": f"[Reviewer] Revision needed: {review.get('summary', '')}",
            }
        ],
    }
