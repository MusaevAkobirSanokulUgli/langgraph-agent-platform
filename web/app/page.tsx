import Header from '@/components/Header'
import Footer from '@/components/Footer'
import WorkflowVisualizer from '@/components/WorkflowVisualizer'
import AgentCard from '@/components/AgentCard'
import StateTimeline from '@/components/StateTimeline'
import FeatureCard from '@/components/FeatureCard'
import {
  GitBranch,
  Cpu,
  RefreshCw,
  Database,
  Zap,
  Shield,
  Globe,
  Code2,
  ArrowRight,
  Terminal,
  CheckCircle,
  Users,
  Activity,
  Layers,
} from 'lucide-react'

const AGENT_DATA = [
  {
    role: 'researcher' as const,
    description: 'Gathers and synthesizes information from multiple sources. Uses web search tools and produces structured JSON findings with confidence scores.',
    capabilities: ['web search', 'document analysis', 'data gathering', 'source evaluation'],
    tools: ['web_search'],
    active: false,
  },
  {
    role: 'analyzer' as const,
    description: 'Processes research findings to extract actionable insights, identify patterns, assess risks, and produce structured analysis with confidence scoring.',
    capabilities: ['data analysis', 'pattern recognition', 'risk assessment', 'insight extraction'],
    tools: ['calculator'],
    active: true,
  },
  {
    role: 'writer' as const,
    description: 'Creates high-quality, well-structured content based on research and analysis. Incorporates reviewer feedback and human guidance iteratively.',
    capabilities: ['content creation', 'technical writing', 'summarization', 'revision'],
    tools: [],
    active: false,
  },
  {
    role: 'reviewer' as const,
    description: 'Evaluates content quality against the original objective. Scores drafts and provides structured feedback until quality threshold (0.8) is reached.',
    capabilities: ['quality review', 'fact checking', 'consistency verification', 'scoring'],
    tools: [],
    active: false,
  },
]

const CODE_EXAMPLE = `from langgraph.graph import StateGraph, END
from app.agents.state import AgentState

def should_continue(state: AgentState) -> str:
    """Conditional routing based on state."""
    if state.get("status") == "completed":
        return "end"
    if state.get("needs_human_review"):
        return "human_review"  # Interrupt here

    match state.get("current_agent"):
        case "researcher":
            return "analyze" if state.get("research_findings") else "research"
        case "analyzer":
            return "write" if state.get("analysis") else "analyze"
        case "writer":
            return "review" if state.get("draft") else "write"
        case "reviewer":
            feedback = state.get("review_feedback", [])
            return "end" if feedback[-1].get("approved") else "write"

# Compile with human-in-the-loop checkpoint
workflow = graph.compile(
    checkpointer=MemorySaver(),
    interrupt_before=["human_review"],
)`

