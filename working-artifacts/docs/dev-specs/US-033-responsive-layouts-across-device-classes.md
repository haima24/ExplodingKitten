# Dev spec — US-033 Responsive layouts across device classes

| Item | Value |
| --- | --- |
| Story | [US-033](../user-stories/release-1.0.1/US-033-responsive-layouts-across-device-classes.md) · Must · Responsive UI and accessibility |
| Status | Draft v0.1 (proposed) · [Baseline](README.md) |
| Refs | F-11, DAC-18, DAC-24, [UI/UX §C](../../ui-ux.md#c-responsive-behaviour) |
| Area | `apps/client` (layout CSS, `AppShell`, dialogs) |

## 1. Goal

One codebase that is comfortable on phones (portrait and landscape), tablets, and desktops, with no horizontal page scroll (the hand excepted) and no overlap.

## 2. Technical design

### 2.1 Breakpoints (CSS custom media or constants)

| Class | Rule |
| --- | --- |
| Mobile portrait | default (mobile-first), 320–599 px |
| Mobile landscape | `(orientation: landscape) and (max-height: 500px)` |
| Tablet | `min-width: 600px` |
| Desktop | `min-width: 1024px` |

### 2.2 Layout rules

- Root height uses `100dvh` with a `100vh` fallback; `env(safe-area-inset-*)` padding on the shell and the fixed action bar.
- Game board is a CSS grid with named areas: `header`, `players`, `banner`, `piles`, `hand`, `actions` (portrait stack); landscape and desktop variants rearrange areas per the UI/UX layout matrix.
- Card sizes come from container queries on the hand container (US-009); piles scale with `clamp()`.
- Dialogs: **bottom sheet** (full width, ≤ 85 % height, internal scroll) at mobile portrait; centred modal (560–720 px) at ≥ 600 px; max-height 90 % in landscape.
- Rotation preserves state because layout is CSS only; selected card, open dialogs, and scroll positions live in React state and are not reset by resize.
- No fixed-pixel layout widths; text uses rem so zoom and text-size scaling work (US-039).
- Viewports shorter than 360 px: the board scrolls vertically; no "rotate your device" blocker.

### 2.3 Verification matrix (viewports)

`320×568`, `390×844`, `844×390`, `768×1024`, `1280×800`, `1920×1080`, plus 200 % zoom at `1280×800` (effective 640 px).

## 3. Edge cases and errors

- Dynamic mobile toolbars: use `dvh`; the action bar is `position: sticky` within the shell, not `fixed` over content, so it is never hidden by toolbars.
- Very long names with suffixes: ellipsis with the full name in the accessible name.
- Landscape phones: players column at the left edge; hand and actions on the right.

## 4. Verification

| Check | Level |
| --- | --- |
| No horizontal scroll (excluding the hand), no overlapping controls, all actions reachable on every viewport, for every screen | E (viewport matrix, bounding-box overlap check) |
| Rotation mid-game keeps selection and dialogs | E |
| 200 % zoom usable | E, M |
| Dialog presentation per class | E |
| Axe on the board at two viewports | A |

## 5. Tasks

1. Define breakpoint constants and layout grid CSS.
2. Implement `AppShell` safe-area and dynamic-viewport handling.
3. Implement dialog presentation switch.
4. Add the Playwright viewport matrix and overlap helper.

## 6. Dependencies and risks

- Depends on US-050 and the screen specs (US-001, US-007, US-009, US-010, US-055).
- Risk: overlap bugs found late. Mitigation: automated overlap check in the viewport matrix from the first screen.
