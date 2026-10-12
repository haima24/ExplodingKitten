# WCAG 2.2 Success Criteria Checklist

## Purpose

Use this checklist to plan and record WCAG 2.2 coverage. It is a test aid, not a substitute for the normative [WCAG 2.2 Recommendation](https://www.w3.org/TR/WCAG22/), its definitions, or the supporting Understanding and How to Meet documents.

## Assessment Context

| Field | Value |
|---|---|
| Scope / pages / process | <Pages, components, or complete process> |
| WCAG version | WCAG 2.2 |
| Target conformance level | Level A / AA / AAA |
| Technologies relied upon | <HTML, CSS, JavaScript, PDF, etc.> |
| Browsers and platforms | <Supported user agents and operating systems> |
| Assistive technologies | <Screen readers, magnification, voice, switch access> |
| Viewports and input methods | <Desktop, mobile, zoom, keyboard, pointer, touch> |
| Assessment date / assessor | <YYYY-MM-DD / name or role> |

## Result Values

Use one result for every applicable criterion:

- `Pass`: Evidence supports that the criterion is satisfied for the assessed scope.
- `Fail`: Evidence shows that the criterion is not satisfied.
- `N/A`: The criterion does not apply; document the rationale.
- `Not tested`: The criterion is in scope but has not been assessed.
- `Needs review`: Evidence is incomplete, contradictory, or requires specialist review.

Automated results must be manually reviewed where the criterion requires human judgment. Do not claim WCAG conformance from this checklist alone.

## WCAG 2.2 Level Summary

| Conformance level | Criteria at this level | Cumulative criteria required | Assessment scope |
|---|---:|---:|---|
| Level A | 31 (A) | 31 (A) | Minimum level; all applicable Level A criteria must be satisfied. |
| Level AA | 24 (AA) | 55 (A + AA) | Requires all applicable Level A and Level AA criteria. |
| Level AAA | 31 (AAA) | 86 (A + AA + AAA) | Requires all applicable Level A, AA, and AAA criteria; use only when explicitly required. |
| **Total** | **86** | **86** | WCAG 2.2 success criteria inventory, excluding removed 4.1.1 Parsing. |

### Recommended target

Use **Level AA** as the default project target unless the project specifies another target. A claim for Level AA requires the applicable Level A and Level AA criteria across the full pages and complete processes in scope. Level AAA criteria may be tracked as enhanced goals, but WCAG does not recommend requiring Level AAA for an entire site or product as a general policy.

## Tool Summary and Checklist Mapping

Use one primary tool or test method to start each criterion. Add manual validation when the criterion depends on meaning, context, usability, or assistive-technology behavior.

The checklist contains 86 WCAG 2.2 success-criteria rows. The removed `4.1.1 Parsing` criterion is not included.

| Primary tool or method | Checklist items |
|---|---:|
| Playwright | 18 |
| axe-core | 16 |
| Manual review | 32 |
| Playwright keyboard API | 5 |
| Playwright DOM assertions | 2 |
| Playwright screenshots | 3 |
| Playwright mouse API | 2 |
| Playwright DOM geometry | 2 |
| Contrast analyzer | 2 |
| Flash analyzer | 2 |
| Readability analyzer | 1 |
| NVDA | 1 |
| **Total checklist rows** | **86** |


## Automation Boundaries

- Automate objective, repeatable checks using the primary tool listed for each criterion.
- Use Playwright and axe-core for CI, page-state, interaction, and regression coverage where applicable.
- Use Lighthouse or WAVE for supplementary discovery, not as the sole conformance assessment.
- Do not automate away review of alternative-text meaning, link purpose, content clarity, focus usability, error usefulness, or screen-reader experience.
- Every automated violation must be manually validated before it becomes a confirmed finding.
- Every automated pass must be reported as a rule result, not as proof of complete WCAG conformance.

## 1. Perceivable

### 1.1 Text Alternatives

| Criterion | Level | Check | Primary tool or method | Result | Evidence / notes |
|---|---|---|---|---|---|
| 1.1.1 Non-text Content | A | Non-text content has an equivalent text alternative, with applicable exceptions handled. | axe-core |  |  |

### 1.2 Time-based Media

| Criterion | Level | Check | Primary tool or method | Result | Evidence / notes |
|---|---|---|---|---|---|
| 1.2.1 Audio-only and Video-only (Prerecorded) | A | Prerecorded audio-only and video-only content has an equivalent alternative. | Manual review |  |  |
| 1.2.2 Captions (Prerecorded) | A | Captions are provided for prerecorded synchronized media. | Manual review |  |  |
| 1.2.3 Audio Description or Media Alternative (Prerecorded) | A | Audio description or a media alternative is provided for prerecorded video. | Manual review |  |  |
| 1.2.4 Captions (Live) | AA | Live synchronized media has captions. | Manual review |  |  |
| 1.2.5 Audio Description (Prerecorded) | AA | Prerecorded synchronized media has audio description. | Manual review |  |  |
| 1.2.6 Sign Language (Prerecorded) | AAA | Sign-language interpretation is provided where required. | Manual review |  |  |
| 1.2.7 Extended Audio Description (Prerecorded) | AAA | Extended audio description is provided where standard pauses are insufficient. | Manual review |  |  |
| 1.2.8 Media Alternative (Prerecorded) | AAA | A media alternative is provided for prerecorded synchronized or video-only media. | Manual review |  |  |
| 1.2.9 Audio-only (Live) | AAA | A meaningful alternative is provided for live audio-only content. | Manual review |  |  |

### 1.3 Adaptable

| Criterion | Level | Check | Primary tool or method | Result | Evidence / notes |
|---|---|---|---|---|---|
| 1.3.1 Info and Relationships | A | Information, structure, and relationships are programmatically determinable or available in text. | axe-core |  |  |
| 1.3.2 Meaningful Sequence | A | The reading and interaction sequence preserves meaning. | Playwright DOM assertions |  |  |
| 1.3.3 Sensory Characteristics | A | Instructions do not rely only on shape, color, size, location, orientation, or sound. | Manual review |  |  |
| 1.3.4 Orientation | AA | Content and operation are not restricted to one display orientation unless essential. | Playwright |  |  |
| 1.3.5 Identify Input Purpose | AA | Personal-data input purposes are programmatically identifiable where applicable. | axe-core |  |  |
| 1.3.6 Identify Purpose | AAA | The purpose of interface components, icons, and regions is programmatically identifiable where applicable. | Manual review |  |  |

### 1.4 Distinguishable

| Criterion | Level | Check | Primary tool or method | Result | Evidence / notes |
|---|---|---|---|---|---|
| 1.4.1 Use of Color | A | Color is not the only visual means of conveying information or identifying controls. | Manual review |  |  |
| 1.4.2 Audio Control | A | Automatically played audio can be paused, stopped, or independently controlled. | Manual review |  |  |
| 1.4.3 Contrast (Minimum) | AA | Text and images of text meet the applicable contrast thresholds. | axe-core |  |  |
| 1.4.4 Resize Text | AA | Text can be resized to 200% without loss of content or functionality. | Playwright |  |  |
| 1.4.5 Images of Text | AA | Images of text are avoided except for permitted exceptions. | Manual review |  |  |
| 1.4.6 Contrast (Enhanced) | AAA | Text and images of text meet the enhanced contrast thresholds. | Contrast analyzer |  |  |
| 1.4.7 Low or No Background Audio | AAA | Prerecorded speech audio has no or sufficiently low background audio. | Manual review |  |  |
| 1.4.8 Visual Presentation | AAA | A mechanism supports the specified visual presentation adjustments. | Manual review |  |  |
| 1.4.9 Images of Text (No Exception) | AAA | Images of text are used only for decoration or essential presentation. | Manual review |  |  |
| 1.4.10 Reflow | AA | Content works at the required narrow viewport and zoom without two-dimensional scrolling, except where essential. | Playwright |  |  |
| 1.4.11 Non-text Contrast | AA | User-interface components, states, and required graphical objects have sufficient contrast. | axe-core |  |  |
| 1.4.12 Text Spacing | AA | No content or functionality is lost when required text-spacing overrides are applied. | Playwright |  |  |
| 1.4.13 Content on Hover or Focus | AA | Additional hover/focus content is dismissible, hoverable, and persistent as applicable. | Playwright |  |  |

## 2. Operable

### 2.1 Keyboard Accessible

| Criterion | Level | Check | Primary tool or method | Result | Evidence / notes |
|---|---|---|---|---|---|
| 2.1.1 Keyboard | A | All functionality is operable through a keyboard interface unless the path itself is essential. | Playwright keyboard API |  |  |
| 2.1.2 No Keyboard Trap | A | Focus can be moved away from every component using a keyboard interface. | Playwright keyboard API |  |  |
| 2.1.3 Keyboard (No Exception) | AAA | All functionality is operable through a keyboard without exception. | Playwright keyboard API |  |  |
| 2.1.4 Character Key Shortcuts | A | Single-character shortcuts can be turned off, remapped, or are focus-dependent. | Manual review |  |  |

### 2.2 Enough Time

| Criterion | Level | Check | Primary tool or method | Result | Evidence / notes |
|---|---|---|---|---|---|
| 2.2.1 Timing Adjustable | A | User-controlled time limits can be turned off, adjusted, or extended, subject to exceptions. | Playwright |  |  |
| 2.2.2 Pause, Stop, Hide | A | Moving, blinking, scrolling, and auto-updating content can be controlled where required. | Playwright |  |  |
| 2.2.3 No Timing | AAA | Timing is not essential to the activity, except for permitted exceptions. | Manual review |  |  |
| 2.2.4 Interruptions | AAA | Interruptions can be postponed or suppressed except emergencies. | Manual review |  |  |
| 2.2.5 Re-authenticating | AAA | Re-authentication does not cause loss of data. | Playwright |  |  |
| 2.2.6 Timeouts | AAA | Users are warned about inactivity timeouts that may cause data loss, unless the data is preserved for the required duration. | Playwright |  |  |

### 2.3 Seizures and Physical Reactions

| Criterion | Level | Check | Primary tool or method | Result | Evidence / notes |
|---|---|---|---|---|---|
| 2.3.1 Three Flashes or Below Threshold | A | Content does not flash above the applicable thresholds. | Flash analyzer |  |  |
| 2.3.2 Three Flashes | AAA | Content does not flash more than three times in any one-second period. | Flash analyzer |  |  |
| 2.3.3 Animation from Interactions | AAA | Non-essential motion animation from interaction can be disabled. | Playwright |  |  |

### 2.4 Navigable

| Criterion | Level | Check | Primary tool or method | Result | Evidence / notes |
|---|---|---|---|---|---|
| 2.4.1 Bypass Blocks | A | A mechanism bypasses repeated blocks of content. | axe-core |  |  |
| 2.4.2 Page Titled | A | Pages have descriptive titles. | axe-core |  |  |
| 2.4.3 Focus Order | A | Sequential focus order preserves meaning and operability. | Playwright keyboard API |  |  |
| 2.4.4 Link Purpose (In Context) | A | Link purpose is determinable from link text or programmatic context. | axe-core |  |  |
| 2.4.5 Multiple Ways | AA | More than one way is available to locate pages, except where the page is part of a process. | Manual review |  |  |
| 2.4.6 Headings and Labels | AA | Headings and labels describe topic or purpose. | axe-core |  |  |
| 2.4.7 Focus Visible | AA | Keyboard focus has a visible indicator. | Playwright screenshots |  |  |
| 2.4.8 Location | AAA | Information about the user's location within a set of pages is available. | Manual review |  |  |
| 2.4.9 Link Purpose (Link Only) | AAA | Link purpose is determinable from link text alone. | Manual review |  |  |
| 2.4.10 Section Headings | AAA | Section headings organize content. | axe-core |  |  |
| 2.4.11 Focus Not Obscured (Minimum) | AA | Focused components are not entirely hidden by author-created content. | Playwright screenshots |  |  |
| 2.4.12 Focus Not Obscured (Enhanced) | AAA | No part of a focused component is hidden by author-created content. | Playwright screenshots |  |  |
| 2.4.13 Focus Appearance | AAA | Visible focus indicators meet the required size and contrast, subject to exceptions. | Contrast analyzer |  |  |

### 2.5 Input Modalities

| Criterion | Level | Check | Primary tool or method | Result | Evidence / notes |
|---|---|---|---|---|---|
| 2.5.1 Pointer Gestures | A | Multipoint or path-based gestures have a single-pointer alternative unless essential. | Manual review |  |  |
| 2.5.2 Pointer Cancellation | A | Pointer actions can be aborted, reversed, or completed on the up-event unless essential. | Playwright mouse API |  |  |
| 2.5.3 Label in Name | A | The accessible name contains the visible label text for labeled controls. | axe-core |  |  |
| 2.5.4 Motion Actuation | A | Motion-operated functionality has a UI alternative and motion can be disabled unless essential. | Manual review |  |  |
| 2.5.5 Target Size (Enhanced) | AAA | Pointer targets meet 44 by 44 CSS pixels unless an exception applies. | Playwright DOM geometry |  |  |
| 2.5.6 Concurrent Input Mechanisms | AAA | Content does not restrict available input modalities unless essential or required. | Manual review |  |  |
| 2.5.7 Dragging Movements | AA | Dragging functionality has a single-pointer alternative unless dragging is essential. | Playwright mouse API |  |  |
| 2.5.8 Target Size (Minimum) | AA | Pointer targets meet 24 by 24 CSS pixels or satisfy an exception. | Playwright DOM geometry |  |  |

## 3. Understandable

### 3.1 Readable

| Criterion | Level | Check | Primary tool or method | Result | Evidence / notes |
|---|---|---|---|---|---|
| 3.1.1 Language of Page | A | The default human language of each page is programmatically determinable. | axe-core |  |  |
| 3.1.2 Language of Parts | AA | Language changes within content are programmatically determinable, where applicable. | Playwright DOM assertions |  |  |
| 3.1.3 Unusual Words | AAA | A mechanism identifies definitions of unusual or restricted words. | Manual review |  |  |
| 3.1.4 Abbreviations | AAA | A mechanism identifies the expanded form or meaning of abbreviations. | Manual review |  |  |
| 3.1.5 Reading Level | AAA | Supplemental or simpler content is available when advanced reading ability is required. | Readability analyzer |  |  |
| 3.1.6 Pronunciation | AAA | A mechanism identifies pronunciation where meaning would otherwise be ambiguous. | Manual review |  |  |

### 3.2 Predictable

| Criterion | Level | Check | Primary tool or method | Result | Evidence / notes |
|---|---|---|---|---|---|
| 3.2.1 On Focus | A | Receiving focus does not initiate an unexpected change of context. | Playwright keyboard API |  |  |
| 3.2.2 On Input | A | Changing a control setting does not unexpectedly change context unless users were advised. | Playwright |  |  |
| 3.2.3 Consistent Navigation | AA | Repeated navigation mechanisms remain in the same relative order. | Playwright |  |  |
| 3.2.4 Consistent Identification | AA | Components with the same functionality are identified consistently. | axe-core |  |  |
| 3.2.5 Change on Request | AAA | Changes of context occur only by user request or can be disabled. | Playwright |  |  |
| 3.2.6 Consistent Help | A | Repeated help mechanisms occur in the same relative order. | Playwright |  |  |

### 3.3 Input Assistance

| Criterion | Level | Check | Primary tool or method | Result | Evidence / notes |
|---|---|---|---|---|---|
| 3.3.1 Error Identification | A | Automatically detected input errors identify the item and describe the error in text. | axe-core |  |  |
| 3.3.2 Labels or Instructions | A | Labels or instructions are provided when user input is required. | axe-core |  |  |
| 3.3.3 Error Suggestion | AA | Known correction suggestions are provided unless they would compromise security or purpose. | Manual review |  |  |
| 3.3.4 Error Prevention (Legal, Financial, Data) | AA | Legal, financial, data, or test submissions are reversible, checked, or reviewable. | Playwright |  |  |
| 3.3.5 Help | AAA | Context-sensitive help is available. | Manual review |  |  |
| 3.3.6 Error Prevention (All) | AAA | Submitted information can be reversed, checked, or confirmed. | Playwright |  |  |
| 3.3.7 Redundant Entry | A | Information previously entered in the same process is auto-populated or selectable, unless an exception applies. | Playwright |  |  |
| 3.3.8 Accessible Authentication (Minimum) | AA | Authentication does not require a cognitive function test unless an allowed mechanism or alternative is provided. | Playwright |  |  |
| 3.3.9 Accessible Authentication (Enhanced) | AAA | Authentication meets the enhanced accessible-authentication requirements. | Manual review |  |  |

## 4. Robust

### 4.1 Compatible

| Criterion | Level | Check | Primary tool or method | Result | Evidence / notes |
|---|---|---|---|---|---|
| 4.1.2 Name, Role, Value | A | User-interface component names, roles, states, properties, and values are programmatically determinable and exposed. | axe-core |  |  |
| 4.1.3 Status Messages | AA | Status messages are programmatically determinable without requiring focus. | NVDA |  |  |

## WCAG 2.2 Conformance Checks

| Requirement | Check | Result | Evidence / notes |
|---|---|---|---|
| 5.2.1 Conformance Level | All required criteria for the claimed A, AA, or AAA level are satisfied. |  |  |
| 5.2.2 Full Pages | The full page, including responsive variations and alternatives, is included in the assessment. |  |  |
| 5.2.3 Complete Processes | Every page in a complete process conforms at the claimed level. |  |  |
| 5.2.4 Accessibility-Supported Ways of Using Technologies | Only accessibility-supported technology uses are relied upon for conformance. |  |  |
| 5.2.5 Non-Interference | Non-conforming or unsupported content does not block access to the rest of the page. |  |  |

## Final Review Checklist

| Check | Result | Evidence / notes |
|---|---|---|
| Automated checks were run with the tool and version recorded. |  |  |
| Automated findings were manually validated before confirmation. |  |  |
| Keyboard-only coverage was completed. |  |  |
| Focus order, visibility, restoration, and obstruction were reviewed. |  |  |
| Screen-reader or other assistive-technology checks were completed where required. |  |  |
| Zoom, text resize, reflow, orientation, contrast, and target-size checks were completed where applicable. |  |  |
| Forms, errors, authentication, dynamic content, dialogs, and status messages were reviewed. |  |  |
| Unsupported combinations, assumptions, false positives, exceptions, and untested areas are documented. |  |  |

## Finding Evidence

For each failed or needs-review criterion, capture:

- Finding ID and page, component, or process step.
- Criterion ID, title, and conformance level.
- User impact and affected interaction or assistive technology.
- Preconditions and reproducible steps.
- Expected and actual behavior.
- Environment, tool/version, and manual verification method.
- Screenshot, recording, accessibility-tree snapshot, screen-reader output, or other evidence.
- Severity, remediation guidance, owner, and regression coverage.

## References

- [WCAG 2.2 Recommendation](https://www.w3.org/TR/WCAG22/)
- [WCAG 2.2 Quick Reference](https://www.w3.org/WAI/WCAG22/quickref/)
- [Understanding WCAG 2.2](https://www.w3.org/WAI/WCAG22/Understanding/)
- [Techniques for WCAG 2.2](https://www.w3.org/WAI/WCAG22/Techniques/)
