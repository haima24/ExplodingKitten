# Visual Report Testing: Order Performance Dashboard

## Report Context

| Item | Value |
| --- | --- |
| Report / dashboard | Order Performance Dashboard |
| Tool / version | Power BI |
| Environment | Test |
| Data refresh / batch | 2026-09-18 daily refresh |
| Roles | Operations Manager, Regional Analyst |
| Viewports / devices | Desktop 1440px, tablet 768px |
| Status | Ready for Review |

## Dashboard Test Scenarios

| Scenario ID | Coverage Area | Scenario | Preconditions / Data | Expected Result | Priority | Risk |
| --- | --- | --- | --- | --- | --- | --- |
| VRT-S-001 | KPI | Verify total orders matches the approved source total. | Refreshed order batch | KPI equals SQL reconciliation result. | Critical | High |
| VRT-S-002 | Filter / Drill | Verify region filter updates all visuals and drill-through context. | Two regions with data | All related visuals show the selected region. | High | High |
| VRT-S-003 | Security / Export | Verify regional analyst cannot view another region or export it. | Regional test user | Unauthorized rows are hidden in visuals and export. | Critical | High |
| VRT-S-004 | Accessibility | Verify dashboard is usable with keyboard and readable at tablet width. | Keyboard and tablet viewport | Focus, labels, contrast, and layout meet the target. | High | Medium |

## KPI Validation Cases

| KPI ID | KPI / Visual | Formula / Source | Filter Context | Expected Value | Tolerance | Result |
| --- | --- | --- | --- | --- | --- | --- |
| KPI-001 | Total Orders | Count of distinct `order_id` from `fact_orders` | Date = 2026-09-18 | 10,000 | 0 | Planned |
| KPI-002 | Revenue | Sum of `order_amount` | Region = North | 125,430.50 | 0.01 | Planned |

## Filter and Interaction Tests

| Test ID | Interaction | Steps | Expected Context / Result | Priority |
| --- | --- | --- | --- | --- |
| INT-001 | Region slicer | Select North, then clear the slicer. | All visuals update, then restore full totals. | High |
| INT-002 | Drill-through | Select a region and open order detail. | Detail page preserves the selected region filter. | High |

## SQL Reconciliation Requirements

| Requirement ID | Visual / KPI | Source and Target | Join / Filter / Grain | Query Link | Expected Result |
| --- | --- | --- | --- | --- | --- |
| SQL-001 | KPI-001 | `source.orders` / `fact_orders` | Same batch, count distinct order ID | `working-artifacts/data-validation-query/DVQ-ORD-COUNT.md` | Difference = 0 |
| SQL-002 | KPI-002 | `fact_orders` | Region and date filters, sum amount | `working-artifacts/data-validation-query/DVQ-ORD-REVENUE.md` | Difference <= 0.01 |

## Visual and Accessibility Checklist

- [x] Layout and visual hierarchy are correct.
- [x] Labels, legends, tooltips, and numbers are readable.
- [x] Responsive behavior works at supported viewports.
- [x] Keyboard navigation and visible focus work.
- [x] Accessible names and semantic structure are present.
- [x] Contrast and color-independent meaning meet the target.
- [x] Empty, loading, warning, and error states are clear.
- [x] Exported data respects filters, formatting, and permissions.

## Refresh, Security, and Performance

| Area | Expected Result / Threshold | Evidence | Status |
| --- | --- | --- | --- |
| Refresh freshness | Data available within 2 hours | `evidence/refresh.png` | PASS |
| Role visibility | Regional analyst sees assigned region only | `evidence/role-export.xlsx` | PASS |
| Initial load | <= 5 seconds | `evidence/performance.txt` | PASS |
| Filter / drill response | <= 3 seconds | `evidence/interaction.txt` | PASS |
| Export time | <= 10 seconds | `evidence/export.txt` | PASS |

## Coverage Matrix

| Requirement / AC | Scenario / Case | SQL Requirement | Result |
| --- | --- | --- | --- |
| DASH-01 | KPI-001 | SQL-001 | Planned |
| DASH-02 | INT-001 | None | Planned |
| DASH-03 | VRT-S-003 | None | Planned |
| DASH-04 | VRT-S-004 | None | Planned |

## Quality Gate

- [x] Critical KPIs reconcile to approved data.
- [x] Filters, drills, sorting, grouping, and cross-visual behavior are covered.
- [x] Roles, exports, refresh, and empty/error states are covered.
- [x] Responsive and accessibility checks are documented.
- [x] Performance thresholds are measurable.
- [x] All cases are traceable and no critical clarification remains.
