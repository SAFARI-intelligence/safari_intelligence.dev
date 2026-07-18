// Identity — repository interfaces (client-safe types).

import type { Profile, ProfileUpdate } from "../entities/Profile";
import type { AppRole } from "../entities/Role";

export interface ProfileRepository {
  findById(id: string): Promise<Profile | null>;
  update(id: string, patch: ProfileUpdate): Promise<Profile>;
}

export interface RoleRepository {
  listForUser(userId: string): Promise<AppRole[]>;
  assign(userId: string, role: AppRole): Promise<void>;
  revoke(userId: string, role: AppRole): Promise<void>;
}

export interface AuditRecord {
  userId: string;
  actorId?: string | null;
  action: string;
  ip?: string | null;
  userAgent?: string | null;
  metadata?: Record<string, unknown>;
}

export interface AuditRepository {
  record(entry: AuditRecord): Promise<void>;
}
