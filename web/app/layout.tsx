import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'LangGraph Agent Platform — Multi-Agent AI Orchestration',
  description: 'Production-grade multi-agent orchestration platform powered by LangGraph StateGraph, human-in-the-loop workflows, and real-time WebSocket streaming.',
  keywords: ['LangGraph', 'Multi-agent', 'AI Orchestration', 'Python', 'FastAPI', 'LLM', 'StateGraph', 'Human-in-the-loop'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased" style={{ background: '#0C0A1D', color: '#E2E0FF', minHeight: '100vh' }}>
        {children}
      </body>
    </html>
  )
}
