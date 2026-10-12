---
name: ba-consultative-elicitation
description: Consultant-level business analysis elicitation for IT outsourcing work. Use when preparing or running client interviews, workshops, discovery sessions, requirement clarification, current-state analysis, scope definition, Q&A backlogs, stakeholder questions, or follow-up question sets from BRD/SRS/user stories/screens/API specs/current-system documents.
---

# BA Consultative Elicitation

## Core stance

Elicit to understand decisions, not just to collect requirements. Always separate facts, assumptions, decisions, open questions, and scope changes.

Use this order:

1. Clarify the business outcome, affected users, and decision to be made.
2. Understand current state, target state, constraints, and success measures.
3. Select elicitation techniques based on uncertainty and stakeholder availability.
4. Ask from broad to specific, then summarize and confirm.
5. Convert answers into requirements, assumptions, risks, decisions, and next questions.

## Elicitation setup

Before creating questions, build a one-page brief:

- Business objective and measurable success.
- As-is process/system and known pain points.
- To-be expectation and what must change.
- In-scope, out-of-scope, constraints, dependencies.
- Stakeholders: sponsor, PO, SME, end user, admin, support, legal/compliance, technical owner, integration owner.
- Source inputs: existing documents, systems, reports, logs, UI, API specs, standards, regulations, competitor/product references.
- Session goal: explore, verify, decide, prioritize, or resolve conflict.

## Technique selection

Choose the lightest technique that can resolve the uncertainty:

- Document analysis: use for BRD, SRS, user manuals, policies, meeting notes, contracts, API docs, current-system documentation. Output issues, questions, contradictions, and assumptions.
- Interview: use for tacit knowledge and decision-maker clarification. Start open-ended, then use closed questions for confirmation.
- Workshop: use for cross-stakeholder alignment, process agreement, prioritization, and conflict resolution.
- Interface analysis: use for system integration, import/export, reports, API, notifications, and upstream/downstream dependencies.
- Process modeling: use for current and target workflows, handoffs, exceptions, and ownership.
- Data modeling: use for core entities, lifecycle states, field definitions, data ownership, and reporting needs.
- Business rule analysis: use for validation, calculation, permissions, approval, list/search/import/export/email/dashboard logic.
- Prototyping/storyboard: use when users cannot articulate expected UI behavior from text alone.
- Observation: use when users perform repeated operational work and may omit real-world workarounds.
- Benchmarking/market analysis: use when the domain is unfamiliar or product options are unclear.

## Question architecture

Build questions in layers:

1. Context: Why now? What problem or opportunity is this solving? What happens if nothing changes?
2. Stakeholders: Who uses, owns, supports, approves, pays for, or is affected by the solution?
3. Process: What triggers the process? What are the main path, alternate paths, exceptions, and handoffs?
4. Data: What information is entered, generated, imported, exported, stored, masked, audited, or reported?
5. Rules: What must be true before an action? What is calculated, validated, generated, notified, or blocked?
6. Integration: Which systems exchange data? What is the source of truth? What happens on timeout, duplicate, partial failure, or retry?
7. UX: What must users see, edit, filter, search, sort, approve, export, or drill into?
8. Non-functional: Performance, usability, security, audit, privacy, volumetric data, reliability, migration, support.
9. Scope: What is explicitly included, excluded, deferred, assumed, or dependent on another party?
10. Decisions: Who decides when requirements conflict? What criteria will be used?

## Consulting-level question patterns

Use sharper questions than "what do you want":

| Pattern | Use it to ask |
| --- | --- |
| Outcome | "Which business metric should improve, and by how much?" |
| Tradeoff | "If we can optimize for speed, accuracy, or flexibility, which matters most for release 1?" |
| Evidence | "What report, screen, policy, or transaction proves this rule today?" |
| Exception | "When should the normal rule not apply?" |
| Boundary | "What is the smallest/largest/oldest/newest/most frequent case?" |
| Ownership | "Who owns this data after it crosses systems?" |
| Risk | "What failure would create financial, legal, operational, or customer impact?" |
| Decision | "Who can make the final call if Sales and Operations disagree?" |
| Scope control | "Is this needed for go-live, or is it a later optimization?" |

## Output template

When preparing client-facing material, produce:

1. Session objective.
2. Stakeholders and expected decisions.
3. Question backlog grouped by topic and priority.
4. Documents/screens/data/API specs to review before the session.
5. Assumptions to validate.
6. Risks and scope-change signals.
7. Post-session action log format: item, owner, due date, decision needed, affected requirement.

## Quality bar

- Questions must be answerable by the right stakeholder.
- Avoid leading the client to a preferred solution before understanding the business need.
- Flag contradictions instead of silently resolving them.
- Convert vague words into measurable criteria: fast, simple, flexible, real time, large volume, secure.
- End with a recap: confirmed facts, open questions, decisions, assumptions, and scope impacts.

## Saved Artifact Location

When the user asks to save this as a file, write it under `working-artifacts/elicitation-results/<topic-or-task-name>/` at the workspace root (per the BA Agent's Artifact Output Location rule). Do not ask for confirmation before creating the folder; use a different location only if the user requests one.

## Source notes

Read `references/source-notes.md` only when you need provenance or want to align with the bundled BA training extracts.
