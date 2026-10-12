---
name: testing-accessibility-testing

description: 'Use when assessing web accessibility against WCAG 2.2 through checklist verification or applicable-area evaluation. Do not use for code fixes, general functional/performance/security testing, formal test-case generation, or legal certification; route those requests to the sibling testing or qualified compliance reviewer.'
---

# Testing Accessibility Testing

## Purpose
Assess web accessibility against WCAG 2.2, combine automated, manual, and assistive-technology evidence, and produce actionable findings without generating test-case documents.

## Context First
Read scope, target level, evidence, requirements, affected users, environment, and prior findings. Ask when scope, standard, level, or approach is missing; assume no runtime result when evidence is unavailable and expose the limitation.

## Workflow
1. **Baseline.** Input: scope, requirements, evidence, and existing reports. Action: load applicable references and record the assessment boundary. Output: evidence and environment inventory.
2. **Select.** Input: requested approach and evidence. Action: choose checklist, applicable-area, or both; use [`decision-guide.md`](references/decision-guide.md). Output: confirmed approach and coverage plan.
3. **Assess.** Input: coverage plan and running or static evidence. Action: execute the methods in [`execution-guide.md`](references/execution-guide.md). Output: evidence-backed statuses and findings.
4. **Report.** Input: validated evidence. Action: use the approach-specific template and preserve all required WCAG items. Output: reports under `working-artifacts/accessibility-test-reports/`.
5. **Quality gate.** Input: reports and findings. Action: validate evidence, risks, limitations, and naming. Output: final report or explicitly marked draft.

## Output Contract
| Output | Naming |
| --- | --- |
| Applicable-area report | `Accessibility-Report-<Scope-Name>-<YYYYMMDD-HHmmss>.md` |
| WCAG coverage report | `WCAG-Coverage-<Scope-Name>-<YYYYMMDD-HHmmss>.md` |
| Findings log | `Accessibility-Findings-<Scope-Name>-<YYYYMMDD-HHmmss>.md` |
| Automation recommendation | `Accessibility-Automation-<Scope-Name>-<YYYYMMDD-HHmmss>.md` |

Save under `working-artifacts/accessibility-test-reports/`. Generate the report required by the selected approach; for `both`, generate both assessment reports and supporting artifacts where applicable.

## Decision Rules
Use [`decision-guide.md`](references/decision-guide.md) for approach selection, evidence limits, confirmation, prioritization, and escalation. WCAG checklist reports must retain all 86 items with status, primary method, and evidence or rationale.

## Quality Gate
- [ ] Scope, WCAG 2.2 target level, approach, environment, and limitations are explicit.
- [ ] Automated, manual, and assistive-technology coverage are distinguished.
- [ ] Automated findings are manually validated where required.
- [ ] WCAG reports contain all 86 items, including `N/A`, `Not tested`, and `Needs review`.
- [ ] Findings include affected users, criterion or area, severity, evidence, remediation, and residual risk.
- [ ] No unsupported conformance or legal claim is made; names and location are correct.

## Knowledge Sources
- Standard: `references/standards/accessibility-testing-standard.md`
- Checklists: `references/checklists/wcag-2.2-checklist.md`, `accessibility-testing-checklist.md`
- Strategy and tools: `references/accessibility-testing-strategy.md`, `references/accessibility-tools.md`
- Templates: `references/templates/accessibility-report-template.md`, `accessibility-wcag-report-template.md`
- Example: `working-artifacts/accessibility-test-reports/WCAG-Coverage-20260815-220429.md`
- Execution and decisions: [`execution-guide.md`](references/execution-guide.md), [`decision-guide.md`](references/decision-guide.md)

## Related Skills
- `testing-analyze-bug`
- `testing-design-test-case`
- `testing-implement-automation`
- `testing-review-automation`
