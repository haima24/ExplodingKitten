---
name: testing-review-design-techniques
description: "Review adapter for canonical test-design techniques. Use when checking whether selected techniques fit requirement inputs, boundaries, rules, states, journeys, combinations, and known risks."
---

# Test Design Techniques Review Notes

## Purpose

Check whether the techniques claimed by a reviewed test-case artifact fit the requirement and produce sufficient coverage.

## Context First

Read the requirement, constraints, business rules, state changes, selected techniques, and generated cases. Ask when a technique choice cannot be evaluated from the available evidence. Record unsupported technique claims as findings.

## Workflow

1. **Check technique fit.** Input: requirements, risks, and case techniques. Action: compare equivalence partitioning, boundary analysis, decision tables, state transitions, use-case testing, pairwise testing, and error guessing with the behaviors under test. Output: technique-fit findings.
2. **Check scenario evidence.** Input: selected techniques and cases. Action: verify representative partitions, boundaries, combinations, transitions, and error paths are covered without duplication. Output: coverage findings.
3. **Close findings.** Input: technique and coverage findings. Action: record impact, recommendation, status, assumptions, and open questions. Output: report-ready evidence.

## Output Contract

Record each technique deviation with the affected requirement or case, evidence, impact, recommendation, and status.

Use the canonical [`test-design-techniques.md`](../../../testing-design-test-case/references/standards/test-design-techniques.md) as the source of truth.
