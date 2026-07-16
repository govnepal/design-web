/** Join class names, dropping falsy ones. No dependency needed for something this small. */
export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

/** The spacing steps that exist as tokens (space.* in the guidelines). Used to type `gap`. */
export type SpaceStep = 1 | 2 | 3 | 4 | 6 | 8;
