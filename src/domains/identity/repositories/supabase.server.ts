// Server-only Supabase-backed repositories.

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { IdentityError } from "../errors";
import { normalizeRoles, type AppRole } from "../entities/Role";
import type { Preferences, Profile, ProfileUpdate } from "../entities/Profile";
import type {
  AuditRecord,
  AuditRepository,
  ProfileRepository,
  RoleRepository,
} from "./types";

type DbClient = SupabaseClient<Database>;

const PROFILE_COLS = "id,email,name,profile_image,preferences,created_at,updated_at";

function toProfile(row: {
  id: string;
  email: string | null;
  name: string | null;
  profile_image: string | null;
  preferences: unknown;
  created_at: string;
  updated_at: string;
}): Profile {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    profile_image: row.profile_image,
    preferences: (row.preferences ?? {}) as Preferences,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

export function createProfileRepository(supabase: DbClient): ProfileRepository {
  return {
    async findById(id) {
      const { data, error } = await supabase
        .from("profiles")
        .select(PROFILE_COLS)
        .eq("id", id)
        .maybeSingle();
      if (error) throw new IdentityError("INTERNAL", "Failed to load profile");
      return data ? toProfile(data) : null;
    },

    async update(id, patch: ProfileUpdate) {
      const cleaned: Database["public"]["Tables"]["profiles"]["Update"] = {
        updated_at: new Date().toISOString(),
      };
      if (patch.name !== undefined) cleaned.name = patch.name;
      if (patch.profile_image !== undefined) cleaned.profile_image = patch.profile_image;
      if (patch.preferences !== undefined) {
        cleaned.preferences = patch.preferences as Database["public"]["Tables"]["profiles"]["Update"]["preferences"];
      }

      const { data, error } = await supabase
        .from("profiles")
        .update(cleaned)
        .eq("id", id)
        .select(PROFILE_COLS)
        .single();
      if (error || !data) throw new IdentityError("INTERNAL", "Failed to update profile");
      return toProfile(data);
    },
  };
}

export function createRoleRepository(supabase: DbClient): RoleRepository {
  return {
    async listForUser(userId) {
      const { data, error } = await supabase.rpc("get_user_roles", { _user_id: userId });
      if (error) throw new IdentityError("INTERNAL", "Failed to load roles");
      const raw = (data ?? []) as unknown[];
      return normalizeRoles(
        raw.map((r) => (typeof r === "string" ? r : (r as { role?: string })?.role)),
      );
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
        metadata: (entry.metadata ?? {}) as Database["public"]["Tables"]["identity_audit_log"]["Insert"]["metadata"],
      });
      if (error) {
        console.warn("[identity] audit write failed", { action: entry.action });
      }
    },
  };
}
