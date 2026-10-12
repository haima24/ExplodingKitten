# Data Validation Queries: <Dataset or Pipeline>

## Query Metadata

| Item | Value |
| --- | --- |
| Dataset / pipeline | <Name> |
| Validation type | <Count / Mapping / Reconciliation / etc.> |
| Source | <Source objects> |
| Target | <Target objects> |
| SQL dialect | <Dialect and version> |
| Scope | <Batch, partition, or time window> |
| Owner | <Owner> |

## Parameters

| Parameter | Type | Example / Allowed Values | Required |
| --- | --- | --- | --- |
| `:batch_id` | <Type> | <Example> | Yes / No |
| `:from_timestamp` | <Type> | <Example> | Yes / No |

## Assumptions and Open Questions

- <Join, null, precision, time-zone, tolerance, or data-security assumption>

## Validation Query 1: <Purpose>

### Purpose and Logic

<What the query validates and how it determines a discrepancy.>

### SQL

```sql
-- Read-only validation query
<SQL using named parameters>
```

### Expected Result

- Pass condition: <Condition>
- Failure condition: <Condition>
- Returned rows mean: <Interpretation>
- Tolerance: <Tolerance or None>

### Execution Notes

- Required permissions: <Read permissions>
- Run after: <Pipeline step or prerequisite>
- Evidence to retain: <Output location>
- Performance considerations: <Indexes, partitions, or limits>

## Traceability

| Requirement / Mapping | Query | Expected Result |
| --- | --- | --- |
| <Requirement> | <Query name> | <Pass condition> |

## Quality Gate

- [ ] Queries are read-only and dialect is identified.
- [ ] Objects, joins, filters, and parameters are explicit.
- [ ] Null, precision, time-zone, and tolerance assumptions are documented.
- [ ] Expected zero-row or nonzero-row behavior is defined.
- [ ] Sensitive output is minimized or masked.
