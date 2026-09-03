import assert from "node:assert/strict";
import test from "node:test";
import { createDefaultProfile, isAuthorizedEmail, normalizeAllowedEmails, profileNeedsSetup } from "./authCore";

test("normaliza emails autorizados e ignora o terceiro em falta", () => {
  assert.deepEqual(normalizeAllowedEmails(" Nelson@Example.com ; eduardo@example.com, "), ["nelson@example.com", "eduardo@example.com"]);
});

test("autoriza apenas emails presentes na lista", () => {
  const allowed = normalizeAllowedEmails("nelson@example.com,eduardo@example.com");
  assert.equal(isAuthorizedEmail("NELSON@example.com", allowed), true);
  assert.equal(isAuthorizedEmail("joao@example.com", allowed), false);
});

test("primeiro login cria perfil pendente de conclusão", () => {
  const profile = createDefaultProfile("nelson@example.com");
  assert.equal(profile.email, "nelson@example.com");
  assert.equal(profileNeedsSetup(profile), true);
});
