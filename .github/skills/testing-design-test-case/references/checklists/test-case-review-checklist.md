---
name: test-case-review-checklist
description: "Reviews generated or manually written test cases for requirement coverage, design quality, executability, traceability, automation readiness, and duplication. Use before finalizing test cases or passing them to automation. Do not use as a substitute for test execution or defect diagnosis."
---

# Test Case Review Checklist

## Purpose

Evaluate generated or manually written test cases before finalization or automation handoff.

## Context First

Apply the checklist after cases have been generated and before they are finalized or passed to automation. Read the source requirement, [`test-case.template.md`](../templates/test-case.template.md), and [`testing-standard.md`](../standards/testing-standard.md) first. Ask when expected behavior, scope, or requirement traceability is unclear; assume no unrequested non-functional coverage and record it as not applicable with a reason.

## Workflow

1. **Check requirement coverage.** Input: requirements and generated cases. Action: verify every applicable requirement and acceptance criterion has traceable coverage. Output: coverage findings.
2. **Check case quality.** Input: case tables, data, steps, results, priorities, and techniques. Action: evaluate executability, clarity, boundaries, negative paths, duplication, and measurable results. Output: case-level findings.
3. **Check operational readiness.** Input: automation assessment and non-functional considerations. Action: identify candidates, gaps, risks, and unsupported assumptions. Output: readiness findings.
4. **Close the review.** Input: all findings. Action: resolve applicable failures or document open questions and reasons for non-applicable checks. Output: a completed checklist and finalization decision.

## Output Contract

Return a completed checklist with status for each applicable item, documented reasons for non-applicable items, traceability findings, automation assessment, assumptions, risks, and an explicit finalization decision. Do not mark the artifact final when critical coverage or security issues remain unresolved.

---

# 1. Requirement Coverage

| Check | Status |
|-------|--------|
| Every requirement is covered by one or more test cases. | ☐ |
| Every acceptance criterion is covered. | ☐ |
| Business rules are validated. | ☐ |
| Alternate flows are covered where applicable. | ☐ |
| Error scenarios are included. | ☐ |
| Regression impact has been considered. | ☐ |

---

# 2. Test Design

| Check | Status |
|-------|--------|
| Appropriate test design techniques have been applied. | ☐ |
| Positive scenarios are included. | ☐ |
| Negative scenarios are included. | ☐ |
| Boundary conditions are tested where applicable. | ☐ |
| Invalid input scenarios are covered. | ☐ |
| Duplicate scenarios have been removed. | ☐ |
| Test cases provide meaningful coverage without unnecessary overlap. | ☐ |

---

# 3. Test Case Quality

| Check | Status |
|-------|--------|
| Test Case ID follows the naming convention. | ☐ |
| Title clearly describes the expected behavior. | ☐ |
| Test title begins with **"Verify..."**. | ☐ |
| Requirement reference is correct. | ☐ |
| Testing technique is appropriate. | ☐ |
| Priority is assigned correctly. | ☐ |

---

# 4. Preconditions

| Check | Status |
|-------|--------|
| Preconditions are clearly defined. | ☐ |
| Preconditions contain only setup information. | ☐ |
| Preconditions do not duplicate execution steps. | ☐ |

---

# 5. Test Data

| Check | Status |
|-------|--------|
| Test data is realistic. | ☐ |
| Test data supports the scenario being tested. | ☐ |
| Invalid data is included where appropriate. | ☐ |
| Boundary values are included where applicable. | ☐ |
| Duplicate data scenarios are covered where applicable. | ☐ |

---

# 6. Test Steps

| Check | Status |
|-------|--------|
| Steps are clear and easy to execute. | ☐ |
| Steps are numbered sequentially. | ☐ |
| Each step represents a single user action. | ☐ |
| Steps are concise and unambiguous. | ☐ |
| Steps avoid unnecessary detail. | ☐ |

---

# 7. Expected Results

| Check | Status |
|-------|--------|
| Expected results are observable. | ☐ |
| Expected results are verifiable. | ☐ |
| Expected results are specific. | ☐ |
| Validation messages are included where applicable. | ☐ |
| System behavior is clearly described. | ☐ |
| Expected results do not contain vague statements (e.g., "System works correctly"). | ☐ |

---

# 8. Priority Review

| Check | Status |
|-------|--------|
| Critical business flows are marked as Critical. | ☐ |
| High-risk scenarios have appropriate priority. | ☐ |
| Low-risk scenarios are not over-prioritized. | ☐ |
| Priority aligns with business impact. | ☐ |

---

# 9. Test Design Technique Review

| Check | Status |
|-------|--------|
| Equivalence Partitioning is applied where appropriate. | ☐ |
| Boundary Value Analysis is applied where appropriate. | ☐ |
| Decision Table Testing is applied for business rules with multiple conditions. | ☐ |
| State Transition Testing is applied for workflow or status changes. | ☐ |
| Use Case Testing covers end-to-end user journeys. | ☐ |

---

# 10. Non-functional Considerations

Review whether additional test cases are needed for:

| Check | Status |
|-------|--------|
| Security | ☐ |
| Accessibility | ☐ |
| Performance | ☐ |
| Compatibility | ☐ |
| Localization | ☐ |
| Integration | ☐ |

If not applicable, document the reason.

---

# 11. Traceability

| Check | Status |
|-------|--------|
| Every test case is traceable to a requirement or acceptance criterion. | ☐ |
| No orphan test cases exist. | ☐ |
| Requirement references are correct. | ☐ |

---

# 12. Duplication Review

| Check | Status |
|-------|--------|
| Duplicate test cases have been removed. | ☐ |
| Similar scenarios have been consolidated where appropriate. | ☐ |
| Each test case validates a unique objective. | ☐ |

---

# 13. AI Quality Review

For AI-generated test cases, verify that the AI:

| Check | Status |
|-------|--------|
| Correctly interpreted the requirements. | ☐ |
| Did not invent unsupported business rules. | ☐ |
| Identified assumptions where requirements were incomplete. | ☐ |
| Selected appropriate test design techniques. | ☐ |
| Generated comprehensive but non-redundant test cases. | ☐ |


# 14 Coverage Validation

| Check | Status |
|-------|--------|
|Each AC is classified correctly (Simple / Medium / Complex) | ☐ |
|Test cases match AC complexity| ☐ |
|No missing scenario types:  - Positive   - Negative   - Boundary (if applicable)   - Business Rule (if  applicable)| ☐ |
|Coverage is complete at feature level| ☐ |
|Output is consistent for same input| ☐ |

# 15 Automation Assessment Checklist

| Criteria | Yes | No |
|----------|:---:|:--:|
| Frequently executed | □ | □ |
| Regression candidate | □ | □ |
| High business priority | □ | □ |
| Stable requirement | □ | □ |
| Stable UI/API | □ | □ |
| Deterministic expected result | □ | □ |
| Test data can be prepared automatically | □ | □ |
| Environment is available | □ | □ |
| Low maintenance cost | □ | □ |

If most conditions are satisfied (>90%)

Automation = Yes

Otherwise:

Automation = No
---
