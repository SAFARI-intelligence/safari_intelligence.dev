# SAFARI execution — 21 October 2026

- [ ] Polish the existing public landing page with honest content and working feature links.
- [ ] Audit existing routes and fix verified presentation/navigation defects without structural refactors.
- [ ] Verify desktop/mobile rendering, navigation, runtime signals, and relevant existing tests.
- [ ] Record verified results, remaining defects, approval decisions, and next steps.
- [ ] Payment/security validation remains blocked: security review, deployed identity verification, migration-history reconciliation, and sensitive-flow testing require a separate authorized session.

## Hotels incident verification — retained, not closed

- [x] Repeat the original Hotels request anonymously and signed in.
- [x] Confirm private records are filtered and row-level security remains enabled.
- [x] Capture direct API statuses, sanitized bodies, active Hotels policies, timestamp, and target confirmation (internal reference withheld).
- [x] Verify invalid-credential error responses expose no secrets or sensitive database details.
- [ ] Verify unpublished-hotel exclusion with a real restricted record; blocked because all existing hotels are published and no test-record write is authorized.
- [ ] Close the incident only after unpublished-row checks pass.