import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AdminGuard } from "@/components/safari/AdminGuard";
import { supabase } from "@/integrations/supabase/client";
import { assignRole, listUserRoles, revokeRole } from "@/lib/identity/identity.functions";
import { APP_ROLES, ROLE_LABELS, type AppRole } from "@/domains/identity/entities/Role";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/users")({
  head: () => ({
    meta: [
      { title: "User management — SAFARI Admin" },
      { name: "description", content: "Manage SAFARI user roles and permissions." },
    ],
  }),
  component: () => (
    <AdminGuard>
      <AdminUsersPage />
    </AdminGuard>
  ),
});

interface Row {
  id: string;
  email: string | null;
  name: string | null;
  roles: AppRole[];
}

function AdminUsersPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("profiles")
      .select("id,email,name")
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }
    const list = data ?? [];
    const withRoles = await Promise.all(
      list.map(async (p) => {
        try {
          const roles = await listUserRoles({ data: { userId: p.id } });
          return { ...p, roles } as Row;
        } catch {
          return { ...p, roles: [] as AppRole[] } as Row;
        }
      }),
    );
    setRows(withRoles);
    setLoading(false);
  };

  useEffect(() => {
    void load();
  }, []);

  const toggle = async (userId: string, role: AppRole, currently: boolean) => {
    setBusy(`${userId}:${role}`);
    try {
      if (currently) await revokeRole({ data: { userId, role } });
      else await assignRole({ data: { userId, role } });
      toast.success(currently ? `Revoked ${ROLE_LABELS[role]}` : `Assigned ${ROLE_LABELS[role]}`);
      await load();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Action failed");
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-4">
      <header>
        <h1 className="text-3xl" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#1A3C2E" }}>
          User management
        </h1>
        <p className="text-sm text-stone-600 mt-1">Assign or revoke platform roles.</p>
      </header>

      {loading ? (
        <p className="text-sm text-stone-500">Loading…</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border bg-white" style={{ borderColor: "rgba(26,60,46,0.12)" }}>
          <table className="w-full text-sm">
            <thead className="text-left text-xs uppercase tracking-wider text-stone-500 bg-stone-50">
              <tr>
                <th className="p-3">User</th>
                {APP_ROLES.map((r) => (
                  <th key={r} className="p-3 text-center">{ROLE_LABELS[r]}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-t" style={{ borderColor: "rgba(26,60,46,0.08)" }}>
                  <td className="p-3">
                    <div className="font-medium text-stone-800">{row.name ?? "—"}</div>
                    <div className="text-xs text-stone-500">{row.email ?? row.id.slice(0, 8)}</div>
                  </td>
                  {APP_ROLES.map((r) => {
                    const has = row.roles.includes(r);
                    const key = `${row.id}:${r}`;
                    return (
                      <td key={r} className="p-3 text-center">
                        <button
                          onClick={() => toggle(row.id, r, has)}
                          disabled={busy === key}
                          className="px-2 py-1 rounded text-xs font-medium disabled:opacity-50"
                          style={{
                            background: has ? "#1A3C2E" : "transparent",
                            color: has ? "#F7F4EF" : "#1A3C2E",
                            border: has ? "none" : "1px solid rgba(26,60,46,0.2)",
                          }}
                        >
                          {has ? "Assigned" : "Assign"}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={APP_ROLES.length + 1} className="p-6 text-center text-stone-500">
                    No users yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