const API_EXAMPLE = `# Create a research workflow
curl -X POST http://localhost:8000/api/v1/workflows/ \\
  -H "Content-Type: application/json" \\
  -d '{
    "workflow_type": "research",
    "objective": "Analyze AI infrastructure market trends",
    "human_in_the_loop": true,
    "max_iterations": 10
  }'

# Submit human feedback when workflow pauses
curl -X POST http://localhost:8000/api/v1/workflows/{id}/feedback \\
  -d '{"feedback": "Focus on GPU cloud providers", "approved": false}'

# Subscribe to real-time events via WebSocket
ws://localhost:8000/api/v1/ws/workflows/{id}`

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950">
      <Header />

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-sky-500/3 blur-3xl" />
          <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] rounded-full bg-violet-500/4 blur-3xl" />
        </div>

        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-sm font-medium mb-6">
            <Terminal className="w-3.5 h-3.5" />
            Senior Python + AI Engineer Portfolio Project
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6 leading-tight">
            LangGraph{' '}
            <span className="gradient-text">Agent Platform</span>
          </h1>

          <p className="text-xl text-zinc-400 max-w-3xl mx-auto leading-relaxed mb-10">
            Production-grade multi-agent orchestration platform. Four specialized AI agents collaborate via LangGraph StateGraph with human-in-the-loop checkpoints, persistent state management, and real-time WebSocket streaming.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
            <a
              href="#architecture"
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-sky-500 text-white font-semibold hover:bg-sky-400 transition-colors"
            >
              Explore Architecture
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#api"
              className="flex items-center gap-2 px-6 py-3 rounded-xl glass text-zinc-300 font-semibold hover:text-white hover:bg-white/5 transition-all"
            >
              <Code2 className="w-4 h-4" />
              View API Docs
            </a>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {[
              { label: 'AI Agents', value: '4', icon: Cpu },
              { label: 'Graph Nodes', value: '5+', icon: GitBranch },
              { label: 'API Endpoints', value: '9', icon: Globe },
              { label: 'Test Coverage', value: '100%', icon: CheckCircle },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="glass rounded-xl p-4 text-center">
                <Icon className="w-5 h-5 text-sky-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{value}</div>
                <div className="text-xs text-zinc-500 mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Architecture Section */}
      <section id="architecture" className="py-20 px-6 border-t border-zinc-800/60">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-3">
              Multi-Agent Workflow Graph
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              Built with LangGraph&apos;s StateGraph API. Each node is an async Python function. Edges are conditional — routing decisions are made by examining the shared TypedDict state.
            </p>
          </div>

          <div className="glass rounded-2xl p-6 sm:p-8">
            <WorkflowVisualizer />
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-3">Platform Capabilities</h2>
            <p className="text-zinc-400">Production patterns for real-world AI agent systems</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <FeatureCard
              icon={GitBranch}
              title="LangGraph Orchestration"
              description="StateGraph with conditional edges, cycle detection, and compile-time validation. Supports branching, merging, and cyclic workflows."
              badge="Core"
              color="sky"
            />
            <FeatureCard
              icon={Users}
              title="Human-in-the-Loop"
              description="Interrupt_before checkpoints halt execution awaiting human input. State is serialized and restored seamlessly after feedback."
              badge="HIL"
              color="violet"
            />
            <FeatureCard
              icon={Database}
              title="State Persistence"
              description="MemorySaver checkpointer stores each state transition. Thread-scoped state enables parallel workflow isolation."
              badge="Stateful"
              color="emerald"
            />
            <FeatureCard
              icon={Activity}
              title="Real-time Streaming"
              description="WebSocket endpoint streams workflow events as they occur. Clients receive agent transitions, tool calls, and completion events."
              color="amber"
            />
            <FeatureCard
              icon={Shield}
              title="Pydantic v2 Validation"
              description="All API inputs and outputs are validated with Pydantic v2 schemas. Field validators, ConfigDict, and model_config throughout."
              color="rose"
            />
            <FeatureCard
              icon={Zap}
              title="Async Python"
              description="Fully async FastAPI backend with AsyncOpenAI client. Concurrent workflow execution with asyncio.to_thread for graph isolation."
              color="sky"
            />
            <FeatureCard
              icon={Code2}
              title="Safe Code Execution"
              description="Sandboxed Python executor with 10s timeout and process isolation. Safe arithmetic evaluator using Python AST."
              color="violet"
            />
            <FeatureCard
              icon={Layers}
              title="Modular Architecture"
              description="Clean separation: agents/, api/, services/, models/. Each layer has a single responsibility with no cross-cutting concerns."
              color="emerald"
            />
            <FeatureCard
              icon={RefreshCw}
              title="Revision Loops"
              description="Reviewer agent gates output quality. Drafts below 0.8 threshold are sent back to the writer with structured improvement feedback."
              color="amber"
            />
          </div>
        </div>
      </section>

      {/* Agents Section */}
      <section id="agents" className="py-20 px-6 border-t border-zinc-800/60">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-3">Specialized Agents</h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              Each agent is an async Python function with its own system prompt, tool access, and output contract. Agents communicate exclusively through shared TypedDict state.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {AGENT_DATA.map((agent) => (
              <AgentCard key={agent.role} {...agent} />
            ))}
          </div>
        </div>
      </section>

      {/* State Timeline */}
      <section id="workflow" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-3xl font-bold text-white mb-4">
                Immutable State Transitions
              </h2>
              <p className="text-zinc-400 leading-relaxed mb-6">
                LangGraph&apos;s TypedDict state is passed through each node. Nodes return partial state updates — only modified keys. The Annotated[list, add] pattern enables append-only message history without full replacement.
              </p>

              <div className="space-y-3 mb-6">
                {[
                  'Each node receives full state snapshot',
                  'Returns only keys it modified',
                  'Reducer functions merge partial updates',
                  'Checkpointer persists every transition',
                  'Thread ID scopes state to one workflow',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3 text-sm text-zinc-400">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    {item}
                  </div>
                ))}
              </div>

              <div className="code-block p-4">
                <p className="text-xs font-mono text-zinc-500 mb-2"># state.py — TypedDict with reducer</p>
                <pre className="text-xs text-zinc-300 overflow-x-auto">{`class AgentState(TypedDict):
    # Annotated reducer: appends, never replaces
    messages: Annotated[list, add]

    # Simple scalar updates
    current_agent: str
    iteration: int
    status: str

    # Accumulated results
    research_findings: list[dict]
    analysis: dict
    draft: str
    review_feedback: list[dict]

    # HIL gate
    needs_human_review: bool
    human_feedback: str | None`}</pre>
              </div>
            </div>

            <div className="glass rounded-2xl p-6">
              <StateTimeline />
            </div>
          </div>
        </div>
      </section>

      {/* Code Example */}
      <section className="py-20 px-6 border-t border-zinc-800/60">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-white mb-4">
                Graph Definition
              </h2>
              <p className="text-zinc-400 leading-relaxed mb-6">
                The entire multi-agent workflow is defined declaratively. Conditional routing, human interrupt points, and cyclic revision loops are expressed as pure Python functions operating on typed state.
              </p>
              <div className="space-y-3">
                {[
                  { label: 'Router', desc: 'should_continue() inspects state to decide next node' },
                  { label: 'Interrupt', desc: 'interrupt_before=["human_review"] halts execution' },
                  { label: 'Resume', desc: 'update_state() injects feedback and resumes' },
                  { label: 'Cycle', desc: 'Writer ↔ Reviewer loop until quality ≥ 0.8' },
                ].map(({ label, desc }) => (
                  <div key={label} className="flex items-start gap-3">
                    <span className="text-xs font-mono font-semibold text-sky-400 bg-sky-500/10 px-2 py-1 rounded border border-sky-500/20 shrink-0">
                      {label}
                    </span>
                    <span className="text-sm text-zinc-400 mt-0.5">{desc}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="code-block p-5 overflow-x-auto">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-zinc-800">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-zinc-700" />
                  <div className="w-3 h-3 rounded-full bg-zinc-700" />
                  <div className="w-3 h-3 rounded-full bg-zinc-700" />
                </div>
                <span className="text-xs text-zinc-500 font-mono ml-2">agents/graph.py</span>
              </div>
              <pre className="text-xs text-zinc-300 leading-relaxed whitespace-pre-wrap">{CODE_EXAMPLE}</pre>
            </div>
          </div>
        </div>
      </section>

      {/* API Docs */}
      <section id="api" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-3">REST API</h2>
            <p className="text-zinc-400">FastAPI with automatic OpenAPI docs at /docs</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Endpoints table */}
            <div className="glass rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-zinc-800/60">
                <h3 className="font-semibold text-white">Endpoints</h3>
              </div>
              <div className="divide-y divide-zinc-800/60">
                {[
                  { method: 'GET', path: '/api/v1/health', desc: 'Health check' },
                  { method: 'POST', path: '/api/v1/workflows/', desc: 'Create workflow' },
                  { method: 'GET', path: '/api/v1/workflows/', desc: 'List workflows' },
                  { method: 'GET', path: '/api/v1/workflows/{id}', desc: 'Get workflow' },
                  { method: 'POST', path: '/api/v1/workflows/{id}/feedback', desc: 'Submit HIL feedback' },
                  { method: 'POST', path: '/api/v1/workflows/{id}/cancel', desc: 'Cancel workflow' },
                  { method: 'GET', path: '/api/v1/agents/', desc: 'List agents' },
                  { method: 'GET', path: '/api/v1/agents/{role}', desc: 'Get agent info' },
                  { method: 'WS', path: '/api/v1/ws/workflows/{id}', desc: 'Real-time events' },
                ].map(({ method, path, desc }) => (
                  <div key={path} className="flex items-center gap-3 px-5 py-3">
                    <span
                      className={`text-xs font-mono font-bold px-2 py-0.5 rounded w-14 text-center shrink-0 ${
                        method === 'GET'
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : method === 'POST'
                          ? 'bg-sky-500/10 text-sky-400'
                          : method === 'WS'
                          ? 'bg-violet-500/10 text-violet-400'
                          : 'bg-zinc-800 text-zinc-400'
                      }`}
                    >
                      {method}
                    </span>
                    <span className="font-mono text-xs text-zinc-300 flex-1">{path}</span>
                    <span className="text-xs text-zinc-600">{desc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Code example */}
            <div className="code-block p-5 overflow-x-auto">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-zinc-800">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-zinc-700" />
                  <div className="w-3 h-3 rounded-full bg-zinc-700" />
                  <div className="w-3 h-3 rounded-full bg-zinc-700" />
                </div>
                <span className="text-xs text-zinc-500 font-mono ml-2">Quick Start</span>
              </div>
              <pre className="text-xs text-zinc-300 leading-relaxed whitespace-pre-wrap">{API_EXAMPLE}</pre>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Start */}
      <section className="py-20 px-6 border-t border-zinc-800/60">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Quick Start</h2>
          <p className="text-zinc-400 mb-8">Up and running in under 2 minutes</p>

          <div className="code-block p-6 text-left mb-8">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-zinc-800">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-zinc-700" />
                <div className="w-3 h-3 rounded-full bg-zinc-700" />
                <div className="w-3 h-3 rounded-full bg-zinc-700" />
              </div>
              <span className="text-xs text-zinc-500 font-mono ml-2">Terminal</span>
            </div>
            <pre className="text-sm text-zinc-300 leading-loose">{`# Clone and configure
git clone https://github.com/your-username/langgraph-agent-platform
cd langgraph-agent-platform/backend
cp .env.example .env
# Add your AGENT_OPENAI_API_KEY to .env

# Install and run with Docker
docker-compose up -d

# Or run locally
pip install -e ".[dev]"
uvicorn app.main:app --reload

# Run tests
pytest tests/ -v

# API docs
open http://localhost:8000/docs`}</pre>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {['Python 3.11+', 'LangGraph 0.2+', 'FastAPI', 'Pydantic v2', 'OpenAI', 'Docker'].map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full text-sm bg-zinc-800 text-zinc-400 border border-zinc-700"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
