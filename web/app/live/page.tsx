import Link from "next/link";
import Header from "@/components/Header";
import LiveAgentRun from "@/components/LiveAgentRun";
import { ArrowLeft, Flame } from "lucide-react";

export const metadata = {
  title: "Live Demo — LangGraph Agent Platform",
  description: "Real multi-agent workflows powered by DeepSeek.",
};

export default function LivePage() {
  return (
    <div className="min-h-screen bg-[#0F172A]">
      <Header />
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-5xl mx-auto">
          <Link href="/demo" className="inline-flex items-center gap-2 text-sm mb-6" style={{ color: "#64748B" }}>
            <ArrowLeft className="w-4 h-4" /> Back to Workflow Demo
          </Link>

          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4"
              style={{ backgroundColor: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", color: "#A5B4FC" }}>
              <Flame className="w-3 h-3" /> Live DeepSeek-Powered Workflow
            </div>
            <h1 className="text-3xl sm:text-4xl font-black mb-3" style={{ color: "#F1F5F9" }}>
              Real Multi-Agent Orchestration
            </h1>
            <p className="text-sm max-w-2xl" style={{ color: "#94A3B8" }}>
              Research → Analysis → Writing → Review. Har bir agent DeepSeek (deepseek-chat) orqali ishlaydi.
              State agentlar o'rtasida uzatiladi, oxirgi reviewer APPROVED/REVISE qaytaradi.
            </p>
          </div>

          <LiveAgentRun />
        </div>
      </main>
    </div>
  );
}
