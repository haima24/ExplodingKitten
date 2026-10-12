# Data Requirement Analysis: Daily Customer Order Load

## Metadata

| Item | Value |
| --- | --- |
| Requirement / feature | ORD-ETL-01 Daily customer order load |
| Analyst | Data QA |
| Status | NEEDS CLARIFICATION |
| Date | 2026-09-19 |

## Source Artifact Inventory

| Artifact | Location | Version / Date | Available | Notes |
| --- | --- | --- | --- | --- |
| Business requirements | `docs/requirements/orders.md` | 1.2 | Yes | Approved |
| Source-to-target mapping | `docs/mappings/orders.xlsx` | 1.0 | Yes | Missing cancel-date mapping |
| Data dictionary | `docs/data/orders-dictionary.md` | 1.1 | Yes | UTC timestamps |
| Transformation rules | `docs/rules/order-transformations.md` | 1.0 | Yes | Amount conversion defined |
| Report requirements | `docs/reports/order-summary.md` | 1.0 | Yes | Daily totals required |

## Data Scope

| System / Entity | Role | Owner | Key Fields | Interfaces / Reports |
| --- | --- | --- | --- | --- |
| `source.orders` | Source | Order team | `order_id` | Daily pipeline |
| `warehouse.fact_orders` | Target | Data platform | `order_key`, `order_id` | Order summary report |
| `warehouse.dim_customer` | Reference | CRM team | `customer_key` | Customer filters |

## Mapping and Transformation Rules

| Rule ID | Source | Target | Rule / Transformation | Null / Default | Error Behavior | Requirement |
| --- | --- | --- | --- | --- | --- | --- |
| DR-001 | `amount` | `order_amount` | Convert source currency to reporting currency | Reject missing rate | Reject record | ORD-ETL-01 |
| DR-002 | `customer_id` | `customer_key` | Lookup active customer dimension key | Reject unmatched customer | Quarantine | ORD-ETL-01 |

## Requirement Gaps

| Gap ID | Area | Gap or Ambiguity | Impact | Severity | Owner | Question / Resolution |
| --- | --- | --- | --- | --- | --- | --- |
| GAP-001 | Mapping | Cancel date has no target mapping | Cancellation reporting cannot be validated | High | Data model owner | Should it map to `cancelled_at`? |

## Testable Data Rules

| Rule ID | Input Condition | Expected Output | Boundary / Negative Case | Evidence | Priority |
| --- | --- | --- | --- | --- | --- |
| TDR-001 | Valid amount and exchange rate | Target amount equals converted amount | Missing exchange rate is rejected | Target row and reject log | High |
| TDR-002 | Known customer ID | Active customer key is assigned | Unknown customer is quarantined | Target lookup and reject log | High |

## Acceptance Criteria

### AC-001: Convert order amount

- **Given** an order has a valid amount and exchange rate
- **When** the daily load processes the order
- **Then** the target amount equals the approved converted amount within the defined precision

## Data-Testing Scope

- [x] Integration / pipeline
- [x] Data quality
- [x] Report / reconciliation
- [x] Regression
- [ ] Migration

## Risks, Assumptions, and Open Questions

- Cancel-date mapping remains unresolved.
- Currency precision is assumed to be two decimal places.

## Traceability Matrix

| Requirement | Data Rule | Acceptance Criterion | Test Scope |
| --- | --- | --- | --- |
| ORD-ETL-01 | TDR-001 | AC-001 | Integration, quality, reconciliation |
