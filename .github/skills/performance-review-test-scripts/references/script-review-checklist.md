# Script Review Checklist

## Purpose

Validate that the review was thorough and the review report is complete.

---

## Checklist

### Review Coverage
- [ ] All submitted script files were reviewed
- [ ] Tool type identified for each script
- [ ] Tool-specific checklist applied

### Load Profile
- [ ] Stages / Thread Group compared against scenario load profile
- [ ] Any deviation flagged as Major finding

### Thresholds
- [ ] All threshold values cross-referenced with scenario SLAs
- [ ] Any mismatch flagged as Major finding
- [ ] Missing threshold block flagged as Critical finding

### Parameterization
- [ ] User data parameterization verified
- [ ] Hardcoded user credentials checked → Critical if found

### Correlation
- [ ] All dynamic tokens from scenario verified as extracted
- [ ] Token usage in downstream requests verified

### Assertions / Checks
- [ ] Every critical response has a check/assertion
- [ ] Missing assertions flagged as Major finding

### Security
- [ ] No hardcoded passwords or API keys → Critical if found
- [ ] Base URL uses environment variable / property

### Traceability
- [ ] Every script request maps to a scenario VU journey step
- [ ] Any extra or missing endpoints flagged

### Report Completeness
- [ ] Finding table populated for all findings
- [ ] Each finding has: ID, severity, location, description, recommendation
- [ ] Overall verdict issued per script
- [ ] Summary verdict issued

---

## Pass Criteria

All items checked before delivering review report.
