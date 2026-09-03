import type { IncomingMessage, ServerResponse } from "node:http";
import { GoogleOAuthClient, type GoogleOAuthConfig } from "./googleOAuthClient";
import { OAuthStateStore } from "./googleOAuthCore";
import { AuthProfileStore } from "./authProfileStore";
import { createDefaultProfile, isAuthorizedEmail, normalizeAllowedEmails, profileNeedsSetup, sanitizeProfileInput, SessionStore, type UserProfile } from "./authCore";

const states = new OAuthStateStore();
const sessions = new SessionStore();
const profiles = new AuthProfileStore();

function sendJson(res: ServerResponse, status: number, value: unknown) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(value));
}

function redirect(res: ServerResponse, location: string) {
  res.statusCode = 302;
  res.setHeader("Location", location);
  res.end();
}

function getOAuthConfig(): GoogleOAuthConfig | null {
  const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
  const redirectUri = process.env.AXION_AUTH_REDIRECT_URI || process.env.GOOGLE_OAUTH_REDIRECT_URI || "http://localhost:3000/api/auth/callback";
  return clientId && clientSecret ? { clientId, clientSecret, redirectUri } : null;
}

function getAllowedEmails() {
  return normalizeAllowedEmails(process.env.AXION_AUTH_ALLOWED_EMAILS);
}

function buildAuthUrl(config: GoogleOAuthConfig, state: string) {
  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  url.search = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    response_type: "code",
    scope: "openid email profile",
    state,
  }).toString();
  return url.toString();
}

function parseCookie(req: IncomingMessage, name: string) {
  const cookie = req.headers.cookie || "";
  return cookie.split(";").map((part) => part.trim()).find((part) => part.startsWith(`${name}=`))?.slice(name.length + 1);
}

function setSessionCookie(res: ServerResponse, token: string) {
  res.setHeader("Set-Cookie", `axion_session=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=604800`);
}

function clearSessionCookie(res: ServerResponse) {
  res.setHeader("Set-Cookie", "axion_session=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0");
}

async function readJson(req: IncomingMessage) {
  const chunks: Buffer[] = [];
  for await (const chunk of req) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  return chunks.length ? JSON.parse(Buffer.concat(chunks).toString("utf8")) : {};
}

function publicStatus(req: IncomingMessage) {
  const config = getOAuthConfig();
  const allowedEmails = getAllowedEmails();
  const email = sessions.get(parseCookie(req, "axion_session"));
  const profile = email ? profiles.findByEmail(email) : null;
  return {
    configured: Boolean(config && allowedEmails.length > 0),
    authenticated: Boolean(email),
    email: email || undefined,
    profile,
    profileRequired: Boolean(email && profileNeedsSetup(profile)),
    missingJoaoEmail: true,
  };
}

export async function handleAuthApi(req: IncomingMessage, res: ServerResponse, next: () => void) {
  const url = new URL(req.url || "/", "http://localhost");
  if (!url.pathname.startsWith("/api/auth/")) return next();

  try {
    if (url.pathname === "/api/auth/status" && req.method === "GET") {
      return sendJson(res, 200, publicStatus(req));
    }

    if (url.pathname === "/api/auth/start" && req.method === "GET") {
      const config = getOAuthConfig();
      if (!config || getAllowedEmails().length === 0) return sendJson(res, 503, { error: "Login AXION ainda não está configurado." });
      return redirect(res, buildAuthUrl(config, states.create()));
    }

    if (url.pathname === "/api/auth/callback" && req.method === "GET") {
      const config = getOAuthConfig();
      const code = url.searchParams.get("code");
      const state = url.searchParams.get("state");
      if (!config || !code || !state || !states.consume(state)) return redirect(res, "/?auth=error");
      const client = new GoogleOAuthClient(config);
      const tokens = await client.exchangeAuthorizationCodeForAccess(code);
      const email = (await client.getUserEmail(tokens.accessToken)).toLowerCase();
      if (!isAuthorizedEmail(email, getAllowedEmails())) return redirect(res, "/?auth=unauthorized");
      if (!profiles.findByEmail(email)) profiles.upsert(createDefaultProfile(email));
      setSessionCookie(res, sessions.create(email));
      return redirect(res, "/?auth=success");
    }

    if (url.pathname === "/api/auth/profile" && req.method === "POST") {
      const email = sessions.get(parseCookie(req, "axion_session"));
      if (!email) return sendJson(res, 401, { error: "Sessão inválida." });
      const currentProfile = profiles.findByEmail(email) || createDefaultProfile(email);
      const updated = sanitizeProfileInput(currentProfile, await readJson(req) as Partial<UserProfile>);
      if (profileNeedsSetup(updated)) return sendJson(res, 400, { error: "Nome e função são obrigatórios." });
      profiles.upsert(updated);
      return sendJson(res, 200, { profile: updated, profileRequired: false });
    }

    if (url.pathname === "/api/auth/logout" && req.method === "POST") {
      sessions.clear(parseCookie(req, "axion_session"));
      clearSessionCookie(res);
      return sendJson(res, 200, { ok: true });
    }

    return sendJson(res, 404, { error: "Not found" });
  } catch {
    return sendJson(res, 500, { error: "Não foi possível processar o login AXION." });
  }
}
