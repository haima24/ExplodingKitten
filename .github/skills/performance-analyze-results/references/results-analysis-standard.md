# Results Analysis Standard

## Purpose

Defines how performance test results shall be analyzed, interpreted, and reported.

---

## Metrics to Report

For every test scenario, report:

| Metric | Required |
|---|---|
| p50 (median) response time | Yes |
| p90 response time | Yes |
| p95 response time | Yes (primary SLA metric) |
| p99 response time | Yes |
| Max response time | Yes |
| Average response time | Yes |
| Error rate (%) | Yes |
| Total requests | Yes |
| Throughput (RPS) | Yes |
| Test duration | Yes |
| Peak VU count reached | Yes |

---

## Threshold Comparison

Every SLA threshold from the PRD must be compared:

| Format |
|---|
| Metric \| Threshold \| Actual \| Status (PASS/FAIL) |

Example:
| Metric | Threshold | Actual | Status |
|---|---|---|---|
| p95 response time | < 500ms | 423ms | PASS |
| Error rate | < 1% | 0.3% | PASS |
| p95 POST /checkout | < 800ms | 912ms | **FAIL** |

---

## Error Analysis

Even when error rate is within threshold, analyze:
- Error type distribution (HTTP status codes: 4xx, 5xx, timeouts)
- Which endpoints produced errors
- Correlation with load profile phase (errors during ramp-up vs. steady state)
- Error messages (if available from logs)

---

## Bottleneck Identification

Use response time trends and error patterns to identify:

| Pattern | Likely Bottleneck |
|---|---|
| Gradual response time increase under constant load | Thread pool exhaustion, DB connection saturation |
| Sudden error spike at specific VU threshold | Memory limits, connection limits |
| Slow specific endpoint only | Query optimization needed, caching gap |
| Memory increase over soak test duration | Memory leak |
| High p99 but acceptable p95 | Outlier requests, GC pauses, cold starts |

---

## Trend Analysis (when previous results available)

Compare:
- p95 response time: improved / degraded / stable
- Error rate: improved / degraded / stable
- Throughput: improved / degraded / stable
- Breaking point (stress test): higher / lower / same

Flag any regression > 10% as a concern.

---

## Verdict Criteria

| Verdict | Condition |
|---|---|
| PASS | All SLA thresholds met for all scenarios |
| PASS WITH CONCERNS | All thresholds met but warnings identified (p99 spike, gradual degradation) |
| FAIL | One or more SLA thresholds breached |
| INCONCLUSIVE | Test aborted, data incomplete, or environment issue invalidated results |

---

## Recommendations Format

For every FAIL finding:
- State what failed (metric + endpoint)
- State the gap (actual vs threshold)
- Suggest investigation areas
- Suggest remediation actions

Example:
> **p95 POST /api/checkout = 912ms (SLA: <800ms)**
> Gap: +112ms over threshold.
> Investigation: Analyze DB query execution time for order creation. Review connection pool size.
> Remediation: Add DB index on `orders.user_id`, increase connection pool from 10 to 25.

---

## Anti-Patterns

✗ Declaring PASS when thresholds are not met
✗ Reporting only average response time (hides tail latency issues)
✗ No error analysis in report
✗ No recommendations for FAIL findings
✗ Comparing results from different environments without noting the difference
