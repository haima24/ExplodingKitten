# SKILL.md — Analyze Performance Requirements

## Purpose

Extract, clarify, and document performance requirements from user stories, acceptance criteria, or stakeholder conversations.

Produce a structured Performance Requirements Document (PRD) that serves as the single source of truth for all downstream performance testing activities.

---

## When to Use

- At the start of a performance testing engagement
- When performance NFRs (Non-Functional Requirements) are vague or undocumented
- When SLA targets need to be formalized before test design begins

---

## Do Not Use When

- Performance requirements are already documented and approved
- The task is to design test scenarios (use `design-test-scenarios` skill)
- The task is to generate scripts (use `generate-k6-scripts` or `generate-jmeter-scripts`)

---

## Inputs

### Required
- User stories, feature descriptions, or system description
- Any existing SLA or NFR documents

### Optional
- Previous performance test results
- Architecture diagrams
- Stakeholder interview notes

---

## Outputs

- `performance-requirements-document.md` — Structured PRD
  - System under test description
  - Test types required
  - Load profile targets (VUs, RPS, duration)
  - SLA thresholds (p50, p90, p95, p99, error rate)
  - In-scope / out-of-scope endpoints
  - Assumptions and open questions

---

## Workflow

```
Load Knowledge
      │
      ▼
Read Inputs
      │
      ▼
Identify Missing Information
      │
      ├─ Missing critical info → Ask clarification questions
      │
      ▼
Extract Requirements
      │
      ▼
Apply Requirements Standard
      │
      ▼
Execute Requirements Checklist
      │
      ▼
Populate Template
      │
      ▼
Self Review
      │
      ▼
Output PRD
```

---

## Knowledge Sources

### Standards
- `references/performance-requirements-standard.md`

### Checklists
- `references/performance-requirements-checklist.md`

### Templates
- `references/performance-requirements-template.md`

### Examples
- `references/performance-requirements-example.md`

### Knowledge Base
- `knowledge-base/performance-testing-concepts.md`

---

## Execution Rules

1. Load all knowledge sources before proceeding
2. Read all provided inputs
3. Identify gaps — ask clarifying questions for any missing required field
4. Apply the requirements standard when extracting SLAs and load profiles
5. Execute the requirements checklist before producing output
6. Populate the template exactly — do not omit sections
7. Perform self review

---

## Decision Rules

| Condition | Action |
|---|---|
| SLA targets are missing | Ask: "What are the acceptable p95 response time and error rate thresholds?" |
| Test type is not stated | Ask: "Is this a load test, stress test, soak test, or spike test?" |
| Target VU count unknown | Ask: "What is the expected peak concurrent user count?" |
| Environment not specified | Ask: "What environment will tests run against (staging, UAT, prod-mirror)?" |
| Only vague requirements exist | Document as assumption, flag as open question |

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

- [ ] All required template sections completed
- [ ] SLA thresholds defined (at minimum p95 + error rate)
- [ ] Load profile defined (VU count, ramp-up, duration)
- [ ] At least one test type identified
- [ ] All open questions listed
- [ ] Checklist executed with no unresolved critical items

---

## Self Review

Execute `references/performance-requirements-checklist.md` and confirm all items pass before delivering output.

---

## Success Criteria

- PRD produced and complete
- SLA thresholds are measurable and testable
- Document is approved or accepted by stakeholder (or flagged assumptions are acknowledged)

---

## Next Skill

`design-test-scenarios`

---

## Related Skills

- Upstream: None (entry point)
- Downstream: `design-test-scenarios`

---

## Related Knowledge

- `references/performance-requirements-standard.md`
- `references/performance-requirements-checklist.md`
- `references/performance-requirements-template.md`
- `references/performance-requirements-example.md`
- `knowledge-base/performance-testing-concepts.md`
