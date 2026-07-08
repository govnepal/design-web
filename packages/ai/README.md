# design-ai

Makes AI coding tools (Claude, Codex, Cursor, …) generate guideline-compliant code by default.

- `mcp/` — MCP server (`npx @nepal-gov/design-mcp` + hosted remote): get_token,
  get_component, get_pattern, get_icon, search_guidelines (ne/en), validate_snippet,
  check_page — wraps the design-tools rules-engine
- `skill/` — Claude Skill "nepal-gov-design": SKILL.md index + on-demand reference files,
  plus a Claude Code hook that lints edited files during the session
- `agents-md/` — AGENTS.md / CLAUDE.md template + `init` command (cross-tool convention)
- `generators/` — build scripts: guidelines@tag → skill references, AGENTS.md template,
  llms.txt content served by design-web

All artifacts are generated from tagged design-guidelines releases — never hand-written —
so AI context can never drift from policy. The server always reports which guidelines
version it serves. AI findings are advisory, labeled, human-reviewable.
