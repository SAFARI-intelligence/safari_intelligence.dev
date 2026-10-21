# SAFARI implementation rules

- Keep the current TanStack Start route architecture and generated integration clients; website presentation changes must not change authentication, database access, or payment behavior.
- Keep shared visual tokens in `src/styles.css` and express interactive styles through existing UI component variants; this keeps editorial surfaces and portal controls theme-consistent.
- Use the existing Sheet and DropdownMenu primitives for shared navigation overlays; their focus management, Escape dismissal, and scroll handling preserve accessible navigation.
- Keep sample wildlife content clearly disclosed and separate from verified product claims; public editorial sections link only to existing routes.
- Structural code-review recommendations require separate approval; do not combine cleanup refactors with visual fixes.