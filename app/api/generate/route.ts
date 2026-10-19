/**
 * REBOOTv2 Pipeline — Vercel Edge Function with Blob storage
 * Place at: app/api/generate/route.ts
 */

import { put } from "@vercel/blob";

export const runtime = "nodejs";
export const maxDuration = 300;

// OpenRouter model id. Override with OPENROUTER_MODEL (e.g. a ":free" model id from
// https://openrouter.ai/models). The old default "deepseek/deepseek-chat-v3-0324:free"
// was removed from OpenRouter.
const DEFAULT_OPENROUTER_MODEL = "deepseek/deepseek-chat";
// Direct DeepSeek API model id. Override with DEEPSEEK_MODEL.
const DEFAULT_DEEPSEEK_MODEL = "deepseek-chat";
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const DEEPSEEK_URL = "https://api.deepseek.com/chat/completions";

async function callLLM(prompt: string, system: string): Promise<string> {
  const openRouterKey = process.env.OPENROUTER_API_KEY;
  const deepseekKey = process.env.DEEPSEEK_API_KEY;
  const key = openRouterKey || deepseekKey;
  if (!key) throw new Error("No API key configured");

  const url = openRouterKey ? OPENROUTER_URL : DEEPSEEK_URL;
  const model = openRouterKey
    ? process.env.OPENROUTER_MODEL || DEFAULT_OPENROUTER_MODEL
    : process.env.DEEPSEEK_MODEL || DEFAULT_DEEPSEEK_MODEL;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://rebootv2.local",
      "X-Title": "REBOOTv2 Pipeline",
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: system || "You are a precise content production assistant." },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`LLM error ${res.status}: ${text}`);
  }
  const data = await res.json() as any;
  return data.choices[0].message.content;
}

function channelSystem(channel: string): string {
  const prompts: Record<string, string> = {
    psychology: `You are the Hope-voice writer for Rebootv2 Psychology. Calm, measured, clinical, observational. Use sensory micro-detail and clear claim boundaries. Banned words: toxic, narcissist, red flag, manipulate, brainwash, secret trick, sneaky. Never invent studies or universal gender/ambition claims. Enforcement actions are allegations until decided. Lanes: First Domino (40-50s), System Glitch (25-35s), Long Essay (7-11+ min).`,
    course: `You are the course writer for Digi-OS. Teaching/operator voice. Python lessons 01-17 and AI Automation lessons 18-41. Clear, practical, offline-first where relevant. Mark demo beats where code or terminal must appear. No hype. No psychology essay voice.`,
    "high-thoughts": `You write only High Thoughts dialogue. Hosts: Steak (measured, dry wit) and Potatoes (bright, sharp). Title format exactly: High Thoughts — [Topic as a question]. 12-15 minute retro cartoon podcast. Both characters always clothed in signature outfits. Peel marketing nonsense, keep useful tools honest, dry humor over outrage. Use speaker labels Steak: and Potatoes: exactly.`,
  };
  return prompts[channel] || prompts.psychology;
}

async function writerStep(channel: string, topic: string, lane?: string, styleNotes?: string) {
  const system = channelSystem(channel);
  const prompt = `Channel: ${channel}\nTopic: ${topic}\nLane: ${lane || "default"}\nStyle notes: ${styleNotes || "none"}\n\nWrite a complete, production-ready script.\nInclude full narration or dialogue (with speaker labels for High Thoughts).\nMark any demo beats or visual notes briefly.\nEnd with: HANDOFF → videomaker-production`;
  return callLLM(prompt, system);
}

async function productionStep(channel: string, script: string) {
  const prompt = `Channel: ${channel}\n\nScript from writer:\n${script}\n\nYou are the production videomaker.\nDeliver:\n1. Scene plan (beat → visual → duration target)\n2. On-screen text / overlay list\n3. Caption / QA notes\n4. Recording checklist\n5. Style notes for this lane\n\nEnd with: HANDOFF → videomaker-packaging\nSCRIPT TOPIC: [one line]`;
  return callLLM(prompt, "You own how the video is shot and finished. Do not rewrite the script meaning.");
}

async function packagingStep(channel: string, script: string, production: string) {
  const prompt = `Channel: ${channel}\n\nScript:\n${script}\n\nProduction notes:\n${production}\n\nYou are the packaging videomaker.\nDeliver:\n1. Title (primary + 2-3 alternates)\n2. Thumbnail text (3-4 words max)\n3. Description (hook + body + chapters if any + disclaimer)\n4. Pinned comment\n5. Tags (8-15)\n6. End-screen suggestion if relevant\n\nEnd with: PIPELINE COMPLETE`;
  return callLLM(prompt, "You own YouTube Studio metadata. Do not rewrite spoken lines.");
}

async function saveToBlob(packageData: any): Promise<string | null> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return null;
  const runId = crypto.randomUUID().slice(0, 8);
  const timestamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d+Z$/, "Z");
  const channel = packageData.channel || "unknown";
  const pathname = `packages/${channel}/${timestamp}-${runId}.json`;
  const blob = await put(pathname, JSON.stringify(packageData, null, 2), {
    access: "public",
    contentType: "application/json",
  });
  return blob.url;
}

export async function POST(req: Request): Promise<Response> {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Request body must be valid JSON" }, { status: 400 });
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return Response.json({ error: "Request body must be a JSON object" }, { status: 400 });
  }

  try {
    const channel = body.channel || "psychology";
    const topic = body.topic || "";
    const lane = body.lane;
    const styleNotes = body.style_notes;
    const steps = body.steps || "full";

    if (!topic) {
      return Response.json({ error: "topic is required" }, { status: 400 });
    }

    const result: any = {
      channel,
      topic,
      steps,
      run_at: new Date().toISOString(),
    };

    if (steps === "writer" || steps === "full") {
      result.script = await writerStep(channel, topic, lane, styleNotes);
    }
    if (steps === "production" || steps === "full") {
      const script = result.script || body.script || "";
      if (!script) return Response.json({ error: "script required for production" }, { status: 400 });
      result.production = await productionStep(channel, script);
    }
    if (steps === "packaging" || steps === "full") {
      const script = result.script || body.script || "";
      const production = result.production || body.production || "";
      if (!script) return Response.json({ error: "script required for packaging" }, { status: 400 });
      result.packaging = await packagingStep(channel, script, production);
    }

    result.status = "WRITING_COMPLETE | MEDIA_NOT_STARTED | PUBLICATION_HOLD";
    result.youtube_video_id = null;

    const blobUrl = await saveToBlob(result);
    if (blobUrl) result.blob_url = blobUrl;

    return Response.json(result);
  } catch (e: any) {
    return Response.json({ error: e.message || String(e) }, { status: 500 });
  }
}

export async function GET(): Promise<Response> {
  return Response.json({ status: "ok", service: "rebootv2-pipeline-vercel-edge" });
}
