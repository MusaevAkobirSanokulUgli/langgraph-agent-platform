import asyncio
from uuid import UUID
from fastapi import APIRouter, HTTPException, BackgroundTasks
from app.models.schemas import (
    CreateWorkflowRequest,
    WorkflowResponse,
    HumanFeedback,
)
from app.services.workflow_engine import engine

router = APIRouter(prefix="/workflows")


@router.post("/", response_model=WorkflowResponse, status_code=201)
async def create_workflow(
    request: CreateWorkflowRequest,
    background_tasks: BackgroundTasks,
):
    workflow = await engine.create_workflow(
        workflow_type=request.workflow_type,
        objective=request.objective,
        context=request.context,
        human_in_the_loop=request.human_in_the_loop,
        max_iterations=request.max_iterations,
    )
    background_tasks.add_task(engine.start_workflow, workflow.id)
    return workflow


@router.get("/{workflow_id}", response_model=WorkflowResponse)
async def get_workflow(workflow_id: UUID):
    workflow = engine.get_workflow(workflow_id)
    if not workflow:
        raise HTTPException(status_code=404, detail="Workflow not found")
    return workflow


@router.get("/", response_model=list[WorkflowResponse])
async def list_workflows(skip: int = 0, limit: int = 20):
    return engine.list_workflows(skip=skip, limit=limit)


@router.post("/{workflow_id}/feedback", response_model=WorkflowResponse)
async def submit_feedback(workflow_id: UUID, feedback: HumanFeedback):
    feedback.workflow_id = workflow_id
    try:
        return await engine.submit_human_feedback(feedback)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.post("/{workflow_id}/cancel")
async def cancel_workflow(workflow_id: UUID):
    workflow = engine.get_workflow(workflow_id)
    if not workflow:
        raise HTTPException(status_code=404, detail="Workflow not found")
    workflow.status = "cancelled"
    return {"status": "cancelled"}
