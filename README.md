# design-web

Monorepo for the Nepal Digital Design System (Civic Calm) web platform: the docs site,
asset depot, UI packages, checker tools, and AI layer.

## Structure

- `packages/tokens` — `@nepal-gov/tokens`: CSS variables generated from design-guidelines, per display mode
- `packages/css` — `@nepal-gov/css`: framework-agnostic stylesheet
- `packages/ui` — `@nepal-gov/ui`: Civic Calm component library
- `packages/checker` — compliance checker engines (accessibility/design/AI checks, CLI, API, GitHub Action)
- `packages/ai` — AI layer: MCP server, Claude Skill, AGENTS.md init, llms.txt generators
- `apps/design-system` — public docs site (renders design-guidelines content, serves /llms.txt)
- `apps/depot` — asset depot (catalog from design-assets)
- `apps/checker` — compliance tool UI (thin frontend over packages/checker)
- `docs/` — architecture decisions (see `docs/repo-structure.md`)

`packages/ui|css|tokens`, `packages/checker`, and `packages/ai` were separate repos
(design-ui, design-tools, design-ai) in the full architecture; they are consolidated here
while the team is small and split back out when they gain owners/consumers.
See "Current phase" in docs/repo-structure.md.

## Build

The packages are generated from upstream repos, so nothing here hardcodes a policy value:

```
pnpm install
pnpm sync        # clone design-guidelines + design-assets at the refs in sources.json
pnpm build       # tokens → css → ui, in dependency order
pnpm test
```

`sources.json` pins the upstream refs. While consumers are internal-only the refs track branches;
`pnpm sync` warns when a ref is not a tag, and each build output records the guidelines version it
came from. Pin to tags before any external consumer installs these packages.

## Status

| Package | State |
|---|---|
| `@nepal-gov/tokens` | Built. 121 semantic tokens × 6 modes; the §5.2 contrast gate fails the build on a bad mode. |
| `@nepal-gov/css` | Built. Framework-agnostic stylesheet, self-hosted Noto, print rules, density; ~12 KB gzipped. |
| `@nepal-gov/ui` | Built. Ten components + the §10.2 theme provider; behavior-only over the CSS layer. |
| `packages/checker`, `packages/ai` | Not started. |
| `apps/*` | Not started — to be built as the first consumers of the packages above. |

## Rules

- `design-guidelines` is the source of truth — consumed by tagged release (branch, for now).
- CI runs the checker on our own apps; this site must pass its own standard.
- No hand-authored guideline content here; PR design-guidelines instead.
