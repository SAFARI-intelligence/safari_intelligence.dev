// Governance kernel — audit + event emission (server-only).
//
// Audit rows are written with the service-role client so that the audit trail
// cannot be suppressed by RLS or by the caller's own privileges.

import type { Domain } from "./types";

export interface AuditEntry {
  domain: Domain;
  action: string;
  userId: string;
  actorId: string;
  outcome: "success" | "denied" | "error";
  metadata?: Record<string, unknown>;
}

export async function recordAudit(entry: AuditEntry): Promise<void> {
  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("identity_audit_log").insert({
      user_id: entry.userId,
      actor_id: entry.actorId,
      action: `${entry.domain}.${entry.action}`,
      metadata: {
        outcome: entry.outcome,
        ...(entry.metadata ?? {}),
      } as never,
    });
    if (error) {
      console.warn("[governance] audit insert failed", { action: entry.action, err: error.message });
    }
  } catch {
    console.warn("[governance] audit crashed", { action: entry.action });
  }
}

export async function emitDomainEvent(input: {
  domain: Domain;
  name: string;
  aggregateId?: string | null;
  actorId?: string | null;
  payload?: Record<string, unknown>;
}): Promise<void> {
  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("platform_events").insert({
      domain: input.domain,
      name: input.name,
      aggregate_id: input.aggregateId ?? null,
      actor_id: input.actorId ?? null,
      payload: (input.payload ?? {}) as never,
    });
    if (error) {
      console.warn("[governance] event insert failed", { name: input.name, err: error.message });
    }
  } catch {
    console.warn("[governance] event crashed", { name: input.name });
  }
}
