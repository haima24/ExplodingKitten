# Execution Plan Template

---

# Performance Test Execution Plan

## Document Information

| Field | Value |
|---|---|
| System Under Test | |
| Environment | |
| Base URL | |
| Execution Date | |
| Executor | |
| Scripts Version | |
| Review Report Reference | |

---

## Pre-Execution Checklist Status

| Item | Status |
|---|---|
| Script review PASS | ✓ / ✗ |
| Environment confirmed | ✓ / ✗ |
| Monitoring active | ✓ / ✗ |
| Test data ready | ✓ / ✗ |
| Stakeholders notified | ✓ / ✗ |

**Pre-execution status:** READY / BLOCKED

---

## Execution Schedule

| Scenario | Script | Estimated Duration | Scheduled Time | Status |
|---|---|---|---|---|
| Load Test | load-test.js / .jmx | | | Pending |
| Stress Test | stress-test.js / .jmx | | | Pending |
| Spike Test | spike-test.js / .jmx | | | Pending |
| Soak Test | soak-test.js / .jmx | | | Pending |

---

## Run Commands

> Each run is stored in its own timestamped folder: `results/run-YYYYMMDD-HHmmss/`

### Set Run ID (do this once before executing any scenario)

```bash
# Bash / CI
export RUN_ID="run-$(date +%Y%m%d-%H%M%S)"
mkdir -p results/$RUN_ID

# PowerShell
$RUN_ID = "run-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
New-Item -ItemType Directory -Force -Path "results\$RUN_ID"
```

### Load Test

```bash
# K6
BASE_URL=[URL] k6 run --out json=results/$RUN_ID/load-test-results.json scripts/load-test.js

# JMeter
jmeter -n -t jmeter/load-test.jmx -Jbase_url=[URL] -l results/$RUN_ID/load-test-results.jtl -e -o results/$RUN_ID/load-test-report/
```

### Stress Test

```bash
# K6
BASE_URL=[URL] k6 run --out json=results/$RUN_ID/stress-test-results.json scripts/stress-test.js

# JMeter
jmeter -n -t jmeter/stress-test.jmx -Jbase_url=[URL] -l results/$RUN_ID/stress-test-results.jtl
```

### Spike Test

```bash
# K6
BASE_URL=[URL] k6 run --out json=results/$RUN_ID/spike-test-results.json scripts/spike-test.js
```

### Soak Test

```bash
# K6
BASE_URL=[URL] k6 run --out json=results/$RUN_ID/soak-test-results.json scripts/soak-test.js
```

---

## Results Output

| Scenario | Results File | Report Location |
|---|---|---|
| Load Test | `results/$RUN_ID/load-test-results.json` | `results/$RUN_ID/load-test-report/` |
| Stress Test | `results/$RUN_ID/stress-test-results.json` | |
| Spike Test | `results/$RUN_ID/spike-test-results.json` | |
| Soak Test | `results/$RUN_ID/soak-test-results.json` | |

---

## Abort Criteria

| Trigger | Action |
|---|---|
| Error rate > 20% for 60s | Stop test immediately, record elapsed time |
| p99 > 5000ms sustained | Stop test, notify team |
| Infrastructure failure detected | Stop all tests, escalate |

---

## Execution Log

| Time | Scenario | Event | Notes |
|---|---|---|---|
| | | Started | |
| | | Completed / Aborted | |
