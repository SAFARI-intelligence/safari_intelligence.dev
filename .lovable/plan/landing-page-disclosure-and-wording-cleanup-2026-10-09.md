# Landing page disclosure and wording cleanup

## Scope
Only update the `/` landing page presentation and global head metadata. Leave authentication, routing behavior, Lovable Cloud calls, and all `/pay/*` pages unchanged.

## Changes
1. **Landing copy and labels**
   - Remove all visible claims using “real-time”, “live”, “LIVE”, “Live now”, or “right now”.
   - Replace the hero status language, wildlife CTA, section description, and related landing-only wording with delayed wildlife-intelligence language.
   - Rename landing-only code identifiers/classes containing the prohibited terms so the requested grep check is clean.

2. **Delayed-location disclosure**
   - Show `Updated 2h+ ago` on every park card instead of the current status/minutes badge.
   - Add an accessible compact tooltip to each badge with the exact text: `Wildlife locations are delayed by 2 hours to protect animals.`

3. **Sample-data disclosure**
   - Add a clearly visible `Sample data` badge to the hero statistics area.
   - Add the same badge to every park card without removing or restructuring the cards.

4. **Server-rendered counter fallback**
   - Initialize each animated counter from its supplied non-zero statistic during server rendering.
   - Preserve the count-up effect after hydration while preventing the server-rendered landing page from showing `0` as its initial fallback.

5. **Metadata**
   - Set the landing and global description, Open Graph description, and Twitter description to: `Plan your Kenya safari with SAFARI, built in Nairobi. Wildlife stories, trusted operators, KSh pricing.`
   - Remove prohibited wording from landing metadata while preserving the existing titles and share-image setup.

## Verification
- Confirm the newest preview build reports no errors.
- Run a case-insensitive grep against `src/routes/index.tsx` and `src/routes/__root.tsx` for `real-time`, `live`, and `AI-powered`; require zero hits.
- Open `/` and verify the non-zero counters, both `Sample data` placements, every `Updated 2h+ ago` badge, and the tooltip text.
- Confirm no authentication, route definitions, cloud calls, or `/pay/*` files changed.
