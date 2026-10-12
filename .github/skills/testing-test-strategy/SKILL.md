---
name: testing-test-strategy

description: "Create a project-wide, risk-based test strategy when users ask to define testing scope, quality objectives, risks, coverage, governance, environments, ownership, or release gates across products, systems, teams, or releases. Do not use for requirements analysis, individual test cases, automation, execution, or defect investigation; use the linked sibling skills instead."
---

# Testing Test Strategy

## Purpose
Create a project-wide strategy that turns business and technical risk into planned test coverage, ownership, evidence expectations, and measurable release decisions.

## Context First
Read the project, business goals, requirements, architecture, delivery model, risks, and existing test assets. Ask for missing scope or objectives; otherwise label assumptions, constraints, open questions, findings, and residual risk instead of inventing facts.

| Evidence to load | Why it matters |
|---|---|
| [Testing standard](references/standards/test-strategy-standard.md) | Required strategy areas, coverage expectations, and evidence rules |
| [Test strategy rules](references/rules/test-strategy-rules.md) | Scope, prioritization, test-approach, readiness, and handoff decisions |
| [Review checklist](references/checklists/test-strategy-review-checklist.md) | Final approval checks |
| [Strategy template](references/templates/test-strategy.template.md) | Required artifact structure |
| [Example strategy](references/examples/test-strategy-example.md) | Reference for a complete output |
| [Repository testing instructions](../../../instructions/testing/copilot-instructions.md) | Workspace-specific testing conventions |

## Workflow

| Step | Input | Action | Output |
|---|---|---|---|
| 1. Baseline | Project context and linked evidence | Establish the evidence inventory, source status, and missing inputs. | Evidence inventory |
| 2. Scope and risk | Requirements, architecture, dependencies, users, journeys, and releases | Define boundaries, exclusions, critical journeys, business and technical risks, priorities, mitigations, and residual risk. Treat stories as coverage inputs, not separate project strategies. | Scope and risk model |
| 3. Operating model | Risk model and delivery context | Select test levels, test types, design techniques, functional and applicable non-functional coverage, traceability, environments, data, tools, dependencies, roles, and reporting. | Test operating model |
| 4. Governance | Operating model and constraints | Define measurable entry, exit, suspension, resumption, defect escalation, release gates, and draft blockers. | Governance model |
| 5. Generate and validate | Completed models and template | Populate the template, distinguish planned work from executed evidence, apply the review checklist, and record findings. | Strategy and findings artifacts |

## Decisions and Quality Gate

| Condition | Required decision or state |
|---|---|
| Scope or objective is missing | Ask for clarification; do not finalize. |
| Requirements are incomplete or contradictory | Record the issue and link to [testing-analyze-requirements](../testing-analyze-requirements/SKILL.md). |
| Risk context is missing | Use an explicitly labeled qualitative risk model and document assumptions. |
| Test type or non-functional area is excluded | State the reason, follow-up owner where needed, and residual risk. |
| Entry, exit, suspension, or resumption criteria are not measurable | Keep the strategy `Draft` and create a clarification finding. |
| Multiple products, systems, teams, or releases exist | Use one shared strategy with documented exceptions and local gates. |
| Final review | Apply the [review checklist](references/checklists/test-strategy-review-checklist.md); claims require evidence and execution results must not be implied. |

## Output Contract

| Artifact | Location | Required content |
|---|---|---|
| Strategy | `working-artifacts/Test-Strategy-<Project-Name>.md` | Scope and exclusions, objectives, risks and mitigations, operating model, ownership, dependencies, measurable gates, assumptions, constraints, open questions, and residual risks |
| Findings, when needed | `working-artifacts/Findings-Test-Strategy-<Project-Name>.md` | Blockers, ambiguities, unsupported claims, owners, actions, and residual risks |

## Related Skills
- [testing-analyze-requirements](../testing-analyze-requirements/SKILL.md)
- [testing-design-test-case](../testing-design-test-case/SKILL.md)
- [testing-review-test-case](../testing-review-test-case/SKILL.md)
- [testing-implement-automation](../testing-implement-automation/SKILL.md)
- [testing-analyze-bug](../testing-analyze-bug/SKILL.md)
