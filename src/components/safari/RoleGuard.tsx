import type { ReactNode } from "react";
import type { AppRole } from "@/lib/auth";

// Access opened to anyone — all three interfaces (user, hotel, support)
// are publicly reachable. Kept as a passthrough so route files stay unchanged.
export function RoleGuard({ children }: { allow: AppRole[]; children: ReactNode }) {
  return <>{children}</>;
}
