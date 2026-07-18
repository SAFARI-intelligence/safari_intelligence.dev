import { Navigate } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useAuth } from "@/lib/auth";
import { normalizeRoles, type AppRole } from "@/domains/identity/entities/Role";

/**
 * Gate a route on one or more roles (new-domain values).
 * Legacy DB role strings are normalised transparently.
 */
export function AdminGuard({
  children,
  allow = ["admin"],
  redirectTo = "/auth",
}: {
  children: ReactNode;
  allow?: AppRole[];
  redirectTo?: string;
}) {
  const { user, roles, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to={redirectTo} />;
  const normalized = normalizeRoles(roles as unknown as string[]);
  const allowed = normalized.some((r) => allow.includes(r));
  if (!allowed) {
    return (
      <div className="p-8 max-w-md mx-auto text-center">
        <h1 className="text-xl font-semibold mb-2">Hapana — access restricted</h1>
        <p className="text-sm text-stone-600">
          This area requires the {allow.join(" or ")} role.
        </p>
      </div>
    );
  }
  return <>{children}</>;
}
