# Source Notes

The source material has been distilled into this self-contained reference. Do not resolve the original local folders or source files.

## Bundled Knowledge Extract

- This skill is self-contained. Use the extract below as bundled pattern memory; do not resolve the original local folders or source documents.
- Start substantial BA artifacts with metadata: project/client, module or process, purpose, audience, source inputs, version/date, author/reviewer, and status.
- Separate confirmed facts, future-state requirements, business rules, assumptions, risks, issues, dependencies, decisions, and open questions.
- Use SRS-style coverage when scope is broad: business objectives, as-is/to-be, in-scope/out-of-scope, glossary, assumptions, constraints, dependencies, user requirements, functional requirements, NFRs, UI/reporting, external interfaces, and appendices.
- Keep requirements atomic, unambiguous, feasible, necessary, prioritized where useful, traceable to evidence, and testable through acceptance criteria or UAT evidence.
- Validate that each artifact can be understood independently by BA, Dev, QC, PM, Solution Architect, and client stakeholders without hidden source context.
- Functional decomposition should move from business capability to functions, features, user goals, workflows, data/reporting needs, integrations, rules, NFRs, and release slices.
- Break work vertically around stakeholder outcomes where possible; use horizontal technical slices only when needed to reduce delivery risk or expose dependencies.
- User story template structure: story ID, story name, epic, user story statement, assumptions, preconditions, workflow/activity diagram, current screens, suggested mockups, screen definition, business acceptance criteria, out-of-scope items, and NFRs.
- Acceptance criteria should cover happy path, negative path, boundary values, permissions, state changes, data validation, integration behavior, audit/notification outcomes, and observable results.
- Slice stories by business outcome, role, workflow stage, rule variation, operational handling, or risk; avoid stories that only describe a database table, endpoint, UI control, or isolated technical task.

## Patterns Extracted

- Story mapping visualizes function/activity sequence horizontally and priority/release depth vertically.
- Functional decomposition should support epic breakdown into user stories and release planning.
- SRS structure expects functional decomposition or use-case/user-story model to show all functionality in scope.
- User stories should keep actor, goal, and value visible; acceptance criteria come after decomposition.
