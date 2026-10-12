---
name: data-quality-validation-template
description: "Defines the Markdown structure for data-quality rule definitions and validation results. Use when documenting quality checks, thresholds, findings, summaries, and pass/fail assessments."
---

# Data-Quality Validation: <Dataset or Feature>

## Validation Metadata

| Item | Value |
| --- | --- |
| Dataset / report | <Name> |
| Source | <Source system or table> |
| Target | <Target system, table, or report> |
| Environment | <Environment> |
| Batch / time window | <Batch ID or time range> |
| Population | <Population or filter> |
| Execution date | <YYYY-MM-DD> |
| Owner | <Owner> |
| Status | <Draft / Ready for Review> |

## Scope and Assumptions

### In Scope

- <Quality dimension or population>

### Out of Scope

- <Excluded dimension or population>

### Assumptions and Dependencies

- <Assumption, dependency, or limitation>

## Quality Rules

| Rule ID | Dimension | Field / Population | Rule | Threshold | Severity | Evidence Method | Requirement |
| --- | --- | --- | --- | --- | --- | --- | --- |
| DQ-001 | <Completeness> | <Field or population> | <Measurable condition> | <Threshold> | <Critical/High/Medium/Low> | <Query, profile, or file> | <Requirement ID> |

## Check Results

| Check ID | Rule ID | Expected | Actual | Tolerance | Status | Evidence |
| --- | --- | --- | --- | --- | --- | --- |
| DQC-001 | DQ-001 | <Expected value> | <Actual value> | <Tolerance> | <PASS/FAIL/WARN/NOT RUN> | <Link or location> |

## Defect Findings

| Finding ID | Check ID | Affected Data | Impact | Severity | Suspected Cause | Recommended Action | Owner | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| DQF-001 | DQC-001 | <Records, fields, or batch> | <Business impact> | <Severity> | <Suspected cause> | <Action> | <Owner> | <Open/Accepted/Resolved> |

## Data-Quality Summary

| Dimension | Checks | Passed | Failed | Warnings | Summary |
| --- | ---: | ---: | ---: | ---: | --- |
| Completeness | <Count> | <Count> | <Count> | <Count> | <Summary> |

### Trends and Anomalies

- <Trend, anomaly, or outlier observation>

## Final Assessment

- **Decision:** `PASS` / `CONDITIONAL PASS` / `FAIL` / `NEEDS CLARIFICATION`
- **Rationale:** <Evidence-based decision rationale>
- **Release impact:** <Impact on release or downstream use>

## Traceability

| Requirement / Standard | Quality Rule | Check | Finding |
| --- | --- | --- | --- |
| <Requirement ID> | DQ-001 | DQC-001 | <DQF-001 or None> |

## Open Questions and Risks

- <Open question or outstanding data risk>

## Quality Gate

- [ ] Applicable quality dimensions are covered.
- [ ] Rules and thresholds are explicit and approved.
- [ ] Check results include evidence.
- [ ] Findings include affected data and business impact.
- [ ] The final assessment follows the approved quality policy.
