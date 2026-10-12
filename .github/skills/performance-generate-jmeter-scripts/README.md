# README — Generate JMeter Scripts

## Overview

Generates Apache JMeter test plans (JMX) and supporting configuration files from approved test scenario definitions.

---

## Usage

> "Generate JMeter scripts for the test scenarios in the attached document."

---

## Inputs

| Input | Required |
|---|---|
| Approved test scenarios document | Yes |
| OpenAPI / Swagger spec | No |

## Outputs

| File | Description |
|---|---|
| `jmeter/load-test.jmx` | JMeter load test plan |
| `jmeter/stress-test.jmx` | JMeter stress test plan |
| `jmeter/soak-test.jmx` | JMeter soak test plan |
| `jmeter/spike-test.jmx` | JMeter spike test plan |
| `jmeter/data/users.csv` | CSV parameterization data |
| `jmeter/user.properties` | JMeter properties overrides |

---

## Folder Structure

```
performance-generate-jmeter-scripts/
├── SKILL.md
├── README.md
├── prompt.md
└── references/
    ├── jmeter-scripting-standard.md
    ├── jmeter-script-checklist.md
    ├── jmeter-script-template.md
    └── jmeter-script-example.md
```

---

## Related Skills

- Upstream: `design-test-scenarios`
- Downstream: `review-test-scripts`
