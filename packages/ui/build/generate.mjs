#!/usr/bin/env node
/**
 * Generate the data modules @govnepal/ui embeds from design-guidelines, so the components carry
 * no hand-typed policy. Runs before tsc.
 *
 * Right now that is just the status taxonomy (data/status-taxonomy.yaml): the Badge renders its
 * labels verbatim, bilingually, and the taxonomy is the single source for them (§7.3.2). Retyping
 * the eight statuses here would be exactly the "locally invented synonym" the glossary rules
 * forbid. The generated file is committed-adjacent (dist-time), never hand-edited.
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { parse } from "yaml";

const packageDir = resolve(import.meta.dirname, "..");
const guidelines = resolve(packageDir, "../../.guidelines");

const { version, commit } = JSON.parse(readFileSync(resolve(guidelines, "VERSION.json"), "utf8"));
const { statuses } = parse(readFileSync(resolve(guidelines, "data/status-taxonomy.yaml"), "utf8"));

const genDir = resolve(packageDir, "src/generated");
mkdirSync(genDir, { recursive: true });

const ids = statuses.map((s) => JSON.stringify(s.id)).join(" | ");
const entries = statuses
  .map(
    (s) =>
      `  ${JSON.stringify(s.id)}: { label: ${JSON.stringify(s.label)}, label_ne: ${JSON.stringify(
        s.label_ne,
      )}, badge: ${JSON.stringify(s.badge)}, requiresAction: ${Boolean(s.requires_action)} },`,
  )
  .join("\n");

const out = `// GENERATED from design-guidelines ${version} (${commit.slice(0, 8)}) — do not edit.
// Source: data/status-taxonomy.yaml (§7.3.2). Regenerate with build/generate.mjs.

export type StatusId = ${ids};
export type BadgeVariant = "neutral" | "info" | "success" | "warning" | "error";

export interface StatusEntry {
  label: string;
  label_ne: string;
  badge: BadgeVariant;
  /** correction-required is the one status that must sit beside an action link (§7.3.2). */
  requiresAction: boolean;
}

export const STATUS_TAXONOMY: Record<StatusId, StatusEntry> = {
${entries}
};
`;

writeFileSync(resolve(genDir, "statusTaxonomy.ts"), out);
console.log(`@govnepal/ui: generated statusTaxonomy.ts (${statuses.length} statuses) from guidelines ${version}.`);
