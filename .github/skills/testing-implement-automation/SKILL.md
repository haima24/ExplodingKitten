---
name: testing-implement-automation

description: 'Use when implementing Playwright automation from approved test cases and existing project assets. Do not use for unapproved cases, page-object generation, automation review, test execution, or system-under-test changes; route those requests to the sibling testing skills.'
---

# Testing Implement Automation

## Purpose
Implement maintainable Playwright specs from approved cases while maximizing reuse of fixtures, page objects, components, utilities, and test data.

## Context First
Read approved cases, expected results, repository instructions, and existing automation assets. Ask when approval, scope, measurable outcomes, or approach is missing; state assumptions when evidence is incomplete. Select A1-A7 using [`implementation-approaches.md`](references/implementation-approaches.md).

## Workflow
1. **Baseline.** Input: approved cases and automation context. Action: identify eligible scenarios, dependencies, data, and reusable assets. Output: traceability and reuse map.
2. **Choose approach.** Input: map and available evidence. Action: confirm one primary approach and prerequisites. Output: recorded approach and locator evidence plan.
3. **Design.** Input: cases, map, and standards. Action: map arrange-act-assert steps to POM methods and measurable expected results. Output: implementation design.
4. **Implement.** Input: approved design. Action: create or update automation assets only, keeping locators and page behavior encapsulated. Output: specs under `working-artifacts/e2e/test/functions/`.
5. **Validate.** Input: generated assets. Action: apply standards and checklist, expose unverified locators and unresolved blockers. Output: validated specs and handoff.

## Output Contract
UI specs use `<Requirement-or-Feature>-<Flow>.spec.ts`; API specs use `<Requirement-or-Feature>-api.spec.ts`. Save under `working-artifacts/e2e/test/functions/`. Record traceability, selected approach, locator evidence, assumptions, and pending confirmation in the spec header or handoff.

## Decision Rules
1. Pause when case approval or measurable expected results are unclear.
2. Ask for an approach when none is supplied; use the reference prerequisites.
3. If the approach is unavailable, report the blocker and propose the next available approach.
4. Missing required page objects or fixtures block implementation and route to `testing-generate-page-object`.
5. Reuse existing utilities and models when duplication is detected.
6. Never change system-under-test source code; report required hooks or defects instead.

## Quality Gate
- [ ] Approved cases and expected results are traceable.
- [ ] One approach is recorded and standards, templates, and checklist are applied.
- [ ] POM reuse is maximized; assertions are supported and logic is not duplicated.
- [ ] No system-under-test source files changed.
- [ ] A4/A7 locator risks are explicit and unresolved blockers are visible.

## Knowledge Sources
- Standards: `references/standards/playwright-standard.md`, `assertion-standard.md`, `automation-coding-standard.md`, `automation-standard.md`
- Checklist: `references/checklists/automation-review-checklist.md`
- Templates: `references/templates/test.template.ts`, `api.template.ts`, `fixture.template.ts`
- Example: `references/examples/test-script-login-example.md`
- Approach and rules: [`implementation-approaches.md`](references/implementation-approaches.md)

## Related Skills
- `testing-design-test-case`
- `testing-generate-page-object`
- `testing-review-automation`
