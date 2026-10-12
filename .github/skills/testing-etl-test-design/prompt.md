# ETL Test Design Prompt

Generate ETL/ELT test scenarios and detailed test cases for `<PIPELINE_OR_FEATURE>`.

Inputs:
- Requirements and acceptance criteria: `<PATH_OR_CONTENT>`
- Source-to-target mapping and dictionary: `<PATH_OR_CONTENT>`
- Transformation, join, and lookup rules: `<PATH_OR_CONTENT>`
- Load modes, schedules, and recovery rules: `<PATH_OR_CONTENT>`
- Sample data and target baseline: `<PATH_OR_CONTENT>`

Cover mapping, extract validation, transformations, joins/lookups, full and incremental loads, duplicate/null handling, reprocessing, SCD behavior, audit fields, timestamps, rejected records, and recovery. Define required test data, expected source/target results, priority, and risk.

Use `references/etl-test-design.template.md` and save under `working-artifacts/etl-test-design/` as `ETL-TC-<FEATURE-OR-PIPELINE>-<NAME>.md`.

Do not invent formulas, keys, SCD rules, or recovery behavior. Mark unresolved rules `NEEDS CLARIFICATION`.
