'use client'

import { Github, Zap, ExternalLink } from 'lucide-react'
import Link from 'next/link'

export default function Header() {
  return (
    <header
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        background: 'rgba(12, 10, 29, 0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(139, 92, 246, 0.12)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.4), 0 0 40px rgba(139, 92, 246, 0.04)',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center relative"
            style={{
              background: 'linear-gradient(135deg, #7C3AED, #A78BFA)',
              boxShadow: '0 0 16px rgba(139, 92, 246, 0.5)',
            }}
          >
            <Zap className="w-4 h-4 text-white" />
            <div
              className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ background: 'rgba(192, 132, 252, 0.2)' }}
            />
          </div>
          <div className="flex items-center gap-2">
            <span
              className="font-bold text-sm tracking-tight"
              style={{ color: '#E2E0FF' }}
            >
              LangGraph<span style={{ color: '#A78BFA' }}> Agent</span>
            </span>
            <span
              className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
              style={{
                background: 'rgba(139, 92, 246, 0.12)',
                color: '#A78BFA',
                border: '1px solid rgba(139, 92, 246, 0.25)',
              }}
            >
              v1.0.0
            </span>
          </div>
        </Link>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {[
            { href: '#architecture', label: 'Architecture' },
            { href: '#agents', label: 'Agents' },
            { href: '#workflow', label: 'Workflow' },
            { href: '#api', label: 'API' },
          ].map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200"
              style={{ color: 'rgba(196, 181, 253, 0.7)' }}
              onMouseEnter={(e) => {
                const el = e.currentTarget
                el.style.color = '#C4B5FD'
                el.style.background = 'rgba(139, 92, 246, 0.08)'
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget
                el.style.color = 'rgba(196, 181, 253, 0.7)'
                el.style.background = 'transparent'
              }}
            >
              {label}
            </a>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Link
            href="/demo"
            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200"
            style={{
              background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.3), rgba(139, 92, 246, 0.2))',
              color: '#C4B5FD',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              boxShadow: '0 0 12px rgba(139, 92, 246, 0.1)',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget
              el.style.background = 'linear-gradient(135deg, rgba(124, 58, 237, 0.45), rgba(139, 92, 246, 0.35))'
              el.style.boxShadow = '0 0 20px rgba(139, 92, 246, 0.25)'
              el.style.borderColor = 'rgba(139, 92, 246, 0.5)'
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget
              el.style.background = 'linear-gradient(135deg, rgba(124, 58, 237, 0.3), rgba(139, 92, 246, 0.2))'
              el.style.boxShadow = '0 0 12px rgba(139, 92, 246, 0.1)'
              el.style.borderColor = 'rgba(139, 92, 246, 0.3)'
            }}
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Live Demo
          </Link>
          <a
            href="https://github.com/MusaevAkobirSanokulUgli/langgraph-agent-platform"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
            style={{
              background: 'rgba(20, 17, 46, 0.8)',
              color: 'rgba(196, 181, 253, 0.7)',
              border: '1px solid rgba(139, 92, 246, 0.15)',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget
              el.style.color = '#C4B5FD'
              el.style.borderColor = 'rgba(139, 92, 246, 0.3)'
              el.style.background = 'rgba(30, 27, 75, 0.5)'
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget
              el.style.color = 'rgba(196, 181, 253, 0.7)'
              el.style.borderColor = 'rgba(139, 92, 246, 0.15)'
              el.style.background = 'rgba(20, 17, 46, 0.8)'
            }}
          >
            <Github className="w-4 h-4" />
            <span className="hidden sm:inline">GitHub</span>
          </a>
        </div>
      </div>
    </header>
  )
}
