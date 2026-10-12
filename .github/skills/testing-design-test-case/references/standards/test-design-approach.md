---
name: test-design-approach
description: "Defines the default risk-based approach for deriving atomic test scenarios from requirements. Use when selecting coverage layers, test-design techniques, and scenario priorities before writing or automating test cases. Do not use for test execution or implementation-specific automation guidance."
---

# Test Design Approach

## Purpose

Turn requirements into prioritized, atomic scenarios before they are written as test cases.

## Context First

Read the complete requirement and identify acceptance criteria, business rules, actors, data, state changes, integrations, and risk. Ask when scope or expected behavior is ambiguous. Assume only stated behavior and record inferred coverage decisions.

## Workflow

1. **Map behavior.** Input: requirement, scope, and risks. Action: classify core, alternate, exception, validation, state, and integration paths. Output: a coverage map.
2. **Select techniques.** Input: coverage map and domain constraints. Action: use the selection guidance in [`test-design-techniques.md`](test-design-techniques.md). Output: a non-duplicated technique plan.
3. **Shape scenarios.** Input: technique plan and requirements. Action: derive representative cases, keep one primary objective per case, and link each case to a requirement or acceptance criterion. Output: prioritized scenarios.
4. **Expose gaps.** Input: scenario set. Action: check applicable coverage and record ambiguity, assumptions, risks, and excluded scope. Output: scenarios ready for [`test-case.template.md`](../templates/test-case.template.md).

## Output Contract

The resulting case set covers applicable positive, negative, boundary, alternate, exception, state, and integration behavior. Each case has explicit preconditions, realistic reusable data, observable expected results, an appropriate technique, and a requirement reference.

## Coverage Layers

1. Core happy-path workflows.
2. Alternate and exception flows.
3. Input and validation behavior.
4. State and transition behavior.
5. Integration touchpoints.

Use [`testing-standard.md`](testing-standard.md) for shared traceability, quality, security, accessibility, and non-functional policy. Use [`test-design-techniques.md`](test-design-techniques.md) for technique definitions and feature-specific selection.
