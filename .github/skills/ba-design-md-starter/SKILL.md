---
name: ba-design-md-starter
description: Create a minimal DESIGN.md design contract for starting UI/product design work. Use when the agent must generate or update a DESIGN.md file from a brief, brand notes, screenshots, existing product UI, design system, stakeholder preferences, or desired style; capture visual theme, tokens, typography, layout, components, responsive behavior, accessibility guardrails, and agent prompts using Claude Design/Open Design/Google DESIGN.md-style best practices. Can also capture a design system from a live website URL or Figma file, and falls back to a NashTech default design system when no source is available.
---

# BA DESIGN.md Starter

## Core purpose

Create `DESIGN.md` as a compact design contract that humans and AI agents can read before producing screens, prototypes, dashboards, artifacts, or frontend code. The file should reduce generic UI output by making brand, layout, components, accessibility, and interaction rules explicit.

## When creating DESIGN.md

1. Gather inputs.
   - Product name, domain, audience, primary workflows.
   - Brand adjectives and anti-adjectives.
   - Existing screenshots, website, design system, UI kit, brand guide, competitor/reference products.
   - Target platforms: web, mobile, desktop, internal tool, dashboard, landing page, artifact/prototype.
   - Accessibility and compliance expectations.
   - **Design source check** — ask whether a live URL, Figma file, screenshot, or brand guide exists.
     - If yes → run the capture workflow below ("Capturing a design system from a live source") before writing `DESIGN.md`.
     - If no → use the NashTech default design system ("Default design system (no source available)") instead of asking further; note this choice in the Overview and mark those tokens **Proposed**.

2. Decide confidence.
   - Observed: visible in source UI/brand assets.
   - Provided: stated by user/client.
   - Inferred: reasonable but must be validated.
   - Proposed: recommended starting point when no source exists.

3. Write a minimal but usable file.
   - Prefer concrete token values over vague prose.
   - Keep tokens semantic: primary, surface, text, border, success, warning, danger.
   - Keep rationale short and action-oriented.
   - Include do/don't guardrails to prevent design drift.

4. Validate.
   - Check missing primary color, typography, contrast risks, component states, responsive behavior, and inconsistent corner/shadow rules.
   - If Node/npm is available and the project can use Google DESIGN.md tooling, consider `npx @google/design.md lint DESIGN.md`; otherwise perform a manual lint checklist.

## Recommended structure

Use the current open DESIGN.md pattern:

1. Optional YAML front matter for machine-readable tokens.
2. Markdown body for human-readable rationale and rules.
3. Sections in this order where relevant:
   - Overview
   - Colors
   - Typography
   - Layout
   - Elevation & Depth
   - Shapes
   - Components
   - Responsive Behavior
   - Accessibility
   - Do's and Don'ts
   - Agent Prompt Guide

Google's current DESIGN.md spec treats Overview, Colors, Typography, Layout, Elevation & Depth, Shapes, Components, and Do's/Don'ts as the canonical core. Responsive Behavior, Accessibility, and Agent Prompt Guide are useful practical extensions for AI-assisted product design.

## Capturing a design system from a live source

Run this before writing `DESIGN.md` whenever the user provides (or the project already has) a
live website URL, a Figma file, a screenshot, or an existing UI to extract tokens from. This
mirrors the dedicated design-system-capture workflow, condensed for direct use inside a
`DESIGN.md` pass.

1. **Identify the source type** — Web URL / Figma URL / Screenshot or image / Existing repo UI or CSS / Manual description. Ask only if it is not already clear from the conversation.
2. **Extract tokens** per source type:
   - **Web URL** — Use a browser automation tool (e.g. Playwright) to navigate key pages (homepage/landing, dashboard or list, a form page, and a component library page if one exists), screenshot each, and read computed CSS for: colors (`background-color`, `color`, `--color-*`/`--bg-*`/`--text-*` variables), typography (`font-family`, `font-size`, `font-weight`, `line-height` on `h1`–`h4`, `p`, `button`, `label`), spacing (`padding`/`margin` on cards and sections, `--spacing-*`), border radius (buttons, cards, inputs, badges), shadows (`box-shadow` on cards, dropdowns, modals), and border colors.
   - **Figma URL** — Use the Figma MCP tools if available (see `ba-wireframe-mockup-generation/references/figma-wireframe-guide.md` for setup) to read `get_variables`, `get_styles`, and `get_local_components`; extract fill colors, stroke colors, font properties, and effect (shadow) definitions.
   - **Screenshot / image** — Use vision analysis to read the visible palette, typography scale, spacing rhythm, and component shapes.
   - **Existing repo UI/CSS** — Read the project's CSS/SCSS variables, Tailwind config, or component library tokens directly instead of guessing.
   - **Manual description** — Collect token values through structured Q&A (`vscode_askQuestions` when available) if nothing else is accessible.
3. **Identify component patterns** — buttons (variants, radius, padding), cards, forms/inputs, navigation, badges/status chips, tables, modals/dialogs, alerts/toasts.
4. **Map extracted tokens into the `DESIGN.md` YAML front matter** — populate `colors`, `typography`, `spacing`, `rounded`, and `components` using the schema in `assets/DESIGN.template.md`. Tag each value **Observed** (read directly from source) or **Inferred** (estimated/derived).
5. **Preview before writing** — show the color palette, typography scale, and key component specs in chat; wait for user approval or adjustment before finalizing `DESIGN.md`.
6. **Note provenance** — record the source (URL, Figma link, screenshot name) and capture date in the Overview section so the contract stays traceable.

