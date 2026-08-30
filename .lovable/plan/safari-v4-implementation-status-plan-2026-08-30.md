# SAFARI V4 — Implementation Status & Plan

## SAFARI V4 IMPLEMENTATION STATUS

**Repository:** Single TanStack Start app (`src/`), not the `apps/ + packages/` monorepo in the V4 spec. A stray `apps/web/src/components/safari/` folder holds 4 orphan components outside the build graph.

**Architecture:** Domain layer exists for Identity only (`src/domains/identity/` — entities, repositories, services, validation, events). Every other domain (Tourism, Parks, Wildlife, WIS, Conservation, Research, Booking, Commerce, Notifications, Analytics, AI) lives as page-level or lib-level code (`src/lib/pay.ts`, `safari-data.ts`, `operator-data.ts`, `wis.functions.ts`) with direct Supabase calls from routes.

**Security:** RLS is enabled on all 24 public tables, each with policies. Auth middleware (`requireSupabaseAuth`) is used by identity and WIS journal server functions. Secrets stay server-side. `RoleGuard` is currently a deliberate passthrough (all three portals open to everyone, per an earlier instruction) — so `/operator`, `/support`, `/pay` have no client-side role gating; DB-level RLS is the only enforcement.

**Governance:** No phase-gate, no central validation/audit middleware. Pipeline steps present: Authentication (middleware), Authorization (RLS + `has_role`), Validation (Zod in identity only), Audit (`identity_audit_log`, identity domain only).

**Domains:** 1 of 12 conformant.

**AI:** Two disconnected paths — a Supabase Edge Function (`supabase/functions/ai-planner`) and a server function (`src/lib/wis.functions.ts`) calling the AI gateway directly. No orchestrator, no agent registry, no memory, no approval gates, no retries.

**Events:** `platform_events` table + `emitEvent()` helper, emitted only from Identity and the signup DB trigger. Synchronous insert; no bus, no subscribers, no queue.

**WIS:** Storytelling slice only (`wis_journal_entries`, `wis_narratives`, `wis_species_rarity`, `wis_trip_summaries`) plus mock UI at `/wis`. No ingestion, validation, geospatial enrichment (no PostGIS), confidence scoring, knowledge graph, or forecasting.

### CRITICAL BLOCKERS
- Role gating is disabled app-wide (`RoleGuard` passthrough) while operator/support surfaces are linked publicly. Needs an explicit decision before further role-scoped features.
- AI Planner runs as a Supabase Edge Function while the rest of the stack is TanStack server functions — two runtimes, two auth models, one unmonitored.

### HIGH PRIORITY
- No shared governance pipeline: validation and audit are per-file, easy to skip on the next feature.
- Event emission is fire-and-forget and unconsumed — no processing, no retry, no dead-letter.
- Domain logic leaking into routes; no repository boundary outside Identity.

### SAFE TO IMPLEMENT (non-breaking, no redesign)
- A governance kernel in `src/lib/governance/` (auth → authz → validation → phase gate → audit) as composable TanStack middleware, adopted incrementally.
- A domain scaffold mirroring Identity for the next domain, with no route changes yet.
- An AI Orchestrator module fronting the existing two AI callers, without moving them yet.

### NEXT ACTION
Ship the governance kernel + Wildlife domain scaffold (Step 1 below). Nothing else changes until that lands and typechecks.

---

## Implementation Plan (sequenced)

### Step 1 — Governance kernel (first safe implementation)
New `src/lib/governance/`:
- `pipeline.ts` — `createGovernedFn({ domain, action, roles, schema, phase })` wrapping `createServerFn` with the fixed order: authenticate → authorize → validate → phase gate → execute → audit.
- `authorize.ts` — role check via existing `has_role` RPC and `normalizeRoles`.
- `phaseGate.ts` — declarative feature/phase registry (config-only, no new tables).
- `audit.ts` — writes to `identity_audit_log` and emits a `platform_events` row.

Retrofit `src/lib/identity/identity.functions.ts` and the WIS journal functions onto it. No behaviour change; existing endpoints keep their contracts.

### Step 2 — Event bus hardening
Add `src/lib/events/` registry of typed event names per domain, plus an outbox status column on `platform_events` and a processor server route under `src/routes/api/public/` (secret-verified) so events can be consumed asynchronously later. No consumers yet.

### Step 3 — Wildlife + WIS domain boundaries
`src/domains/wildlife/` and `src/domains/wis/` mirroring the Identity layout. Move sighting/zone/narrative access out of routes into repositories. Routes call server functions only.

### Step 4 — AI Orchestrator
`src/domains/ai/orchestrator/` with an agent registry (Planner, Wildlife, Storytelling to start), task routing, retries, and audit logging. Migrate the AI Planner from the Edge Function to a governed server function; keep the Edge Function until parity is verified, then delete it.

### Step 5 — Booking / Commerce domains
Wrap `pay.ts` and booking logic in repositories; keep the existing advisory-lock RPCs as the transactional core.

### Step 6 — WIS pipeline foundation
Enable PostGIS, add observation ingestion + validation + confidence scoring tables, wire ranger/tourist observation intake. Forecasting deferred.

## Technical notes
- No monorepo restructure. The V4 `packages/` layout maps onto `src/domains/*` (domain logic) and `src/lib/*` (shared kernel) inside this single app; a real workspace split would break the Cloudflare build and is not justified now.
- No new dependencies in Steps 1–3. Redis is not available in this runtime; Postgres advisory locks and the events table already fill the locking/queue role.
- The orphan `apps/web/src/components/safari/` files get folded into `src/components/safari/` or deleted in Step 3.

## Decisions needed before Step 1
1. Restore role gating on `/operator` and `/support`, or keep them open?
2. Confirm the AI Planner may move off the Supabase Edge Function onto a server function in Step 4.
