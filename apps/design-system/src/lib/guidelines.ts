/**
 * Read the synced design-guidelines at build time. The docs site RENDERS the guidelines; it never
 * hand-authors their content (AGENTS.md). Everything shown on the site traces back to a file under
 * `.guidelines/`, which `pnpm sync` populates from the pinned guidelines ref.
 *
 * This runs only in Astro's build/SSR step (Node), never in the browser.
 */
import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { parse } from "yaml";
import { marked } from "marked";

// `astro dev`/`build` run with cwd = this app's directory; the synced copy lives at the monorepo
// root two levels up. Resolving from cwd keeps this working in both dev and CI.
const GUIDELINES = resolve(process.cwd(), "../../.guidelines");

const read = (relativePath: string) => readFileSync(resolve(GUIDELINES, relativePath), "utf8");
export const readGuidelineFile = read;

/** Split a guideline markdown file into its parsed YAML frontmatter and body. */
export function parseDoc<T = Record<string, unknown>>(markdown: string): { data: T; body: string } {
  const match = markdown.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { data: {} as T, body: markdown };
  return { data: parse(match[1]) as T, body: match[2].trim() };
}

/** Render a guideline markdown body to HTML. Headings, lists, tables, links — nothing custom. */
export function renderMarkdown(body: string): string {
  return marked.parse(body, { async: false, gfm: true });
}

// --- Components ---------------------------------------------------------------------------

export interface GuidanceItem {
  id: string;
  do: string;
  dont: string;
  why: string;
}

export interface ComponentSpec {
  id: string;
  name: string;
  name_ne?: string;
  category: string;
  status: string;
  purpose: string;
  variants?: Array<{ name: string; use: string } | string>;
  states?: string[];
  platforms?: string[];
  tokens?: string[];
  guidance?: GuidanceItem[];
  /** True when every prose section is filled — a stub still says "purpose: TODO". */
  complete: boolean;
  bodyHtml: string;
}

export function listComponentIds(): string[] {
  return readdirSync(resolve(GUIDELINES, "components"))
    .filter((f) => f.endsWith(".md") && f !== "README.md")
    .map((f) => f.replace(/\.md$/, ""));
}

export function getComponent(id: string): ComponentSpec {
  const { data, body } = parseDoc<Record<string, unknown>>(read(`components/${id}.md`));
  return {
    id: data.id as string,
    name: data.name as string,
    name_ne: data.name_ne as string | undefined,
    category: (data.category as string) ?? "other",
    status: (data.status as string) ?? "draft",
    purpose: (data.purpose as string) ?? "",
    variants: data.variants as ComponentSpec["variants"],
    states: data.states as string[] | undefined,
    platforms: data.platforms as string[] | undefined,
    tokens: data.tokens as string[] | undefined,
    guidance: data.guidance as GuidanceItem[] | undefined,
    complete: !String(data.purpose ?? "").startsWith("TODO"),
    bodyHtml: renderMarkdown(body),
  };
}

/** All components, complete ones first, grouped-friendly (sorted by category then name). */
export function allComponents(): ComponentSpec[] {
  return listComponentIds()
    .map(getComponent)
    .sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name));
}

// --- Foundation chapters ------------------------------------------------------------------

export interface Chapter {
  id: string;
  title: string;
  title_ne?: string;
  summary?: string;
  status: string;
  folder: string;
  bodyHtml: string;
}

/** Read one chapter file, e.g. folder "05-foundations", file "02-color-system". */
export function getChapter(folder: string, file: string): Chapter {
  const { data, body } = parseDoc<Record<string, unknown>>(read(`guidelines/${folder}/${file}.md`));
  return {
    id: data.id as string,
    title: data.title as string,
    title_ne: data.title_ne as string | undefined,
    summary: data.summary as string | undefined,
    status: (data.status as string) ?? "draft",
    folder,
    bodyHtml: renderMarkdown(body),
  };
}

/** List the English chapter files in a folder (skips READMEs and .ne.md translations). */
export function listChapters(folder: string): Chapter[] {
  return readdirSync(resolve(GUIDELINES, "guidelines", folder))
    .filter((f) => f.endsWith(".md") && !f.endsWith(".ne.md") && f !== "README.md")
    .sort()
    .map((f) => getChapter(folder, f.replace(/\.md$/, "")));
}

// --- Templates ----------------------------------------------------------------------------

export interface TemplateSpec {
  id: string;
  name: string;
  name_ne?: string;
  category: string;
  status: string;
  purpose: string;
  composedOf?: string[];
  bodyHtml: string;
}

export function listTemplateIds(): string[] {
  return readdirSync(resolve(GUIDELINES, "templates"))
    .filter((f) => f.endsWith(".md") && f !== "README.md")
    .map((f) => f.replace(/\.md$/, ""));
}

export function getTemplate(id: string): TemplateSpec {
  const { data, body } = parseDoc<Record<string, unknown>>(read(`templates/${id}.md`));
  return {
    id: data.id as string,
    name: data.name as string,
    name_ne: data.name_ne as string | undefined,
    category: (data.category as string) ?? "other",
    status: (data.status as string) ?? "draft",
    purpose: (data.purpose as string) ?? "",
    composedOf: data.composed_of as string[] | undefined,
    bodyHtml: renderMarkdown(body),
  };
}

export function allTemplates(): TemplateSpec[] {
  return listTemplateIds()
    .map(getTemplate)
    .sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name));
}

// --- Manifest / principles ----------------------------------------------------------------

export interface Principle {
  no: string;
  title: string;
  meaning: string;
}

export function readPrinciples(): Principle[] {
  const { body } = parseDoc(read("guidelines/01-overview/03-vision-principles.md"));
  return body
    .split("\n")
    .filter((line) => /^\|\s*\d+\s*\|/.test(line))
    .map((line) => line.split("|").map((c) => c.trim()).filter(Boolean))
    .map(([no, title, meaning]) => ({ no: no!, title: title!, meaning: meaning! }));
}

export const principles = readPrinciples();

export function guidelinesVersion(): { version: string; status: string; commit: string } {
  return JSON.parse(read("VERSION.json"));
}
