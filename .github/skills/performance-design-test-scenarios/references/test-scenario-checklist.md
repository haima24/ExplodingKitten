# Test Scenario Checklist

## Purpose

Validate that each test scenario is complete and scripting-ready.

---

## Checklist (apply per scenario)

### Identification
- [ ] Scenario has a unique name
- [ ] Test type is stated (load / stress / soak / spike / capacity)
- [ ] Scenario objective is described

### VU Journey
- [ ] All steps are listed in execution order
- [ ] Each step includes: method, endpoint, expected response code
- [ ] Think time is specified between steps
- [ ] Dynamic tokens (correlations) are identified

### Load Profile
- [ ] Start VU count defined (0)
- [ ] Target / peak VU count defined
- [ ] Ramp-up duration defined
- [ ] Steady-state duration defined
- [ ] Ramp-down defined (or explicitly waived)
- [ ] Total duration calculated

### Data
- [ ] Parameterized fields listed
- [ ] Data source for each parameterized field identified
- [ ] Correlation flow documented (if tokens required)

### Thresholds
- [ ] At least one threshold defined per scenario
- [ ] All thresholds traceable to PRD SLAs
- [ ] Threshold format is measurable (e.g., `p95 < 500ms`, `error_rate < 1%`)

### Traceability
- [ ] Scenario references source PRD requirement(s)

---

## Pass Criteria

All items checked before handing off to script generation.
