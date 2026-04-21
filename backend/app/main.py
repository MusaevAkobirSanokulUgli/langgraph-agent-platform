from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.api.routes import workflows, agents, health
from app.api.websocket import router as ws_router
from app.services.checkpoint import CheckpointService


@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.checkpoint_service = CheckpointService()
    await app.state.checkpoint_service.initialize()
    yield
    await app.state.checkpoint_service.close()


app = FastAPI(
    title="LangGraph Agent Platform",
    description="Multi-agent orchestration platform with human-in-the-loop workflows",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, prefix="/api/v1", tags=["health"])
app.include_router(workflows.router, prefix="/api/v1", tags=["workflows"])
app.include_router(agents.router, prefix="/api/v1", tags=["agents"])
app.include_router(ws_router, prefix="/api/v1", tags=["websocket"])
