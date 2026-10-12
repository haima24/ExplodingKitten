# BA Process Modelling BPMN Checklist

## Bundled Knowledge Extract

- This skill is self-contained. Use the extract below as bundled pattern memory; do not resolve the original local folders or source documents.
- Start substantial BA artifacts with metadata: project/client, module or process, purpose, audience, source inputs, version/date, author/reviewer, and status.
- Separate confirmed facts, future-state requirements, business rules, assumptions, risks, issues, dependencies, decisions, and open questions.
- Use SRS-style coverage when scope is broad: business objectives, as-is/to-be, in-scope/out-of-scope, glossary, assumptions, constraints, dependencies, user requirements, functional requirements, NFRs, UI/reporting, external interfaces, and appendices.
- Keep requirements atomic, unambiguous, feasible, necessary, prioritized where useful, traceable to evidence, and testable through acceptance criteria or UAT evidence.
- Validate that each artifact can be understood independently by BA, Dev, QC, PM, Solution Architect, and client stakeholders without hidden source context.
- Process models should capture trigger, start/end events, actors/swimlanes, activities, decisions, handoffs, inputs/outputs, systems, exceptions, SLAs, controls, pain points, and improvement opportunities.
- For BPMN-style documentation, keep business-readable labels and separate happy path, alternate path, exception path, manual workarounds, and system integration steps.
- Business-rule analysis should identify decision points, policy source, condition, action/outcome, exception, priority/conflict, owner, effective date, configurability, and test scenarios.
- Distinguish rule, requirement, calculation, validation, workflow decision, data constraint, and operational policy.

## Artifact Checklist

- Process objective and measurable outcome are stated.
- Actors, systems, upstream/downstream processes, and handoffs are visible.
- Each decision has clear business condition and outcome.
- Inputs, outputs, documents, notifications, and data records are mapped.
- Exceptions, retries, cancellations, reversals, and escalations are included.
- AS-IS pain points are separated from TO-BE recommendations.
- Diagram level is readable for business stakeholders and detailed enough for solution design.

## Elicitation Questions

- What event starts the process and what business state confirms it is complete?
- Which steps are manual, automated, system-assisted, or outside the future scope?
- Where can the process fail, wait, be rejected, be cancelled, or require rework?
- Which handoffs cause SLA, data quality, or ownership risk?

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
