'use client'

import { useState, useEffect, useRef } from 'react'
import Header from '@/components/Header'
import Link from 'next/link'
import {
  Search,
  BarChart2,
  PenTool,
  CheckCircle,
  User,
  Play,
  ArrowRight,
  ArrowLeft,
  ChevronDown,
  Terminal,
  Cpu,
  Zap,
  FileText,
  RotateCcw,
  MessageSquare,
  Code2,
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

type WorkflowType = 'research' | 'analysis' | 'content_creation' | 'code_review'
type StepStatus = 'idle' | 'running' | 'paused' | 'done'
type AgentRole = 'researcher' | 'analyzer' | 'writer' | 'reviewer' | 'human'

interface ToolCall {
  name: string
  args: string
  result: string
}

interface AgentStep {
  id: AgentRole
  label: string
  icon: React.ElementType
  accentColor: string
  glowColor: string
  bgColor: string
  runningMsg: string
  doneMsg: string
  toolCalls: ToolCall[]
  intermediateOutput: string
  duration: number
}

// ─── Workflow type configs ────────────────────────────────────────────────────

const WORKFLOW_META: Record<WorkflowType, {
  label: string
  description: string
  defaultObjective: string
}> = {
  research: {
    label: 'Research',
    description: 'Multi-agent research pipeline with web search and synthesis',
    defaultObjective: 'Research the latest AI trends and write a comprehensive report',
  },
  analysis: {
    label: 'Analysis',
    description: 'Deep analysis workflow with pattern recognition and insights',
    defaultObjective: 'Analyze the competitive landscape of GPU cloud providers',
  },
  content_creation: {
    label: 'Content Creation',
    description: 'AI-powered content generation with quality review loop',
    defaultObjective: 'Create a technical blog post about LangGraph multi-agent systems',
  },
  code_review: {
    label: 'Code Review',
    description: 'Automated code review with security and quality analysis',
    defaultObjective: 'Review Python async patterns and suggest improvements',
  },
}

// ─── Build dynamic steps based on objective + workflow type ──────────────────

function buildSteps(objective: string, workflowType: WorkflowType, enableHIL: boolean): AgentStep[] {
  const topic = objective.slice(0, 60) || 'the given objective'
  const isCode = workflowType === 'code_review'

  const steps: AgentStep[] = [
    {
      id: 'researcher',
      label: 'Research Agent',
      icon: Search,
      accentColor: '#A78BFA',
      glowColor: 'rgba(167, 139, 250, 0.35)',
      bgColor: 'rgba(167, 139, 250, 0.08)',
      runningMsg: `Gathering information about: "${topic}"`,
      doneMsg: 'Research complete. Found 8 high-confidence sources.',
      toolCalls: [
        {
          name: 'web_search',
          args: `query="${topic.split(' ').slice(0, 5).join(' ')}"`,
          result: 'Found 12 relevant results (top 3 selected)',
        },
        {
          name: 'web_search',
          args: `query="${topic.split(' ').slice(-4).join(' ')} 2024 trends"`,
          result: 'Found 9 results with high recency score',
        },
        {
          name: 'fetch_page',
          args: 'url="https://arxiv.org/recent"',
          result: '3 papers extracted, summarized to structured JSON',
        },
      ],
      intermediateOutput: `{
  "key_findings": [
    "Market grew 340% YoY driven by LLM inference demand",
    "NVIDIA H100 availability remains constrained through Q2 2025",
    "Hyperscalers increasing CapEx by avg. 42% for AI infrastructure"
  ],
  "confidence": 0.87,
  "sources_used": 8,
  "current_agent": "analyzer"
}`,
      duration: 3400,
    },
    {
      id: 'analyzer',
      label: 'Analysis Agent',
      icon: BarChart2,
      accentColor: '#C084FC',
      glowColor: 'rgba(192, 132, 252, 0.35)',
      bgColor: 'rgba(192, 132, 252, 0.08)',
      runningMsg: 'Analyzing findings and extracting actionable insights...',
      doneMsg: enableHIL ? 'Analysis complete. Confidence 0.72 — requesting human review.' : 'Analysis complete. Confidence 0.91. Proceeding to writer.',
      toolCalls: [
        {
          name: 'calculator',
          args: 'expression="340 * 0.42 + 12.5"',
          result: '155.3 — compounded growth projection',
        },
        {
          name: 'pattern_detector',
          args: `data=${JSON.stringify({ window: '24mo', threshold: 0.8 })}`,
          result: 'Identified 3 primary trends, 2 risk factors',
        },
      ],
      intermediateOutput: `{
  "insights": [
    "GPU inference is outpacing training as primary revenue driver",
    "Sovereign AI investment creating new demand centers",
    "Spot vs. reserved capacity arbitrage emerging as cost lever"
  ],
  "recommendations": [
    "Focus on inference-optimized instances",
    "Geographic diversification reduces supply risk"
  ],
  "confidence_score": ${enableHIL ? '0.72' : '0.91'},
  "needs_human_review": ${enableHIL},
  "current_agent": "${enableHIL ? 'human_review' : 'writer'}"
}`,
      duration: 2800,
    },
  ]

  if (enableHIL) {
    steps.push({
      id: 'human',
      label: 'Human Review',
      icon: User,
      accentColor: '#F9A8D4',
      glowColor: 'rgba(249, 168, 212, 0.35)',
      bgColor: 'rgba(249, 168, 212, 0.06)',
      runningMsg: 'Workflow paused — confidence score 0.72 is below threshold (0.8). Human guidance required.',
      doneMsg: 'Human feedback received. Resuming workflow with updated context.',
      toolCalls: [],
      intermediateOutput: '',
      duration: 0,
    })
  }

  steps.push({
    id: 'writer',
    label: isCode ? 'Code Review Agent' : 'Writer Agent',
    icon: isCode ? Code2 : PenTool,
    accentColor: '#818CF8',
    glowColor: 'rgba(129, 140, 248, 0.35)',
    bgColor: 'rgba(129, 140, 248, 0.08)',
    runningMsg: isCode ? 'Reviewing code patterns and generating recommendations...' : 'Drafting content incorporating research, analysis, and guidance...',
    doneMsg: 'First draft complete. Sending to reviewer for quality assessment.',
    toolCalls: isCode ? [
      {
        name: 'ast_analyzer',
        args: 'language="python", check="async_patterns"',
        result: 'Found 3 anti-patterns, 2 improvement opportunities',
      },
    ] : [],
    intermediateOutput: isCode
      ? `{
  "review_findings": [
    "Missing asyncio.gather() for parallel independent calls",
    "Blocking I/O in async context at line 42",
    "Race condition risk in shared state mutation"
  ],
  "quality_score": 0.73,
  "suggested_refactors": 3,
  "current_agent": "reviewer"
}`
      : `{
  "draft_preview": "# ${topic.slice(0, 40)}\\n\\nExecutive Summary: This analysis examines...",
  "word_count": 1847,
  "sections": ["Executive Summary", "Market Overview", "Key Findings", "Recommendations"],
  "current_agent": "reviewer"
}`,
    duration: 4200,
  })

  steps.push({
    id: 'reviewer',
    label: 'Reviewer Agent',
    icon: CheckCircle,
    accentColor: '#E879F9',
    glowColor: 'rgba(232, 121, 249, 0.35)',
    bgColor: 'rgba(232, 121, 249, 0.08)',
    runningMsg: 'Evaluating quality against original objective. Scoring draft...',
    doneMsg: 'Quality score 0.87 ≥ threshold (0.8). Workflow approved.',
    toolCalls: [
      {
        name: 'quality_scorer',
        args: `objective="${topic.slice(0, 30)}...", content_length=1847`,
        result: 'Score: 0.87 | Factual accuracy: 0.91 | Completeness: 0.83',
      },
    ],
    intermediateOutput: `{
  "approved": true,
  "quality_score": 0.87,
  "factual_accuracy": 0.91,
  "completeness": 0.83,
  "feedback": "Content meets quality threshold. No revision required.",
  "status": "completed"
}`,
    duration: 2600,
  })

  return steps
}

function buildFinalOutput(objective: string, workflowType: WorkflowType): string {
  const title = objective.slice(0, 70) || 'AI Market Analysis'
  const isCode = workflowType === 'code_review'

  if (isCode) {
    return `# Code Review Report

**Objective:** ${title}

## Summary

Quality Score: **0.87 / 1.00** ✓ Approved

## Findings

### Critical Issues (2)
- **Blocking I/O in async context** (line 42): Replace \`time.sleep()\` with \`await asyncio.sleep()\`
- **Missing concurrent execution**: Use \`asyncio.gather()\` for parallel API calls

### Improvements (3)
- Add type hints for all function signatures
- Use \`contextlib.asynccontextmanager\` for resource cleanup
- Consider \`anyio\` for backend-agnostic async code

## Recommended Refactor

\`\`\`python
# Before
async def fetch_all(urls):
    results = []
    for url in urls:
        results.append(await fetch(url))
    return results

# After — 3x faster with concurrency
async def fetch_all(urls):
    return await asyncio.gather(*[fetch(url) for url in urls])
\`\`\`

---
*Generated by LangGraph Agent Platform · Quality: 0.87*`
  }

  const type = WORKFLOW_META[workflowType].label
  return `# ${title}

**Workflow Type:** ${type} · **Quality Score:** 0.87/1.00 ✓ Approved

## Executive Summary

This ${type.toLowerCase()} examines the current landscape with a focus on key trends, competitive dynamics, and actionable recommendations for practitioners and decision-makers.

## Key Findings

1. **Market Growth** — Sector expanded 340% YoY, driven by sustained enterprise demand and hyperscaler capex increases averaging 42%.

2. **Technology Shift** — Inference workloads now surpass training as the primary revenue driver, reshaping the infrastructure landscape fundamentally.

3. **Geographic Expansion** — Sovereign AI investment creating new regional demand centers, reducing concentration risk for global deployments.

4. **Supply Constraints** — Premium GPU availability remains constrained through Q2 2025, creating arbitrage opportunities in spot markets.

## Strategic Recommendations

- **Near-term:** Prioritize inference-optimized compute allocation over general-purpose GPU reservations
- **Mid-term:** Geographic diversification across at least 3 regions mitigates single-provider supply risk
- **Long-term:** Position for infrastructure-as-a-service models as commodity pricing pressure increases

## Methodology

Research gathered from 8 high-confidence sources (confidence: 0.87). Analysis used pattern recognition across 24-month data window. Content reviewed and scored by quality agent (threshold: 0.80).

---
*Generated by LangGraph Agent Platform · 4 agents · ${new Date().toLocaleDateString()}*`
}

// ─── Typing animation hook ────────────────────────────────────────────────────

function useTypingEffect(text: string, speed = 18, active = false): string {
  const [displayed, setDisplayed] = useState('')
  const indexRef = useRef(0)

  useEffect(() => {
    if (!active) { setDisplayed(''); indexRef.current = 0; return }
    setDisplayed('')
    indexRef.current = 0
    const interval = setInterval(() => {
      if (indexRef.current < text.length) {
        setDisplayed(text.slice(0, indexRef.current + 1))
        indexRef.current++
      } else {
        clearInterval(interval)
      }
    }, speed)
    return () => clearInterval(interval)
  }, [text, speed, active])

  return displayed
}

// ─── Tool call display ────────────────────────────────────────────────────────

function ToolCallRow({ call, delay }: { call: ToolCall; delay: number }) {
  const [visible, setVisible] = useState(false)
  const [done, setDone] = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), delay)
    const t2 = setTimeout(() => setDone(true), delay + 600)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [delay])

  if (!visible) return null

  return (
    <div
      className="rounded-xl p-3 mb-2 animate-slide-up"
      style={{
        background: 'rgba(9, 7, 20, 0.7)',
        border: '1px solid rgba(139, 92, 246, 0.12)',
        fontFamily: 'JetBrains Mono, Fira Code, monospace',
      }}
    >
      <div className="flex items-center gap-2 mb-1.5">
        <Code2 className="w-3 h-3" style={{ color: '#8B5CF6' }} />
        <span className="text-xs font-semibold" style={{ color: '#A78BFA' }}>
          {call.name}
        </span>
        <span className="text-xs" style={{ color: 'rgba(139, 92, 246, 0.4)' }}>
          ({call.args})
        </span>
      </div>
      {done && (
        <div className="flex items-start gap-2">
          <span className="text-xs" style={{ color: 'rgba(139, 92, 246, 0.4)' }}>→</span>
          <span className="text-xs" style={{ color: 'rgba(196, 181, 253, 0.65)' }}>
            {call.result}
          </span>
        </div>
      )}
    </div>
  )
}

