---
name: testing-etl-test-design
description: 'Use when generating ETL or ELT test scenarios and detailed test cases for source-to-target mappings, extracts, transformations, joins, lookups, full or incremental loads, data quality, recovery, dimensions, audit fields, or rejected records. Produce expected results, required test data, priority, and risk. Do not use for ETL execution, pipeline debugging, automation implementation, or generic non-ETL test design; route those requests to the appropriate testing skill.'
---

# Testing ETL Test Design

## Purpose

Generate traceable, risk-based ETL and ELT test scenarios and detailed test cases that verify data movement, transformation correctness, load behavior, recovery, auditability, and error handling.

## Context First

Read the approved business requirements, source-to-target mappings, data dictionary, transformation rules, pipeline or job specifications, load schedules, report requirements, interface contracts, sample data, and repository testing standards. Ask when source behavior, target behavior, load mode, expected results, or test-data access is missing. Assume only approved rules and label assumptions, gaps, and open questions.

## Coverage

Cover applicable areas:

- Source-to-target mapping and field-level reconciliation
- Extract completeness, filtering, schema, format, and connectivity validation
- Transformation rules, calculations, conversions, defaults, and validations
- Join, lookup, matching, cardinality, and unmatched-record logic
- Full, incremental, delta, restart, and late-arriving loads
- Duplicate, null, blank, invalid, boundary, and referential-integrity handling
- Reprocessing, restartability, idempotency, recovery, and rerun behavior
- Slowly changing dimensions, effective dates, current flags, and history preservation
- Audit fields, timestamps, control totals, lineage, and batch identifiers
- Error paths, rejected records, quarantine, alerts, logging, and retry behavior

## Workflow

1. **Load the pipeline context.** Input: requirements and ETL/ELT artifacts. Action: identify sources, targets, jobs, dependencies, schedules, load modes, entities, keys, and data owners. Output: bounded pipeline scope.
2. **Map data behavior.** Input: mappings, dictionaries, and transformation rules. Action: identify field mappings, data types, expressions, joins, lookups, filters, defaults, keys, timestamps, audit fields, and expected rejects. Output: testable data-rule map.
3. **Design scenarios.** Input: pipeline scope and data-rule map. Action: create positive, negative, boundary, reconciliation, recovery, rerun, and operational scenarios across all applicable coverage areas. Combine similar scenarios and remove duplicates. Output: prioritized scenario set.
4. **Define test data.** Input: scenario set and source constraints. Action: specify source records, target baselines, control totals, duplicates, nulls, invalid values, late-arriving records, changed records, rejected records, lookup variants, and expected historical versions. Output: traceable test-data requirements.
5. **Write detailed cases.** Input: approved scenarios and test-data requirements. Action: write preconditions, setup, numbered steps, inputs, expected source and target results, reconciliation checks, error outcomes, priority, risk, and automation assessment. Output: executable ETL test cases.
6. **Review coverage.** Input: generated scenarios and cases. Action: map cases to requirements, mappings, transformation rules, and pipeline risks; identify missing coverage, orphan cases, duplicate cases, unsupported assumptions, and untestable expected results. Output: coverage findings and readiness status.

## Output Contract

Save the Markdown artifact under `working-artifacts/etl-test-design/` using `ETL-TC-<FEATURE-OR-PIPELINE>-<NAME>.md`.

The document must contain:

1. Scope, pipeline, load mode, source, target, and requirement references.
2. Assumptions, dependencies, risks, and open questions.
3. ETL test scenarios mapped to the applicable coverage areas.
4. Detailed test cases with:
   - Test Case ID and `Verify...` title
   - Objective and requirement reference
   - Preconditions and required test data
   - Numbered test steps
   - Observable expected results for source, target, counts, totals, and logs where applicable
   - Testing technique, priority, and risk
   - Automation assessment
5. A coverage matrix for mappings, transformations, load modes, error paths, and acceptance criteria.
6. A quality gate and readiness status: `Ready for Review`, `Draft`, or `NEEDS CLARIFICATION`.

## Decision Rules

1. Ask for missing mappings, transformation formulas, key definitions, load-mode rules, or expected target results before finalizing cases.
2. Treat every unmapped field, undefined lookup, missing default, undocumented reject path, and ambiguous timestamp rule as a visible gap.
3. Require reconciliation of record counts, control totals, key populations, and important business measures when applicable.
4. Include both first-run and rerun behavior for jobs that can be restarted or reprocessed.
5. Include full-load and incremental-load cases when the pipeline supports both.
6. Test duplicate, null, invalid, boundary, unmatched, late-arriving, and rejected records when applicable to the rules.
7. Verify SCD type behavior only when the dimension strategy, effective-date rules, and current-record rules are defined.
8. Do not invent expected target values or recovery behavior; record unresolved behavior as `NEEDS CLARIFICATION`.
9. Route generic test-case design to `testing-design-test-case`, ETL execution or debugging to the relevant execution or defect skill, and automation implementation to `testing-implement-automation`.

## Quality Gate

Cases are ready for review only when applicable mappings and transformations are covered, full and incremental behavior is addressed, data-quality and error paths are represented, expected results are observable, test data is sufficient, priorities and risks are assigned, every case is traceable, and no critical clarification remains unresolved.

## Knowledge Sources

- Template: [`etl-test-design.template.md`](references/etl-test-design.template.md)
- Example: [`etl-test-design.example.md`](references/etl-test-design.example.md)
- Invocation prompt: [`prompt.md`](prompt.md)

## Related Skills

- `testing-data-requirement-analysis`
- `testing-design-test-case`
- `testing-implement-automation`
- `testing-analyze-bug`
