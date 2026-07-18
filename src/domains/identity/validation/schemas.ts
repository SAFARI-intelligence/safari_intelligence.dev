import { z } from "zod";
import { APP_ROLES } from "../entities/Role";

export const profileUpdateSchema = z.object({
  name: z.string().trim().min(1).max(80).optional(),
  avatar_url: z.string().url().max(500).nullable().optional(),
  locale: z.string().trim().min(2).max(10).optional(),
  phone: z.string().trim().min(6).max(20).nullable().optional(),
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
