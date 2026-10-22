import { Navigate } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useAuth } from "@/lib/auth";
import { normalizeRoles, type AppRole } from "@/domains/identity/entities/Role";

/**
 * Gate a route on one or more roles. Legacy DB role strings ("user",
 * "hotel", "support") are normalized transparently. "admin" is the
 * platform super-role and passes every guard. Deny by default: access
 * stays blocked while authentication or role resolution is pending.
 */
export function RoleGuard({
  children,
  allow = [],
  redirectTo = "/auth",
}: {
  allow?: AppRole[];
  children: ReactNode;
  redirectTo?: string;
}) {
  const { user, roles, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-[50vh] grid place-items-center">
        <div className="h-6 w-6 rounded-full border-2 border-[var(--gold)]/30 border-t-[var(--gold)] animate-spin" />
      </div>
    );
  }
  if (!user) return <Navigate to={redirectTo} />;

  const normalized = normalizeRoles(roles as unknown as string[]);
  const allowNormalized = normalizeRoles(allow as unknown as string[]);
  const isAllowed = allowNormalized.length === 0
    ? normalized.length > 0
    : normalized.some((r) => allowNormalized.includes(r) || r === "admin");

  if (!isAllowed) {
    return (
      <div className="p-8 max-w-md mx-auto text-center">
        <h1 className="text-xl font-semibold mb-2">Hapana — access restricted</h1>
        <p className="text-sm text-stone-600">
          This area requires the {allowNormalized.join(" or ")} role.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
