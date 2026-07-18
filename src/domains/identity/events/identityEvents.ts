import type { AppRole } from "../entities/Role";

export const IDENTITY_EVENTS = {
  UserRegistered: "user.registered",
  UserVerified: "user.verified",
  ProfileUpdated: "profile.updated",
  RoleAssigned: "role.assigned",
  RoleRevoked: "role.revoked",
} as const;

export const IDENTITY_DOMAIN = "identity";

export type IdentityEventPayload =
  | { name: "user.registered"; email: string | null; role: AppRole }
  | { name: "user.verified"; email: string | null }
  | { name: "profile.updated"; changed: string[] }
  | { name: "role.assigned"; targetUserId: string; role: AppRole }
  | { name: "role.revoked"; targetUserId: string; role: AppRole };
