// Identity Domain — Role entity + guards.
// Pure module: no I/O, safe to import from client or server.

export const APP_ROLES = [
  "tourist",
  "ranger",
  "researcher",
  "operator",
  "admin",
] as const;

export type AppRole = (typeof APP_ROLES)[number];

// Legacy enum values still present in the database. We accept them at read
// time and normalise to the new semantic role.
const LEGACY_MAP: Record<string, AppRole> = {
  user: "tourist",
  hotel: "operator",
  support: "admin",
};

export function isAppRole(value: unknown): value is AppRole {
  return typeof value === "string" && (APP_ROLES as readonly string[]).includes(value);
}

export function normalizeRole(value: string | null | undefined): AppRole | null {
  if (!value) return null;
  if (isAppRole(value)) return value;
  return LEGACY_MAP[value] ?? null;
}

export function normalizeRoles(values: readonly (string | null | undefined)[]): AppRole[] {
  const out = new Set<AppRole>();
  for (const v of values) {
    const n = normalizeRole(v);
    if (n) out.add(n);
  }
  return [...out];
}

// Human labels for UI.
export const ROLE_LABELS: Record<AppRole, string> = {
  tourist: "Tourist",
  ranger: "Ranger",
  researcher: "Researcher",
  operator: "Operator",
  admin: "Admin",
};
