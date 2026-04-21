'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import WorkflowVisualizer from '@/components/WorkflowVisualizer'
import AgentCard from '@/components/AgentCard'
import StateTimeline from '@/components/StateTimeline'
import FeatureCard from '@/components/FeatureCard'
import Link from 'next/link'
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
  Play,
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

const API_EXAMPLE = `# Replace with your deployed API URL
# Create a research workflow
curl -X POST https://api.example.com/api/v1/workflows/ \\
  -H "Content-Type: application/json" \\
  -d '{
    "workflow_type": "research",
    "objective": "Analyze AI infrastructure market trends",
    "human_in_the_loop": true,
    "max_iterations": 10
  }'

# Submit human feedback when workflow pauses
curl -X POST https://api.example.com/api/v1/workflows/{id}/feedback \\
  -d '{"feedback": "Focus on GPU cloud providers", "approved": false}'

# Subscribe to real-time events via WebSocket
wss://api.example.com/api/v1/ws/workflows/{id}`

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', background: '#0C0A1D' }}>
      <Header />

      {/* ═══ HERO ═══ */}
      <section className="relative pt-36 pb-24 px-6 overflow-hidden">
        {/* Background orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute top-1/3 left-1/4 w-[600px] h-[600px] rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(139, 92, 246, 0.12) 0%, transparent 65%)',
              transform: 'translate(-50%, -50%)',
            }}
          />
          <div
            className="absolute top-2/3 right-1/4 w-[400px] h-[400px] rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(192, 132, 252, 0.08) 0%, transparent 65%)',
              transform: 'translate(50%, -50%)',
            }}
          />
          {/* Grid */}
          <div
            className="absolute inset-0 grid-bg opacity-60"
          />
        </div>

        <div className="relative max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-8"
            style={{
              background: 'rgba(139, 92, 246, 0.1)',
              border: '1px solid rgba(139, 92, 246, 0.25)',
              color: '#C4B5FD',
              boxShadow: '0 0 20px rgba(139, 92, 246, 0.1)',
            }}
          >
            <Terminal className="w-3.5 h-3.5" style={{ color: '#A78BFA' }} />
            Senior Python + AI Engineer Portfolio Project
          </div>

          {/* Headline */}
          <h1
            className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight mb-6 leading-tight"
            style={{ color: '#E2E0FF' }}
          >
            LangGraph{' '}
            <span className="gradient-text">Agent Platform</span>
          </h1>

          <p
            className="text-xl max-w-3xl mx-auto leading-relaxed mb-12"
            style={{ color: 'rgba(196, 181, 253, 0.65)' }}
          >
            Production-grade multi-agent orchestration. Four specialized AI agents collaborate via LangGraph
            StateGraph with human-in-the-loop checkpoints, persistent state management, and real-time WebSocket streaming.
          </p>

          {/* CTA */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-20">
            <Link
              href="/demo"
              className="flex items-center gap-2.5 px-7 py-3.5 rounded-xl font-bold text-sm transition-all duration-200"
              style={{
                background: 'linear-gradient(135deg, #7C3AED, #8B5CF6)',
                color: 'white',
                border: '1px solid rgba(167, 139, 250, 0.3)',
                boxShadow: '0 0 30px rgba(139, 92, 246, 0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
              }}
            >
              <Play className="w-4 h-4" />
              Try Interactive Demo
            </Link>
            <a
              href="#architecture"
              className="flex items-center gap-2.5 px-7 py-3.5 rounded-xl font-bold text-sm transition-all duration-200"
              style={{
                background: 'rgba(30, 27, 75, 0.5)',
                color: '#C4B5FD',
                border: '1px solid rgba(139, 92, 246, 0.25)',
                boxShadow: '0 0 12px rgba(139, 92, 246, 0.08)',
              }}
            >
              Explore Architecture
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
            {[
              { label: 'AI Agents', value: '4', icon: Cpu, color: '#A78BFA' },
              { label: 'Graph Nodes', value: '5+', icon: GitBranch, color: '#C084FC' },
              { label: 'API Endpoints', value: '9', icon: Globe, color: '#818CF8' },
              { label: 'Test Coverage', value: '100%', icon: CheckCircle, color: '#E879F9' },
            ].map(({ label, value, icon: Icon, color }) => (
              <div
                key={label}
                className="relative rounded-2xl p-4 text-center overflow-hidden"
                style={{
                  background: 'rgba(20, 17, 46, 0.6)',
                  border: '1px solid rgba(139, 92, 246, 0.12)',
                  backdropFilter: 'blur(12px)',
                }}
              >
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{ background: `radial-gradient(ellipse at 50% 0%, ${color}08 0%, transparent 60%)` }}
                />
                <Icon className="w-5 h-5 mx-auto mb-2" style={{ color }} />
                <div className="text-2xl font-black" style={{ color: '#E2E0FF' }}>{value}</div>
                <div className="text-xs mt-0.5" style={{ color: 'rgba(167, 139, 250, 0.5)' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ ARCHITECTURE ═══ */}
      <section id="architecture" className="py-24 px-6 section-fade">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest mb-4"
              style={{
                background: 'rgba(139, 92, 246, 0.08)',
                color: '#8B5CF6',
                border: '1px solid rgba(139, 92, 246, 0.15)',
              }}
            >
              Architecture
            </div>
            <h2
              className="text-4xl font-black mb-4"
              style={{ color: '#E2E0FF' }}
            >
              Multi-Agent Workflow Graph
            </h2>
            <p className="max-w-2xl mx-auto leading-relaxed" style={{ color: 'rgba(196, 181, 253, 0.6)' }}>
              Built with LangGraph&apos;s StateGraph API. Each node is an async Python function.
              Edges are conditional — routing decisions are made by examining the shared TypedDict state.
            </p>
          </div>

          <div
            className="rounded-2xl p-6 sm:p-8"
            style={{
              background: 'rgba(15, 12, 36, 0.7)',
              border: '1px solid rgba(139, 92, 246, 0.15)',
              backdropFilter: 'blur(16px)',
              boxShadow: '0 8px 40px rgba(0,0,0,0.4), 0 0 30px rgba(139, 92, 246, 0.05)',
            }}
          >
            <WorkflowVisualizer />
          </div>
        </div>
      </section>

      {/* ═══ FEATURES ═══ */}
      <section className="py-24 px-6 section-fade">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest mb-4"
              style={{
                background: 'rgba(192, 132, 252, 0.08)',
                color: '#C084FC',
                border: '1px solid rgba(192, 132, 252, 0.15)',
              }}
            >
              Capabilities
            </div>
            <h2 className="text-4xl font-black mb-4" style={{ color: '#E2E0FF' }}>
              Platform Capabilities
            </h2>
            <p style={{ color: 'rgba(196, 181, 253, 0.6)' }}>
              Production patterns for real-world AI agent systems
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <FeatureCard
              icon={GitBranch}
              title="LangGraph Orchestration"
              description="StateGraph with conditional edges, cycle detection, and compile-time validation. Supports branching, merging, and cyclic workflows."
              badge="Core"
              color="violet"
            />
            <FeatureCard
              icon={Users}
              title="Human-in-the-Loop"
              description="interrupt_before checkpoints halt execution awaiting human input. State is serialized and restored seamlessly after feedback."
              badge="HIL"
              color="purple"
            />
            <FeatureCard
              icon={Database}
              title="State Persistence"
              description="MemorySaver checkpointer stores each state transition. Thread-scoped state enables parallel workflow isolation."
              badge="Stateful"
              color="indigo"
            />
            <FeatureCard
              icon={Activity}
              title="Real-time Streaming"
              description="WebSocket endpoint streams workflow events as they occur. Clients receive agent transitions, tool calls, and completion events."
              color="purple"
            />
            <FeatureCard
              icon={Shield}
              title="Pydantic v2 Validation"
              description="All API inputs and outputs validated with Pydantic v2 schemas. Field validators, ConfigDict, and model_config throughout."
              color="fuchsia"
            />
            <FeatureCard
              icon={Zap}
              title="Async Python"
              description="Fully async FastAPI backend with AsyncOpenAI client. Concurrent workflow execution with asyncio.to_thread for graph isolation."
              color="violet"
            />
            <FeatureCard
              icon={Code2}
              title="Safe Code Execution"
              description="Sandboxed Python executor with 10s timeout and process isolation. Safe arithmetic evaluator using Python AST."
              color="indigo"
            />
            <FeatureCard
              icon={Layers}
              title="Modular Architecture"
              description="Clean separation: agents/, api/, services/, models/. Each layer has single responsibility with no cross-cutting concerns."
              color="purple"
            />
            <FeatureCard
              icon={RefreshCw}
              title="Revision Loops"
              description="Reviewer agent gates output quality. Drafts below 0.8 threshold are sent back to the writer with structured improvement feedback."
              color="fuchsia"
            />
          </div>
        </div>
      </section>

      {/* ═══ AGENTS ═══ */}
      <section id="agents" className="py-24 px-6 section-fade">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest mb-4"
              style={{
                background: 'rgba(129, 140, 248, 0.08)',
                color: '#818CF8',
                border: '1px solid rgba(129, 140, 248, 0.15)',
              }}
            >
              Agents
            </div>
            <h2 className="text-4xl font-black mb-4" style={{ color: '#E2E0FF' }}>
              Specialized Agents
            </h2>
            <p className="max-w-2xl mx-auto leading-relaxed" style={{ color: 'rgba(196, 181, 253, 0.6)' }}>
              Each agent is an async Python function with its own system prompt, tool access, and output contract.
              Agents communicate exclusively through shared TypedDict state.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {AGENT_DATA.map((agent) => (
              <AgentCard key={agent.role} {...agent} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══ STATE TIMELINE ═══ */}
      <section id="workflow" className="py-24 px-6 section-fade">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">
            <div>
              <div
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest mb-5"
                style={{
                  background: 'rgba(139, 92, 246, 0.08)',
                  color: '#8B5CF6',
                  border: '1px solid rgba(139, 92, 246, 0.15)',
                }}
              >
                State Machine
              </div>
              <h2 className="text-4xl font-black mb-5" style={{ color: '#E2E0FF' }}>
                Immutable State Transitions
              </h2>
              <p className="leading-relaxed mb-7" style={{ color: 'rgba(196, 181, 253, 0.6)' }}>
                LangGraph&apos;s TypedDict state is passed through each node. Nodes return partial state updates — only modified keys.
                The <code className="font-mono text-sm" style={{ color: '#C084FC' }}>Annotated[list, add]</code> pattern enables append-only message history without full replacement.
              </p>

              <div className="space-y-3 mb-7">
                {[
                  'Each node receives full state snapshot',
                  'Returns only keys it modified',
                  'Reducer functions merge partial updates',
                  'Checkpointer persists every transition',
                  'Thread ID scopes state to one workflow',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3 text-sm" style={{ color: 'rgba(196, 181, 253, 0.65)' }}>
                    <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: '#8B5CF6' }} />
                    {item}
                  </div>
                ))}
              </div>

              <div className="code-block p-5">
                <p
                  className="text-xs font-mono mb-3"
                  style={{ color: 'rgba(139, 92, 246, 0.5)' }}
                >
                  # state.py — TypedDict with reducer
                </p>
                <pre
                  className="text-xs leading-relaxed overflow-x-auto"
                  style={{ color: 'rgba(196, 181, 253, 0.8)', fontFamily: 'JetBrains Mono, Fira Code, monospace' }}
                >{`class AgentState(TypedDict):
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

            <div
              className="rounded-2xl p-6"
              style={{
                background: 'rgba(15, 12, 36, 0.7)',
                border: '1px solid rgba(139, 92, 246, 0.15)',
                backdropFilter: 'blur(16px)',
              }}
            >
              <StateTimeline />
            </div>
          </div>
        </div>
      </section>

      {/* ═══ GRAPH CODE ═══ */}
      <section className="py-24 px-6 section-fade">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14">
            <div>
              <div
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest mb-5"
                style={{
                  background: 'rgba(232, 121, 249, 0.08)',
                  color: '#E879F9',
                  border: '1px solid rgba(232, 121, 249, 0.15)',
                }}
              >
                Graph Definition
              </div>
              <h2 className="text-4xl font-black mb-5" style={{ color: '#E2E0FF' }}>
                Declarative Workflow
              </h2>
              <p className="leading-relaxed mb-7" style={{ color: 'rgba(196, 181, 253, 0.6)' }}>
                The entire multi-agent workflow is defined declaratively. Conditional routing, human interrupt points,
                and cyclic revision loops expressed as pure Python functions operating on typed state.
              </p>
              <div className="space-y-3">
                {[
                  { label: 'Router', desc: 'should_continue() inspects state to decide next node' },
                  { label: 'Interrupt', desc: 'interrupt_before=["human_review"] halts execution' },
                  { label: 'Resume', desc: 'update_state() injects feedback and resumes' },
                  { label: 'Cycle', desc: 'Writer ↔ Reviewer loop until quality ≥ 0.8' },
                ].map(({ label, desc }) => (
                  <div key={label} className="flex items-start gap-3">
                    <span
                      className="text-xs font-mono font-bold px-2.5 py-1.5 rounded-lg shrink-0"
                      style={{
                        background: 'rgba(139, 92, 246, 0.12)',
                        color: '#A78BFA',
                        border: '1px solid rgba(139, 92, 246, 0.2)',
                      }}
                    >
                      {label}
                    </span>
                    <span className="text-sm mt-1" style={{ color: 'rgba(196, 181, 253, 0.65)' }}>
                      {desc}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="code-block p-6 overflow-x-auto">
              <div
                className="flex items-center gap-2 mb-5 pb-4"
                style={{ borderBottom: '1px solid rgba(139, 92, 246, 0.1)' }}
              >
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full" style={{ background: 'rgba(232, 121, 249, 0.5)' }} />
                  <div className="w-3 h-3 rounded-full" style={{ background: 'rgba(192, 132, 252, 0.5)' }} />
                  <div className="w-3 h-3 rounded-full" style={{ background: 'rgba(139, 92, 246, 0.5)' }} />
                </div>
                <span className="text-xs font-mono ml-2" style={{ color: 'rgba(167, 139, 250, 0.4)' }}>
                  agents/graph.py
                </span>
              </div>
              <pre
                className="text-xs leading-relaxed whitespace-pre-wrap"
                style={{ color: 'rgba(196, 181, 253, 0.8)', fontFamily: 'JetBrains Mono, Fira Code, monospace' }}
              >
                {CODE_EXAMPLE}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ API ═══ */}
      <section id="api" className="py-24 px-6 section-fade">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest mb-4"
              style={{
                background: 'rgba(139, 92, 246, 0.08)',
                color: '#8B5CF6',
                border: '1px solid rgba(139, 92, 246, 0.15)',
              }}
            >
              REST API
            </div>
            <h2 className="text-4xl font-black mb-4" style={{ color: '#E2E0FF' }}>
              REST API
            </h2>
            <p style={{ color: 'rgba(196, 181, 253, 0.6)' }}>
              FastAPI with automatic OpenAPI documentation
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Endpoints */}
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                background: 'rgba(15, 12, 36, 0.7)',
                border: '1px solid rgba(139, 92, 246, 0.15)',
                backdropFilter: 'blur(16px)',
              }}
            >
              <div
                className="px-5 py-4"
                style={{ borderBottom: '1px solid rgba(139, 92, 246, 0.1)' }}
              >
                <h3 className="font-bold text-sm" style={{ color: '#E2E0FF' }}>
                  Endpoints
                </h3>
              </div>
              <div>
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
                ].map(({ method, path, desc }, i) => {
                  const methodColors: Record<string, { bg: string; color: string }> = {
                    GET: { bg: 'rgba(167, 139, 250, 0.1)', color: '#A78BFA' },
                    POST: { bg: 'rgba(192, 132, 252, 0.1)', color: '#C084FC' },
                    WS: { bg: 'rgba(232, 121, 249, 0.1)', color: '#E879F9' },
                  }
                  const mc = methodColors[method] || { bg: 'rgba(139, 92, 246, 0.08)', color: '#8B5CF6' }
                  return (
                    <div
                      key={path}
                      className="flex items-center gap-3 px-5 py-3 transition-colors"
                      style={{
                        borderBottom: i < 8 ? '1px solid rgba(139, 92, 246, 0.06)' : 'none',
                      }}
                    >
                      <span
                        className="text-xs font-mono font-bold px-2 py-0.5 rounded w-12 text-center shrink-0"
                        style={{ background: mc.bg, color: mc.color }}
                      >
                        {method}
                      </span>
                      <span
                        className="font-mono text-xs flex-1"
                        style={{ color: 'rgba(196, 181, 253, 0.75)' }}
                      >
                        {path}
                      </span>
                      <span className="text-xs" style={{ color: 'rgba(139, 92, 246, 0.4)' }}>
                        {desc}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Code example */}
            <div className="code-block p-6 overflow-x-auto">
              <div
                className="flex items-center gap-2 mb-5 pb-4"
                style={{ borderBottom: '1px solid rgba(139, 92, 246, 0.1)' }}
              >
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full" style={{ background: 'rgba(232, 121, 249, 0.5)' }} />
                  <div className="w-3 h-3 rounded-full" style={{ background: 'rgba(192, 132, 252, 0.5)' }} />
                  <div className="w-3 h-3 rounded-full" style={{ background: 'rgba(139, 92, 246, 0.5)' }} />
                </div>
                <span className="text-xs font-mono ml-2" style={{ color: 'rgba(167, 139, 250, 0.4)' }}>
                  Quick Start
                </span>
              </div>
              <pre
                className="text-xs leading-relaxed whitespace-pre-wrap"
                style={{ color: 'rgba(196, 181, 253, 0.8)', fontFamily: 'JetBrains Mono, Fira Code, monospace' }}
              >
                {API_EXAMPLE}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ QUICK START ═══ */}
      <section className="py-24 px-6 section-fade">
        <div className="max-w-4xl mx-auto text-center">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest mb-5"
            style={{
              background: 'rgba(139, 92, 246, 0.08)',
              color: '#8B5CF6',
              border: '1px solid rgba(139, 92, 246, 0.15)',
            }}
          >
            Quick Start
          </div>
          <h2 className="text-4xl font-black mb-4" style={{ color: '#E2E0FF' }}>
            Up and Running in 2 Minutes
          </h2>
          <p className="mb-10" style={{ color: 'rgba(196, 181, 253, 0.6)' }}>
            Clone, configure, and run with Docker or locally
          </p>

          <div className="code-block p-6 text-left mb-10">
            <div
              className="flex items-center gap-2 mb-5 pb-4"
              style={{ borderBottom: '1px solid rgba(139, 92, 246, 0.1)' }}
            >
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full" style={{ background: 'rgba(232, 121, 249, 0.5)' }} />
                <div className="w-3 h-3 rounded-full" style={{ background: 'rgba(192, 132, 252, 0.5)' }} />
                <div className="w-3 h-3 rounded-full" style={{ background: 'rgba(139, 92, 246, 0.5)' }} />
              </div>
              <span className="text-xs font-mono ml-2" style={{ color: 'rgba(167, 139, 250, 0.4)' }}>
                Terminal
              </span>
            </div>
            <pre
              className="text-sm leading-loose"
              style={{ color: 'rgba(196, 181, 253, 0.8)', fontFamily: 'JetBrains Mono, Fira Code, monospace' }}
            >{`# Clone and configure
git clone https://github.com/MusaevAkobirSanokulUgli/langgraph-agent-platform
cd langgraph-agent-platform/backend
cp .env.example .env
# Add your AGENT_OPENAI_API_KEY to .env

# Install and run with Docker
docker-compose up -d

# Or run locally
pip install -e ".[dev]"
uvicorn app.main:app --reload

# Run tests
pytest tests/ -v`}</pre>
          </div>

          {/* Tech stack badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
            {['Python 3.11+', 'LangGraph 0.2+', 'FastAPI', 'Pydantic v2', 'OpenAI', 'Docker'].map((tag) => (
              <span
                key={tag}
                className="px-3 py-1.5 rounded-full text-sm font-medium"
                style={{
                  background: 'rgba(20, 17, 46, 0.7)',
                  color: '#A78BFA',
                  border: '1px solid rgba(139, 92, 246, 0.2)',
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Demo CTA */}
          <div
            className="relative rounded-2xl p-10 overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.15), rgba(192, 132, 252, 0.08), rgba(124, 58, 237, 0.15))',
              border: '1px solid rgba(139, 92, 246, 0.25)',
              boxShadow: '0 0 40px rgba(139, 92, 246, 0.1)',
            }}
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse at 50% 0%, rgba(139, 92, 246, 0.12) 0%, transparent 60%)',
              }}
            />
            <h3
              className="text-2xl font-black mb-3 relative"
              style={{ color: '#E2E0FF' }}
            >
              See It In Action
            </h3>
            <p className="mb-7 relative" style={{ color: 'rgba(196, 181, 253, 0.65)' }}>
              Run a real multi-agent workflow with human-in-the-loop interrupts, live node animations, and agent tool calls.
            </p>
            <Link
              href="/demo"
              className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl font-bold text-sm relative transition-all duration-200"
              style={{
                background: 'linear-gradient(135deg, #7C3AED, #8B5CF6)',
                color: 'white',
                border: '1px solid rgba(167, 139, 250, 0.3)',
                boxShadow: '0 0 30px rgba(139, 92, 246, 0.5)',
              }}
            >
              <Play className="w-4 h-4" />
              Launch Interactive Demo
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
