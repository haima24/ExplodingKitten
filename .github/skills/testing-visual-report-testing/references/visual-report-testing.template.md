# Visual Report Testing: <Report Name>

## Report Context

| Item | Value |
| --- | --- |
| Report / dashboard | <Name> |
| Tool / version | <Tool> |
| Environment | <Environment> |
| Data refresh / batch | <Refresh state> |
| Roles | <Roles> |
| Viewports / devices | <Devices> |
| Status | Draft / Ready for Review / NEEDS CLARIFICATION |

## Assumptions, Dependencies, and Risks

- <Assumption, dependency, or risk>

## Dashboard Test Scenarios

| Scenario ID | Coverage Area | Scenario | Preconditions / Data | Expected Result | Priority | Risk |
| --- | --- | --- | --- | --- | --- | --- |
| VRT-S-001 | KPI / Filter / Accessibility | <Scenario> | <Setup> | <Outcome> | Critical / High / Medium / Low | <Risk> |

## KPI Validation Cases

| KPI ID | KPI / Visual | Formula / Source | Filter Context | Expected Value | Tolerance | Result |
| --- | --- | --- | --- | --- | --- | --- |
| KPI-001 | <KPI> | <Formula and source> | <Context> | <Value> | <Tolerance> | Planned |

## Filter and Interaction Tests

| Test ID | Interaction | Steps | Expected Context / Result | Priority |
| --- | --- | --- | --- | --- |
| INT-001 | <Filter, drill, sort, or group> | <Steps> | <Expected result> | <Priority> |

## SQL Reconciliation Requirements

| Requirement ID | Visual / KPI | Source and Target | Join / Filter / Grain | Query Link | Expected Result |
| --- | --- | --- | --- | --- | --- |
| SQL-001 | <KPI> | <Objects> | <Logic> | <Link or TBD> | <Condition> |

## Visual and Accessibility Checklist

- [ ] Layout and visual hierarchy are correct.
- [ ] Labels, legends, tooltips, and numbers are readable.
- [ ] Responsive behavior works at supported viewports.
- [ ] Keyboard navigation and visible focus work.
- [ ] Accessible names and semantic structure are present.
- [ ] Contrast and color-independent meaning meet the target.
- [ ] Empty, loading, warning, and error states are clear.
- [ ] Exported data respects filters, formatting, and permissions.

## Refresh, Security, and Performance

| Area | Expected Result / Threshold | Evidence | Status |
| --- | --- | --- | --- |
| Refresh freshness | <Threshold> | <Evidence> | Planned |
| Role visibility | <Expected data scope> | <Evidence> | Planned |
| Initial load | <Threshold> | <Evidence> | Planned |
| Filter / drill response | <Threshold> | <Evidence> | Planned |
| Export time | <Threshold> | <Evidence> | Planned |

## Coverage Matrix

| Requirement / AC | Scenario / Case | SQL Requirement | Result |
| --- | --- | --- | --- |
| <Requirement> | <VRT-S or KPI ID> | <SQL-ID> | Planned |

## Quality Gate

- [ ] Critical KPIs reconcile to approved data.
- [ ] Filters, drills, sorting, grouping, and cross-visual behavior are covered.
- [ ] Roles, exports, refresh, and empty/error states are covered.
- [ ] Responsive and accessibility checks are documented.
- [ ] Performance thresholds are measurable.
- [ ] All cases are traceable and no critical clarification remains.
