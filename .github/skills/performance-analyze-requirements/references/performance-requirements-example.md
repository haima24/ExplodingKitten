# Performance Requirements Example

> Reference only. Do not copy verbatim into outputs.

---

# Performance Requirements Document

## Document Information

| Field | Value |
|---|---|
| System Under Test | E-Commerce Checkout API |
| Author | Performance QA Team |
| Date | 2026-07-01 |
| Version | 1.0 |
| Status | Approved |

---

## 1. System Overview

The E-Commerce Checkout API handles product browsing, cart management, and order placement for a B2C retail platform. Expected peak traffic is during flash sale events. The system runs on 3 auto-scaled EC2 instances behind an ALB.

---

## 2. Test Objectives

- Validate the system meets SLAs under expected peak load of 500 concurrent users
- Identify the system's breaking point under stress
- Verify stability over a 2-hour soak test

---

## 3. Test Types Required

| Test Type | Purpose | Priority |
|---|---|---|
| Load Test | Validate SLAs at 500 VUs | High |
| Stress Test | Find breaking point beyond 500 VUs | Medium |
| Soak Test | Detect memory leaks over 2 hours | Medium |

---

## 4. Scope

### 4.1 In-Scope Endpoints

| Endpoint | Method | Description |
|---|---|---|
| /api/products | GET | Product listing page |
| /api/products/{id} | GET | Product detail page |
| /api/cart | POST | Add item to cart |
| /api/checkout | POST | Place order |

### 4.2 Out of Scope

- Payment gateway (third-party, mocked)
- Admin dashboard
- Reporting service

---

## 5. Load Profile

| Phase | Duration | VU Count |
|---|---|---|
| Ramp-up | 5 minutes | 0 → 500 |
| Steady State | 15 minutes | 500 |
| Ramp-down | 2 minutes | 500 → 0 |
| **Total** | **22 minutes** | |

| Parameter | Value |
|---|---|
| Think Time | 1–3 seconds (randomized) |
| Iteration Pacing | None |
| Request Payload Size | ~2KB per checkout payload |

---

## 6. SLA Thresholds

| Endpoint / Global | Metric | Threshold |
|---|---|---|
| Global | p95 response time | < 500ms |
| Global | p99 response time | < 1000ms |
| Global | Error rate | < 1% |
| Global | Throughput | >= 300 RPS |
| POST /api/checkout | p95 response time | < 800ms |

---

## 7. Environment

| Field | Value |
|---|---|
| Environment Name | Staging |
| Base URL | https://staging-api.example.com |
| Instance Count | 3 (fixed — autoscaling disabled during test) |
| CPU / Memory | 4 vCPU / 8 GB RAM each |
| Autoscaling | Disabled |
| Monitoring Tools | Datadog APM, CloudWatch |

---

## 8. Test Data

| Requirement | Details |
|---|---|
| Parameterization needed | Yes |
| Data source | CSV (10,000 unique user credentials) |
| Dynamic tokens (correlation) | JWT access_token from POST /auth/login |
| Data volume | 10,000 unique user records |

---

## 9. Assumptions

| # | Assumption | Owner | Status |
|---|---|---|---|
| 1 | Payment gateway will be mocked at the staging level | DevOps | Validated |
| 2 | Database is pre-seeded with 100,000 products | QA | Validated |

---

## 10. Open Questions

| # | Question | Owner | Due Date |
|---|---|---|---|
| 1 | Should the search endpoint be included in scope? | PM | 2026-07-05 |

---

## 11. Risks

| Risk | Impact | Mitigation |
|---|---|---|
| Staging environment under-spec vs. production | False pass results | Note specs delta in report |

---

## 12. Approval

| Role | Name | Signature | Date |
|---|---|---|---|
| Performance Engineer | Jane Smith | ✓ | 2026-07-01 |
| Stakeholder | John Doe | ✓ | 2026-07-02 |
