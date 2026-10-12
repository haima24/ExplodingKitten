# WCAG 2.2 Coverage Assessment: <Scope Name>

## Assessment Context

| Field | Value |
|---|---|
| Scope / pages / process | <Pages, components, or complete process> |
| Standard | WCAG 2.2 |
| Target conformance level | Level A / AA / AAA |
| Technologies relied upon | <HTML, CSS, JavaScript, PDF, etc.> |
| Browsers and platforms | <Supported user agents and operating systems> |
| Assistive technologies | <Screen readers, magnification, voice, switch access> |
| Viewports and input methods | <Desktop, mobile, zoom, keyboard, pointer, touch> |
| Assessment date / timestamp | <YYYY-MM-DD / YYYYMMDD-HHmmss> |
| Assessor | <Name or role> |

## Status Values

Use exactly one status for every criterion:

- `Pass`: Evidence supports that the criterion is satisfied for the assessed scope.
- `Fail`: Evidence shows that the criterion is not satisfied.
- `N/A`: The criterion does not apply; document the rationale.
- `Not tested`: The criterion is in scope but has not been assessed.
- `Needs review`: Evidence is incomplete or requires specialist or manual validation.

## WCAG 2.2 Level Summary

| Conformance level | Criteria at this level | Cumulative criteria required |
|---|---:|---:|
| Level A | 31 | 31 (A) |
| Level AA | 24 | 55 (A + AA) |
| Level AAA | 31 | 86 (A + AA + AAA) |
| **Total** | **86** | **86** |

## Complete WCAG 2.2 Checklist

Retain every row below in the completed report. Do not omit, merge, or summarize criteria. Fill in `Status` and `Evidence / rationale` for every row.

