# Performance Requirements Template

---

# Performance Requirements Document

## Document Information

| Field | Value |
|---|---|
| System Under Test | |
| Author | |
| Date | |
| Version | |
| Status | Draft / Reviewed / Approved |

---

## 1. System Overview

> Brief description of the system, its purpose, and the components in scope.

---

## 2. Test Objectives

> What this performance test campaign aims to validate.

---

## 3. Test Types Required

| Test Type | Purpose | Priority |
|---|---|---|
| Load Test | | |
| Stress Test | | |
| Soak Test | | |
| Spike Test | | |

---

## 4. Scope

### 4.1 In-Scope Endpoints

| Endpoint | Method | Description |
|---|---|---|
| | | |

### 4.2 Out of Scope

> List anything explicitly excluded.

---

## 5. Load Profile

| Phase | Duration | VU Count |
|---|---|---|
| Ramp-up | | |
| Steady State | | |
| Ramp-down | | |
| **Total** | | |

Additional parameters:

| Parameter | Value |
|---|---|
| Think Time | |
| Iteration Pacing | |
| Request Payload Size | |

---

## 6. SLA Thresholds

| Endpoint / Global | Metric | Threshold |
|---|---|---|
| Global | p95 response time | < ms |
| Global | p99 response time | < ms |
| Global | Error rate | < % |
| Global | Throughput | >= RPS |
| /specific/path | p95 response time | < ms |

---

## 7. Environment

| Field | Value |
|---|---|
| Environment Name | |
| Base URL | |
| Instance Count | |
| CPU / Memory | |
| Autoscaling | Enabled / Disabled |
| Monitoring Tools | |

---

## 8. Test Data

| Requirement | Details |
|---|---|
| Parameterization needed | Yes / No |
| Data source | CSV / Database seed / API |
| Dynamic tokens (correlation) | List tokens |
| Data volume | # unique records |

---

## 9. Assumptions

| # | Assumption | Owner | Status |
|---|---|---|---|
| 1 | | | Open / Validated |

---

## 10. Open Questions

| # | Question | Owner | Due Date |
|---|---|---|---|
| 1 | | | |

---

## 11. Risks

| Risk | Impact | Mitigation |
|---|---|---|
| | | |

---

## 12. Approval

| Role | Name | Signature | Date |
|---|---|---|---|
| Performance Engineer | | | |
| Stakeholder | | | |
