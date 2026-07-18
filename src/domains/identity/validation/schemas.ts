import { z } from "zod";
import { APP_ROLES } from "../entities/Role";

export const profileUpdateSchema = z.object({
  name: z.string().trim().min(1).max(80).optional(),
  profile_image: z.string().url().max(500).nullable().optional(),
  preferences: z.record(z.string(), z.unknown()).optional(),
});

export const assignRoleSchema = z.object({
  userId: z.string().uuid(),
  role: z.enum(APP_ROLES),
});

export const revokeRoleSchema = assignRoleSchema;

export const listRolesSchema = z.object({
  userId: z.string().uuid(),
});

export const signInEventSchema = z.object({
  method: z.enum(["password", "oauth", "magic_link"]),
  provider: z.string().max(40).optional(),
});

export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
export type AssignRoleInput = z.infer<typeof assignRoleSchema>;
