# Accessibility Testing Strategy

## Objective

Use layered testing because no single method provides complete accessibility coverage.

## Testing Layers

### Layer 1: Automated Accessibility Testing

Use automated tools to detect machine-testable issues.

Examples:

* Missing accessible names
* Some contrast issues
* Invalid ARIA usage
* Missing form labels
* Certain structural issues

Typical tools:

* axe-core
* Playwright + axe-core
* Lighthouse
* WAVE

Automated testing is useful for fast feedback and regression testing.

### Layer 2: Manual Accessibility Testing

Manual testing is required for issues that depend on context and user experience.

Focus on:

* Keyboard operation
* Focus order
* Focus visibility
* Meaningful labels
* Error handling
* Navigation
* Dynamic content
* User interaction
* Content meaning

### Layer 3: Assistive Technology Testing

Use screen readers and other assistive technologies when required by project risk or accessibility requirements.

Examples:

* NVDA
* JAWS
* VoiceOver
* TalkBack

### Layer 4: User Testing

For high-risk products or important accessibility requirements, consider testing with users who have relevant disabilities.

This can reveal usability issues that automated and expert testing may miss.

## Recommended Workflow

```text
Requirements
     ↓
Accessibility Risk Analysis
     ↓
Select WCAG Checklist or Area Assessment
     ↓
Automated Checks
     ↓
Manual Testing
     ↓
Assistive Technology Testing
     ↓
Defect Reporting
     ↓
Fix
     ↓
Regression Testing
     ↓
Accessibility Assessment
```

## Automation Principle

Automate repeatable and objective checks.

Use manual testing for behavior that requires human judgment.

For example:

| Test Area                   | Automation | Manual   |
| --------------------------- | ---------- | -------- |
| Missing accessible name     | ✅          | Optional |
| Basic ARIA violations       | ✅          | Review   |
| Color contrast              | ✅          | Review   |
| Keyboard navigation         | ⚠️         | ✅        |
| Focus order                 | ⚠️         | ✅        |
| Meaning of alternative text | ❌          | ✅        |
| Error message usefulness    | ❌          | ✅        |
| Screen reader experience    | ❌          | ✅        |
| Page language attribute     | ✅          | Optional |
| Dynamic content behavior    | ⚠️         | ✅        |

## Regression Strategy

For every accessibility defect fixed:

1. Add or update an automated test where practical.
2. Document manual regression verification when automation cannot verify the behavior.
3. Execute the relevant accessibility regression suite.
4. Verify that the fix did not introduce new accessibility problems.

## Readiness Criteria

An accessibility assessment can be considered ready when:

* Applicable accessibility requirements have been identified.
* Relevant automated checks pass.
* Required manual accessibility reviews pass.
* Critical accessibility defects are resolved.
* Required assistive technology testing is completed.
* Regression testing is completed.
* Evidence is available for significant findings.

Do not equate this checklist with formal WCAG conformance unless the required conformance evaluation has been performed.
