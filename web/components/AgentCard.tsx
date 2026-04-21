'use client'

import { useState } from 'react'
import { Search, BarChart2, PenTool, CheckCircle, Wrench, Cpu } from 'lucide-react'

interface AgentCardProps {
  role: 'researcher' | 'analyzer' | 'writer' | 'reviewer'
  description: string
  capabilities: string[]
  tools: string[]
  active?: boolean
}

const roleConfig = {
  researcher: {
    icon: Search,
    label: 'Research Agent',
    color: 'sky',
    gradient: 'from-sky-500 to-blue-600',
    bg: 'bg-sky-500/10',
    border: 'border-sky-500/30',
    text: 'text-sky-400',
    badge: 'bg-sky-950 text-sky-300 border-sky-800',
  },
  analyzer: {
    icon: BarChart2,
    label: 'Analysis Agent',
    color: 'violet',
    gradient: 'from-violet-500 to-purple-600',
    bg: 'bg-violet-500/10',
    border: 'border-violet-500/30',
    text: 'text-violet-400',
    badge: 'bg-violet-950 text-violet-300 border-violet-800',
  },
  writer: {
    icon: PenTool,
    label: 'Writer Agent',
    color: 'emerald',
    gradient: 'from-emerald-500 to-teal-600',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    text: 'text-emerald-400',
    badge: 'bg-emerald-950 text-emerald-300 border-emerald-800',
  },
  reviewer: {
    icon: CheckCircle,
    label: 'Reviewer Agent',
    color: 'amber',
    gradient: 'from-amber-500 to-orange-600',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    text: 'text-amber-400',
    badge: 'bg-amber-950 text-amber-300 border-amber-800',
  },
}

export default function AgentCard({
  role,
  description,
  capabilities,
  tools,
  active = false,
}: AgentCardProps) {
  const [expanded, setExpanded] = useState(false)
  const config = roleConfig[role]
  const Icon = config.icon

  return (
    <div
      className={`relative rounded-xl border transition-all duration-300 cursor-pointer
        ${active ? `${config.border} ${config.bg}` : 'border-zinc-800 bg-zinc-900/50'}
        hover:border-opacity-60 group`}
      onClick={() => setExpanded(!expanded)}
    >
      {active && (
        <div className="absolute -top-px left-4 right-4 h-px bg-gradient-to-r from-transparent via-current to-transparent opacity-60" />
      )}

      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${config.gradient} flex items-center justify-center shadow-lg`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-sm">{config.label}</h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Cpu className={`w-3 h-3 ${config.text}`} />
                <span className={`text-xs ${config.text}`}>GPT-4o</span>
              </div>
            </div>
          </div>
          {active && (
            <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${config.badge}`}>
              Active
            </span>
          )}
        </div>

        <p className="text-sm text-zinc-400 leading-relaxed mb-4">{description}</p>

        <div className="space-y-3">
          <div>
            <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">Capabilities</p>
            <div className="flex flex-wrap gap-1.5">
              {capabilities.map((cap) => (
                <span
                  key={cap}
                  className="text-xs px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-300 border border-zinc-700"
                >
                  {cap}
                </span>
              ))}
            </div>
          </div>

          {tools.length > 0 && (
            <div>
              <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                <Wrench className="w-3 h-3" />
                Tools
              </p>
              <div className="flex flex-wrap gap-1.5">
                {tools.map((tool) => (
                  <span
                    key={tool}
                    className={`text-xs px-2 py-0.5 rounded-md border font-medium ${config.badge}`}
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
