# Explorer Dashboard: Kenya-first park availability

## Scope
Update only the landing page (`/`) presentation. Do not change authentication, routing, backend calls, payment pages, or shared park behavior elsewhere.

## Changes
1. **Hero copy**
   - Replace the current supporting line with: “Karibu. Kenya's safari platform, built in Nairobi.”
   - Keep the existing hero imagery and actions unchanged.

2. **Active Kenya parks**
   - Show four active cards in this order: Maasai Mara, Amboseli, Tsavo, Lake Nakuru.
   - Preserve each card’s delayed-location tooltip and “Sample data” disclosure.
   - Keep “Quick book” linked to the existing booking page on these four cards only.
   - Reuse existing bundled wildlife imagery and clearly modeled sample metrics for the three newly surfaced Kenya cards.

3. **Coming to East Africa**
   - Move Serengeti, Bwindi, Volcanoes NP, Murchison Falls, and Akagera into one collapsed, accessible disclosure row beneath the active cards.
   - When expanded, show muted/greyed cards with a “Coming soon” tag.
   - Omit the “Quick book” action entirely from these cards.

4. **Bilingual park labels**
   - Add an optional Swahili-name line beneath the English name.
   - Leave it absent unless a Swahili name is already verified in project content; the current project does not provide verified Swahili names for these parks, so no translations will be invented.

## Validation
- Confirm the active-card order is Maasai Mara, Amboseli, Tsavo, Lake Nakuru.
- Confirm the regional cards start collapsed, expand accessibly, appear muted, and show “Coming soon.”
- Confirm exactly the four Kenya cards expose working “Quick book” links.
- Check desktop and mobile rendering, keyboard expansion, and the current build status.
