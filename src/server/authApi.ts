import type { IncomingMessage, ServerResponse } from "node:http";
import { AuthProfileStore } from "./authProfileStore";
import { createProfile, profileNeedsSetup, sanitizeProfileInput, type UserProfile } from "./authCore";

const profiles = new AuthProfileStore();

function sendJson(res: ServerResponse, status: number, value: unknown) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(value));
}

function parseCookie(req: IncomingMessage, name: string) {
  const cookie = req.headers.cookie || "";
  return cookie.split(";").map((part) => part.trim()).find((part) => part.startsWith(`${name}=`))?.slice(name.length + 1);
}

function setProfileCookie(res: ServerResponse, profileId: string) {
  res.setHeader("Set-Cookie", `axion_profile=${profileId}; HttpOnly; SameSite=Lax; Path=/; Max-Age=31536000`);
}

function clearProfileCookie(res: ServerResponse) {
  res.setHeader("Set-Cookie", "axion_profile=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0");
}

async function readJson(req: IncomingMessage) {
  const chunks: Buffer[] = [];
  for await (const chunk of req) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  return chunks.length ? JSON.parse(Buffer.concat(chunks).toString("utf8")) : {};
}

function publicStatus(req: IncomingMessage) {
  const profile = profiles.findById(parseCookie(req, "axion_profile") || "");
  return {
    hasProfile: Boolean(profile && !profileNeedsSetup(profile)),
    profile,
    profileRequired: !profile || profileNeedsSetup(profile),
  };
}

export async function handleAuthApi(req: IncomingMessage, res: ServerResponse, next: () => void) {
  const url = new URL(req.url || "/", "http://localhost");
  if (!url.pathname.startsWith("/api/profile/")) return next();

  try {
    if (url.pathname === "/api/profile/status" && req.method === "GET") {
      return sendJson(res, 200, publicStatus(req));
    }

    if (url.pathname === "/api/profile/create" && req.method === "POST") {
      const existing = profiles.findById(parseCookie(req, "axion_profile") || "");
      const input = await readJson(req) as Partial<UserProfile>;
      const profile = existing
        ? sanitizeProfileInput(existing, input)
        : createProfile(input);
      if (profileNeedsSetup(profile)) return sendJson(res, 400, { error: "Nome, função e email são obrigatórios." });
      profiles.upsert(profile);
      setProfileCookie(res, profile.id);
      return sendJson(res, 200, { profile, axKey: profile.axKey, profileRequired: false });
    }

    if (url.pathname === "/api/profile/reset-session" && req.method === "POST") {
      clearProfileCookie(res);
      return sendJson(res, 200, { ok: true });
    }

    return sendJson(res, 404, { error: "Not found" });
  } catch {
    return sendJson(res, 500, { error: "Não foi possível processar o perfil AXION." });
  }
}
