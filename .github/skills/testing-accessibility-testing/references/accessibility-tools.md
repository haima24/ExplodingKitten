# Accessibility Testing Tools

## Purpose

Use this document as a reference when selecting tools for accessibility testing.

## Playwright + axe-core

Recommended for automated accessibility checks in web automation.

Typical use:

```text
Playwright
   ↓
Open page
   ↓
Run axe-core
   ↓
Collect violations
   ↓
Review results
   ↓
Create defect
```

Good for:

* CI/CD integration
* Regression testing
* Automated WCAG-related checks
* Page-level accessibility scanning

Not sufficient for:

* Complete accessibility assessment
* Meaningful alternative text evaluation
* Keyboard usability
* Screen reader experience
* Overall usability

## Lighthouse

Useful for:

* Quick accessibility checks
* Developer feedback
* CI integration
* Performance and quality checks alongside accessibility

## WAVE

Useful for:

* Visual inspection
* Accessibility issue discovery
* Manual investigation

## Screen Readers

### NVDA

Useful for Windows-based screen-reader testing.

### JAWS

Useful for enterprise environments where JAWS is part of the supported environment.

### VoiceOver

Useful for macOS and iOS accessibility testing.

### TalkBack

Useful for Android accessibility testing.

## Tool Selection Principle

Do not select tools based only on the number of violations they report.

Select tools based on:

* Project requirements
* Supported browsers
* Application technology
* CI/CD integration
* Required WCAG coverage
* Manual testing needs
* Assistive technology requirements

## Important Rule

Automated accessibility tools are testing aids, not replacements for accessibility expertise and manual evaluation.

W3C's Accessibility Conformance Testing (ACT) approach supports the use of defined testing rules across automated and manual methodologies.
