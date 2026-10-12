---
name: testing-review-test-case

description: "Review test-case artifacts when users ask to assess traceability, coverage, quality, duplication, readiness, or automation suitability before finalization or handoff. Do not use to generate replacement cases or execute tests; use the linked sibling skills for creation and other testing work."
---

# Testing Review Test Case

## Purpose
Assess test-case quality against the canonical design, testing standards, and review criteria, producing evidence-based findings and one supported readiness verdict.

## Context First
Read the artifact, requirements or acceptance criteria, requested scope, risk context, and applicable references. Ask focused questions when correctness depends on missing information; otherwise record bounded assumptions without inventing behavior.

| Evidence to load | Use |
|---|---|
| [Canonical test-case skill](../testing-design-test-case/SKILL.md) | Design scope and ownership boundary |
| [Canonical test-case template](../testing-design-test-case/references/templates/test-case.template.md) | Required case fields and structure |
| [Testing standard](references/standards/testing-standard.md) | Review quality expectations |
| [Test design approach](references/standards/test-design-approach.md) | Coverage and technique rationale |
| [Test design techniques](references/standards/test-design-techniques.md) | Technique applicability |
| [Review checklist](references/checklists/test-case-review-checklist.md) | Applicable checks and N/A reasons |
| [Clarification rules](references/checklists/clarification-rules.md) and [questions](references/checklists/clarification-questions.md) | Ambiguity handling and blocked readiness |
| [Review report template](references/templates/test-case-review.template.md) | Required report structure |
| [Review example](references/examples/review-test-case-example.md) | Output reference |

## Workflow
| Step | Input | Action | Output |
|---|---|---|---|
| 1. Baseline | Artifact, sources, scope, and risk | Establish the review boundary, inventory, evidence status, assumptions, and questions. | Bounded review context |
| 2. Assess | Review context and cases | Check structure, traceability, requirements and acceptance-criteria coverage, fields, techniques, priority, data, steps, expected results, duplication, and applicable non-functional areas. | Categorized findings and coverage evidence |
| 3. Determine readiness | Findings and clarification responses | Classify severity, blockers, gate status, and automation candidates without rewriting cases. | Prioritized recommendations and readiness state |
| 4. Report | Findings and readiness state | Populate the [review report template](references/templates/test-case-review.template.md), separating confirmed evidence from assumptions and planned work. | Saved review report |
| 5. Route | Final verdict | Send case-design revisions to [testing-design-test-case](../testing-design-test-case/SKILL.md) and automation preparation to [testing-generate-page-object](../testing-generate-page-object/SKILL.md). | Explicit next action |

## Decisions and Quality Gate

| Condition | Required decision |
|---|---|
| Requirements or expected behavior are missing | Mark traceability partial, ask clarification, and do not infer behavior. |
| Ambiguity affects correctness | Block the verdict and record the question, impact, and evidence. |
| Critical coverage, security, or authorization gap | Set `Major Revision Required` unless an authorized owner accepts the risk. |
| Finding is non-blocking | Set `Minor Revision Required`; use `Approved` only when all applicable gates pass. |
| Final review | Apply the [review checklist](references/checklists/test-case-review-checklist.md), give every applicable check a status or N/A reason, and ensure the verdict follows from evidence. |

## Output Contract

| Artifact | Location | Required content |
|---|---|---|
| Review report | `working-artifacts/test-case-reviews/Report-Review-Test-Case-<artifact-name>.md` | Summary, scope, assumptions, questions, evidence-based findings, traceability, coverage, gate results, and exactly one verdict: `Approved`, `Minor Revision Required`, `Major Revision Required`, or `Blocked` |
| Replacement test cases | Not produced by default | Create only when explicitly requested |

## Related Skills
- [testing-design-test-case](../testing-design-test-case/SKILL.md)
- [testing-generate-page-object](../testing-generate-page-object/SKILL.md)
- [testing-analyze-requirements](../testing-analyze-requirements/SKILL.md)
