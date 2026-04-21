# LangGraph Agent Platform

Production-grade multi-agent orchestration platform demonstrating LangGraph StateGraph, human-in-the-loop workflows, async Python, FastAPI with Pydantic v2, and real-time WebSocket streaming.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    LangGraph StateGraph                         │
│                                                                 │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐  │
│  │ Research │───>│ Analyze  │───>│  Write   │───>│  Review  │  │
│  │  Agent   │    │  Agent   │    │  Agent   │    │  Agent   │  │
│  └──────────┘    └──────────┘    └──────────┘    └──────────┘  │
│       ^                │               ^               │        │
│       │                │ low           │  revision     │        │
│       │                v confidence    │  needed       v        │
│       │          ┌──────────┐          │          ┌──────────┐  │
│       └──────────│  Human   │          └──────────│   End    │  │
│    after feedback│  Review  │                     │  (Done)  │  │
│                  └──────────┘                     └──────────┘  │
│                  (interrupt_before)                              │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                       API Layer                                 │
│                                                                 │
│  FastAPI ──> WorkflowEngine ──> LangGraph compiled graph        │
│      │                                                          │
│      ├── REST: /api/v1/workflows/, /agents/, /health            │
│      └── WebSocket: /api/v1/ws/workflows/{id}                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Agents

| Agent | Role | Tools | Output |
|-------|------|-------|--------|
| **Researcher** | Gathers structured information with confidence scoring | `web_search` | `research_findings: list[dict]` |
| **Analyzer** | Extracts insights, identifies risks, assesses confidence | `calculator` | `analysis: dict` |
| **Writer** | Creates content incorporating research, analysis, and feedback | — | `draft: str` |
| **Reviewer** | Scores quality (0–1), approves at ≥0.8 or sends back with feedback | — | `review_feedback: list[dict]` |

---

## Tech Stack

**Backend**
- Python 3.11+
- FastAPI 0.115+ with async lifespan
- LangGraph 0.2+ — StateGraph, MemorySaver, interrupt_before
- LangChain 0.3+ — tool decorators, OpenAI integration
- Pydantic v2 — schemas, field validators, ConfigDict
- OpenAI — async GPT-4o client with JSON mode
- uvicorn[standard] — ASGI server with WebSocket support

**Infrastructure**
- Docker + Docker Compose
- Redis (for production checkpoint persistence)
- pytest + pytest-asyncio for async test suite

**Frontend**
- Next.js 14 (App Router, static export)
- TypeScript strict mode
- Tailwind CSS v3
- Lucide React icons

---

## Key Features

### LangGraph StateGraph
```python
graph = StateGraph(AgentState)
graph.add_node("research", research_node)
graph.add_node("analyze", analyze_node)
graph.add_conditional_edges("research", should_continue, {...})
workflow = graph.compile(
    checkpointer=MemorySaver(),
    interrupt_before=["human_review"],
)
```

### Human-in-the-Loop
```python
# Workflow halts at human_review node — state is persisted
result = workflow.invoke(initial_state, config)

# Resume after human provides feedback
workflow.update_state(config, {"human_feedback": "...", "needs_human_review": False})
```

### TypedDict State with Reducers
```python
class AgentState(TypedDict):
    messages: Annotated[list, add]  # append-only reducer
    research_findings: list[dict]
    needs_human_review: bool
    human_feedback: str | None
```

### Pydantic v2 Schemas
```python
class CreateWorkflowRequest(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)
    workflow_type: WorkflowType
    objective: str = Field(..., min_length=5, max_length=2000)

    @field_validator("objective")
    @classmethod
    def validate_objective(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("Objective cannot be empty")
        return v.strip()
```

### Async Architecture
```python
# Async node
async def research_node(state: AgentState) -> dict:
    client = AsyncOpenAI(api_key=settings.openai_api_key)
    response = await client.chat.completions.create(...)
    return {"research_findings": [...], "current_agent": "analyzer"}

# Graph runs in thread to avoid blocking event loop
result = await asyncio.to_thread(lambda: compiled.invoke(state, config))
```

---

## API Documentation

### Create Workflow
```bash
curl -X POST http://localhost:8000/api/v1/workflows/ \
  -H "Content-Type: application/json" \
  -d '{
    "workflow_type": "research",
    "objective": "Analyze AI infrastructure market trends",
    "context": "Focus on GPU cloud providers",
    "human_in_the_loop": true,
    "max_iterations": 10
  }'
```

