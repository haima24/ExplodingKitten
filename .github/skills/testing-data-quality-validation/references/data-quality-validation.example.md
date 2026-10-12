# Data-Quality Validation: Customer Orders

## Validation Metadata

| Item | Value |
| --- | --- |
| Dataset / report | Customer orders daily load |
| Source | `source.orders` |
| Target | `warehouse.fact_orders` |
| Environment | Test |
| Batch / time window | `2026-09-18` |
| Population | Orders created on `2026-09-18` |
| Execution date | `2026-09-19` |
| Owner | Data QA |
| Status | Ready for Review |

## Scope and Assumptions

### In Scope

- Required order identifiers and measures
- Duplicate order detection
- Source-to-target count and amount reconciliation
- Referential integrity for customer and product keys
- Freshness of the daily load

### Assumptions and Dependencies

- The approved tolerance for total order amount is `0.01`.
- Source and target timestamps are compared in UTC.
- Cancelled orders remain in the target with a cancelled status.

## Quality Rules

| Rule ID | Dimension | Field / Population | Rule | Threshold | Severity | Evidence Method | Requirement |
| --- | --- | --- | --- | --- | --- | --- | --- |
| DQ-001 | Completeness | `order_id` | Every loaded order has an order ID. | 0 nulls | Critical | Null-count query | ORD-DATA-01 |
| DQ-002 | Uniqueness | `order_id` | No order ID occurs more than once in the target grain. | 0 duplicates | High | Duplicate-group query | ORD-DATA-02 |
| DQ-003 | Reconciliation | Daily order population | Source and target row counts match. | Difference = 0 | Critical | Count comparison | ORD-DATA-03 |
| DQ-004 | Reconciliation | `order_amount` | Source and target order amounts reconcile. | Absolute difference <= 0.01 | High | Aggregate comparison | ORD-DATA-04 |
| DQ-005 | Integrity | `customer_key` | Every target customer key exists in the customer dimension. | 0 orphan keys | High | Orphan-key query | ORD-DATA-05 |
| DQ-006 | Timeliness | Daily batch | The target batch is available within two hours of source close. | <= 2 hours | Medium | Batch timestamp check | ORD-DATA-06 |

## Check Results

| Check ID | Rule ID | Expected | Actual | Tolerance | Status | Evidence |
| --- | --- | --- | --- | --- | --- | --- |
| DQC-001 | DQ-001 | 0 null order IDs | 0 | 0 | PASS | `evidence/orders-null-check.sql` |
| DQC-002 | DQ-002 | 0 duplicate order IDs | 2 duplicate groups | 0 | FAIL | `evidence/orders-duplicate-check.sql` |
| DQC-003 | DQ-003 | Source count = target count | 10,000 = 10,000 | 0 | PASS | `evidence/orders-count-check.sql` |
| DQC-004 | DQ-004 | Difference <= 0.01 | 0.00 | 0.01 | PASS | `evidence/orders-amount-check.sql` |
| DQC-005 | DQ-005 | 0 orphan customer keys | 0 | 0 | PASS | `evidence/orders-customer-integrity.sql` |
| DQC-006 | DQ-006 | Load completed within 2 hours | 1 hour 32 minutes | 2 hours | PASS | `evidence/orders-freshness-check.sql` |

## Defect Findings

| Finding ID | Check ID | Affected Data | Impact | Severity | Suspected Cause | Recommended Action | Owner | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| DQF-001 | DQC-002 | 2 duplicate order groups | Order totals may be overstated in downstream reports. | High | Duplicate retry records were loaded without idempotency control. | Remove duplicate target rows after approval and add a batch-level uniqueness control. | ETL team | Open |

## Data-Quality Summary

| Dimension | Checks | Passed | Failed | Warnings | Summary |
| --- | ---: | ---: | ---: | ---: | --- |
| Completeness | 1 | 1 | 0 | 0 | Required IDs are complete. |
| Uniqueness | 1 | 0 | 1 | 0 | Duplicate order groups require remediation. |
| Reconciliation | 2 | 2 | 0 | 0 | Counts and amounts reconcile. |
| Integrity | 1 | 1 | 0 | 0 | No orphan customer keys found. |
| Timeliness | 1 | 1 | 0 | 0 | Batch met the freshness target. |

## Final Assessment

- **Decision:** `CONDITIONAL PASS`
- **Rationale:** All critical completeness, reconciliation, integrity, and timeliness checks passed, but duplicate order groups remain unresolved.
- **Release impact:** Release requires data-owner acceptance or duplicate remediation before downstream financial reporting.

## Traceability

| Requirement / Standard | Quality Rule | Check | Finding |
| --- | --- | --- | --- |
| ORD-DATA-01 | DQ-001 | DQC-001 | None |
| ORD-DATA-02 | DQ-002 | DQC-002 | DQF-001 |
| ORD-DATA-03 | DQ-003 | DQC-003 | None |
| ORD-DATA-04 | DQ-004 | DQC-004 | None |
| ORD-DATA-05 | DQ-005 | DQC-005 | None |
| ORD-DATA-06 | DQ-006 | DQC-006 | None |

## Open Questions and Risks

- Confirm whether duplicate retry records are permitted for any order source.
- Verify that the downstream reporting refresh is held until DQF-001 is resolved or accepted.

## Quality Gate

- [x] Applicable quality dimensions are covered.
- [x] Rules and thresholds are explicit and approved.
- [x] Check results include evidence.
- [x] Findings include affected data and business impact.
- [x] The final assessment follows the approved quality policy.
