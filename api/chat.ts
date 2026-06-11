import Anthropic from "@anthropic-ai/sdk";
import { PROFILE_SUMMARY, KNOWLEDGE_PROJECTS } from "../src/data/knowledge";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface VercelLikeRequest {
  method?: string;
  body?: { messages?: unknown };
}

interface VercelLikeResponse {
  status: (code: number) => VercelLikeResponse;
  json: (body: unknown) => void;
  setHeader: (name: string, value: string) => void;
}

const SYSTEM_PROMPT = `You are AJ-Bot, the friendly assistant on Anuj Bansal's portfolio website. You answer questions from recruiters and visitors about Anuj.

Facts about Anuj:
${PROFILE_SUMMARY}

His projects:
${KNOWLEDGE_PROJECTS.map((p) => `- ${p.title}: ${p.summary}`).join("\n")}

Rules:
- Answer only questions about Anuj, his work, skills, and availability. For anything else, politely steer back to Anuj.
- Be concise: 2-4 sentences for simple questions, short bullet lists for broader ones.
- Be warm and professional. If someone seems to be a recruiter, mention he is available immediately and easy to reach at 99anujbansal@gmail.com.
- Never invent facts not listed above. If you don't know, say so and suggest contacting Anuj directly.`;

export default async function handler(
  req: VercelLikeRequest,
  res: VercelLikeResponse
) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    res.status(503).json({ error: "Chat not configured" });
    return;
  }

  const raw = req.body?.messages;
  if (!Array.isArray(raw) || raw.length === 0 || raw.length > 20) {
    res.status(400).json({ error: "Invalid messages" });
    return;
  }

  const messages: ChatMessage[] = [];
  for (const m of raw) {
    if (
      !m ||
      (m.role !== "user" && m.role !== "assistant") ||
      typeof m.content !== "string" ||
      m.content.length === 0 ||
      m.content.length > 1000
    ) {
      res.status(400).json({ error: "Invalid message format" });
      return;
    }
    messages.push({ role: m.role, content: m.content });
  }

  try {
    const client = new Anthropic({ apiKey });
    const response = await client.messages.create({
      model: "claude-opus-4-8",
      max_tokens: 600,
      thinking: { type: "adaptive" },
      output_config: { effort: "low" },
      system: [
        {
          type: "text",
          text: SYSTEM_PROMPT,
          cache_control: { type: "ephemeral" },
        },
      ],
      messages,
    });

    if (response.stop_reason === "refusal") {
      res.status(200).json({
        reply:
          "I'd rather not answer that one — try asking me about Anuj's projects or experience!",
      });
      return;
    }

    const text = response.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("");

    res.status(200).json({ reply: text });
  } catch {
    res.status(502).json({ error: "Upstream error" });
  }
}
