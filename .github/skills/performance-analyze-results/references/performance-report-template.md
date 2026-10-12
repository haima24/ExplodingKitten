# Performance Test Report Template

---

# Performance Test Report

## Document Information

| Field | Value |
|---|---|
| System Under Test | |
| Environment | |
| Test Execution Date | |
| Report Date | |
| Author | |
| Version | |
| PRD Reference | |
| Scenarios Executed | |

---

## Executive Summary

> 3–5 sentences summarizing: what was tested, overall verdict, key findings, and next steps.

**Overall Verdict:** PASS / FAIL / PASS WITH CONCERNS / INCONCLUSIVE

---

## Scenarios Tested

| Scenario | Tool | Duration | Peak VUs | Verdict |
|---|---|---|---|---|
| Load Test | K6 / JMeter | | | PASS / FAIL |
| Stress Test | | | | |
| Soak Test | | | | |
| Spike Test | | | | |

---

## Metrics Summary

### [Scenario Name — e.g., Load Test]

| Metric | Value |
|---|---|
| Total Requests | |
| Throughput (RPS) | |
| p50 Response Time | ms |
| p90 Response Time | ms |
| p95 Response Time | ms |
| p99 Response Time | ms |
| Max Response Time | ms |
| Average Response Time | ms |
| Error Rate | % |

---

## SLA Threshold Comparison

| Metric | Threshold | Actual | Status |
|---|---|---|---|
| p95 response time (global) | < ms | ms | PASS / **FAIL** |
| p99 response time (global) | < ms | ms | |
| Error rate | < % | % | |
| Throughput | >= RPS | RPS | |
| p95 POST /[endpoint] | < ms | ms | |

---

## Error Analysis

### Error Rate Summary

| Scenario | Total Errors | Error Rate | HTTP 4xx | HTTP 5xx | Timeouts |
|---|---|---|---|---|---|
| Load Test | | % | | | |

### Error Distribution by Endpoint

| Endpoint | Error Count | Primary Error Code |
|---|---|---|
| | | |

### Error Observations

> Describe when errors occurred (ramp-up / steady state / ramp-down), any patterns, and any log evidence.

---

## Bottleneck Analysis

> Describe any identified performance bottlenecks, degradation patterns, or system limits observed.

| Observation | Pattern | Likely Cause |
|---|---|---|
| | | |

---

## Trend Comparison (if applicable)

| Metric | Previous | Current | Change |
|---|---|---|---|
| p95 response time | ms | ms | +/- ms (%) |
| Error rate | % | % | |
| Peak RPS | | | |

---

## Recommendations

| Finding | Severity | Recommendation | Owner |
|---|---|---|---|
| | High / Medium / Low | | |

---

## Conclusion

> Restate the overall verdict and immediate next steps.

---

## Appendix

### Raw Metrics (per scenario)

> Paste K6 summary output, JMeter aggregate report, or metric table.

### Environment Details

| Field | Value |
|---|---|
| Base URL | |
| Instance Count | |
| CPU / Memory | |
| Autoscaling | |
| Monitoring Tool | |
