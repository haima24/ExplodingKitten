---
name: review-test-case-example
description: "Concise example of a review report for a test-case artifact generated from the canonical design package."
---

# Test Case Review Example

## Purpose

Show the expected evidence-based format for reviewing a generated test-case artifact.

---

## Workflow

1. **Input:** `TC_LOGIN_001.md` and login acceptance criteria. **Action:** compare the artifact with the canonical fields and checklist. **Output:** coverage assessment and findings.
2. **Input:** findings. **Action:** record impact and disposition in the review report. **Output:** an explicit verdict.

## Output Contract

Save the report under `working-artifacts/test-case-reviews/` using the [review report template](../templates/test-case-review.template.md).

## Sample Findings

| ID | Severity | Category | Evidence | Impact | Recommendation | Status |
| --- | --- | --- | --- | --- | --- | --- |
| FINDING-001 | High | Coverage | No boundary case for the password length rule | Boundary defects may escape | Add boundary coverage through `testing-design-test-case` | Open |
| FINDING-002 | Medium | Expected Result | Login result does not state the observable session or redirect | Execution outcome is ambiguous | Specify the observable result | Open |

## Final Verdict

**Major Revision Required** when the missing boundary coverage is applicable and material; otherwise **Minor Revision Required** for the expected-result finding alone.