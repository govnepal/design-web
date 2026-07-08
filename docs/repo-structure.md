# nepal-government — Design System Repository Structure

**Org:** `github.com/govnepal` (staging) → `github.com/nepal-government` (official, once approved)
**Prefix:** all design-system repos use the `design-` prefix so they group together inside a broader government org and are instantly identifiable.

---

## Current phase (updated 2026-07-08)

The sections below describe the **full end-state architecture** (10 repos). While the team is
three people, we deliberately operate a **consolidated 4-repo subset** — the internal folder
structures match the end-state, so splitting back out later is mechanical:

| Active repo | Absorbs (end-state repos) | How |
|---|---|---|
| `design-guidelines` | — | Unchanged; already complete with the document pipeline. |
| `design-web` | `design-ui`, `design-tools`, `design-ai` | As `packages/tokens\|css\|ui`, `packages/checker`, `packages/ai`. npm publishing happens from the monorepo. |
| `design-assets` | `design-icons`, `design-fonts`, `design-figma` | As `icons/`, `fonts/`, `figma/` folders. Object storage deferred until the first large binary. |
| `.github` | — | Unchanged. |

Also deferred until there is real demand: tag-pinning between our own repos (internal-only
consumers), rc/pilot release machinery, per-rule fixtures, non-light/dark display modes,
hosted checker API, remote MCP. **Not deferred:** bilingual `_ne` fields, semantic tokens,
permanent ids, WCAG 2.2 AA, the guidelines schemas, and the document pipeline — cheap now,
expensive to retrofit.

**Split-out trigger:** a package repo is re-created when it gains a dedicated owner or its
first external consumer (e.g. another ministry app installing `@nepal-gov/ui`).

Build order for this phase: docs-site MVP → ~10 real components (light+dark) → static depot
page → checker CLI + GitHub Action → skill/MCP.

---

## Repos at a glance

| Repo | Owner | Purpose | Consumed by |
|---|---|---|---|
| `design-guidelines` | Guidelines lead (gov) | Policy source of truth: content, tokens, rules, schemas | everything |
| `design-web` | Web lead | Design system site + asset depot + tool UIs (monorepo) | — |
| `design-ui` | Web lead | Published npm packages: `@nepal-gov/tokens`, `@nepal-gov/ui` — the UI kit every govt app installs | web, all govt apps, AI-generated code |
| `design-tools` | Web lead | Checker engines: accessibility, design/token conformance, AI review — CLI + API + Action | web, CI everywhere, design-ai |
| `design-ai` | Web lead | AI layer: MCP server, Claude Skill, AGENTS.md init, llms.txt generators | AI coding tools (Claude, Codex, Cursor…) |
| `design-icons` | Illustration lead | Official icon set (SVG + metadata) | web, figma |
| `design-assets` | Illustration lead | Catalog + small assets in git; large binaries in object storage (see §7) | depot |
| `design-fonts` | Fonts lead | Font packages, Devanagari subsetting, fallback stacks | web, figma |
| `design-figma` | Figma lead | Token sync config, naming maps, library changelog | — |
| `.github` | Shared | Org-wide templates, contribution process, org README | all |

Rules that make this work:
- **Consume by git tag, never by main.** `design-web` pins `design-guidelines@v0.1.0` etc.
- **All schemas live in `design-guidelines`.** Icon/asset metadata everywhere validates against them in CI.
- **Teams:** one GitHub team per repo with write access; everyone else contributes via PR.

---

## 1. `design-guidelines`

Owner: guidelines lead. The policy source of truth — the design system website, asset depot, token pipeline, Figma sync, and the official PDF/DOCX are all generated from this repo.

Principles:
1. **Plain text is the master.** Markdown + YAML/JSON in git. The HTML/PDF/DOCX handed to officials is a *build output*, never the source.
2. **Prose and data are separated.** Anything that is a table of values (colors, spacing, breakpoints, statuses) lives in a structured data file. Markdown explains *why*; data files are what tools consume.
3. **Everything bilingual-capable.** Every title/label field has an optional `_ne` (Nepali) counterpart from day one.
4. **Versioned like software**, with semver tags matching the guideline's own scheme (§19.3).
5. **Validated in CI** so a malformed edit can never break downstream consumers.

