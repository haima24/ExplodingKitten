# Golden Data Validation Prompt

Validate `<DATASET_OR_PIPELINE>` against the approved golden dataset.

Inputs:
- Golden dataset manifest, version, checksum, and approval: `<PATH_OR_CONTENT>`
- Golden dataset / expected results: `<PATH_OR_CONTENT>`
- Actual ETL or warehouse output: `<PATH_OR_CONTENT>`
- Semantic model and BI report definitions/results: `<PATH_OR_CONTENT_OR_NOT_APPLICABLE>`
- Source-to-target mappings and transformation rules: `<PATH_OR_CONTENT>`
- Business keys and comparison fields: `<PATH_OR_CONTENT>`
- Tolerances and intentional exclusions: `<PATH_OR_CONTENT_OR_VALUE>`
- Environment, batch, period, role, refresh, time zone, and SQL dialect: `<VALUES>`

Generate golden dataset validation rules, expected results, read-only SQL validation, row-level and aggregate reconciliation, KPI comparison, findings, and a PASS/FAIL summary.

Use `references/golden-data-validation.template.md` and save the report under `working-artifacts/golden-data-validation/` as `GDV-<DATASET-OR-PIPELINE-ID>-<NAME>.md`.

Do not invent a baseline, expected values, keys, tolerances, or exclusions. Do not modify source data. Mark missing or mismatched golden metadata as `NEEDS CLARIFICATION`.
