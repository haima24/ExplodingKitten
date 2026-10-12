---
name: testing-golden-data-validation
description: 'Use when validating ETL outputs, data warehouse tables, semantic models, or BI reports against a versioned golden dataset. Produce golden-data validation rules, expected results, read-only SQL validation, reconciliation and KPI comparison reports, and a PASS/FAIL summary. Do not use for creating the golden dataset, changing source data, generic ETL test design, or executing queries without an approved golden baseline.'
---

# Testing Golden Data Validation

## Purpose

Validate data pipelines and reporting layers against an approved, versioned golden dataset so that row-level differences, aggregates, semantic measures, KPIs, and intentional exceptions are measurable and traceable.

## Context First

Read the approved golden dataset metadata, version or hash, schema, business keys, expected values, source-to-target mappings, transformation rules, warehouse model, semantic-model definitions, BI report requirements, tolerance policy, and comparison scope. Confirm the environment, batch or reporting period, SQL dialect, time zone, precision, masking rules, and golden-data owner. Ask when the baseline, version, expected result, or comparison rule is missing; do not silently create a golden expectation.

## Inputs

- Versioned golden dataset and manifest
- Golden schema, keys, expected row counts, aggregates, and KPI values
- ETL output, warehouse tables, semantic model, or BI report results
- Source-to-target mappings and transformation rules
- Semantic measures, dimensions, filters, and report definitions
- Comparison keys, tolerances, exclusions, and intentional-difference rules
- SQL dialect, environment, batch, partition, and reporting-period parameters

## Coverage

Validate applicable layers and dimensions:

- ETL output rows, fields, transformations, rejects, and control totals
- Data warehouse facts, dimensions, keys, grain, history, and aggregates
- Semantic-model measures, relationships, filters, hierarchies, and calculation logic
- BI report values, KPI cards, filters, and selected visual outputs
- Row existence, missing rows, extra rows, field differences, nulls, duplicates, and data types
- Aggregation, reconciliation, rounding, precision, time-zone, and date-boundary differences
- Intentional differences, masked fields, non-deterministic fields, and approved exclusions

## Workflow

1. **Load the golden baseline.** Input: golden dataset and manifest. Action: verify version, checksum, schema, keys, scope, owner, and approval status. Output: trusted baseline or `NEEDS CLARIFICATION`.
2. **Define comparison rules.** Input: baseline, output layer, mappings, and tolerance policy. Action: define row keys, compared fields, null semantics, numeric precision, excluded fields, intentional differences, aggregate grain, and KPI filters. Output: golden validation rule set.
3. **Profile the actual output.** Input: ETL, warehouse, semantic, or BI output. Action: capture schema, row counts, key population, nulls, duplicates, aggregates, freshness, and KPI values for the same scope. Output: actual-result profile.
4. **Generate validation SQL.** Input: comparison rules and database objects. Action: create read-only queries for missing, extra, changed, duplicate, aggregate, fact, dimension, and KPI discrepancies. Output: validation SQL and expected query results.
5. **Reconcile results.** Input: golden profile, actual profile, SQL output, and report values. Action: compare row-level differences, totals, measures, KPIs, thresholds, exclusions, and evidence. Output: reconciliation report and KPI comparison report.
6. **Assess the gate.** Input: all comparisons and findings. Action: classify discrepancies by severity and cause category, apply approved tolerances and exceptions, and produce `PASS`, `CONDITIONAL PASS`, `FAIL`, or `NEEDS CLARIFICATION`. Output: final validation summary.

## Output Contract

Save the Markdown artifact under `working-artifacts/golden-data-validation/` using `GDV-<DATASET-OR-PIPELINE-ID>-<NAME>.md`.

The document must contain:

1. Golden dataset manifest: name, version, checksum or immutable identifier, owner, approval, scope, and schema.
2. Actual output metadata: layer, environment, batch or period, refresh time, and source artifact.
3. Golden dataset validation rules with key, fields, comparison method, tolerance, exclusions, and expected result.
4. Read-only validation SQL with parameters, purpose, expected result, and execution notes.
5. Row-level and aggregate reconciliation report with missing, extra, changed, excluded, and unmatched counts.
6. KPI comparison report with golden value, actual value, difference, tolerance, status, and evidence.
7. Findings, risks, assumptions, intentional differences, and remediation actions.
8. Final assessment: `PASS`, `CONDITIONAL PASS`, `FAIL`, or `NEEDS CLARIFICATION`.

## Decision Rules

1. Do not validate against an unversioned, unapproved, or checksum-mismatched golden dataset without marking the result `NEEDS CLARIFICATION`.
2. Compare by approved business key and document behavior for missing, extra, duplicate, and changed keys.
3. Exclude timestamps, generated IDs, hashes, masked fields, or other non-deterministic values only when the exclusion is approved and recorded.
4. Apply numeric, date, timestamp, and KPI tolerances exactly as approved; do not round silently.
5. Compare semantic and BI values under the same filters, roles, period, time zone, and refresh state as the golden result.
6. Treat unexplained critical row, aggregate, semantic-measure, or KPI differences as failures.
7. A zero-difference query result is not sufficient if the source population is empty or the query scope is incomplete.
8. Protect sensitive golden data by using masked values, hashes, counts, or controlled evidence.
9. Route SQL-only generation to `testing-data-validation-query`, data-quality assessment to `testing-data-quality-validation`, ETL scenario design to `testing-etl-test-design`, and dashboard coverage to `testing-visual-report-testing`.

## Quality Gate

Validation is ready for release review when the golden baseline is approved and immutable, comparison scope and keys are explicit, SQL covers row and aggregate differences, semantic and KPI comparisons use matching context, tolerances and exclusions are documented, evidence is retained, and the final assessment is supported by observed results.

## Knowledge Sources

- Template: [`golden-data-validation.template.md`](references/golden-data-validation.template.md)
- Example: [`golden-data-validation.example.md`](references/golden-data-validation.example.md)
- Invocation prompt: [`prompt.md`](prompt.md)

## Related Skills

- `testing-data-validation-query`
- `testing-data-quality-validation`
- `testing-etl-test-design`
- `testing-visual-report-testing`
- `testing-data-test-reporting`