```
design-guidelines/
├── guidelines.yaml              # manifest: version, status, owner, languages
├── CHANGELOG.md
├── content/                     # 01-executive-summary.md … 20-compliance-checklist.md
│   └── <section>/examples/      # do-*.png / dont-*.png images referenced by guidance items
├── identity/                    # national identity specifications (see 1.1a):
│   ├── emblem.md                #   construction, clear space, min sizes, color values
│   ├── flag.md                  #   constitutional geometric construction, digital use
│   ├── government-header.md     #   placement in the official header, ne/en lockups
│   ├── co-branding.md           #   ministry/department co-branding rules
│   ├── favicon-app-icon.md      #   emblem at small sizes; approved simplifications
│   └── <topic>/examples/        #   misuse gallery: do-*/dont-* images per topic
├── tokens/                      # DTCG JSON: color.primitive, color.semantic,
│   │                            #   spacing, typography, radius, elevation, motion
│   └── modes/                   # semantic overrides per display mode:
│                                #   light, dark, high-contrast, color-blind-safe,
│                                #   large-text, reduced-motion (extensible)
├── data/                        # breakpoints, status-taxonomy, microcopy,
│                                #   nepal-fields, compliance-checklist (YAML)
├── rules/                       # machine-readable checkable rules for design-tools:
│                                #   one YAML per rule — id, section ref, severity,
│                                #   check type (automated | ai-assisted | manual),
│                                #   pass condition, fix guidance (en/ne)
├── components/                  # button.md, text-input.md … (§10.1 template)
├── patterns/
│   ├── citizen/                 # apply-for-service.md, track-application.md …
│   └── officer/                 # review-application.md, approve-reject.md …
├── schemas/                     # JSON Schemas for everything above + asset/icon metadata
└── .github/workflows/
    ├── validate.yml             # schema + cross-reference checks on PR
    └── release.yml              # on tag: build official PDF/HTML, publish package,
                                 #   repository_dispatch to design-web & design-figma
```

### 1.1 Schemas

**Top-level manifest — `guidelines.yaml`:**

```yaml
name: Nepal Government Digital Design Guidelines
name_ne: नेपाल सरकार डिजिटल डिजाइन निर्देशिका
theme: Civic Calm
version: 0.1.0            # semver; git tag v0.1.0 must match
status: draft             # draft | pilot | official
released: 2026-06-26
owner: Digital governance authority
accessibility_target: WCAG 2.2 AA
platforms: [web, mobile, desktop, kiosk]
languages: [ne, en]
```

**Section frontmatter (all files in `content/`):**

```yaml
---
id: color-system                # stable slug — never changes across versions; URLs derive from it
section: 8                      # ordering
title: Color system and design tokens
title_ne: रङ प्रणाली र डिजाइन टोकनहरू
status: draft                   # draft | pilot | official — per-section maturity
since: 0.1.0                    # version introduced
updated: 2026-06-26
summary: One-line description used in search results and navigation.
data_sources:                   # structured files this section's tables render from
  - tokens/color.primitive.json
  - tokens/color.semantic.json
related: [typography, developer-implementation]
---
```

Key rule: **`id` is permanent.** Sections can be renumbered/renamed across versions, but `id` never changes, so website URLs and cross-references survive updates. Tables of *values* are not written in the markdown body — the website renders them from the files in `data_sources`.

**Do/don't guidance items** are structured data, not prose, so the website renders them as consistent do/don't cards, translations happen field-by-field, and checker rules can reference them. Any section, identity spec, or component carries a `guidance:` list in frontmatter:

```yaml
guidance:
  - id: emblem-no-recolor
    do: Use the emblem only in its approved full-color, monochrome, or reversed variants.
    do_ne: …
    dont: Do not recolor, add gradients, or restyle the emblem to match a page theme.
    dont_ne: …
    why: The emblem is a legal mark of authority; altered versions undermine trust.
    do_image: examples/do-emblem-variants.png       # optional, relative to the file
    dont_image: examples/dont-emblem-recolor.png
    rule: emblem-approved-variants                  # optional link to a rules/ id
```

Example-image conventions: images live in an `examples/` folder next to the content file, named `do-*` / `dont-*`; CI verifies every referenced image exists. **Bad examples are manufactured mockups, never screenshots of real ministry websites.**

### 1.1a Identity specifications (`identity/`)

Flag/emblem/header specs are measured brand specifications, a different kind of content from UI guidance. Each identity file adds a `spec:` block to the standard frontmatter:

