# K6 Script Checklist

## Purpose

Validate that every generated K6 script is complete, correct, and production-ready.

---

## Checklist (apply per script file)

### Structure
- [ ] Script follows the required structure (imports → options → setup → default → teardown)
- [ ] Only K6 built-in modules are imported (no Node.js modules)

### Options
- [ ] `stages` array defined and matches scenario load profile (ramp-up, steady state, ramp-down)
- [ ] `thresholds` object defined
- [ ] All thresholds traceable to scenario SLAs

### Requests
- [ ] All endpoints from the VU journey are implemented
- [ ] All requests include appropriate headers
- [ ] `Content-Type` set for POST/PUT/PATCH requests
- [ ] Authorization header set from extracted token (not hardcoded)
- [ ] Requests are tagged for per-endpoint metrics where required

### Assertions
- [ ] Every response has a `check()` assertion
- [ ] Status code is checked for every request
- [ ] Critical response body fields are validated

### Parameterization
- [ ] `SharedArray` used for CSV data (not inline arrays for large data)
- [ ] VU-to-user-record mapping is correct (`__VU % users.length`)

### Correlation
- [ ] Dynamic tokens extracted using JSON Path
- [ ] Extracted tokens validated with `check()` before use
- [ ] Tokens passed correctly to downstream requests

### Think Time
- [ ] `sleep()` used between steps
- [ ] Sleep values are randomized

### Security
- [ ] No hardcoded credentials, tokens, or API keys
- [ ] Base URL sourced from `__ENV`
- [ ] No PII in script source

### Custom Metrics
- [ ] Custom `Trend` metrics defined for endpoints with specific SLAs
- [ ] Custom metrics added to `thresholds`

### Completeness
- [ ] One script per scenario (no mixing of test types)
- [ ] Helper files generated and imported correctly

---

## Pass Criteria

All items checked before delivering scripts to review.
