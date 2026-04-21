'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import { Search, BarChart2, PenTool, CheckCircle, User, Play, ChevronRight, ArrowRight } from 'lucide-react'

type Step = {
  agent: string
  icon: React.ElementType
  color: string
  message: string
  duration: number
  outputKey: string
  outputSample: string
}

const WORKFLOW_STEPS: Step[] = [
  {
    agent: 'Research Agent',
    icon: Search,
    color: '#38bdf8',
    message: 'Gathering information about AI infrastructure market trends...',
    duration: 3200,
    outputKey: 'research_findings',
    outputSample: '{"key_findings": ["GPU cloud market grew 340% YoY", "NVIDIA dominates with 80% share"], "confidence": 0.87}',
  },
  {
    agent: 'Analysis Agent',
    icon: BarChart2,
    color: '#a78bfa',
    message: 'Analyzing findings, confidence score: 0.65 — triggering human review...',
    duration: 2800,
    outputKey: 'analysis',
    outputSample: '{"insights": ["Hyperscaler capex suggests sustained demand"], "confidence_score": 0.65}',
  },
  {
    agent: 'Human Review',
    icon: User,
    color: '#f472b6',
    message: 'Paused — awaiting human input before proceeding...',
    duration: 0,
    outputKey: 'human_feedback',
    outputSample: '"Focus on inference infrastructure specifically, not training"',
  },
  {
    agent: 'Writer Agent',
    icon: PenTool,
    color: '#34d399',
    message: 'Drafting report incorporating human guidance...',
    duration: 4100,
    outputKey: 'draft',
    outputSample: '"# AI Inference Infrastructure: Market Analysis\\n\\nExecutive Summary..."',
  },
  {
    agent: 'Reviewer Agent',
    icon: CheckCircle,
    color: '#fbbf24',
    message: 'Quality score: 0.87 — approved. Workflow complete.',
    duration: 2200,
    outputKey: 'final_output',
    outputSample: '"# AI Inference Infrastructure: Market Analysis [APPROVED - quality: 0.87]"',
  },
]

type StepStatus = 'idle' | 'running' | 'paused' | 'done'

