#!/usr/bin/env node
/**
 * Fetch the upstream repos pinned in sources.json, and record exactly what we got.
 *
 * design-guidelines is the single source of truth for this whole monorepo; design-assets holds
 * the verified fonts and emblem masters. Nothing here may hand-author what either already
 * defines. Every build output stamps the version recorded in the synced VERSION.json, so a
 * generated token file, a checker report, or an AI artifact can always name what it came from.
 */
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const { sources } = JSON.parse(readFileSync(resolve(root, "sources.json"), "utf8"));

const git = (args, cwd = root) =>
  execFileSync("git", args, { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();

const isTag = (ref) => /^v\d+\.\d+\.\d+/.test(ref);
const untagged = [];

for (const source of sources) {
  const dest = resolve(root, source.dest);
  const from = source.repo.startsWith(".") ? resolve(root, source.repo) : source.repo;

  if (existsSync(dest)) rmSync(dest, { recursive: true, force: true });
  git(["clone", "--quiet", "--depth", "1", "--branch", source.ref, from, dest]);

  const commit = git(["rev-parse", "HEAD"], dest);

  // design-guidelines carries a version manifest; design-assets does not. Only the guidelines
  // version is policy-bearing, so parse it where it exists and fall back to the ref elsewhere.
  const manifestPath = resolve(dest, "guidelines.yaml");
  let version = source.ref;
  let status = "n/a";
  if (existsSync(manifestPath)) {
    const manifest = readFileSync(manifestPath, "utf8");
    version = manifest.match(/^version:\s*(.+)$/m)?.[1]?.trim() ?? source.ref;
    status = manifest.match(/^status:\s*(.+)$/m)?.[1]?.trim() ?? "unknown";
  }

  writeFileSync(
    resolve(dest, "VERSION.json"),
    JSON.stringify({ name: source.name, version, status, ref: source.ref, commit }, null, 2) + "\n",
  );

  if (!isTag(source.ref)) untagged.push(source);
  console.log(`${source.name}: ${version} (${status}) @ ${commit.slice(0, 8)} → ${source.dest}/`);
}

// Cloning by branch rather than tag is a deliberate, temporary phase (see sources.json). Say so
// loudly, so it can never become an unnoticed default once there are real external consumers.
if (untagged.length > 0) {
  console.warn(
    `\n  ⚠  Consuming by BRANCH, not a tag: ${untagged.map((s) => `${s.name}@${s.ref}`).join(", ")}.\n` +
      `     Fine while consumers are internal-only; pin sources.json to tags before any\n` +
      `     external consumer installs these packages.\n`,
  );
}
