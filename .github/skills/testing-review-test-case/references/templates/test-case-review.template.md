---
name: test-case-review-template
description: "Defines the Markdown structure for reports reviewing test-case artifacts against the canonical design schema, standards, and review checklist."
---

# Test Case Review Report Template

## Purpose

Provide a consistent, evidence-based report structure for reviewing test-case artifacts.

## Context First

Populate this report from the complete reviewed artifact, requirement sources, requested scope, and applicable review references. Record assumptions and open questions instead of inventing expected behavior.

## Workflow

1. **Input:** reviewed artifact and sources. **Action:** record scope, assumptions, and artifact inventory. **Output:** bounded review context.
2. **Input:** review context and cases. **Action:** assess the canonical case fields, traceability, coverage, quality, and readiness. **Output:** findings and coverage evidence.
3. **Input:** findings. **Action:** complete the quality gate and verdict. **Output:** a saved review report.

## Output Contract

Save the report under `working-artifacts/test-case-reviews/` as `Report-Review-Test-Case-<artifact-name>.md`.

## Report Structure

```markdown
# Test Case Review: <Artifact Name>

## Review Summary

| Item | Value |
| --- | --- |
| Final verdict | <Approved / Minor Revision Required / Major Revision Required / Blocked> |
| Reviewed artifact | <path and version> |
| Scope | <functional, non-functional, or both> |

## Reviewed Artifacts

- <artifact path>
- <requirement or acceptance-criteria source>

## Scope

<Included and excluded review coverage.>

## Assumptions and Open Questions

- <Assumption, unresolved question, impact, or reason for exclusion>

## Findings

| ID | Severity | Category | Evidence | Impact | Recommendation | Status |
| --- | --- | --- | --- | --- | --- | --- |
| FINDING-001 | <Critical/High/Medium/Low/Info> | <category> | <case ID, field, or section> | <impact> | <action> | <Open/Accepted/Fixed/N/A> |

## Traceability and Coverage Assessment

### Traceability Summary

| Requirement or acceptance criterion | Covered by | Assessment |
| --- | --- | --- |
| <ID> | <test case IDs or None> | <Complete/Partial/Missing/N/A> |

### Coverage Matrix

| Coverage area | Evidence | Assessment |
| --- | --- | --- |
| Positive, negative, boundary, business rule, state, integration, and non-functional areas as applicable | <case IDs or rationale> | <Complete/Partial/Missing/N/A> |

## Quality Gate

- [ ] Canonical template fields were checked: Test Case ID, Title, Test Steps, Expected Result, Requirement, Testing Technique, Priority, Preconditions, Test Data, Automation.
- [ ] Traceability and coverage evidence is complete.
- [ ] Assumptions and open questions are visible.
- [ ] Findings are prioritized and actionable.
- [ ] Automation/readiness and clarification checks were completed where applicable.

## Final Verdict

<Verdict and concise rationale. Major revision recommendations route to `testing-design-test-case`.

```

The reviewed case schema is defined by the canonical design package [`test-case.template.md`](../../../testing-design-test-case/references/templates/test-case.template.md). This report template does not duplicate that schema.

