# Phase 2 — Identity Domain (Platform Core)

Scope is strictly the Identity Domain. No changes to Payments, WIS, Booking, or MCP code paths beyond the role rename shim.

## 1. Current state (verified from schema + db-functions above)

- `app_role` enum today: `user`, `hotel`, `support`.
- `profiles` (7 cols) and `user_roles` (4 cols) already exist with RLS + `has_role()` + `handle_new_user()` trigger.
- No event bus, no audit log, no domain-layer folders.
- Roles asked for: **Tourist, Ranger, Researcher, Operator, Admin**.

Mapping (non-breaking — existing rows keep working):

| New semantic role | Enum value stored |
|---|---|
| Tourist   | `tourist`  (alias of legacy `user`)   |
| Operator  | `operator` (alias of legacy `hotel`)  |
| Admin     | `admin`    (alias of legacy `support`)|
| Ranger    | `ranger`   (new)                      |
| Researcher| `researcher` (new)                    |

Enum values are additive; a data migration converts legacy values, and `has_role()` stays as-is.

## 2. Folder structure (DDD, TypeScript)

```text
src/domains/identity/
  entities/
    User.ts               # domain entity + invariants
    Profile.ts
    Role.ts               # AppRole union + guards
  repositories/
    ProfileRepository.ts  # interface + supabase impl (server-only)
    RoleRepository.ts
    AuditRepository.ts
  services/
    IdentityService.ts    # register/verify/assign-role orchestration
    ProfileService.ts
  validation/
    schemas.ts            # zod: ProfileUpdate, RoleAssign, Register
  events/
    identityEvents.ts     # event names + payload types
  index.ts                # public barrel (safe imports only)

src/lib/identity/
  identity.functions.ts   # createServerFn wrappers (client-callable)

src/lib/events/
  eventBus.ts             # thin emitter -> platform_events table
  eventBus.server.ts      # server-only writer using supabaseAdmin

src/routes/_authenticated/
  account.tsx             # profile view/edit (tourist/ranger/researcher/operator)
  account.security.tsx    # password change, sessions
  admin.users.tsx         # admin-only user + role management (gated)

tests/identity/
  role.guard.test.ts
  profileService.test.ts
  identity.functions.integration.test.ts
```

Repositories are the **only** modules that touch Supabase directly. Services depend on repository interfaces. `identity.functions.ts` composes services and is the transport boundary.

## 3. Database migration (single call, structural)

- Extend enum: `ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'tourist' | 'operator' | 'admin' | 'ranger' | 'researcher'`.
- Backfill: `UPDATE user_roles SET role='tourist' WHERE role='user'` (same for hotel→operator, support→admin).
- Update `handle_new_user()` default role from `'user'` → `'tourist'`, and self-escalation guard to block `'admin'` (currently blocks `'support'`).
- Create `public.platform_events` (event bus append log):
  - `id, domain, name, aggregate_id, actor_id, payload jsonb, occurred_at`
  - RLS: only `admin` selects; `service_role` full; no anon.
- Create `public.identity_audit_log`:
  - `id, user_id, actor_id, action, ip, user_agent, metadata jsonb, occurred_at`
  - RLS: user reads own rows, admin reads all, `service_role` writes.
- Follow the four-step CREATE / GRANT / ENABLE RLS / POLICY structure for both.
- No touch to `auth.*`, `payments.*`, `wis_*` tables.

Legacy enum values are left in place (Postgres can't drop enum values online). Application code writes only new values.

## 4. Event emission

Business actions emitted through `eventBus.server.ts`:

- `identity.user.registered` — from `handle_new_user()` (inserted directly into `platform_events` inside the trigger, since Supabase Auth signup is the source of truth).
- `identity.user.verified` — server fn called after Supabase email confirmation redirect.
- `identity.profile.updated` — from `ProfileService.update`.
- `identity.role.assigned` — from `IdentityService.assignRole` (admin-only path).

Payloads are typed in `events/identityEvents.ts`. Consumers are out of scope this PR (log-only).

## 5. Server functions (transport)

All under `src/lib/identity/identity.functions.ts`, using `createServerFn` + `requireSupabaseAuth` (except registration which is client-side Supabase Auth). Every handler: zod validate → service call → audit log → event emit → return DTO.

- `getMyProfile()` — reads via RLS.
- `updateMyProfile({ name, avatar_url, locale, phone })` — zod-validated, emits `profile.updated`.
- `listUserRoles({ userId })` — admin-only via `has_role(auth.uid(),'admin')` check in service; RLS enforces too.
- `assignRole({ userId, role })` — admin-only; forbidden for self-escalation to `admin`.
- `revokeRole({ userId, role })` — admin-only.
- `logSignInEvent({ method })` — client calls after `signInWithPassword` / OAuth success; writes audit row.

## 6. Route guards & UI

- Reuse existing integration-managed `_authenticated/route.tsx`. Do NOT rewrite.
- Add `RoleGuard` usage on `admin.users.tsx` requiring `admin`.
- Existing `RoleGuard` shim (currently passthrough per prior turn) is updated to gate on the **new** role names while accepting legacy values through a `normalizeRole()` mapper — avoids breaking `/operator` and `/support` routes.
- No change to auth pages, OAuth flow, or `/auth` route.

## 7. Validation & error handling

- All inputs: zod schemas in `validation/schemas.ts`, imported by both server fns and forms.
- Server fns throw typed domain errors (`IdentityError`) mapped to safe messages; raw Supabase errors never leak.
- Structured server logs: `console.info({ evt, userId, action })`; no PII in logs.

## 8. Tests (vitest)

- Unit: `Role` guards, `normalizeRole` mapping, zod schemas.
- Service: `ProfileService.update` with a mocked repository — happy path, invalid input, forbidden.
- Integration: `assignRole` server fn against a test user; verifies audit + event rows written.

## 9. Migration steps (operational)

1. Approve the SQL migration (adds enum values, backfills, hardens trigger, creates `platform_events` + `identity_audit_log`).
2. Regenerated Supabase types land automatically.
3. Ship domain code + server fns + routes.
4. Update `RoleGuard` normalization.
5. Run `vitest`.
6. Smoke-test: signup → tourist role + audit row + event row; admin promotes user → role row + event; profile edit → event.

## 10. Explicitly out of scope

- Payments, Wallet, WIS, MCP, Operator dashboards — untouched.
- Removing legacy enum values (`user`/`hotel`/`support`) — deferred; requires a second migration once no code references them.
- Consumers for `platform_events` (webhooks, projectors) — future PR.
- Multi-factor auth, session revocation UI — future PR.
