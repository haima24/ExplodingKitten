# SKILL.md — Generate JMeter Scripts

## Purpose

Generate Apache JMeter test plan structures (JMX) and supporting files from approved test scenario definitions.

---

## When to Use

- Test scenarios are approved and complete
- JMeter has been selected as the test tool (see `knowledge-base/tool-selection-guide.md`)
- Protocol coverage requires JDBC, JMS, LDAP, or other JMeter-supported protocols
- Team prefers GUI-driven test design

---

## Do Not Use When

- Test scenarios are not designed (use `design-test-scenarios` first)
- K6 is the selected tool (use `generate-k6-scripts`)
- The task is to review scripts (use `review-test-scripts`)

---

## Inputs

### Required
- Approved test scenarios document (`test-scenarios.md`)

### Optional
- OpenAPI / Swagger spec
- Sample request/response payloads
- Existing JMX to extend

---

## Outputs

Per test scenario:
- `jmeter/load-test.jmx` — JMeter test plan (XML)
- `jmeter/stress-test.jmx`
- `jmeter/soak-test.jmx`
- `jmeter/spike-test.jmx`

Supporting files:
- `jmeter/data/users.csv` — Parameterization data (CSV Data Set Config)
- `jmeter/scripts/pre-test.bsh` — BeanShell/Groovy pre-test script (if needed)
- `jmeter/user.properties` — JMeter properties override

---

## Workflow

```
Load Knowledge
      │
      ▼
Read Test Scenarios
      │
      ▼
For Each Scenario:
  Design Thread Group (load profile)
  Define HTTP Request Samplers
  Add Config Elements (CSV, HTTP Header Manager)
  Add Extractors (correlation)
  Add Assertions
  Add Listeners (Backend Listener)
  Apply JMeter Scripting Standard
      │
      ▼
Generate Supporting Files
      │
      ▼
Execute JMeter Script Checklist
      │
      ▼
Self Review
      │
      ▼
Output JMX + Supporting Files
```

---

## Knowledge Sources

### Standards
- `references/jmeter-scripting-standard.md`

### Checklists
- `references/jmeter-script-checklist.md`

### Templates
- `references/jmeter-script-template.md`

### Examples
- `references/jmeter-script-example.md`

### Knowledge Base
- `knowledge-base/performance-testing-concepts.md`
- `knowledge-base/tool-selection-guide.md`

---

## Execution Rules

1. Load all knowledge sources before generating any output
2. Read all test scenarios before writing any JMX
3. Apply JMeter scripting standard to every test plan
4. Never hardcode credentials — use CSV Data Set Config or User Defined Variables referencing properties
5. Always configure thresholds via Response Assertion or Backend Listener
6. Include assertions on every critical sampler
7. Use Constant Timer or Gaussian Random Timer for think time
8. Execute the JMeter script checklist before delivering output

---

## Decision Rules

| Condition | Action |
|---|---|
| Auth token required | Add HTTP Cookie Manager + Login sampler with JSON Extractor |
| CSV parameterization needed | Add CSV Data Set Config element |
| Multiple scenarios | Separate JMX per scenario |
| Ramp-up required | Use Thread Group ramp-up period OR jp@gc Stepping Thread Group |
| Stress test step-up | Use jp@gc Stepping Thread Group or Ultimate Thread Group |
| Distributed load needed | Provide server.rmi configuration guidance |
| Results export needed | Add Backend Listener (InfluxDB) |

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

- [ ] One JMX per scenario
- [ ] Thread Group matches scenario load profile
- [ ] CSV Data Set Config present when parameterization needed
- [ ] All critical samplers have Response Assertions
- [ ] Extractors present for all correlated tokens
- [ ] Timer elements present between requests
- [ ] Backend Listener or Aggregate Listener configured
- [ ] No hardcoded credentials in JMX
- [ ] Checklist executed

---

## Self Review

Execute `references/jmeter-script-checklist.md` against each generated JMX.

---

## Success Criteria

- All scenario JMX files generated and structurally valid
- Scenarios are ready for review without further changes

---

## Next Skill

`review-test-scripts`

---

## Related Skills

- Upstream: `design-test-scenarios`
- Downstream: `review-test-scripts`

---

## Related Knowledge

- `references/jmeter-scripting-standard.md`
- `references/jmeter-script-checklist.md`
- `references/jmeter-script-template.md`
- `references/jmeter-script-example.md`
- `knowledge-base/performance-testing-concepts.md`
