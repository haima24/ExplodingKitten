# Testing Guidelines

## 1. Purpose

This document defines a risk-based testing approach that validates requirements, detects defects early, provides reliable feedback, and uses automation and AI with human oversight.

---

## 2. Testing Principles

1. Start testing with requirements and continue throughout the lifecycle.
2. Prioritize business and technical risk, prevention, and early detection.
3. Automate stable, repetitive, deterministic tests; do not automate everything by default.
4. Keep tests maintainable, reliable, understandable, and independent where practical.
5. Reuse test components and keep test data controlled and traceable.
6. Apply an automation-first approach: use AI to generate test cases and automation assets for scenarios that combine related user stories and verify multiple acceptance criteria; test scenarios that cannot be automated reliably or appropriately manually.
7. Human reviewers must validate AI-generated test artifacts and results.

---

## 3. Testing Scope

Select applicable coverage based on risk: functional flows, negative and boundary cases, business rules, validation and error handling; UI behavior, navigation, forms, responsiveness and compatibility; API requests, responses, status codes, data validation, authentication and authorization; integration with databases, external services and messages; and non-functional areas such as performance, security, accessibility, reliability and usability.

---

## 4. Requirement Analysis

For each requirement or user story, review the objective and acceptance criteria; identify ambiguity, dependencies, risks, testable conditions, test levels, and automation opportunities. Do not silently assume missing behavior; record `NEEDS CLARIFICATION`.

---

## 5. Test Design

Use positive, negative, boundary, business-rule, and integration testing as applicable. Include minimum, maximum, below-minimum, above-maximum, empty, null, and length boundaries where relevant.

Test Design Rules:

* Cover all applicable acceptance criteria with the minimum number of meaningful test cases.
* Combine similar scenarios with the same objective, setup, and expected outcome.
* Remove duplicates unless they provide meaningful additional coverage.
* Trace every test case to a requirement, user story, or acceptance criterion; do not keep orphan cases.

---

## 6. Test Case Standards

Each case must include: `TC_<MODULE>_<SEQUENCE>` ID (uppercase module and three-digit sequence); `Verify...` title; one objective; numbered steps; observable expected results; requirement, user story, and acceptance-criterion references; testing technique; Critical/High/Medium/Low priority; preconditions; test data; and `Yes`/`No` automation assessment. Use `Yes` only for stable, deterministic, repeatable, maintainable scenarios.

Each document must include a traceability summary, assumptions and `NEEDS CLARIFICATION` items, a coverage matrix, and a quality gate. Mark it `Draft` when clarification or a critical business rule is missing.

---

## 7. Automation Strategy

Automation is preferred for repetitive, deterministic, stable, regression-worthy, and reliable scenarios. Avoid it for unstable requirements, exploratory work, significant human judgment, or high maintenance cost. Prioritize smoke tests, critical flows, stable regression, high-frequency/data-driven scenarios, API validation, and cross-browser coverage.

---

## 8. UI Automation Standards

Use Playwright and Page Object Model where appropriate. Reuse page objects and utilities; prefer semantic, stable locators (role, label, test ID); avoid XPath and hard-coded waits; use auto-waiting or explicit conditions; separate test data from logic; and keep tests independent.


## 9. API Automation Standards

Validate status codes, response structure and data, errors, authentication, authorization, request parameters, and boundaries. Do not test only status codes; keep API tests fast, deterministic, and independent.

---

## 10. Accessibility Testing

For user-facing functionality, check keyboard navigation, focus order, accessible names and labels, form errors, contrast, semantics, ARIA, screen-reader behavior, and error messages. Automated tools can identify common violations but do not replace human validation. Review all AI-generated accessibility findings.

---

## 11. Security Testing

Based on risk, test authentication, authorization, input validation, session management, sensitive-data handling, access control, and common web vulnerabilities. Perform security testing only within the authorized scope.

---

## 12. Exploratory Testing

Use risk-based, time-boxed exploratory testing when requirements are incomplete, features are new, risk is high, automation is insufficient, or unexpected behavior needs investigation. Record objective, scope, data, observations, defects, risks, and follow-up actions.

---

## 13. Regression Testing

Select regression scope using changed functionality, dependencies, business criticality, historical defects, integration impact, and risk. A smaller risk-based suite is sufficient when it provides adequate coverage; do not run the entire suite by default.

---

## 14. Defect Management

Reports should include defect ID, summary, environment, preconditions, reproduction steps, actual and expected results, evidence, severity, priority, and requirement/user-story reference. AI may improve descriptions, find duplicates, categorize, summarize logs, or suggest root-cause areas, but suggestions require verification.

---

## 15. AI-Assisted Testing

AI may support requirements, strategy, design, test-case and automation generation, execution analysis, defect analysis, and reporting. Treat its output as a recommendation. Testers remain responsible for reviewing requirements and coverage, validating generated artifacts and results, confirming defects, and making the final decision.

---

## 16. AI Safety Rules

Do not expose confidential data or credentials to unauthorized AI tools. Follow project AI security policy, verify all AI output, and do not allow AI to modify application source code during testing unless explicitly authorized. AI output is not evidence without verification.

---

## 17. Test Data

Keep test data controlled, reusable, non-sensitive unless authorized, separate from test logic, and suitable for positive, negative, and boundary scenarios. Prefer:

```text
test-data/
├── users.json
├── candidates.json
└── products.json
```

---

## 18. Test Execution

Record environment, build, scope, results, failures, blocked tests, defects, and risks. Use `PASS`, `FAIL`, `BLOCKED`, `NOT RUN`, or `NEEDS CLARIFICATION`.

---

## 19. Quality Gates

Before release, confirm critical flows pass, no critical defects remain, required regression and applicable security/accessibility/performance/compatibility checks are complete, automated regression is reliable, failures are investigated, and acceptance criteria are traceable to coverage.

---

## 20. Test Reporting

Reports should summarize scope, progress, results, defects, risks, coverage, automation status, outstanding issues, and release impact. Focus on quality and business impact, not only test counts.

---

## 21. Continuous Improvement

After each iteration or release, review defect trends, test and automation effectiveness, flaky and escaped defects, testing effort, AI-assisted testing effort, and coverage gaps; record improvement actions.

---

## 22. Definition of Done for Testing

Testing is complete when applicable requirements are reviewed, scenarios are designed and executed, critical flows and required regression are validated, defects and non-functional checks are assessed, automation results and outstanding risks are reviewed, and AI-generated artifacts receive human review.

---

## 23. Final Rule

> **Quality is a shared responsibility. Testing provides evidence about product quality and risk; it does not guarantee that the product is defect-free.**

When using AI, always apply:

> **AI generates → AI analyzes → Human verifies → Team decides**
