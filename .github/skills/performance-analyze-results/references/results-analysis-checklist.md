# Results Analysis Checklist

## Purpose

Validate that the performance test report is complete, accurate, and actionable.

---

## Checklist

### Data Completeness
- [ ] Results available for all executed scenarios
- [ ] Key metrics calculated: p50, p90, p95, p99, error rate, RPS, duration

### Threshold Comparison
- [ ] Every SLA threshold from PRD is included in comparison table
- [ ] Each threshold has Actual value, Threshold value, and PASS/FAIL status
- [ ] No threshold omitted

### Verdict
- [ ] Verdict issued per scenario (PASS / FAIL / INCONCLUSIVE)
- [ ] Overall verdict issued
- [ ] Verdict is consistent with threshold comparison results

### Error Analysis
- [ ] Error rate reported
- [ ] Error types broken down by HTTP status code
- [ ] Endpoints with errors identified
- [ ] Error correlation with load phase noted

### Bottleneck Analysis
- [ ] Response time trend described
- [ ] Any gradual degradation noted
- [ ] Bottleneck hypothesis stated where pattern is evident

### Trend Comparison (if previous results available)
- [ ] Previous vs current comparison included
- [ ] Any regressions > 10% flagged

### Recommendations
- [ ] Every FAIL finding has at least one recommendation
- [ ] Recommendations are actionable and specific

### Report Structure
- [ ] All template sections populated
- [ ] Executive summary is present and concise
- [ ] Appendix / raw metrics included

---

## Pass Criteria

All items checked before delivering the report to stakeholders.
