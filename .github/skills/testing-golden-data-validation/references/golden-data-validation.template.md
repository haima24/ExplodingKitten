# Golden Data Validation: <Dataset or Pipeline>

## Golden Baseline Manifest

| Item | Value |
| --- | --- |
| Golden dataset | <Name> |
| Version | <Version> |
| Checksum / immutable ID | <Checksum or ID> |
| Owner / approver | <Names or roles> |
| Scope | <Batch, period, population> |
| Schema version | <Version> |
| Status | Approved / Draft / NEEDS CLARIFICATION |

## Actual Output Context

| Item | Value |
| --- | --- |
| Output layer | ETL / Warehouse / Semantic Model / BI Report |
| Environment | <Environment> |
| Batch / period | <Value> |
| Refresh timestamp | <Timestamp> |
| Role / filter context | <Context> |
| SQL dialect | <Dialect> |

## Validation Rules

| Rule ID | Area | Key / Grain | Compared Fields or KPI | Method | Tolerance | Exclusions | Expected Result |
| --- | --- | --- | --- | --- | --- | --- | --- |
| GDV-001 | Row / Aggregate / KPI | <Key or grain> | <Fields or metric> | <Comparison method> | <Tolerance> | <Approved exclusions> | <Expected result> |

## Expected Results

| Result ID | Rule ID | Expected Value | Actual Value | Difference | Status | Evidence |
| --- | --- | ---: | ---: | ---: | --- | --- |
| EXP-001 | GDV-001 | <Value> | <Value> | <Difference> | PASS / FAIL / NOT RUN | <Evidence> |

## Validation SQL

### Query: <Purpose>

**Purpose:** <What the query validates.>

**Parameters:** `<parameter definitions>`

```sql
-- Read-only query
<SQL>
```

**Expected result:** <Zero rows, matching counts, tolerated difference, or expected discrepancy.>

**Execution notes:** <Permissions, order, performance, and evidence location.>

## Reconciliation Report

| Metric | Golden | Actual | Difference | Tolerance | Status |
| --- | ---: | ---: | ---: | ---: | --- |
| Row count | <Value> | <Value> | <Value> | <Value> | PASS / FAIL |
| Total amount | <Value> | <Value> | <Value> | <Value> | PASS / FAIL |
| Missing keys | 0 | <Value> | <Value> | 0 | PASS / FAIL |
| Extra keys | 0 | <Value> | <Value> | 0 | PASS / FAIL |
| Changed rows | 0 | <Value> | <Value> | <Value> | PASS / FAIL |

## KPI Comparison Report

| KPI | Golden Value | Actual Value | Difference | Tolerance | Context | Status |
| --- | ---: | ---: | ---: | --- | --- | --- |
| <KPI> | <Value> | <Value> | <Value> | <Tolerance> | <Filters / role / period> | PASS / FAIL |

## Findings, Risks, and Intentional Differences

| Finding ID | Area | Difference | Impact | Severity | Intentional? | Action / Owner |
| --- | --- | --- | --- | --- | --- | --- |
| GDV-F-001 | <Area> | <Difference> | <Impact> | <Severity> | Yes / No | <Action> |

## Final Assessment

- **Decision:** `PASS` / `CONDITIONAL PASS` / `FAIL` / `NEEDS CLARIFICATION`
- **Rationale:** <Evidence-based rationale>
- **Release impact:** <Impact>

## Quality Gate

- [ ] Golden dataset is approved, versioned, and checksum-verified.
- [ ] Keys, scope, fields, tolerances, and exclusions are explicit.
- [ ] Row-level and aggregate reconciliation is complete.
- [ ] Semantic-model and KPI context matches the golden baseline.
- [ ] SQL is read-only and evidence is retained.
- [ ] Findings, risks, and final assessment are traceable.
