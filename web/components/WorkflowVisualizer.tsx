'use client'

import { useState, useEffect } from 'react'
import { Search, BarChart2, PenTool, CheckCircle, User, GitBranch, RefreshCw } from 'lucide-react'

type NodeId = 'research' | 'analyze' | 'write' | 'review' | 'human_review' | 'end'

interface FlowNode {
  id: NodeId
  label: string
  sublabel: string
  icon: React.ElementType
  accentColor: string
  glowColor: string
  x: number
  y: number
}

const NODES: FlowNode[] = [
  {
    id: 'research',
    label: 'Research',
    sublabel: 'Gathers data',
    icon: Search,
    accentColor: '#A78BFA',
    glowColor: 'rgba(167, 139, 250, 0.5)',
    x: 48,
    y: 110,
  },
  {
    id: 'analyze',
    label: 'Analyze',
    sublabel: 'Derives insights',
    icon: BarChart2,
    accentColor: '#C084FC',
    glowColor: 'rgba(192, 132, 252, 0.5)',
    x: 228,
    y: 110,
  },
  {
    id: 'write',
    label: 'Write',
    sublabel: 'Creates content',
    icon: PenTool,
    accentColor: '#818CF8',
    glowColor: 'rgba(129, 140, 248, 0.5)',
    x: 408,
    y: 110,
  },
  {
    id: 'review',
    label: 'Review',
    sublabel: 'Quality gate',
    icon: CheckCircle,
    accentColor: '#E879F9',
    glowColor: 'rgba(232, 121, 249, 0.5)',
    x: 588,
    y: 110,
  },
  {
    id: 'human_review',
    label: 'Human',
    sublabel: 'In-the-loop',
    icon: User,
    accentColor: '#F9A8D4',
    glowColor: 'rgba(249, 168, 212, 0.4)',
    x: 318,
    y: 265,
  },
  {
    id: 'end',
    label: 'Done',
    sublabel: 'Output ready',
    icon: GitBranch,
    accentColor: '#A78BFA',
    glowColor: 'rgba(167, 139, 250, 0.4)',
    x: 668,
    y: 265,
  },
]

const FLOW_ORDER: NodeId[] = ['research', 'analyze', 'write', 'review', 'end']

