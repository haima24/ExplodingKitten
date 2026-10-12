---
name: accessibility-decision-guide
description: 'Bundled reference for accessibility approach selection, evidence limits, finding confirmation, and escalation decisions.'
---

# Accessibility Decision Guide

- If approach is missing, ask the user to choose `1` WCAG checklist, `2` applicable-area evaluation, or `3` both. Do not begin until selected.
- If standard, conformance level, or scope is missing, request clarification before assigning compliance status.
- If runtime evidence is unavailable, mark execution-dependent checks `Not tested` or `BLOCKED`; never invent results.
- If an automated scan reports a violation, manually validate it before confirming the finding.
- If an automated scan passes, report only that rule as passing; never claim complete WCAG conformance.
- If a criterion or area is not applicable, record `N/A` and rationale.
- Criteria involving meaning, context, usability, or assistive technology require manual review.
- Prioritize barriers blocking critical journeys by user impact even when automated severity is lower.
- Record limited browser, screen-reader, input-method, or viewport coverage as limitation and residual risk.
- Escalate legal or regulatory conclusions to a qualified accessibility or compliance reviewer.
- Route formal test-case documents to `testing-design-test-case`; route confirmed defects to `testing-analyze-bug`.