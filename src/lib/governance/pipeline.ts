// Governance kernel — the request pipeline.
//
//   Request -> Authentication -> Authorization -> Validation -> Phase Gate
//           -> Execution -> Audit Log -> Response
//
// Every governed server function runs these steps in this fixed order. Do not
// call domain services from routes directly; go through a governed function.

import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { GovernanceError, type GovernanceSpec, type GovernedContext } from "./types";
import { assertRoles, resolveRoles } from "./authorize";
import { isPhaseEnabled } from "./phaseGate";

function safeMessage(err: unknown): string {
  if (err instanceof GovernanceError) return `${err.code}: ${err.message}`;
  if (err instanceof Error && err.name === "IdentityError") return err.message;
  if (err instanceof Error && err.message && err.message.length < 200) return err.message;
  return "Request failed. Please try again.";
}

/**
 * Build a governed server function. The returned value is a normal
 * `createServerFn` result, so call sites and typing are unchanged.
 */
export function createGovernedFn<TIn, TOut>(
  spec: GovernanceSpec<TIn>,
  exec: (args: { data: TIn; ctx: GovernedContext }) => Promise<TOut>,
) {
  const featureKey = spec.phase ?? `${spec.domain}.${spec.action}`;

  return createServerFn({ method: spec.method ?? "POST" })
    .middleware([requireSupabaseAuth]) // 1. Authentication
    .inputValidator((input: unknown) => {
      // 3. Validation (runs before the handler by design of createServerFn)
      if (!spec.validate) return input as TIn;
      try {
        return spec.validate(input);
      } catch (err) {
        throw new GovernanceError("VALIDATION", safeMessage(err));
      }
    })
    .handler((async ({ data, context }: { data: unknown; context: any }): Promise<TOut> => {
      const supabase = context.supabase as unknown as SupabaseClient<Database>;
      const userId = context.userId;
      const { recordAudit, emitDomainEvent } = await import("./audit.server");

      // 2. Authorization
      const roles = await resolveRoles(supabase, userId);
      try {
        assertRoles(roles, spec.roles);
      } catch (err) {
        await recordAudit({
          domain: spec.domain,
          action: spec.action,
          userId,
          actorId: userId,
          outcome: "denied",
          metadata: { reason: "forbidden", roles },
        });
        throw new Error(safeMessage(err));
      }

      // 4. Phase gate
      if (!isPhaseEnabled(featureKey)) {
        await recordAudit({
          domain: spec.domain,
          action: spec.action,
          userId,
          actorId: userId,
          outcome: "denied",
          metadata: { reason: "phase_gate", featureKey },
        });
        throw new Error(`PHASE_GATE: ${featureKey} is not available yet`);
      }

      const ctx: GovernedContext = {
        supabase,
        userId,
        claims: (context.claims ?? {}) as Record<string, unknown>,
        roles,
        domain: spec.domain,
        action: spec.action,
        audit: (entry) =>
          recordAudit({
            domain: spec.domain,
            action: entry.action,
            userId: entry.userId ?? userId,
            actorId: userId,
            outcome: "success",
            metadata: entry.metadata,
          }),
        emit: (event) =>
          emitDomainEvent({
            domain: spec.domain,
            name: event.name,
            aggregateId: event.aggregateId ?? userId,
            actorId: userId,
            payload: event.payload,
          }),
      };

      // 5. Execution
      try {
        const result = await exec({ data: data as TIn, ctx });

        // 6. Audit log
        if (spec.auditSuccess !== false) {
          await recordAudit({
            domain: spec.domain,
            action: spec.action,
            userId,
            actorId: userId,
            outcome: "success",
          });
        }
        return result;
      } catch (err) {
        console.error(`[governance] ${spec.domain}.${spec.action} failed`, err);
        await recordAudit({
          domain: spec.domain,
          action: spec.action,
          userId,
          actorId: userId,
          outcome: "error",
        });
        throw new Error(safeMessage(err));
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }) as any) as unknown as (opts?: { data: TIn }) => Promise<TOut>;
}
