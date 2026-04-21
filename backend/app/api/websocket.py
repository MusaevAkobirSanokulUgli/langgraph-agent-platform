import json
from uuid import UUID
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.services.workflow_engine import engine

router = APIRouter()


@router.websocket("/ws/workflows/{workflow_id}")
async def workflow_events(websocket: WebSocket, workflow_id: UUID):
    await websocket.accept()
    try:
        async for event in engine.subscribe_events(workflow_id):
            await websocket.send_json(event.model_dump(mode="json"))
    except WebSocketDisconnect:
        pass
