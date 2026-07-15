# apps/design-system

The public docs site, and the design system's **first real consumer** — built entirely from
`@nepal-gov/{tokens,css,ui}`, so it is its own proof that the packages compose into a compliant
page (§10.2: "if a competent team cannot produce a compliant page within an hour of install, that
is a defect in the design system").

Built with **Next.js (App Router)** + React.

```
pnpm --filter @nepal-gov/design-system-site dev
pnpm --filter @nepal-gov/design-system-site build   # static export to out/
```

## How it's structured

- **Server Components by default.** The home page, the component index, every component-spec page,
  the foundations chapters, and `/llms.txt` are Server Components — they read the synced guidelines
  at build time and render to static HTML. `output: "export"` produces a fully static site,
  deployable to any bucket or CDN.
- **Client islands only where needed.** The whole-page mode switcher (`ModeSwitcher`), the
  per-example mode panel (`ModePanel`), and the live component examples are the only `"use client"`
  components. They're what let a visitor read the whole site — or preview a single component — in
  any of the six display modes and either language.
- **No theme flash.** `themeInitScript` is inlined in `<head>` so the persisted mode is applied to
  `<html>` before first paint; the site also honours the OS `prefers-color-scheme` default.

## A note on the performance budget

The site must pass the standard it publishes — §8.1's ≤300 KB compressed initial weight and the
256 kbps low-bandwidth mandate. It does: the home page is ~199 KB gzipped. But be honest about the
shape of that number — it is **mostly JavaScript**, because an interactive site header (the mode
switcher) puts React on every page. That's the cost of the Next.js/React choice; it clears the
budget, but with less headroom than a zero-JS approach would. Keep new content pages free of
unnecessary client components so the shared runtime stays the only JS they pay for.

## Pages

- **Home** (`/`) — hero + the seven principles, parsed live from the guidelines markdown.
- **Components** (`/components`) — all 70 specs by category, "Built" vs "Spec" status; each links to
  a detail page with the spec prose, the do/don't guidance cards (from `guidance:` frontmatter), a
  live mode-previewable example (for the ten built components), and the tokens it consumes.
- **Components preview** (`/components/preview`) — all ten built components in one live service.
- **Foundations** (`/foundations`) — the 05-foundations chapters rendered from markdown.
- **`/llms.txt`** — a plain-text map of the system for AI tools.

## Rendering guideline content

`src/lib/guidelines.ts` reads the synced `.guidelines/` copy at build time — the docs site RENDERS
the guidelines, it never hand-authors them (AGENTS.md). Everything on the site traces back to a
file under `.guidelines/`, populated by `pnpm sync` from the pinned guidelines ref.

## Mode preview panel

Every live example carries a preview panel: render it in any display mode — light / dark /
high-contrast / colour-blind-safe, composed with large-text and reduced-motion — and in either
language, without leaving the page. It's powered by a nested theme provider (guidelines §10.2) and
doubles as the accessibility review tool: a reviewer walks a component through every mode in
seconds. The whole-page display-mode switcher in the site header is separate.
