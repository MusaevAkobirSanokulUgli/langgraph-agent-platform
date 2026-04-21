import { Zap, Github, ExternalLink } from 'lucide-react'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer
      className="relative section-fade"
      style={{ background: 'rgba(9, 7, 20, 0.95)', borderTop: '1px solid rgba(139, 92, 246, 0.08)' }}
    >
      {/* Top gradient line */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.4), rgba(192, 132, 252, 0.4), transparent)' }}
      />

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-5">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #7C3AED, #A78BFA)',
                  boxShadow: '0 0 20px rgba(139, 92, 246, 0.4)',
                }}
              >
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <span
                  className="font-bold tracking-tight text-sm"
                  style={{ color: '#E2E0FF' }}
                >
                  LangGraph Agent Platform
                </span>
              </div>
            </Link>
            <p className="text-sm leading-relaxed max-w-xs" style={{ color: 'rgba(167, 139, 250, 0.5)' }}>
              Production-grade multi-agent orchestration. Four specialized AI agents collaborate via LangGraph StateGraph with human-in-the-loop checkpoints and real-time WebSocket streaming.
            </p>
            <div className="flex items-center gap-3 mt-5">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                style={{
                  background: 'rgba(30, 27, 75, 0.4)',
                  color: '#A78BFA',
                  border: '1px solid rgba(139, 92, 246, 0.2)',
                }}
              >
                <Github className="w-4 h-4" />
                View Source
              </a>
              <Link
                href="/demo"
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                style={{
                  background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.25), rgba(139, 92, 246, 0.15))',
                  color: '#C4B5FD',
                  border: '1px solid rgba(139, 92, 246, 0.25)',
                }}
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Try Demo
              </Link>
            </div>
          </div>

          {/* Stack */}
          <div>
            <h4
              className="text-xs font-bold mb-4 uppercase tracking-widest"
              style={{ color: '#8B5CF6' }}
            >
              Stack
            </h4>
            <ul className="space-y-2.5">
              {[
                'Python 3.11+ / FastAPI',
                'LangGraph 0.2+ / LangChain',
                'OpenAI GPT-4o',
                'Next.js 14 / Tailwind CSS',
                'Docker / Redis',
                'Pydantic v2',
              ].map((item) => (
                <li
                  key={item}
                  className="text-sm flex items-center gap-2"
                  style={{ color: 'rgba(167, 139, 250, 0.5)' }}
                >
                  <span
                    className="w-1 h-1 rounded-full shrink-0"
                    style={{ background: '#8B5CF6' }}
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Features */}
          <div>
            <h4
              className="text-xs font-bold mb-4 uppercase tracking-widest"
              style={{ color: '#8B5CF6' }}
            >
              Capabilities
            </h4>
            <ul className="space-y-2.5">
              {[
                'Multi-agent collaboration',
                'Human-in-the-loop workflows',
                'Persistent state management',
                'Real-time WebSocket events',
                'Pydantic v2 validation',
                'Conditional graph routing',
              ].map((item) => (
                <li
                  key={item}
                  className="text-sm flex items-center gap-2"
                  style={{ color: 'rgba(167, 139, 250, 0.5)' }}
                >
                  <span
                    className="w-1 h-1 rounded-full shrink-0"
                    style={{ background: '#C084FC' }}
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderTop: '1px solid rgba(139, 92, 246, 0.08)' }}
        >
          <p className="text-xs" style={{ color: 'rgba(139, 92, 246, 0.4)' }}>
            Portfolio project — Senior Python + AI Engineering
          </p>
          <div className="flex items-center gap-4">
            {['Python', 'LangGraph', 'FastAPI', 'OpenAI', 'Docker'].map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-0.5 rounded-full"
                style={{
                  background: 'rgba(139, 92, 246, 0.08)',
                  color: 'rgba(167, 139, 250, 0.5)',
                  border: '1px solid rgba(139, 92, 246, 0.1)',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
