# design-web

Monorepo for the user-facing applications of the Nepal Government Digital Design System (Civic Calm).

## Structure

- `packages/tokens` — pulls `design-guidelines@tag`; generates CSS variables per display mode (light/dark/high-contrast/…)
- `packages/ui` — Civic Calm component library, built from tokens, mode-aware
- `apps/design-system` — docs site rendering the guidelines content
- `apps/depot` — asset depot: browse / search / download / contribute icons, illustrations, photos, animations, fonts
- `apps/checker` — compliance tool UI; thin frontend over the `design-tools` API
- `docs/` — architecture decisions and proposals (see `docs/repo-structure.md`)

## Rules

- Consume `design-guidelines`, `design-icons`, `design-assets`, `design-fonts` by tagged release, never main.
- CI runs the `design-tools` checkers on our own apps — this site must pass its own standard.
- Apps deploy independently; shared code flows through `packages/`.
