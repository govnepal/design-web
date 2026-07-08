# design-web

Monorepo for the user-facing applications of the Nepal Government Digital Design System (Civic Calm).

## Structure

- `apps/design-system` — docs site rendering the guidelines content, with live examples built from `@nepal-gov/ui`; also serves `/llms.txt` and per-page markdown endpoints
- `apps/depot` — asset depot: browse / search / download / contribute icons, illustrations, photos, animations, fonts
- `apps/checker` — compliance tool UI; thin frontend over the `design-tools` API
- `docs/` — architecture decisions and proposals (see `docs/repo-structure.md`)

Tokens and components live in the `design-ui` repo (`@nepal-gov/tokens`, `@nepal-gov/css`, `@nepal-gov/ui`) — this repo installs them like any other government app.

## Rules

- Consume `design-guidelines`, `design-ui`, `design-icons`, `design-assets`, `design-fonts` by tagged release, never main.
- CI runs the `design-tools` checkers on our own apps — this site must pass its own standard.
- Apps deploy independently.
