# SKILL.md — Design Test Scenarios

## Purpose

Transform performance requirements into detailed, executable test scenarios that define virtual user behavior, load profiles, and success criteria per test run.

---

## When to Use

- After performance requirements are documented and approved
- When translating SLAs and load profiles into scripting-ready specifications
- When multiple test types (load, stress, soak) need separate scenario definitions

---

## Do Not Use When

- Performance requirements are not yet documented (use `analyze-performance-requirements` first)
- The task is to generate actual test scripts (use `generate-k6-scripts` or `generate-jmeter-scripts`)

---

## Inputs

### Required
- Approved Performance Requirements Document (PRD)

### Optional
- API contracts / Swagger / OpenAPI spec
- User journey maps or business workflows

---

## Outputs

- `test-scenarios.md` — One scenario definition per test type, including:
  - Scenario name and purpose
  - Virtual user journey steps
  - Load profile (VUs, ramp-up, steady state, ramp-down)
  - Think times
  - Parameterization requirements
  - Correlation requirements
  - Success thresholds per scenario

---

## Workflow

```
Load Knowledge
      │
      ▼
Read PRD
      │
      ▼
Identify Test Types
      │
      ▼
For Each Test Type:
  Define VU Journey
  Define Load Profile
  Define Thresholds
      │
      ▼
Apply Scenario Design Standard
      │
      ▼
Execute Scenario Checklist
      │
      ▼
Populate Scenario Template
      │
      ▼
Self Review
      │
      ▼
Output test-scenarios.md
```

---

## Knowledge Sources

### Standards
- `references/test-scenario-design-standard.md`

### Checklists
- `references/test-scenario-checklist.md`

### Templates
- `references/test-scenario-template.md`

### Examples
- `references/test-scenario-example.md`

### Knowledge Base
- `knowledge-base/performance-testing-concepts.md`
- `knowledge-base/tool-selection-guide.md`

---

## Execution Rules

1. Load all knowledge sources before proceeding
2. Read the PRD in full
3. Create one scenario definition per test type
4. Each scenario must trace back to a PRD requirement
5. Every scenario must include thresholds
6. Apply the scenario design standard throughout
7. Execute the scenario checklist before output
8. Perform self review

---

## Decision Rules

| Condition | Action |
|---|---|
| PRD missing | Stop — request PRD from user |
| VU count not in PRD | Ask clarification |
| No endpoint list in PRD | Ask clarification |
| Soak test requested | Define minimum 1-hour duration |
| Stress test requested | Define incremental step-up load profile |
| Spike test requested | Define instant surge profile |

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

- [ ] One scenario per test type
- [ ] Each scenario has a complete load profile
- [ ] Each scenario has thresholds derived from PRD SLAs
- [ ] VU journeys map to PRD in-scope endpoints
- [ ] Parameterization and correlation identified
- [ ] Checklist executed

---

## Self Review

Execute `references/test-scenario-checklist.md` and confirm all items pass.

---

## Success Criteria

- All required test types have a complete scenario definition
- Scenarios are ready to be handed to script generation without further clarification

---

## Next Skill

`generate-k6-scripts` or `generate-jmeter-scripts`

---

## Related Skills

- Upstream: `analyze-performance-requirements`
- Downstream: `generate-k6-scripts`, `generate-jmeter-scripts`

---

## Related Knowledge

- `references/test-scenario-design-standard.md`
- `references/test-scenario-checklist.md`
- `references/test-scenario-template.md`
- `references/test-scenario-example.md`
- `knowledge-base/performance-testing-concepts.md`
