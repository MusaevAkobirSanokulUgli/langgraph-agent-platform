'use client'

import { LucideIcon } from 'lucide-react'

interface FeatureCardProps {
  icon: LucideIcon
  title: string
  description: string
  badge?: string
  color?: 'violet' | 'purple' | 'indigo' | 'fuchsia' | 'pink'
}

const colorMap = {
  violet: {
    iconBg: 'rgba(139, 92, 246, 0.12)',
    iconColor: '#A78BFA',
    badgeBg: 'rgba(139, 92, 246, 0.1)',
    badgeColor: '#A78BFA',
    badgeBorder: 'rgba(139, 92, 246, 0.25)',
    glowColor: 'rgba(139, 92, 246, 0.12)',
    borderHover: 'rgba(139, 92, 246, 0.3)',
  },
  purple: {
    iconBg: 'rgba(192, 132, 252, 0.1)',
    iconColor: '#C084FC',
    badgeBg: 'rgba(192, 132, 252, 0.08)',
    badgeColor: '#C084FC',
    badgeBorder: 'rgba(192, 132, 252, 0.25)',
    glowColor: 'rgba(192, 132, 252, 0.1)',
    borderHover: 'rgba(192, 132, 252, 0.3)',
  },
  indigo: {
    iconBg: 'rgba(129, 140, 248, 0.1)',
    iconColor: '#818CF8',
    badgeBg: 'rgba(129, 140, 248, 0.08)',
    badgeColor: '#818CF8',
    badgeBorder: 'rgba(129, 140, 248, 0.25)',
    glowColor: 'rgba(129, 140, 248, 0.1)',
    borderHover: 'rgba(129, 140, 248, 0.3)',
  },
  fuchsia: {
    iconBg: 'rgba(217, 70, 239, 0.08)',
    iconColor: '#E879F9',
    badgeBg: 'rgba(217, 70, 239, 0.08)',
    badgeColor: '#E879F9',
    badgeBorder: 'rgba(217, 70, 239, 0.2)',
    glowColor: 'rgba(217, 70, 239, 0.08)',
    borderHover: 'rgba(217, 70, 239, 0.25)',
  },
  pink: {
    iconBg: 'rgba(244, 114, 182, 0.08)',
    iconColor: '#F472B6',
    badgeBg: 'rgba(244, 114, 182, 0.08)',
    badgeColor: '#F472B6',
    badgeBorder: 'rgba(244, 114, 182, 0.2)',
    glowColor: 'rgba(244, 114, 182, 0.08)',
    borderHover: 'rgba(244, 114, 182, 0.25)',
  },
}

export default function FeatureCard({
  icon: Icon,
  title,
  description,
  badge,
  color = 'violet',
}: FeatureCardProps) {
  const colors = colorMap[color]

  return (
    <div
      className="group relative rounded-2xl p-6 transition-all duration-300 cursor-default overflow-hidden"
      style={{
        background: 'rgba(20, 17, 46, 0.5)',
        border: '1px solid rgba(139, 92, 246, 0.1)',
        backdropFilter: 'blur(12px)',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget
        el.style.background = 'rgba(30, 27, 75, 0.6)'
        el.style.borderColor = colors.borderHover
        el.style.boxShadow = `0 8px 32px rgba(0,0,0,0.3), 0 0 24px ${colors.glowColor}`
        el.style.transform = 'translateY(-2px)'
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget
        el.style.background = 'rgba(20, 17, 46, 0.5)'
        el.style.borderColor = 'rgba(139, 92, 246, 0.1)'
        el.style.boxShadow = ''
        el.style.transform = 'translateY(0)'
      }}
    >
      {/* Background glow on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at 20% 20%, ${colors.glowColor} 0%, transparent 60%)` }}
      />

      {/* Icon */}
      <div
        className="relative w-12 h-12 rounded-xl flex items-center justify-center mb-5"
        style={{
          background: colors.iconBg,
          border: `1px solid ${colors.badgeBorder}`,
          boxShadow: `0 0 12px ${colors.glowColor}`,
        }}
      >
        <Icon className="w-5 h-5" style={{ color: colors.iconColor }} />
      </div>

      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-2.5">
        <h3
          className="font-semibold text-base leading-tight"
          style={{ color: '#E2E0FF' }}
        >
          {title}
        </h3>
        {badge && (
          <span
            className="shrink-0 text-xs px-2.5 py-1 rounded-full font-semibold uppercase tracking-wide"
            style={{
              background: colors.badgeBg,
              color: colors.badgeColor,
              border: `1px solid ${colors.badgeBorder}`,
            }}
          >
            {badge}
          </span>
        )}
      </div>

      <p className="text-sm leading-relaxed" style={{ color: 'rgba(196, 181, 253, 0.6)' }}>
        {description}
      </p>
    </div>
  )
}
