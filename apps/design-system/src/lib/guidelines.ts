/**
 * Read the synced design-guidelines at build time. The docs site RENDERS the guidelines; it never
 * hand-authors their content (AGENTS.md). Everything shown on the site traces back to a file under
 * `.guidelines/`, which `pnpm sync` populates from the pinned guidelines ref.
 *
 * This runs only in Astro's build/SSR step (Node), never in the browser.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

// `astro dev`/`build` run with cwd = this app's directory; the synced copy lives at the monorepo
// root two levels up. Resolving from cwd keeps this working in both dev and CI.
const GUIDELINES = resolve(process.cwd(), "../../.guidelines");

export function readGuidelineFile(relativePath: string): string {
  return readFileSync(resolve(GUIDELINES, relativePath), "utf8");
}

/** Split a guideline markdown file into its YAML frontmatter block and body. */
export function splitFrontmatter(markdown: string): { frontmatter: string; body: string } {
  const match = markdown.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { frontmatter: "", body: markdown };
  return { frontmatter: match[1], body: match[2] };
}

export interface Principle {
  no: string;
  title: string;
  meaning: string;
}

/**
 * The seven principles (§1.3) are a markdown table in the vision-principles chapter. Parsing the
 * table keeps the site in step with the source — a principle reworded upstream updates here on the
 * next sync, with no edit to the site.
 */
export function readPrinciples(): Principle[] {
  const { body } = splitFrontmatter(readGuidelineFile("guidelines/01-overview/03-vision-principles.md"));
  const rows = body
    .split("\n")
    .filter((line) => /^\|\s*\d+\s*\|/.test(line)) // table rows that start with a number cell
    .map((line) => line.split("|").map((cell) => cell.trim()).filter(Boolean));
  return rows.map(([no, title, meaning]) => ({ no: no!, title: title!, meaning: meaning! }));
}

export const principles = readPrinciples();

/** The guidelines manifest version/status, for display. */
export function guidelinesVersion(): { version: string; status: string; commit: string } {
  return JSON.parse(readGuidelineFile("VERSION.json"));
}
