# SKILL.md — Generate K6 Scripts

## Purpose

Generate syntactically valid, production-quality K6 test scripts from approved test scenario definitions.

---

## When to Use

- Test scenarios are approved and complete
- K6 has been selected as the test tool (see `knowledge-base/tool-selection-guide.md`)
- Scripts need to be created for HTTP, WebSocket, or gRPC load tests

---

## Do Not Use When

- Test scenarios are not yet designed (use `design-test-scenarios` first)
- JMeter is the selected tool (use `generate-jmeter-scripts`)
- The task is to review scripts (use `review-test-scripts`)

---

## Inputs

### Required
- Approved test scenarios document (`test-scenarios.md`)

### Optional
- OpenAPI / Swagger spec for endpoint details
- Sample request/response payloads
- Existing K6 script to extend

---

## Outputs

Per test scenario, one K6 script file:
- `load-test.js`
- `stress-test.js`
- `soak-test.js`
- `spike-test.js`

Plus shared files:
- `helpers/auth.js` — Authentication helper
- `data/users.csv` — Parameterization data (placeholder or seeded)
- `thresholds.js` — Shared threshold definitions

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
  Map Journey to K6 Requests
  Configure Load Profile (stages)
  Define Thresholds
  Add Parameterization
  Add Correlation (check/extract)
  Apply K6 Scripting Standard
      │
      ▼
Generate Shared Helpers
      │
      ▼
Execute K6 Script Checklist
      │
      ▼
Self Review
      │
      ▼
Output Scripts
```

---

## Knowledge Sources

### Standards
- `references/k6-scripting-standard.md`

### Checklists
- `references/k6-script-checklist.md`

### Templates
- `references/k6-script-template.js`

### Examples
- `references/k6-script-example.md`

### Knowledge Base
- `knowledge-base/performance-testing-concepts.md`
- `knowledge-base/tool-selection-guide.md`

---

## Execution Rules

1. Load all knowledge sources before generating any code
2. Read all test scenarios before writing any script
3. Apply the K6 scripting standard to every generated script
4. Never hardcode credentials — use environment variables or CSV
5. Always define thresholds in every script
6. Include `check()` assertions for every critical response
7. Execute the K6 script checklist before delivering output

---

## Decision Rules

| Condition | Action |
|---|---|
| Auth required (token in scenario) | Generate auth helper and call in `setup()` |
| CSV parameterization needed | Use `SharedArray` from `k6/data` |
| Multiple scenarios | Generate one file per scenario |
| WebSocket in journey | Use `k6/ws` module |
| gRPC in journey | Use `k6/net/grpc` module |
| Browser simulation needed | Use `k6/browser` module (note: separate executor) |

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

- [ ] All scenarios have corresponding script files
- [ ] Every script imports from correct K6 modules
- [ ] Every script has `options` with `stages` and `thresholds`
- [ ] Every request has `check()` assertions
- [ ] No hardcoded credentials
- [ ] Parameterization uses `SharedArray`
- [ ] Correlation uses `check()` + variable extraction
- [ ] Scripts pass K6 lint / syntax check (no JS errors)
- [ ] Checklist executed

---

## Self Review

Execute `references/k6-script-checklist.md` against each generated script.

---

## Success Criteria

- All scenario scripts generated and syntactically valid
- Thresholds match PRD SLAs
- Scripts are ready for review without further modification

---

## Next Skill

`review-test-scripts`

---

## Related Skills

- Upstream: `design-test-scenarios`
- Downstream: `review-test-scripts`

---

## Related Knowledge

- `references/k6-scripting-standard.md`
- `references/k6-script-checklist.md`
- `references/k6-script-template.js`
- `references/k6-script-example.md`
- `knowledge-base/performance-testing-concepts.md`
- `knowledge-base/tool-selection-guide.md`
