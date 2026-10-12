# Data Test Report: <Release or Pipeline>

## Report Metadata

| Item | Value |
| --- | --- |
| Scope | <Release, pipeline, or feature> |
| Reporting period | <Period> |
| Environment / build | <Environment and build> |
| Selected run | <Run ID or all runs> |
| Report owner | <Owner> |
| Status | Final / Draft / NEEDS CLARIFICATION |

## Source Inventory

| Artifact Type | Location | Available | Notes |
| --- | --- | --- | --- |
| Requirements | <Path> | Yes / No | <Notes> |
| Execution results | <Path> | Yes / No | <Notes> |
| Data-quality findings | <Path> | Yes / No | <Notes> |
| SQL results | <Path> | Yes / No | <Notes> |
| Dashboard evidence | <Path> | Yes / No | <Notes> |

## Test Execution Summary

| Area | Total | Passed | Failed | Blocked | Not Run | Evidence |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| ETL | <Count> | <Count> | <Count> | <Count> | <Count> | <Link> |
| SQL validation | <Count> | <Count> | <Count> | <Count> | <Count> | <Link> |
| Dashboard | <Count> | <Count> | <Count> | <Count> | <Count> | <Link> |

## Data-Quality Report

| Dimension | Checks | Passed | Failed | Warnings | Summary |
| --- | ---: | ---: | ---: | ---: | --- |
| <Dimension> | <Count> | <Count> | <Count> | <Count> | <Summary> |

## Defect Summary

| Defect ID | Area | Severity | Impact | Status | Evidence | Owner |
| --- | --- | --- | --- | --- | --- | --- |
| <ID> | <Area> | Critical / High / Medium / Low | <Impact> | Open / Resolved / Accepted | <Link> | <Owner> |

## Failed-Record and Discrepancy Evidence

| Evidence ID | Source / Target | Batch | Record Count | Error / Difference | Handling Status | Evidence |
| --- | --- | --- | ---: | --- | --- | --- |
| <ID> | <Objects> | <Batch> | <Count> | <Description> | <Status> | <Link> |

## Requirement-to-Test Traceability

| Requirement | Acceptance Criteria | Test Case / Check | Result | Evidence |
| --- | --- | --- | --- | --- |
| <Requirement> | <AC> | <Case or check> | <Status> | <Link> |

## Coverage and Status

- Requirements covered: <tested> / <total>
- Test cases executed: <executed> / <total>
- Uncovered requirements: <List or None>
- Orphan test cases: <List or None>
- Result scope: latest-run / selected-run / all-runs

## Release Recommendation

- **Decision:** `Ready for Release` / `Conditional Release` / `Not Ready` / `NEEDS CLARIFICATION`
- **Rationale:** <Evidence-based rationale>
- **Conditions or blockers:** <Conditions>
- **Approver:** <Name or role>

## Outstanding Data Risks

- <Risk, assumption, dependency, or follow-up action>

## Quality Gate

- [ ] Source artifacts were inspected.
- [ ] Run scope and denominators are explicit.
- [ ] Totals reconcile without double-counting.
- [ ] Failures, risks, and evidence are visible.
- [ ] Release recommendation is evidence-supported.
