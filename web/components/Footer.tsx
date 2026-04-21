import { Terminal, Github } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-zinc-800/60 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-500 to-violet-600 flex items-center justify-center">
                <Terminal className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-white">LangGraph Agent Platform</span>
            </div>
            <p className="text-sm text-zinc-500 leading-relaxed">
              Production-grade multi-agent orchestration with LangGraph, real-time state management, and human-in-the-loop workflows.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-zinc-300 mb-3 uppercase tracking-wider">Stack</h4>
            <ul className="space-y-2 text-sm text-zinc-500">
              <li>Python 3.11+ / FastAPI</li>
              <li>LangGraph / LangChain</li>
              <li>OpenAI GPT-4o</li>
              <li>Next.js 14 / Tailwind CSS</li>
              <li>Docker / Redis</li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-zinc-300 mb-3 uppercase tracking-wider">Features</h4>
            <ul className="space-y-2 text-sm text-zinc-500">
              <li>Multi-agent collaboration</li>
              <li>Human-in-the-loop workflows</li>
              <li>Persistent state management</li>
              <li>Real-time WebSocket updates</li>
              <li>Pydantic v2 validation</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-zinc-800/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-zinc-600">
            Built as a portfolio project demonstrating Senior Python + AI Engineering skills
          </p>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            <Github className="w-4 h-4" />
            View Source
          </a>
        </div>
      </div>
    </footer>
  )
}
