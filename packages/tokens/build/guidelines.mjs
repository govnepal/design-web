/**
 * Read design-guidelines: the synced source of truth for this build.
 *
 * Everything checkable here — the contrast pairs, their thresholds, the density multipliers —
 * is POLICY and is read from the guidelines, never restated in this repo. design-web's rule is
 * "no hand-authored guideline content here" (AGENTS.md); this module is what keeps that honest.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { parse } from "yaml";

const GUIDELINES_DIR = resolve(import.meta.dirname, "../../../.guidelines");

const read = (file) => readFileSync(resolve(GUIDELINES_DIR, file), "utf8");

export const guidelinesDir = GUIDELINES_DIR;
export const readYaml = (file) => parse(read(file));
export const readJson = (file) => JSON.parse(read(file));

/** What we synced, so every generated output can name the policy version it came from. */
export const version = () => readJson("VERSION.json");

/** data/contrast-pairs.yaml — the pairs §5.2 requires every display mode to pass. */
export const contrastPairs = () => {
  const { pairs } = readYaml("data/contrast-pairs.yaml");
  if (!Array.isArray(pairs) || pairs.length === 0) {
    throw new Error("data/contrast-pairs.yaml has no pairs — the contrast gate would silently pass.");
  }
  return pairs;
};

/** data/quantified-standards.yaml — where §4.1's "sufficient contrast" resolves to numbers. */
export const contrastThresholds = () => {
  const { contrast } = readYaml("data/quantified-standards.yaml");
  if (!contrast?.text || !contrast?.non_text) {
    throw new Error("data/quantified-standards.yaml is missing contrast.text / contrast.non_text.");
  }
  return { text: contrast.text, largeText: contrast.large_text, nonText: contrast.non_text };
};

/**
 * The quantified values §4.1 and §5.2 name but the DTCG token files do not carry: focus-ring
 * geometry and touch-target minimums. They are policy (data/quantified-standards.yaml — "every
 * 'clear/comfortable/sufficient' in prose resolves to a number here"), so they are emitted as
 * tokens rather than left for each stylesheet to hardcode.
 */
export const quantifiedStandards = () => {
  const data = readYaml("data/quantified-standards.yaml");
  const focus = data.focus_indicator;
  const targets = data.touch_targets;
  if (!focus?.high_contrast_ring_px || !targets?.minimum_px) {
    throw new Error("data/quantified-standards.yaml is missing focus_indicator or touch_targets.");
  }
  return {
    // The double ring: 2px ring outside a 2px offset gap (§5.2). The 2px is the border.width.md
    // token; only the high-contrast widening is unique to this file.
    "focus.ring.width": "2px",
    "focus.ring.width-high-contrast": `${focus.high_contrast_ring_px}px`,
    "target.min-size": `${targets.minimum_px}px`,
    "target.recommended-size": `${targets.recommended_px}px`,
    "target.min-spacing": `${targets.spacing_min_px}px`,
  };
};

/** data/density-rules.yaml — the spacing multiplier per context (§5.1.3). */
export const densities = () => {
  const { contexts } = readYaml("data/density-rules.yaml");
  if (!Array.isArray(contexts) || contexts.length === 0) {
    throw new Error("data/density-rules.yaml has no contexts.");
  }
  return contexts.map(({ id, rule, scale }) => ({ id, rule, scale }));
};