| Criterion | Level | Check | Primary tool or method | Status | Evidence / rationale |
|---|---|---|---|---|---|
| 1.1.1 Non-text Content | A | Non-text content has an equivalent text alternative, with applicable exceptions handled. | axe-core | <Status> | <Evidence / rationale> |
| 1.2.1 Audio-only and Video-only (Prerecorded) | A | Prerecorded audio-only and video-only content has an equivalent alternative. | Manual review | <Status> | <Evidence / rationale> |
| 1.2.2 Captions (Prerecorded) | A | Captions are provided for prerecorded synchronized media. | Manual review | <Status> | <Evidence / rationale> |
| 1.2.3 Audio Description or Media Alternative (Prerecorded) | A | Audio description or a media alternative is provided for prerecorded video. | Manual review | <Status> | <Evidence / rationale> |
| 1.2.4 Captions (Live) | AA | Live synchronized media has captions. | Manual review | <Status> | <Evidence / rationale> |
| 1.2.5 Audio Description (Prerecorded) | AA | Prerecorded synchronized media has audio description. | Manual review | <Status> | <Evidence / rationale> |
| 1.2.6 Sign Language (Prerecorded) | AAA | Sign-language interpretation is provided where required. | Manual review | <Status> | <Evidence / rationale> |
| 1.2.7 Extended Audio Description (Prerecorded) | AAA | Extended audio description is provided where standard pauses are insufficient. | Manual review | <Status> | <Evidence / rationale> |
| 1.2.8 Media Alternative (Prerecorded) | AAA | A media alternative is provided for prerecorded synchronized or video-only media. | Manual review | <Status> | <Evidence / rationale> |
| 1.2.9 Audio-only (Live) | AAA | A meaningful alternative is provided for live audio-only content. | Manual review | <Status> | <Evidence / rationale> |
| 1.3.1 Info and Relationships | A | Information, structure, and relationships are programmatically determinable or available in text. | axe-core | <Status> | <Evidence / rationale> |
| 1.3.2 Meaningful Sequence | A | The reading and interaction sequence preserves meaning. | Playwright DOM assertions | <Status> | <Evidence / rationale> |
| 1.3.3 Sensory Characteristics | A | Instructions do not rely only on shape, color, size, location, orientation, or sound. | Manual review | <Status> | <Evidence / rationale> |
| 1.3.4 Orientation | AA | Content and operation are not restricted to one display orientation unless essential. | Playwright | <Status> | <Evidence / rationale> |
| 1.3.5 Identify Input Purpose | AA | Personal-data input purposes are programmatically identifiable where applicable. | axe-core | <Status> | <Evidence / rationale> |
| 1.3.6 Identify Purpose | AAA | The purpose of interface components, icons, and regions is programmatically identifiable where applicable. | Manual review | <Status> | <Evidence / rationale> |
| 1.4.1 Use of Color | A | Color is not the only visual means of conveying information or identifying controls. | Manual review | <Status> | <Evidence / rationale> |
| 1.4.2 Audio Control | A | Automatically played audio can be paused, stopped, or independently controlled. | Manual review | <Status> | <Evidence / rationale> |
| 1.4.3 Contrast (Minimum) | AA | Text and images of text meet the applicable contrast thresholds. | axe-core | <Status> | <Evidence / rationale> |
| 1.4.4 Resize Text | AA | Text can be resized to 200% without loss of content or functionality. | Playwright | <Status> | <Evidence / rationale> |
| 1.4.5 Images of Text | AA | Images of text are avoided except for permitted exceptions. | Manual review | <Status> | <Evidence / rationale> |
| 1.4.6 Contrast (Enhanced) | AAA | Text and images of text meet the enhanced contrast thresholds. | Contrast analyzer | <Status> | <Evidence / rationale> |
| 1.4.7 Low or No Background Audio | AAA | Prerecorded speech audio has no or sufficiently low background audio. | Manual review | <Status> | <Evidence / rationale> |
| 1.4.8 Visual Presentation | AAA | A mechanism supports the specified visual presentation adjustments. | Manual review | <Status> | <Evidence / rationale> |
| 1.4.9 Images of Text (No Exception) | AAA | Images of text are used only for decoration or essential presentation. | Manual review | <Status> | <Evidence / rationale> |
| 1.4.10 Reflow | AA | Content works at the required narrow viewport and zoom without two-dimensional scrolling, except where essential. | Playwright | <Status> | <Evidence / rationale> |
| 1.4.11 Non-text Contrast | AA | User-interface components, states, and required graphical objects have sufficient contrast. | axe-core | <Status> | <Evidence / rationale> |
| 1.4.12 Text Spacing | AA | No content or functionality is lost when required text-spacing overrides are applied. | Playwright | <Status> | <Evidence / rationale> |
| 1.4.13 Content on Hover or Focus | AA | Additional hover/focus content is dismissible, hoverable, and persistent as applicable. | Playwright | <Status> | <Evidence / rationale> |
| 2.1.1 Keyboard | A | All functionality is operable through a keyboard interface unless the path itself is essential. | Playwright keyboard API | <Status> | <Evidence / rationale> |
| 2.1.2 No Keyboard Trap | A | Focus can be moved away from every component using a keyboard interface. | Playwright keyboard API | <Status> | <Evidence / rationale> |
| 2.1.3 Keyboard (No Exception) | AAA | All functionality is operable through a keyboard without exception. | Playwright keyboard API | <Status> | <Evidence / rationale> |
| 2.1.4 Character Key Shortcuts | A | Single-character shortcuts can be turned off, remapped, or are focus-dependent. | Manual review | <Status> | <Evidence / rationale> |
| 2.2.1 Timing Adjustable | A | User-controlled time limits can be turned off, adjusted, or extended, subject to exceptions. | Playwright | <Status> | <Evidence / rationale> |
| 2.2.2 Pause, Stop, Hide | A | Moving, blinking, scrolling, and auto-updating content can be controlled where required. | Playwright | <Status> | <Evidence / rationale> |
| 2.2.3 No Timing | AAA | Timing is not essential to the activity, except for permitted exceptions. | Manual review | <Status> | <Evidence / rationale> |
| 2.2.4 Interruptions | AAA | Interruptions can be postponed or suppressed except emergencies. | Manual review | <Status> | <Evidence / rationale> |
| 2.2.5 Re-authenticating | AAA | Re-authentication does not cause loss of data. | Playwright | <Status> | <Evidence / rationale> |
| 2.2.6 Timeouts | AAA | Users are warned about inactivity timeouts that may cause data loss, unless the data is preserved for the required duration. | Playwright | <Status> | <Evidence / rationale> |
| 2.3.1 Three Flashes or Below Threshold | A | Content does not flash above the applicable thresholds. | Flash analyzer | <Status> | <Evidence / rationale> |
| 2.3.2 Three Flashes | AAA | Content does not flash more than three times in any one-second period. | Flash analyzer | <Status> | <Evidence / rationale> |
| 2.3.3 Animation from Interactions | AAA | Non-essential motion animation from interaction can be disabled. | Playwright | <Status> | <Evidence / rationale> |
| 2.4.1 Bypass Blocks | A | A mechanism bypasses repeated blocks of content. | axe-core | <Status> | <Evidence / rationale> |
| 2.4.2 Page Titled | A | Pages have descriptive titles. | axe-core | <Status> | <Evidence / rationale> |
| 2.4.3 Focus Order | A | Sequential focus order preserves meaning and operability. | Playwright keyboard API | <Status> | <Evidence / rationale> |
| 2.4.4 Link Purpose (In Context) | A | Link purpose is determinable from link text or programmatic context. | axe-core | <Status> | <Evidence / rationale> |
| 2.4.5 Multiple Ways | AA | More than one way is available to locate pages, except where the page is part of a process. | Manual review | <Status> | <Evidence / rationale> |
| 2.4.6 Headings and Labels | AA | Headings and labels describe topic or purpose. | axe-core | <Status> | <Evidence / rationale> |
| 2.4.7 Focus Visible | AA | Keyboard focus has a visible indicator. | Playwright screenshots | <Status> | <Evidence / rationale> |
| 2.4.8 Location | AAA | Information about the user's location within a set of pages is available. | Manual review | <Status> | <Evidence / rationale> |
| 2.4.9 Link Purpose (Link Only) | AAA | Link purpose is determinable from link text alone. | Manual review | <Status> | <Evidence / rationale> |
| 2.4.10 Section Headings | AAA | Section headings organize content. | axe-core | <Status> | <Evidence / rationale> |
| 2.4.11 Focus Not Obscured (Minimum) | AA | Focused components are not entirely hidden by author-created content. | Playwright screenshots | <Status> | <Evidence / rationale> |
| 2.4.12 Focus Not Obscured (Enhanced) | AAA | No part of a focused component is hidden by author-created content. | Playwright screenshots | <Status> | <Evidence / rationale> |
| 2.4.13 Focus Appearance | AAA | Visible focus indicators meet the required size and contrast, subject to exceptions. | Contrast analyzer | <Status> | <Evidence / rationale> |
| 2.5.1 Pointer Gestures | A | Multipoint or path-based gestures have a single-pointer alternative unless essential. | Manual review | <Status> | <Evidence / rationale> |
| 2.5.2 Pointer Cancellation | A | Pointer actions can be aborted, reversed, or completed on the up-event unless essential. | Playwright mouse API | <Status> | <Evidence / rationale> |
| 2.5.3 Label in Name | A | The accessible name contains the visible label text for labeled controls. | axe-core | <Status> | <Evidence / rationale> |
| 2.5.4 Motion Actuation | A | Motion-operated functionality has a UI alternative and motion can be disabled unless essential. | Manual review | <Status> | <Evidence / rationale> |
| 2.5.5 Target Size (Enhanced) | AAA | Pointer targets meet 44 by 44 CSS pixels unless an exception applies. | Playwright DOM geometry | <Status> | <Evidence / rationale> |
| 2.5.6 Concurrent Input Mechanisms | AAA | Content does not restrict available input modalities unless essential or required. | Manual review | <Status> | <Evidence / rationale> |
| 2.5.7 Dragging Movements | AA | Dragging functionality has a single-pointer alternative unless dragging is essential. | Playwright mouse API | <Status> | <Evidence / rationale> |
| 2.5.8 Target Size (Minimum) | AA | Pointer targets meet 24 by 24 CSS pixels or satisfy an exception. | Playwright DOM geometry | <Status> | <Evidence / rationale> |
| 3.1.1 Language of Page | A | The default human language of each page is programmatically determinable. | axe-core | <Status> | <Evidence / rationale> |
| 3.1.2 Language of Parts | AA | Language changes within content are programmatically determinable, where applicable. | Playwright DOM assertions | <Status> | <Evidence / rationale> |
| 3.1.3 Unusual Words | AAA | A mechanism identifies definitions of unusual or restricted words. | Manual review | <Status> | <Evidence / rationale> |
| 3.1.4 Abbreviations | AAA | A mechanism identifies the expanded form or meaning of abbreviations. | Manual review | <Status> | <Evidence / rationale> |
| 3.1.5 Reading Level | AAA | Supplemental or simpler content is available when advanced reading ability is required. | Readability analyzer | <Status> | <Evidence / rationale> |
| 3.1.6 Pronunciation | AAA | A mechanism identifies pronunciation where meaning would otherwise be ambiguous. | Manual review | <Status> | <Evidence / rationale> |
| 3.2.1 On Focus | A | Receiving focus does not initiate an unexpected change of context. | Playwright keyboard API | <Status> | <Evidence / rationale> |
| 3.2.2 On Input | A | Changing a control setting does not unexpectedly change context unless users were advised. | Playwright | <Status> | <Evidence / rationale> |
| 3.2.3 Consistent Navigation | AA | Repeated navigation mechanisms remain in the same relative order. | Playwright | <Status> | <Evidence / rationale> |
| 3.2.4 Consistent Identification | AA | Components with the same functionality are identified consistently. | axe-core | <Status> | <Evidence / rationale> |
| 3.2.5 Change on Request | AAA | Changes of context occur only by user request or can be disabled. | Playwright | <Status> | <Evidence / rationale> |
| 3.2.6 Consistent Help | A | Repeated help mechanisms occur in the same relative order. | Playwright | <Status> | <Evidence / rationale> |
| 3.3.1 Error Identification | A | Automatically detected input errors identify the item and describe the error in text. | axe-core | <Status> | <Evidence / rationale> |
| 3.3.2 Labels or Instructions | A | Labels or instructions are provided when user input is required. | axe-core | <Status> | <Evidence / rationale> |
| 3.3.3 Error Suggestion | AA | Known correction suggestions are provided unless they would compromise security or purpose. | Manual review | <Status> | <Evidence / rationale> |
| 3.3.4 Error Prevention (Legal, Financial, Data) | AA | Legal, financial, data, or test submissions are reversible, checked, or reviewable. | Playwright | <Status> | <Evidence / rationale> |
| 3.3.5 Help | AAA | Context-sensitive help is available. | Manual review | <Status> | <Evidence / rationale> |
| 3.3.6 Error Prevention (All) | AAA | Submitted information can be reversed, checked, or confirmed. | Playwright | <Status> | <Evidence / rationale> |
| 3.3.7 Redundant Entry | A | Information previously entered in the same process is auto-populated or selectable, unless an exception applies. | Playwright | <Status> | <Evidence / rationale> |
| 3.3.8 Accessible Authentication (Minimum) | AA | Authentication does not require a cognitive function test unless an allowed mechanism or alternative is provided. | Playwright | <Status> | <Evidence / rationale> |
| 3.3.9 Accessible Authentication (Enhanced) | AAA | Authentication meets the enhanced accessible-authentication requirements. | Manual review | <Status> | <Evidence / rationale> |
| 4.1.2 Name, Role, Value | A | User-interface component names, roles, states, properties, and values are programmatically determinable and exposed. | axe-core | <Status> | <Evidence / rationale> |
| 4.1.3 Status Messages | AA | Status messages are programmatically determinable without requiring focus. | NVDA | <Status> | <Evidence / rationale> |

