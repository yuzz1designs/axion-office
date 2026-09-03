import assert from "node:assert/strict";
import { mkdtempSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { createDefaultProfile } from "./authCore";
import { AuthProfileStore } from "./authProfileStore";

test("persiste perfis autorizados com permissões restritas", () => {
  const directory = mkdtempSync(join(tmpdir(), "axion-auth-"));
  const store = new AuthProfileStore(directory);
  const profile = { ...createDefaultProfile("nelson@example.com"), name: "Nelson", role: "Founder" };
  store.upsert(profile);
  assert.deepEqual(store.findByEmail("NELSON@example.com"), profile);
  assert.equal(statSync(join(directory, "profiles.json")).mode & 0o777, 0o600);
});
