"use client";

import { useState } from "react";
import { Loader2, Search, BarChart2, PenTool, CheckCircle, User, Play, AlertTriangle } from "lucide-react";

const inputStyle: React.CSSProperties = {
  backgroundColor: "rgba(15,23,42,0.8)",
  border: "1px solid rgba(99,102,241,0.25)",
  color: "#F1F5F9",
  borderRadius: 10,
  padding: "10px 14px",
  fontSize: 14,
  width: "100%",
};

const WORKFLOWS = [
  { value: "research",        label: "Research",         agents: 4 },
  { value: "analysis",        label: "Analysis",         agents: 3 },
  { value: "content_creation",label: "Content Creation", agents: 3 },
  { value: "code_review",     label: "Code Review",      agents: 3 },
];

const ROLE_ICONS: Record<string, React.ReactNode> = {
  researcher: <Search className="w-4 h-4" />,
  analyzer:   <BarChart2 className="w-4 h-4" />,
  writer:     <PenTool className="w-4 h-4" />,
  reviewer:   <CheckCircle className="w-4 h-4" />,
};

export default function LiveAgentRun() {
  const [topic, setTopic] = useState("");
  const [workflow, setWorkflow] = useState("research");
  const [humanApproval, setHumanApproval] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const run = async () => {
    if (!topic.trim() || loading) return;
    setLoading(true); setError(null); setResult(null);
    try {
      const r = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, workflow, requireHumanApproval: humanApproval }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || `HTTP ${r.status}`);
      setResult(data);
    } catch (e) { setError((e as Error).message); }
    finally { setLoading(false); }
  };

  return (
    <div className="rounded-2xl p-6 space-y-5" style={{ backgroundColor: "rgba(15,23,42,0.6)", border: "1px solid rgba(99,102,241,0.2)" }}>
      <div>
        <label className="text-xs font-bold uppercase tracking-wider mb-2 block" style={{ color: "#64748B" }}>
          Topic yoki topshiriq (ozingiz yozing)
        </label>
        <textarea value={topic} onChange={(e) => setTopic(e.target.value)} rows={3}
          placeholder="Masalan: Python asyncio vs threading — qachon qaysi birini ishlatish kerak?"
          style={{ ...inputStyle, resize: "vertical" }} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-bold uppercase tracking-wider mb-2 block" style={{ color: "#64748B" }}>Workflow</label>
          <select value={workflow} onChange={(e) => setWorkflow(e.target.value)}
            style={{ ...inputStyle, padding: "8px 36px 8px 12px" }}>
            {WORKFLOWS.map((w) => <option key={w.value} value={w.value}>{w.label} ({w.agents} agents)</option>)}
          </select>
        </div>
        <div className="flex items-end">
          <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: "#94A3B8" }}>
            <input type="checkbox" checked={humanApproval} onChange={(e) => setHumanApproval(e.target.checked)} />
            Human-in-the-loop (approval kutish)
          </label>
        </div>
      </div>

      <button onClick={run} disabled={loading || !topic.trim()}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm"
        style={{
          background: loading ? "rgba(99,102,241,0.2)" : "linear-gradient(135deg, #6366F1, #8B5CF6)",
          color: "#F1F5F9",
        }}>
        {loading ? <><Loader2 className="animate-spin w-4 h-4" /> Agents ishlayapti...</> : <><Play className="w-4 h-4" /> Run Workflow</>}
      </button>

      {error && (
        <div className="flex items-start gap-2 p-3 rounded-xl text-sm"
          style={{ backgroundColor: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#FCA5A5" }}>
          <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />{error}
        </div>
      )}

      {result && (
        <div className="space-y-4">
          <div className="p-3 rounded-xl flex items-center justify-between"
            style={{ backgroundColor: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.25)" }}>
            <span className="text-sm font-bold" style={{ color: "#A5B4FC" }}>{result.workflow}</span>
            <span className="text-xs" style={{ color: "#94A3B8" }}>
              {result.steps.length} agents · {result.total_latency_ms}ms · {result.approved ? "APPROVED" : "REVISE"}
            </span>
          </div>

          {result.requires_human && (
            <div className="p-4 rounded-xl flex items-center gap-3"
              style={{ backgroundColor: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.3)" }}>
              <User className="w-5 h-5" style={{ color: "#F59E0B" }} />
              <div>
                <div className="text-sm font-bold" style={{ color: "#FBBF24" }}>Human Approval Required</div>
                <div className="text-xs" style={{ color: "#94A3B8" }}>Reviewer returned REVISE — your review is needed</div>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {(result.steps as any[]).map((s, i) => (
              <div key={i} className="rounded-xl p-4" style={{ backgroundColor: "rgba(15,23,42,0.8)", border: "1px solid rgba(99,102,241,0.15)" }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded" style={{ backgroundColor: "rgba(99,102,241,0.15)", color: "#A5B4FC" }}>
                      {ROLE_ICONS[s.role]}
                    </span>
                    <span className="text-sm font-bold uppercase" style={{ color: "#C7D2FE" }}>{s.role}</span>
                  </div>
                  <span className="text-xs" style={{ color: "#64748B" }}>{s.latency_ms}ms</span>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "#CBD5E1", whiteSpace: "pre-wrap" }}>{s.output}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
