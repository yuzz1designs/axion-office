import { randomBytes } from "node:crypto";

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: string;
  phone: string;
  avatarUrl: string;
  initials: string;
  accentColor: string;
  axKey: string;
  createdAt: string;
  updatedAt: string;
}

export function generateAxKey() {
  return `AX-${randomBytes(3).toString("hex").toUpperCase()}-${randomBytes(3).toString("hex").toUpperCase()}`;
}

export function createProfile(input: Partial<UserProfile>, axKeyFactory = generateAxKey, now = new Date()): UserProfile {
  const timestamp = now.toISOString();
  const email = String(input.email ?? "").trim().toLowerCase();
  const name = String(input.name ?? "").trim();
  const initials = String(input.initials ?? (name.slice(0, 2) || email.slice(0, 2) || "AX")).trim().slice(0, 4).toUpperCase();
  return {
    id: input.id || randomBytes(16).toString("base64url"),
    email,
    name,
    role: String(input.role ?? "").trim(),
    phone: String(input.phone ?? "").trim(),
    avatarUrl: String(input.avatarUrl ?? "").trim(),
    initials,
    accentColor: String(input.accentColor ?? "amber").trim() || "amber",
    axKey: input.axKey || axKeyFactory(),
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

export function profileNeedsSetup(profile: UserProfile | null) {
  return !profile?.name.trim() || !profile.role.trim() || !profile.email.trim();
}

export function sanitizeProfileInput(profile: UserProfile, input: Partial<UserProfile>, now = new Date()): UserProfile {
  const name = String(input.name ?? profile.name).trim();
  const role = String(input.role ?? profile.role).trim();
  const phone = String(input.phone ?? profile.phone).trim();
  const email = String(input.email ?? profile.email).trim().toLowerCase();
  const avatarUrl = String(input.avatarUrl ?? profile.avatarUrl).trim();
  const initials = String(input.initials ?? profile.initials).trim().slice(0, 4).toUpperCase() || profile.initials;
  const accentColor = String(input.accentColor ?? profile.accentColor).trim() || profile.accentColor;
  return { ...profile, email, name, role, phone, avatarUrl, initials, accentColor, updatedAt: now.toISOString() };
}
