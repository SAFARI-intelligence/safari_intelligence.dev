import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { getMyProfile, updateMyProfile } from "@/lib/identity/identity.functions";
import { profileUpdateSchema } from "@/domains/identity/validation/schemas";
import { ROLE_LABELS, normalizeRoles } from "@/domains/identity/entities/Role";
import type { Profile } from "@/domains/identity/entities/Profile";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/account")({
  head: () => ({
    meta: [
      { title: "Account — SAFARI" },
      { name: "description", content: "Manage your SAFARI profile and preferences." },
    ],
  }),
  component: AccountPage,
});

function AccountPage() {
  const { user, roles } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [name, setName] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getMyProfile()
      .then((p) => {
        setProfile(p);
        setName(p.name ?? "");
        setProfileImage(p.profile_image ?? "");
      })
      .catch((e) => toast.error(e.message));
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = profileUpdateSchema.safeParse({
      name: name.trim() || undefined,
      profile_image: profileImage.trim() || null,
    });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Invalid input");
      return;
    }
    setSaving(true);
    try {
      const next = await updateMyProfile({ data: parsed.data });
      setProfile(next);
      toast.success("Profile updated");
      router.invalidate();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;
  const semanticRoles = normalizeRoles(roles as string[]);

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <header>
        <h1 className="text-3xl" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#1A3C2E" }}>
          Account
        </h1>
        <p className="text-sm text-stone-600 mt-1">Signed in as {user.email}</p>
      </header>

      <section className="rounded-2xl border bg-white p-5" style={{ borderColor: "rgba(26,60,46,0.12)" }}>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-500 mb-3">Roles</h2>
        <div className="flex flex-wrap gap-2">
          {semanticRoles.length === 0 ? (
            <span className="text-sm text-stone-500">No roles assigned</span>
          ) : (
            semanticRoles.map((r) => (
              <span
                key={r}
                className="px-3 py-1 rounded-full text-xs font-medium"
                style={{ background: "rgba(201,146,42,0.15)", color: "#8a5f10" }}
              >
                {ROLE_LABELS[r]}
              </span>
            ))
          )}
        </div>
      </section>

      <form onSubmit={submit} className="rounded-2xl border bg-white p-5 space-y-4" style={{ borderColor: "rgba(26,60,46,0.12)" }}>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-500">Profile</h2>
        <label className="block">
          <span className="text-xs font-medium text-stone-700">Name</span>
          <input
            className="mt-1 w-full px-3 py-2 rounded-md border text-sm"
            style={{ borderColor: "rgba(26,60,46,0.2)" }}
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={80}
          />
        </label>
        <label className="block">
          <span className="text-xs font-medium text-stone-700">Profile image URL</span>
          <input
            className="mt-1 w-full px-3 py-2 rounded-md border text-sm"
            style={{ borderColor: "rgba(26,60,46,0.2)" }}
            value={profileImage}
            onChange={(e) => setProfileImage(e.target.value)}
            placeholder="https://…"
          />
        </label>

        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-stone-500">
            {profile ? `Last updated ${new Date(profile.updated_at).toLocaleString()}` : "Loading…"}
          </span>
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 rounded-md text-sm font-semibold disabled:opacity-60"
            style={{ background: "#1A3C2E", color: "#F7F4EF" }}
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
