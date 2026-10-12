# Performance Report Example

> Reference only. Do not copy verbatim into outputs.

---

# Performance Test Report

## Document Information

| Field | Value |
|---|---|
| System Under Test | E-Commerce Checkout API |
| Environment | Staging |
| Test Execution Date | 2026-07-08 |
| Report Date | 2026-07-09 |
| Author | Performance QA Team |
| Version | 1.0 |
| PRD Reference | performance-requirements-document.md v1.0 |
| Scenarios Executed | Load Test, Stress Test |

---

## Executive Summary

The E-Commerce Checkout API was tested under load (500 VUs) and stress (stepped up to 1500 VUs) conditions on the staging environment on 2026-07-08. The load test **PASSED** all SLA thresholds with comfortable margins except for the `POST /api/checkout` p95 response time which marginally exceeded the 800ms threshold at 823ms. The stress test identified a breaking point at 1250 VUs with error rate exceeding 5%. Immediate attention is recommended for checkout endpoint query optimization.

**Overall Verdict:** FAIL — `POST /api/checkout` p95 threshold breached.

---

## Scenarios Tested

| Scenario | Tool | Duration | Peak VUs | Verdict |
|---|---|---|---|---|
| Load Test | K6 | 22 min | 500 | **FAIL** (checkout p95) |
| Stress Test | K6 | 35 min | 1250 (breaking point) | N/A (informational) |

---

## Metrics Summary

### Load Test

| Metric | Value |
|---|---|
| Total Requests | 847,320 |
| Throughput (RPS) | 642 |
| p50 Response Time | 187ms |
| p90 Response Time | 401ms |
| p95 Response Time | 468ms |
| p99 Response Time | 891ms |
| Max Response Time | 3,241ms |
| Average Response Time | 214ms |
| Error Rate | 0.21% |

---

## SLA Threshold Comparison

| Metric | Threshold | Actual | Status |
|---|---|---|---|
| p95 response time (global) | < 500ms | 468ms | PASS |
| p99 response time (global) | < 1000ms | 891ms | PASS |
| Error rate | < 1% | 0.21% | PASS |
| Throughput | >= 300 RPS | 642 RPS | PASS |
| p95 POST /api/checkout | < 800ms | **823ms** | **FAIL** |

---

## Error Analysis

### Error Rate Summary

| Scenario | Total Errors | Error Rate | HTTP 4xx | HTTP 5xx | Timeouts |
|---|---|---|---|---|---|
| Load Test | 1,779 | 0.21% | 312 | 1,467 | 0 |

### Error Distribution by Endpoint

| Endpoint | Error Count | Primary Error Code |
|---|---|---|
| POST /api/checkout | 1,467 | 503 Service Unavailable |
| POST /auth/login | 312 | 429 Too Many Requests |

### Error Observations

HTTP 503 errors on `/api/checkout` clustered between minutes 12–18 of the steady-state phase, suggesting intermittent backend pool saturation. The 429 errors on `/auth/login` were rate-limit responses on re-login attempts and are expected behavior.

---

## Bottleneck Analysis

| Observation | Pattern | Likely Cause |
|---|---|---|
| POST /api/checkout p95 = 823ms | Consistently above threshold after minute 10 | DB query latency — order creation involves 3 sequential writes |
| HTTP 503 errors on /checkout from minute 12 | Intermittent burst | Backend connection pool (current: 10) insufficient under sustained 500 VU load |

---

## Trend Comparison

N/A — First test run for this system.

---

## Recommendations

| Finding | Severity | Recommendation | Owner |
|---|---|---|---|
| POST /checkout p95 = 823ms (SLA: <800ms) | High | 1. Add DB index on `orders.user_id`. 2. Increase connection pool from 10 to 25. 3. Evaluate batching the 3 sequential writes into a transaction. | Backend Team |
| HTTP 503 on /checkout under sustained load | High | Increase DB connection pool. Consider read replica for inventory checks. | DevOps / Backend |

---

## Conclusion

The load test results reveal a marginal breach on the `POST /api/checkout` p95 threshold (823ms vs 800ms SLA). Root cause analysis points to DB connection pool saturation under sustained 500 VU load. The recommended fixes should be implemented and the load test re-run before production release.

**Next Steps:**
1. Backend team to implement DB index and connection pool increase (target: 2026-07-12)
2. Re-run load test after fixes
3. Proceed with soak test once load test PASS is confirmed

---

## Appendix

### K6 Summary Output (Load Test)

```
scenarios: (100.00%) 1 scenario, 500 max VUs, 24m30s max duration
default: 500 looping VUs for 22m0s (gracefulStop: 30s)

✓ login status 200
✓ has access_token
✓ products status 200
✓ checkout status 201

checks.........................: 99.79% ✓ 3387040 ✗ 7116
data_received..................: 1.8 GB 1.4 MB/s
http_req_duration.............: avg=214ms min=12ms med=187ms max=3241ms p(90)=401ms p(95)=468ms p(99)=891ms
http_req_failed...............: 0.21%  ✓ 1779    ✗ 845541
checkout_duration.............: avg=641ms min=87ms  med=598ms max=3241ms p(90)=769ms p(95)=823ms

FAIL: checkout_duration........: p(95)=823.12ms threshold=p(95)<800
```

### Environment Details

| Field | Value |
|---|---|
| Base URL | https://staging-api.example.com |
| Instance Count | 3 (autoscaling disabled) |
| CPU / Memory | 4 vCPU / 8 GB RAM each |
| Autoscaling | Disabled |
| Monitoring Tool | Datadog APM |
