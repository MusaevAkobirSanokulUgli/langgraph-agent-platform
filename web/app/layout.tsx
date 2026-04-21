import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'LangGraph Agent Platform',
  description: 'Production-grade multi-agent orchestration platform with LangGraph, human-in-the-loop workflows, and real-time state management',
  keywords: ['LangGraph', 'Multi-agent', 'AI', 'Python', 'FastAPI', 'LLM orchestration'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-zinc-950 text-zinc-100 antialiased">
        {children}
      </body>
    </html>
  )
}
