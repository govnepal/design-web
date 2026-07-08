# design-tools

Checker engines that evaluate websites (later: Figma files, mobile apps) against the
Nepal Government Digital Design Guidelines and produce actionable reports with fixes.

One engine, three delivery forms: CLI, hosted API (backs the web checker UI), GitHub Action.

## Packages
- `core` — crawl/render (headless browser), rule runner, report model, scoring, evidence
- `rules-engine` — loads `rules/` from design-guidelines@tag; maps rule ids → checkers
- `checks-accessibility` — axe-core + WCAG 2.2, keyboard/focus probes, contrast across all display modes
- `checks-design` — token conformance, type scale, tap targets, emblem misuse detection
- `checks-ai` — AI-assisted rules (plain-language, pattern quality); always advisory + labeled
- `report` — JSON → HTML report / PR comment / §22 compliance-checklist export

## Principles
- Rules live in design-guidelines; this repo implements how to check, not what.
- Every report states the guideline version it checked against.
- Every rule id has a fixture (known-good + known-bad page) and a test.
