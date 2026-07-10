# apps/design-system

The public docs site. Renders design-guidelines content (sections, components, patterns, identity specs, do/don't cards) with live examples built from @nepal-gov/ui. Serves /llms.txt and every page as clean markdown for AI tools. Pinned to tagged guideline releases; shows version + changelog.

## Mode preview panel

Every live component example carries a preview panel (Radix ThemePanel equivalent): render the
example in any display mode — light / dark / high-contrast / color-blind-safe, composed with
large-text and reduced-motion — and in either language (ne/en), without leaving the page. The
panel is powered by a nested theme provider (guidelines §10.2) and doubles as the accessibility
review tool: a reviewer walks a component through all six modes in seconds. The whole-page
display-mode switcher remains separate in the site header.