If the project also uses `nt-ba-wireframe-generation`/`ba-wireframe-mockup-generation` in HTML Design System or Figma mode, the same captured tokens should be reused there for consistency — do not capture twice.

## Default design system (no source available)

When there is no live URL, Figma file, screenshot, brand guide, or existing UI to capture from,
do not block on asking the user to invent one. Instead:

1. Read `references/nashtech-default-design-system.md` and apply its colors, typography, spacing, radii, and shadow tokens as-is.
2. Paste its ready-to-paste YAML block into the `DESIGN.md` front matter, adjusting only `name`/`description` for the actual product.
3. Tag every token from this default as **Proposed** (per the confidence levels above).
4. State clearly in the Overview: "No project-specific design system was available; NashTech default tokens applied as a starting baseline — replace once real brand assets or a design source are available."
5. Still run the Manual lint checklist below against the resulting file.

Do not silently reach for the NashTech default when the product clearly has its own brand and
assets are simply not yet supplied — ask for the source first in that case (e.g. a named client
project that is known to have a brand guide).

## Minimum artifact set

The generated `DESIGN.md` should include at least:

- Product/design intent.
- Color palette with roles and hex values.
- Typography hierarchy.
- Spacing/radius/elevation rules.
- Core components: buttons, inputs, cards, navigation, tables/lists, dialogs, alerts/toasts, charts if relevant.
- Interaction states: hover, focus, disabled, selected, loading, error.
- Responsive rules and touch targets.
- Accessibility guardrails.
- Do's and don'ts.
- Agent prompt guide with short reusable instructions.
- Open questions and assumptions.
- HTML token preview (see "HTML token preview" below).

## Output behavior

If asked to create a file in a repo:

1. Inspect existing UI/CSS/tokens/assets before writing.
2. Create or update `DESIGN.md` at the requested location, usually project root.
3. Use `assets/DESIGN.template.md` as the starting structure, populated either from a captured design system (see "Capturing a design system from a live source") or from the NashTech default (`references/nashtech-default-design-system.md`) when no source exists.
4. Do not overwrite existing design decisions silently; preserve and reconcile them.
5. If an existing `DESIGN.md` exists, update it with a change summary and unresolved questions.
6. Always generate the companion HTML token preview described below alongside `DESIGN.md`.

If asked only for content:

- Return a complete `DESIGN.md` block.
- Mark synthetic/proposed token choices clearly.

## Manual lint checklist

- YAML front matter starts and ends with `---`.
- Color tokens use valid CSS color values, preferably hex for portability.
- Typography tokens include font family, size, weight, line height, and letter spacing.
- Components reference tokens or repeat exact values consistently.
- Primary action color meets contrast expectations with text.
- Do not define duplicate sections.
- Section order is logical and stable.
- Do's/don'ts include anti-patterns, not only positive advice.
- Agent Prompt Guide is short enough to paste into a UI-generation prompt.

## Claude/Open Design-inspired workflow

Use this loop:

1. Discover the brief.
2. Lock direction with a small set of design principles and tokens.
3. Generate a first artifact/screen/prototype from `DESIGN.md`.
4. Critique against the contract: visual consistency, accessibility, component rules, responsiveness.
5. Revise `DESIGN.md` when the design contract is wrong, not just the screen.
6. Deliver the artifact plus the updated design contract.

## Quality bar

- Do not create a purely aesthetic moodboard; make rules operational.
- Do not copy a brand identity blindly; adapt to the product and user context.
- Include enough specificity for another agent to build consistent UI without re-asking.
- Keep DESIGN.md version-controllable and readable.
- Treat the format as evolving; if strict tool validation is unavailable, favor clear tokens and stable sections over speculative schema tricks.

## HTML token preview

Always produce a single self-contained HTML file that visualizes the tokens and components captured in `DESIGN.md`, so a human can eyeball the system in a browser without a build step.

1. **One file, no external dependencies.** Inline all CSS in a `<style>` block (derived from the YAML front matter tokens) and all markup in the same `.html` file — no separate `.css`/`.js` files, no CDN links.
2. **Cover every token category and core component**, at minimum:
   - Color palette swatches (role name + hex value shown per swatch).
   - Typography scale (render each type style with its own label showing family/size/weight).
   - Spacing/radius scale (labeled boxes at each step).
   - Buttons (primary, secondary, destructive, disabled).
   - Inputs (text field, select, checkbox/radio, error/helper state).
   - Cards/panels.
   - Badges/chips.
   - Alerts (success, warning, danger).
   - Table/list row if the source defines one.
3. **Output location** — write to `working-artifacts/design-system/<topic-or-task-name>/design-tokens-preview.html` at the workspace root (per the BA Agent's Artifact Output Location rule). Do not ask for confirmation before creating the folder or file.
4. **Naming** — use `design-tokens-preview.html` unless the user requests a different name.
5. Keep it purely illustrative: no navigation, no JS behavior beyond what is needed to show interactive states (e.g. `:hover`/`:focus` via CSS is enough; avoid scripting).

## Assets and source notes

- Use `assets/DESIGN.template.md` as the starter template.
- Read `references/source-notes.md` for bundled source provenance and web references.
- Read `references/nashtech-default-design-system.md` for the default fallback palette/tokens/typography to use when no project-specific design system is available.
- For Figma MCP setup (tool install, plugin, connection check) when capturing tokens from a Figma file, see `ba-wireframe-mockup-generation/references/figma-wireframe-guide.md`.
