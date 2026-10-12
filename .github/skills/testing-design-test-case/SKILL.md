---
name: testing-design-test-case

description: 'Use when generating or refining traceable, risk-based Markdown test cases from requirements, stories, acceptance criteria, business rules, functional specifications, or API specifications. Do not use for execution, defect debugging, automation implementation, or review-only work; route those requests to sibling testing skills.'
---

# Testing Design Test Case

## Purpose
Generate maintainable, risk-based, traceable test-case documents from approved software requirements before automation or execution.

## Context First
Read the complete requirement source, repository instructions, and applicable references. Ask when source, scope, acceptance criteria, or format is missing; assume only explicit requirements and conventions, and label inferred rules and coverage decisions.

## Workflow
1. **Load baseline.** Input: requirement scope. Action: read standards, approach, techniques, template, and checklist. Output: applicable design baseline.
2. **Map behavior.** Input: complete requirements. Action: extract behavior, rules, data, actors, acceptance criteria, integrations, gaps, and contradictions. Output: coverage map with assumptions and questions.
3. **Design scenarios.** Input: coverage map and requested scope. Action: apply risk-based techniques and remove duplication. Output: prioritized scenario set.
4. **Generate.** Input: scenario set and format override. Action: populate the canonical template. Output: Markdown document under `working-artifacts/test-cases/`.
5. **Review.** Input: generated document. Action: apply the review checklist and expose unresolved gaps. Output: final document or marked draft.

## Output Contract
Use `TC-<US-ID>-<User-Story-Name>.md`, or `TC-FEATURE-<Feature-Name>.md` without an ID, under `working-artifacts/test-cases/`. Preserve the template's required information and traceability; format overrides are optional and explicit.

## Decision Rules
1. Ask whether coverage is functional, non-functional, or both when scope is unspecified.
2. Ask about ambiguity before finalizing; if unavailable, mark draft and list assumptions.
3. Identify scenarios affected by missing business rules and create questions rather than inventing rules.
4. Route execution, debugging, automation implementation, and review-only requests to `testing-review-test-case`, `testing-implement-automation`, or `testing-analyze-bug` as appropriate.

## Quality Gate
Apply [`test-case-review-checklist.md`](references/checklists/test-case-review-checklist.md). Final output is finalized only when the checklist permits it; otherwise expose findings and draft status.

## Knowledge Sources
- Standards: `references/standards/testing-standard.md`, `test-design-techniques.md`, `test-design-approach.md`
- Checklist: `references/checklists/test-case-review-checklist.md`
- Template: `references/templates/test-case.template.md`
- Invocation prompt: `prompt.md`

## Related Skills
- `testing-analyze-requirements`
- `testing-review-test-case`
- `testing-generate-page-object`
