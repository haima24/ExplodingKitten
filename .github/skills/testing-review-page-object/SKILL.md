---
name: testing-review-page-object

description: 'Use when reviewing Playwright page objects or components for POM compliance, locator quality, reuse, and maintainability. Do not use to generate page objects, complete test specs, execute tests, or investigate runtime failures; route those requests to sibling testing skills.'
---

# Testing Review Page Object

## Purpose
Review page-object and component implementations for POM architecture, locator quality, coding conventions, reuse, and downstream automation risk.

## Context First
Read all scoped models, related cases or requirements, UI context, repository instructions, and references. Ask when files or scope are incomplete; state traceability and runtime-evidence limitations.

## Workflow
1. **Baseline.** Input: source files and scope. Action: load POM, locator, coding standards, and checklist. Output: review boundary and asset inventory.
2. **Assess.** Input: boundary and context. Action: evaluate design, encapsulation, method semantics, duplication, selector robustness, and test-logic leakage. Output: prioritized findings.
3. **Report.** Input: findings. Action: produce severity-tagged recommendations using the report conventions. Output: report and findings under `working-artifacts/page-object-reviews-report/`.
4. **Handoff.** Input: report. Action: validate completeness and route code-generation needs. Output: downstream reuse decision.

## Output Contract
Create `Report-Review-Page-Object-<Scope-or-PR>.md` and, when needed, `Findings-Review-Page-Object-<Scope-or-PR>.md` under `working-artifacts/page-object-reviews-report/`. Include evidence, severity, locator and architecture risk, impact, recommendation, and downstream reuse decision.

## Decision Rules
1. Incomplete files for the declared scope require clarification before final decision.
2. Brittle selectors are a blocking recommendation when downstream reliability is at risk.
3. Non-blocking architecture violations receive severity and remediation.
4. Code-generation requests route to `testing-generate-page-object`.

## Quality Gate
- [ ] Standards, checklist, and applicable templates are applied.
- [ ] Architecture, locator quality, reuse, maintainability, and anti-patterns are assessed.
- [ ] Findings are evidence-based, prioritized, and actionable.
- [ ] Recommendations support safe downstream automation reuse.

## Knowledge Sources
- Standards: `references/standards/pom-standard.md`, `locator-standard.md`, `page-object-standard.md`, `automation-coding-standard.md`
- Checklist: `references/checklists/page-object-review-checklist.md`
- Templates: `references/templates/page-object.template.ts`, `component.template.ts`
- Example: `references/examples/test-script-login-example.md`

## Related Skills
- `testing-generate-page-object`
- `testing-implement-automation`
- `testing-review-automation`
