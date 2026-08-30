// Governance kernel — shared types (client-safe: types only, no I/O).

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import type { AppRole } from "@/domains/identity/entities/Role";

/** Domains recognised by the SAFARI V4 architecture. */
export const DOMAINS = [
  "identity",
  "tourism",
  "parks",
  "wildlife",
  "wis",
  "conservation",
  "research",
  "booking",
  "commerce",
  "notifications",
  "analytics",
  "ai",
] as const;

export type Domain = (typeof DOMAINS)[number];

/** Context handed to a governed handler after the pipeline has run. */
export interface GovernedContext {
  /** Supabase client scoped to the caller (RLS applies as that user). */
  supabase: SupabaseClient<Database>;
  /** Authenticated caller id. */
  userId: string;
  /** Verified JWT claims. */
  claims: Record<string, unknown>;
  /** Roles resolved for the caller (normalised to the new domain values). */
  roles: AppRole[];
  /** Domain + action of the current request, for audit/event correlation. */
  domain: Domain;
  action: string;
  /** Emit an extra audit record from inside a handler. */
  audit: (entry: { action: string; userId?: string; metadata?: Record<string, unknown> }) => Promise<void>;
  /** Emit a domain event onto the platform event log. */
  emit: (event: { name: string; aggregateId?: string | null; payload?: Record<string, unknown> }) => Promise<void>;
}

export interface GovernanceSpec<TIn> {
  domain: Domain;
  /** Stable action name, e.g. "profile.update". Used for phase gate + audit. */
  action: string;
  method?: "GET" | "POST";
  /** Roles allowed to call this action. Omit for any authenticated user. */
  roles?: AppRole[];
  /** Validation step. Receives the raw client input. */
  validate?: (input: unknown) => TIn;
  /** Phase-gate feature key. Defaults to `${domain}.${action}`. */
  phase?: string;
  /** Write an audit row after a successful execution. Default true. */
  auditSuccess?: boolean;
}

export class GovernanceError extends Error {
  constructor(
    readonly code: "UNAUTHENTICATED" | "FORBIDDEN" | "VALIDATION" | "PHASE_GATE" | "INTERNAL",
    message: string,
  ) {
    super(message);
    this.name = "GovernanceError";
  }
}
