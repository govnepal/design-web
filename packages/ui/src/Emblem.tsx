import type { ImgHTMLAttributes } from "react";
import { cx } from "./cx.js";

/**
 * The national identity marks — the coat of arms and the flag (identity/emblem, identity/flag).
 *
 * Both render as <img> pointing at the verified master shipped in @govnepal/css (and mirrored to
 * the consumer's web root). They are NEVER inlined or redrawn: recreating, recolouring, cropping,
 * or tracing either mark is prohibited (a constitutional/legal error, not a style choice), and the
 * emblem at ~40 KB gzipped would blow the page budget if inlined on every page — as an <img> it is
 * cached media the browser fetches once.
 *
 * No hooks, so these stay usable in a Server Component. `alt` defaults to English; a caller with
 * language context (the Header) passes the localized alternative text.
 */

const DEFAULT_EMBLEM_SRC = "/emblem-of-nepal.svg";
const DEFAULT_FLAG_SRC = "/flag-of-nepal.svg";

interface MarkProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "alt"> {
  /** Override where the master is served from. Defaults to the web root. */
  src?: string;
  /** Accessible name — the institution, per the identity spec; never "logo". */
  alt?: string;
}

export function Emblem({ src = DEFAULT_EMBLEM_SRC, alt = "Emblem of the Government of Nepal", className, ...rest }: MarkProps) {
  return <img src={src} alt={alt} className={cx("gov-emblem", className)} {...rest} />;
}

export function Flag({ src = DEFAULT_FLAG_SRC, alt = "National flag of Nepal", className, ...rest }: MarkProps) {
  // The flag has no rectangular canvas — its double-pennant silhouette sits on the page background
  // (identity/flag). Never box it; the CSS gives it no border or background plate.
  return <img src={src} alt={alt} className={cx("gov-flag", className)} {...rest} />;
}
