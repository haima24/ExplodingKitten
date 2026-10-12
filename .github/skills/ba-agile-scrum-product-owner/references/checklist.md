# BA Agile Scrum Product Owner Checklist

## Bundled Knowledge Extract

- This skill is self-contained. Use the extract below as bundled pattern memory; do not resolve the original local folders or source documents.
- Start substantial BA artifacts with metadata: project/client, module or process, purpose, audience, source inputs, version/date, author/reviewer, and status.
- Separate confirmed facts, future-state requirements, business rules, assumptions, risks, issues, dependencies, decisions, and open questions.
- Use SRS-style coverage when scope is broad: business objectives, as-is/to-be, in-scope/out-of-scope, glossary, assumptions, constraints, dependencies, user requirements, functional requirements, NFRs, UI/reporting, external interfaces, and appendices.
- Keep requirements atomic, unambiguous, feasible, necessary, prioritized where useful, traceable to evidence, and testable through acceptance criteria or UAT evidence.
- Validate that each artifact can be understood independently by BA, Dev, QC, PM, Solution Architect, and client stakeholders without hidden source context.
- Product-owner artifacts should connect vision, objectives, personas, epics, features, stories, acceptance criteria, priority rationale, dependencies, sprint readiness, release slicing, Definition of Ready, and Definition of Done.
- Backlog refinement should expose value, risk, uncertainty, testability, dependency, sizing concern, and decision owner for each item.
- User story template structure: story ID, story name, epic, user story statement, assumptions, preconditions, workflow/activity diagram, current screens, suggested mockups, screen definition, business acceptance criteria, out-of-scope items, and NFRs.
- Acceptance criteria should cover happy path, negative path, boundary values, permissions, state changes, data validation, integration behavior, audit/notification outcomes, and observable results.
- Slice stories by business outcome, role, workflow stage, rule variation, operational handling, or risk; avoid stories that only describe a database table, endpoint, UI control, or isolated technical task.

## Artifact Checklist

- Product/release goal is explicit.
- Backlog has epics, features, stories, defects, spikes, and technical dependencies where relevant.
- Stories meet INVEST and DoR before sprint planning.
- Acceptance criteria and test data are ready for QC and UAT.
- Dependencies are visible before sprint commitment.
- Prioritization rationale is business-readable.
- PO/stakeholder decisions are logged.

## Elicitation Questions

- What outcome should this sprint/release prove?
- Which backlog item reduces the most business or delivery risk?
- What information is missing for the team to estimate confidently?
- What needs PO decision before development starts?

## Review Heuristics

- Check whether each statement is a fact, requirement, business rule, assumption, risk, or recommendation.
- Check whether the artifact can be handed to Dev, QC, PM, Solution Architect, or client stakeholders without hidden context.
- Check whether IDs, owners, dependencies, statuses, and acceptance evidence are present where relevant.
- Check whether negative scenarios, boundary cases, permissions, data quality, integration failure, audit, and operational support are covered.
- Check whether any current regulation, platform constraint, client policy, or third-party rule must be verified from an authoritative source.

## Common Pitfalls

- Mixing current-state facts with future-state decisions.
- Burying business rules inside narrative paragraphs.
- Treating UI labels or technical fields as business definitions without validation.
- Omitting exception, cancellation, reversal, timeout, permission, and data-quality paths.
- Writing requirements that cannot be tested or accepted.
