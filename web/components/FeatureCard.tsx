import { LucideIcon } from 'lucide-react'

interface FeatureCardProps {
  icon: LucideIcon
  title: string
  description: string
  badge?: string
  color?: 'sky' | 'violet' | 'emerald' | 'amber' | 'rose'
}

const colorMap = {
  sky: {
    icon: 'from-sky-500/20 to-sky-500/5 text-sky-400',
    badge: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
    border: 'hover:border-sky-500/30',
  },
  violet: {
    icon: 'from-violet-500/20 to-violet-500/5 text-violet-400',
    badge: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
    border: 'hover:border-violet-500/30',
  },
  emerald: {
    icon: 'from-emerald-500/20 to-emerald-500/5 text-emerald-400',
    badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    border: 'hover:border-emerald-500/30',
  },
  amber: {
    icon: 'from-amber-500/20 to-amber-500/5 text-amber-400',
    badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    border: 'hover:border-amber-500/30',
  },
  rose: {
    icon: 'from-rose-500/20 to-rose-500/5 text-rose-400',
    badge: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    border: 'hover:border-rose-500/30',
  },
}

export default function FeatureCard({
  icon: Icon,
  title,
  description,
  badge,
  color = 'sky',
}: FeatureCardProps) {
  const colors = colorMap[color]

  return (
    <div
      className={`glass rounded-xl p-6 transition-all duration-300 hover:bg-white/[0.04] border border-transparent ${colors.border} group`}
    >
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colors.icon} flex items-center justify-center mb-4`}>
        <Icon className="w-6 h-6" />
      </div>
      <div className="flex items-start justify-between gap-3 mb-2">
        <h3 className="font-semibold text-white text-lg leading-tight">{title}</h3>
        {badge && (
          <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full border font-medium ${colors.badge}`}>
            {badge}
          </span>
        )}
      </div>
      <p className="text-sm text-zinc-400 leading-relaxed">{description}</p>
    </div>
  )
}
