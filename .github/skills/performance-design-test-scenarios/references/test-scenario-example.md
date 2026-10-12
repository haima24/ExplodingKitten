# Test Scenario Example

> Reference only. Do not copy verbatim into outputs.

---

# Test Scenarios

## Document Information

| Field | Value |
|---|---|
| System Under Test | E-Commerce Checkout API |
| PRD Reference | performance-requirements-document.md v1.0 |
| Author | Performance QA Team |
| Date | 2026-07-03 |
| Version | 1.0 |

---

## Scenario: Checkout Load Test

### Overview

| Field | Value |
|---|---|
| Scenario Name | Checkout Load Test |
| Test Type | Load |
| Objective | Validate the checkout flow meets SLAs at 500 concurrent users |
| PRD Requirement Reference | PRD Section 5 (Load Profile), Section 6 (SLA Thresholds) |

---

### Virtual User Journey

| Step | Method | Endpoint | Payload | Expected Status | Think Time After |
|---|---|---|---|---|---|
| 1 | POST | /auth/login | `{"username": "{{user}}", "password": "{{pass}}"}` | 200 | 1s |
| 2 | GET | /api/products | — | 200 | 2s |
| 3 | GET | /api/products/{{product_id}} | — | 200 | 1s |
| 4 | POST | /api/cart | `{"product_id": "{{product_id}}", "qty": 1}` | 201 | 1s |
| 5 | POST | /api/checkout | `{"cart_id": "{{cart_id}}", "payment": "mock"}` | 201 | 2s |

---

### Load Profile

| Phase | Duration | VU Count |
|---|---|---|
| Ramp-up | 5 minutes | 0 → 500 |
| Steady State | 15 minutes | 500 |
| Ramp-down | 2 minutes | 500 → 0 |
| **Total** | **22 minutes** | |

---

### Think Time Strategy

| Strategy | Value |
|---|---|
| Type | Uniform random |
| Range | min: 1000ms, max: 3000ms |

---

### Parameterization

| Field | Step Used | Data Source | Notes |
|---|---|---|---|
| username | Step 1 | CSV: test-users.csv | 10,000 unique records |
| password | Step 1 | CSV: test-users.csv | Corresponding to username |
| product_id | Step 3, 4 | Random pick from seeded product list | 100 product IDs |

---

### Correlation

| Token Name | Extracted From | Used In | Extraction Method |
|---|---|---|---|
| access_token | POST /auth/login response body | Authorization header — all subsequent steps | JSON Path: `$.access_token` |
| cart_id | POST /api/cart response body | POST /api/checkout payload | JSON Path: `$.cart_id` |

---

### Success Thresholds

| Metric | Condition | Source |
|---|---|---|
| p95 response time | < 500ms | PRD Section 6 |
| p99 response time | < 1000ms | PRD Section 6 |
| Error rate | < 1% | PRD Section 6 |
| Throughput | >= 300 RPS | PRD Section 6 |
| p95 POST /api/checkout | < 800ms | PRD Section 6 |

---

## Scenario: Checkout Stress Test

### Overview

| Field | Value |
|---|---|
| Scenario Name | Checkout Stress Test |
| Test Type | Stress |
| Objective | Find the breaking point of the checkout API |
| PRD Requirement Reference | PRD Section 3 (Test Types) |

---

### Virtual User Journey

(Same as Checkout Load Test steps 1–5)

---

### Load Profile

| Phase | Duration | VU Count |
|---|---|---|
| Ramp-up to baseline | 5 minutes | 0 → 500 |
| Step 1 | 5 minutes | 500 → 750 |
| Step 2 | 5 minutes | 750 → 1000 |
| Step 3 | 5 minutes | 1000 → 1250 |
| Continue until failure | 5 min each | +250 VUs |
| Ramp-down | 2 minutes | → 0 |

---

### Success Thresholds

| Metric | Condition | Notes |
|---|---|---|
| Error rate | Record the VU count at which error rate exceeds 5% | Breakpoint definition |
| p95 response time | Record the VU count at which p95 exceeds 2000ms | Degradation point |
