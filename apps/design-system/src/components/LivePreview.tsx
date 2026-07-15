import { ModePanel } from "./ModePanel";
import { Showcase } from "./Showcase";

/**
 * ModePanel and Showcase composed as ONE React island.
 *
 * They must be composed here, in React, rather than in the .astro page as
 * `<ModePanel><Showcase/></ModePanel>` — React context does not cross an Astro island boundary, so
 * a Showcase slotted in from Astro could not see the ModePanel's nested ThemeProvider, and every
 * component that calls useTheme() (Header, Link, Badge…) would throw. Keeping the whole preview in
 * one island keeps the provider and its consumers in the same React tree.
 */
export function LivePreview() {
  return (
    <ModePanel>
      <Showcase />
    </ModePanel>
  );
}
