# apps/design-system

The public docs site, and the design system's **first real consumer** — built entirely from
`@nepal-gov/{tokens,css,ui}`, so it is its own proof that the packages compose into a compliant
page (§10.2: "if a competent team cannot produce a compliant page within an hour of install, that
is a defect in the design system").

```
pnpm --filter @nepal-gov/design-system-site dev
pnpm --filter @nepal-gov/design-system-site build
```

## Why Astro

The site must pass the standard it publishes — §8.1's ≤300 KB budget and no render-blocking
third-party JS. Astro renders to static HTML and ships **zero JavaScript by default**; only the
components explicitly marked as islands hydrate. So content pages (home, foundations, guideline
prose) ship no JS at all — the home page's critical path is ~7.5 KB gzipped — while the interactive
demos are React islands that load only where they're used. No page hardcodes a visual value; the
site consumes the same tokens it documents.

## Current state (MVP)

- **Home** (`/`) — hero + the seven principles, parsed live from the guidelines markdown (never
  hand-authored here).
- **Components** (`/components`) — every one of the ten components, live, inside the mode panel.
- The theme-init script is inlined in `<head>` so the persisted display mode is applied before
  first paint — no flash.

Still to build (task #6): per-component spec pages with do/don't cards, the foundations pages,
`/llms.txt` and clean-markdown output for AI tools, and the whole-page display-mode switcher in
the site header.

## Rendering guideline content

`src/lib/guidelines.ts` reads the synced `.guidelines/` copy at build time — the docs site RENDERS
the guidelines, it never hand-authors them (AGENTS.md). Everything on the site traces back to a
file under `.guidelines/`, populated by `pnpm sync` from the pinned guidelines ref.

## Mode preview panel

## Mode preview panel

Every live component example carries a preview panel (Radix ThemePanel equivalent): render the
example in any display mode — light / dark / high-contrast / color-blind-safe, composed with
large-text and reduced-motion — and in either language (ne/en), without leaving the page. The
panel is powered by a nested theme provider (guidelines §10.2) and doubles as the accessibility
review tool: a reviewer walks a component through all six modes in seconds. The whole-page
display-mode switcher remains separate in the site header.
