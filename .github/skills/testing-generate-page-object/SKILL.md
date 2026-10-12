---
name: testing-generate-page-object

description: 'Use when generating or updating reusable Playwright page objects and components from approved requirements or test assets. Do not use to generate specs, execute tests, or review page objects; route those requests to sibling testing skills.'
---

# Testing Generate Page Object

## Purpose
Generate cohesive Playwright page objects and components that encapsulate UI interactions, use stable locators, and support downstream automation.

## Context First
Read approved requirements or cases, UI evidence, repository instructions, and applicable references. Search existing models, components, fixtures, and utilities. Ask for missing page scope or interactions; state assumptions when runtime evidence is unavailable.

## Workflow
1. **Inventory.** Input: requirements, cases, and UI evidence. Action: identify pages, components, actions, states, and outcomes. Output: model inventory and traceability map.
2. **Design for reuse.** Input: inventory and existing assets. Action: define business-oriented methods and resilient locators without duplication. Output: page/component design.
3. **Implement.** Input: approved design and standards. Action: create or update models without assertions or test orchestration. Output: files under `working-artifacts/e2e/src/pages/` or `working-artifacts/e2e/src/components/`.
4. **Handoff.** Input: generated models. Action: apply checklist and record locator risks and missing evidence. Output: reviewed assets and downstream handoff.

## Output Contract
Page objects use `<FeatureOrPage>NamePage.ts` under `working-artifacts/e2e/src/pages/`; components use `<ComponentName>.ts` under `working-artifacts/e2e/src/components/`. Require reusable business methods, stable locators, no assertions or orchestration, no duplicate methods or locators, and traceability. Preserve explicit placeholders or risks when behavior is unconfirmed.

## Decision Rules
1. Missing page context blocks generation until clarified.
2. Extend an existing model when it satisfies the need; do not duplicate it.
3. Prefer resilient selectors and flag high-risk locator choices.
4. Redirect assertions or orchestration requests to `testing-implement-automation`.

## Quality Gate
- [ ] Standards, templates, and checklist are applied.
- [ ] Models are cohesive, reusable, correctly named, and correctly located.
- [ ] No duplicate locators or business methods are introduced.
- [ ] Assertions and orchestration remain outside models.
- [ ] Locator risks, assumptions, and missing evidence are documented.

## Knowledge Sources
- Standards: `references/standards/pom-standard.md`, `locator-standard.md`, `page-object-standard.md`, `playwright-standard.md`
- Checklist: `references/checklists/page-object-review-checklist.md`
- Templates: `references/templates/page-object.template.ts`, `component.template.ts`
- Example: `references/examples/test-script-login-example.md`

## Related Skills
- `testing-design-test-case`
- `testing-review-page-object`
- `testing-implement-automation`
