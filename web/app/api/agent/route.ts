import { NextRequest, NextResponse } from "next/server";
import { chatComplete, DeepSeekError } from "@/lib/deepseek";

export const runtime = "nodejs";
export const maxDuration = 180;

type AgentRole = "researcher" | "analyzer" | "writer" | "reviewer";

const ROLE_SYSTEM: Record<AgentRole, string> = {
  researcher: "You are a Research Agent. Given a topic, list the 5 most important facts, context, and angles to explore. Be concise and factual.",
  analyzer: "You are an Analysis Agent. Given research notes, identify the key insights, patterns, contradictions, and decision criteria. Prioritize what matters.",
  writer: "You are a Writing Agent. Given research + analysis, produce a clear, well-structured response (3-5 paragraphs) with a strong lead and concrete detail.",
  reviewer: "You are a Review Agent. Given the draft, critique for accuracy, clarity, bias, and missing points. End with APPROVED or REVISE.",
};

export async function POST(req: NextRequest) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const topic = (body?.topic ?? "").toString().trim();
  if (!topic) return NextResponse.json({ error: "topic required" }, { status: 400 });

  const workflow = (body?.workflow ?? "research").toString();
  const requireHuman = Boolean(body?.requireHumanApproval);

  const steps: { role: AgentRole; status: "ok" | "error"; output: string; latency_ms: number }[] = [];
  let sharedState = `Topic: ${topic}\n\nWorkflow: ${workflow}`;

  const order: AgentRole[] = workflow === "content_creation"
    ? ["researcher", "writer", "reviewer"]
    : workflow === "analysis"
    ? ["researcher", "analyzer", "writer"]
    : workflow === "code_review"
    ? ["analyzer", "reviewer", "writer"]
    : ["researcher", "analyzer", "writer", "reviewer"];

  try {
    for (const role of order) {
      const t0 = Date.now();
      const r = await chatComplete(
        [
          { role: "system", content: ROLE_SYSTEM[role] },
          { role: "user", content: sharedState },
        ],
        { temperature: role === "reviewer" ? 0.2 : 0.6, max_tokens: 500 }
      );
      steps.push({ role, status: "ok", output: r.content, latency_ms: Date.now() - t0 });
      sharedState = `${sharedState}\n\n[${role.toUpperCase()} OUTPUT]\n${r.content}`;
    }

    const approved = /APPROVED/i.test(steps[steps.length - 1]?.output ?? "");
    return NextResponse.json({
      topic,
      workflow,
      steps,
      final_output: steps.find((s) => s.role === "writer")?.output ?? steps[steps.length - 1]?.output,
      requires_human: requireHuman && !approved,
      approved,
      total_latency_ms: steps.reduce((s, x) => s + x.latency_ms, 0),
    });
  } catch (e) {
    if (e instanceof DeepSeekError) return NextResponse.json({ error: e.message, partial_steps: steps }, { status: e.status });
    return NextResponse.json({ error: (e as Error).message, partial_steps: steps }, { status: 500 });
  }
}
