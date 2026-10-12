# README — Design Test Scenarios

## Overview

Converts a Performance Requirements Document into detailed, scripting-ready test scenario definitions for each required test type.

---

## Usage

> "Design test scenarios based on the attached performance requirements document."

Or use `prompt.md`.

---

## Inputs

| Input | Required |
|---|---|
| Performance Requirements Document | Yes |
| API spec / Swagger | No |

## Outputs

| File | Description |
|---|---|
| `test-scenarios.md` | One scenario per test type with load profile, journey, and thresholds |

---

## Folder Structure

```
design-test-scenarios/
├── SKILL.md
├── README.md
├── prompt.md
└── references/
    ├── test-scenario-design-standard.md
    ├── test-scenario-checklist.md
    ├── test-scenario-template.md
    └── test-scenario-example.md
```

---

## Related Skills

- Upstream: `analyze-performance-requirements`
- Downstream: `generate-k6-scripts`, `generate-jmeter-scripts`
