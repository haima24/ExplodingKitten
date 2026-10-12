# README — Generate K6 Scripts

## Overview

Generates K6 JavaScript test scripts from approved test scenario definitions, including load profiles, parameterization, correlation, thresholds, and check assertions.

---

## Usage

> "Generate K6 scripts for the test scenarios in the attached document."

---

## Inputs

| Input | Required |
|---|---|
| Approved test scenarios document | Yes |
| OpenAPI / Swagger spec | No |
| Sample payloads | No |

## Outputs

| File | Description |
|---|---|
| `scripts/load-test.js` | K6 load test script |
| `scripts/stress-test.js` | K6 stress test script |
| `scripts/soak-test.js` | K6 soak test script |
| `scripts/spike-test.js` | K6 spike test script |
| `scripts/helpers/auth.js` | Shared authentication helper |
| `scripts/thresholds.js` | Shared threshold definitions |
| `scripts/data/users.csv` | Placeholder CSV for parameterization |

---

## Folder Structure

```
generate-k6-scripts/
├── SKILL.md
├── README.md
├── prompt.md
└── references/
    ├── k6-scripting-standard.md
    ├── k6-script-checklist.md
    ├── k6-script-template.js
    └── k6-script-example.md
```

---

## Related Skills

- Upstream: `design-test-scenarios`
- Downstream: `review-test-scripts`
