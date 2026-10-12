# Script Review Example

> Reference only. Do not copy verbatim into outputs.

---

# Script Review Report

## Document Information

| Field | Value |
|---|---|
| System Under Test | E-Commerce Checkout API |
| Reviewer | Performance QA Team |
| Review Date | 2026-07-05 |
| Scripts Reviewed | load-test.js, stress-test.js |
| Test Scenarios Reference | test-scenarios.md v1.0 |

---

## Summary

| Script | Tool | Findings (C/M/m) | Verdict |
|---|---|---|---|
| load-test.js | K6 | C: 0, M: 1, m: 1 | FAIL |
| stress-test.js | K6 | C: 0, M: 0, m: 2 | PASS WITH RECOMMENDATIONS |

**Overall Verdict:** FAIL — load-test.js must be corrected before execution.

---

## Script: load-test.js

### Tool: K6

### Findings

| ID | Severity | Location | Description | Recommendation |
|---|---|---|---|---|
| R-001 | Major | options.thresholds | `checkout_duration` threshold is set to `p(95)<1000` but scenario SLA requires `p(95)<800ms` | Update threshold to `p(95)<800` |
| R-002 | Minor | Line 45 | Sampler for `GET /api/products` is not tagged | Add `tags: { name: 'GetProducts' }` for per-endpoint metrics |

### Traceability

| Scenario Step | Implemented in Script | Notes |
|---|---|---|
| POST /auth/login | ✓ | JWT extraction present |
| GET /api/products | ✓ | No tag applied (R-002) |
| GET /api/products/{id} | ✓ | |
| POST /api/cart | ✓ | cart_id extraction present |
| POST /api/checkout | ✓ | Custom metric recorded |

### Verdict: FAIL

---

## Script: stress-test.js

### Tool: K6

### Findings

| ID | Severity | Location | Description | Recommendation |
|---|---|---|---|---|
| R-003 | Minor | stages array | Ramp-down step missing after final stage | Add `{ duration: '2m', target: 0 }` at end of stages |
| R-004 | Minor | Line 12 | Sleep fixed at 1 second — no randomization | Use `sleep(Math.random() * 2 + 1)` |

### Traceability

All scenario steps implemented. ✓

### Verdict: PASS WITH RECOMMENDATIONS

---

## Required Changes Before Execution

| Finding ID | Script | Change Required |
|---|---|---|
| R-001 | load-test.js | Update `checkout_duration` threshold to `p(95)<800` |

---

## Recommendations (Minor Findings)

| Finding ID | Script | Recommendation |
|---|---|---|
| R-002 | load-test.js | Add tags to GetProducts request |
| R-003 | stress-test.js | Add ramp-down stage |
| R-004 | stress-test.js | Randomize sleep values |
