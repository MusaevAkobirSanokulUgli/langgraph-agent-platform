import json
from datetime import datetime, timezone
from openai import AsyncOpenAI
from app.config import settings
from app.agents.state import AgentState

RESEARCH_PROMPT = """You are a research agent. Your job is to gather information relevant to the objective.

Objective: {objective}
Context: {context}

Previous findings: {previous_findings}

Provide your research findings as a structured JSON with:
- "sources": list of source descriptions
- "key_findings": list of key findings
- "summary": brief summary
- "confidence": float 0-1
- "needs_more_research": boolean

Respond with valid JSON only."""


async def research_node(state: AgentState) -> dict:
    """Research agent node - gathers information."""
    client = AsyncOpenAI(api_key=settings.openai_api_key)

    previous = json.dumps(state.get("research_findings", []), indent=2)

    prompt = RESEARCH_PROMPT.format(
        objective=state["objective"],
        context=state.get("context", ""),
        previous_findings=previous,
    )

    response = await client.chat.completions.create(
        model=settings.llm_model,
        messages=[
            {"role": "system", "content": "You are a thorough research agent. Output valid JSON."},
            {"role": "user", "content": prompt},
        ],
        temperature=0.3,
        response_format={"type": "json_object"},
    )

    content = response.choices[0].message.content
    try:
        findings = json.loads(content)
    except json.JSONDecodeError:
        findings = {"summary": content, "key_findings": [], "sources": [], "confidence": 0.5}

    existing_findings = state.get("research_findings", [])
    existing_findings.append(
        {
            "iteration": state.get("iteration", 0),
            "timestamp": datetime.now(timezone.utc).isoformat(),
            **findings,
        }
    )

    return {
        "research_findings": existing_findings,
        "current_agent": "analyzer" if findings.get("confidence", 0) > 0.6 else "researcher",
        "iteration": state.get("iteration", 0) + 1,
        "messages": state.get("messages", [])
        + [
            {
                "role": "assistant",
                "content": f"[Researcher] {findings.get('summary', 'Research completed')}",
            }
        ],
    }