## Conformance Checks

| Requirement | Status | Evidence / rationale |
|---|---|---|
| 5.2.1 Conformance Level | <Status> | All applicable criteria for the selected level are addressed. |
| 5.2.2 Full Pages | <Status> | Full pages, responsive variations, and alternatives are included. |
| 5.2.3 Complete Processes | <Status> | Every page in the complete process is addressed. |
| 5.2.4 Accessibility-Supported Ways of Using Technologies | <Status> | Only accessibility-supported technology uses are relied upon. |
| 5.2.5 Non-Interference | <Status> | Unsupported or non-conforming content does not block page access. |

## Automated Execution Record

| Field | Value |
|---|---|
| Primary tool | <axe-core / Playwright / other> |
| Tool version | <Version> |
| Execution timestamp | <YYYYMMDD-HHmmss> |
| URL or fixture | <URL or file path> |
| Violations | <Count or Not available> |
| Incomplete checks | <Count or Not available> |
| Passed rules | <Count or Not available> |
| Manual validation required | <Yes / No and scope> |

## Findings

| Finding ID | Criterion | Location | Severity | Status | Evidence / remediation |
|---|---|---|---|---|---|
| A11Y-F-001 | <Criterion> | <Page/component/state> | Critical / High / Medium / Low | Open / Fixed / Accepted / Needs review | <Evidence and action> |

## Limitations and Residual Risk

- <Untested combinations, unavailable evidence, exceptions, assumptions, or residual risks>

## Final Recommendation

<Release or remediation recommendation. Do not claim WCAG conformance beyond the assessed evidence.>
