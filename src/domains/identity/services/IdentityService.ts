// Identity — application services. Framework-agnostic; take repositories via DI.

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { IdentityError } from "./errors";
import type { AppRole } from "./entities/Role";
import type { Profile, ProfileUpdate } from "./entities/Profile";
import type {
  AuditRepository,
  ProfileRepository,
  RoleRepository,
} from "./repositories/types";
import { IDENTITY_EVENTS } from "./events/identityEvents";
import { emitEvent } from "@/lib/events/eventBus.server";

export interface IdentityContext {
  actorId: string;
  supabase: SupabaseClient<Database>;
  profiles: ProfileRepository;
  roles: RoleRepository;
  audit: AuditRepository;
}

export const ProfileService = {
  async getMe(ctx: IdentityContext): Promise<Profile> {
    const p = await ctx.profiles.findById(ctx.actorId);
    if (!p) throw new IdentityError("NOT_FOUND", "Profile not found");
    return p;
  },

  async updateMe(ctx: IdentityContext, patch: ProfileUpdate): Promise<Profile> {
    const before = await ctx.profiles.findById(ctx.actorId);
    if (!before) throw new IdentityError("NOT_FOUND", "Profile not found");
    const changed = Object.keys(patch).filter(
      (k) => (patch as Record<string, unknown>)[k] !== undefined,
    );
    if (changed.length === 0) return before;

    const updated = await ctx.profiles.update(ctx.actorId, patch);
    await ctx.audit.record({
      userId: ctx.actorId,
      actorId: ctx.actorId,
      action: "profile.updated",
      metadata: { changed },
    });
    await emitEvent(ctx.supabase, {
      name: IDENTITY_EVENTS.ProfileUpdated,
      aggregateId: ctx.actorId,
      actorId: ctx.actorId,
      payload: { changed },
    });
    return updated;
  },
};

async function requireAdmin(ctx: IdentityContext): Promise<void> {
  const { data, error } = await ctx.supabase.rpc("has_role", {
    _user_id: ctx.actorId,
    _role: "admin",
  });
  if (error) throw new IdentityError("INTERNAL", "Authorization check failed");
  if (!data) throw new IdentityError("FORBIDDEN", "Admin role required");
}

export const IdentityService = {
  async listRoles(ctx: IdentityContext, userId: string): Promise<AppRole[]> {
    if (userId !== ctx.actorId) await requireAdmin(ctx);
    return ctx.roles.listForUser(userId);
  },

  async assignRole(ctx: IdentityContext, userId: string, role: AppRole): Promise<void> {
    await requireAdmin(ctx);
    if (userId === ctx.actorId && role === "admin") {
      // Extra belt on top of the DB trigger.
      throw new IdentityError("FORBIDDEN", "Cannot self-assign admin");
    }
    await ctx.roles.assign(userId, role);
    await ctx.audit.record({
      userId,
      actorId: ctx.actorId,
      action: "role.assigned",
      metadata: { role },
    });
    await emitEvent(ctx.supabase, {
      name: IDENTITY_EVENTS.RoleAssigned,
      aggregateId: userId,
      actorId: ctx.actorId,
      payload: { targetUserId: userId, role },
    });
  },

  async revokeRole(ctx: IdentityContext, userId: string, role: AppRole): Promise<void> {
    await requireAdmin(ctx);
    await ctx.roles.revoke(userId, role);
    await ctx.audit.record({
      userId,
      actorId: ctx.actorId,
      action: "role.revoked",
      metadata: { role },
    });
    await emitEvent(ctx.supabase, {
      name: IDENTITY_EVENTS.RoleRevoked,
      aggregateId: userId,
      actorId: ctx.actorId,
      payload: { targetUserId: userId, role },
    });
  },

  async recordSignIn(
    ctx: IdentityContext,
    method: "password" | "oauth" | "magic_link",
    provider?: string,
  ): Promise<void> {
    await ctx.audit.record({
      userId: ctx.actorId,
      actorId: ctx.actorId,
      action: `auth.sign_in.${method}`,
      metadata: provider ? { provider } : {},
    });
  },

  async recordVerification(ctx: IdentityContext, email: string | null): Promise<void> {
    await ctx.audit.record({
      userId: ctx.actorId,
      actorId: ctx.actorId,
      action: "auth.email.verified",
    });
    await emitEvent(ctx.supabase, {
      name: IDENTITY_EVENTS.UserVerified,
      aggregateId: ctx.actorId,
      actorId: ctx.actorId,
      payload: { email },
    });
  },
};
