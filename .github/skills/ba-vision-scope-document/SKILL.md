---
name: ba-vision-scope-document
description: Create or rebuild Vision and Scope documents for BA outsourcing projects. Use for greenfield projects with only business requirements, discovery/pre-sales inputs, or running projects where the agent must read current-state documents, SRS, user stories, processes, screens, integrations, meeting notes, or legacy documentation and produce a clear business vision, scope, assumptions, dependencies, and high-level feature set.
---

# BA Vision Scope Document

## Overview

Produce a business-readable Vision and Scope document that aligns stakeholders before detailed SRS, user stories, API mapping, or design. Keep it high level enough for broad review while preserving traceability to source evidence.

## Input modes

Greenfield:
- Inputs are business goals, high-level requirements, market/domain context, stakeholder statements, and assumptions.
- Focus on problem, opportunity, user needs, product position, features, and release scope.

Running project:
- Inputs include existing BRD/SRS/user stories, current-state process, screenshots, UI specs, API docs, data models, backlog, support issues, meeting notes, and release notes.
- Reconstruct the vision by separating confirmed current behavior, future intent, active scope, deferred scope, assumptions, dependencies, and gaps.

## Workflow

1. Inventory source material.
   - List documents reviewed, version/date when known, owner, and reliability.
   - Mark missing materials and stale/conflicting sources.

2. Build the business frame.
   - Business opportunity.
   - Problem statement: problem, affected stakeholders, impact, successful-solution benefits.
   - Product position: target customer, need/opportunity, key benefit, alternative, differentiation.
   - Business objectives and success measures.

3. Define people and environment.
   - Stakeholder summary: role, represents, responsibilities, decision rights.
   - User profiles: technical background, sophistication, responsibilities, success definition, pain points.
   - User environment: task cycle, volume, devices, locations, constraints, current systems, integrations.

4. Define product overview.
   - Context diagram or textual context if a diagram cannot be produced.
   - Main modules/capabilities.
   - External systems/interfaces.
   - Key data domains.

5. Define scope.
   - In scope: committed capabilities and outcomes.
   - Out of scope: adjacent items not covered now.
   - Precedence and priority for features.
   - Assumptions, dependencies, constraints, risks.
   - Documentation, licensing, standards, and non-functional themes when known.

6. Validate completeness.
   - Each feature must map to a user benefit or business objective.
   - Each scope item must be testable enough for later SRS/user story decomposition.
   - Each assumption/dependency must have an owner or validation path.

## Recommended document structure

1. Introduction: purpose, document scope, references.
2. Positioning: business opportunity, problem statement, product position statement.
3. Stakeholder and User Description: market/domain demographics if relevant, stakeholders, users, user environment.
4. Product Overview: context, boundaries, interfaces, modules, major data.
5. Product Features: feature ID, feature, description, end-user benefit, priority, source/evidence.
6. Scope: in scope, out of scope, release/phasing notes.
7. Assumptions, Dependencies, Constraints, Risks.
8. Other Requirements: documentation, licensing, migration, security/privacy, standards, reporting, support.
9. Open Questions and Decisions Needed.
10. Appendix: diagrams, UI snapshots, source traceability, glossary.

## Running-project reconstruction

When rebuilding from existing materials, produce a source reconciliation table:

| Topic | Current evidence | Future intent | Conflict/gap | Proposed statement | Confidence |
| --- | --- | --- | --- | --- | --- |

Use confidence labels:
- Confirmed: explicitly stated in reliable source or stakeholder decision.
- Inferred: likely based on repeated evidence; must be validated.
- Open: insufficient evidence or conflicting information.

## Quality bar

- Do not turn the Vision and Scope into detailed acceptance criteria.
- Do not silently invent scope; mark inferred content clearly.
- Avoid generic value statements; connect benefits to stakeholders and measurable outcomes.
- Keep business language readable by sponsor, PO, SME, delivery manager, architect, and QA.
- Highlight scope creep signals: undefined objective, missing decision owner, undocumented change, hidden dependency, unclear NFR, external interface not analyzed.

## Saved Artifact Location

When the user asks to save this as a file, write it under `working-artifacts/vision-scope/<topic-or-task-name>/` at the workspace root (per the BA Agent's Artifact Output Location rule). Do not ask for confirmation before creating the folder; use a different location only if the user requests one.

## Source notes

Read `references/source-notes.md` for the Vision/SRS source patterns used by this skill.