```yaml
---
id: emblem
title: National emblem
title_ne: राष्ट्रिय निशान छाप
status: draft
spec:
  construction: geometry and proportion rules (flag: the constitutional
                step-by-step construction method)
  clear_space: minimum clear space as a ratio of emblem height
  min_size: { screen: 24px, print: 10mm, favicon: see favicon-app-icon }
  colors:                        # exact values for digital AND print
    - { name: Government Crimson, hex: "#C1121F", rgb: …, cmyk: …, pantone: … }
    - { name: National Blue,      hex: "#003893", rgb: …, cmyk: …, pantone: … }
  variants: [full-color, monochrome, reversed-on-dark]
  backgrounds: approved surfaces the mark may sit on
  placement: header position, co-branding lockups (ne/en)
assets: [emblem-master-fullcolor, emblem-master-mono]   # ids in design-assets/emblems
guidance: [ …do/don't items, incl. the misuse gallery… ]
---
```

- **Master files live in `design-assets/emblems/`**, referenced by id — the guideline specifies, the asset repo distributes.
- **The misuse gallery is the highest-value part**: recolored, stretched, cropped, low-res, busy-background, watermark/pattern, redrawn — each as a `dont` item with image. §4.1 prohibits these in words; images make it enforceable.
- The machine-readable `spec.colors` and `variants` are what `design-tools/checks-design` uses for emblem-misuse detection.

### 1.1b Reserved future chapters

Structure reserves stable `id`s now so these land incrementally without renumbering — content can arrive chapter by chapter:

| id | Chapter | Notes |
|---|---|---|
| `iconography-style` | Icon grid, stroke, corner radius, filled/outline, metaphor rules | Prerequisite before mass icon production; `design-icons` validates against it |
| `illustration-photography` | Illustration style, depicting people across Nepali contexts, photo standards | Do/don't format |
| `data-visualization` | Chart types, color-blind-safe chart palettes mapped to modes, table vs. chart | Backs §13 dashboards |
| `motion` | Durations, easings, what may animate, reduced-motion behavior | The guidance behind the existing motion tokens/mode |
| `voice-and-tone` | Formality register (तपाईं), citizen vs. officer address, error tone, number/currency/date formatting (लाख/करोड, रु, BS display) | Extends §5 |
| `print-documents` | Letterheads, certificates, receipts, stamps | Placeholder marks scope |
| `email-sms` | Status-notification templates (application approved, correction required) | Part of service experience |
| `social-media` | Profile images, post templates, correct emblem use | Where misuse most often happens |
| `sound` | Notification sounds, kiosk audio cues | Accessibility-linked, later |

**Component spec (files in `components/`)** — mirrors the guideline's §10.1 documentation template; CI rejects a component missing any required field, enforcing "a component is official only when fully documented":

```yaml
---
id: button
name: Button
name_ne: बटन
category: core                  # core | forms | navigation | data | government | identity
status: draft                   # draft | pilot | official | deprecated
since: 0.1.0
updated: 2026-06-26
replaces: null                  # id of a deprecated component, if any
purpose: Trigger a single clear action such as submitting a form.
variants:
  - {name: primary, use: Main action on the page; one per view}
  - {name: secondary, use: Supporting actions}
  - {name: danger, use: Destructive/high-risk actions requiring confirmation}
sizes: [sm, md, lg]
states: [default, hover, pressed, focus, disabled, loading]
platforms: [web, mobile, desktop, kiosk]
tokens:                         # semantic tokens this component consumes
  - color.action.primary.default
  - space.4
  - radius.md
figma: "Button / Primary"       # library path per §17.3 naming
---

## When to use
## When not to use
## Anatomy
## Accessibility        (keyboard, focus, labels, contrast — required)
## Content              (label wording, ne/en behavior — required)
## Developer notes      (props, ARIA, responsive behavior — required)
```

The required markdown headings are also validated by CI (frontmatter carries the enumerable facts; headings carry the prose).

**Pattern spec (files in `patterns/`):**

```yaml
---
id: apply-for-service
name: Apply for a service
name_ne: सेवाका लागि आवेदन
audience: citizen               # citizen | officer
status: draft
since: 0.1.0
components: [stepper, text-input, file-upload, error-summary, alert]  # component ids
security:                       # §16 rules this pattern must implement
  - confirm-before-submit
  - save-draft
---

## User need
## Flow
## Content guidance
## Validation & error handling
## What happens after submission
```

