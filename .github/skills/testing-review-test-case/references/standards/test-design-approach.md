---
name: testing-review-design-approach
description: "Review adapter for the canonical test-design approach. Use when checking scenario layers, atomicity, prioritization, and coverage decisions in test-case artifacts."
---

# Test Design Approach Review Notes

## Purpose

Check whether a reviewed test-case artifact applies the canonical scenario-planning approach.

## Context First

Read the requirement, requested scope, risk context, and reviewed cases. Ask when scenario intent or expected behavior is ambiguous. Do not infer missing coverage as passing coverage.

## Workflow

1. **Check scenario layers.** Input: requirement and case set. Action: assess core, alternate, exception, validation, state, and integration coverage as applicable. Output: layer coverage findings.
2. **Check atomicity and priority.** Input: cases and risk context. Action: verify one primary objective per case, explicit data and preconditions, requirement links, and risk-aligned priority. Output: actionable design findings.
3. **Close gaps.** Input: findings. Action: record assumptions, open questions, and excluded scope. Output: review-ready evidence.

## Output Contract

Record scenario coverage, atomicity, prioritization, traceability, and gaps in the review report.

Use the canonical [`test-design-approach.md`](../../../testing-design-test-case/references/standards/test-design-approach.md) as the source of truth.
