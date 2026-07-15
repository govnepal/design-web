import { allComponents, allTemplates, guidelinesVersion, listChapters, principles } from "@/lib/guidelines";

// Served at /llms.txt for AI tools (AGENTS.md: "serves /llms.txt and every page as clean markdown").
// A plain-text map of the system: what it is, the principles, the foundations, and every component
// with its status — so an AI coding tool can orient without scraping HTML.
export const dynamic = "force-static";

export function GET() {
  const v = guidelinesVersion();
  const components = allComponents();
  const templates = allTemplates();
  const foundations = listChapters("05-foundations");

  const lines = [
    "# Civic Calm — Nepal Government Digital Design System",
    "",
    `Unofficial, community-led. Built from design-guidelines ${v.version} (${v.status}).`,
    "Accessibility target: WCAG 2.2 AA. Everything bilingual (Nepali-first, Article 7).",
    "Packages: @govnepal/tokens (design tokens, 6 display modes), @govnepal/css (framework-agnostic stylesheet), @govnepal/ui (React components).",
    "",
    "## Principles",
    ...principles.map((p) => `- ${p.title}: ${p.meaning}`),
    "",
    "## Foundations",
    ...foundations.map((f) => `- /foundations/${f.id} — ${f.title}${f.summary ? `: ${f.summary}` : ""}`),
    "",
    "## Components",
    ...components.map(
      (c) => `- /components/${c.id} — ${c.name} [${c.category}, ${c.status}]${c.complete ? `: ${c.purpose}` : " (spec in progress)"}`,
    ),
    "",
    "## Templates (whole-page archetypes)",
    ...templates.map((t) => `- /templates/${t.id} — ${t.name} [${t.category}]: ${t.purpose}`),
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