**Token files (in `tokens/`)** — use the **W3C Design Tokens Community Group format** (`$value` / `$type`): it's the emerging standard, supported by Style Dictionary and Tokens Studio (Figma sync), so Figma import and CSS-variable generation come for free.

**Display modes** are first-class: `tokens/modes/` holds one semantic-override file per mode — `light` (default), `dark`, `high-contrast`, `color-blind-safe`, `large-text`, `reduced-motion` — each remapping only the semantic tokens it changes. Adding a new mode later is a new file, not a schema change. Every mode file is validated for contrast in CI (see 1.4), so a mode can never ship with failing contrast pairs.

**Rule files (in `rules/`)** make the guidelines checkable by `design-tools`. Each rule references the guideline section it enforces:

```yaml
id: form-visible-labels          # stable rule id
section: forms-validation        # guideline section id (§11)
title: Inputs must have visible persistent labels
title_ne: …
severity: error                  # error | warning | info
check: automated                 # automated | ai-assisted | manual
applies_to: [web, mobile, desktop, kiosk]
pass: Every input has an associated visible label that persists after typing.
fix: Replace placeholder-only labels with a visible <label> bound to the input.
fix_ne: …
wcag: ["3.3.2"]                  # mapped WCAG criteria where applicable
```

`check: automated` rules run deterministically (DOM/axe/token analysis); `ai-assisted` rules (e.g. "microcopy is plain-language", "layout is calm/content-first") are evaluated by the AI reviewer in `design-tools` with the rule text as its rubric; `manual` rules render as checklist items in the compliance report.

```json
// color.primitive.json
{ "color": { "blue": { "700": { "$value": "#003893", "$type": "color", "$description": "National Blue" } },
             "neutral": { "50": { "$value": "#F7F7F5", "$type": "color", "$description": "Warm Background" } } } }

// color.semantic.json — references primitives; modes via per-mode files or $extensions
{ "color": { "background": { "default": { "$value": "{color.neutral.50}", "$type": "color" } },
             "action": { "primary": { "default": { "$value": "{color.blue.700}", "$type": "color" } } } } }
```

