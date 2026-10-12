---
name: testing-visual-report-testing
description: 'Use when generating test coverage for dashboards, BI reports, scorecards, or visual analytics. Cover KPI calculations, database reconciliation, filters, drill interactions, visual consistency, time intelligence, role-based visibility, refresh freshness, empty and error states, exports, layout, accessibility, and report performance. Produce dashboard scenarios, KPI cases, interaction tests, SQL reconciliation requirements, and visual/accessibility checklists. Do not use for building reports, executing queries, or generic UI test automation.'
---

# Testing Visual Report Testing

## Purpose

Generate traceable, risk-based test coverage for dashboards and visual reports so that displayed measures, data, interactions, permissions, rendering, accessibility, freshness, exports, and performance are validated together.

## Context First

Read the approved report requirements, KPI definitions, measure formulas, data dictionary, source mappings, report model, filter and interaction design, role definitions, refresh schedule, export requirements, supported devices, accessibility target, and performance expectations. Confirm the report tool, environment, data refresh state, database access, test users, and expected visual states. Ask when a KPI formula, threshold, role rule, baseline, or layout expectation is missing; do not infer business behavior silently.

## Inputs

- Dashboard or report requirements and acceptance criteria
- KPI, measure, dimension, and aggregation definitions
- Source-to-report mappings, data model, and database objects
- Filter, slicer, drill-down, drill-through, sorting, and grouping rules
- Role and row-level security definitions
- Refresh schedule, freshness target, export formats, accessibility target, and performance thresholds
- Report design, screenshots, supported viewport list, and test data where available

## Coverage

Cover applicable areas:

- KPI and measure calculation, formatting, aggregation, and rounding
- Report-to-database reconciliation and SQL validation requirements
- Filters, slicers, defaults, dependencies, reset behavior, and filter propagation
- Drill-down, drill-through, navigation, context preservation, and back behavior
- Sorting, grouping, ranking, hierarchies, and category ordering
- Cross-visual consistency for shared filters, totals, labels, and time periods
- Date and time intelligence, time zones, fiscal periods, comparisons, and boundaries
- Role-based data visibility, row-level security, unauthorized access, and export security
- Refresh status, last-refresh display, freshness, stale data, and failed refresh states
- Empty, no-result, loading, partial-data, warning, and error states
- Exported data, file content, filters applied, formatting, row limits, and permissions
- Layout, responsive behavior, viewport changes, overflow, labels, legends, and tooltips
- Accessibility including keyboard navigation, focus, names, contrast, color independence, and screen-reader semantics
- Report performance, initial load, visual rendering, filter response, drill response, and export time

## Workflow

1. **Load the report context.** Input: requirements, report design, model, and operational rules. Action: identify pages, visuals, KPIs, dimensions, filters, roles, refreshes, exports, devices, and performance targets. Output: bounded report scope.
2. **Map displayed behavior.** Input: KPI definitions, mappings, and interaction rules. Action: map each visual and measure to source data, formulas, filters, expected states, and acceptance criteria. Output: report behavior map.
3. **Design coverage.** Input: behavior map and risk context. Action: create positive, negative, boundary, permission, freshness, export, accessibility, responsive, and performance scenarios; combine similar scenarios and remove duplicates. Output: prioritized dashboard test scenarios.
4. **Define reconciliation requirements.** Input: measure definitions and source mappings. Action: specify the SQL queries, joins, filters, aggregation grain, parameters, tolerances, and expected result needed to reconcile each critical KPI or visual. Output: SQL reconciliation requirements.
5. **Write validation cases.** Input: scenarios, reconciliation requirements, users, devices, and data. Action: document preconditions, steps, expected KPI values, interaction outcomes, visibility rules, visual states, accessibility outcomes, and performance thresholds. Output: detailed dashboard and KPI validation cases.
6. **Review coverage.** Input: complete test design. Action: verify every critical visual, KPI, interaction, role, refresh state, export, viewport, accessibility criterion, and performance threshold is traceable. Output: coverage findings and readiness status.

## Output Contract

Save the Markdown artifact under `working-artifacts/visual-report-testing/` using `VRT-<REPORT-OR-REQUIREMENT-ID>-<NAME>.md`.

The document must contain:

1. Report scope, pages, environment, tool, data state, roles, devices, and requirement references.
2. Assumptions, dependencies, exclusions, risks, and open questions.
3. Dashboard test scenarios with priority, risk, coverage area, and traceability.
4. KPI validation cases with formula, source, filter context, expected value, tolerance, and formatting expectation.
5. Filter and interaction tests for slicers, drill paths, sorting, grouping, cross-visual behavior, and navigation.
6. SQL reconciliation requirements with source/target objects, joins, parameters, grain, tolerance, expected result, and execution owner. Link to generated SQL artifacts when available.
7. Visual and accessibility checklist covering layout, responsive behavior, focus, labels, contrast, color independence, and error states.
8. Refresh, export, role-security, and performance checks with measurable expected results.
9. Coverage matrix and readiness status: `Ready for Review`, `Draft`, or `NEEDS CLARIFICATION`.

## Decision Rules

1. Ask for an approved KPI formula, aggregation grain, filter context, or tolerance before finalizing a KPI case.
2. Reconcile critical displayed measures to an approved database or query result; do not validate a report only by visual appearance.
3. Test filters independently and in combination when they affect totals, visual contents, permissions, or drill context.
4. Verify role-based visibility with authorized and unauthorized test users, including exported data where applicable.
5. Test date boundaries, time zones, fiscal periods, missing dates, and refresh cutoffs when time intelligence applies.
6. Treat a blank, zero, no-result, loading, warning, and error state as separate behaviors when the requirement distinguishes them.
7. Verify visual consistency across related charts, tables, cards, totals, labels, and shared filter context.
8. Use measurable thresholds for freshness, load time, interaction response, export time, and accessibility criteria when defined.
9. Do not claim a visual pass when data reconciliation, role security, accessibility, or required viewport coverage is unresolved.
10. Route SQL script generation to `testing-data-validation-query`, data-quality assessment to `testing-data-quality-validation`, ETL coverage to `testing-etl-test-design`, and generic UI automation to the relevant testing skill.

## Quality Gate

Coverage is ready for review when critical KPIs reconcile to approved data, filters and interactions are covered, roles and exports are validated, refresh and empty/error states are represented, responsive and accessibility checks are documented, performance thresholds are measurable, every case is traceable, and no critical clarification remains unresolved.

## Knowledge Sources

- Template: [`visual-report-testing.template.md`](references/visual-report-testing.template.md)
- Example: [`visual-report-testing.example.md`](references/visual-report-testing.example.md)
- Invocation prompt: [`prompt.md`](prompt.md)

## Related Skills

- `testing-data-validation-query`
- `testing-data-quality-validation`
- `testing-etl-test-design`
- `testing-design-test-case`
- `testing-implement-automation`
