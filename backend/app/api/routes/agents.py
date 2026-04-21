from fastapi import APIRouter
from app.models.schemas import AgentInfo, AgentRole

router = APIRouter(prefix="/agents")

AGENT_REGISTRY = [
    AgentInfo(
        role=AgentRole.RESEARCHER,
        description="Gathers and synthesizes information from various sources",
        capabilities=["web search", "document analysis", "data gathering"],
        tools=["web_search"],
        model="gpt-4o",
    ),
    AgentInfo(
        role=AgentRole.ANALYZER,
        description="Analyzes research findings and provides insights",
        capabilities=["data analysis", "pattern recognition", "risk assessment"],
        tools=["calculator"],
        model="gpt-4o",
    ),
    AgentInfo(
        role=AgentRole.WRITER,
        description="Creates high-quality content based on research and analysis",
        capabilities=["content creation", "technical writing", "summarization"],
        tools=[],
        model="gpt-4o",
    ),
    AgentInfo(
        role=AgentRole.REVIEWER,
        description="Evaluates content quality and provides feedback",
        capabilities=["quality review", "fact checking", "consistency verification"],
        tools=[],
        model="gpt-4o",
    ),
]


@router.get("/", response_model=list[AgentInfo])
async def list_agents():
    return AGENT_REGISTRY


@router.get("/{role}", response_model=AgentInfo)
async def get_agent(role: AgentRole):
    for agent in AGENT_REGISTRY:
        if agent.role == role:
            return agent
    return AGENT_REGISTRY[0]