Response:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "workflow_type": "research",
  "status": "running",
  "objective": "Analyze AI infrastructure market trends",
  "created_at": "2025-01-01T00:00:00Z"
}
```

### Submit Human Feedback
```bash
curl -X POST http://localhost:8000/api/v1/workflows/{id}/feedback \
  -H "Content-Type: application/json" \
  -d '{
    "workflow_id": "550e8400-e29b-41d4-a716-446655440000",
    "feedback": "Focus specifically on inference infrastructure costs",
    "approved": false
  }'
```

### Real-time Events (WebSocket)
```javascript
const ws = new WebSocket('ws://localhost:8000/api/v1/ws/workflows/{id}')
ws.onmessage = (e) => {
  const event = JSON.parse(e.data)
  // event.event_type: "agent_started" | "tool_called" | "step_completed" | "human_needed" | "completed"
  console.log(event)
}
```

### List Agents
```bash
curl http://localhost:8000/api/v1/agents/
```

---

## Quick Start

### Prerequisites
- Python 3.11+
- OpenAI API key
- Docker (optional)

### Local Development
```bash
git clone https://github.com/your-username/langgraph-agent-platform
cd langgraph-agent-platform/backend

# Configure environment
cp .env.example .env
# Edit .env: set AGENT_OPENAI_API_KEY=sk-...

# Install dependencies
pip install -e ".[dev]"

# Run server
uvicorn app.main:app --reload --port 8000

# API docs at http://localhost:8000/docs
```

### Docker
```bash
cd langgraph-agent-platform
cp backend/.env.example backend/.env
# Edit backend/.env

docker-compose up -d
# API: http://localhost:8000
# Redis: localhost:6379
```

### Frontend
```bash
cd web
npm install
npm run dev
# http://localhost:3000
```

### Tests
```bash
cd backend
pytest tests/ -v

# Output:
# tests/test_graph.py::test_graph_builds PASSED
# tests/test_graph.py::test_should_continue_completed PASSED
# tests/test_graph.py::test_should_continue_human_review PASSED
# tests/test_agents.py::test_calculator PASSED
# tests/test_agents.py::test_memory_add_and_search PASSED
# tests/test_api.py::test_health PASSED
# tests/test_api.py::test_list_agents PASSED
```

---

## Project Structure

```
langgraph-agent-platform/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI app with lifespan
│   │   ├── config.py            # Pydantic-settings config
│   │   ├── models/schemas.py    # All Pydantic v2 models
│   │   ├── agents/
│   │   │   ├── graph.py         # StateGraph definition + routing
│   │   │   ├── state.py         # AgentState TypedDict
│   │   │   ├── memory.py        # Long-term conversation memory
│   │   │   ├── nodes/           # researcher, analyzer, writer, reviewer
│   │   │   └── tools/           # web_search, calculator, code_executor
│   │   ├── api/
│   │   │   ├── routes/          # workflows, agents, health
│   │   │   └── websocket.py     # Real-time event streaming
│   │   └── services/
│   │       ├── workflow_engine.py  # Workflow lifecycle management
│   │       └── checkpoint.py       # State persistence service
│   ├── tests/                   # pytest-asyncio test suite
│   ├── pyproject.toml
│   ├── Dockerfile
│   └── .env.example
├── web/                         # Next.js 14 showcase site
│   ├── app/
│   │   ├── page.tsx             # Main landing page
│   │   └── demo/page.tsx        # Interactive demo
│   └── components/              # WorkflowVisualizer, AgentCard, StateTimeline
├── docker-compose.yml
└── README.md
```

---

## Design Decisions

**Why LangGraph over plain LangChain?**
LangGraph provides explicit state management, cycle support, and interrupt/resume semantics that plain chains lack. The StateGraph API makes agent routing declarative and testable.

**Why TypedDict over dataclasses?**
LangGraph requires dict-compatible state for its checkpointer and reducer system. TypedDict provides type safety at the type-checker level without runtime overhead.

**Why in-memory checkpointing?**
The MemorySaver is sufficient for demonstration. Production would swap to `langgraph.checkpoint.redis.RedisSaver` using the existing Redis service — a one-line change.

**Why asyncio.to_thread for graph execution?**
LangGraph's sync `invoke()` would block the async event loop. `asyncio.to_thread` runs it in a thread pool, keeping FastAPI responsive to other requests during graph execution.
