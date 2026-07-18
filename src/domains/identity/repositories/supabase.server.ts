// Server-only Supabase-backed repositories.
// Never import this file from client code — it is used inside createServerFn handlers.

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { IdentityError } from "../errors";
import { normalizeRoles, type AppRole } from "../entities/Role";
import type { Profile, ProfileUpdate } from "../entities/Profile";
import type {
  AuditRecord,
  AuditRepository,
  ProfileRepository,
  RoleRepository,
} from "./types";

type DbClient = SupabaseClient<Database>;

export function createProfileRepository(supabase: DbClient): ProfileRepository {
  return {
    async findById(id) {
      const { data, error } = await supabase
        .from("profiles")
        .select("id,email,name,avatar_url,locale,phone,created_at,updated_at")
        .eq("id", id)
        .maybeSingle();
      if (error) throw new IdentityError("INTERNAL", "Failed to load profile");
      return (data as Profile | null) ?? null;
    },

    async update(id, patch: ProfileUpdate) {
      const cleaned: Record<string, unknown> = { updated_at: new Date().toISOString() };
      if (patch.name !== undefined) cleaned.name = patch.name;
      if (patch.avatar_url !== undefined) cleaned.avatar_url = patch.avatar_url;
      if (patch.locale !== undefined) cleaned.locale = patch.locale;
      if (patch.phone !== undefined) cleaned.phone = patch.phone;

      const { data, error } = await supabase
        .from("profiles")
        .update(cleaned)
        .eq("id", id)
        .select("id,email,name,avatar_url,locale,phone,created_at,updated_at")
        .single();
      if (error || !data) throw new IdentityError("INTERNAL", "Failed to update profile");
      return data as Profile;
    },
  };
}

export function createRoleRepository(supabase: DbClient): RoleRepository {
  return {
    async listForUser(userId) {
      const { data, error } = await supabase.rpc("get_user_roles", { _user_id: userId });
      if (error) throw new IdentityError("INTERNAL", "Failed to load roles");
      return normalizeRoles(((data ?? []) as { role?: string }[] | string[]).map((r) =>
        typeof r === "string" ? r : r.role,
      ));
    },

    async assign(userId, role: AppRole) {
      const { error } = await supabase
        .from("user_roles")
        .insert({ user_id: userId, role })
        .select("id")
        .maybeSingle();
      if (error && !/duplicate key/i.test(error.message)) {
        if (/permitted/i.test(error.message)) {
          throw new IdentityError("FORBIDDEN", "Not allowed to assign this role");
        }
        throw new IdentityError("INTERNAL", "Failed to assign role");
      }
    },

    async revoke(userId, role: AppRole) {
      const { error } = await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", userId)
        .eq("role", role);
      if (error) throw new IdentityError("INTERNAL", "Failed to revoke role");
    },
  };
}

export function createAuditRepository(supabase: DbClient): AuditRepository {
  return {
    async record(entry: AuditRecord) {
      const { error } = await supabase.from("identity_audit_log").insert({
        user_id: entry.userId,
        actor_id: entry.actorId ?? null,
        action: entry.action,
        ip: entry.ip ?? null,
        user_agent: entry.userAgent ?? null,
        metadata: (entry.metadata ?? {}) as never,
      });
      if (error) {
        // Audit failures must never block the caller; log and continue.
        console.warn("[identity] audit write failed", { action: entry.action });
      }
    },
  };
}
