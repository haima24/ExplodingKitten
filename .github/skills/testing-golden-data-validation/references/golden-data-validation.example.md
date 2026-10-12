# Golden Data Validation: Daily Order Reporting

## Golden Baseline Manifest

| Item | Value |
| --- | --- |
| Golden dataset | Customer order reporting baseline |
| Version | `2026.09.18.v1` |
| Checksum / immutable ID | `sha256:abc123...` |
| Owner / approver | Data QA / Product Owner |
| Scope | Orders for 2026-09-18, all regions |
| Schema version | `orders-v3` |
| Status | Approved |

## Actual Output Context

| Item | Value |
| --- | --- |
| Output layer | Warehouse and BI report |
| Environment | Test |
| Batch / period | `ORD-20260918-01` / 2026-09-18 |
| Refresh timestamp | 2026-09-19T06:00:00Z |
| Role / filter context | Operations Manager, all regions |
| SQL dialect | PostgreSQL |

## Validation Rules

| Rule ID | Area | Key / Grain | Compared Fields or KPI | Method | Tolerance | Exclusions | Expected Result |
| --- | --- | --- | --- | --- | --- | --- | --- |
| GDV-001 | Row | `order_id` | Order status and amount | Keyed comparison | Amount <= 0.01 | `load_timestamp` | No unexplained differences |
| GDV-002 | Aggregate | Daily | Row count and revenue | Aggregate reconciliation | Revenue <= 0.01 | None | Counts and revenue match |
| GDV-003 | KPI | Daily, all regions | Total Orders KPI | Semantic/report comparison | 0 | None | KPI equals golden value |

## Expected Results

| Result ID | Rule ID | Expected Value | Actual Value | Difference | Status | Evidence |
| --- | --- | ---: | ---: | ---: | --- | --- |
| EXP-001 | GDV-001 | 10,000 matching rows | 9,998 matching rows | 2 changed rows | FAIL | `evidence/order-diff.csv` |
| EXP-002 | GDV-002 | 10,000 rows / 125,430.50 | 10,000 / 125,430.50 | 0.00 | PASS | `evidence/reconciliation.txt` |
| EXP-003 | GDV-003 | 10,000 | 10,000 | 0 | PASS | `evidence/kpi-total-orders.png` |

## Validation SQL

### Query: Find warehouse rows that differ from the golden table

**Purpose:** Identify missing, extra, or changed order records by business key.

**Parameters:** `:batch_id`, `:golden_version`

```sql
WITH differences AS (
    SELECT
        COALESCE(g.order_id, a.order_id) AS order_id,
        g.order_amount AS golden_amount,
        a.order_amount AS actual_amount,
        g.order_status AS golden_status,
        a.order_status AS actual_status
    FROM golden.orders g
    FULL OUTER JOIN warehouse.fact_orders a
        ON a.order_id = g.order_id
       AND a.batch_id = :batch_id
    WHERE g.golden_version = :golden_version
      AND (g.order_id IS NULL
        OR a.order_id IS NULL
        OR ABS(COALESCE(g.order_amount, 0) - COALESCE(a.order_amount, 0)) > 0.01
        OR g.order_status IS DISTINCT FROM a.order_status)
)
SELECT * FROM differences ORDER BY order_id;
```

**Expected result:** Zero rows after approved differences are excluded.

**Execution notes:** Run with read-only access after the warehouse batch and BI refresh complete. Retain the output as evidence and do not expose unnecessary customer fields.

## Reconciliation Report

| Metric | Golden | Actual | Difference | Tolerance | Status |
| --- | ---: | ---: | ---: | ---: | --- |
| Row count | 10,000 | 10,000 | 0 | 0 | PASS |
| Total amount | 125,430.50 | 125,430.50 | 0.00 | 0.01 | PASS |
| Missing keys | 0 | 0 | 0 | 0 | PASS |
| Extra keys | 0 | 0 | 0 | 0 | PASS |
| Changed rows | 0 | 2 | 2 | 0 | FAIL |

## KPI Comparison Report

| KPI | Golden Value | Actual Value | Difference | Tolerance | Context | Status |
| --- | ---: | ---: | ---: | --- | --- | --- |
| Total Orders | 10,000 | 10,000 | 0 | 0 | All regions, 2026-09-18 | PASS |
| Revenue | 125,430.50 | 125,430.50 | 0.00 | 0.01 | All regions, 2026-09-18 | PASS |

## Findings, Risks, and Intentional Differences

| Finding ID | Area | Difference | Impact | Severity | Intentional? | Action / Owner |
| --- | --- | --- | --- | --- | --- | --- |
| GDV-F-001 | Row comparison | 2 order statuses differ from golden data | Detail reporting may be inconsistent with approved baseline. | High | No | Investigate transformation and rerun validation / ETL owner |

## Final Assessment

- **Decision:** `FAIL`
- **Rationale:** Aggregate and KPI values match, but two unexplained row-level status differences violate the golden row comparison rule.
- **Release impact:** Hold release until the differences are corrected or formally approved as an intentional baseline change.

## Quality Gate

- [x] Golden dataset is approved, versioned, and checksum-verified.
- [x] Keys, scope, fields, tolerances, and exclusions are explicit.
- [x] Row-level and aggregate reconciliation is complete.
- [x] Semantic-model and KPI context matches the golden baseline.
- [x] SQL is read-only and evidence is retained.
- [x] Findings, risks, and final assessment are traceable.
