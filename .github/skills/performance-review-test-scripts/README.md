# README — Review Test Scripts

## Overview

Reviews generated K6 or JMeter test scripts for correctness, completeness, and alignment with scenarios and SLAs.

---

## Usage

> "Review the following K6 scripts against the test scenarios."

---

## Inputs

| Input | Required |
|---|---|
| Generated test scripts | Yes |
| Test scenarios document | Yes |

## Outputs

| File | Description |
|---|---|
| `script-review-report.md` | Findings per script with pass/fail verdict |

---

## Folder Structure

```
review-test-scripts/
├── SKILL.md
├── README.md
├── prompt.md
└── references/
    ├── script-review-standard.md
    ├── script-review-checklist.md
    ├── script-review-report-template.md
    └── script-review-example.md
```

---

## Related Skills

- Upstream: `generate-k6-scripts`, `generate-jmeter-scripts`
- Downstream: `execute-performance-tests`
