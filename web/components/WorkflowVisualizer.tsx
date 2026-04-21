'use client'

import { useState, useEffect } from 'react'
import { Search, BarChart2, PenTool, CheckCircle, User, GitBranch } from 'lucide-react'

type NodeId = 'research' | 'analyze' | 'write' | 'review' | 'human_review' | 'end'

interface FlowNode {
  id: NodeId
  label: string
  sublabel: string
  icon: React.ElementType
  color: string
  gradient: string
  x: number
  y: number
}

const NODES: FlowNode[] = [
  {
    id: 'research',
    label: 'Research',
    sublabel: 'Gathers information',
    icon: Search,
    color: '#38bdf8',
    gradient: 'from-sky-500 to-blue-600',
    x: 50,
    y: 120,
  },
  {
    id: 'analyze',
    label: 'Analyze',
    sublabel: 'Derives insights',
    icon: BarChart2,
    color: '#a78bfa',
    gradient: 'from-violet-500 to-purple-600',
    x: 230,
    y: 120,
  },
  {
    id: 'write',
    label: 'Write',
    sublabel: 'Creates content',
    icon: PenTool,
    color: '#34d399',
    gradient: 'from-emerald-500 to-teal-600',
    x: 410,
    y: 120,
  },
  {
    id: 'review',
    label: 'Review',
    sublabel: 'Evaluates quality',
    icon: CheckCircle,
    color: '#fbbf24',
    gradient: 'from-amber-500 to-orange-600',
    x: 590,
    y: 120,
  },
  {
    id: 'human_review',
    label: 'Human',
    sublabel: 'In-the-loop',
    icon: User,
    color: '#f472b6',
    gradient: 'from-pink-500 to-rose-600',
    x: 320,
    y: 270,
  },
  {
    id: 'end',
    label: 'Done',
    sublabel: 'Output ready',
    icon: GitBranch,
    color: '#6ee7b7',
    gradient: 'from-emerald-400 to-cyan-500',
    x: 680,
    y: 270,
  },
]

const FLOW_ORDER: NodeId[] = ['research', 'analyze', 'write', 'review', 'end']

