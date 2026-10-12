# Data Requirement Analysis: <Feature or Pipeline>

## Metadata

| Item | Value |
| --- | --- |
| Requirement / feature | <ID and name> |
| Analyst | <Name> |
| Status | Draft / Ready for Test Design / NEEDS CLARIFICATION |
| Date | <YYYY-MM-DD> |

## Source Artifact Inventory

| Artifact | Location | Version / Date | Available | Notes |
| --- | --- | --- | --- | --- |
| Business requirements | <Path> | <Version> | Yes / No | <Notes> |
| Source-to-target mapping | <Path> | <Version> | Yes / No | <Notes> |
| Data dictionary | <Path> | <Version> | Yes / No | <Notes> |
| Transformation rules | <Path> | <Version> | Yes / No | <Notes> |
| Report requirements | <Path> | <Version> | Yes / No | <Notes> |

## Data Scope

| System / Entity | Role | Owner | Key Fields | Interfaces / Reports |
| --- | --- | --- | --- | --- |
| <System or entity> | Source / Target / Reference | <Owner> | <Keys> | <Dependencies> |

## Mapping and Transformation Rules

| Rule ID | Source | Target | Rule / Transformation | Null / Default | Error Behavior | Requirement |
| --- | --- | --- | --- | --- | --- | --- |
| DR-001 | <Field> | <Field> | <Rule> | <Behavior> | <Behavior> | <ID> |

## Requirement Gaps

| Gap ID | Area | Gap or Ambiguity | Impact | Severity | Owner | Question / Resolution |
| --- | --- | --- | --- | --- | --- | --- |
| GAP-001 | Mapping / Rule / Report / Data | <Gap> | <Impact> | Critical / High / Medium / Low | <Owner> | <Question> |

## Testable Data Rules

| Rule ID | Input Condition | Expected Output | Boundary / Negative Case | Evidence | Priority |
| --- | --- | --- | --- | --- | --- |
| TDR-001 | <Input> | <Expected result> | <Boundary or invalid input> | <Evidence> | High |

## Acceptance Criteria

### AC-001: <Title>

- **Given** <precondition>
- **When** <action or data event>
- **Then** <observable data result>

## Data-Testing Scope

- [ ] Unit / transformation
- [ ] Integration / pipeline
- [ ] API or interface
- [ ] Data quality
- [ ] Migration
- [ ] Report / reconciliation
- [ ] Security
- [ ] Performance
- [ ] Regression

## Risks, Assumptions, and Open Questions

- <Risk or assumption>
- <Open question>

## Traceability Matrix

| Requirement | Data Rule | Acceptance Criterion | Test Scope |
| --- | --- | --- | --- |
| <ID> | <TDR-ID> | <AC-ID> | <Scope> |
