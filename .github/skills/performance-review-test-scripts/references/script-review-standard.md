# Script Review Standard

## Purpose

Defines how test script reviews shall be conducted, findings classified, and verdicts issued.

---

## Review Scope

Every script review must cover:

1. **Structural correctness** — Script follows tool standard
2. **Load profile accuracy** — Stages/Thread Group matches scenario
3. **Threshold accuracy** — Thresholds match SLA from PRD
4. **Parameterization** — User data is parameterized, not hardcoded
5. **Correlation** — Dynamic tokens are extracted and used correctly
6. **Assertions** — All critical responses are validated
7. **Security** — No hardcoded secrets

---

## Finding Severity Classification

| Severity | Definition | Execution Impact |
|---|---|---|
| Critical | Security risk or will cause test to produce invalid results | Block execution |
| Major | Missing validation, wrong load profile, or threshold mismatch | Block execution |
| Minor | Style, naming, or optimization issue | Recommend fix, do not block |

### Critical Examples
- Hardcoded password or API key in script
- Missing `thresholds` block entirely
- Wrong base URL that would hit production instead of staging

### Major Examples
- Load profile stages do not match scenario (wrong VU count or duration)
- Threshold value does not match PRD SLA
- Missing `check()` assertions on critical responses (K6)
- Missing Response Assertion on checkout sampler (JMeter)
- Dynamic token not extracted (correlation missing)

### Minor Examples
- Non-descriptive request/sampler name
- Sleep value outside recommended range
- Missing code comment explaining a non-obvious step

---

## Traceability Verification

For each script:
1. Map each threshold back to the scenario SLA
2. Map each request back to the VU journey step
3. Flag any endpoint in script not in scenario scope
4. Flag any scenario endpoint missing from script

---

## Verdict Criteria

| Verdict | Condition |
|---|---|
| PASS | Zero Critical findings, zero Major findings |
| PASS WITH RECOMMENDATIONS | Zero Critical, zero Major, Minor findings present |
| FAIL | One or more Critical or Major findings |

---

## Review Report Requirements

Every review report must include:
- Script filename
- Tool type (K6 / JMeter)
- Findings table (ID, location, severity, description, recommendation)
- Traceability summary
- Overall verdict
