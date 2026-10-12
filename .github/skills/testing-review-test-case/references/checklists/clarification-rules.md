---
name: clarification-rules-review
description: "Review-facing rules for handling missing or ambiguous information without inventing behavior or overstating a test-case verdict."
---

## Purpose

Keep ambiguity handling explicit and consistent during test-case review.

## Context First

Apply these rules when requirements, expected results, permissions, integrations, or scope are incomplete.

## Workflow

1. **Input:** ambiguity and affected cases. **Action:** classify the impact, ask a focused question, or record a bounded assumption. **Output:** a visible readiness decision.

## Output Contract

Include unresolved questions, impact, and blocked readiness in the review report when critical ambiguity remains.

# Clarification Rules

Rules for handling missing or ambiguous information.

1. Never invent business behavior.
2. Ask clarification when ambiguity affects correctness.
3. Record explicit assumptions only when proceeding is still safe.
4. Stop execution when critical information is unavailable.
5. Separate confirmed facts from assumptions in outputs.

Critical ambiguity examples:

- Undefined acceptance criteria or success conditions.
- Missing expected result for key workflow steps.
- Unclear role permissions or access constraints.
- Missing integration dependency behavior.

Output expectations:

- Include unresolved questions in a dedicated list.
- Include impact of each unresolved question.
- Mark readiness as blocked when critical ambiguity remains.
