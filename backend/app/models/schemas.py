from pydantic import BaseModel, Field, ConfigDict, field_validator
from enum import Enum
from datetime import datetime
from uuid import UUID, uuid4


class AgentRole(str, Enum):
    RESEARCHER = "researcher"
    ANALYZER = "analyzer"
    WRITER = "writer"
    REVIEWER = "reviewer"


class WorkflowStatus(str, Enum):
    PENDING = "pending"
    RUNNING = "running"
    WAITING_HUMAN = "waiting_human_input"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"


class WorkflowType(str, Enum):
    RESEARCH = "research"
    ANALYSIS = "analysis"
    CONTENT_CREATION = "content_creation"
    CODE_REVIEW = "code_review"


class AgentMessage(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    agent: AgentRole
    content: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now())
    metadata: dict[str, str] = Field(default_factory=dict)


class ToolCall(BaseModel):
    tool_name: str
    arguments: dict
    result: str | None = None
    duration_ms: float | None = None


class WorkflowStep(BaseModel):
    step_number: int
    agent: AgentRole
    action: str
    input_data: dict = Field(default_factory=dict)
    output_data: dict = Field(default_factory=dict)
    tool_calls: list[ToolCall] = Field(default_factory=list)
    started_at: datetime | None = None
    completed_at: datetime | None = None


class CreateWorkflowRequest(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    workflow_type: WorkflowType
    objective: str = Field(..., min_length=5, max_length=2000)
    context: str = Field(default="", max_length=5000)
    human_in_the_loop: bool = True
    max_iterations: int = Field(default=10, ge=1, le=50)

    @field_validator("objective")
    @classmethod
    def validate_objective(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("Objective cannot be empty")
        return v.strip()


class WorkflowResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID = Field(default_factory=uuid4)
    workflow_type: WorkflowType
    status: WorkflowStatus
    objective: str
    steps: list[WorkflowStep] = Field(default_factory=list)
    messages: list[AgentMessage] = Field(default_factory=list)
    current_agent: AgentRole | None = None
    result: str | None = None
    created_at: datetime
    updated_at: datetime | None = None


class HumanFeedback(BaseModel):
    workflow_id: UUID
    feedback: str = Field(..., min_length=1, max_length=2000)
    approved: bool
    modifications: dict[str, str] = Field(default_factory=dict)


class AgentInfo(BaseModel):
    role: AgentRole
    description: str
    capabilities: list[str]
    tools: list[str]
    model: str


class WorkflowEvent(BaseModel):
    event_type: str  # "agent_started", "tool_called", "step_completed", "human_needed", "completed"
    workflow_id: UUID
    data: dict
    timestamp: datetime = Field(default_factory=lambda: datetime.now())
