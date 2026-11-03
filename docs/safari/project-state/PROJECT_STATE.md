# SAFARI — Project State

- **Last updated:** 2026-11-03 · **Status:** Phase B submitted · **Production:** NO-GO

## Identity
Kenya-first tourism and wildlife intelligence platform. Positioning: **"Kenya. One Country. Every World."** Built in Nairobi. Not described as an "operating system".

## Architecture (verified from repo)
- TanStack Start v1 + React 19 + Vite 7, Tailwind v4 tokens in `src/styles.css`.
- Backend: Lovable Cloud (Postgres + Auth + Storage). 25 public tables per `src/integrations/supabase/types.ts`, incl. `hotels`, `bookings`, `pay_*`, `animal_*`, `wis_*`, `profiles`, `user_roles`, `support_tickets`.
- AI: Edge Function `supabase/functions/ai-planner` (Lovable AI Gateway, `google/gemini-2.5-flash`), auth required. WIS narratives via `src/lib/wis.functions.ts`.
- MCP: read-only server at `/mcp` (`src/routes/mcp.ts`, `src/lib/mcp/`).
- Governance kernel: `src/lib/governance/`; identity services `src/lib/identity/`.
- 46 route files in `src/routes/` (see PHASE_A_AUDIT.md).

## Access model (verified from code)
- `RoleGuard` gates: `/operator` → admin; `/partner` → operator; `/support` → admin; `/pay`, `/profile`, `/journal` → tourist. Earlier note that RoleGuard was a passthrough: current behaviour UNVERIFIED at runtime.
- `/operator/*` child pages use mock `src/lib/operator-data.ts`.

## Current phase
- Phase A (audit): complete, chat-delivered.
- Phase B (narrative): submitted, awaiting approval.
- Phase C (experience design) / D (implementation): not started.
