# Data Test Report: Daily Order Pipeline Release 1.2

## Report Metadata

| Item | Value |
| --- | --- |
| Scope | Daily order pipeline Release 1.2 |
| Reporting period | 2026-09-18 |
| Environment / build | Test / build-412 |
| Selected run | RUN-20260918-01 |
| Report owner | Data QA |
| Status | Final |

## Test Execution Summary

| Area | Total | Passed | Failed | Blocked | Not Run | Evidence |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| ETL | 8 | 7 | 1 | 0 | 0 | `evidence/etl-run-01.log` |
| SQL validation | 5 | 4 | 1 | 0 | 0 | `evidence/sql-results/` |
| Dashboard | 6 | 5 | 0 | 1 | 0 | `evidence/dashboard/` |

## Data-Quality Report

| Dimension | Checks | Passed | Failed | Warnings | Summary |
| --- | ---: | ---: | ---: | ---: | --- |
| Completeness | 2 | 2 | 0 | 0 | Required identifiers present. |
| Uniqueness | 1 | 0 | 1 | 0 | Duplicate order group found. |
| Reconciliation | 2 | 2 | 0 | 0 | Counts and totals reconcile. |

## Defect Summary

| Defect ID | Area | Severity | Impact | Status | Evidence | Owner |
| --- | --- | --- | --- | --- | --- | --- |
| DQF-001 | ETL uniqueness | High | Duplicate orders may overstate totals. | Open | `evidence/duplicates.csv` | ETL team |
| DB-014 | SQL validation | Medium | One timestamp differs by 3 seconds. | Accepted | `evidence/timestamp-diff.csv` | Data team |

## Failed-Record and Discrepancy Evidence

| Evidence ID | Source / Target | Batch | Record Count | Error / Difference | Handling Status | Evidence |
| --- | --- | --- | ---: | --- | --- | --- |
| FR-001 | `source.orders` / `fact_orders` | RUN-20260918-01 | 2 | Duplicate `order_id` groups | Open | `evidence/duplicates.csv` |

## Requirement-to-Test Traceability

| Requirement | Acceptance Criteria | Test Case / Check | Result | Evidence |
| --- | --- | --- | --- | --- |
| ORD-01 | AC-01 count reconciliation | SQL-COUNT-01 | PASS | `evidence/sql-results/count.txt` |
| ORD-02 | AC-02 duplicate prevention | DQ-UNIQ-01 | FAIL | `evidence/duplicates.csv` |
| ORD-03 | AC-03 dashboard total | KPI-01 | PASS | `evidence/dashboard/kpi-01.png` |

## Coverage and Status

- Requirements covered: 3 / 3
- Test cases executed: 19 / 19
- Uncovered requirements: None
- Orphan test cases: None
- Result scope: selected-run

## Release Recommendation

- **Decision:** `Conditional Release`
- **Rationale:** Critical count and amount reconciliations passed, but the high-severity duplicate finding remains open.
- **Conditions or blockers:** Obtain data-owner acceptance or remediate DQF-001 before financial reporting refresh.
- **Approver:** Product owner and data owner

## Outstanding Data Risks

- Duplicate retry behavior may recur in the next incremental load.
- Dashboard refresh should remain blocked until the duplicate finding is resolved or formally accepted.

## Quality Gate

- [x] Source artifacts were inspected.
- [x] Run scope and denominators are explicit.
- [x] Totals reconcile without double-counting.
- [x] Failures, risks, and evidence are visible.
- [x] Release recommendation is evidence-supported.
