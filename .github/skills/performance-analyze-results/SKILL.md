# SKILL.md — Analyze Results

## Purpose

Analyze raw performance test results, compare against SLA thresholds, identify performance issues, and produce a final Performance Test Report with pass/fail verdict and actionable recommendations.

---

## When to Use

- Performance tests have been executed and raw results are available
- Stakeholders need a formal performance test report

---

## Do Not Use When

- Tests have not been executed (use `execute-performance-tests` first)
- The task is to re-run or fix scripts (use `generate-k6-scripts` or `generate-jmeter-scripts`)

---

## Inputs

### Required
- Raw results files: `.json` (K6) or `.jtl` (JMeter) or aggregated metrics
- Performance Requirements Document (for SLA comparison)
- Test scenarios document (for context)

### Optional
- APM dashboard exports (screenshots or data)
- Infrastructure metrics (CPU, memory graphs)
- Previous test results (for trend comparison)

---

## Outputs

- `performance-test-report.md` — Final report containing:
  - Executive summary (pass/fail vs SLAs)
  - Metrics summary per scenario
  - Threshold comparison table
  - Error analysis
  - Bottleneck findings
  - Trend comparison (if previous results available)
  - Recommendations
  - Appendix: raw metrics

---

## Workflow

```
Load Knowledge
      │
      ▼
Read PRD (SLA targets)
      │
      ▼
Read Raw Results
      │
      ▼
Aggregate Metrics
  (p50, p90, p95, p99, error rate, RPS)
      │
      ▼
Compare Against SLA Thresholds
      │
      ▼
Identify Failed Thresholds
      │
      ▼
Analyze Errors and Bottlenecks
      │
      ▼
Compare with Previous Results (if available)
      │
      ▼
Apply Analysis Standard
      │
      ▼
Execute Analysis Checklist
      │
      ▼
Populate Report Template
      │
      ▼
Self Review
      │
      ▼
Output Report
```

---

## Knowledge Sources

### Standards
- `references/results-analysis-standard.md`

### Checklists
- `references/results-analysis-checklist.md`

### Templates
- `references/performance-report-template.md`

### Examples
- `references/performance-report-example.md`

### Knowledge Base
- `knowledge-base/performance-testing-concepts.md`

---

## Execution Rules

1. Load all knowledge sources before analyzing
2. Read PRD to understand pass criteria before reading results
3. Aggregate all key percentile metrics
4. Compare every threshold defined in the scenario
5. Never declare PASS unless all thresholds are met
6. Include error analysis even when error rate is within threshold
7. Always provide actionable recommendations for any breach
8. Execute the analysis checklist before delivering report

---

## Decision Rules

| Condition | Action |
|---|---|
| All thresholds met | Verdict: PASS |
| Any threshold breached | Verdict: FAIL — detail which threshold(s) |
| Error rate within threshold but errors present | Include error breakdown section |
| p99 > p95 threshold by large margin | Flag as warning even if p95 passes |
| Results show gradual degradation (soak) | Flag as memory leak risk |
| Previous results available | Include trend comparison |
| Bottleneck identified | Name specific component (DB, cache, service layer) |

---

## Knowledge Priority

1. User instructions
2. SKILL.md
3. Standards
4. Checklists
5. Templates
6. Examples

---

## Quality Gates

- [ ] All test scenarios have corresponding analysis sections
- [ ] Every SLA threshold is compared
- [ ] Pass/fail verdict issued per scenario and overall
- [ ] Error analysis included
- [ ] Recommendations provided for all FAIL items
- [ ] Report template fully populated
- [ ] Checklist executed

---

## Self Review

Execute `references/results-analysis-checklist.md` against the report.

---

## Success Criteria

- Performance test report delivered and complete
- Stakeholders can make a go/no-go decision based on the report
- All failing thresholds have actionable recommendations

---

## Next Skill

None (end of lifecycle) or restart from `analyze-performance-requirements` for next cycle.

---

## Related Skills

- Upstream: `execute-performance-tests`
- Downstream: None (report delivered to stakeholders)

---

## Related Knowledge

- `references/results-analysis-standard.md`
- `references/results-analysis-checklist.md`
- `references/performance-report-template.md`
- `references/performance-report-example.md`
- `knowledge-base/performance-testing-concepts.md`