export default function WorkflowVisualizer() {
  const [activeNode, setActiveNode] = useState<NodeId>('research')
  const [completedNodes, setCompletedNodes] = useState<Set<NodeId>>(new Set())
  const [isRunning, setIsRunning] = useState(false)

  const runSimulation = () => {
    if (isRunning) return
    setIsRunning(true)
    setCompletedNodes(new Set())
    setActiveNode('research')

    FLOW_ORDER.forEach((nodeId, i) => {
      setTimeout(() => {
        setActiveNode(nodeId)
        if (i > 0) {
          setCompletedNodes((prev) => new Set([...prev, FLOW_ORDER[i - 1]]))
        }
        if (i === FLOW_ORDER.length - 1) {
          setTimeout(() => {
            setCompletedNodes(new Set(FLOW_ORDER))
            setIsRunning(false)
          }, 1400)
        }
      }, i * 1600)
    })
  }

  useEffect(() => {
    const timer = setTimeout(() => runSimulation(), 500)
    return () => clearTimeout(timer)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getNodeState = (id: NodeId) => {
    if (completedNodes.has(id)) return 'completed'
    if (activeNode === id) return 'active'
    return 'idle'
  }

  return (
    <div className="w-full">
      {/* Header row */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-bold text-base" style={{ color: '#E2E0FF' }}>
            Agent Workflow Graph
          </h3>
          <p className="text-xs mt-0.5" style={{ color: 'rgba(167, 139, 250, 0.5)' }}>
            LangGraph StateGraph — conditional routing with human-in-the-loop
          </p>
        </div>
        <button
          onClick={runSimulation}
          disabled={isRunning}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            background: isRunning ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.15)',
            color: '#A78BFA',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            boxShadow: isRunning ? 'none' : '0 0 12px rgba(139, 92, 246, 0.1)',
          }}
        >
          {isRunning ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-violet-400/30 border-t-violet-400 rounded-full animate-spin" />
              Running
            </>
          ) : (
            <>
              <RefreshCw className="w-3.5 h-3.5" />
              Simulate
            </>
          )}
        </button>
      </div>

      {/* SVG Graph */}
      <div className="relative w-full overflow-x-auto rounded-xl" style={{ background: 'rgba(9, 7, 20, 0.5)' }}>
        {/* Grid overlay */}
        <div
          className="absolute inset-0 rounded-xl pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(rgba(139, 92, 246, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(139, 92, 246, 0.04) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />

        <svg
          viewBox="0 0 800 380"
          className="w-full relative z-10"
          style={{ minWidth: '560px' }}
        >
          <defs>
            <marker id="arrow-violet" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
              <path d="M0,0 L0,6 L8,3 z" fill="rgba(139, 92, 246, 0.4)" />
            </marker>
            <marker id="arrow-active" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
              <path d="M0,0 L0,6 L8,3 z" fill="#A78BFA" />
            </marker>
            <marker id="arrow-dashed" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
              <path d="M0,0 L0,6 L8,3 z" fill="rgba(192, 132, 252, 0.3)" />
            </marker>
            <filter id="glow-node">
              <feGaussianBlur stdDeviation="4" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="glow-line">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id="edge-gradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#C084FC" stopOpacity="0.4" />
            </linearGradient>
          </defs>

          {/* ── Static edges (primary flow) ── */}
          {/* research -> analyze */}
          <line x1="128" y1="145" x2="208" y2="145"
            stroke="url(#edge-gradient)" strokeWidth="1.5" markerEnd="url(#arrow-violet)" />
          {/* analyze -> write */}
          <line x1="308" y1="145" x2="388" y2="145"
            stroke="url(#edge-gradient)" strokeWidth="1.5" markerEnd="url(#arrow-violet)" />
          {/* write -> review */}
          <line x1="488" y1="145" x2="568" y2="145"
            stroke="url(#edge-gradient)" strokeWidth="1.5" markerEnd="url(#arrow-violet)" />
          {/* review -> end */}
          <path d="M 668 145 Q 718 145 718 205 Q 718 265 718 280 L 748 280"
            stroke="url(#edge-gradient)" strokeWidth="1.5" fill="none" markerEnd="url(#arrow-violet)" />

          {/* ── Conditional / dashed edges ── */}
          {/* analyze -> human_review */}
          <path d="M 268 190 Q 268 265 298 280"
            stroke="rgba(192, 132, 252, 0.25)" strokeWidth="1.5" strokeDasharray="5 4" fill="none"
            markerEnd="url(#arrow-dashed)" />
          {/* human_review -> research (loop back) */}
          <path d="M 318 295 Q 48 345 48 210 Q 48 145 48 145"
            stroke="rgba(192, 132, 252, 0.2)" strokeWidth="1.5" strokeDasharray="5 4" fill="none"
            markerEnd="url(#arrow-dashed)" />
          {/* review -> write (revision loop) */}
          <path d="M 588 165 Q 588 215 500 215 Q 448 215 448 170"
            stroke="rgba(192, 132, 252, 0.25)" strokeWidth="1.5" strokeDasharray="5 4" fill="none"
            markerEnd="url(#arrow-dashed)" />

          {/* ── Active flow animated line ── */}
          {isRunning && (
            <>
              <line x1="128" y1="145" x2="208" y2="145"
                stroke="#8B5CF6" strokeWidth="2.5" strokeDasharray="10 5"
                className="flow-line" opacity="0.8" filter="url(#glow-line)" />
              <line x1="308" y1="145" x2="388" y2="145"
                stroke="#8B5CF6" strokeWidth="2.5" strokeDasharray="10 5"
                className="flow-line" opacity="0.8" filter="url(#glow-line)" />
            </>
          )}

          {/* ── Edge labels ── */}
          <text x="395" y="210" fill="rgba(139, 92, 246, 0.35)" fontSize="8.5" textAnchor="middle" fontFamily="monospace">
            revision loop
          </text>
          <text x="238" y="240" fill="rgba(139, 92, 246, 0.35)" fontSize="8.5" textAnchor="middle" fontFamily="monospace">
            low confidence
          </text>
          <text x="90" y="320" fill="rgba(139, 92, 246, 0.35)" fontSize="8.5" textAnchor="middle" fontFamily="monospace">
            after feedback
          </text>

          {/* ── Nodes ── */}
          {NODES.map((node) => {
            const state = getNodeState(node.id)
            const Icon = node.icon
            const isActive = state === 'active'
            const isDone = state === 'completed'
            const cx = node.x + 40
            const cy = node.y + 35

            return (
              <g key={node.id}>
                {/* Outer glow ring for active */}
                {isActive && (
                  <circle
                    cx={cx}
                    cy={cy}
                    r="48"
                    fill={node.accentColor}
                    opacity="0.06"
                  />
                )}
                {isActive && (
                  <circle
                    cx={cx}
                    cy={cy}
                    r="38"
                    fill={node.accentColor}
                    opacity="0.08"
                  />
                )}

                {/* Node background */}
                <rect
                  x={node.x}
                  y={node.y}
                  width="80"
                  height="70"
                  rx="12"
                  fill={isActive ? `${node.accentColor}10` : isDone ? `${node.accentColor}06` : 'rgba(15, 12, 36, 0.8)'}
                  stroke={isActive ? node.accentColor : isDone ? `${node.accentColor}60` : 'rgba(139, 92, 246, 0.15)'}
                  strokeWidth={isActive ? '1.5' : '1'}
                  filter={isActive ? 'url(#glow-node)' : undefined}
                />

                {/* Icon background */}
                <rect
                  x={node.x + 27}
                  y={node.y + 8}
                  width="26"
                  height="26"
                  rx="7"
                  fill={isActive || isDone ? `${node.accentColor}18` : 'rgba(139, 92, 246, 0.06)'}
                  stroke={isActive || isDone ? `${node.accentColor}30` : 'rgba(139, 92, 246, 0.08)'}
                  strokeWidth="1"
                />

                {/* Status dot */}
                <circle
                  cx={node.x + 71}
                  cy={node.y + 11}
                  r="4"
                  fill={isActive ? node.accentColor : isDone ? '#22c55e' : 'rgba(139, 92, 246, 0.15)'}
                />
                {isActive && (
                  <circle
                    cx={node.x + 71}
                    cy={node.y + 11}
                    r="6"
                    fill="none"
                    stroke={node.accentColor}
                    strokeWidth="1"
                    opacity="0.4"
                  />
                )}

                {/* Node label */}
                <text
                  x={cx}
                  y={node.y + 52}
                  textAnchor="middle"
                  fill={isActive ? '#E2E0FF' : isDone ? 'rgba(196, 181, 253, 0.7)' : 'rgba(167, 139, 250, 0.35)'}
                  fontSize="10"
                  fontWeight={isActive ? '700' : '500'}
                  fontFamily="system-ui"
                >
                  {node.label}
                </text>
                <text
                  x={cx}
                  y={node.y + 64}
                  textAnchor="middle"
                  fill={isActive ? node.accentColor : 'rgba(139, 92, 246, 0.25)'}
                  fontSize="7.5"
                  fontFamily="monospace"
                >
                  {node.sublabel}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      {/* Legend */}
      <div
        className="flex flex-wrap gap-5 mt-5 pt-4"
        style={{ borderTop: '1px solid rgba(139, 92, 246, 0.08)' }}
      >
        {[
          { color: 'rgba(139, 92, 246, 0.5)', label: 'Primary flow', dashed: false },
          { color: 'rgba(192, 132, 252, 0.35)', label: 'Conditional path', dashed: true },
          { color: '#A78BFA', label: 'Active node', pulse: true },
          { color: '#22c55e', label: 'Completed', pulse: false },
        ].map(({ color, label, dashed, pulse }) => (
          <div key={label} className="flex items-center gap-2">
            {pulse !== undefined && !dashed ? (
              <div
                className={`w-2.5 h-2.5 rounded-full ${pulse ? 'animate-pulse' : ''}`}
                style={{ background: color }}
              />
            ) : (
              <div className="flex items-center">
                <div
                  className="w-5 h-px"
                  style={{
                    background: color,
                    borderTop: dashed ? `1.5px dashed ${color}` : 'none',
                    height: dashed ? '0' : '1.5px',
                  }}
                />
              </div>
            )}
            <span className="text-xs" style={{ color: 'rgba(167, 139, 250, 0.5)' }}>
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
