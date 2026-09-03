import { randomBytes } from "node:crypto";

export interface UserProfile {
  email: string;
  name: string;
  role: string;
  phone: string;
  initials: string;
  accentColor: string;
  createdAt: string;
  updatedAt: string;
}

export function normalizeAllowedEmails(value = "") {
  return value
    .split(/[;,]/)
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function isAuthorizedEmail(email: string, allowedEmails: string[]) {
  return allowedEmails.includes(email.trim().toLowerCase());
}

export function createDefaultProfile(email: string, now = new Date()): UserProfile {
  const normalizedEmail = email.trim().toLowerCase();
  const timestamp = now.toISOString();
  return {
    email: normalizedEmail,
    name: "",
    role: "",
    phone: "",
    initials: normalizedEmail.slice(0, 2).toUpperCase(),
    accentColor: "amber",
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

export function profileNeedsSetup(profile: UserProfile | null) {
  return !profile?.name.trim() || !profile.role.trim();
}

export function sanitizeProfileInput(profile: UserProfile, input: Partial<UserProfile>, now = new Date()): UserProfile {
  const name = String(input.name ?? profile.name).trim();
  const role = String(input.role ?? profile.role).trim();
  const phone = String(input.phone ?? profile.phone).trim();
  const initials = String(input.initials ?? profile.initials).trim().slice(0, 4).toUpperCase() || profile.initials;
  const accentColor = String(input.accentColor ?? profile.accentColor).trim() || profile.accentColor;
  return { ...profile, name, role, phone, initials, accentColor, updatedAt: now.toISOString() };
}

export class SessionStore {
  private readonly sessions = new Map<string, { email: string; expiresAt: number }>();

  constructor(private readonly now: () => number = Date.now, private readonly ttlMs = 7 * 24 * 60 * 60 * 1000) {}

  create(email: string) {
    const token = randomBytes(32).toString("base64url");
    this.sessions.set(token, { email: email.trim().toLowerCase(), expiresAt: this.now() + this.ttlMs });
    return token;
  }

  get(token: string | undefined) {
    if (!token) return null;
    const session = this.sessions.get(token);
    if (!session || session.expiresAt < this.now()) {
      if (session) this.sessions.delete(token);
      return null;
    }
    return session.email;
  }

  clear(token: string | undefined) {
    if (token) this.sessions.delete(token);
  }
}
