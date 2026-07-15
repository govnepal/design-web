#!/usr/bin/env node
/**
 * Build @govnepal/css.
 *
 * Two layers, deliberately separated:
 *
 *   GENERATED — anything carrying a policy number. The grid (max content width, per-breakpoint
 *   side margins) and the breakpoints themselves come from design-guidelines/data/, so no
 *   stylesheet hardcodes 1200px or 768px. Media queries cannot read custom properties, so the
 *   @media blocks are emitted rather than hand-written.
 *
 *   HAND-WRITTEN — src/*.css: the visual implementation of the component specs, consuming
 *   nothing but tokens and the generated layout variables.
 *
 * Fonts are copied from design-assets, never fetched from a CDN at runtime (§9.2, §10.2).
 */
import { cpSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { parse } from "yaml";

const packageDir = resolve(import.meta.dirname, "..");
const root = resolve(packageDir, "../..");
const guidelines = resolve(root, ".guidelines");
const assets = resolve(root, ".assets");
const dist = resolve(packageDir, "dist");

const readYaml = (file) => parse(readFileSync(resolve(guidelines, file), "utf8"));
const { version, commit } = JSON.parse(readFileSync(resolve(guidelines, "VERSION.json"), "utf8"));

// ---- Generated: the grid (data/grid.yaml, data/breakpoints.yaml) -------------------------
const grid = readYaml("data/grid.yaml");
const breakpoints = readYaml("data/breakpoints.yaml").breakpoints;
const bp = Object.fromEntries(breakpoints.map((b) => [b.id, b]));

const layoutCss = `/* GENERATED from data/grid.yaml and data/breakpoints.yaml — do not edit. */
:root {
  --gov-grid-columns: ${grid.columns};
  --gov-grid-gutter: ${grid.gutter_px}px;
  --gov-grid-max-width: ${grid.max_content_width_px}px;
  --gov-grid-margin: ${grid.margin.mobile_px}px;
}
@media (min-width: ${bp.tablet.min}px) {
  :root { --gov-grid-margin: ${grid.margin.tablet_px}px; }
}
@media (min-width: ${bp.desktop.min}px) {
  :root { --gov-grid-margin: ${grid.margin.desktop_px}px; }
}
`;

// ---- Generated: the print colour block (§5.1.5 — "dark mode never prints dark") -----------
// Print resolves from the semantic tokens forced to their LIGHT-mode values, whatever mode is
// active on screen. A [data-mode="dark"] override on :root would otherwise still be in force on
// paper. Re-stating light's values inside @media print is the only way to beat that override —
// and generating it from the token set means the print stylesheet still hardcodes no hex.
const lightTokens = JSON.parse(
  readFileSync(resolve(root, "packages/tokens/dist/tokens.json"), "utf8"),
).modes.light;

const printColors = Object.entries(lightTokens)
  .filter(([path]) => path.startsWith("color."))
  .map(([path, value]) => `    --gov-${path.replaceAll(".", "-")}: ${value};`)
  .join("\n");

const printCss = `/* GENERATED from the light-mode token set — do not edit. See src/print.css. */
@media print {
  :root {
${printColors}
  }
  body {
    background: var(--gov-color-background-surface);
    color: var(--gov-color-text-primary);
  }
}
`;

// ---- Fonts: copied from design-assets, with urls rewritten to sit beside the stylesheet ---
mkdirSync(dist, { recursive: true });
cpSync(resolve(assets, "fonts/fonts"), resolve(dist, "fonts"), {
  recursive: true,
  filter: (src) => !src.endsWith(".md"),
});

const fontsCss = readFileSync(resolve(assets, "fonts/css/fonts.css"), "utf8").replaceAll(
  "../fonts/",
  "./fonts/",
);
writeFileSync(resolve(dist, "fonts.css"), fontsCss);

// Emblem and flag masters (design-assets/emblems). Shipped as file assets — the emblem is ~40 KB
// gzipped, far too heavy to inline on every page, so it is served as a cached image (identity
// media the browser fetches once), never inlined. Consumers place these at their web root or
// reference @govnepal/css/emblems/*.svg directly.
cpSync(resolve(assets, "emblems/files"), resolve(dist, "emblems"), {
  recursive: true,
  filter: (src) => !src.endsWith(".md") && !src.endsWith(".gitkeep"),
});

// ---- Hand-written layers, concatenated in cascade order ----------------------------------
// Order matters: reset → tokens-derived layout → element defaults → components → print last.
const ORDER = [
  "reset.css",
  "base.css",
  "focus.css",
  "layout.css",
  "button.css",
  "link.css",
  "text-input.css",
  "choice.css",
  "select.css",
  "controls-extra.css",
  "forms-b.css",
  "disclosure.css",
  "error-summary.css",
  "alert.css",
  "banners.css",
  "badge.css",
  "card.css",
  "icon-button.css",
  "overlay.css",
  "data-display.css",
  "table.css",
  "states.css",
  "accordion.css",
  "progress-bar.css",
  "navigation.css",
  "nav-extra.css",
  "identity.css",
  "header.css",
  "print.css",
];

const srcDir = resolve(packageDir, "src");
const present = readdirSync(srcDir).filter((f) => f.endsWith(".css"));
const missing = ORDER.filter((f) => !present.includes(f));
const unlisted = present.filter((f) => !ORDER.includes(f));
if (missing.length) throw new Error(`src/ is missing: ${missing.join(", ")}`);
if (unlisted.length) throw new Error(`src/ has files not in the cascade order: ${unlisted.join(", ")}`);

const banner = `/*!
 * Civic Calm — @govnepal/css
 * The framework-agnostic visual layer. Semantic HTML plus .gov-* classes; no JavaScript.
 * Built against design-guidelines ${version} (${commit.slice(0, 8)}).
 *
 * This stylesheet holds ALL of Civic Calm's visual decisions. @govnepal/ui adds only behavior
 * (ARIA, keyboard, focus management) on top of these classes — so a plain-HTML site or a CMS
 * gets the same interface without a JS framework, and a future Vue or Web Component port
 * re-implements behavior only, never a design decision.
 */
`;

const parts = [banner, layoutCss];
for (const file of ORDER) {
  // The generated print colour block must land immediately before the structural print rules,
  // so the two read as one section in the output.
  if (file === "print.css") parts.push(printCss);
  parts.push(readFileSync(resolve(srcDir, file), "utf8"));
}
writeFileSync(resolve(dist, "civic-calm.css"), parts.join("\n"));

const bytes = readFileSync(resolve(dist, "civic-calm.css")).length;
console.log(
  `@govnepal/css built: ${ORDER.length} layers, ${(bytes / 1024).toFixed(1)} KB raw ` +
    `+ ${readdirSync(resolve(dist, "fonts")).length} font files, from guidelines ${version}.`,
);
