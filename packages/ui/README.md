# @govnepal/ui

The Civic Calm React components — the **behavior** layer. Every component maps to its
design-guidelines spec id and adds the ARIA, keyboard handling, and focus management that spec
requires. It contains **no styling of its own**: every visual decision lives in `@govnepal/css`.

```
pnpm --filter @govnepal/ui build     # generates the taxonomy module, then tsc
pnpm --filter @govnepal/ui test      # behavior tests against the built output, in jsdom
```

## Setup

```tsx
import "@govnepal/tokens/tokens.css";
import "@govnepal/css/fonts.css";
import "@govnepal/css/civic-calm.css";
import { ThemeProvider, Header, Button } from "@govnepal/ui";

export function App() {
  return (
    <ThemeProvider>
      <Header officeNe="गृह मन्त्रालय" officeEn="Ministry of Home Affairs" serviceName="Citizenship" />
      <main id="main">
        <Button variant="primary" type="submit">Submit application</Button>
      </main>
    </ThemeProvider>
  );
}
```

`react` and `react-dom` are peer dependencies (18+). Load the three stylesheets once at the root;
without them the components render unstyled, because the styling is deliberately not in this package.

**React Server Components:** every interactive component is marked `"use client"`, so the library
drops into a Next.js App Router (or any RSC framework) without a wrapper. The server-safe theme
utilities — `themeInitScript` (to inline in `<head>`) and `applyTheme` — live in a non-client module
(`themeCore`) and are re-exported, so a Server Component can import them without pulling the client
provider across the boundary.

## Why behavior-only

- **`@govnepal/css`** owns colour, spacing, the type scale, all six display modes, print, density
  — the whole visual truth.
- **`@govnepal/ui`** owns ARIA, keyboard, focus, and state.

So a Vue or Web Component port later re-implements behavior only, never a design decision — and a
plain-HTML site can already use the CSS classes without any of this. What the React layer buys you
is the wiring that is easy to ship subtly wrong: a `<button>` that is really a button, an error
summary that actually moves focus, a live region that announces once and not on every navigation.

## The ten components

| Component | The behavior it adds beyond the CSS class |
|---|---|
| `ThemeProvider` / `useTheme` | The §10.2 provider: mode (+ large-text, reduced-motion), language, calendar, density; OS-preference defaults until the user chooses; device persistence; `nested` mode-preview subtrees. |
| `Container`, `Stack`, `PageSection` | The `as` prop, so a stack can be a `<fieldset>` and a band a labelled `<section>` — semantics pure CSS can't give. |
| `Button` | Real `<button>`, `type="button"` default (no accidental submit), the loading contract (`aria-busy`, label kept, repeat clicks ignored), `aria-disabled` instead of `disabled` so it stays reachable. |
| `Link` | The accessible-name half of the external `↗` / download `↓` markers, so the marker never ships without spoken text; hardened `rel` for external links. |
| `TextInput` | Label binding, `aria-describedby` joining hint then error, `aria-invalid` only on error, a stable id the error summary can target. |
| `ErrorSummary` | Focus moves to it on appearance; each entry moves focus **into** its field, not just scrolls near it; built from the same validation result as the inline errors. |
| `Alert` | The live-region contract — dynamic alerts announce (assertive for error/emergency), static ones don't; the emergency variant is never given a citizen dismiss. |
| `Badge` | Renders one status from the generated taxonomy; a status outside `data/status-taxonomy.yaml` is a TypeScript error, not a runtime surprise. |
| `Header` | Banner role, skip link first, text language switcher, and the emblem handled as a required asset — see below. |

## Generated, not hand-typed

`Badge` renders status labels **verbatim** from `data/status-taxonomy.yaml`. Retyping the eight
bilingual labels here would be the "locally invented synonym" the glossary rules forbid, so
`build/generate.mjs` emits `src/generated/statusTaxonomy.ts` from the guidelines before every
build. `StatusId` is a union of the real ids; the taxonomy is the single source.

## The emblem gap

`Header` takes the emblem as a **prop** and never draws it — recreating, recolouring, or tracing
the coat of arms is prohibited (identity/emblem), and `design-assets/emblems/files/` is currently
empty. With no `emblem` passed, it renders an explicit, labelled "asset missing" placeholder for
development; a test asserts the placeholder contains no `<img>` or `<svg>`, so invented artwork
can't slip in. The real emblem drops in as a prop the moment the master exists.
