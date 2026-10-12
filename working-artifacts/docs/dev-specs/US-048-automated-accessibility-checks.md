# Dev spec — US-048 Automated accessibility checks

| Item | Value |
| --- | --- |
| Story | [US-048](../user-stories/release-1.0.1/US-048-automated-accessibility-checks.md) · Should · Testing and quality |
| Status | Draft v0.1 (proposed) · [Baseline](README.md) |
| Refs | F-28, metric M6, DAC-22; `.github/skills/testing-accessibility-testing/` |
| Area | `tests/e2e` (a11y specs), CI |

## 1. Goal

Catch obvious accessibility regressions on every change and record a manual pass before each release.

## 2. Technical design

### 2.1 Automated scans

- `a11y.spec.ts` uses `axe-core` through Playwright. Helper `expectNoSeriousViolations(page)` runs with WCAG 2.2 A and AA tags and fails on **serious** or **critical** impacts, printing rule, nodes, and a screenshot.
- Screens and states scanned (one test each): Home (with and without Rejoin banner), Create, Join (with and without errors), Lobby (host and player), Board (my turn, other's turn, card selected, menu open), Exploding Kitten dialog, re-insert picker, See the Future overlay, Nap dialog, Rules tour (each step), Settings, Victory (host and player), connection banner states, error screen.
- Scans run at two viewports (390×844 and 1280×800) and with reduced motion on and off.
- Contrast is also covered by the token unit test (US-037).

### 2.2 Manual checklist (per release)

Recorded in the release folder using the repository's accessibility testing templates:

| Area | Method |
| --- | --- |
| Keyboard-only journey | Manual pass plus the keyboard E2E |
| Screen readers | NVDA with Firefox and Chrome; VoiceOver with Safari (macOS, iOS); TalkBack with Chrome |
| 200 % zoom and 320 px reflow | Manual and viewport tests |
| Text size 150 % | Manual |
| Reduced motion | OS setting and in-app toggle |
| Colour independence | Greyscale review (US-037) |

### 2.3 CI gating

The a11y job is required on pull requests; any serious or critical violation fails the build. Moderate and minor violations are reported as warnings with a tracked allowance list (`a11y-allowlist.json` with justification and expiry).

## 3. Edge cases and errors

- Third-party widgets: none exist; any new dependency is scanned in context.
- Dynamic content: scans run after the state is reached (wait for role and text).
- Automated checks find only part of the issues; the manual pass remains mandatory.

## 4. Verification (of the check)

| Check | Level |
| --- | --- |
| A deliberate low-contrast token change fails the scan or the token test | CI |
| A removed accessible name on a button fails the scan | CI |
| Manual checklist results recorded before release | M |

## 5. Tasks

1. Add the axe helper and the screen/state matrix.
2. Add the CI job and the allowlist mechanism.
3. Write the manual checklist from the repository templates.

## 6. Dependencies and risks

- Depends on US-047 (fixtures); uses US-037.
- Risk: scan gaps for dialogs and overlays. Mitigation: each overlay state is a separate test.
