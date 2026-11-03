# SAFARI — Documentation Index

- **Project:** SAFARI (Kenya-first tourism and wildlife intelligence platform)
- **Last updated:** 2026-11-03
- **Status:** Phase B submitted for approval; Phase C not started. Production: NO-GO.

## Project state snapshot (`docs/safari/project-state/`)
1. [PROJECT_STATE.md](safari/project-state/PROJECT_STATE.md) — overall status, architecture, current phase
2. [PHASE_A_AUDIT.md](safari/project-state/PHASE_A_AUDIT.md) — route inventory, baseline, gaps
3. [PHASE_B_NARRATIVE.md](safari/project-state/PHASE_B_NARRATIVE.md) — narrative, Three Worlds, product profiles, claims
4. [PRODUCT_STATUS.md](safari/project-state/PRODUCT_STATUS.md) — per-product status
5. [VALIDATION_TARGETS.md](safari/project-state/VALIDATION_TARGETS.md) — Phase 1 targets and evidence
6. [DECISIONS_AND_BLOCKERS.md](safari/project-state/DECISIONS_AND_BLOCKERS.md) — open decisions, blockers, restrictions
7. [CHANGELOG.md](safari/project-state/CHANGELOG.md) — recent changes

## Other documentation
- `docs/security/` — drafted (unapplied) RLS amendment notes.
- `AGENTS.md` (repo root) — technical/architecture rules.

## Source of Truth
| Concern | Owner |
| --- | --- |
| Application code | `src/` (TanStack Start v1 routes in `src/routes/`) |
| Database schema | `supabase/migrations/*.sql`, `drizzle/migrations/*.sql`; generated types `src/integrations/supabase/types.ts` |
| AI planner backend | `supabase/functions/ai-planner/index.ts` |
| Server functions | `src/lib/*.functions.ts`, `src/lib/governance/`, `src/lib/identity/` |
| Architecture rules | `AGENTS.md` |
| Product/brand rules | Project memory (wildlife delay rule, honest claims) + this docs folder |
| Decisions & blockers | `docs/safari/project-state/DECISIONS_AND_BLOCKERS.md`, `roadmap.md` |
| Operational/deploy status | Lovable platform (not readable from repo) — UNVERIFIED here |