export default function DemoPage() {
  const [currentStep, setCurrentStep] = useState<number>(-1)
  const [stepStatuses, setStepStatuses] = useState<StepStatus[]>(WORKFLOW_STEPS.map(() => 'idle'))
  const [humanInput, setHumanInput] = useState('')
  const [waitingHuman, setWaitingHuman] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const [completed, setCompleted] = useState(false)

  const resetDemo = () => {
    setCurrentStep(-1)
    setStepStatuses(WORKFLOW_STEPS.map(() => 'idle'))
    setHumanInput('')
    setWaitingHuman(false)
    setIsRunning(false)
    setCompleted(false)
  }

  const runStep = (stepIndex: number) => {
    const step = WORKFLOW_STEPS[stepIndex]

    setCurrentStep(stepIndex)
    setStepStatuses((prev) => {
      const next = [...prev]
      next[stepIndex] = 'running'
      return next
    })

    if (step.outputKey === 'human_feedback') {
      // Pause for human
      setTimeout(() => {
        setWaitingHuman(true)
        setStepStatuses((prev) => {
          const next = [...prev]
          next[stepIndex] = 'paused'
          return next
        })
      }, 800)
      return
    }

    setTimeout(() => {
      setStepStatuses((prev) => {
        const next = [...prev]
        next[stepIndex] = 'done'
        return next
      })

      if (stepIndex < WORKFLOW_STEPS.length - 1) {
        setTimeout(() => runStep(stepIndex + 1), 400)
      } else {
        setCompleted(true)
        setIsRunning(false)
      }
    }, step.duration)
  }

  const startWorkflow = () => {
    resetDemo()
    setIsRunning(true)
    setTimeout(() => runStep(0), 300)
  }

  const submitHumanFeedback = () => {
    if (!humanInput.trim()) return
    setWaitingHuman(false)
    setStepStatuses((prev) => {
      const next = [...prev]
      next[currentStep] = 'done'
      return next
    })
    setTimeout(() => runStep(currentStep + 1), 400)
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <Header />

      <div className="pt-24 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-white mb-3">Interactive Demo</h1>
            <p className="text-zinc-400">
              Simulated multi-agent workflow with human-in-the-loop interrupt
            </p>
          </div>

          {/* Workflow input */}
          <div className="glass rounded-2xl p-6 mb-6">
            <h3 className="text-sm font-semibold text-zinc-300 mb-3 uppercase tracking-wider">Workflow Configuration</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-xs text-zinc-500 mb-1 block">Workflow Type</label>
                <div className="px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-sm text-zinc-300">
                  research
                </div>
              </div>
              <div>
                <label className="text-xs text-zinc-500 mb-1 block">Human-in-the-Loop</label>
                <div className="px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-sm text-emerald-400">
                  enabled
                </div>
              </div>
            </div>
            <div className="mb-4">
              <label className="text-xs text-zinc-500 mb-1 block">Objective</label>
              <div className="px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-sm text-zinc-300">
                Analyze market trends in AI infrastructure
              </div>
            </div>
            <button
              onClick={startWorkflow}
              disabled={isRunning}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-500 text-white font-semibold text-sm hover:bg-sky-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRunning ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Running...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  {completed ? 'Run Again' : 'Start Workflow'}
                </>
              )}
            </button>
          </div>

          {/* Steps */}
          {currentStep >= 0 && (
            <div className="space-y-3 mb-6">
              {WORKFLOW_STEPS.map((step, i) => {
                const status = stepStatuses[i]
                const Icon = step.icon
                const isVisible = i <= currentStep

                if (!isVisible) return null

                return (
                  <div
                    key={step.agent}
                    className={`glass rounded-xl overflow-hidden border transition-all duration-300 ${
                      status === 'running' || status === 'paused'
                        ? 'border-zinc-600'
                        : status === 'done'
                        ? 'border-zinc-800/40'
                        : 'border-zinc-800/60'
                    }`}
                  >
                    <div className="flex items-start gap-4 p-4">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                        style={{ backgroundColor: step.color + '20' }}
                      >
                        {status === 'running' ? (
                          <div
                            className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin"
                            style={{ borderColor: step.color + '40', borderTopColor: step.color }}
                          />
                        ) : (
                          <Icon className="w-4 h-4" style={{ color: step.color }} />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-sm text-white">{step.agent}</span>
                          {status === 'paused' && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-pink-500/10 text-pink-400 border border-pink-500/20">
                              Paused — Human Input Required
                            </span>
                          )}
                          {status === 'done' && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              Done
                            </span>
                          )}
                          {status === 'running' && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">
                              Active
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-zinc-400">{step.message}</p>

                        {status === 'done' && (
                          <div className="mt-2 p-2.5 rounded-lg bg-zinc-900/60 border border-zinc-800/60">
                            <span className="text-xs text-zinc-600 font-mono">{step.outputKey}: </span>
                            <span className="text-xs text-zinc-400 font-mono break-all">{step.outputSample}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Human input form */}
                    {status === 'paused' && waitingHuman && (
                      <div className="px-4 pb-4 border-t border-zinc-800/60 mt-2 pt-4">
                        <p className="text-xs text-zinc-500 mb-2">
                          The analyzer&apos;s confidence score (0.65) is below threshold. Provide guidance to continue:
                        </p>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={humanInput}
                            onChange={(e) => setHumanInput(e.target.value)}
                            placeholder="e.g., Focus on inference infrastructure specifically"
                            className="flex-1 px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-sm text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-pink-500/50"
                            onKeyDown={(e) => e.key === 'Enter' && submitHumanFeedback()}
                          />
                          <button
                            onClick={submitHumanFeedback}
                            disabled={!humanInput.trim()}
                            className="flex items-center gap-1 px-4 py-2 rounded-lg bg-pink-500/20 text-pink-400 border border-pink-500/30 text-sm font-medium hover:bg-pink-500/30 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            Submit
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="flex gap-2 mt-2">
                          {[
                            'Focus on inference infrastructure',
                            'Add cost analysis',
                            'Include competitor landscape',
                          ].map((suggestion) => (
                            <button
                              key={suggestion}
                              onClick={() => setHumanInput(suggestion)}
                              className="text-xs px-2 py-1 rounded-md bg-zinc-800 text-zinc-400 border border-zinc-700 hover:border-zinc-600 transition-colors"
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}

          {/* Completion */}
          {completed && (
            <div className="glass rounded-2xl p-6 border border-emerald-500/20">
              <div className="flex items-center gap-3 mb-3">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <h3 className="font-semibold text-white">Workflow Complete</h3>
              </div>
              <p className="text-sm text-zinc-400 mb-4">
                The multi-agent workflow completed successfully. The researcher gathered data, analyzer surfaced insights (with human guidance), the writer produced a draft, and the reviewer approved it with a quality score of 0.87.
              </p>
              <button
                onClick={resetDemo}
                className="text-sm text-sky-400 hover:text-sky-300 transition-colors font-medium"
              >
                Reset demo
              </button>
            </div>
          )}

          {currentStep === -1 && (
            <div className="text-center py-16 glass rounded-2xl border border-dashed border-zinc-800">
              <Play className="w-8 h-8 text-zinc-600 mx-auto mb-3" />
              <p className="text-zinc-500 text-sm">Click &quot;Start Workflow&quot; to simulate the agent pipeline</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
