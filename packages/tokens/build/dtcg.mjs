/**
 * Load the W3C DTCG token files from design-guidelines and flatten them to `path -> value`,
 * resolving `{color.neutral.900}` aliases against the primitive palette.
 *
 * Aliases are resolved HERE, at build time, rather than emitted as `var()` chains. That is
 * what makes the guidelines' rule "product code consumes SEMANTIC tokens only; primitives
 * exist behind them" (tokens/README.md) structurally true: no primitive ever reaches the CSS
 * API, so no product can consume one.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

/** Token files that together form the base (light) set. */
export const BASE_FILES = [
  "tokens/color.primitive.json",
  "tokens/color.semantic.json",
  "tokens/spacing.json",
  "tokens/typography.json",
  "tokens/radius.json",
  "tokens/border.json",
  "tokens/icon.json",
  "tokens/motion.json",
  "tokens/elevation.json",
];

/** Display modes, per guidelines §5.2. Light is the base; the rest overlay it. */
export const COLOR_MODES = ["light", "dark", "high-contrast", "color-blind-safe"];
export const FLAG_MODES = ["large-text", "reduced-motion"];

/** Flatten a DTCG tree to `{ "color.text.primary": "{color.neutral.900}" }`. */
function flatten(node, prefix = "", out = {}) {
  if (node && typeof node === "object") {
    if ("$value" in node) {
      out[prefix] = node.$value;
      return out;
    }
    for (const [key, child] of Object.entries(node)) {
      if (key.startsWith("$")) continue;
      flatten(child, prefix ? `${prefix}.${key}` : key, out);
    }
  }
  return out;
}

const ALIAS = /^\{([^}]+)\}$/;

/**
 * Resolve alias chains. A semantic token may point at a primitive, and a mode may point at a
 * different primitive; neither may point at another semantic token, but we follow chains anyway
 * so the generator does not silently emit a literal `{...}` string into a stylesheet.
 */
function resolveAliases(flat) {
  const resolved = {};
  const resolveOne = (path, seen = new Set()) => {
    if (path in resolved) return resolved[path];
    if (seen.has(path)) throw new Error(`Circular token alias at ${path}`);
    seen.add(path);

    const raw = flat[path];
    if (raw === undefined) throw new Error(`Token alias points at a token that does not exist: ${path}`);

    const match = typeof raw === "string" ? raw.match(ALIAS) : null;
    const value = match ? resolveOne(match[1], seen) : raw;
    resolved[path] = value;
    return value;
  };

  for (const path of Object.keys(flat)) resolveOne(path);
  return resolved;
}

function readTokenFile(guidelinesDir, file) {
  return JSON.parse(readFileSync(resolve(guidelinesDir, file), "utf8"));
}

/**
 * Build the fully-resolved token set for one mode.
 *
 * A mode file overrides only the tokens it changes (tokens/modes/README.md), so it is overlaid
 * on the base set before aliases are resolved — a mode that repoints `color.text.primary` at a
 * different primitive must resolve against the primitives, not against the light-mode result.
 */
export function loadMode(guidelinesDir, mode) {
  const flat = {};
  for (const file of BASE_FILES) Object.assign(flat, flatten(readTokenFile(guidelinesDir, file)));

  if (mode && mode !== "light") {
    Object.assign(flat, flatten(readTokenFile(guidelinesDir, `tokens/modes/${mode}.json`)));
  }

  const resolved = resolveAliases(flat);

  // Primitives are the raw palette behind the semantics. They are deliberately dropped here so
  // they never become part of the published CSS or JSON API.
  const semantic = {};
  for (const [path, value] of Object.entries(resolved)) {
    if (isPrimitive(path)) continue;
    semantic[path] = value;
  }
  return semantic;
}

/** `color.neutral.900` and `color.alpha.scrim` are primitives; `color.text.primary` is not. */
export function isPrimitive(path) {
  const primitiveHues = new Set([
    "neutral", "blue", "simrik", "red", "green", "amber", "teal", "gold", "purple", "alpha",
  ]);
  const [group, hue] = path.split(".");
  return group === "color" && primitiveHues.has(hue);
}

/** `color.text.primary` -> `--gov-color-text-primary`; `type.body.fontSize` -> `--gov-type-body-font-size`. */
export function cssVarName(path) {
  const kebab = path
    .split(".")
    .map((part) => part.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase())
    .join("-");
  return `--gov-${kebab}`;
}
