# README — Analyze Performance Requirements

## Overview

This skill extracts and documents performance requirements, producing a Performance Requirements Document (PRD) that drives all downstream test design and scripting.

---

## Usage

### Trigger Prompt

> "Analyze the performance requirements for [system description or attached document]."

Or use the prompt in `prompt.md`.

---

## Inputs

| Input | Required | Description |
|---|---|---|
| System description or user stories | Yes | What system and endpoints are under test |
| SLA / NFR documents | No | Existing performance targets |
| Previous test results | No | Historical baselines |

---

## Outputs

| File | Description |
|---|---|
| `performance-requirements-document.md` | Structured PRD with SLAs, load profiles, scope |

---

## Dependencies

- None (entry-point skill)

---

## Folder Structure

```
analyze-performance-requirements/
├── SKILL.md
├── README.md
├── prompt.md
└── references/
    ├── performance-requirements-standard.md
    ├── performance-requirements-checklist.md
    ├── performance-requirements-template.md
    └── performance-requirements-example.md
```

---

## Related Skills

- Next: `design-test-scenarios`
