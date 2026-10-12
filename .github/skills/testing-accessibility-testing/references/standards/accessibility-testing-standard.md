# Accessibility Testing Standard

## Purpose

Define consistent, evidence-based accessibility testing for interfaces and user journeys.

## Core Principles

- Test accessibility as a user experience and quality concern, not only as a compliance scan.
- Use the project's stated standard and conformance level; do not assume WCAG level.
- Prioritize barriers that block critical journeys or affect many users.
- Record reproducible evidence and distinguish confirmed findings from tool suggestions.
- Test representative pages, components, states, content, and interaction patterns.

The testing strategy defines the testing layers and workflow. This standard defines the minimum coverage and evidence expected within those layers.

## WCAG Coverage

Use the project's target WCAG version and conformance level as the source of truth. Map checks to the applicable success criterion and conformance level when the mapping is known.

| Principle | Coverage examples |
|---|---|
| Perceivable | Text alternatives, captions, contrast, resize, reflow, and non-text content |
| Operable | Keyboard access, focus, timing, seizures, navigation, and input methods |
| Understandable | Labels, instructions, predictable behavior, error identification, and error prevention |
| Robust | Name, role, value, status updates, and assistive-technology interoperability |

## Minimum Coverage

Where applicable, assess:

- Keyboard access, focus order, focus visibility, and focus restoration.
- Programmatic names, roles, states, properties, landmarks, headings, and reading order.
- Form labels, instructions, errors, validation, and status messages.
- Color contrast, non-color cues, text resizing, zoom, reflow, and responsive layouts.
- Dynamic content, dialogs, menus, tables, tabs, carousels, drag actions, and custom controls.
- Images, icons, audio, video, captions, transcripts, and meaningful alternatives.
- Timing, animation, motion, flashing, authentication, and error recovery.
- Browser, operating-system, screen-reader, magnification, voice, and keyboard-only combinations required by the project.

## Evidence Expectations

Every confirmed finding should include the affected page or component, steps, expected and actual behavior, affected users, applicable criterion, environment, evidence, severity, and remediation guidance.

## Conformance Rules

- A page-level automated scan is not evidence of full WCAG conformance.
- A success criterion may require multiple checks across states, content, viewport sizes, and input methods.
- Mark each applicable criterion as `Pass`, `Fail`, `N/A`, `Not tested`, or `Needs review` with supporting evidence.
- Do not mark `N/A` without documenting why the criterion does not apply.
- Record the WCAG version, conformance level, test environment, and limitations in the assessment.
- Escalate legal or regulatory conclusions to a qualified accessibility or compliance reviewer.
