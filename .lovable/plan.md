# SAFARI — Baseline RLS brief: Phase 0 Discovery Report

Advisory only. Nothing is written or applied. This report stops at the brief's Phase 0 gate.

## Result: STOP condition triggered

Several of the brief's assumptions don't match this project. Under the brief's own rules ("Phase 0 contradicts any assumption → halt and ask"), Phase 1 can't go ahead as written.

## Contradictions with the brief

| Brief assumes | Actual (verified) |
|---|---|
| Turborepo + pnpm monorepo, `@derrick/*` packages | Single TanStack Start app (bun). `apps/web/` contains only legacy prototype files |
| Project ID `pjoktlmoasqydruazdqc` | This project's backend is a different instance (Lovable Cloud managed). The brief may be aimed at another project |
| Zero RLS policies exist | RLS is ON for all 24 public tables, and every one has policies |
| `user_roles` / `has_role` need creating | Both exist. `app_role` is an enum (user, hotel, support, tourist, operator, admin, ranger, researcher), not a text check |
| No signup trigger; tourist = no row | `on_auth_user_created` trigger exists. It writes a role row for every user (default tourist) and blocks admin self-assignment |
| `hotels.owner_id` must be added (nullable) | Already exists, NOT NULL, references auth.users |
| Publish column unknown | `hotels.is_published` exists. 2 rows, both published, both have owners |
| Migrations path is a placeholder | `supabase/migrations/` has 13 files, all applied through the platform. No drift detected from inside this project |

## Phase 0 answers

1. **Migrations:** 13 files, all ALREADY_DEPLOYED (managed by the platform). None MISSING, DRIFTED or CONFLICTING.
2. **hotels:** Exists. Columns: id, owner_id (not null), name, type, country, region, park, price_min, price_max, rating, description, amenities, images, is_published, latitude, longitude, created_at, updated_at. RLS is on with 4 policies:
   - SELECT (public): published OR owner OR support
   - INSERT: owner AND (hotel OR support)
   - UPDATE: owner OR support (no WITH CHECK)
   - DELETE: owner OR support
3. **Read without sign-in today:** hotels, experiences, animal_stories, animal_zones, animal_locations, pay_trips (from `/hotels`, `/hotels/$id`, `/stories`, `/map`, `/pay/trips`, plus the landing page and the planner).
4. **Session:** Handled in the browser. `/_authenticated` uses a client-only `beforeLoad`. `/operator` and `/support` use `RoleGuard`, which you made a passthrough on purpose ("open all 3 interfaces"). No admin route guard except `AdminGuard` on `/admin/users`.
5. **user_roles / has_role:** Both exist. `has_role(uuid, app_role)` is security definer with `search_path = public`.

## Real gaps worth fixing (my findings)

- **hotels UPDATE has no WITH CHECK.** An owner could reassign `owner_id` to someone else. The UPDATE policy also doesn't require the operator role.
- **"Support manage roles" policy (ALL on user_roles).** Support can grant any role. A trigger blocks granting admin/support, but support can still grant operator to anyone.
- **Legacy and new role names are mixed** (hotel/operator, support/admin). Policies check the legacy names only.
- **Role guards are UX only.** Your earlier passthrough decision directly conflicts with the brief's Phase 2.

## Open decisions for you

1. Is this brief meant for **this** project, or for the separate monorepo with ID `pjoktlmoasqydruazdqc`?
2. If it's for this project: should Phase 1 be rewritten as an **amendment** to what's already there (add WITH CHECK, require operator/admin role, accept both legacy and new role names, restrict the support role-management policy), instead of the brief's create-from-scratch migration?
3. Do you want to keep the role table **"elevated grants only, no signup trigger"**? That means removing the existing trigger and backfilling. It's riskier, and I recommend keeping the trigger.
4. Should `/operator` go back behind a real guard? That reverses your "open to anyone" decision.

AWAITING GO.

moatRelevant: false (touches no wildlife data)
