---
name: testing-analyze-requirements

description: 'Use when analyzing requirements for completeness, consistency, clarity, ambiguity, dependencies, and testability before test design. Do not use to rewrite requirements, generate scripts, execute tests, or analyze defects; route those requests to sibling testing skills.'
---

# Testing Analyze Requirements

## Purpose
Analyze software requirements for gaps, ambiguity, conflicts, assumptions, dependencies, and testability risks before downstream testing.

## Context First
Read all requirement sources, business context, linked artifacts, priority, risk, and repository instructions. Ask when the requirement or context is missing; distinguish evidence, assumptions, open questions, and inferred risks.

## Workflow
1. **Baseline.** Input: requirements and context. Action: load techniques, clarification rules, checklist, template, and example. Output: analysis boundary and source inventory.
2. **Assess quality.** Input: complete sources. Action: evaluate completeness, consistency, ambiguity, assumptions, dependencies, and testability with evidence. Output: findings and readiness risks.
3. **Clarify.** Input: unresolved findings. Action: generate prioritized questions and identify blocking gaps. Output: clarification backlog.
4. **Report.** Input: findings and questions. Action: populate the analysis template and recommend readiness. Output: reports under `working-artifacts/test-analysis-reports/`.
5. **Validate.** Input: reports. Action: confirm evidence, coverage, and actionable recommendation. Output: final report or marked needs-clarification result.

## Output Contract
Create `Report-Requirements-Analysis-<Requirement-ID-or-Name>.md` and, when needed, `Findings-Requirements-Analysis-<Requirement-ID-or-Name>.md` under `working-artifacts/test-analysis-reports/`. Include evidence, quality findings, dependencies, risks, clarification questions, assumptions, and readiness recommendation.

## Decision Rules
1. Incomplete sources require the missing artifacts before final analysis.
2. Ambiguity blocking testability is recorded with clarification questions.
3. Undefined critical business rules make readiness `Needs Clarification`.
4. Unknown dependencies are reported as risk and defer readiness approval.
5. Route approved requirements to `testing-design-test-case`; route defects to `testing-analyze-bug`.

## Quality Gate
- [ ] Standards, checklist, and template are applied.
- [ ] Findings cover ambiguity, dependencies, risks, completeness, consistency, and testability.
- [ ] Questions, assumptions, evidence, and readiness recommendation are visible and actionable.

## Knowledge Sources
- Standards: `references/standards/test-design-techniques.md`, `requirement-clarification-rules.md`
- Checklist: `references/checklists/requirement-review-checklist.md`
- Template: `references/templates/requirement-analysis-report-template.md`
- Example: `references/examples/review-test-case-example.md`

## Related Skills
- `testing-test-strategy`
- `testing-design-test-case`
- `testing-review-test-case`
- `testing-analyze-bug`
