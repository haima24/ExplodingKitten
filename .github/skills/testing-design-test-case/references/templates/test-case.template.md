---
name: test-case-template
description: "Defines the Markdown schema for traceable test-case documents. Use when creating functional or non-functional cases from requirements, acceptance criteria, or business rules and when documenting assumptions, coverage, test data, or quality gates. Do not use for test execution, defect diagnosis, or automation implementation."
---

# Test Case Template

## Purpose

Provide a reusable structure for independent, executable, risk-based, and traceable test cases.

## Context First

Populate this template from the complete requirement and acceptance criteria. Ask when the requirement identifier, scope, expected behavior, or output format is missing. Assume only stated behavior and repository conventions; record inferred rules, unresolved questions, and excluded scope.

## Workflow

1. **Set document context.** Input: requirement metadata and requested scope. Action: complete the traceability summary and assumptions. Output: a bounded test-case document.
2. **Write atomic cases.** Input: mapped requirements and selected scenarios. Action: complete one row per primary test objective using the required columns. Output: executable, prioritized, and traceable cases.
3. **Validate coverage.** Input: completed cases and acceptance criteria. Action: complete the coverage matrix and quality gate. Output: evidence of applicable coverage or visible gaps.

## Output Contract

Save the Markdown document under `working-artifacts/test-cases/`. Use `TC_<MODULE>_<SEQUENCE>` IDs, with an uppercase module name and three-digit sequence. Every case must include a `Verify...` title, numbered steps, observable expected results, requirement reference, testing technique, priority, preconditions, test data, and automation assessment.

## Document Structure

```markdown
# Test Cases: <Feature Name>

## Traceability Summary

| Item | Value |
| --- | --- |
| User story or requirement | <ID and title> |
| Feature | <feature name> |
| Scope | <functional, non-functional, or both> |
| Status | <Draft or Ready for Review> |
| Output location | `working-artifacts/test-cases/` |

## Assumptions and Open Questions

- <Assumption, risk, or unresolved question>

## Test Cases

| Test Case ID | Title | Test Steps | Expected Result | Requirement | Testing Technique | Priority | Preconditions | Test Data | Automation |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| TC_<MODULE>_001 | Verify <expected behavior> | 1. <single action> | <observable result> | <requirement or AC> | <technique> | <Critical/High/Medium/Low> | <setup condition> | <input data> | <Yes/No> |

## Coverage Matrix

| Acceptance Criterion | Covered By |
| --- | --- |
| AC-1 | TC_<MODULE>_001 |

## Quality Gate

- [ ] All applicable requirements and acceptance criteria are covered.
- [ ] Positive, negative, boundary, authorization, and business-rule scenarios are included where applicable.
- [ ] Test data, expected results, priorities, and techniques are complete.
- [ ] Duplicate scenarios are removed.
- [ ] Assumptions, risks, and open questions are visible.
```

## Field Rules

- Keep each case independent and focused on one primary objective.
- Use realistic, reusable data, including invalid and boundary values where applicable.
- Reference one or more requirements or acceptance criteria in every case.
- Use `Yes` for automation only when the scenario is stable, deterministic, repeatable, and practical to maintain; otherwise use `No`.
- Mark the document as `Draft` when clarification is required or a critical business rule is missing.

Use [`testing-standard.md`](../standards/testing-standard.md) for shared policy and [`test-case-review-checklist.md`](../checklists/test-case-review-checklist.md) for validation items.

## Related Knowledge

- [`testing-standard.md`](../standards/testing-standard.md)
- [`test-design-approach.md`](../standards/test-design-approach.md)
- [`test-design-techniques.md`](../standards/test-design-techniques.md)
- [`test-case-review-checklist.md`](../checklists/test-case-review-checklist.md)

