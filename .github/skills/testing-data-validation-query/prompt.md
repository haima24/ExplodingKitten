# Data Validation Query Prompt

Generate read-only SQL validation queries for `<DATASET_OR-PIPELINE>`.

Inputs:
- Requirements and mappings: `<PATH_OR_CONTENT>`
- Schemas and keys: `<PATH_OR_CONTENT>`
- Transformation rules: `<PATH_OR_CONTENT>`
- Batch, watermark, or time parameters: `<VALUES>`
- Expected counts, totals, tolerances, and quality rules: `<PATH_OR_CONTENT>`
- SQL dialect and environment: `<DIALECT_AND_ENVIRONMENT>`

Cover the requested validations: row counts, source-to-target comparison, duplicates, nulls, referential integrity, aggregation reconciliation, transformations, incremental loads, facts, and dimensions.

Use `references/data-validation-query.template.md` and save under `working-artifacts/data-validation-query/` as `DVQ-<DATASET-OR-PIPELINE-ID>-<NAME>.md`.

Generate only read-only queries unless explicitly authorized otherwise. Use named parameters, document null/rounding/time-zone assumptions, define expected zero-row or nonzero-row behavior, and do not invent object names or thresholds.
