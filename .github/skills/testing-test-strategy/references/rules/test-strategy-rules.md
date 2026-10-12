# Test Strategy Rules

Apply these rules when creating or reviewing a test strategy.

## Project Scope and Inputs

1. Do not finalize a strategy without a defined project scope covering its products, systems, teams, and delivery lifecycle.
2. Do not create a separate strategy for each user story; use user stories as traceability and coverage inputs.
3. Do not invent missing requirements, business rules, supported platforms, or compliance obligations.
4. Record missing inputs as clarification questions, assumptions, or findings.
5. State explicit exclusions so the project strategy cannot be mistaken for a complete test plan.

## Risk and Prioritization

6. Identify the business and technical impact of each significant risk.
7. Prioritize critical user journeys, sensitive data, integrations, and recent changes.
8. When constraints prevent full coverage, protect high-risk areas first.
9. Record residual risk and acceptance ownership for deferred coverage.

## Test Approach

10. Select test levels and types from the system architecture and failure modes.
11. Include non-functional testing when the context makes it relevant; document why it is excluded otherwise.
12. Use automation for repeatable, stable checks where it reduces risk or feedback time.
13. Keep exploratory testing for learning, risk probing, and areas with uncertain behavior.

## Readiness and Reporting

14. Entry and exit criteria must be observable and measurable.
15. Defect severity and escalation expectations must be defined for release decisions.
16. Distinguish planned activities from completed execution and attach evidence only when available.
17. A strategy marked Draft must identify the blockers preventing approval.

## Handoff

18. The strategy must identify the next testing artifacts and their owners.
19. Approved project strategy decisions should guide release tailoring, test-case design, automation scope, and execution reporting.
