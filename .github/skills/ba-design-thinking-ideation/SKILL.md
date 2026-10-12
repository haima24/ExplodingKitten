---
name: ba-design-thinking-ideation
description: Design thinking and ideation workflow for BA discovery and solution shaping. Use when turning a vague problem, stakeholder pain point, product opportunity, workshop notes, customer journey, service issue, or innovation request into empathy insights, problem statements, how-might-we questions, ideas, concept cards, assumptions, experiments, and prioritized solution options.
---

# BA Design Thinking Ideation

## Core stance

Use design thinking to widen the solution space before committing to requirements. Keep the work grounded in user evidence, business outcomes, and delivery constraints.

## Workflow

1. Frame the challenge.
   - Business goal.
   - Target users/customers.
   - Context and journey stage.
   - Constraints: time, budget, technology, compliance, operations.
   - Decision needed: explore, choose concept, validate assumption, define MVP.

2. Empathize.
   - Capture user jobs, pains, gains, workarounds, emotions, touchpoints, data used, and success criteria.
   - Separate observed evidence from stakeholder opinions.
   - Use interview notes, support tickets, analytics, screenshots, process maps, call transcripts, surveys, or SME inputs.

3. Define.
   - Convert raw pain points into problem statements.
   - Use: `<user/role> needs a way to <need> because <insight/constraint>`.
   - Check whether the problem is specific, user-centered, outcome-linked, and not already a solution.

4. Generate "How might we" questions.
   - Start broad enough to invite options.
   - Add constraints only when necessary.
   - Create several HMW variants: simplify, prevent, automate, guide, personalize, recover, communicate, monitor.

5. Ideate.
   - Produce many ideas before judging.
   - Mix divergent prompts:
     - Remove a step.
     - Make the invisible visible.
     - Turn exception into guided flow.
     - Use existing data differently.
     - Make it self-service.
     - Add guardrails instead of approvals.
     - Support novice and expert users differently.
     - Design for failure/recovery.

6. Cluster and select.
   - Group by user value, business value, feasibility, risk, dependency, and evidence strength.
   - Use impact/effort or desirability/viability/feasibility.
   - Do not choose the most exciting idea if it cannot be validated or delivered.

7. Create concept cards.
   - Name.
   - User problem.
   - Proposed experience.
   - Business value.
   - Key assumptions.
   - Data/integration/component needs.
   - Risks.
   - MVP slice.
   - Validation experiment.

8. Convert to BA artifacts.
   - Vision/scope.
   - Journey map.
   - Functional decomposition.
   - User stories.
   - Prototype brief.
   - Dashboard/KPI idea.
   - Experiment backlog.

## Output templates

Problem statement:

| User/role | Need | Insight/evidence | Business impact | Constraint |
| --- | --- | --- | --- | --- |

Idea backlog:

| Idea | HMW answered | User value | Business value | Feasibility | Risk | MVP slice | Validation |
| --- | --- | --- | --- | --- | --- | --- | --- |

Concept card:

| Field | Content |
| --- | --- |
| Concept name | |
| Target user | |
| Problem | |
| Experience | |
| Value | |
| Assumptions | |
| Dependencies | |
| MVP | |
| Experiment | |

## Facilitation rules

- Start from evidence, not from favorite features.
- Defer judgment during divergent ideation.
- Make constraints explicit before converging.
- Include service/process ideas, not only UI features.
- Capture discarded ideas and rationale.
- Turn every chosen concept into assumptions and validation steps.

## Quality bar

- A good idea must state who benefits and what changes.
- A good concept must have a smallest testable version.
- A good workshop output must include decisions, not just sticky-note volume.
- Flag ideas that require policy, process, data, integration, or organizational change.

## Saved Artifact Location

When the user asks to save this as a file, write it under `working-artifacts/ideation/<topic-or-task-name>/` at the workspace root (per the BA Agent's Artifact Output Location rule). Do not ask for confirmation before creating the folder; use a different location only if the user requests one.

## Source notes

Read `references/source-notes.md` for bundled discovery and design-thinking source patterns behind this skill.
