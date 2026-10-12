# Execution Plan Example

> Reference only. Do not copy verbatim into outputs.

---

# Performance Test Execution Plan

## Document Information

| Field | Value |
|---|---|
| System Under Test | E-Commerce Checkout API |
| Environment | Staging |
| Base URL | https://staging-api.example.com |
| Execution Date | 2026-07-08 |
| Executor | Performance QA Team |
| Scripts Version | v1.1 (post-review fixes) |
| Review Report Reference | script-review-report.md |

---

## Pre-Execution Checklist Status

| Item | Status |
|---|---|
| Script review PASS | ✓ |
| Environment confirmed | ✓ |
| Monitoring active (Datadog) | ✓ |
| Test data (users.csv — 10k records) ready | ✓ |
| Stakeholders notified | ✓ |

**Pre-execution status:** READY

---

## Execution Schedule

| Scenario | Script | Estimated Duration | Scheduled Time | Status |
|---|---|---|---|---|
| Load Test | load-test.js | 22 min | 09:00 | Pending |
| Stress Test | stress-test.js | ~35 min | 09:30 | Pending |
| Spike Test | spike-test.js | 15 min | 10:15 | Pending |
| Soak Test | soak-test.js | 2 hours | Next day 08:00 | Pending |

---

## Run Commands

### Load Test

```bash
BASE_URL=https://staging-api.example.com \
k6 run \
  --out json=results/load-test-20260708-0900.json \
  --out influxdb=http://influxdb:8086/k6 \
  scripts/load-test.js
```

### Stress Test

```bash
BASE_URL=https://staging-api.example.com \
k6 run \
  --out json=results/stress-test-20260708-0930.json \
  scripts/stress-test.js
```

### Spike Test

```bash
BASE_URL=https://staging-api.example.com \
k6 run \
  --out json=results/spike-test-20260708-1015.json \
  scripts/spike-test.js
```

---

## Abort Criteria

| Trigger | Action |
|---|---|
| Error rate > 20% for 60s | Ctrl+C, record elapsed time, escalate to dev team |
| p99 > 5000ms sustained | Abort, check DB connection pool and cache |

---

## Execution Log

| Time | Scenario | Event | Notes |
|---|---|---|---|
| 09:00 | Load Test | Started | 500 VUs target |
| 09:22 | Load Test | Completed | PASS — all thresholds met |
| 09:35 | Stress Test | Started | Step-up from 500 to 1500 VUs |
| 10:10 | Stress Test | Completed | Breaking point at 1250 VUs |
