import type { IncomingMessage, ServerResponse } from "node:http";
import OpenAI, { toFile } from "openai";
import { AIVA_IDENTITY, AIVA_VOICE_INSTRUCTIONS } from "./aivaIdentity";

const MAX_JSON_BYTES = 64_000;
const MAX_AUDIO_BYTES = 16_000_000;

function sendJson(res: ServerResponse, status: number, value: unknown) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(value));
}

async function readBody(req: IncomingMessage, limit: number) {
  const chunks: Buffer[] = [];
  let size = 0;
  for await (const chunk of req) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    size += buffer.length;
    if (size > limit) throw new Error("PAYLOAD_TOO_LARGE");
    chunks.push(buffer);
  }
  return Buffer.concat(chunks);
}

function getClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  return apiKey ? new OpenAI({ apiKey }) : null;
}

export async function handleAivaApi(req: IncomingMessage, res: ServerResponse, next: () => void) {
  const url = new URL(req.url ?? "/", "http://localhost");
  if (!url.pathname.startsWith("/api/aiva/")) return next();

  if (url.pathname === "/api/aiva/status" && req.method === "GET") {
    return sendJson(res, 200, { configured: Boolean(process.env.OPENAI_API_KEY), provider: "OpenAI", voice: "marin" });
  }

  const client = getClient();
  if (!client) return sendJson(res, 503, { error: "A AIVA ainda precisa da OPENAI_API_KEY no servidor.", code: "AIVA_NOT_CONFIGURED" });

  try {
    if (url.pathname === "/api/aiva/respond" && req.method === "POST") {
      const raw = await readBody(req, MAX_JSON_BYTES);
      const body = JSON.parse(raw.toString("utf8")) as { message?: string; previousResponseId?: string | null };
      const message = body.message?.trim();
      if (!message) return sendJson(res, 400, { error: "A mensagem é obrigatória." });

      const response = await client.responses.create({
        model: process.env.OPENAI_MODEL || "gpt-5.4",
        instructions: AIVA_IDENTITY,
        input: message,
        previous_response_id: body.previousResponseId || undefined,
        store: true,
        max_output_tokens: 700,
        text: { verbosity: "low" },
        safety_identifier: "axion-office-local-user",
      });
      return sendJson(res, 200, { text: response.output_text, responseId: response.id });
    }

    if (url.pathname === "/api/aiva/transcribe" && req.method === "POST") {
      const audio = await readBody(req, MAX_AUDIO_BYTES);
      if (!audio.length) return sendJson(res, 400, { error: "Não foi recebido áudio." });
      const mime = String(req.headers["content-type"] || "audio/webm").split(";")[0];
      const extension = mime.includes("mp4") ? "m4a" : mime.includes("ogg") ? "ogg" : "webm";
      const transcription = await client.audio.transcriptions.create({
        file: await toFile(audio, `aiva-input.${extension}`, { type: mime }),
        model: process.env.OPENAI_TRANSCRIBE_MODEL || "gpt-4o-mini-transcribe",
        language: "pt",
      });
      return sendJson(res, 200, { text: transcription.text });
    }

    if (url.pathname === "/api/aiva/speech" && req.method === "POST") {
      const raw = await readBody(req, MAX_JSON_BYTES);
      const body = JSON.parse(raw.toString("utf8")) as { text?: string };
      const text = body.text?.trim().slice(0, 4000);
      if (!text) return sendJson(res, 400, { error: "O texto é obrigatório." });
      const speech = await client.audio.speech.create({
        model: process.env.OPENAI_TTS_MODEL || "gpt-4o-mini-tts",
        voice: "marin",
        input: text,
        instructions: AIVA_VOICE_INSTRUCTIONS,
        response_format: "mp3",
      });
      const buffer = Buffer.from(await speech.arrayBuffer());
      res.statusCode = 200;
      res.setHeader("Content-Type", "audio/mpeg");
      res.setHeader("Cache-Control", "no-store");
      return res.end(buffer);
    }

    return sendJson(res, 404, { error: "Endpoint AIVA não encontrado." });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro desconhecido";
    console.error("[AIVA API]", message);
    return sendJson(res, message === "PAYLOAD_TOO_LARGE" ? 413 : 500, { error: "Não foi possível concluir o pedido da AIVA." });
  }
}

