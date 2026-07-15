#!/usr/bin/env node
/**
 * Build @nepal-gov/tokens from design-guidelines.
 *
 * Outputs (all generated — never hand-edited):
 *   dist/tokens.css   the CSS custom properties every service consumes
 *   dist/tokens.json  the resolved token set per mode. The checker's `semantic-tokens-only` rule
 *                     needs this to know which computed values are actually approved, and the
 *                     mobile kit generates its theme constants from the same file.
 *   dist/index.js     typed JS access to the same data
 *
 * The build FAILS if any display mode has a failing contrast pair. Guidelines §5.2: "a mode
 * cannot ship with a failing pair." That is enforced here, not left to review.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

import { COLOR_MODES, FLAG_MODES, loadMode } from "./dtcg.mjs";
import { emitCss } from "./css.mjs";
import { checkPairs, formatFailure } from "./contrast.mjs";
import {
  contrastPairs,
  contrastThresholds,
  densities,
  guidelinesDir,
  quantifiedStandards,
  version,
} from "./guidelines.mjs";

const distDir = resolve(import.meta.dirname, "../dist");
const { version: guidelinesVersion, commit, status } = version();

const light = loadMode(guidelinesDir, "light");
const modes = { light };
for (const mode of [...COLOR_MODES.filter((m) => m !== "light"), ...FLAG_MODES]) {
  modes[mode] = loadMode(guidelinesDir, mode);
}

// ---- Contrast gate (guidelines §5.2) ----------------------------------------------------
const pairs = contrastPairs();
const thresholds = contrastThresholds();

// large-text and reduced-motion override no colors, so they inherit whichever color mode they
// compose with — there is no separate color surface for them to fail on.
const failures = COLOR_MODES.flatMap((mode) => checkPairs(mode, modes[mode], pairs, thresholds));

const checked = COLOR_MODES.length * pairs.length;
if (failures.length > 0) {
  console.error(
    `\nContrast gate FAILED — ${failures.length} of ${checked} pairs below the required ratio.\n` +
      `A display mode cannot ship with a failing pair (guidelines §5.2).\n`,
  );
  for (const failure of failures) console.error(formatFailure(failure) + "\n");
  process.exit(1);
}
console.log(
  `Contrast gate passed: ${pairs.length} pairs × ${COLOR_MODES.length} color modes = ${checked} checks.`,
);

// ---- Quantified standards (§4.1, §5.2) --------------------------------------------------
// Focus-ring geometry and touch-target minimums are policy but are not in the DTCG files, so
// they are folded in as tokens here. Otherwise every stylesheet would hardcode 44px and 2px —
// exactly what "never hardcode visual values" forbids. High-contrast widens the ring to 3px
// (§5.2); every other mode inherits the base, so the diff emits it only where it changes.
const { "focus.ring.width-high-contrast": highContrastRing, ...standards } = quantifiedStandards();
for (const [mode, tokens] of Object.entries(modes)) {
  Object.assign(tokens, standards);
  if (mode === "high-contrast") tokens["focus.ring.width"] = highContrastRing;
}

// Touch targets are deliberately NOT density-scaled: data/density-rules.yaml states that "48dp
// minimum touch targets survive every multiplier", so the officer desktop's 0.875 must never
// shrink a control below the 44px floor. Only `space.*` flexes with density (see css.mjs).

// ---- Emit -------------------------------------------------------------------------------
mkdirSync(distDir, { recursive: true });

const densityContexts = densities();
writeFileSync(
  resolve(distDir, "tokens.css"),
  emitCss({ version: guidelinesVersion, commit, light, modes, densities: densityContexts }),
);

const manifest = {
  guidelines: { version: guidelinesVersion, status, commit },
  densities: densityContexts,
  modes,
};
writeFileSync(resolve(distDir, "tokens.json"), JSON.stringify(manifest, null, 2) + "\n");

writeFileSync(
  resolve(distDir, "index.js"),
  `// GENERATED from design-guidelines ${guidelinesVersion}. Do not edit.\n` +
    `import manifest from "./tokens.json" with { type: "json" };\n\n` +
    `export const guidelines = manifest.guidelines;\n` +
    `export const densities = manifest.densities;\n` +
    `export const modes = manifest.modes;\n` +
    `export const tokens = manifest.modes.light;\n`,
);

writeFileSync(
  resolve(distDir, "index.d.ts"),
  `// GENERATED from design-guidelines ${guidelinesVersion}. Do not edit.\n` +
    `export type Mode = ${Object.keys(modes).map((m) => `"${m}"`).join(" | ")};\n` +
    `export type DensityContext = ${densityContexts.map((d) => `"${d.id}"`).join(" | ")};\n\n` +
    `export declare const guidelines: { version: string; status: string; commit: string };\n` +
    `export declare const densities: { id: DensityContext; rule: string; scale: number }[];\n` +
    `export declare const modes: Record<Mode, Record<string, string>>;\n` +
    `export declare const tokens: Record<string, string>;\n`,
);

console.log(
  `@nepal-gov/tokens built: ${Object.keys(light).length} semantic tokens × ${Object.keys(modes).length} modes ` +
    `from design-guidelines ${guidelinesVersion} (${status}) @ ${commit.slice(0, 8)}.`,
);
