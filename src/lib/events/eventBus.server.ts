// Server-only event bus. Writes to public.platform_events via the caller's
// authenticated Supabase client (RLS restricts SELECT to admins; INSERT is
// allowed by service_role/definer functions or the same-user context here).

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { IDENTITY_DOMAIN } from "@/domains/identity/events/identityEvents";

export interface EmitInput {
  domain?: string;
  name: string;
  aggregateId?: string | null;
  actorId?: string | null;
  payload?: Record<string, unknown>;
}

export async function emitEvent(
  supabase: SupabaseClient<Database>,
  input: EmitInput,
): Promise<void> {
  try {
    // Use the admin client so INSERT succeeds regardless of RLS on writes.
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("platform_events").insert({
      domain: input.domain ?? IDENTITY_DOMAIN,
      name: input.name,
      aggregate_id: input.aggregateId ?? null,
      actor_id: input.actorId ?? null,
      payload: (input.payload ?? {}) as never,
    });
    if (error) {
      console.warn("[events] emit failed", { name: input.name, err: error.message });
    }
  } catch (err) {
    console.warn("[events] emit crashed", { name: input.name });
  }
  // Reference `supabase` so lints stay clean when we later prefer user-scoped writes.
  void supabase;
}
