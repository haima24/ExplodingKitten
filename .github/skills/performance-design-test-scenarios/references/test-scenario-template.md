# Test Scenario Template

---

# Test Scenarios

## Document Information

| Field | Value |
|---|---|
| System Under Test | |
| PRD Reference | |
| Author | |
| Date | |
| Version | |

---

## Scenario: [Scenario Name]

### Overview

| Field | Value |
|---|---|
| Scenario Name | |
| Test Type | Load / Stress / Soak / Spike / Capacity |
| Objective | |
| PRD Requirement Reference | |

---

### Virtual User Journey

| Step | Method | Endpoint | Payload | Expected Status | Think Time After |
|---|---|---|---|---|---|
| 1 | | | | | |
| 2 | | | | | |
| 3 | | | | | |

---

### Load Profile

| Phase | Duration | VU Count |
|---|---|---|
| Ramp-up | | 0 → |
| Steady State | | |
| Ramp-down | | → 0 |
| **Total** | | |

---

### Think Time Strategy

| Strategy | Value |
|---|---|
| Type | Uniform random / Gaussian |
| Range | min: ms, max: ms |

---

### Parameterization

| Field | Step Used | Data Source | Notes |
|---|---|---|---|
| | | | |

---

### Correlation

| Token Name | Extracted From | Used In | Extraction Method |
|---|---|---|---|
| | | | Regex / JSON Path |

---

### Success Thresholds

| Metric | Condition | Source (PRD section) |
|---|---|---|
| p95 response time | < ms | |
| p99 response time | < ms | |
| Error rate | < % | |
| Throughput | >= RPS | |

---

<!-- Repeat above section for each additional scenario -->
