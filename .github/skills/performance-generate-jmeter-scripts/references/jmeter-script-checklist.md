# JMeter Script Checklist

## Purpose

Validate that every generated JMeter test plan is complete, correct, and production-ready.

---

## Checklist (apply per JMX file)

### Test Plan Structure
- [ ] Test Plan contains exactly one Thread Group per scenario
- [ ] HTTP Request Defaults configured (base URL, protocol)
- [ ] HTTP Cookie Manager present
- [ ] HTTP Header Manager present with Content-Type

### Thread Group
- [ ] Number of threads matches scenario peak VU count (using property, not hardcoded)
- [ ] Ramp-up period matches scenario load profile
- [ ] Scheduler or loop count matches steady-state duration
- [ ] Ramp-down achieved (Shutdown hook or Ultimate Thread Group for stress)

### Parameterization
- [ ] CSV Data Set Config present when user data varies
- [ ] CSV filename is relative path (`./data/users.csv`)
- [ ] Variable names match usage in samplers (`${username}`, `${password}`)
- [ ] Recycle on EOF set to True

### Samplers
- [ ] All endpoints from VU journey are implemented as HTTP Samplers
- [ ] HTTP method matches scenario (GET/POST/PUT/DELETE)
- [ ] Request body uses parameterized variables (not hardcoded values)
- [ ] Samplers are named descriptively

### Correlation
- [ ] JSON Extractor or Regex Extractor present for every dynamic token
- [ ] Extractor is child of the sampler that returns the token
- [ ] Extracted variable name matches usage in subsequent samplers
- [ ] Default value set to detect extraction failure (e.g., `TOKEN_NOT_FOUND`)

### Assertions
- [ ] Response Assertion present on every critical sampler
- [ ] Status code validated
- [ ] Critical response body fields validated where required

### Think Time
- [ ] Gaussian Random Timer or Constant Timer present between samplers
- [ ] Minimum delay >= 500ms for realistic load tests

### Listeners
- [ ] View Results Tree is DISABLED (not removed) for CI runs
- [ ] Backend Listener configured for metrics export (InfluxDB or Prometheus)
- [ ] Summary Report or Aggregate Report available for post-run review

### Security
- [ ] No hardcoded credentials, passwords, or tokens in JMX
- [ ] Base URL uses JMeter property (`${__P(base_url,...)}`)

### Completeness
- [ ] One JMX per scenario (no mixed test types in single file)
- [ ] `user.properties` includes all required property defaults

---

## Pass Criteria

All items checked before delivering test plans to review.
