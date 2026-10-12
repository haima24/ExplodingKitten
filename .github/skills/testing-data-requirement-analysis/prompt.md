# Data Requirement Analysis Prompt

Analyze the data requirements for `<FEATURE_OR_PIPELINE>` before test design.

Inputs:
- Business requirements: `<PATH_OR_CONTENT>`
- Source-to-target mapping: `<PATH_OR_CONTENT>`
- Data dictionary: `<PATH_OR_CONTENT>`
- Transformation rules: `<PATH_OR_CONTENT>`
- Report requirements: `<PATH_OR_CONTENT>`
- Acceptance criteria, schemas, sample data, and data-quality constraints: `<PATH_OR_CONTENT_OR_NOT_AVAILABLE>`

Identify systems, entities, fields, ownership, mappings, transformations, validation rules, report behavior, gaps, risks, assumptions, dependencies, and open questions. Convert approved rules into testable data rules and Given/When/Then acceptance criteria. Define prioritized data-testing scope.

Use `references/data-requirement-analysis.template.md` and save the report under `working-artifacts/data-requirement-analysis/` as `DRA-<FEATURE-OR-REQUIREMENT-ID>-<NAME>.md`.

Do not invent mappings, formulas, defaults, ownership, expected values, or report behavior. Mark unresolved items `NEEDS CLARIFICATION` and do not generate detailed test cases in this artifact.
