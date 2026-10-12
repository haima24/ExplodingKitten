---
name: testing-data-test-reporting
description: 'Use when consolidating ETL execution results, data-quality findings, SQL validation results, dashboard defects, failed-record evidence, coverage, and status into a traceable data-testing report. Produce an execution report, data-quality report, defect summary, traceability matrix, release recommendation, and outstanding data risks. Do not use for designing tests, executing pipelines or queries, debugging defects, or generic portfolio status-only reporting; route those requests to the appropriate testing skill.'
---

# Testing Data Test Reporting

## Purpose

Consolidate evidence from data and visual-report testing into a single traceable report that explains coverage, results, defects, release risk, and remaining data-quality exposure.

## Context First

Read the supplied requirements, acceptance criteria, test scenarios and cases, ETL or ELT execution results, data-quality checks, SQL validation outputs, dashboard findings, failed-record evidence, test environments, batch metadata, and prior reports. Confirm the selected run or reporting period, result vocabulary, severity policy, release criteria, and evidence locations. Ask when source artifacts or run scope are missing; never infer a pass from absent evidence.

## Inputs

- Requirements, acceptance criteria, mappings, and traceability references
- ETL or ELT execution results, logs, batch metadata, and rejected records
- Data-quality rules, check results, thresholds, and findings
- SQL validation scripts, outputs, parameters, and reconciliation results
- Dashboard and visual-report test results, defects, screenshots, and exports
- Test scenarios, test cases, automation results, manual results, and evidence
- Release criteria, known risks, waivers, environment, build, and reporting period

## Coverage

Consolidate applicable evidence for:

- Requirement-to-test and acceptance-criteria traceability
- ETL execution status, load counts, rejected records, retries, and recovery
- Data-quality findings, thresholds, trends, and unresolved anomalies
- SQL validation results, reconciliation differences, and query evidence
- Dashboard defects, KPI mismatches, filter or security failures, and visual issues
- Failed-record evidence, affected populations, error messages, and remediation status
- Coverage, pass/fail/blocked/not-run status, execution scope, and result completeness

## Workflow

1. **Inventory evidence.** Input: supplied artifact paths or report sources. Action: classify requirements, cases, scripts, runs, ETL results, quality checks, SQL outputs, dashboard evidence, defects, and prior reports; record missing or unreadable sources. Output: evidence inventory.
2. **Normalize results.** Input: evidence inventory. Action: normalize requirement IDs, case IDs, run IDs, source and target objects, batch or time window, status, timestamps, environment, evidence links, and failure details. Output: consistent result records.
3. **Build traceability.** Input: normalized records and requirements. Action: link requirements and acceptance criteria to scenarios, cases, executions, quality checks, SQL validations, dashboard findings, and defects; identify uncovered and orphan artifacts. Output: traceability matrix.
4. **Reconcile summaries.** Input: linked result records. Action: calculate distinct requirements and cases, executed and unexecuted counts, pass/fail/blocked/not-run totals, ETL load and reject totals, quality-check outcomes, SQL discrepancies, dashboard defects, and evidence completeness without double-counting. Output: reconciled coverage and status summary.
5. **Assess risk and release.** Input: summaries, defects, thresholds, and release criteria. Action: classify severity and business impact, identify data risks and blockers, evaluate waivers and compensating controls, and recommend `Ready for Release`, `Conditional Release`, `Not Ready`, or `NEEDS CLARIFICATION`. Output: evidence-based release recommendation.
6. **Generate the report.** Input: reconciled summaries and risk assessment. Action: populate the report contract, link detailed evidence instead of duplicating it, expose limitations and assumptions, and apply the quality gate. Output: final report or marked `Draft`.

## Output Contract

Save the Markdown artifact under `working-artifacts/testing/data-test-reports/` using `DTR-<RELEASE-OR-PIPELINE-ID>-<NAME>.md`.

The report must contain:

1. Report metadata: scope, reporting period, environment, build, selected run, owners, and source inventory.
2. Test execution report covering scope, counts, statuses, timing, ETL results, rejected records, SQL results, dashboard results, and evidence links.
3. Data-quality report covering rules, thresholds, failed checks, anomalies, affected populations, trends, and limitations.
4. Defect summary with ID, area, severity, priority, impact, status, evidence, owner, and remediation or waiver.
5. Requirement-to-test traceability matrix covering requirements, acceptance criteria, cases, execution results, and uncovered items.
6. Failed-record and discrepancy evidence summary with source, target, batch, query, record count, sample evidence, and handling status.
7. Coverage and status summaries with explicit denominators and no double-counting.
8. Release recommendation with decision, rationale, blockers, conditions, and approvers.
9. Outstanding data risks, assumptions, open questions, dependencies, and follow-up actions.
10. Quality gate and report status: `Final`, `Draft`, or `NEEDS CLARIFICATION`.

## Decision Rules

1. Treat `PASS`, `FAIL`, `BLOCKED`, `NOT RUN`, `SKIPPED`, and `NOT AVAILABLE` as distinct statuses; never convert missing, skipped, or planned evidence into a pass.
2. Count distinct requirements and test cases once, even when they have multiple executions or manual and automated results.
3. Show the selected run or reporting period explicitly; label totals as `latest-run`, `selected-run`, or `all-runs` when multiple runs exist.
4. Preserve links to raw ETL logs, SQL outputs, dashboard evidence, failed records, and defect reports; do not fabricate evidence.
5. Report both aggregate impact and representative record-level evidence for data failures when permitted by data-security rules.
6. Classify unresolved critical data-quality failures, unreconciled totals, unauthorized visibility, missing execution evidence, and material rejected records as release risks or blockers according to the release policy.
7. Distinguish observed results from planned, inferred, or unavailable results and document all assumptions.
8. Do not diagnose root causes in the report; link suspected or confirmed investigation to `testing-analyze-bug`.
9. Route generic execution-status rollups to `testing-task-status`, ETL scenario design to `testing-etl-test-design`, data-quality evaluation to `testing-data-quality-validation`, SQL generation to `testing-data-validation-query`, and visual-report coverage to `testing-visual-report-testing`.

## Quality Gate

The report is ready for release review only when source artifacts are inspected, run scope is explicit, totals reconcile, traceability is complete or gaps are visible, ETL, quality, SQL, dashboard, and failed-record evidence are represented where applicable, defect severity and data impact are assessed, release risks and conditions are documented, and the recommendation is supported by observed evidence.

## Knowledge Sources

- Template: [`data-test-reporting.template.md`](references/data-test-reporting.template.md)
- Example: [`data-test-reporting.example.md`](references/data-test-reporting.example.md)
- Invocation prompt: [`prompt.md`](prompt.md)

## Related Skills

- `testing-task-status`
- `testing-data-requirement-analysis`
- `testing-etl-test-design`
- `testing-data-quality-validation`
- `testing-data-validation-query`
- `testing-visual-report-testing`
- `testing-analyze-bug`
