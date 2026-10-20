# Hotels incident verification

- [x] Repeat the original Hotels request anonymously and signed in.
- [x] Confirm private records are filtered and row-level security remains enabled.
- [x] Capture direct API statuses, sanitized bodies, active Hotels policies, timestamp, and target confirmation (internal reference withheld).
- [x] Verify invalid-credential error responses expose no secrets or sensitive database details.
- [ ] Verify unpublished-hotel exclusion with a real restricted record; blocked because all existing hotels are published and no test-record write is authorized.
- [ ] Close the incident only after unpublished-row checks pass.