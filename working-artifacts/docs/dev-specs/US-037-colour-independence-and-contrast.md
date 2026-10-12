# Dev spec — US-037 Colour independence and contrast

| Item | Value |
| --- | --- |
| Story | [US-037](../user-stories/release-1.0.1/US-037-colour-independence-and-contrast.md) · Must · Responsive UI and accessibility |
| Status | Draft v0.1 (proposed) · [Baseline](README.md) |
| Refs | F-12, DAC-22, [UI/UX §B1, §F3, §F4](../../ui-ux.md#b1-colour-palette) |
| Area | `apps/client` (tokens, components), `tools/` (contrast check) |

## 1. Goal

Meet contrast requirements and never rely on colour alone for state.

## 2. Technical design

### 2.1 Contrast rules

- Text ≥ 4.5:1 (large text ≥ 3:1); UI component boundaries, icons that convey meaning, and focus rings ≥ 3:1 against adjacent colours.
- Text over illustrations sits on a solid plate (`--color-surface` or tinted token) with sufficient contrast.

### 2.2 Token contrast test (`tools/contrast.test.ts`)

A unit test reads `tokens.css`, resolves pairs and asserts minimums:

| Pair | Minimum |
| --- | --- |
| `--color-ink` on `--color-bg` | 4.5 |
| `--color-ink-soft` on `--color-bg` | 4.5 |
| white on `--color-primary`, `--color-boom`, `--color-success`, `--color-info` | 4.5 |
| `--color-ink` on `--color-accent` | 4.5 |
| `--color-border` on `--color-surface` | 3.0 |
| `--color-focus` on `--color-bg` and on `--color-primary` (with halo) | 3.0 |
| disabled text on disabled background | 4.5 |

The test fails the build if any token change breaks a pair (US-048 reuses it).

### 2.3 Non-colour indicators (component rules)

| State | Required non-colour cue |
| --- | --- |
| Active player | Paw badge and bold name, plus ring |
| Selected card | Raised position, check badge, thick outline |
| Unplayable card | Lock or "zzz" badge and reduced saturation, plus text in the detail panel |
| Out player | "zzz" badge and the text "out" |
| Error or success messages | Icon and text |
| Card types | Unique icon silhouette and text label |

### 2.4 Greyscale check

An E2E helper takes a screenshot with a `grayscale(1)` CSS filter on key screens for visual review and basic diff; states must remain distinguishable (manual sign-off).

## 3. Edge cases and errors

- Hover or pressed states must also meet contrast.
- High-contrast theme is a Could item (not in scope).
- Dark mode is not planned.

## 4. Verification

| Check | Level |
| --- | --- |
| Token contrast pairs | U |
| Every state in the table has its non-colour cue | C |
| Axe `color-contrast` on all screens | A |
| Greyscale review | M |

## 5. Tasks

1. Write the contrast test and fix tokens if needed.
2. Add the non-colour cues to components.
3. Add the greyscale helper and the review checklist.

## 6. Dependencies and risks

- Depends on US-050. Palette values are proposed and may change after the first real measurement.
