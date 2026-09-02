import type { IncomingMessage, ServerResponse } from "node:http";
import { createSign } from "node:crypto";
import { readFileSync } from "node:fs";

const SHEET_ID = process.env.GOOGLE_SHEETS_ID || "1YauPqJGJonmCE28DwpqWchO-SV2IffzQ1ORc7KtH54k";
const TOKEN_URL = "https://oauth2.googleapis.com/token";
const SHEETS_SCOPE = "https://www.googleapis.com/auth/spreadsheets";
const MAX_BODY_BYTES = 64_000;

export interface CrmCompany {
  id: string;
  company: string;
  website: string;
  sector: string;
  country: string;
  city: string;
  source: string;
  idealFit: string;
  priority: string;
  owner: string;
  leadStatus: string;
  createdAt: string;
  lastContact: string;
  nextAction: string;
  serviceInterest: string;
  estimatedMonthlyValue: string;
  notes: string;
}

type ServiceAccount = { client_email: string; private_key: string };

function sendJson(res: ServerResponse, status: number, value: unknown) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(value));
}

async function readJson(req: IncomingMessage) {
  const chunks: Buffer[] = [];
  let size = 0;
  for await (const chunk of req) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    size += buffer.length;
    if (size > MAX_BODY_BYTES) throw new Error("PAYLOAD_TOO_LARGE");
    chunks.push(buffer);
  }
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

function getServiceAccount(): ServiceAccount | null {
  const credentialsFile = process.env.GOOGLE_SERVICE_ACCOUNT_FILE;
  if (credentialsFile) {
    const parsed = JSON.parse(readFileSync(credentialsFile, "utf8")) as ServiceAccount;
    return parsed.client_email && parsed.private_key ? parsed : null;
  }
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  return clientEmail && privateKey ? { client_email: clientEmail, private_key: privateKey } : null;
}

function base64Url(value: string | Buffer) {
  return Buffer.from(value).toString("base64url");
}

async function getAccessToken(credentials: ServiceAccount) {
  const now = Math.floor(Date.now() / 1000);
  const header = base64Url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const payload = base64Url(JSON.stringify({
    iss: credentials.client_email,
    scope: SHEETS_SCOPE,
    aud: TOKEN_URL,
    iat: now,
    exp: now + 3600,
  }));
  const unsignedToken = `${header}.${payload}`;
  const signer = createSign("RSA-SHA256");
  signer.update(unsignedToken);
  const assertion = `${unsignedToken}.${base64Url(signer.sign(credentials.private_key))}`;
  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion }),
  });
  const result = await response.json() as { access_token?: string; error_description?: string };
  if (!response.ok || !result.access_token) throw new Error(result.error_description || "GOOGLE_AUTH_FAILED");
  return result.access_token;
}

function rowToCompany(row: unknown[]): CrmCompany {
  const values = Array.from({ length: 17 }, (_, index) => String(row[index] ?? ""));
  return {
    id: values[0], company: values[1], website: values[2], sector: values[3], country: values[4],
    city: values[5], source: values[6], idealFit: values[7], priority: values[8], owner: values[9],
    leadStatus: values[10], createdAt: values[11], lastContact: values[12], nextAction: values[13],
    serviceInterest: values[14], estimatedMonthlyValue: values[15], notes: values[16],
  };
}

function companyToRow(company: CrmCompany) {
  return [company.id, company.company, company.website, company.sector, company.country, company.city,
    company.source, company.idealFit, company.priority, company.owner, company.leadStatus, company.createdAt,
    company.lastContact, company.nextAction, company.serviceInterest, company.estimatedMonthlyValue, company.notes];
}

async function sheetsRequest(path: string, init: RequestInit = {}) {
  const credentials = getServiceAccount();
  if (!credentials) throw new Error("GOOGLE_SHEETS_NOT_CONFIGURED");
  const token = await getAccessToken(credentials);
  const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", ...init.headers },
  });
  const result = await response.json();
  if (!response.ok) throw new Error((result as { error?: { message?: string } }).error?.message || "GOOGLE_SHEETS_REQUEST_FAILED");
  return result;
}

async function listCompanies() {
  const result = await sheetsRequest(`/values/${encodeURIComponent("Empresas!A2:Q501")}`) as { values?: unknown[][] };
  return (result.values || []).map(rowToCompany).filter((company) => company.id || company.company);
}

export async function handleGoogleSheetsApi(req: IncomingMessage, res: ServerResponse, next: () => void) {
  const url = new URL(req.url ?? "/", "http://localhost");
  if (!url.pathname.startsWith("/api/crm/")) return next();

  try {
    if (url.pathname === "/api/crm/status" && req.method === "GET") {
      return sendJson(res, 200, { configured: Boolean(getServiceAccount()), sheetId: SHEET_ID });
    }
    if (url.pathname === "/api/crm/companies" && req.method === "GET") {
      const companies = await listCompanies();
      return sendJson(res, 200, { companies, syncedAt: new Date().toISOString() });
    }
    if (url.pathname === "/api/crm/companies" && req.method === "POST") {
      const company = await readJson(req) as CrmCompany;
      if (!company.company?.trim()) return sendJson(res, 400, { error: "O nome da empresa é obrigatório." });
      const companies = await listCompanies();
      company.id ||= `CP-${String(companies.length + 1).padStart(3, "0")}`;
      await sheetsRequest(`/values/${encodeURIComponent("Empresas!A:Q")}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`, {
        method: "POST", body: JSON.stringify({ values: [companyToRow(company)] }),
      });
      return sendJson(res, 201, { company });
    }
    const match = url.pathname.match(/^\/api\/crm\/companies\/([^/]+)$/);
    if (match && req.method === "PUT") {
      const id = decodeURIComponent(match[1]);
      const company = await readJson(req) as CrmCompany;
      const companies = await listCompanies();
      const rowIndex = companies.findIndex((item) => item.id === id);
      if (rowIndex < 0) return sendJson(res, 404, { error: "Empresa não encontrada." });
      company.id = id;
      const sheetRow = rowIndex + 2;
      await sheetsRequest(`/values/${encodeURIComponent(`Empresas!A${sheetRow}:Q${sheetRow}`)}?valueInputOption=USER_ENTERED`, {
        method: "PUT", body: JSON.stringify({ values: [companyToRow(company)] }),
      });
      return sendJson(res, 200, { company });
    }
    return sendJson(res, 404, { error: "Endpoint CRM não encontrado." });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro desconhecido";
    console.error("[GOOGLE SHEETS API]", message);
    const status = message === "GOOGLE_SHEETS_NOT_CONFIGURED" ? 503 : message === "PAYLOAD_TOO_LARGE" ? 413 : 500;
    return sendJson(res, status, { error: status === 503 ? "A integração Google Sheets ainda não está configurada no servidor." : "Não foi possível sincronizar o CRM.", detail: message });
  }
}
