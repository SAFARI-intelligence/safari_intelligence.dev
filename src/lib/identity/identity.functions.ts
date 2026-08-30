// Identity — client-callable server functions (transport boundary).
//
// Every function below runs through the governance pipeline:
// Authentication -> Authorization -> Validation -> Phase Gate -> Execution -> Audit.

import { createGovernedFn } from "@/lib/governance";
import type { GovernedContext } from "@/lib/governance";
import {
  assignRoleSchema,
  listRolesSchema,
  profileUpdateSchema,
  revokeRoleSchema,
  signInEventSchema,
} from "@/domains/identity/validation/schemas";
import type { AppRole } from "@/domains/identity/entities/Role";
import type { Profile, ProfileUpdate } from "@/domains/identity/entities/Profile";

async function buildContext(ctx: GovernedContext) {
  const { createProfileRepository, createRoleRepository, createAuditRepository } = await import(
    "@/domains/identity/repositories/supabase.server"
  );
  const supabase = ctx.supabase;
  return {
    actorId: ctx.userId,
    supabase,
    profiles: createProfileRepository(supabase),
    roles: createRoleRepository(supabase),
    audit: createAuditRepository(supabase),
  };
}

export const getMyProfile = createGovernedFn(
  { domain: "identity", action: "profile.read", method: "GET", auditSuccess: false },
  async ({ ctx }): Promise<Profile> => {
    const ic = await buildContext(ctx);
    const { ProfileService } = await import("@/domains/identity/services/IdentityService");
    return ProfileService.getMe(ic);
  },
);

export const updateMyProfile = createGovernedFn(
  {
    domain: "identity",
    action: "profile.update",
    validate: (input: unknown) => profileUpdateSchema.parse(input) as ProfileUpdate,
  },
  async ({ data, ctx }): Promise<Profile> => {
    const ic = await buildContext(ctx);
    const { ProfileService } = await import("@/domains/identity/services/IdentityService");
    return ProfileService.updateMe(ic, data);
  },
);

export const listUserRoles = createGovernedFn(
  {
    domain: "identity",
    action: "roles.list",
    auditSuccess: false,
    validate: (input: unknown) => listRolesSchema.parse(input),
  },
  async ({ data, ctx }): Promise<AppRole[]> => {
    const ic = await buildContext(ctx);
    const { IdentityService } = await import("@/domains/identity/services/IdentityService");
    return IdentityService.listRoles(ic, data.userId);
  },
);

export const assignRole = createGovernedFn(
  {
    domain: "identity",
    action: "roles.assign",
    roles: ["admin"],
    validate: (input: unknown) => assignRoleSchema.parse(input),
  },
  async ({ data, ctx }): Promise<{ ok: true }> => {
    const ic = await buildContext(ctx);
    const { IdentityService } = await import("@/domains/identity/services/IdentityService");
    await IdentityService.assignRole(ic, data.userId, data.role);
    return { ok: true };
  },
);

export const revokeRole = createGovernedFn(
  {
    domain: "identity",
    action: "roles.revoke",
    roles: ["admin"],
    validate: (input: unknown) => revokeRoleSchema.parse(input),
  },
  async ({ data, ctx }): Promise<{ ok: true }> => {
    const ic = await buildContext(ctx);
    const { IdentityService } = await import("@/domains/identity/services/IdentityService");
    await IdentityService.revokeRole(ic, data.userId, data.role);
    return { ok: true };
  },
);

export const logSignInEvent = createGovernedFn(
  {
    domain: "identity",
    action: "auth.sign_in",
    auditSuccess: false,
    validate: (input: unknown) => signInEventSchema.parse(input),
  },
  async ({ data, ctx }): Promise<{ ok: true }> => {
    const ic = await buildContext(ctx);
    const { IdentityService } = await import("@/domains/identity/services/IdentityService");
    await IdentityService.recordSignIn(ic, data.method, data.provider);
    return { ok: true };
  },
);

export const recordEmailVerified = createGovernedFn(
  { domain: "identity", action: "auth.verified", auditSuccess: false },
  async ({ ctx }): Promise<{ ok: true }> => {
    const ic = await buildContext(ctx);
    const { IdentityService } = await import("@/domains/identity/services/IdentityService");
    const email = (ctx.claims as { email?: string }).email ?? null;
    await IdentityService.recordVerification(ic, email);
    return { ok: true };
  },
);
