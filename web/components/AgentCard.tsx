'use client'

import { useState } from 'react'
import { Search, BarChart2, PenTool, CheckCircle, Wrench, Cpu, ChevronDown } from 'lucide-react'

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
    number: '01',
    accentColor: '#A78BFA',
    glowColor: 'rgba(167, 139, 250, 0.3)',
    bgGlow: 'rgba(167, 139, 250, 0.06)',
    borderColor: 'rgba(167, 139, 250, 0.2)',
    borderActive: 'rgba(167, 139, 250, 0.45)',
    badgeBg: 'rgba(167, 139, 250, 0.1)',
    badgeBorder: 'rgba(167, 139, 250, 0.25)',
  },
  analyzer: {
    icon: BarChart2,
    label: 'Analysis Agent',
    number: '02',
    accentColor: '#C084FC',
    glowColor: 'rgba(192, 132, 252, 0.3)',
    bgGlow: 'rgba(192, 132, 252, 0.06)',
    borderColor: 'rgba(192, 132, 252, 0.2)',
    borderActive: 'rgba(192, 132, 252, 0.45)',
    badgeBg: 'rgba(192, 132, 252, 0.1)',
    badgeBorder: 'rgba(192, 132, 252, 0.25)',
  },
  writer: {
    icon: PenTool,
    label: 'Writer Agent',
    number: '03',
    accentColor: '#818CF8',
    glowColor: 'rgba(129, 140, 248, 0.3)',
    bgGlow: 'rgba(129, 140, 248, 0.06)',
    borderColor: 'rgba(129, 140, 248, 0.2)',
    borderActive: 'rgba(129, 140, 248, 0.45)',
    badgeBg: 'rgba(129, 140, 248, 0.1)',
    badgeBorder: 'rgba(129, 140, 248, 0.25)',
  },
  reviewer: {
    icon: CheckCircle,
    label: 'Reviewer Agent',
    number: '04',
    accentColor: '#E879F9',
    glowColor: 'rgba(232, 121, 249, 0.3)',
    bgGlow: 'rgba(232, 121, 249, 0.06)',
    borderColor: 'rgba(232, 121, 249, 0.18)',
    borderActive: 'rgba(232, 121, 249, 0.4)',
    badgeBg: 'rgba(232, 121, 249, 0.08)',
    badgeBorder: 'rgba(232, 121, 249, 0.25)',
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
      className="relative rounded-2xl transition-all duration-300 cursor-pointer overflow-hidden"
      style={{
        background: active
          ? `linear-gradient(135deg, rgba(20, 17, 46, 0.8), ${config.bgGlow})`
          : 'rgba(15, 12, 36, 0.6)',
        border: `1px solid ${active ? config.borderActive : config.borderColor}`,
        backdropFilter: 'blur(12px)',
        boxShadow: active
          ? `0 0 30px ${config.glowColor}, 0 8px 32px rgba(0,0,0,0.3)`
          : '0 4px 16px rgba(0,0,0,0.3)',
      }}
      onClick={() => setExpanded(!expanded)}
      onMouseEnter={(e) => {
        if (!active) {
          const el = e.currentTarget
          el.style.borderColor = config.borderActive
          el.style.boxShadow = `0 0 20px ${config.glowColor.replace('0.3', '0.15')}, 0 8px 32px rgba(0,0,0,0.3)`
          el.style.background = `linear-gradient(135deg, rgba(20, 17, 46, 0.8), ${config.bgGlow})`
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          const el = e.currentTarget
          el.style.borderColor = config.borderColor
          el.style.boxShadow = '0 4px 16px rgba(0,0,0,0.3)'
          el.style.background = 'rgba(15, 12, 36, 0.6)'
        }
      }}
    >
      {/* Top glow line when active */}
      {active && (
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{ background: `linear-gradient(90deg, transparent, ${config.accentColor}, transparent)` }}
        />
      )}

      {/* Corner accent number */}
      <div
        className="absolute top-4 right-4 font-mono font-bold text-2xl select-none pointer-events-none"
        style={{ color: `${config.accentColor}18` }}
      >
        {config.number}
      </div>

      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${config.accentColor}25, ${config.accentColor}10)`,
                border: `1px solid ${config.borderColor}`,
                boxShadow: active ? `0 0 16px ${config.glowColor}` : 'none',
              }}
            >
              <Icon className="w-5 h-5" style={{ color: config.accentColor }} />
            </div>
            <div>
              <h3
                className="font-bold text-sm"
                style={{ color: '#E2E0FF' }}
              >
                {config.label}
              </h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Cpu className="w-3 h-3" style={{ color: config.accentColor }} />
                <span className="text-xs font-mono" style={{ color: config.accentColor }}>
                  GPT-4o
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {active && (
              <span
                className="text-xs px-2.5 py-1 rounded-full font-semibold"
                style={{
                  background: config.badgeBg,
                  color: config.accentColor,
                  border: `1px solid ${config.badgeBorder}`,
                  boxShadow: `0 0 8px ${config.glowColor}`,
                }}
              >
                Active
              </span>
            )}
            <ChevronDown
              className="w-4 h-4 transition-transform duration-200"
              style={{
                color: config.accentColor,
                transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
              }}
            />
          </div>
        </div>

        {/* Description */}
        <p
          className="text-sm leading-relaxed mb-4"
          style={{ color: 'rgba(196, 181, 253, 0.65)' }}
        >
          {description}
        </p>

        {/* Capabilities */}
        <div className="mb-3">
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-2"
            style={{ color: 'rgba(167, 139, 250, 0.4)' }}
          >
            Capabilities
          </p>
          <div className="flex flex-wrap gap-1.5">
            {capabilities.map((cap) => (
              <span
                key={cap}
                className="text-xs px-2.5 py-1 rounded-lg font-medium"
                style={{
                  background: 'rgba(20, 17, 46, 0.8)',
                  color: 'rgba(196, 181, 253, 0.7)',
                  border: '1px solid rgba(139, 92, 246, 0.12)',
                }}
              >
                {cap}
              </span>
            ))}
          </div>
        </div>

        {/* Tools — visible when expanded or always if tools exist */}
        {tools.length > 0 && (
          <div
            className="overflow-hidden transition-all duration-300"
            style={{ maxHeight: expanded ? '200px' : '0', opacity: expanded ? 1 : 0 }}
          >
            <div className="pt-3 border-t border-opacity-10" style={{ borderColor: 'rgba(139, 92, 246, 0.15)' }}>
              <p
                className="text-xs font-semibold uppercase tracking-widest mb-2 flex items-center gap-1.5"
                style={{ color: 'rgba(167, 139, 250, 0.4)' }}
              >
                <Wrench className="w-3 h-3" />
                Tools
              </p>
              <div className="flex flex-wrap gap-1.5">
                {tools.map((tool) => (
                  <span
                    key={tool}
                    className="text-xs px-2.5 py-1 rounded-lg font-semibold font-mono"
                    style={{
                      background: config.badgeBg,
                      color: config.accentColor,
                      border: `1px solid ${config.badgeBorder}`,
                    }}
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Expand hint */}
        {tools.length > 0 && (
          <button
            className="mt-3 text-xs font-medium transition-colors"
            style={{ color: `${config.accentColor}80` }}
            onClick={(e) => { e.stopPropagation(); setExpanded(!expanded) }}
          >
            {expanded ? 'Show less' : 'Show tools →'}
          </button>
        )}
      </div>
    </div>
  )
}
