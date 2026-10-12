# Pre-Execution Checklist

## Purpose

Validate readiness before executing any performance test.

---

## Checklist

### Scripts
- [ ] Script review report obtained with PASS verdict
- [ ] Correct script version confirmed (not draft)
- [ ] Scripts accessible at expected file paths

### Environment
- [ ] Target environment URL confirmed and correct
- [ ] Environment is NOT production (or written approval obtained)
- [ ] Autoscaling configuration matches test intent (enabled/disabled)
- [ ] Third-party dependencies are mocked or isolated
- [ ] Test data (CSV, database seed) is in place
- [ ] Previous test data/results cleaned up if needed

### Monitoring
- [ ] APM tool is active and capturing data
- [ ] Infrastructure metrics collection confirmed (CPU, memory)
- [ ] Log aggregation active
- [ ] Alerting muted or stakeholders notified to prevent false alarms

### Results
- [ ] Results output directory created
- [ ] Disk space available for results files
- [ ] Naming convention confirmed for output files

### Communication
- [ ] Stakeholders notified of test start time
- [ ] Team available to monitor during execution
- [ ] Abort criteria documented and shared

### For Soak Tests (additional)
- [ ] Maintenance window scheduled
- [ ] Long-running monitoring dashboards configured
- [ ] Alert on memory leak / gradual degradation enabled

---

## Abort Criteria (agree before starting)

- Error rate > 20% sustained for 60 seconds
- p99 response time > 5x SLA threshold
- Any cascading infrastructure failure
- Unintended production traffic impact

---

## Pass Criteria

All items checked before executing any test scenario.
