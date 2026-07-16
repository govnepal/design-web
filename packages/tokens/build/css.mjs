/**
 * Emit the Civic Calm CSS custom properties.
 *
 * Layering, per guidelines §5.2 and §10.2:
 *   :root                        light mode — the base; semantic tokens at their default values
 *   [data-mode="…"]              dark | high-contrast | color-blind-safe — mutually exclusive
 *   [data-large-text]            composes with ANY color mode (type scale only)
 *   [data-reduced-motion]        composes with ANY color mode (durations -> 0ms)
 *   [data-density="…"]           spacing/control multiplier — never type (§5.1)
 *   @media (prefers-*)           OS defaults, applied only until the user chooses explicitly
 *
 * Only the tokens a mode actually CHANGES are emitted in its block, which is what lets
 * large-text and reduced-motion compose with dark rather than clobber it.
 */
import { cssVarName } from "./dtcg.mjs";

const isSpacing = (path) => path.startsWith("space.");

function declaration(path, value) {
  // Spacing is the one family that flexes with density: one multiplier, set once by the theme
  // provider, restyles every gap in the interface (§5.1.3). Type is deliberately never scaled —
  // text size changes only through the large-text display mode.
  const resolved = isSpacing(path) ? `calc(${value} * var(--gov-density-scale))` : value;
  return `  ${cssVarName(path)}: ${resolved};`;
}

function block(selector, tokens, comment) {
  const lines = Object.entries(tokens).map(([path, value]) => declaration(path, value));
  if (lines.length === 0) return "";
  return `${comment ? `/* ${comment} */\n` : ""}${selector} {\n${lines.join("\n")}\n}\n`;
}

/** Tokens present in `mode` whose value differs from light. */
export function diffFromLight(light, mode) {
  const changed = {};
  for (const [path, value] of Object.entries(mode)) {
    if (light[path] !== value) changed[path] = value;
  }
  return changed;
}

export function emitCss({ version, commit, light, modes, densities }) {
  const out = [];

  out.push(
    `/*!`,
    ` * Civic Calm design tokens — @govnepal/tokens`,
    ` * GENERATED from design-guidelines ${version} (${commit.slice(0, 8)}). Do not edit by hand:`,
    ` * change the tokens in design-guidelines and re-run the build.`,
    ` *`,
    ` * Semantic tokens only. Primitive palette values are resolved away at build time so that no`,
    ` * product can consume a raw hue — "product code consumes SEMANTIC tokens only" (tokens/README).`,
    ` */`,
    "",
  );

  out.push(block(":root", light, "Light mode — the base. Every other mode overlays only what it changes."));

  out.push(
    `/* Density (§5.1.3, data/density-rules.yaml). Scales spacing and control heights, never type.\n` +
      ` * Set once by the theme provider — "compact" is a context, not a per-team style choice. */`,
    `:root {\n  --gov-density-scale: 1;\n}`,
  );
  for (const { id, scale, rule } of densities) {
    if (scale === 1) continue; // The citizen default is already :root.
    out.push(`/* ${rule} */\n[data-density="${id}"] {\n  --gov-density-scale: ${scale};\n}`);
  }
  out.push("");

  for (const [mode, tokens] of Object.entries(modes)) {
    if (mode === "light") continue;
    const changed = diffFromLight(light, tokens);
    const selector =
      mode === "large-text" || mode === "reduced-motion"
        ? `[data-${mode}="true"]`
        : `[data-mode="${mode}"]`;
    out.push(block(selector, changed, `${mode} — ${Object.keys(changed).length} tokens overridden`));
  }

  // OS preferences are the DEFAULT, not an override: `:root:not([data-mode])` means an explicit
  // user choice always wins, exactly as the theme-provider contract in §10.2 requires.
  const osDefault = (query, selector, tokens, note) => {
    const changed = diffFromLight(light, tokens);
    if (Object.keys(changed).length === 0) return "";
    return `@media (${query}) {\n${block(selector, changed, note)
      .split("\n")
      .map((line) => (line ? `  ${line}` : line))
      .join("\n")}}\n`;
  };

  out.push(
    "/* OS preferences supply the default mode until the user chooses explicitly (§10.2). */",
    osDefault("prefers-color-scheme: dark", ":root:not([data-mode])", modes.dark, "OS dark preference"),
    osDefault("prefers-contrast: more", ":root:not([data-mode])", modes["high-contrast"], "OS high-contrast preference"),
    osDefault(
      "prefers-reduced-motion: reduce",
      ":root:not([data-reduced-motion])",
      modes["reduced-motion"],
      "OS reduced-motion preference",
    ),
  );

  return out.filter(Boolean).join("\n") + "\n";
}
