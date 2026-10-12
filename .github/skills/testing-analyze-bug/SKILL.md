---
name: testing-analyze-bug

description: 'Use when investigating a reported defect to establish reproducibility, impact, evidence quality, suspected root-cause area, and testing next actions. Do not use to implement fixes, run full regression, or write full automation suites; route those requests to sibling testing skills.'
---

# Testing Analyze Bug

## Purpose
Analyze bug reports and evidence into a test-focused investigation outcome with reproducibility, impact, suspected failure area, and actionable next steps.

## Context First
Read the bug, expected and actual behavior, environment, build, feature, evidence, and linked artifacts. Ask when bug context is missing; do not claim a root cause beyond the evidence.

## Workflow
1. **Baseline.** Input: bug report and context. Action: load relevant standards, checklists, templates, and examples. Output: evidence inventory and investigation boundary.
2. **Reproduce and assess.** Input: inventory. Action: validate conditions, affected scope, severity, and evidence quality. Output: reproducibility and impact assessment.
3. **Localize.** Input: observed behavior and dependencies. Action: identify likely failure area without inventing unsupported causes. Output: bounded hypothesis and information gaps.
4. **Report.** Input: assessment and hypothesis. Action: document findings, impact, evidence gaps, and fix-validation/regression next steps. Output: reports under `reports/`.
5. **Validate.** Input: reports. Action: apply the quality gate and expose blocked or unconfirmed analysis. Output: final report or marked investigation.

## Output Contract
Create `Report-Bug-Analysis-<Bug-ID-or-Title>.md` and, when needed, `Findings-Bug-Analysis-<Bug-ID-or-Title>.md` under `reports/`. Include reproduction notes, expected versus actual behavior, evidence quality, impact, suspected area with confidence, assumptions, open questions, and next actions.

## Decision Rules
1. Missing description or expected/actual behavior requires clarification.
2. Insufficient evidence makes reproducibility `Unconfirmed` and lists required evidence.
3. Missing critical dependencies blocks root-cause localization and is reported explicitly.
4. High-impact but non-reproducible issues require targeted monitoring and additional capture.

## Quality Gate
- [ ] Standards, checklist, and applicable template are applied.
- [ ] Reproducibility, impact, and findings are evidence-backed.
- [ ] Suspected causes are bounded and avoid unsupported claims.
- [ ] Fix validation and regression actions are actionable.

## Knowledge Sources
- Standards: `references/standards/testing-standard.md`, `automation-standard.md`
- Checklists: `references/checklists/clarification-questions.md`, `automation-review-checklist.md`
- Template: `references/templates/review-test-case-template.md`
- Example: `references/examples/review-test-case-example.md`

## Related Skills
- `testing-analyze-requirements`
- `testing-design-test-case`
- `testing-implement-automation`
- `testing-review-automation`
