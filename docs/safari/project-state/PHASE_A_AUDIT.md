# SAFARI — Phase A Audit

- **Date:** 2026-11-03 · **Status:** Complete (baseline)

## Route inventory (`src/routes/`)
| Tier | Routes | Data source |
| --- | --- | --- |
| Public discovery | `/`, `/about`, `/outreach`, `/expansion` | `src/lib/safari-data.ts` (static) |
| AI Planner | `/plan` | `ai-planner` Edge Function |
| WIS / wildlife | `/wis`, `/wildlife`, `/stories`, `/stories/$slug`, `/map`, `/journal`, `/intelligence` | mocks (`wis/mock.ts`, safari-data), `animal_stories`, realtime `animal_locations` (`/map`), `wis_journal_entries` |
| Booking | `/hotels`, `/hotels/$hotelId`, `/book`, `/pay/*` | `hotels` table; `/book` static packages + `CheckoutModal`; `pay_*` tables |
| Account | `/profile`, `/wallet`, `/simba`, `/_authenticated/account` | `profiles`, localStorage |
| Operator / admin | `/partner`, `/operator/*`, `/support`, `/_authenticated/admin/users` | `hotels`, `support_tickets`, `user_roles`, mock `operator-data.ts` |
| Machine | `/mcp`, `/.mcp/*`, `/.well-known/*`, `/icons` | — |

## Key gaps
- Coast and Nairobi (City) almost absent from public content; Wild dominates.
- Products shown as separate pages with no "what / who / status" explanation.
- Primary nav (`src/components/safari/Shell.tsx`) has 4 links; no Conservation or Products entry.
- "real-time"/"live" strings remain in `about.tsx`, `map.tsx` (title "Live Map"), `wis.tsx`, `partner.tsx`, `support.tsx`, `expansion.tsx`, `stories.$slug.tsx`.
- `/map` subscribes to `animal_locations` inserts; RLS on that table is `USING (true)` (per earlier review) — 2-hour delay NOT enforced in data layer.
- `/expansion` (investor roadmap) reachable from public site.
- Planner output not grounded in `hotels`/`pay_trips`; requires sign-in.
- `safari-data.ts` park entries still carry `status: "live"` fields (not shown on `/`).