// ─── Agent step card ──────────────────────────────────────────────────────────

interface AgentStepCardProps {
  step: AgentStep
  status: StepStatus
  humanFeedback?: string
  isHILStep: boolean
  onFeedbackChange?: (v: string) => void
  onFeedbackSubmit?: () => void
}

function AgentStepCard({
  step,
  status,
  humanFeedback = '',
  isHILStep,
  onFeedbackChange,
  onFeedbackSubmit,
}: AgentStepCardProps) {
  const Icon = step.icon
  const isRunning = status === 'running'
  const isPaused = status === 'paused'
  const isDone = status === 'done'
  const runMsg = useTypingEffect(step.runningMsg, 20, isRunning || isPaused)
  const [showOutput, setShowOutput] = useState(false)

  useEffect(() => {
    if (isDone && step.intermediateOutput) {
      const t = setTimeout(() => setShowOutput(true), 300)
      return () => clearTimeout(t)
    }
  }, [isDone, step.intermediateOutput])

  return (
    <div
      className="rounded-2xl overflow-hidden transition-all duration-500"
      style={{
        background: isPaused
          ? 'rgba(249, 168, 212, 0.04)'
          : isRunning
          ? `${step.bgColor}`
          : isDone
          ? 'rgba(15, 12, 36, 0.7)'
          : 'rgba(9, 7, 20, 0.5)',
        border: `1px solid ${isPaused
          ? 'rgba(249, 168, 212, 0.3)'
          : isRunning
          ? `${step.accentColor}40`
          : isDone
          ? `${step.accentColor}20`
          : 'rgba(139, 92, 246, 0.08)'}`,
        boxShadow: isRunning
          ? `0 0 24px ${step.glowColor}, 0 4px 16px rgba(0,0,0,0.3)`
          : isPaused
          ? '0 0 20px rgba(249, 168, 212, 0.15), 0 4px 16px rgba(0,0,0,0.3)'
          : '0 2px 8px rgba(0,0,0,0.3)',
      }}
    >
      {/* Header */}
      <div className="flex items-start gap-4 p-5">
        {/* Icon */}
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 relative"
          style={{
            background: `${step.bgColor}`,
            border: `1px solid ${step.accentColor}30`,
            boxShadow: (isRunning || isPaused) ? `0 0 16px ${step.glowColor}` : 'none',
          }}
        >
          {isRunning ? (
            <div
              className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin"
              style={{ borderColor: `${step.accentColor}40`, borderTopColor: step.accentColor }}
            />
          ) : (
            <Icon className="w-5 h-5" style={{ color: step.accentColor }} />
          )}
          {isRunning && (
            <div
              className="absolute inset-0 rounded-xl animate-pulse"
              style={{ background: `${step.accentColor}08` }}
            />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5 mb-2 flex-wrap">
            <span className="font-bold text-sm" style={{ color: '#E2E0FF' }}>
              {step.label}
            </span>

            {isPaused && (
              <span
                className="text-xs px-2.5 py-0.5 rounded-full font-semibold animate-pulse"
                style={{
                  background: 'rgba(249, 168, 212, 0.12)',
                  color: '#F9A8D4',
                  border: '1px solid rgba(249, 168, 212, 0.3)',
                }}
              >
                Paused — Human Input Required
              </span>
            )}
            {isDone && (
              <span
                className="text-xs px-2.5 py-0.5 rounded-full font-semibold"
                style={{
                  background: `${step.bgColor}`,
                  color: step.accentColor,
                  border: `1px solid ${step.accentColor}30`,
                }}
              >
                Complete
              </span>
            )}
            {isRunning && (
              <span
                className="text-xs px-2.5 py-0.5 rounded-full font-semibold"
                style={{
                  background: `${step.bgColor}`,
                  color: step.accentColor,
                  border: `1px solid ${step.accentColor}30`,
                }}
              >
                Active
              </span>
            )}
          </div>

          {/* Message with typing effect */}
          <p
            className="text-sm leading-relaxed typing-cursor"
            style={{ color: 'rgba(196, 181, 253, 0.7)' }}
          >
            {isRunning || isPaused ? runMsg : isDone ? step.doneMsg : ''}
          </p>

          {/* Tool calls */}
          {isRunning && step.toolCalls.length > 0 && (
            <div className="mt-3">
              <p
                className="text-xs font-semibold uppercase tracking-widest mb-2 flex items-center gap-1.5"
                style={{ color: 'rgba(139, 92, 246, 0.5)' }}
              >
                <Terminal className="w-3 h-3" />
                Tool Calls
              </p>
              {step.toolCalls.map((call, i) => (
                <ToolCallRow key={call.name} call={call} delay={i * 800 + 600} />
              ))}
            </div>
          )}

          {/* Intermediate output */}
          {isDone && showOutput && step.intermediateOutput && (
            <div
              className="mt-3 p-3.5 rounded-xl font-mono text-xs overflow-x-auto animate-fade-in"
              style={{
                background: 'rgba(9, 7, 20, 0.8)',
                border: `1px solid ${step.accentColor}15`,
                color: 'rgba(196, 181, 253, 0.7)',
              }}
            >
              <div
                className="text-xs font-semibold mb-1.5 font-sans"
                style={{ color: 'rgba(139, 92, 246, 0.5)' }}
              >
                State Update →
              </div>
              <pre className="whitespace-pre-wrap break-all leading-relaxed text-xs">
                {step.intermediateOutput}
              </pre>
            </div>
          )}
        </div>

        {/* Agent icon/number */}
        <div
          className="text-right shrink-0"
          style={{ color: `${step.accentColor}20` }}
        >
          <Cpu className="w-5 h-5" />
        </div>
      </div>

      {/* HIL Input Form */}
      {isHILStep && isPaused && (
        <div
          className="px-5 pb-5 pt-2"
          style={{ borderTop: '1px solid rgba(249, 168, 212, 0.1)' }}
        >
          <p className="text-xs mb-3 mt-2" style={{ color: 'rgba(249, 168, 212, 0.65)' }}>
            The analyzer&apos;s confidence score (0.72) is below the 0.80 threshold.
            Provide guidance to refine the analysis direction:
          </p>

          {/* Quick suggestions */}
          <div className="flex flex-wrap gap-2 mb-3">
            {[
              'Focus on inference infrastructure specifically',
              'Add cost analysis and ROI metrics',
              'Include competitor landscape and market share',
              'Deep dive on GPU supply chain constraints',
            ].map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => onFeedbackChange?.(suggestion)}
                className="text-xs px-2.5 py-1.5 rounded-lg transition-all duration-150"
                style={{
                  background: humanFeedback === suggestion
                    ? 'rgba(249, 168, 212, 0.15)'
                    : 'rgba(20, 17, 46, 0.6)',
                  color: humanFeedback === suggestion ? '#F9A8D4' : 'rgba(196, 181, 253, 0.6)',
                  border: `1px solid ${humanFeedback === suggestion ? 'rgba(249, 168, 212, 0.35)' : 'rgba(139, 92, 246, 0.12)'}`,
                }}
              >
                {suggestion}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={humanFeedback}
              onChange={(e) => onFeedbackChange?.(e.target.value)}
              placeholder="Or type your own guidance..."
              className="flex-1 px-3.5 py-2.5 rounded-xl text-sm outline-none transition-all duration-200"
              style={{
                background: 'rgba(9, 7, 20, 0.7)',
                border: '1px solid rgba(249, 168, 212, 0.2)',
                color: '#E2E0FF',
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(249, 168, 212, 0.4)' }}
              onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(249, 168, 212, 0.2)' }}
              onKeyDown={(e) => e.key === 'Enter' && humanFeedback.trim() && onFeedbackSubmit?.()}
            />
            <button
              onClick={onFeedbackSubmit}
              disabled={!humanFeedback.trim()}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                background: humanFeedback.trim()
                  ? 'linear-gradient(135deg, rgba(249, 168, 212, 0.3), rgba(249, 168, 212, 0.2))'
                  : 'rgba(20, 17, 46, 0.5)',
                color: '#F9A8D4',
                border: '1px solid rgba(249, 168, 212, 0.3)',
              }}
            >
              Submit
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Final Output ─────────────────────────────────────────────────────────────

function FinalOutputCard({ content }: { content: string }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 200)
    return () => clearTimeout(t)
  }, [])

  if (!visible) return null

  return (
    <div
      className="rounded-2xl overflow-hidden animate-slide-up"
      style={{
        background: 'rgba(15, 12, 36, 0.8)',
        border: '1px solid rgba(139, 92, 246, 0.3)',
        boxShadow: '0 0 40px rgba(139, 92, 246, 0.15), 0 8px 32px rgba(0,0,0,0.4)',
      }}
    >
      {/* Header bar */}
      <div
        className="px-6 py-4 flex items-center justify-between"
        style={{ borderBottom: '1px solid rgba(139, 92, 246, 0.12)' }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #7C3AED, #A78BFA)',
              boxShadow: '0 0 16px rgba(139, 92, 246, 0.5)',
            }}
          >
            <FileText className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-sm" style={{ color: '#E2E0FF' }}>
              Final Output
            </h3>
            <p className="text-xs" style={{ color: 'rgba(139, 92, 246, 0.5)' }}>
              Quality score: 0.87 · Approved
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4" style={{ color: '#A78BFA' }} />
          <span
            className="text-xs font-semibold px-2.5 py-1 rounded-full"
            style={{
              background: 'rgba(139, 92, 246, 0.12)',
              color: '#A78BFA',
              border: '1px solid rgba(139, 92, 246, 0.25)',
            }}
          >
            Workflow Complete
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div
          className="prose prose-sm max-w-none rounded-xl p-5"
          style={{
            background: 'rgba(9, 7, 20, 0.5)',
            border: '1px solid rgba(139, 92, 246, 0.08)',
          }}
        >
          <pre
            className="whitespace-pre-wrap text-sm leading-relaxed font-sans"
            style={{ color: 'rgba(196, 181, 253, 0.85)', margin: 0 }}
          >
            {content}
          </pre>
        </div>
      </div>
    </div>
  )
}

// ─── Mini workflow graph ──────────────────────────────────────────────────────

function MiniGraph({ steps, stepStatuses }: { steps: AgentStep[]; stepStatuses: StepStatus[] }) {
  const mainSteps = steps.filter((s) => s.id !== 'human')

  return (
    <div
      className="rounded-2xl p-4 mb-6"
      style={{
        background: 'rgba(9, 7, 20, 0.6)',
        border: '1px solid rgba(139, 92, 246, 0.12)',
      }}
    >
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {mainSteps.map((step, i) => {
          const realIdx = steps.indexOf(step)
          const status = stepStatuses[realIdx]
          const isActive = status === 'running'
          const isDone = status === 'done'
          const Icon = step.icon

          return (
            <div key={step.id} className="flex items-center gap-2 shrink-0">
              <div
                className="flex flex-col items-center gap-1.5 cursor-default"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500"
                  style={{
                    background: isActive
                      ? step.bgColor
                      : isDone
                      ? `${step.accentColor}12`
                      : 'rgba(20, 17, 46, 0.5)',
                    border: `1px solid ${isActive ? step.accentColor : isDone ? `${step.accentColor}40` : 'rgba(139, 92, 246, 0.1)'}`,
                    boxShadow: isActive ? `0 0 12px ${step.glowColor}` : 'none',
                  }}
                >
                  {isActive ? (
                    <div
                      className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin"
                      style={{ borderColor: `${step.accentColor}40`, borderTopColor: step.accentColor }}
                    />
                  ) : (
                    <Icon
                      className="w-4 h-4 transition-colors duration-300"
                      style={{ color: isActive || isDone ? step.accentColor : 'rgba(139, 92, 246, 0.25)' }}
                    />
                  )}
                </div>
                <span
                  className="text-xs font-medium whitespace-nowrap"
                  style={{
                    color: isActive
                      ? step.accentColor
                      : isDone
                      ? 'rgba(196, 181, 253, 0.6)'
                      : 'rgba(139, 92, 246, 0.25)',
                  }}
                >
                  {step.label.split(' ')[0]}
                </span>
              </div>

              {i < mainSteps.length - 1 && (
                <div
                  className="w-8 h-px shrink-0 mb-4 transition-all duration-500"
                  style={{
                    background: isDone
                      ? `linear-gradient(90deg, ${step.accentColor}60, ${mainSteps[i + 1].accentColor}60)`
                      : 'rgba(139, 92, 246, 0.12)',
                  }}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Main Demo Page ───────────────────────────────────────────────────────────

export default function DemoPage() {
  // Form state
  const [objective, setObjective] = useState('Research the latest AI trends and write a comprehensive report')
  const [workflowType, setWorkflowType] = useState<WorkflowType>('research')
  const [enableHIL, setEnableHIL] = useState(true)
  const [showDropdown, setShowDropdown] = useState(false)

  // Workflow state
  const [steps, setSteps] = useState<AgentStep[]>([])
  const [currentStep, setCurrentStep] = useState(-1)
  const [stepStatuses, setStepStatuses] = useState<StepStatus[]>([])
  const [humanFeedback, setHumanFeedback] = useState('')
  const [waitingHuman, setWaitingHuman] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [finalOutput, setFinalOutput] = useState('')
  const [started, setStarted] = useState(false)

  const hilStepIndex = steps.findIndex((s) => s.id === 'human')
  const runStepRef = useRef<(idx: number, builtSteps: AgentStep[]) => void>()

  const resetAll = () => {
    setCurrentStep(-1)
    setStepStatuses([])
    setHumanFeedback('')
    setWaitingHuman(false)
    setIsRunning(false)
    setCompleted(false)
    setFinalOutput('')
    setStarted(false)
    setSteps([])
  }

  const runStep = (stepIndex: number, builtSteps: AgentStep[]) => {
    const step = builtSteps[stepIndex]
    if (!step) return

    setCurrentStep(stepIndex)
    setStepStatuses((prev) => {
      const next = [...prev]
      next[stepIndex] = 'running'
      return next
    })

    // HIL pause
    if (step.id === 'human') {
      setTimeout(() => {
        setWaitingHuman(true)
        setStepStatuses((prev) => {
          const next = [...prev]
          next[stepIndex] = 'paused'
          return next
        })
      }, 900)
      return
    }

    // Normal step
    setTimeout(() => {
      setStepStatuses((prev) => {
        const next = [...prev]
        next[stepIndex] = 'done'
        return next
      })

      if (stepIndex < builtSteps.length - 1) {
        setTimeout(() => runStep(stepIndex + 1, builtSteps), 500)
      } else {
        setFinalOutput(buildFinalOutput(objective, workflowType))
        setCompleted(true)
        setIsRunning(false)
      }
    }, step.duration)
  }

  runStepRef.current = runStep

  const startWorkflow = () => {
    if (isRunning) return
    const builtSteps = buildSteps(objective, workflowType, enableHIL)
    setSteps(builtSteps)
    setStepStatuses(builtSteps.map(() => 'idle' as StepStatus))
    setCurrentStep(-1)
    setHumanFeedback('')
    setWaitingHuman(false)
    setCompleted(false)
    setFinalOutput('')
    setIsRunning(true)
    setStarted(true)

    setTimeout(() => runStep(0, builtSteps), 400)
  }

  const submitFeedback = () => {
    if (!humanFeedback.trim()) return
    setWaitingHuman(false)
    setStepStatuses((prev) => {
      const next = [...prev]
      next[hilStepIndex] = 'done'
      return next
    })
    setTimeout(() => runStep(hilStepIndex + 1, steps), 500)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0C0A1D' }}>
      <Header />

      <div className="pt-24 px-4">
        <div className="max-w-6xl mx-auto">
          <a href="/live" className="block p-4 rounded-2xl transition-all hover:scale-[1.01]"
            style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.12), rgba(139,92,246,0.06))",
              border: "1px solid rgba(99,102,241,0.3)" }}>
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <div className="text-sm font-bold uppercase tracking-wider mb-1" style={{ color: "#A5B4FC" }}>
                  🔥 Live DeepSeek-Powered Multi-Agent Workflow
                </div>
                <div className="text-xs" style={{ color: "#94A3B8" }}>
                  Enter a topic, pick a workflow, watch 3-4 real AI agents collaborate in real-time.
                </div>
              </div>
              <span className="text-xs font-bold px-4 py-2 rounded-xl" style={{ background: "#6366F1", color: "#F1F5F9" }}>
                Try it →
              </span>
            </div>
          </a>
        </div>
      </div>

      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-1/3 left-1/3 w-[500px] h-[500px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(139, 92, 246, 0.07) 0%, transparent 65%)' }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(192, 132, 252, 0.05) 0%, transparent 65%)' }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'linear-gradient(rgba(139, 92, 246, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(139, 92, 246, 0.03) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      <div className="relative pt-28 pb-20 px-6">
        <div className="max-w-4xl mx-auto">

          {/* Page header */}
          <div className="text-center mb-10">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm mb-6 transition-colors"
              style={{ color: 'rgba(167, 139, 250, 0.6)' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#A78BFA' }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(167, 139, 250, 0.6)' }}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Platform
            </Link>

            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-5"
              style={{
                background: 'rgba(139, 92, 246, 0.1)',
                color: '#A78BFA',
                border: '1px solid rgba(139, 92, 246, 0.2)',
              }}
            >
              <Zap className="w-3 h-3" />
              Interactive Demo
            </div>

            <h1
              className="text-4xl sm:text-5xl font-black tracking-tight mb-4"
              style={{ color: '#E2E0FF' }}
            >
              Live Workflow{' '}
              <span className="gradient-text">Simulation</span>
            </h1>
            <p
              className="text-base max-w-2xl mx-auto leading-relaxed"
              style={{ color: 'rgba(196, 181, 253, 0.6)' }}
            >
              Configure your workflow, hit Run, and watch four specialized AI agents collaborate
              in real-time with animated node activations, live tool calls, and optional human-in-the-loop control.
            </p>
          </div>

          {/* ─── CONFIG PANEL ─── */}
          <div
            className="rounded-2xl p-6 mb-6"
            style={{
              background: 'rgba(15, 12, 36, 0.8)',
              border: '1px solid rgba(139, 92, 246, 0.18)',
              backdropFilter: 'blur(16px)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            }}
          >
            <div className="flex items-center gap-2 mb-5">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background: 'rgba(139, 92, 246, 0.12)', border: '1px solid rgba(139, 92, 246, 0.2)' }}
              >
                <Terminal className="w-3.5 h-3.5" style={{ color: '#A78BFA' }} />
              </div>
              <span
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: 'rgba(167, 139, 250, 0.6)' }}
              >
                Workflow Configuration
              </span>
            </div>

            {/* Objective Input */}
            <div className="mb-4">
              <label
                className="text-xs font-semibold uppercase tracking-widest block mb-2"
                style={{ color: 'rgba(139, 92, 246, 0.5)' }}
              >
                Workflow Objective
              </label>
              <textarea
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                disabled={isRunning}
                rows={2}
                placeholder="Describe what you want the agents to accomplish..."
                className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none transition-all duration-200 disabled:opacity-60"
                style={{
                  background: 'rgba(9, 7, 20, 0.7)',
                  border: '1px solid rgba(139, 92, 246, 0.2)',
                  color: '#E2E0FF',
                  fontFamily: 'inherit',
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.45)' }}
                onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.2)' }}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
              {/* Workflow Type */}
              <div>
                <label
                  className="text-xs font-semibold uppercase tracking-widest block mb-2"
                  style={{ color: 'rgba(139, 92, 246, 0.5)' }}
                >
                  Workflow Type
                </label>
                <div className="relative">
                  <button
                    onClick={() => !isRunning && setShowDropdown(!showDropdown)}
                    disabled={isRunning}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 disabled:opacity-60"
                    style={{
                      background: 'rgba(9, 7, 20, 0.7)',
                      border: '1px solid rgba(139, 92, 246, 0.2)',
                      color: '#E2E0FF',
                    }}
                  >
                    <span className="flex items-center gap-2">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ background: '#A78BFA' }}
                      />
                      {WORKFLOW_META[workflowType].label}
                    </span>
                    <ChevronDown
                      className="w-4 h-4 transition-transform"
                      style={{
                        color: '#A78BFA',
                        transform: showDropdown ? 'rotate(180deg)' : 'rotate(0deg)',
                      }}
                    />
                  </button>

                  {showDropdown && !isRunning && (
                    <div
                      className="absolute top-full left-0 right-0 mt-1 rounded-xl overflow-hidden z-20"
                      style={{
                        background: 'rgba(15, 12, 36, 0.95)',
                        border: '1px solid rgba(139, 92, 246, 0.25)',
                        backdropFilter: 'blur(16px)',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                      }}
                    >
                      {(Object.keys(WORKFLOW_META) as WorkflowType[]).map((type) => (
                        <button
                          key={type}
                          onClick={() => {
                            setWorkflowType(type)
                            setObjective(WORKFLOW_META[type].defaultObjective)
                            setShowDropdown(false)
                          }}
                          className="w-full text-left px-4 py-3 text-sm transition-colors"
                          style={{
                            color: type === workflowType ? '#A78BFA' : 'rgba(196, 181, 253, 0.7)',
                            background: type === workflowType ? 'rgba(139, 92, 246, 0.08)' : 'transparent',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(139, 92, 246, 0.06)'
                            e.currentTarget.style.color = '#C4B5FD'
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = type === workflowType ? 'rgba(139, 92, 246, 0.08)' : 'transparent'
                            e.currentTarget.style.color = type === workflowType ? '#A78BFA' : 'rgba(196, 181, 253, 0.7)'
                          }}
                        >
                          <div className="font-semibold">{WORKFLOW_META[type].label}</div>
                          <div className="text-xs mt-0.5" style={{ color: 'rgba(139, 92, 246, 0.5)' }}>
                            {WORKFLOW_META[type].description}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* HIL Toggle */}
              <div>
                <label
                  className="text-xs font-semibold uppercase tracking-widest block mb-2"
                  style={{ color: 'rgba(139, 92, 246, 0.5)' }}
                >
                  Human-in-the-Loop
                </label>
                <button
                  onClick={() => !isRunning && setEnableHIL(!enableHIL)}
                  disabled={isRunning}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 disabled:opacity-60"
                  style={{
                    background: enableHIL ? 'rgba(249, 168, 212, 0.06)' : 'rgba(9, 7, 20, 0.7)',
                    border: `1px solid ${enableHIL ? 'rgba(249, 168, 212, 0.25)' : 'rgba(139, 92, 246, 0.2)'}`,
                    color: enableHIL ? '#F9A8D4' : 'rgba(196, 181, 253, 0.7)',
                  }}
                >
                  <span className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    {enableHIL ? 'Enabled — will pause for input' : 'Disabled — fully autonomous'}
                  </span>
                  {/* Toggle pill */}
                  <div
                    className="relative w-10 h-5 rounded-full transition-all duration-300"
                    style={{ background: enableHIL ? 'rgba(249, 168, 212, 0.4)' : 'rgba(139, 92, 246, 0.15)' }}
                  >
                    <div
                      className="absolute top-0.5 w-4 h-4 rounded-full transition-all duration-300"
                      style={{
                        background: enableHIL ? '#F9A8D4' : 'rgba(167, 139, 250, 0.5)',
                        left: enableHIL ? '22px' : '2px',
                        boxShadow: enableHIL ? '0 0 8px rgba(249, 168, 212, 0.6)' : 'none',
                      }}
                    />
                  </div>
                </button>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={startWorkflow}
                disabled={isRunning || !objective.trim()}
                className="flex items-center gap-2.5 px-6 py-3 rounded-xl font-bold text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: 'linear-gradient(135deg, #7C3AED, #8B5CF6)',
                  color: 'white',
                  border: '1px solid rgba(167, 139, 250, 0.3)',
                  boxShadow: isRunning ? 'none' : '0 0 24px rgba(139, 92, 246, 0.4)',
                }}
              >
                {isRunning ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Running Workflow...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    {started ? 'Run Again' : 'Run Workflow'}
                  </>
                )}
              </button>

              {started && !isRunning && (
                <button
                  onClick={resetAll}
                  className="flex items-center gap-2 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200"
                  style={{
                    background: 'rgba(20, 17, 46, 0.6)',
                    color: 'rgba(167, 139, 250, 0.7)',
                    border: '1px solid rgba(139, 92, 246, 0.15)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#A78BFA'
                    e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.3)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'rgba(167, 139, 250, 0.7)'
                    e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.15)'
                  }}
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* ─── WORKFLOW STEPS ─── */}
          {started && steps.length > 0 && (
            <>
              {/* Mini graph */}
              <MiniGraph steps={steps} stepStatuses={stepStatuses} />

              {/* Step cards */}
              <div className="space-y-4 mb-6">
                {steps.map((step, i) => {
                  const isVisible = i <= currentStep
                  if (!isVisible) return null

                  const isHILStep = step.id === 'human'

                  return (
                    <div key={step.id} className="animate-slide-up">
                      <AgentStepCard
                        step={step}
                        status={stepStatuses[i] ?? 'idle'}
                        humanFeedback={isHILStep ? humanFeedback : undefined}
                        isHILStep={isHILStep}
                        onFeedbackChange={isHILStep ? setHumanFeedback : undefined}
                        onFeedbackSubmit={isHILStep ? submitFeedback : undefined}
                      />
                    </div>
                  )
                })}
              </div>
            </>
          )}

          {/* ─── FINAL OUTPUT ─── */}
          {completed && finalOutput && (
            <FinalOutputCard content={finalOutput} />
          )}

          {/* ─── IDLE STATE ─── */}
          {!started && (
            <div
              className="text-center py-20 rounded-2xl"
              style={{
                background: 'rgba(9, 7, 20, 0.5)',
                border: '1px dashed rgba(139, 92, 246, 0.15)',
              }}
            >
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
                style={{
                  background: 'rgba(139, 92, 246, 0.08)',
                  border: '1px solid rgba(139, 92, 246, 0.15)',
                }}
              >
                <MessageSquare className="w-7 h-7" style={{ color: 'rgba(139, 92, 246, 0.4)' }} />
              </div>
              <h3 className="font-bold mb-2" style={{ color: 'rgba(196, 181, 253, 0.5)' }}>
                Configure & Run
              </h3>
              <p className="text-sm max-w-sm mx-auto" style={{ color: 'rgba(139, 92, 246, 0.35)' }}>
                Set your workflow objective, select a type, toggle human-in-the-loop, then click{' '}
                <strong style={{ color: 'rgba(139, 92, 246, 0.5)' }}>Run Workflow</strong> to watch
                the agents collaborate in real time.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
