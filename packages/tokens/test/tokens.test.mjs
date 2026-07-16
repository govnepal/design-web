import assert from "node:assert/strict";
import { test } from "node:test";

import { COLOR_MODES, FLAG_MODES, cssVarName, isPrimitive, loadMode } from "../build/dtcg.mjs";
import { checkPairs, contrastRatio } from "../build/contrast.mjs";
import { contrastPairs, contrastThresholds, densities, guidelinesDir } from "../build/guidelines.mjs";

const ALL_MODES = [...COLOR_MODES, ...FLAG_MODES];
const light = loadMode(guidelinesDir, "light");

test("contrast math matches known WCAG values", () => {
  assert.equal(contrastRatio("#000000", "#FFFFFF").toFixed(2), "21.00");
  assert.equal(contrastRatio("#FFFFFF", "#FFFFFF").toFixed(2), "1.00");
  // Ratio is symmetric: which color is "foreground" must not change the result.
  assert.equal(
    contrastRatio("#003893", "#FFFFFF").toFixed(4),
    contrastRatio("#FFFFFF", "#003893").toFixed(4),
  );
});

test("every mode passes every contrast pair (guidelines §5.2)", () => {
  const pairs = contrastPairs();
  const thresholds = contrastThresholds();
  for (const mode of COLOR_MODES) {
    const failures = checkPairs(mode, loadMode(guidelinesDir, mode), pairs, thresholds);
    assert.deepEqual(
      failures.map((f) => `${f.pair.foreground} on ${f.pair.background} = ${f.ratio.toFixed(2)}:1`),
      [],
      `${mode} has failing contrast pairs`,
    );
  }
});

test("no primitive token reaches the public API", () => {
  // The whole point of resolving aliases at build time: "product code consumes SEMANTIC tokens
  // only; primitives exist behind them" (design-guidelines tokens/README.md). If a raw hue like
  // color.neutral.900 ever appears in the output, a product could consume it directly.
  for (const mode of ALL_MODES) {
    const leaked = Object.keys(loadMode(guidelinesDir, mode)).filter(isPrimitive);
    assert.deepEqual(leaked, [], `${mode} leaks primitive tokens`);
  }
});

test("every token resolves to a literal value, never a dangling {alias}", () => {
  for (const mode of ALL_MODES) {
    for (const [path, value] of Object.entries(loadMode(guidelinesDir, mode))) {
      assert.doesNotMatch(String(value), /^\{.*\}$/, `${mode}: ${path} did not resolve`);
    }
  }
});

test("a mode overrides only the tokens it changes, so modes compose", () => {
  // large-text must be able to compose with dark (§5.2). That only works if large-text touches
  // no color token and dark touches no type token — otherwise one would clobber the other.
  const largeText = loadMode(guidelinesDir, "large-text");
  const changedByLargeText = Object.keys(largeText).filter((k) => largeText[k] !== light[k]);
  assert.ok(changedByLargeText.length > 0, "large-text changes nothing");
  assert.ok(
    changedByLargeText.every((k) => k.startsWith("type.")),
    `large-text must change only type tokens, changed: ${changedByLargeText}`,
  );

  const dark = loadMode(guidelinesDir, "dark");
  const changedByDark = Object.keys(dark).filter((k) => dark[k] !== light[k]);
  assert.ok(
    changedByDark.every((k) => k.startsWith("color.")),
    `dark must change only color tokens, changed: ${changedByDark.filter((k) => !k.startsWith("color."))}`,
  );
});

test("reduced-motion collapses every duration to zero (§5.5)", () => {
  const reduced = loadMode(guidelinesDir, "reduced-motion");
  const durations = Object.entries(reduced).filter(([path]) => path.startsWith("motion.duration."));
  assert.ok(durations.length > 0);
  for (const [path, value] of durations) {
    assert.equal(value, "0ms", `${path} still animates in reduced-motion`);
  }
});

test("no font weight below 400 (§5.3 prohibits thin weights)", () => {
  const weights = Object.entries(light)
    .filter(([path]) => path.startsWith("font.weight."))
    .map(([, value]) => Number(value));
  assert.ok(weights.length > 0);
  for (const weight of weights) assert.ok(weight >= 400, `weight ${weight} is below the 400 floor`);
});

test("density contexts come from the guidelines, spanning officer and kiosk", () => {
  const scales = Object.fromEntries(densities().map((d) => [d.id, d.scale]));
  assert.equal(scales["citizen-website"], 1.0);
  assert.equal(scales["officer-desktop-app"], 0.875);
  assert.equal(scales["kiosk-counter"], 1.25);
});

test("css variable names match the mapping published in guidelines §10.2", () => {
  assert.equal(cssVarName("color.background.default"), "--gov-color-background-default");
  assert.equal(cssVarName("color.text.primary"), "--gov-color-text-primary");
  assert.equal(cssVarName("space.4"), "--gov-space-4");
  assert.equal(cssVarName("radius.md"), "--gov-radius-md");
  // camelCase in the DTCG source becomes kebab-case in CSS.
  assert.equal(cssVarName("type.body.fontSize"), "--gov-type-body-font-size");
});
