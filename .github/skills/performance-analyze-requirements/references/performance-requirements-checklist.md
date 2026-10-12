# Performance Requirements Checklist

## Purpose

Validate that the Performance Requirements Document is complete and testable before handing off to test scenario design.

---

## Checklist

### Scope
- [ ] System under test is clearly named
- [ ] All in-scope endpoints are listed explicitly
- [ ] Out-of-scope items are declared

### Test Types
- [ ] At least one test type is identified (load, stress, soak, spike, capacity)
- [ ] Each test type has a stated purpose

### Load Profile
- [ ] Target VU (virtual user) count is defined
- [ ] Ramp-up period is defined
- [ ] Steady-state duration is defined
- [ ] Ramp-down period is defined (or explicitly waived)
- [ ] Total test duration is calculated

### SLA Thresholds
- [ ] p95 response time threshold defined for each in-scope endpoint (or globally)
- [ ] Error rate threshold defined
- [ ] Throughput target defined (RPS or TPS) where applicable

### Environment
- [ ] Target test environment is specified
- [ ] Environment specs are noted or linked
- [ ] Autoscaling behavior during test is stated

### Data
- [ ] Test data strategy is described (parameterized, seeded, anonymized prod data)
- [ ] Dynamic token / correlation requirements identified

### Assumptions and Risks
- [ ] All assumptions are documented
- [ ] All open questions are listed with owners
- [ ] Known risks are noted

### Completeness
- [ ] All template sections are populated
- [ ] No section is left blank without explanation

---

## Pass Criteria

All items marked ✓ before proceeding to `design-test-scenarios`.

Critical blockers (marked with *):
- SLA thresholds
- Load profile
- Scope
- Environment
