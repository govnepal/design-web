import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { test } from "node:test";

const packageDir = resolve(import.meta.dirname, "..");
const srcDir = resolve(packageDir, "src");
const bundle = readFileSync(resolve(packageDir, "dist/civic-calm.css"), "utf8");

const src = readdirSync(srcDir)
  .filter((f) => f.endsWith(".css"))
  .map((f) => ({ file: f, text: readFileSync(resolve(srcDir, f), "utf8") }));

test("no hand-written stylesheet hardcodes a colour", () => {
  // "Never hardcode visual values (hex colors, px spacing) in product code — use semantic
  // tokens" (AGENTS.md, every repo). The generated blocks are exempt: they ARE the token values.
  for (const { file, text } of src) {
    const hex = text.match(/#[0-9a-fA-F]{3,8}\b/g) ?? [];
    assert.deepEqual(hex, [], `${file} hardcodes colour(s): ${hex.join(", ")}`);

    const rgb = text.match(/\b(rgb|hsl)a?\(/g) ?? [];
    assert.deepEqual(rgb, [], `${file} hardcodes colour(s): ${rgb.join(", ")}`);
  }
});

test("every var(--gov-*) reference resolves to a declared custom property", () => {
  // A typo like --gov-color-status-error-boarder is not a syntax error: the declaration just
  // silently resolves to nothing and the element renders unstyled. Only a test catches it.
  //
  // Declarations come from BOTH stylesheets, because that is the actual contract a consumer
  // signs up to: civic-calm.css is meaningless without tokens.css loaded alongside it. This test
  // is therefore also the guard against @govnepal/tokens renaming or dropping a token that this
  // package still consumes — a cross-package break that nothing else would catch.
  const tokensCss = readFileSync(
    resolve(packageDir, "../tokens/dist/tokens.css"),
    "utf8",
  );
  // A declaration follows `{` or `;` (or a line start) — anchoring to the line start alone would
  // miss `.gov-stack--1 { --gov-stack-gap: … }`, which declares on the selector's own line.
  const declared = new Set(
    [...`${tokensCss}\n${bundle}`.matchAll(/(?:^|[{;])\s*(--gov-[\w-]+)\s*:/gm)].map((m) => m[1]),
  );

  const referenced = new Map();
  for (const match of bundle.matchAll(/var\((--gov-[\w-]+)/g)) {
    referenced.set(match[1], (referenced.get(match[1]) ?? 0) + 1);
  }
  assert.ok(referenced.size > 40, `only ${referenced.size} token references found — build broken?`);

  const undeclaredRefs = [...referenced.keys()].filter((name) => !declared.has(name));
  assert.deepEqual(undeclaredRefs, [], `referenced but never declared: ${undeclaredRefs.join(", ")}`);
});

test("spacing is never bypassed with a raw pixel value", () => {
  // Vertical rhythm comes from `stack` and the space.* scale, never from a hand-picked margin
  // (components/stack.md). A handful of values are legitimately not spacing tokens, so they are
  // allowed by name rather than by pattern.
  const ALLOWED = new Set([
    "0", "1px", "2px", "100%", "50%", "720px", "48px", "0.15em", "0.25em", "0.1em", "-1px", "200%",
  ]);
  for (const { file, text } of src) {
    for (const match of text.matchAll(/^\s*(?:padding|margin|gap|inset)[\w-]*:\s*([^;]+);/gm)) {
      const raw = match[1].trim();
      // A calc() built from tokens is token-based spacing; don't split it apart into fragments.
      if (raw.includes("var(") || raw.includes("calc(")) continue;
      for (const value of raw.split(/\s+/)) {
        if (value === "auto") continue;
        assert.ok(
          ALLOWED.has(value),
          `${file}: spacing value "${value}" is not a space.* token — use var(--gov-space-N)`,
        );
      }
    }
  }
});

test("the focus ring is drawn with box-shadow, never outline-offset", () => {
  // outline-offset leaves the element's OWN background showing in the gap, so on a primary button
  // the double ring collapses into one thick edge — defeating §5.2's "visible on any background
  // including primary buttons and dark surfaces".
  const focus = src.find((s) => s.file === "focus.css").text;
  assert.match(focus, /box-shadow:/);
  assert.doesNotMatch(focus, /outline-offset:/);
});

test("the emblem is never drawn, only loaded from a verified master", () => {
  // identity/emblem: recreating, recolouring, or tracing the coat of arms is prohibited — an
  // outdated or redrawn emblem is a legal error, not a style choice. No stylesheet may produce
  // emblem artwork.
  const header = src.find((s) => s.file === "header.css").text;
  assert.doesNotMatch(header, /background-image|content:\s*url|mask-image/);
});

test("a button styled as a link keeps its label colour through the visited state", () => {
  // A <a class="gov-button--primary"> is a legitimate "start" CTA. The generic `a:visited` rule
  // (link.css) has higher specificity than a single button class, so without an explicit :visited
  // override the label would turn the visited-link colour — invisible on the filled button — after
  // one click. Each filled variant must pin its label colour on :visited.
  const button = src.find((s) => s.file === "button.css").text;
  for (const variant of ["primary", "secondary", "destructive"]) {
    assert.match(
      button,
      new RegExp(`\\.gov-button--${variant}:visited`),
      `.gov-button--${variant} must handle :visited so a link-styled button stays legible after a click`,
    );
  }
});

test("print forces the light-mode token values so dark mode never prints dark (§5.1.5)", () => {
  const printBlock = bundle.slice(bundle.indexOf("@media print"));
  assert.match(printBlock, /--gov-color-background-surface:\s*#FFFFFF/i);
  assert.match(printBlock, /--gov-color-text-primary:\s*#1F1F1F/i);
});
