# SKILL.md — Execute Performance Tests

## Purpose

Prepare and execute approved performance test scripts against the target environment, capturing results for analysis.

---

## When to Use

- Scripts have been reviewed and passed (`script-review-report.md` with PASS verdict)
- Environment is ready and monitoring is in place

---

## Do Not Use When

- Scripts have not been reviewed (use `review-test-scripts` first)
- The task is to analyze results (use `analyze-results`)

---

## Inputs

### Required
- Approved test scripts (K6 `.js` or JMeter `.jmx`)
- Script review report (PASS verdict)
- Performance Requirements Document

### Optional
- CI/CD pipeline configuration
- Environment access credentials (provided at runtime, not in scripts)

---

## Outputs

- `execution-plan.md` — Pre-execution checklist and run commands
- Raw results: `results/[scenario]-results.json` (K6) or `results/[scenario]-results.jtl` (JMeter)
- Execution log

---

## Workflow

```
Load Knowledge
      │
      ▼
Verify Pre-Execution Checklist
      │
      ├─ Checklist fails → Stop and remediate
      │
      ▼
Generate Execution Plan
      │
      ▼
Execute Tests (per scenario, in order)
  Load Test → Stress Test → Soak Test → Spike Test
      │
      ▼
Capture Results
      │
      ▼
Verify Results Files Exist
      │
      ▼
Output Execution Summary
```

---

## Knowledge Sources

### Standards
- `references/test-execution-standard.md`

### Checklists
- `references/pre-execution-checklist.md`

### Templates
- `references/execution-plan-template.md`

### Examples
- `references/execution-plan-example.md`

### Knowledge Base
- `knowledge-base/performance-testing-concepts.md`

---

## Execution Rules

1. Never execute scripts that have not passed review
2. Always verify pre-execution checklist before running
3. Run load test before stress test
4. Capture all output to a versioned results folder
5. Do not execute tests against production unless explicitly approved
6. Notify stakeholders before starting soak or stress tests

---

## Decision Rules

| Condition | Action |
|---|---|
| Review report shows FAIL | Stop — fix scripts first |
| Environment not ready | Stop — notify and wait |
| Monitoring not in place | Warn — recommend enabling before proceeding |
| Soak test > 2 hours | Confirm with stakeholder before executing |
| Production environment | Require explicit written approval |

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

- [ ] Review report PASS obtained
- [ ] Pre-execution checklist complete
- [ ] Environment URL confirmed (not production unless approved)
- [ ] Monitoring active
- [ ] Results folder prepared
- [ ] Run commands documented

---

## Self Review

Execute `references/pre-execution-checklist.md` before any test run.

---

## Success Criteria

- All scenarios executed without infrastructure failure
- Results files captured and accessible for analysis

---

## Next Skill

`analyze-results`

---

## Related Skills

- Upstream: `review-test-scripts`
- Downstream: `analyze-results`

---

## Related Knowledge

- `references/test-execution-standard.md`
- `references/pre-execution-checklist.md`
- `references/execution-plan-template.md`
- `references/execution-plan-example.md`
