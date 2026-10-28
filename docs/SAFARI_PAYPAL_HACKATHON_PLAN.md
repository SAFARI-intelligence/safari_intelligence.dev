# SAFARI × PayPal AI Hackathon — Implementation Plan

## Goal
Demonstrate a Kenya-first safari-planning journey in which an AI-assisted itinerary can lead to a clearly priced booking and a PayPal Sandbox checkout. This is a hackathon prototype, not a production payment system.

## Current branch
`yvngdoja/safari-hackathon-1`

## Verified baseline
- React 19 + TanStack Start / TanStack Router
- TypeScript, Tailwind CSS, Supabase client dependency
- Existing SAFARI tourism homepage and shared UI
- PayPal integration was not found in the branch search performed during initial inspection
- `.env.example` and `LICENSE` were not found at repository root during initial inspection
- Repository is currently private; the hackathon requires a public code repository

## Build sequence
1. **Protect credentials:** ignore local environment files; commit only safe variable names in an example file.
2. **Trace existing booking/auth flow:** identify the existing route, data model, and session ownership before wiring checkout.
3. **Create a small checkout vertical slice:** server-side PayPal Sandbox order creation, buyer approval, server-side capture, and explicit success/failure states.
4. **Validate payment results:** do not trust client-supplied totals or a browser redirect as proof of payment. Verify captured status, amount, currency, and order association on the server. Make capture idempotent and handle cancellation/failure.
5. **Connect AI to the journey:** use the existing planner/itinerary capability if present; clearly label generated suggestions and ensure the user confirms the itinerary and price before checkout.
6. **Test and document:** add focused tests where the current setup permits; document local setup, Sandbox credentials, PayPal + AI usage, and limitations.
7. **Submission readiness:** add an OSI-approved license, make the repository public when ready, and publish a public demo video under three minutes.

## Safety constraints
- Never commit `.env`, client secrets, access tokens, or real payment credentials.
- Keep PayPal client secret and order/capture calls server-side.
- Use Sandbox only for the hackathon demo; do not enable live payments without a separate security review.
- Do not claim a booking is paid until server-side capture verification succeeds.
- Do not run database migrations or mutate production Supabase data as part of this prototype without explicit authorization.

## Acceptance checklist
- [ ] PayPal Sandbox order can be created by the server
- [ ] Buyer can approve or cancel checkout
- [ ] Server captures and verifies the approved order
- [ ] Amount/currency/order ownership are checked server-side
- [ ] Duplicate capture/retry behavior is safe
- [ ] Failure and cancellation are visible and do not mark booking paid
- [ ] AI-assisted itinerary and payment flow work end-to-end
- [ ] Setup, PayPal integration, AI usage, and limitations are documented
- [ ] OSI license added and repository made public before submission
- [ ] Public demo video under three minutes
