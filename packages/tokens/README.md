# @nepal-gov/tokens

The bridge from policy to code. Generates CSS custom properties from the W3C DTCG tokens in
`design-guidelines`, for every display mode. No product code should hardcode a visual value —
this package is why it never has to.

```
pnpm --filter @nepal-gov/tokens build     # regenerate dist/ from .guidelines/
pnpm --filter @nepal-gov/tokens test
```

Everything in `dist/` is **generated**. To change a token value, change it in `design-guidelines`
and re-run the build — never edit the output.

## Usage

```js
import "@nepal-gov/tokens/tokens.css";
```

```css
.thing {
  background: var(--gov-color-background-surface);
  padding: var(--gov-space-4);
  border-radius: var(--gov-radius-md);
}
```

## Two decisions worth knowing

**Aliases resolve at build time, so primitives do not exist in the CSS API.** The guidelines say
"product code consumes SEMANTIC tokens only; primitives exist behind them." Rather than emit
`--gov-color-neutral-900` and have the semantics point at it with `var()`, the build resolves
`{color.neutral.900}` down to `#1F1F1F` and drops the primitive entirely. You cannot consume a raw
hue because there is nothing to consume. A test enforces this.

**Density is one variable, not a fork of the scale.** Spacing emits as
`calc(16px * var(--gov-density-scale))`, so the officer desktop's 0.875 and the kiosk's 1.25
(§5.1.3) are set once by the theme provider on the root element. "Compact" is a context, not a
per-team style choice. Type is deliberately never scaled — text size changes only through the
`large-text` display mode.

## How modes layer

```html
<html data-mode="dark" data-large-text="true" data-density="officer-desktop-app">
```

| Selector | What it sets |
|---|---|
| `:root` | Light mode — the base. Every other mode overlays only what it changes. |
| `[data-mode]` | `dark`, `high-contrast`, `color-blind-safe` — mutually exclusive |
| `[data-large-text="true"]` | Type scale only — composes with any color mode |
| `[data-reduced-motion="true"]` | Durations → 0ms — composes with any color mode |
| `[data-density]` | Spacing and control multiplier — never type |

Because a color mode touches only `color.*` and `large-text` touches only `type.*`, they compose
instead of clobbering each other. A test enforces that too.

OS preferences (`prefers-color-scheme`, `prefers-contrast`, `prefers-reduced-motion`) supply the
default via `:root:not([data-mode])`, so an explicit user choice always wins — the theme-provider
contract in §10.2. A user who prefers *both* dark and high contrast gets high-contrast, since the
guidelines define only one high-contrast mode (white ground, §5.2's "shape over tint").

## The contrast gate

**The build fails if any display mode has a failing contrast pair.** §5.2: "a mode cannot ship
with a failing pair." The pairs are enumerated in `design-guidelines/data/contrast-pairs.yaml` and
the thresholds in `data/quantified-standards.yaml` — both read from the guidelines, never restated
here, so this build and the compliance checker's `contrast-aa` rule can never disagree about what
"every pair" means.

The gate is not decorative. Its first run caught three real defects in the shipped token set,
including a dark-mode destructive button whose white label got *less* readable the more the user
interacted with it (4.86:1 → 3.79:1 → 2.72:1 across default → hover → pressed). See the
design-guidelines changelog for 0.2.0-dev.

## Outputs

| File | Consumer |
|---|---|
| `dist/tokens.css` | Every service. ~3 KB gzipped — 1% of the 300 KB page budget (§8.1.5). |
| `dist/tokens.json` | The checker's `semantic-tokens-only` rule, which needs to know which computed values are approved; and the mobile kit, which generates its theme constants from the same file. |
| `dist/index.js` / `.d.ts` | Typed JS access to the same data. |

Every output records the guidelines version and commit it was generated from.
