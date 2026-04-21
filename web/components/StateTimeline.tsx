'use client'

import { useState } from 'react'
import { Database, Clock, CheckCircle, ChevronDown } from 'lucide-react'

interface StateSnapshot {
  agent: string
  timestamp: string
  status: 'completed' | 'active' | 'pending'
  changes: Record<string, string>
  accentColor: string
  glowColor: string
}

const STATE_SNAPSHOTS: StateSnapshot[] = [
  {
    agent: 'Initial State',
    timestamp: 'T+0s',
    status: 'completed',
    accentColor: '#A78BFA',
    glowColor: 'rgba(167, 139, 250, 0.3)',
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
    accentColor: '#C084FC',
    glowColor: 'rgba(192, 132, 252, 0.3)',
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
    accentColor: '#818CF8',
    glowColor: 'rgba(129, 140, 248, 0.3)',
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
    accentColor: '#E879F9',
    glowColor: 'rgba(232, 121, 249, 0.3)',
    changes: {
      draft: '"# AI Infrastructure Market Analysis\\n\\n..."',
      current_agent: '"reviewer"',
    },
  },
  {
    agent: 'Reviewer Agent',
    timestamp: 'T+13.5s',
    status: 'active',
    accentColor: '#C084FC',
    glowColor: 'rgba(192, 132, 252, 0.4)',
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
    <div
      className="rounded-xl overflow-hidden transition-all duration-200"
      style={{
        background: open
          ? 'rgba(20, 17, 46, 0.7)'
          : 'rgba(15, 12, 36, 0.5)',
        border: `1px solid ${open ? snapshot.accentColor + '30' : 'rgba(139, 92, 246, 0.1)'}`,
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3.5 transition-colors"
        style={{ color: 'inherit' }}
      >
        <div className="flex items-center gap-3">
          {/* Status dot */}
          {snapshot.status === 'active' ? (
            <div
              className="w-2.5 h-2.5 rounded-full shrink-0 status-active"
              style={{ background: snapshot.accentColor }}
            />
          ) : snapshot.status === 'completed' ? (
            <div
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{
                background: snapshot.accentColor + '80',
                border: `1.5px solid ${snapshot.accentColor}`,
              }}
            />
          ) : (
            <div
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ background: 'rgba(139, 92, 246, 0.15)', border: '1.5px solid rgba(139, 92, 246, 0.2)' }}
            />
          )}
          <span className="font-semibold text-sm" style={{ color: '#E2E0FF' }}>
            {snapshot.agent}
          </span>
          <span className="text-xs font-mono" style={{ color: 'rgba(139, 92, 246, 0.5)' }}>
            {snapshot.timestamp}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {snapshot.status === 'completed' && (
            <CheckCircle className="w-3.5 h-3.5" style={{ color: snapshot.accentColor }} />
          )}
          {snapshot.status === 'active' && (
            <div
              className="w-3.5 h-3.5 rounded-full border-2 border-t-transparent animate-spin"
              style={{ borderColor: snapshot.accentColor + '40', borderTopColor: snapshot.accentColor }}
            />
          )}
          <ChevronDown
            className="w-4 h-4 transition-transform duration-200"
            style={{
              color: 'rgba(167, 139, 250, 0.4)',
              transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            }}
          />
        </div>
      </button>

      {open && (
        <div
          className="px-4 pb-4 pt-3"
          style={{ borderTop: '1px solid rgba(139, 92, 246, 0.08)' }}
        >
          <div className="space-y-2">
            {Object.entries(snapshot.changes).map(([key, value]) => (
              <div key={key} className="flex items-start gap-3">
                <span
                  className="font-mono text-xs shrink-0 mt-0.5"
                  style={{
                    color: snapshot.accentColor,
                    minWidth: '130px',
                  }}
                >
                  {key}
                </span>
                <span
                  className="font-mono text-xs break-all"
                  style={{ color: 'rgba(196, 181, 253, 0.6)' }}
                >
                  {value}
                </span>
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
      <div className="flex items-center gap-3 mb-6">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{
            background: 'rgba(139, 92, 246, 0.12)',
            border: '1px solid rgba(139, 92, 246, 0.25)',
          }}
        >
          <Database className="w-4 h-4" style={{ color: '#A78BFA' }} />
        </div>
        <div>
          <h3 className="font-bold text-base" style={{ color: '#E2E0FF' }}>
            State Timeline
          </h3>
          <p className="text-xs" style={{ color: 'rgba(167, 139, 250, 0.5)' }}>
            LangGraph TypedDict mutations across agent transitions
          </p>
        </div>
      </div>

      <div className="space-y-2">
        {STATE_SNAPSHOTS.map((snapshot, i) => (
          <div key={snapshot.agent} className="flex gap-3">
            {/* Timeline connector */}
            <div className="flex flex-col items-center">
              <div className="w-3 h-3 mt-4 shrink-0 flex items-center justify-center">
                {snapshot.status === 'active' ? (
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{
                      background: snapshot.accentColor,
                      boxShadow: `0 0 8px ${snapshot.glowColor}`,
                      animation: 'statusPulse 2s ease-in-out infinite',
                    }}
                  />
                ) : (
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{
                      background: snapshot.accentColor + '50',
                      border: `1.5px solid ${snapshot.accentColor}`,
                    }}
                  />
                )}
              </div>
              {i < STATE_SNAPSHOTS.length - 1 && (
                <div
                  className="w-px flex-1 mt-1"
                  style={{
                    background: `linear-gradient(to bottom, ${snapshot.accentColor}30, rgba(139, 92, 246, 0.08))`,
                  }}
                />
              )}
            </div>

            {/* Card */}
            <div className="flex-1 mb-2">
              <SnapshotRow snapshot={snapshot} index={i} />
            </div>
          </div>
        ))}
      </div>

      <div
        className="mt-5 p-4 rounded-xl"
        style={{
          background: 'rgba(20, 17, 46, 0.5)',
          border: '1px solid rgba(139, 92, 246, 0.1)',
        }}
      >
        <p className="text-xs flex items-start gap-2" style={{ color: 'rgba(167, 139, 250, 0.5)' }}>
          <Clock className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: 'rgba(139, 92, 246, 0.4)' }} />
          State is persisted via LangGraph&apos;s MemorySaver checkpointer, enabling workflow resumption after human-in-the-loop interrupts. Each node mutation is immutable and fully traceable.
        </p>
      </div>
    </div>
  )
}