Product code and the website only ever consume **semantic** tokens (per the guideline's §8.2 token rule); primitives exist behind them.

**Structured data (in `data/`)** — e.g. `status-taxonomy.yaml`:

```yaml
statuses:
  - id: correction-required
    label: Correction required
    label_ne: सुधार आवश्यक
    meaning: User must fix information
    badge: warning
    requires_action: true
```

### 1.2 Versioning & releases

- **Semver git tags:** `v0.1.0` (draft) → `v0.5.x` (pilot) → `v1.0.0` (official) → `v2.0.0` (breaking, needs migration plan) — matching §19.3.
- `CHANGELOG.md` entry per release: **Added / Changed / Deprecated / Removed**, referencing section/component `id`s.
- Per-file `status` + `since` lets the website badge each section/component independently (a v1.0 release can still contain `pilot` components).
- Deprecations are never deleted immediately: set `status: deprecated` and `replaces` on the successor so the website auto-renders migration pointers.

### 1.3 Release pipeline

On tag, `release.yml`: builds the official PDF/HTML from `content/` (for the authority) → publishes a package (npm under a gov scope, or GitHub release tarball) → fires `repository_dispatch` to `design-web` and `design-figma`, which pull the tagged content, regenerate tokens/CSS variables, and rebuild. The website **pins to a tag, never `main`** — in-progress guideline edits can't break the live site.

### 1.4 CI validation rules

1. Every file validates against its schema in `schemas/`.
2. Every `id` is unique; every cross-reference (`related`, `components`, `replaces`, `{color.*}` token aliases) resolves.
3. Components with `status: official` must contain all required headings (Accessibility, Content, Developer notes).
4. Warn on missing `_ne` fields (error once bilingual content is mandated).
5. Manifest `version` matches the git tag on release.
6. Every display-mode file resolves all its token aliases and passes WCAG contrast checks for text/interactive pairs.
7. Every rule in `rules/` has a stable unique `id`, references an existing section, and (via a check against `design-tools` releases) has a registered checker implementation or is marked `manual`.
8. Every `guidance` item has a unique `id` and both `do` and `dont`; every referenced `do_image`/`dont_image` file exists; every `rule` reference resolves.
9. Identity specs: `spec.colors` values are valid, referenced `assets` ids exist in `design-assets`, and every identity file includes a misuse gallery (at least one `dont` item with image).

### 1.5 Migration from the current HTML draft

One-time, scriptable: split the existing v0.1 HTML into the 20 content files, extract its tables into the token/data files above, and generate frontmatter. After that, all editing happens in this repo and the official HTML/PDF is generated — never hand-edited again.

---

## 2. `design-ui`

Owner: web lead. The published packages every government web app installs — **the UI kit is the real product**; the website documents it. Separate from `design-web` so departments, vendors, and AI-generated code depend on packages, never on website internals — and `design-web` consumes them exactly like any ministry app would (dogfooding).

```
design-ui/
├── packages/
│   ├── tokens/                  # @nepal-gov/tokens — pulls design-guidelines@tag,
│   │                            #   generates CSS variables per display mode
│   │                            #   (light/dark/high-contrast/color-blind-safe/…)
│   ├── css/                     # @nepal-gov/css — framework-agnostic stylesheet
│   │                            #   (semantic HTML + classes; progressive enhancement)
│   └── ui/                      # @nepal-gov/ui — Civic Calm component library
│                                #   (mode-aware via CSS variable switching; every
│                                #    component maps to its design-guidelines spec id)
├── docs/                        # per-component developer notes (rendered by design-web)
└── .github/workflows/
    ├── ci.yml                   # design-tools checkers run on component fixtures;
    │                            #   every component tested keyboard-only + per mode
    └── release.yml              # publish to npm on tag; dispatch to design-web
```

Notes:
- Framework choice (React first vs. web components) is an open decision below; `@nepal-gov/css` exists regardless so plain-HTML sites and CMSes can comply without a JS framework.
- Component `id`s match `design-guidelines/components/` ids — the website links spec ↔ implementation, and `design-tools` can detect "hand-rolled almost-right component" vs. the real one.

---

## 3. `design-web`

Owner: web lead. Monorepo for all user-facing apps — installs `@nepal-gov/tokens` + `@nepal-gov/ui` from `design-ui` like any other government app.

```
design-web/
├── apps/
│   ├── design-system/           # docs site — renders design-guidelines content
│   │   └── (routes: foundations, components, patterns, accessibility, changelog;
│   │        mode switcher demoing every display mode on every component)
│   ├── depot/                   # asset depot — browse / search / download / contribute
│   │   └── (catalog ingested from design-icons, design-assets, design-fonts)
│   └── checker/                 # compliance tool UI — submit a URL, get a scored
│       └── (thin frontend over design-tools API: report per rule,
│            severity, evidence screenshots, fix guidance en/ne)
├── docs/                        # architecture decisions, proposals
└── .github/workflows/
    ├── ci.yml                   # runs design-tools checkers on our own apps —
    │                            #   the design system site must pass its own rules
    └── sync-releases.yml        # triggered by design-guidelines / design-ui release
                                 #   dispatch: bump pinned versions, rebuild, PR
```

Deploys independently per app; single PR flow for shared code. The checker UI stays thin — all evaluation logic lives in `design-tools` so CLI, API, and web UI can never disagree. Content rendering (guidelines sections, component specs) pairs each spec with live examples built from `@nepal-gov/ui`.

---

## 4. `design-tools`

Owner: web lead. The checker engines: evaluate any website (later: Figma files, mobile apps) against the guidelines and produce actionable reports with fixes. One engine, three delivery forms — **CLI** (for any team's CI), **API service** (backs the web checker UI), and **GitHub Action**.

```
design-tools/
├── packages/
│   ├── core/                    # crawl/render pages (headless browser), rule runner,
│   │                            #   report model (JSON), scoring, evidence capture
│   ├── rules-engine/            # loads rules/ from design-guidelines@tag;
│   │                            #   maps rule ids → checker implementations
│   ├── checks-accessibility/    # automated a11y: axe-core + WCAG 2.2 mapping,
│   │                            #   keyboard-trap/focus-visibility probes,
│   │                            #   contrast checks across ALL display modes
│   ├── checks-design/           # design conformance: token usage (colors/spacing/
│   │                            #   type actually used vs. approved tokens),
│   │                            #   type scale, tap-target sizes, layout/breakpoints,
│   │                            #   emblem misuse detection (recolor/distortion)
│   ├── checks-ai/               # AI-assisted rules: plain-language ne/en review,
│   │                            #   form-pattern quality, "calm/content-first" rubric,
│   │                            #   fix suggestions with code snippets
│   │                            #   (rule text from guidelines = the AI's rubric;
│   │                            #    AI findings always labeled + human-reviewable)
│   └── report/                  # renderers: JSON → HTML report / PR comment /
│                                #   compliance-checklist (§20) export
├── apps/
│   ├── cli/                     # `gov-design check <url>` — runs locally / in CI
│   └── api/                     # hosted service consumed by design-web checker app
├── action/                      # GitHub Action wrapper for department/vendor CI
├── fixtures/                    # known-good and known-bad test pages per rule
└── .github/workflows/
    ├── ci.yml                   # every rule id in guidelines has a fixture + test
    └── release.yml              # publish CLI package, action, API image
```

Design decisions that matter:

- **Rules live in `design-guidelines`, not here.** This repo implements *how* to check; the guidelines repo defines *what* to check (`rules/` YAML). A new guideline version can add/retire rules without touching tool code, and the tool always reports which guideline version it checked against.
- **Three check tiers** per rule (`automated` / `ai-assisted` / `manual`): deterministic checks are trusted; AI findings are clearly labeled as advisory with confidence and evidence; manual rules appear as a guided checklist so the report always covers the full §20 compliance surface.
- **Reports are the product.** Every finding = rule id + guideline link + severity + evidence (screenshot/selector) + concrete fix (en/ne). Export as HTML for humans, JSON for CI gates, and the §20 checklist format for procurement/QA.
- **Dogfooding:** `design-web` CI runs these checkers on the design system site and depot themselves — the system must pass its own standard before asking departments to.

Note: `rules-engine` and `report` are published as packages so `design-ai` (and any other consumer) can use them by tag.

---

## 5. `design-ai`

Owner: web lead. Makes AI coding tools (Claude, Codex, Cursor, …) generate guideline-compliant code *by default*. Its own repo because its audience (external developers' AI tooling) and release cadence (guidelines releases + MCP spec churn) differ from both `design-web` and `design-tools`; it consumes the published `rules-engine` from `design-tools` and content from `design-guidelines`, both by tag. A repo named `design-ai` is also what a developer searching "how do I hook my AI tools up to this" actually finds.

```
design-ai/
├── mcp/                         # MCP server: get_token (per display mode), get_component,
│   │                            #   get_pattern, get_icon, search_guidelines (ne/en),
│   │                            #   validate_snippet, check_page — wraps rules-engine
│   ├── local/                   #   npx @nepal-gov/design-mcp
│   └── remote/                  #   hosted MCP endpoint (no install needed)
├── skill/                       # Claude Skill "nepal-gov-design": SKILL.md index +
│   │                            #   on-demand reference files (tokens, typography, forms,
│   │                            #   identity, content rules, do/don'ts)
│   └── hooks/                   #   Claude Code hook: lint edited files during the session
├── agents-md/                   # AGENTS.md / CLAUDE.md template + `init` command
│                                #   (AGENTS.md is the cross-tool convention — not Claude-only)
├── generators/                  # build scripts: guidelines@tag → skill reference files,
│                                #   AGENTS.md template, llms.txt content for design-web
└── .github/workflows/
    ├── ci.yml
    └── release.yml              # on guidelines release dispatch: regenerate artifacts,
                                 #   publish mcp/skill/init packages
```

Three layers — context, capability, enforcement:

**Context — teach the model the rules:**
- `skill/` — a Claude Skill (`nepal-gov-design`): lightweight SKILL.md index + on-demand reference files (tokens, typography, forms, identity, content rules, do/don'ts). Dropped into any project.
- `agents-md/` — a short AGENTS.md/CLAUDE.md block written by `npx @nepal-gov/design init`; AGENTS.md is the cross-tool convention, so this is not Claude-only.
- `design-web` serves **`/llms.txt`** and every guideline page as clean markdown (e.g. `/components/button.md`) so any URL-fetching tool gets accurate, current guidance instead of training-data guesses (content generated here in `generators/`, served by the website).

**Capability — let agents query and self-check (MCP server):**
- Lookup tools: `get_token` (per display mode), `get_component`, `get_pattern`, `get_icon`, `search_guidelines` (bilingual).
- Validation tools: `validate_snippet` (run the rule engine on generated HTML/CSS *before* the agent presents it) and `check_page` (full checker against a dev server). This closes the loop: generate → validate → self-fix → present.
- Distribution: `npx @nepal-gov/design-mcp` locally + a hosted remote MCP endpoint; the server always reports which guidelines version it serves.

**Enforcement — the backstop:**
- Same `design-tools` CLI/Action gates AI-generated code in CI like human code.
- The skill ships a Claude Code hook that lints edited files during the session, so violations surface immediately, not at PR time.

Non-negotiables:
- **All AI artifacts are build outputs of the `design-guidelines` release pipeline** — skill reference files, AGENTS.md template, llms.txt content are generated from tagged guideline content, never hand-written, so AI context can never drift from policy.
- **Rules must be machine-followable.** Every new guideline chapter should answer "how would an AI verify this?" — the `rules/` YAML pass conditions are what make the AI layer real.
- **The UI kit stays the foundation.** The most effective compliance mechanism is making `@nepal-gov/ui` the easiest path; the AI layer steers tools toward using it rather than hand-rolling almost-right components.

---

## 6. `design-icons`

Owner: illustration lead. Icons are code-adjacent — they compile into a package the UI kit and depot both use.

```
design-icons/
├── src/                         # one optimized SVG per icon: passport.svg, ward.svg …
├── meta/                        # one YAML per icon (validates against guidelines schema):
│   └── passport.yaml            #   id, name, name_ne, category, tags, status, contributor
├── scripts/                     # optimize (svgo), build sprite/package/depot bundle
└── .github/workflows/
    ├── validate.yml             # SVG hygiene + metadata schema check on PR
    └── release.yml              # on tag: publish npm package + depot catalog bundle
```

Community entry point #1: "add an icon" = one SVG + one YAML in a PR.

---

## 7. `design-assets`

Owner: illustration lead. Everything visual that isn't an icon.

**Storage model (hybrid):** git holds the catalog and approval workflow; object storage + CDN holds large binaries. Metadata sidecars in git ARE the depot catalog — every asset has one, whether its file lives in git or in the bucket.

- **In git:** all `meta/` YAML, small vector exports (SVG), Lottie JSON, emblem masters (small + high-governance: the audit trail is the point).
- **In object storage (S3/R2) behind a CDN:** photos, videos, high-res exports, editable sources (.ai/.psd). Git/LFS is wrong for these — LFS bandwidth quotas make a public download service expensive and throttled, clones get slow, and GitHub's 100 MB file limit blocks video outright. Zero-egress storage (e.g. Cloudflare R2) matters for a free public depot; CDN delivery also serves the guidelines' low-bandwidth principle. **No Git LFS anywhere.**

```
design-assets/
├── emblems/                     # official emblem/flag/map masters — files IN git,
│   ├── files/                   #   restricted license, status: official only;
│   └── meta/                    #   ids referenced by design-guidelines identity/ specs
├── illustrations/
│   ├── export/                  # small web-ready SVG in git
│   └── meta/                    # per-asset YAML: title/title_ne, license, status
│                                #   (official | community | under-review), contributor,
│                                #   storage_key, checksum (sha256), sizes  ← for bucket files
├── photos/
│   └── meta/                    # metadata only; binaries live in the bucket
├── animations/
│   ├── files/                   # Lottie JSON in git; video renders in bucket
│   └── meta/
├── LICENSES.md                  # per-category licensing, emblem restrictions (§4.1)
└── .github/workflows/
    ├── validate.yml             # metadata schema + checksum/format checks
    └── release.yml              # on tag: publish depot catalog bundle;
                                 #   promote staged binaries → public bucket prefix,
                                 #   generate derived sizes (thumbs, webp)
```

**CI is the only writer to the bucket.** Contribution flow: binary is uploaded to a *staging* prefix (via the depot upload flow or a CI-issued upload URL) → PR adds the metadata with `storage_key` + checksum → moderation happens on the PR → merge promotes the file to the public prefix and generates derived sizes. Nobody hand-uploads to production storage, so the bucket can never drift from the approved catalog. The `checksum` field keeps integrity verifiable even though the binary lives outside git.

---

## 8. `design-fonts`

Owner: fonts lead.

```
design-fonts/
├── fonts/                       # woff2 per family/weight (incl. Devanagari)
├── subsets/                     # subsetting configs/scripts (e.g. Noto Sans Devanagari)
├── css/                         # @font-face stylesheets + fallback stacks
├── test/                        # Nepali rendering/line-height test pages
├── LICENSES/                    # per-family license files
└── .github/workflows/release.yml  # on tag: publish npm package / CDN bundle
```

---

## 9. `design-figma`

Owner: Figma lead. The Figma files live in Figma; this repo makes the library versioned and auditable.

```
design-figma/
├── tokens-sync/                 # Tokens Studio config → design-guidelines DTCG JSON
├── mapping/                     # component-name map: "Button / Primary" ↔ button id
├── library/
│   ├── CHANGELOG.md             # what changed per published library version
│   └── structure.md             # page structure per §17.1 (00 Cover … 99 Archive)
└── exports/                     # periodic token/style exports for audit diffing
```

---

## 10. `.github` (org-level)

Shared community-health defaults for every repo in the org.

```
.github/
├── profile/README.md            # org landing: what the design system is, repo map, roadmap link
├── CONTRIBUTING.md              # §19.2 contribution process (propose → review → pilot → official)
├── CODE_OF_CONDUCT.md
└── ISSUE_TEMPLATE/
    ├── propose-component.yml
    ├── propose-pattern.yml
    ├── submit-icon.yml
    ├── submit-asset.yml
    └── accessibility-issue.yml
```

Note: if `nepal-government/.github` already exists for the wider org, add these under it rather than overwriting existing content.

---

## Dependency flow

```
design-guidelines ──tags──────────► design-web (tokens, content, schemas,
        │  (content, tokens+modes,       ▲       llms.txt + .md endpoints)
        │   data, rules, schemas)        │              │ checker UI calls
        ├──────► design-figma            │              ▼
        ├──rules──► design-tools ────────┤        design-tools API/CLI
        │               │ rules-engine   │          (also runs in any
        │               ▼                │           department's CI via
        ├─content─► design-ai            │           GitHub Action)
        │             (MCP server, Claude Skill,
        │              AGENTS.md init → AI coding tools)
        └── schemas validate ┐           │
design-icons ────────────────┴───────────┤
design-assets ───────────────────────────┤──► depot app
design-fonts ────────────────────────────┘      │ download links
                                                ▼
object storage (S3/R2) ──► CDN ──► public downloads
  (written only by design-assets CI)
```

## Creation order

1. `.github` additions + teams/permissions
2. `design-guidelines` (migrate the v0.1 HTML draft into it; include `tokens/modes/` and first `rules/` set from day one)
3. `design-ui` — tokens package first (generated from guidelines), then core components
4. `design-web` skeleton installing `@nepal-gov/tokens` + `@nepal-gov/ui`
5. `design-icons`, `design-fonts` (feed the UI kit)
6. `design-tools` starting with `checks-accessibility` (axe + contrast across modes) — highest value, fully deterministic; design-conformance and AI checks follow
7. `design-ai` — skill + AGENTS.md first (cheap, immediate value), MCP server once rules-engine is published
8. `design-assets`, `design-figma` (parallel, non-blocking)

## Open decisions

| Decision | Recommendation |
|---|---|
| Token format | W3C DTCG (as above) — best tool ecosystem |
| Package distribution | npm package under a gov scope; GitHub release tarball as fallback |
| Nepali content timing | Fields present from day one; content backfilled before pilot (v0.5) |
| Who approves releases | Map §19.1 roles to GitHub CODEOWNERS on `content/`, `tokens/`, `components/` |
| Object storage provider | Cloudflare R2 (zero egress) or S3 + CloudFront — decide with hosting choice |
| Initial display modes | Ship light + dark at v0.1; high-contrast and color-blind-safe validated before pilot (v0.5); large-text and reduced-motion tracked as mode files from the start |
| AI checker model/hosting | Decide with API hosting; AI findings always advisory, labeled, human-reviewable |
| Remote MCP hosting | Decide with API hosting; local `npx` server ships first |
| UI kit framework | React components first (largest ecosystem) with `@nepal-gov/css` for framework-free use; web components later if demand appears |
| npm scope | Reserve `@nepal-gov` (or final org scope) on npm before first publish |
