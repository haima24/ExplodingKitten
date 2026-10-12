---
name: testing-data-requirement-analysis
description: 'Use when analyzing data requirements before testing, including business requirements, source-to-target mappings, data dictionaries, transformation rules, or report requirements. Produce requirement gaps, testable data rules, acceptance criteria, data-testing scope, risks, and assumptions. Do not use for generating detailed test cases, implementing automation, executing tests, or debugging defects; route those requests to the appropriate testing skill.'
---

# Testing Data Requirement Analysis

## Purpose

Analyze data requirements before test design so that source data, target data, transformations, validations, reports, and business rules are complete, testable, and traceable.

## Context First

Read the available business requirements, source-to-target mapping, data dictionary, transformation rules, report requirements, repository instructions, and related architecture or API documentation. Ask when a required input, data ownership, expected behavior, or output format is missing. Assume only stated rules; label inferred rules, risks, and unresolved questions.

## Inputs

- Business requirements
- Source-to-target mapping
- Data dictionary
- Transformation rules
- Report requirements
- Related acceptance criteria, interface specifications, sample data, and data-quality constraints when available

## Workflow

1. **Load the data context.** Input: available requirement and data artifacts. Action: identify systems, entities, fields, ownership, lifecycle, interfaces, report consumers, and data-sensitive areas. Output: bounded data scope and source inventory.
2. **Map data behavior.** Input: source-to-target mapping, dictionary, and transformation rules. Action: map source fields to target fields, data types, formats, defaults, lookups, calculations, filters, joins, cardinality, null handling, and error behavior. Output: data-rule map.
3. **Analyze completeness.** Input: data scope and rule map. Action: compare stated requirements with mappings, definitions, transformations, reports, and acceptance criteria. Flag missing fields, conflicting definitions, ambiguous rules, unmapped fields, orphan targets, missing boundaries, and unavailable test data. Output: requirement-gap register.
4. **Make rules testable.** Input: data-rule map and gap register. Action: convert business and transformation rules into observable conditions with inputs, valid and invalid values, boundaries, expected target values, reconciliation checks, and report outcomes. Output: testable data-rule set.
5. **Define acceptance criteria.** Input: testable data rules and report behavior. Action: write Given/When/Then criteria for mapping, transformation, validation, reconciliation, error handling, security, and reporting behavior where applicable. Output: traceable acceptance-criteria set.
6. **Set testing scope.** Input: acceptance criteria, data risks, and integrations. Action: identify applicable unit, integration, API, UI/report, data-quality, migration, security, performance, and regression coverage. Output: prioritized data-testing scope.
7. **Close the analysis.** Input: all findings. Action: document risks, assumptions, dependencies, open questions, and decisions needed before test design. Output: review-ready analysis or explicitly marked `Draft`.

## Output Contract

Save the Markdown artifact under `working-artifacts/data-requirement-analysis/` using `DRA-<FEATURE-OR-REQUIREMENT-ID>-<NAME>.md`.

The document must contain:

1. Analysis metadata and source-artifact inventory.
2. Data scope, systems, entities, and ownership.
3. Source-to-target and transformation rule summary.
4. Requirement-gap register with severity, impact, and clarification owner where known.
5. Testable data rules with inputs, expected outputs, boundaries, and error behavior.
6. Acceptance criteria mapped to data rules and source requirements.
7. Data-testing scope and priority.
8. Risks, assumptions, dependencies, and open questions.
9. Readiness status: `Ready for Test Design`, `Draft`, or `NEEDS CLARIFICATION`.

Do not generate detailed test cases in this artifact. Link to the resulting test-case document when test design is complete.

## Decision Rules

1. Ask for missing source artifacts when their absence prevents field, transformation, or report validation.
2. Mark the analysis `NEEDS CLARIFICATION` when a rule changes expected data, report output, acceptance criteria, or test scope and cannot be resolved from approved sources.
3. Treat every unmapped source field, target field without a source, undefined transformation, and undocumented default as a visible gap.
4. Require boundary, null, duplicate, invalid-format, reconciliation, and error scenarios when the data rule makes them applicable.
5. Do not invent expected values, transformation formulas, data ownership, or report behavior; record them as assumptions or questions.
6. Route detailed test-case generation to `testing-design-test-case`, automation implementation to `testing-implement-automation`, and execution or defect investigation to the relevant testing skill.

## Quality Gate

The analysis is ready for test design only when applicable data sources and mappings are identified, transformation and validation rules are testable, report behavior is covered, gaps and assumptions are visible, acceptance criteria are traceable, scope is prioritized, and no unresolved critical clarification remains.

## Knowledge Sources

- Project testing standards and data-modeling guidance
- Approved business requirements and acceptance criteria
- Source-to-target mappings and data dictionaries
- Transformation specifications and report requirements
- Related architecture, API, security, and data-quality documentation
- Template: [`data-requirement-analysis.template.md`](references/data-requirement-analysis.template.md)
- Example: [`data-requirement-analysis.example.md`](references/data-requirement-analysis.example.md)
- Invocation prompt: [`prompt.md`](prompt.md)

## Related Skills

- `testing-analyze-requirements`
- `testing-design-test-case`
- `testing-implement-automation`
- `testing-accessibility-testing`
- `testing-analyze-bug`
