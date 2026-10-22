# SAFARI — Secure Tri-Role Access Control

## Roles

- **Customer (tourist)** — browse public listings, trip planner, manage own bookings.
- **Partner (operator)** — manage only their own listings/bookings.
- **Admin (platform owner)** — access `/operator` and all `/operator/*` routes.

Verified current state (reads this session): `RoleGuard` is a passthrough; `/operator` uses `allow={["hotel"]}`; `/partner` uses `allow={["hotel"]}`; `/support` uses `allow={["support"]}`; the signup trigger `handle_new_user()` (latest definition, migration `20260718195614`) maps signup metadata `hotel` → `operator`, so anyone can self-assign operator at signup.

## Changes

### 1. `src/components/safari/RoleGuard.tsx` — real guard, deny by default

- While `loading` is true or auth resolution fails: render a loading/denied state (never children).
- Unauthenticated → `<Navigate to="/auth" />`.
- Resolve roles with `normalizeRoles()`; render an access-restricted panel when no allowed role matches (same styling as `AdminGuard`).
- Passthrough removed.

### 2. Route guard updates

| Route | Currently | New |
|---|---|---|
| `/operator` | `hotel` | `admin` only (protects every `/operator/*` child) |
| `/partner` | `hotel` | `operator` (admin passes via super-role) |
| `/support` | `support` | `admin` |
| `/journal`, `/pay` | user/hotel/support | `tourist` (admin/operator super-role passes where relevant) |

Public partner listings (`/hotels`, `/hotels/$hotelId`) stay public — no guard added there.

### 3. `src/routes/auth.tsx` — remove privilege self-assignment

- Remove the "I am joining as / Hotel partner" role selector; signup is customer-only.
- Keep Google sign-in and sign-in mode untouched.

### 4. Database migration (one additive migration)

- Redefine `handle_new_user()`: every new signup gets `tourist` regardless of signup metadata; `operator`/`admin`/`ranger`/`researcher` require assignment via the existing admin flow (`assignRoleSchema` / identity admin functions).
- RLS harmonization for `hotels`, `bookings`, `profiles`, `user_roles`:
  - Policies that check roles accept both legacy (`user`, `hotel`, `support`) and modern (`tourist`, `operator`, `admin`) names so existing and future rows evaluate identically.
  - `hotels`: partner UPDATE/DELETE limited to `owner_id = auth.uid()` with `WITH CHECK` on ownership; public SELECT remains limited to published rows; partners read their own unpublished rows.
  - `bookings`: customers read/write only rows where they are the customer; partners read rows tied to their own listings; admin/support super-access preserved.
  - `profiles`: self read/update; admin read-all; public read remains only for what's already public.
  - `user_roles`: keep read via `get_user_roles`/`has_role` security-definer functions; no direct anon write; role writes restricted to admin.
- Follows existing migration conventions (Drizzle custom migration via the database tool). No existing user role assignments are changed; no destructive SQL.

### 5. Tests and validation

- Update/extend `tests/identity/role.guard.test.ts` (and `has-role.permissions.test.ts` where relevant) to cover: signup defaults to `tourist`, legacy normalization still works, admin super-role passes guards.
- Run the test suite, typecheck, and production build.
- Playwright checks: anonymous visit to `/operator`, `/partner`, `/support` → redirected/denied; `/hotels`, `/hotels/$hotelId`, `/` still public; signed-in customer blocked from `/partner`; admin path verified where a test admin exists.

## Not in scope

- No landing-page redesign, no auth-provider changes, no payment enablement, no publish/deploy.
- No changes to existing users' roles or data.

## Acceptance criteria

- Unauthenticated users cannot render protected routes.
- Customers cannot access `/partner` or `/operator`; partners cannot access `/operator` or other partners' private records.
- Only admin reaches `/operator` (and `/support`).
- Signup metadata can no longer grant `operator`/`admin`.
- Database policies enforce the same rules as the UI.

## Known limitation to report honestly

- Whether an admin test account exists in the DB determines if the admin path can be exercised end-to-end; if none exists, that path is verified by code review + tests only and flagged as such.
