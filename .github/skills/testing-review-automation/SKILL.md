---
name: testing-review-automation

description: 'Use when reviewing Playwright automation scripts for standards compliance, reliability, maintainability, coverage, and merge risk. Do not use to generate cases or scripts, execute tests, or review empty scopes; route those requests to sibling testing skills.'
---

# Testing Review Automation

## Purpose
Review Playwright automation artifacts for defects, maintainability risks, standards violations, reliability, and coverage weaknesses before merge or release.

## Context First
Read all scoped automation, requirements or cases when available, repository instructions, and execution evidence. Ask when scope is unclear; mark traceability partial when referenced inputs are unavailable.

## Workflow
1. **Baseline.** Input: source files, scope, references, and evidence. Action: collect impacted assets and load standards and checklists. Output: review boundary.
2. **Assess.** Input: boundary and source. Action: evaluate quality, reliability, maintainability, anti-patterns, traceability, and coverage. Output: severity-tagged findings.
3. **Report.** Input: findings. Action: populate the review template with concrete recommendations and merge readiness. Output: report and findings under `working-artifacts/test-reviews/`.
4. **Validate.** Input: report. Action: verify completeness and decision support. Output: final review and follow-up route.

## Output Contract
Create `Report-Review-Automation-<Scope-or-PR>.md` and, when needed, `Findings-Review-Automation-<Scope-or-PR>.md` under `working-artifacts/test-reviews/`. Include evidence, severity, recommendation, traceability status, and merge-readiness decision. Do not modify source unless explicitly requested.

## Decision Rules
1. Unclear scope blocks review until clarified.
2. Missing references permit code-quality review but require a partial-traceability finding.
3. Severe risk is blocking and recommends no merge until resolved.
4. Minor non-blocking findings support merge only with follow-up actions.

## Quality Gate
- [ ] Standards, checklists, and template are applied.
- [ ] Findings contain severity, evidence, impact, and actionable recommendations.
- [ ] Reliability, maintainability, architecture, and coverage risks are covered.
- [ ] Report supports a clear merge-readiness decision.

## Knowledge Sources
- Standards: `references/standards/playwright-standard.md`, `assertion-standard.md`, `automation-coding-standard.md`, `automation-standard.md`
- Checklists: `references/checklists/automation-review-checklist.md`, `pull-request-checklist.md`
- Template: `references/templates/review-test-case-template.md`
- Example: `references/examples/test-script-login-example.md`

## Related Skills
- `testing-implement-automation`
- `testing-review-page-object`
- `testing-analyze-bug`
