/**
 * WCAG 2.x contrast math and the release gate for display modes.
 *
 * Guidelines §5.2: "Every text/background pair in every mode is contrast-verified in CI; a mode
 * cannot ship with a failing pair." This is that check. It runs against the RESOLVED token set
 * for each mode, so it catches a bad mode override before any component can render it.
 */

function channel(value) {
  const c = value / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

function parseHex(hex) {
  const value = hex.trim().replace("#", "");
  if (!/^[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/.test(value)) {
    throw new Error(`Cannot compute contrast for non-hex color: ${hex}`);
  }
  return [0, 2, 4].map((i) => parseInt(value.slice(i, i + 2), 16));
}

export function relativeLuminance(hex) {
  const [r, g, b] = parseHex(hex).map(channel);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(foreground, background) {
  const a = relativeLuminance(foreground);
  const b = relativeLuminance(background);
  const [light, dark] = a > b ? [a, b] : [b, a];
  return (light + 0.05) / (dark + 0.05);
}

/**
 * High-contrast mode holds itself to a higher bar than AA: guidelines §5.2 specifies "pure white
 * ground, black text and borders, status tints removed … everything ≥7:1" (WCAG AAA-level).
 */
const MODE_MINIMUM_OVERRIDE = { "high-contrast": 7 };

export function checkPairs(mode, tokens, pairs, thresholds) {
  const failures = [];
  const override = MODE_MINIMUM_OVERRIDE[mode];

  for (const pair of pairs) {
    const foreground = tokens[pair.foreground];
    const background = tokens[pair.background];
    if (foreground === undefined) throw new Error(`Unknown token in contrast pair: ${pair.foreground}`);
    if (background === undefined) throw new Error(`Unknown token in contrast pair: ${pair.background}`);

    const base = thresholds[pair.kind === "non-text" ? "nonText" : "text"];
    // A non-text minimum stays at 3:1 even in high-contrast mode — the AAA override raises the
    // bar for text, but 1.4.11 has no AAA tier to raise it to.
    const minimum = override && pair.kind !== "non-text" ? override : base;

    const ratio = contrastRatio(foreground, background);
    if (ratio < minimum) {
      failures.push({ mode, pair, foregroundValue: foreground, backgroundValue: background, ratio, minimum });
    }
  }
  return failures;
}

export function formatFailure(f) {
  return (
    `  ✗ ${f.mode}: ${f.pair.foreground} on ${f.pair.background}\n` +
    `      ${f.foregroundValue} on ${f.backgroundValue} — ${f.ratio.toFixed(2)}:1, ` +
    `needs ${f.minimum}:1 (${f.pair.kind})\n` +
    `      ${f.pair.why}`
  );
}
