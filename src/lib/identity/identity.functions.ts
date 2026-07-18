// Identity — client-callable server functions (transport boundary).

import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import {
  assignRoleSchema,
  listRolesSchema,
  profileUpdateSchema,
  revokeRoleSchema,
  signInEventSchema,
} from "@/domains/identity/validation/schemas";
import type { AppRole } from "@/domains/identity/entities/Role";
import type { Profile, ProfileUpdate } from "@/domains/identity/entities/Profile";
import { IdentityError, toSafeMessage } from "@/domains/identity/errors";

async function buildContext(ctx: { supabase: unknown; userId: string }) {
  const { createProfileRepository, createRoleRepository, createAuditRepository } = await import(
    "@/domains/identity/repositories/supabase.server"
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = ctx.supabase as any;
  return {
    actorId: ctx.userId,
    supabase,
    profiles: createProfileRepository(supabase),
    roles: createRoleRepository(supabase),
    audit: createAuditRepository(supabase),
  };
}

function wrap(err: unknown): never {
  if (err instanceof IdentityError) throw new Error(`${err.code}: ${err.message}`);
  console.error("[identity.functions] unexpected", err);
  throw new Error(toSafeMessage(err));
}

export const getMyProfile = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<Profile> => {
    try {
      const ic = await buildContext(context);
      const { ProfileService } = await import("@/domains/identity/services/IdentityService");
      return await ProfileService.getMe(ic);
    } catch (e) {
      return wrap(e);
    }
  });

export const updateMyProfile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => profileUpdateSchema.parse(input))
  .handler(async ({ context, data }): Promise<Profile> => {
    try {
      const ic = await buildContext(context);
      const { ProfileService } = await import("@/domains/identity/services/IdentityService");
      return await ProfileService.updateMe(ic, data as ProfileUpdate);
    } catch (e) {
      return wrap(e);
    }
  });

export const listUserRoles = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => listRolesSchema.parse(input))
  .handler(async ({ context, data }): Promise<AppRole[]> => {
    try {
      const ic = await buildContext(context);
      const { IdentityService } = await import("@/domains/identity/services/IdentityService");
      return await IdentityService.listRoles(ic, data.userId);
    } catch (e) {
      return wrap(e);
    }
  });

export const assignRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => assignRoleSchema.parse(input))
  .handler(async ({ context, data }): Promise<{ ok: true }> => {
    try {
      const ic = await buildContext(context);
      const { IdentityService } = await import("@/domains/identity/services/IdentityService");
      await IdentityService.assignRole(ic, data.userId, data.role);
      return { ok: true };
    } catch (e) {
      return wrap(e);
    }
  });

export const revokeRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => revokeRoleSchema.parse(input))
  .handler(async ({ context, data }): Promise<{ ok: true }> => {
    try {
      const ic = await buildContext(context);
      const { IdentityService } = await import("@/domains/identity/services/IdentityService");
      await IdentityService.revokeRole(ic, data.userId, data.role);
      return { ok: true };
    } catch (e) {
      return wrap(e);
    }
  });

export const logSignInEvent = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => signInEventSchema.parse(input))
  .handler(async ({ context, data }): Promise<{ ok: true }> => {
    try {
      const ic = await buildContext(context);
      const { IdentityService } = await import("@/domains/identity/services/IdentityService");
      await IdentityService.recordSignIn(ic, data.method, data.provider);
      return { ok: true };
    } catch (e) {
      return wrap(e);
    }
  });

export const recordEmailVerified = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<{ ok: true }> => {
    try {
      const ic = await buildContext(context);
      const { IdentityService } = await import("@/domains/identity/services/IdentityService");
      // Best-effort email fetch from claims.
      const email = (context.claims as { email?: string } | undefined)?.email ?? null;
      await IdentityService.recordVerification(ic, email);
      return { ok: true };
    } catch (e) {
      return wrap(e);
    }
  });