export default function WorkflowVisualizer() {
  const [activeNode, setActiveNode] = useState<NodeId>('research')
  const [completedNodes, setCompletedNodes] = useState<Set<NodeId>>(new Set())
  const [isRunning, setIsRunning] = useState(false)

  const runSimulation = () => {
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
          }, 1200)
        }
      }, i * 1400)
    })
  }

  useEffect(() => {
    runSimulation()
  }, [])

  const getNodeState = (id: NodeId) => {
    if (completedNodes.has(id)) return 'completed'
    if (activeNode === id) return 'active'
    return 'idle'
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white">Agent Workflow Graph</h3>
          <p className="text-sm text-zinc-500 mt-0.5">LangGraph StateGraph — conditional routing with human-in-the-loop</p>
        </div>
        <button
          onClick={runSimulation}
          disabled={isRunning}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20 text-sm font-medium hover:bg-sky-500/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isRunning ? (
            <>
              <span className="w-3 h-3 border-2 border-sky-400/30 border-t-sky-400 rounded-full animate-spin" />
              Running...
            </>
          ) : (
            'Simulate'
          )}
        </button>
      </div>

      {/* Main graph canvas */}
      <div className="relative w-full overflow-x-auto">
        <svg
          viewBox="0 0 800 380"
          className="w-full"
          style={{ minWidth: '600px' }}
        >
          <defs>
            <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
              <path d="M0,0 L0,6 L8,3 z" fill="#3f3f46" />
            </marker>
            <marker id="arrow-active" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
              <path d="M0,0 L0,6 L8,3 z" fill="#38bdf8" />
            </marker>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Main flow edges */}
          {/* research -> analyze */}
          <line x1="130" y1="150" x2="210" y2="150" stroke="#3f3f46" strokeWidth="1.5" markerEnd="url(#arrow)" />
          {/* analyze -> write */}
          <line x1="310" y1="150" x2="390" y2="150" stroke="#3f3f46" strokeWidth="1.5" markerEnd="url(#arrow)" />
          {/* write -> review */}
          <line x1="490" y1="150" x2="570" y2="150" stroke="#3f3f46" strokeWidth="1.5" markerEnd="url(#arrow)" />
          {/* review -> end */}
          <path d="M 670 150 Q 720 150 720 200 Q 720 250 720 270 L 760 270" stroke="#3f3f46" strokeWidth="1.5" fill="none" markerEnd="url(#arrow)" />

          {/* Human review branch edges */}
          {/* analyze -> human_review */}
          <path d="M 270 190 Q 270 270 300 270" stroke="#3f3f46" strokeWidth="1.5" strokeDasharray="4 3" fill="none" markerEnd="url(#arrow)" />
          {/* human_review -> research (loop back) */}
          <path d="M 320 295 Q 50 340 50 200 Q 50 140 50 140" stroke="#3f3f46" strokeWidth="1.5" strokeDasharray="4 3" fill="none" markerEnd="url(#arrow)" />
          {/* review -> write (revision loop) */}
          <path d="M 590 165 Q 590 210 500 210 Q 450 210 450 170" stroke="#3f3f46" strokeWidth="1.5" strokeDasharray="4 3" fill="none" markerEnd="url(#arrow)" />

          {/* Active flow animation */}
          {isRunning && (
            <line
              x1="130" y1="150" x2="210" y2="150"
              stroke="#38bdf8"
              strokeWidth="2"
              className="flow-line"
              opacity="0.6"
            />
          )}

          {/* Nodes */}
          {NODES.map((node) => {
            const state = getNodeState(node.id)
            const Icon = node.icon
            const isActive = state === 'active'
            const isDone = state === 'completed'

            return (
              <g key={node.id}>
                {/* Glow for active */}
                {isActive && (
                  <circle
                    cx={node.x + 40}
                    cy={node.y + 30}
                    r="42"
                    fill={node.color}
                    opacity="0.08"
                  />
                )}

                {/* Node box */}
                <rect
                  x={node.x}
                  y={node.y}
                  width="80"
                  height="60"
                  rx="10"
                  fill={isActive ? '#1c1c1e' : isDone ? '#16161a' : '#111113'}
                  stroke={isActive ? node.color : isDone ? '#2a2a2e' : '#27272a'}
                  strokeWidth={isActive ? '1.5' : '1'}
                  filter={isActive ? 'url(#glow)' : undefined}
                />

                {/* Icon area */}
                <rect
                  x={node.x + 28}
                  y={node.y + 8}
                  width="24"
                  height="24"
                  rx="6"
                  fill={isActive || isDone ? node.color + '20' : '#27272a'}
                />

                {/* Status indicator */}
                <circle
                  cx={node.x + 70}
                  cy={node.y + 10}
                  r="4"
                  fill={isActive ? node.color : isDone ? '#22c55e' : '#3f3f46'}
                />

                {/* Labels */}
                <text
                  x={node.x + 40}
                  y={node.y + 47}
                  textAnchor="middle"
                  fill={isActive ? '#ffffff' : isDone ? '#a1a1aa' : '#71717a'}
                  fontSize="10"
                  fontWeight={isActive ? '600' : '400'}
                >
                  {node.label}
                </text>
                <text
                  x={node.x + 40}
                  y={node.y + 58}
                  textAnchor="middle"
                  fill="#52525b"
                  fontSize="7.5"
                >
                  {node.sublabel}
                </text>
              </g>
            )
          })}

          {/* Labels for edge types */}
          <text x="395" y="200" fill="#52525b" fontSize="9" textAnchor="middle">revision</text>
          <text x="240" y="240" fill="#52525b" fontSize="9" textAnchor="middle">low confidence</text>
          <text x="90" y="315" fill="#52525b" fontSize="9" textAnchor="middle">after feedback</text>
        </svg>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-zinc-800/60">
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <div className="w-6 h-px bg-zinc-600" />
          <span>Primary flow</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <div className="w-6 h-px bg-zinc-600" style={{ borderTop: '1px dashed' }} />
          <span>Conditional path</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <div className="w-3 h-3 rounded-full bg-sky-400 animate-pulse" />
          <span>Active node</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span>Completed</span>
        </div>
      </div>
    </div>
  )
}
