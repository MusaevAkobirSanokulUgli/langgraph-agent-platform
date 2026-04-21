import asyncio
import logging
from uuid import UUID, uuid4
from datetime import datetime, timezone
from app.agents.graph import create_workflow
from app.agents.state import AgentState
from app.models.schemas import (
    WorkflowResponse,
    WorkflowStatus,
    WorkflowType,
    HumanFeedback,
    WorkflowEvent,
)

logger = logging.getLogger(__name__)


class WorkflowEngine:
    def __init__(self):
        self._workflows: dict[UUID, WorkflowResponse] = {}
        self._compiled_graphs: dict[UUID, object] = {}
        self._event_queues: dict[UUID, asyncio.Queue] = {}

    async def create_workflow(
        self,
        workflow_type: WorkflowType,
        objective: str,
        context: str = "",
        human_in_the_loop: bool = True,
        max_iterations: int = 10,
    ) -> WorkflowResponse:
        workflow_id = uuid4()
        now = datetime.now(timezone.utc)

        workflow = WorkflowResponse(
            id=workflow_id,
            workflow_type=workflow_type,
            status=WorkflowStatus.PENDING,
            objective=objective,
            created_at=now,
            updated_at=now,
        )
        self._workflows[workflow_id] = workflow
        self._event_queues[workflow_id] = asyncio.Queue()

        return workflow

    async def start_workflow(self, workflow_id: UUID) -> None:
        workflow = self._workflows.get(workflow_id)
        if not workflow:
            raise ValueError(f"Workflow {workflow_id} not found")

        workflow.status = WorkflowStatus.RUNNING
        workflow.updated_at = datetime.now(timezone.utc)

        compiled = create_workflow()
        self._compiled_graphs[workflow_id] = compiled

        initial_state: AgentState = {
            "messages": [],
            "objective": workflow.objective,
            "context": "",
            "current_agent": "researcher",
            "iteration": 0,
            "max_iterations": 10,
            "human_in_the_loop": True,
            "research_findings": [],
            "analysis": {},
            "draft": "",
            "review_feedback": [],
            "final_output": "",
            "status": "running",
            "human_feedback": None,
            "needs_human_review": False,
        }

        try:
            config = {"configurable": {"thread_id": str(workflow_id)}}
            result = await asyncio.to_thread(lambda: compiled.invoke(initial_state, config))

            workflow.status = WorkflowStatus.COMPLETED
            workflow.result = result.get("final_output", "")

        except Exception as e:
            logger.error(f"Workflow {workflow_id} failed: {e}")
            workflow.status = WorkflowStatus.FAILED

        workflow.updated_at = datetime.now(timezone.utc)

    async def submit_human_feedback(self, feedback: HumanFeedback) -> WorkflowResponse:
        workflow = self._workflows.get(feedback.workflow_id)
        if not workflow:
            raise ValueError(f"Workflow {feedback.workflow_id} not found")

        compiled = self._compiled_graphs.get(feedback.workflow_id)
        if compiled:
            config = {"configurable": {"thread_id": str(feedback.workflow_id)}}
            compiled.update_state(
                config,
                {
                    "human_feedback": feedback.feedback,
                    "needs_human_review": False,
                },
            )
            workflow.status = WorkflowStatus.RUNNING

        workflow.updated_at = datetime.now(timezone.utc)
        return workflow

    def get_workflow(self, workflow_id: UUID) -> WorkflowResponse | None:
        return self._workflows.get(workflow_id)

    def list_workflows(self, skip: int = 0, limit: int = 20) -> list[WorkflowResponse]:
        workflows = list(self._workflows.values())
        return workflows[skip : skip + limit]

    async def subscribe_events(self, workflow_id: UUID):
        queue = self._event_queues.get(workflow_id)
        if not queue:
            return
        while True:
            event = await queue.get()
            yield event
            if event.event_type == "completed":
                break


# Global engine instance
engine = WorkflowEngine()
