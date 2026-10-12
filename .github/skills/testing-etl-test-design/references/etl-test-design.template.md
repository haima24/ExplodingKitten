# ETL Test Design: <Pipeline or Feature>

## Scope and Context

| Item | Value |
| --- | --- |
| Pipeline / job | <Name> |
| Source | <Source> |
| Target | <Target> |
| Load mode | Full / Incremental / Both |
| Batch / watermark | <Value> |
| Requirement references | <IDs> |
| Status | Draft / Ready for Review / NEEDS CLARIFICATION |

## Assumptions, Dependencies, and Risks

- <Assumption or risk>

## ETL Test Scenarios

| Scenario ID | Coverage Area | Scenario | Test Data | Expected Outcome | Priority | Risk |
| --- | --- | --- | --- | --- | --- | --- |
| ETL-S-001 | Mapping | <Scenario> | <Data> | <Outcome> | Critical / High / Medium / Low | <Risk> |

## Detailed Test Cases

### ETL-TC-001: Verify <ETL behavior>

| Field | Value |
| --- | --- |
| Requirement | <Requirement / AC> |
| Objective | <Objective> |
| Priority | <Priority> |
| Risk | <Risk> |
| Automation | Yes / No |

**Preconditions**

- <Setup>

**Test Data**

- <Source records, target baseline, controls, duplicates, nulls, or invalid values>

**Steps**

1. <Action>
2. <Action>
3. <Action>

**Expected Results**

- Source and target values: <Expected mapping or transformation>
- Counts / totals: <Expected reconciliation>
- Audit fields / timestamps: <Expected behavior>
- Errors / rejects / logs: <Expected behavior>

## Coverage Matrix

| Requirement / Rule | Scenario | Test Case | Result |
| --- | --- | --- | --- |
| <Requirement> | <ETL-S-ID> | <ETL-TC-ID> | Planned |

## Quality Gate

- [ ] Mappings and transformations are covered.
- [ ] Full and incremental behavior is covered where applicable.
- [ ] Duplicate, null, invalid, and boundary data are covered where applicable.
- [ ] Recovery, rerun, and rejected-record behavior is covered where applicable.
- [ ] Expected results, test data, priority, and risk are complete.
- [ ] No orphan or duplicate scenarios remain.
