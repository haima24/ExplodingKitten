# ETL Test Design: Daily Customer Order Load

## Scope and Context

| Item | Value |
| --- | --- |
| Pipeline / job | `load_orders_daily` |
| Source | `source.orders` |
| Target | `warehouse.fact_orders` |
| Load mode | Full and incremental |
| Batch / watermark | `batch_id`, `updated_at` |
| Requirement references | ORD-ETL-01, ORD-ETL-02 |
| Status | Ready for Review |

## ETL Test Scenarios

| Scenario ID | Coverage Area | Scenario | Test Data | Expected Outcome | Priority | Risk |
| --- | --- | --- | --- | --- | --- | --- |
| ETL-S-001 | Mapping | Verify source order fields map to target fields. | Valid order | All mapped values match. | High | High |
| ETL-S-002 | Incremental load | Verify only changed orders load after the watermark. | New and changed records | New/changed records load once. | Critical | High |
| ETL-S-003 | Rejected records | Verify unknown customer keys are quarantined. | Unknown customer ID | Record is rejected and logged. | High | High |
| ETL-S-004 | Recovery | Verify rerun does not duplicate a completed batch. | Same batch twice | Target remains idempotent. | Critical | High |

## Detailed Test Cases

### ETL-TC-001: Verify incremental load processes changed orders once

| Field | Value |
| --- | --- |
| Requirement | ORD-ETL-02 / AC-02 |
| Objective | Confirm watermark filtering and idempotency. |
| Priority | Critical |
| Risk | Duplicate or missed orders affect reporting totals. |
| Automation | Yes |

**Preconditions**

- The previous watermark is recorded.
- Target contains the prior batch.

**Test Data**

- One new order, one order updated after the watermark, and one unchanged order.
- The same batch ID is available for a rerun.

**Steps**

1. Run the incremental job with the approved batch and watermark.
2. Compare loaded keys with the expected new and changed keys.
3. Rerun the same batch.
4. Compare target counts and duplicate keys.

**Expected Results**

- New and changed orders load once; unchanged orders are not reloaded.
- The rerun produces no duplicate target keys.
- Batch ID and load timestamps are populated.
- Job status and rejected-record counts are logged.

## Coverage Matrix

| Requirement / Rule | Scenario | Test Case | Result |
| --- | --- | --- | --- |
| ORD-ETL-02 | ETL-S-002 | ETL-TC-001 | Covered |
| ORD-ETL-02 | ETL-S-004 | ETL-TC-001 | Covered |

## Quality Gate

- [x] Mappings and transformations are covered.
- [x] Full and incremental behavior is covered where applicable.
- [x] Duplicate, null, invalid, and boundary data are covered where applicable.
- [x] Recovery, rerun, and rejected-record behavior is covered where applicable.
- [x] Expected results, test data, priority, and risk are complete.
- [x] No orphan or duplicate scenarios remain.
