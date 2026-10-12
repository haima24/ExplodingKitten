---
name: accessibility-execution-guide
description: 'Bundled reference for executing accessibility assessments and recording evidence across automated, manual, and assistive-technology methods.'
---

# Accessibility Execution Guide

1. Read scope, requirements, target conformance level, evidence, and existing findings.
2. Load the applicable WCAG standard, checklist, strategy, tools, template, and example.
3. Record browser, platform, viewport, input method, assistive technology, tool versions, and limitations.
4. Run automated checks with suitable tools such as axe-core, Playwright, Lighthouse, or WAVE for objective, repeatable signals.
5. Complete manual review of meaning, content quality, keyboard behavior, focus, error recovery, dynamic content, visual presentation, and interaction behavior.
6. Complete assistive-technology review when risk, requirements, or selected criteria require it.
7. Manually validate automated findings before confirming them as defects.
8. Classify findings by user impact, journey criticality, severity, affected criterion or area, reproducibility, and remediation priority.
9. For checklist verification, reproduce all 86 WCAG 2.2 checklist items and mark each `Pass`, `Fail`, `N/A`, `Not tested`, or `Needs review`, with method and evidence or rationale.
10. Generate artifacts with the local timestamp `YYYYMMDD-HHmmss`, required names, and output location.