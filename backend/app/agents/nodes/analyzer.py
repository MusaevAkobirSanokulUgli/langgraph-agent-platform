import json
from datetime import datetime, timezone
from openai import AsyncOpenAI
from app.config import settings
from app.agents.state import AgentState

ANALYSIS_PROMPT = """You are an analysis agent. Analyze the research findings and provide insights.

Objective: {objective}
Research Findings: {findings}

Provide analysis as structured JSON with:
- "insights": list of key insights
- "recommendations": list of actionable recommendations
- "risk_factors": list of potential risks
- "confidence_score": float 0-1
- "summary": executive summary

Respond with valid JSON only."""


async def analyze_node(state: AgentState) -> dict:
    """Analysis agent node - analyzes research findings."""
    client = AsyncOpenAI(api_key=settings.openai_api_key)

    findings_text = json.dumps(state.get("research_findings", []), indent=2)

    prompt = ANALYSIS_PROMPT.format(
        objective=state["objective"],
        findings=findings_text,
    )

    response = await client.chat.completions.create(
        model=settings.llm_model,
        messages=[
            {"role": "system", "content": "You are an expert analyst. Output valid JSON."},
            {"role": "user", "content": prompt},
        ],
        temperature=0.3,
        response_format={"type": "json_object"},
    )

    content = response.choices[0].message.content
    try:
        analysis = json.loads(content)
    except json.JSONDecodeError:
        analysis = {"summary": content, "insights": [], "recommendations": []}

    needs_human = (
        state.get("human_in_the_loop", True) and analysis.get("confidence_score", 1.0) < 0.7
    )

    return {
        "analysis": analysis,
        "current_agent": "writer",
        "needs_human_review": needs_human,
        "messages": state.get("messages", [])
        + [
            {
                "role": "assistant",
                "content": f"[Analyzer] {analysis.get('summary', 'Analysis completed')}",
            }
        ],
    }
