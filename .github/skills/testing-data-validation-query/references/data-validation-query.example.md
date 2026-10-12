# Data Validation Queries: Daily Customer Orders

## Query Metadata

| Item | Value |
| --- | --- |
| Dataset / pipeline | Daily order load |
| Validation type | Source-to-target count and amount reconciliation |
| Source | `source.orders` |
| Target | `warehouse.fact_orders` |
| SQL dialect | PostgreSQL |
| Scope | `:batch_id` |
| Owner | Data QA |

## Parameters

| Parameter | Type | Example / Allowed Values | Required |
| --- | --- | --- | --- |
| `:batch_id` | UUID | `b-20260918-01` | Yes |

## Validation Query 1: Count and amount reconciliation

### Purpose and Logic

Compare source and target record counts and order amounts for the same batch.

### SQL

```sql
WITH source_totals AS (
    SELECT COUNT(*) AS row_count, COALESCE(SUM(order_amount), 0) AS total_amount
    FROM source.orders
    WHERE batch_id = :batch_id
), target_totals AS (
    SELECT COUNT(*) AS row_count, COALESCE(SUM(order_amount), 0) AS total_amount
    FROM warehouse.fact_orders
    WHERE batch_id = :batch_id
)
SELECT
    s.row_count AS source_count,
    t.row_count AS target_count,
    s.row_count - t.row_count AS count_difference,
    s.total_amount AS source_amount,
    t.total_amount AS target_amount,
    s.total_amount - t.total_amount AS amount_difference
FROM source_totals s
CROSS JOIN target_totals t;
```

### Expected Result

- Pass condition: `count_difference = 0` and `ABS(amount_difference) <= 0.01`.
- Failure condition: either condition is false.
- Returned row means: one aggregate comparison for the requested batch.
- Tolerance: `0.01` for currency amounts.

### Execution Notes

- Required permissions: Read access to both tables.
- Run after: The target batch completes.
- Evidence to retain: Query output and batch ID.
- Performance considerations: Restrict both tables using the batch partition or index.

## Traceability

| Requirement / Mapping | Query | Expected Result |
| --- | --- | --- |
| ORD-ETL-03 | Count and amount reconciliation | Zero count difference and amount difference within tolerance |

## Quality Gate

- [x] Query is read-only and dialect is identified.
- [x] Objects, joins, filters, and parameters are explicit.
- [x] Null, precision, time-zone, and tolerance assumptions are documented.
- [x] Expected result behavior is defined.
- [x] Sensitive output is minimized or masked.
