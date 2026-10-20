import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

function publicConfig() {
  const url = process.env.VITE_SUPABASE_URL;
  const key = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) throw new Error("Public test configuration is required");
  return { url, key };
}

function testSession() {
  const minted = JSON.parse(
    readFileSync(join(homedir(), ".cache/lovable-auth/session.json"), "utf8"),
  );
  const session = minted.session;
  if (!session?.access_token) throw new Error("A minted test session is required");
  return session;
}

async function checkRole(token?: string) {
  const { url, key } = publicConfig();
  const headers: Record<string, string> = {
    apikey: key,
    "Content-Type": "application/json",
  };
  if (token) headers.Authorization = `Bearer ${token}`;
  const response = await fetch(`${url}/rest/v1/rpc/has_role`, {
    method: "POST",
    headers,
    body: JSON.stringify({ _user_id: null, _role: "support" }),
  });
  expect(response.status).toBe(200);
  expect(await response.json()).toBe(false);
}

describe("has_role execute permissions (read-only integration)", () => {
  it("allows anon to execute public.has_role without granting a role", async () => {
    await checkRole();
  });

  it("allows authenticated to execute public.has_role without granting a role", async () => {
    await checkRole(testSession().access_token);
  });
});