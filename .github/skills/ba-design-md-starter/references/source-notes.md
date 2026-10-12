# Source Notes

Web sources reviewed on 2026-06-05:

- Google Labs blog: `https://blog.google/innovation-and-ai/models-and-research/google-labs/stitch-design-md/`
- Google Labs `design.md` GitHub repo: `https://github.com/google-labs-code/design.md`
- Google Labs `DESIGN.md` spec: `https://github.com/google-labs-code/design.md/blob/main/docs/spec.md`
- Anthropic Claude Code best practices: `https://code.claude.com/docs/en/best-practices`
- Anthropic Help Center on artifacts: `https://support.claude.com/*/articles/9487310-*`
- Open Design repo: `https://github.com/nexu-io/open-design`
- Awesome DESIGN.md repo: `https://github.com/VoltAgent/awesome-design-md`
- DesignDocs.dev: `https://www.designdocs.dev/`

Patterns extracted:

- Google describes DESIGN.md as an open, plain-text design-system format that can be used across tools; it includes machine-readable YAML front matter and human-readable Markdown rationale.
- The current Google spec defines design tokens for colors, typography, spacing, rounded corners, and components, and canonical sections such as Overview, Colors, Typography, Layout, Elevation & Depth, Shapes, Components, and Do's/Don'ts.
- Google tooling supports lint, diff, export, and spec commands through `@google/design.md`; the format is alpha and evolving.
- Claude Code best practices emphasize exploring first, planning, giving the agent verification criteria, and validating UI visually.
- Claude artifacts support iterative edits, version selection, viewing underlying code, copying, downloading, and running app-like outputs.
- Open Design describes an agent-native loop of discovering the brief, locking direction, streaming an artifact, critiquing, and delivering; it treats `DESIGN.md` as a brand/design contract.
- Awesome DESIGN.md popularized a practical 9-section schema: visual theme, colors, typography, components, layout, depth/elevation, do/don'ts, responsive behavior, and agent prompt guide.
