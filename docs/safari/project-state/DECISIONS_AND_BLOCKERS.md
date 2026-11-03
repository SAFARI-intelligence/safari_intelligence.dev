# SAFARI — Decisions & Blockers

- **Last updated:** 2026-11-03 · **Production:** NO-GO until independently cleared

## Requirements in force
- Wildlife locations must be delayed ≥ 2 hours and never described as "real-time"/"live". Enforcement is UI-copy only; NOT verified in data layer.
- Sample data must be labelled.
- No live payments until security review.

## Blockers
| ID | Item | Dependency |
| --- | --- | --- |
| B1 | `animal_locations` open RLS + realtime on `/map` | Approved migration/design |
| B2 | Payments held | Security & payment review |
| B3 | Unpublished-hotel exclusion never tested (no unpublished rows) | Test data |
| B4 | `hotel-images` storage policies accept legacy roles only, not `operator` | Approved additive migration |
| B5 | Migration history (supabase vs drizzle folders) not reconciled | Owner decision |
| B6 | GitHub repo / branch target (`lovable/ui`) | UNVERIFIED; owner to confirm |

## Open decisions
- Approve Phase B narrative (and remove "real-time urban navigation" wording).
- Whether `/expansion` stays public.
- Commission rate (12% shown as proposed only).
- Planner guest access and grounding approach.

## Restrictions
No schema, auth, payment, or infra changes without explicit approval; structural refactors approved separately.
