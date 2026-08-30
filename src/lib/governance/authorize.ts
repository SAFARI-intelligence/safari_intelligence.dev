// Governance kernel — authorization step.

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { normalizeRoles, type AppRole } from "@/domains/identity/entities/Role";
import { GovernanceError } from "./types";

/** Resolve the caller's roles through the RLS-safe `get_user_roles` RPC. */
export async function resolveRoles(
  supabase: SupabaseClient<Database>,
  userId: string,
): Promise<AppRole[]> {
  const { data, error } = await supabase.rpc("get_user_roles", { _user_id: userId });
  if (error) return [];
  const raw = (data ?? []) as unknown[];
  return normalizeRoles(
    raw.map((r) => (typeof r === "string" ? r : (r as { role?: string })?.role)),
  );
}

/**
 * Enforce that the caller holds at least one of `allowed`.
 * `admin` always passes — it is the platform super-role.
 */
export function assertRoles(roles: AppRole[], allowed?: AppRole[]): void {
  if (!allowed || allowed.length === 0) return;
  if (roles.includes("admin")) return;
  if (roles.some((r) => allowed.includes(r))) return;
  throw new GovernanceError("FORBIDDEN", `Requires role: ${allowed.join(" or ")}`);
}
