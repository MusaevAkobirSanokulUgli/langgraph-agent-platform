'use client'

import { useState } from 'react'
import { ChevronDown, ChevronRight, Database, Clock, CheckCircle, AlertCircle } from 'lucide-react'

interface StateSnapshot {
  agent: string
  timestamp: string
  status: 'completed' | 'active' | 'pending'
  changes: Record<string, string>
  color: string
}

const STATE_SNAPSHOTS: StateSnapshot[] = [
  {
    agent: 'Initial State',
    timestamp: 'T+0s',
    status: 'completed',
    color: '#6ee7b7',
    changes: {
      objective: '"Analyze market trends in AI infrastructure"',
      status: '"running"',
      iteration: '0',
      current_agent: '"researcher"',
    },
  },
  {
    agent: 'Research Agent',
    timestamp: 'T+3.2s',
    status: 'completed',
    color: '#38bdf8',
    changes: {
      research_findings: '[{confidence: 0.85, key_findings: [...]}]',
      current_agent: '"analyzer"',
      iteration: '1',
      messages: '[{role: "assistant", content: "[Researcher] ..."}]',
    },
  },
  {
    agent: 'Analysis Agent',
    timestamp: 'T+6.8s',
    status: 'completed',
    color: '#a78bfa',
    changes: {
      analysis: '{insights: [...], recommendations: [...], confidence_score: 0.91}',
      current_agent: '"writer"',
      needs_human_review: 'false',
    },
  },
  {
    agent: 'Writer Agent',
    timestamp: 'T+10.1s',
    status: 'completed',
    color: '#34d399',
    changes: {
      draft: '"# AI Infrastructure Market Analysis\\n\\n..."',
      current_agent: '"reviewer"',
    },
  },
  {
    agent: 'Reviewer Agent',
    timestamp: 'T+13.5s',
    status: 'active',
    color: '#fbbf24',
    changes: {
      review_feedback: '[{approved: true, quality_score: 0.87, ...}]',
      final_output: '"# AI Infrastructure Market Analysis..."',
      status: '"completed"',
    },
  },
]

interface SnapshotRowProps {
  snapshot: StateSnapshot
  index: number
}

function SnapshotRow({ snapshot, index }: SnapshotRowProps) {
  const [open, setOpen] = useState(index === 4)

  return (
    <div className="border border-zinc-800/60 rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-zinc-800/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: snapshot.color }} />
          <span className="font-medium text-sm text-zinc-200">{snapshot.agent}</span>
          <span className="text-xs text-zinc-600 font-mono">{snapshot.timestamp}</span>
        </div>
        <div className="flex items-center gap-2">
          {snapshot.status === 'completed' && <CheckCircle className="w-3.5 h-3.5 text-green-500" />}
          {snapshot.status === 'active' && (
            <div className="w-3.5 h-3.5 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
          )}
          {open ? (
            <ChevronDown className="w-4 h-4 text-zinc-600" />
          ) : (
            <ChevronRight className="w-4 h-4 text-zinc-600" />
          )}
        </div>
      </button>

      {open && (
        <div className="px-4 pb-4 border-t border-zinc-800/60">
          <div className="mt-3 space-y-2">
            {Object.entries(snapshot.changes).map(([key, value]) => (
              <div key={key} className="flex items-start gap-3">
                <span className="font-mono text-xs text-violet-400 shrink-0 mt-0.5 min-w-32">{key}</span>
                <span className="font-mono text-xs text-zinc-400 break-all">{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function StateTimeline() {
  return (
    <div className="w-full">
      <div className="flex items-center gap-3 mb-5">
        <Database className="w-5 h-5 text-violet-400" />
        <div>
          <h3 className="text-lg font-semibold text-white">State Timeline</h3>
          <p className="text-sm text-zinc-500">LangGraph TypedDict state mutations across agent transitions</p>
        </div>
      </div>

      <div className="space-y-2">
        {STATE_SNAPSHOTS.map((snapshot, i) => (
          <div key={snapshot.agent} className="flex gap-3">
            {/* Timeline connector */}
            <div className="flex flex-col items-center">
              <div
                className="w-3 h-3 rounded-full shrink-0 mt-3.5"
                style={{ backgroundColor: snapshot.status === 'active' ? snapshot.color : undefined }}
                data-completed={snapshot.status === 'completed'}
              >
                {snapshot.status !== 'active' && (
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{
                      backgroundColor: snapshot.status === 'completed' ? snapshot.color + '60' : '#27272a',
                      border: `1.5px solid ${snapshot.color}`,
                    }}
                  />
                )}
              </div>
              {i < STATE_SNAPSHOTS.length - 1 && (
                <div className="w-px flex-1 bg-zinc-800 mt-1" />
              )}
            </div>

            {/* Card */}
            <div className="flex-1 mb-2">
              <SnapshotRow snapshot={snapshot} index={i} />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 rounded-lg bg-zinc-900/50 border border-zinc-800/60">
        <p className="text-xs text-zinc-500 flex items-start gap-2">
          <Clock className="w-3.5 h-3.5 text-zinc-600 mt-0.5 shrink-0" />
          State is persisted via LangGraph's MemorySaver checkpointer, enabling workflow resumption after human-in-the-loop interrupts. Each node mutation is immutable and traceable.
        </p>
      </div>
    </div>
  )
}
