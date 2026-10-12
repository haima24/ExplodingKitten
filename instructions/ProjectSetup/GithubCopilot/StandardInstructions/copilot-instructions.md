# Project Copilot Instructions

## General Principles

- Follow the Software Development Lifecycle (SDLC): Requirements → Design → Development → Testing → Deployment.
- Always review existing requirements, architecture, and coding standards before generating outputs.
- Prefer simple, maintainable, and production-ready solutions.
- Do not make assumptions. Request clarification when requirements are ambiguous.
- Follow all instructions defined in `.github/instructions/*.md`.
- Reuse existing components, services, and test assets whenever possible.
- Ensure all generated artifacts are traceable to documented requirements.

---

# Business Analysis Rules

## Requirements Analysis

- Analyze business requirements before proposing a solution.
- Identify missing, ambiguous, or conflicting requirements.
- Convert requirements into clear user stories and acceptance criteria.
- Maintain traceability between:
  - Business Requirements
  - User Stories
  - Test Scenarios
  - Test Cases

## User Stories

Use the format:

As a <role>
I want <capability>
So that <benefit>

## Acceptance Criteria

- Acceptance criteria must be testable.
- Acceptance criteria should follow Given/When/Then format whenever applicable.
- Highlight missing acceptance criteria or edge cases.

---

# Development Rules

## Code Quality

- Generate clean, readable, and maintainable code.
- Follow SOLID principles.
- Follow DRY (Don't Repeat Yourself).
- Follow KISS (Keep It Simple).
- Avoid hard-coded values.
- Handle exceptions appropriately.
- Use dependency injection where applicable.

## Implementation

Before generating code:

1. Review requirements.
2. Review architecture.
3. Review data model.
4. Review API contracts.

Generated code must:

- Compile successfully.
- Follow project structure.
- Include error handling.
- Include logging where appropriate.
- Include comments only when necessary.

## API Development

- Follow RESTful API design standards.
- Use meaningful endpoint names.
- Validate all input data.
- Return appropriate HTTP status codes.
- Produce API documentation when requested.

## Data Access

- Use repository or service patterns where applicable.
- Avoid duplicate database queries.
- Optimize for maintainability before optimization for performance.

---

# Testing Rules

## Automation First

- Apply Automation-First Testing approach.
- Generate automated tests whenever feasible.
- Manual testing should focus on exploratory and business validation scenarios.

## Test Design

Generate test scenarios that cover:

- Positive flows
- Negative flows
- Boundary conditions
- Validation rules
- Error handling
- Security risks
- Accessibility requirements

## Test Coverage

Each Acceptance Criterion must have at least one test case.

Test coverage should include:

- Unit Testing
- Integration Testing
- API Testing
- End-to-End Testing

## Test Automation

When generating automated tests:

- Follow project testing framework standards.
- Reuse existing test utilities.
- Follow Page Object Model for UI automation.
- Avoid duplicated test logic.

## Traceability

Maintain traceability between:

Business Requirement
→ User Story
→ Acceptance Criteria
→ Test Scenario
→ Test Case
→ Test Execution Result

## Test Results

Test outputs should include:

- Passed
- Failed
- Blocked
- Not Executed

Include evidence and failure details where applicable.

---

# Security Rules

- Follow secure coding practices.
- Validate all user inputs.
- Prevent common OWASP vulnerabilities.
- Never expose secrets, credentials, or sensitive data in generated code.

---

# Accessibility Rules

When generating UI:

- Follow WCAG standards.
- Support keyboard navigation.
- Provide accessible labels and descriptions.
- Ensure sufficient color contrast.

---

# Documentation Rules

Whenever creating a feature:

- Update requirements if affected.
- Update architecture if affected.
- Update test assets if affected.
- Update traceability matrix if affected.

All generated artifacts must remain consistent across documentation, code, and tests.