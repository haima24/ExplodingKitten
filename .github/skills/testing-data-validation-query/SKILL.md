---
name: testing-data-validation-query
description: 'Use when generating SQL validation queries or scripts for ETL, ELT, databases, data warehouses, migrations, or reports. Cover row counts, source-to-target comparisons, duplicates, nulls, referential integrity, reconciliations, transformations, incremental loads, facts, and dimensions. Produce query purpose, expected results, parameters, assumptions, and execution notes. Do not use for executing queries, changing data, debugging database infrastructure, or designing generic test cases.'
---

# Testing Data Validation Query

## Purpose

Generate safe, traceable SQL validation queries that compare expected and actual data behavior across sources, targets, transformations, loads, facts, dimensions, and data-quality rules.

## Context First

Read the approved requirements, source-to-target mappings, data dictionary, transformation rules, schema, table relationships, load metadata, control totals, database or warehouse dialect, and query execution conventions. Confirm source and target objects, keys, time window, batch or watermark, comparison tolerance, expected output, access limitations, and whether the query must be read-only. Ask when these details are missing; do not invent table names, keys, formulas, thresholds, or expected values.

## Inputs

- Business and data requirements
- Source-to-target mappings and transformation rules
- Source, target, fact, dimension, and reference table schemas
- Primary keys, foreign keys, business keys, and lookup rules
- Load batch, watermark, timestamp, and partition parameters
- Control totals, expected counts, tolerances, and quality thresholds
- SQL dialect and execution environment

## Coverage

Generate applicable validation queries for:

- Row-count comparison between source and target populations
- Source-to-target field and record comparison
- Duplicate-key and duplicate-record detection
- Required-field and null validation
- Referential-integrity and orphan-record detection
- Aggregation, balance, and control-total reconciliation
- Transformation expression and derived-value verification
- Incremental-load watermark, changed-record, and no-duplicate verification
- Fact grain, measures, foreign keys, and dimension-key validation
- Dimension uniqueness, current flags, effective dates, and history validation

## Workflow

1. **Define the query context.** Input: requirements, schemas, mappings, and execution metadata. Action: identify objects, keys, joins, filters, partitions, batch parameters, dialect, and expected result shape. Output: query boundary.
2. **Select validation logic.** Input: query boundary and requested coverage. Action: choose count, anti-join, aggregate, duplicate, null, constraint, transformation, watermark, fact, or dimension logic. Output: validation design.
3. **Write the SQL.** Input: validation design and dialect. Action: generate read-only SQL with named parameters, explicit joins, deterministic filters, null-safe comparisons, and clearly labeled result columns. Output: executable validation script.
4. **Define expected results.** Input: generated query and quality rules. Action: state pass conditions, failure conditions, tolerances, expected row shape, and interpretation of zero or nonzero results. Output: expected-result definition.
5. **Document execution context.** Input: script, parameters, and assumptions. Action: describe required permissions, parameter values, execution order, performance cautions, masking needs, and evidence to retain. Output: execution notes.
6. **Review query safety and traceability.** Input: complete validation artifact. Action: confirm the script is read-only, joins and filters are scoped, rules are traceable, dialect is identified, and unresolved assumptions are visible. Output: review-ready query artifact or `NEEDS CLARIFICATION`.

## Output Contract

Save the Markdown artifact under `working-artifacts/data-validation-query/` using `DVQ-<DATASET-OR-PIPELINE-ID>-<NAME>.md`.

The document must contain:

1. Query metadata: purpose, validation type, source, target, dialect, owner, and scope.
2. Parameters table with name, type, example or allowed values, and required status.
3. Assumptions, dependencies, exclusions, and unresolved questions.
4. One or more read-only SQL scripts in fenced `sql` blocks.
5. Query purpose and validation logic for every script.
6. Expected result, pass/fail rule, tolerance, and interpretation of returned rows.
7. Execution notes, permissions, performance considerations, evidence, and limitations.
8. Requirement, mapping, acceptance-criterion, or quality-rule traceability.

Use placeholders such as `:batch_id`, `:from_timestamp`, and `:to_timestamp` when values are environment-specific. Identify dialect-specific syntax explicitly.

## Decision Rules

1. Prefer read-only `SELECT` statements and CTEs; never generate `INSERT`, `UPDATE`, `DELETE`, `MERGE`, DDL, or administrative statements unless explicitly requested and authorized.
2. Use anti-joins or `EXCEPT`/`MINUS` only when the selected dialect and null semantics are documented; provide a compatible alternative when needed.
3. Compare nullable fields with explicit null-safe logic and document trimming, casing, precision, timezone, and collation assumptions.
4. Scope incremental checks by approved watermark, batch ID, partition, or change timestamp; do not use an arbitrary time range silently.
5. Define expected zero-row or nonzero-row behavior for discrepancy queries.
6. Use tolerances for approved numeric or timestamp differences and state how rounding is applied.
7. Protect sensitive data by selecting keys, counts, hashes, or masked values instead of unnecessary raw data.
8. Do not claim a pass from an empty result when the query may have returned no source population or skipped records.
9. Route data-rule discovery to `testing-data-requirement-analysis`, ETL scenario design to `testing-etl-test-design`, data-quality assessment to `testing-data-quality-validation`, and query execution or defect investigation to the relevant skill.

## Quality Gate

The query artifact is ready for review when every script has a stated purpose, parameters, source and target scope, dialect, expected result, pass/fail rule, traceability, and execution notes; joins and null handling are explicit; sensitive output is controlled; and no unresolved assumption affects validity.

## Knowledge Sources

- Template: [`data-validation-query.template.md`](references/data-validation-query.template.md)
- Example: [`data-validation-query.example.md`](references/data-validation-query.example.md)
- Invocation prompt: [`prompt.md`](prompt.md)

## Related Skills

- `testing-data-requirement-analysis`
- `testing-etl-test-design`
- `testing-data-quality-validation`
- `testing-design-test-case`
- `testing-analyze-bug`
