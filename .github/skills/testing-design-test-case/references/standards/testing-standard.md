---
name: testing-standard
description: "Defines the shared quality standard for testing artifacts. Use when generating or modifying test cases, test strategies, automation inputs, or other testing deliverables and when checking traceability, coverage, security, accessibility, and expected-result quality. Do not use it as a test execution or defect-debugging workflow."
---

# Testing Standard

## Purpose

Define the shared policy for accurate, traceable, risk-based, and maintainable testing artifacts.

## Context First

Read the applicable requirement and identify its objective, roles, dependencies, business rules, assumptions, ambiguities, and risks. Ask when the requirement or scope is unclear. Assume no unrequested behavior, especially non-functional behavior, and record inferred rules or excluded coverage.

## Workflow

1. **Baseline the requirement.** Input: requirements and project context. Action: identify testable behavior, roles, dependencies, assumptions, and gaps. Output: a requirement baseline.
2. **Design coverage.** Input: the baseline and applicable risk areas. Action: cover each requirement and acceptance criterion with applicable scenarios without duplication. Output: traceable coverage.
3. **Specify cases.** Input: selected coverage and reusable data. Action: define one primary objective per case with clear preconditions, steps, expected results, priority, technique, and traceability. Output: maintainable test cases.
4. **Validate quality.** Input: the testing artifact. Action: check observability, completeness, security, accessibility, non-functional scope, and consistency with this standard. Output: a finalized artifact or visible assumptions, risks, and open questions.

## Output Contract

Every applicable test case includes a unique ID, action-oriented title, objective, preconditions, test data, numbered steps, observable expected results, priority, technique, and requirement traceability. Missing information is an assumption, clarification question, or testing risk.

# General Principles

## Understand Requirements First

Before generating any testing artifacts, AI should:

- Read all provided requirements.
- Identify business objectives.
- Identify user roles.
- Identify assumptions.
- Identify dependencies.
- Detect ambiguities or missing information.

If information is missing, list assumptions or clarification questions.

---

## Traceability

Every testing artifact should be traceable back to one or more requirements.

Ensure:

- Every requirement has at least one corresponding test.
- Every test references the related requirement.
- No orphan test cases.

---

## Test Design Principles

Generate tests that maximize defect detection while minimizing duplication.

Cover:

- Happy path
- Negative scenarios
- Boundary values
- Invalid inputs
- Error handling
- Permission validation
- State transitions
- Business rules
- Alternate flows
- Recovery scenarios

Avoid duplicate test cases.

---

## Test Coverage

Consider coverage from multiple perspectives.

### Functional

- Features
- Business rules
- User workflows

### UI

- Layout
- Controls
- Navigation
- Validation messages
- Responsive behavior

### API (if applicable)

- Request validation
- Response validation
- Status codes
- Error responses
- Authentication
- Authorization

### Database (if applicable)

- Data persistence
- Constraints
- Transactions
- Data integrity

### Integration

- External systems
- Event processing
- Message queues
- Third-party services

---

## Non-functional Coverage

When applicable, include:

- Performance
- Security
- Accessibility
- Compatibility
- Reliability
- Usability
- Localization
- Recovery

---

# Test Case Standards

Each test case should include:

- Unique ID (if required)
- Title
- Objective
- Preconditions
- Test Data
- Steps
- Expected Results
- Priority
- Tags (optional)

Test cases should:

- Validate one primary objective.
- Be executable independently.
- Be easy to understand.
- Avoid unnecessary details.
- Use clear language.

---

# Expected Result Standard

Expected results should be:

- Observable
- Verifiable
- Measurable
- Specific

Avoid vague statements; expected results should identify the observable outcome.

---

# Test Data Standard

Use realistic data whenever possible.

Consider:

- Valid data
- Invalid data
- Empty values
- Maximum values
- Minimum values
- Special characters
- Unicode
- Duplicate data

---

# Boundary Testing

Include boundary tests for:

- Minimum values
- Maximum values
- Length limits
- Numeric ranges
- Date ranges
- File size limits

---

# Negative Testing

Always consider:

- Invalid input
- Missing required fields
- Unauthorized access
- Expired sessions
- Network failures
- Invalid configuration
- Duplicate requests

---

# Security Testing

When applicable, validate:

- Authentication
- Authorization
- Input validation
- SQL Injection
- XSS
- CSRF
- Sensitive data exposure
- Session handling

---

# Accessibility

When applicable, verify:

- Keyboard navigation
- Screen reader compatibility
- Color contrast
- Focus order
- Accessible labels
- Error announcement

Follow WCAG guidelines where applicable.

---

# AI Generation Rules

AI should:

- Avoid duplicate tests.
- Merge similar scenarios when appropriate.
- Prefer reusable test data.
- Use concise wording.
- Keep naming consistent.
- Highlight assumptions.
- Flag unclear requirements.
- Identify testing risks.

Do not invent business rules that are not supported by requirements.

---

# Naming Convention

Test titles should use an action-oriented format.

Examples:

- Verify user can log in with valid credentials
- Verify password is required
- Verify duplicate email cannot be registered

Avoid vague titles.

Examples:

❌ Login Test

❌ User Test

---

# Prioritization

Assign priorities based on business impact.

| Priority | Description |
|----------|-------------|
| Critical | Core business functionality |
| High | Frequently used functionality |
| Medium | Supporting functionality |
| Low | Cosmetic or optional functionality |

---

# Review Checklist

Before finalizing, verify:

- Requirement coverage complete
- No duplicate tests
- Clear expected results
- Correct priorities
- Boundary cases included
- Negative cases included
- Security considered
- Accessibility considered
- Traceability maintained
- Assumptions documented

---

# Output Quality

Generated artifacts should be:

- Accurate
- Complete
- Consistent
- Readable
- Maintainable
- Easy to review
- Easy to automate