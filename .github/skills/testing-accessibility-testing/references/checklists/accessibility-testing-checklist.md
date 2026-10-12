# Accessibility Testing Checklist

## Scope and Setup

| Check | Status |
|---|---|
| Scope and critical user journeys are defined. | [ ] |
| WCAG version and conformance level are recorded. | [ ] |
| Supported browsers, devices, operating systems, and assistive technologies are recorded. | [ ] |
| Test data, credentials, feature flags, and environment are ready. | [ ] |
| Existing exceptions and known limitations are reviewed. | [ ] |

## Interaction and Semantics

| Check | Status |
|---|---|
| All interactive controls are reachable and usable by keyboard. | [ ] |
| Focus order, visibility, trapping, and restoration are correct. | [ ] |
| Controls expose meaningful names, roles, states, and values. | [ ] |
| Headings, landmarks, lists, tables, and reading order are meaningful. | [ ] |
| Dialogs, menus, tabs, and dynamic content announce and manage focus correctly. | [ ] |
| Forms provide labels, instructions, validation, and accessible error messages. | [ ] |

## Visual and Content Checks

| Check | Status |
|---|---|
| Text and non-text contrast meet the applicable target. | [ ] |
| Information is not conveyed by color alone. | [ ] |
| Content remains usable at required zoom and text-size settings. | [ ] |
| Layout supports required reflow and responsive states. | [ ] |
| Images, icons, media, captions, transcripts, and alternatives are appropriate. | [ ] |
| Motion, timing, flashing, and authentication behavior are accessible. | [ ] |

## Evidence and Reporting

| Check | Status |
|---|---|
| Automated scans were reviewed and relevant findings manually validated. | [ ] |
| Each finding has steps, expected behavior, actual behavior, evidence, and environment. | [ ] |
| Findings map to a success criterion or documented project requirement. | [ ] |
| Severity reflects user impact and journey criticality. | [ ] |
| False positives, not-applicable criteria, limitations, and untested areas are documented. | [ ] |
| Remediation, regression coverage, owner, and follow-up are recorded. | [ ] |
| No unsupported conformance or legal claim is made. | [ ] |
