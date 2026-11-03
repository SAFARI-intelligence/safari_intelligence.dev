# SAFARI — Product Status

- **Last updated:** 2026-11-03
- Legend: IMPLEMENTED · PARTIALLY IMPLEMENTED · PLANNED · UNVERIFIED

| Product | Status | Verified capabilities | Gaps |
| --- | --- | --- | --- |
| AI Travel Planner (`/plan`) | PARTIALLY IMPLEMENTED | Form (destinations, duration, budget, interests, group size); calls `ai-planner` Edge Function; NPS modal after generation | Sign-in required; output not grounded in DB; prices are AI estimates; no rate limiting; "Book" link not parameterised |
| WIS (`/wis`, `/wildlife`, `/stories`, `/map`, `/journal`) | PARTIALLY IMPLEMENTED | Story cards, watchlist, missions, zone map (mock); species facts via server fn with allow-list; journal on `wis_journal_entries`; delay disclosure on `/` and wildlife pages | Data split across mocks and tables; `/map` realtime feed; delay not enforced in RLS/queries; no provenance/confidence model |
| Discovery & Booking (`/hotels`, `/book`, `/pay/*`, `/partner`) | PARTIALLY IMPLEMENTED | Published `hotels` reads (2 rows); `pay_*` schema with locks/idempotency; `CheckoutModal` | `/book` uses static packages and simulated checkout; live payments on hold; one hotel image is not a valid URL |
| Conservation & Research | PLANNED | Editorial copy on `/` and `/about` with honest disclaimer | No projects, data, or donations |
| Simba Points / Wallet | PARTIALLY IMPLEMENTED | UI backed by localStorage | Not persisted server-side |
| Operator suite (`/operator/*`) | PARTIALLY IMPLEMENTED | UI shells | Mock data; real queries not built |
