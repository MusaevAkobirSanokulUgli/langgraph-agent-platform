'use client'

import { Github, ExternalLink, Terminal } from 'lucide-react'

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-800/60 backdrop-blur-xl bg-zinc-950/80">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-500 to-violet-600 flex items-center justify-center">
            <Terminal className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-white tracking-tight">
            LangGraph Agent Platform
          </span>
          <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-sky-500/10 text-sky-400 border border-sky-500/20">
            v1.0.0
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm text-zinc-400">
          <a href="#architecture" className="hover:text-white transition-colors">Architecture</a>
          <a href="#agents" className="hover:text-white transition-colors">Agents</a>
          <a href="#workflow" className="hover:text-white transition-colors">Workflow</a>
          <a href="#api" className="hover:text-white transition-colors">API</a>
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="#demo"
            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20 text-sm font-medium hover:bg-sky-500/20 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Live Demo
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-800 text-zinc-300 border border-zinc-700 text-sm font-medium hover:bg-zinc-700 transition-colors"
          >
            <Github className="w-4 h-4" />
            <span className="hidden sm:inline">GitHub</span>
          </a>
        </div>
      </div>
    </header>
  )
}
