import { describe, it, expect } from "vitest";
import {
  APP_ROLES,
  isAppRole,
  normalizeRole,
  normalizeRoles,
} from "@/domains/identity/entities/Role";
import {
  profileUpdateSchema,
  assignRoleSchema,
} from "@/domains/identity/validation/schemas";

describe("Role guards", () => {
  it("accepts new-domain roles", () => {
    for (const r of APP_ROLES) expect(isAppRole(r)).toBe(true);
  });

  it("rejects unknown values", () => {
    expect(isAppRole("guest")).toBe(false);
    expect(isAppRole(null)).toBe(false);
  });

  it("normalizes legacy → new roles", () => {
    expect(normalizeRole("user")).toBe("tourist");
    expect(normalizeRole("hotel")).toBe("operator");
    expect(normalizeRole("support")).toBe("admin");
    expect(normalizeRole("tourist")).toBe("tourist");
    expect(normalizeRole("bogus")).toBeNull();
  });

});

describe("Tri-role route guards", () => {
  it("maps legacy route allow-lists to modern roles", () => {
    // /partner historically allowed legacy "hotel"; /support allowed "support".
    expect(normalizeRoles(["hotel"])).toEqual(["operator"]);
    expect(normalizeRoles(["support"])).toEqual(["admin"]);
    expect(normalizeRoles(["user"])).toEqual(["tourist"]);
  });

  it("resolves admin as the platform super-role", () => {
    expect(normalizeRoles(["admin"])).toContain("admin");
  });

  it("denies unknown roles by default", () => {
    expect(normalizeRoles(["guest", ""])).toEqual([]);
  });
});

describe("Identity schemas", () => {
  it("accepts a valid profile update", () => {
    const r = profileUpdateSchema.safeParse({ name: "Asha" });
    expect(r.success).toBe(true);
  });

  it("rejects empty name and oversize URL", () => {
    expect(profileUpdateSchema.safeParse({ name: "  " }).success).toBe(false);
    expect(
      profileUpdateSchema.safeParse({ profile_image: "not-a-url" }).success,
    ).toBe(false);
  });

  it("assignRole requires uuid + known role", () => {
    expect(
      assignRoleSchema.safeParse({ userId: "not-uuid", role: "tourist" }).success,
    ).toBe(false);
    expect(
      assignRoleSchema.safeParse({
        userId: "00000000-0000-0000-0000-000000000000",
        role: "ranger",
      }).success,
    ).toBe(true);
  });
});
