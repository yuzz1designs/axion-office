import assert from "node:assert/strict";
import test from "node:test";
import { createProfile, profileNeedsSetup, sanitizeProfileInput } from "./authCore";

test("cria perfil com email associado e AX KEY visível", () => {
  const profile = createProfile({ email: " Nelson@Example.com ", name: "Nelson", role: "Founder" }, () => "AX-TEST-123");
  assert.equal(profile.email, "nelson@example.com");
  assert.equal(profile.axKey, "AX-TEST-123");
  assert.equal(profileNeedsSetup(profile), false);
});

test("perfil precisa de nome, função e email", () => {
  const profile = createProfile({ email: "", name: "", role: "" }, () => "AX-TEST-123");
  assert.equal(profileNeedsSetup(profile), true);
});

test("sanitiza edição sem trocar a AX KEY", () => {
  const profile = createProfile({ email: "nelson@example.com", name: "Nelson", role: "Founder" }, () => "AX-TEST-123");
  const updated = sanitizeProfileInput(profile, { name: " Nelson Afonso ", axKey: "AX-HACK" } as never);
  assert.equal(updated.name, "Nelson Afonso");
  assert.equal(updated.axKey, "AX-TEST-123");
});
