# Visual Report Testing Prompt

Generate test coverage for the dashboard or report `<REPORT_NAME>`.

Inputs:
- Report requirements and acceptance criteria: `<PATH_OR_CONTENT>`
- KPI definitions and formulas: `<PATH_OR_CONTENT>`
- Data model and source mappings: `<PATH_OR_CONTENT>`
- Filter, drill, sorting, grouping, and navigation rules: `<PATH_OR_CONTENT>`
- Roles and row-level security: `<PATH_OR_CONTENT>`
- Refresh, export, accessibility, viewport, and performance requirements: `<PATH_OR_CONTENT>`
- Design, screenshots, test users, and test data: `<PATH_OR_CONTENT>`

Generate dashboard scenarios, KPI validation cases, filter and interaction tests, SQL reconciliation requirements, and visual/accessibility checklists. Cover data correctness, permissions, freshness, empty/error states, exports, responsiveness, accessibility, and performance.

Use `references/visual-report-testing.template.md` and save under `working-artifacts/visual-report-testing/` as `VRT-<REPORT-OR-REQUIREMENT-ID>-<NAME>.md`.

Do not invent KPI formulas, role rules, thresholds, or layout expectations. Mark unresolved behavior `NEEDS CLARIFICATION` and route SQL generation to `testing-data-validation-query`.
