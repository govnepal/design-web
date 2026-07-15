# @govnepal/css

The framework-agnostic visual layer. Semantic HTML plus `.gov-*` classes, no JavaScript. A
plain-HTML ministry site or a CMS gets the full Civic Calm interface without adopting a
component library — the four-step quick start in §10.2, minus the framework.

```
pnpm --filter @govnepal/css build     # regenerate dist/ from tokens + .guidelines + .assets
pnpm --filter @govnepal/css test
```

## Usage

```html
<link rel="stylesheet" href="@govnepal/tokens/tokens.css" />
<link rel="stylesheet" href="@govnepal/css/fonts.css" />
<link rel="stylesheet" href="@govnepal/css/civic-calm.css" />
```

`civic-calm.css` is meaningless without `tokens.css` loaded alongside it — every rule resolves a
`var(--gov-*)` the token package declares. A test enforces that contract, so if `@govnepal/tokens`
ever renames or drops a token this package still consumes, the build fails here rather than
rendering an element unstyled in production.

Semantic HTML already looks like Civic Calm before a single class is applied — that is the point
of `base.css`. Classes are for components (`.gov-button--primary`, `.gov-alert--emergency`), not
for making a heading look like a heading.

## This package holds ALL the visual decisions

That is the deliberate split with `@govnepal/ui`:

- **`css` owns every visual decision** — colour, spacing, the type scale, all six display modes,
  the print stylesheet, density. The whole visual truth of Civic Calm is here.
- **`ui` owns only behavior** — ARIA, keyboard, focus management, state. It renders these classes
  and adds no styling of its own.

So a plain-HTML site, a Drupal theme, or a future Vue / Web Component port re-implements *behavior
only* — never a design decision. The design decision was made once, here.

## Generated vs. hand-written

Anything carrying a policy **number** is generated, so no stylesheet hardcodes it:

| Generated from | Produces |
|---|---|
| `data/grid.yaml`, `data/breakpoints.yaml` | the grid variables and their per-breakpoint `@media` blocks (media queries can't read custom properties, so they're emitted) |
| the light-mode token set | the `@media print` colour block — see below |
| `design-assets/fonts/` | `fonts.css` + the woff2 files, copied and url-rewritten; never a CDN link (§9.2) |

Everything in `src/*.css` is hand-written: the visual implementation of the component specs,
consuming nothing but tokens and the generated layout variables. A test asserts that no
hand-written file contains a single hex or `rgb()` value.

## Two rules worth knowing

**The focus ring is `box-shadow`, never `outline-offset`.** `outline-offset` leaves the element's
own background showing in the gap, so on a primary button the double ring would be blue-on-blue and
collapse into one thick edge. `box-shadow` lets the gap be an actual colour — which is what §5.2
means by "visible on any background including primary buttons and dark surfaces." A test guards it.

**Dark mode never prints dark (§5.1.5).** Print isn't a seventh display mode — it's a rendering
target that forces every semantic colour token back to its light-mode value inside `@media print`,
because a `[data-mode="dark"]` override on `:root` would otherwise still be in force on paper. That
block is generated from the token set, so even this override hardcodes no hex.

## A known gap: the emblem

The government header renders the emblem from a verified master in `design-assets`. That directory
(`emblems/files/`) is **currently empty** — no official master exists yet, and the guidelines
prohibit redrawing, recolouring, or approximating the coat of arms (an outdated or invented emblem
is a legal error, not a style choice). So `header.css` styles a deliberately ugly
`.gov-header__emblem-missing` placeholder for development and **never draws emblem artwork** — a
test asserts the stylesheet contains no `background-image`, `mask-image`, or `content: url`. The
real emblem drops in the moment the master lands, with no CSS change.
