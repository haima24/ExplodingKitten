# Test Execution Standard

## Purpose

Defines how performance tests shall be executed to ensure valid, reproducible results.

---

## Execution Order

Always execute test types in this order to avoid environment contamination:

1. Load Test (baseline validation)
2. Stress Test (break point discovery)
3. Spike Test (burst recovery)
4. Soak Test (long-running, schedule separately)

Never run stress test before load test.
Run soak test in a dedicated maintenance window.

---

## Environment Rules

- Always confirm environment URL before execution
- Never run against production without written approval
- Autoscaling must be configured as intended (disabled for fixed-capacity tests)
- Third-party integrations must be mocked or isolated

---

## Monitoring Requirements

Before starting any test:
- APM tool is capturing transactions (Datadog, New Relic, Dynatrace, etc.)
- Infrastructure metrics are being collected (CPU, memory, I/O)
- Log aggregation is enabled

---

## Results Capture

### K6
```bash
# Results are stored in a timestamped run folder
RUN_ID="run-$(date +%Y%m%d-%H%M%S)"
k6 run --out json=results/$RUN_ID/[scenario]-results.json [script].js
```

### JMeter
```bash
RUN_ID="run-$(date +%Y%m%d-%H%M%S)"
jmeter -n -t [script].jmx -l results/$RUN_ID/[scenario]-results.jtl -e -o results/$RUN_ID/[scenario]-report/
```

Results files must be retained for at minimum 30 days.

---

## Execution Isolation

- Run one test scenario at a time
- Allow 5-minute cool-down between back-to-back test runs
- Verify system returns to baseline state before next run

---

## Aborting a Test

Abort immediately if:
- Error rate exceeds 20% for more than 60 seconds
- Infrastructure (DB, cache) shows signs of cascading failure
- Production traffic is unexpectedly affected

Record the abort reason and elapsed time in the execution log.

---

## CI/CD Integration

### K6 in CI

```yaml
# Example GitHub Actions step
- name: Run K6 Load Test
  run: |
    k6 run \
      --out json=results/load-test.json \
      -e BASE_URL=${{ secrets.STAGING_URL }} \
      scripts/load-test.js
  env:
    K6_CLOUD_TOKEN: ${{ secrets.K6_CLOUD_TOKEN }}
```

### JMeter in CI

```yaml
- name: Run JMeter Load Test
  run: |
    jmeter -n \
      -t jmeter/load-test.jmx \
      -Jbase_url=${{ secrets.STAGING_URL }} \
      -l results/load-test.jtl
```

Credentials must always come from CI secrets — never from committed files.
