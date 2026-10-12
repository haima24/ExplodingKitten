# Dev spec — US-034 Touch, mouse, and keyboard parity with large targets

| Item | Value |
| --- | --- |
| Story | [US-034](../user-stories/release-1.0.1/US-034-touch-mouse-and-keyboard-parity-with-large-targets.md) · Must · Responsive UI and accessibility |
| Status | Draft v0.1 (proposed) · [Baseline](README.md) |
| Refs | F-11, F-12, DAC-19 |
| Area | `apps/client` (`components/common`, CSS) |

## 1. Goal

Every interactive element is big enough for small hands and works with touch, mouse, and keyboard, without hover-, long-press-, drag-, or multi-finger-only interactions.

## 2. Technical design

### 2.1 Target rules

- Tokens: `--target-min: 48px`, `--target-primary: 56px`, spacing ≥ `--space-2` (8 px) between adjacent targets.
- All shared controls (`Button`, `IconButton`, radio and checkbox labels, `Card`, chips that are interactive) enforce `min-width` and `min-height` from tokens; small visuals use padding to reach the hit area.
- `Card` in the hand: height ≥ 100 px and visible width ≥ 56 px (US-009).
- Inline text links are avoided in the game UI; where unavoidable they get padded hit areas.

### 2.2 Input rules

- `touch-action: manipulation` on controls to prevent double-tap zoom on game controls.
- Hover styles are cosmetic only; nothing appears only on hover (no tooltips on hover; help is tap-triggered, US-030).
- No action needs long-press, drag, or multi-finger gestures. Swipe in the rules tour is optional with visible buttons.
- Pointer and keyboard share the same handlers (`onClick`, not `onMouseDown`); Enter and Space activate buttons natively because they are real `<button>` elements.

### 2.3 Automated target audit

A Playwright helper `expectTargetsAtLeast(page, 48)` queries all visible interactive elements (`button`, `[role=button]`, `a[href]`, `input`, `select`, `[tabindex=0]`), measures `boundingBox()`, and fails with a list of offenders. Spacing check: adjacent target gaps ≥ 8 px except inside a card fan where visible width ≥ 56 px applies.

## 3. Edge cases and errors

- Overlapped hand cards: the audit uses the visible slice width for overlapped cards.
- Disabled controls still meet size rules.
- Text scaling (US-039) only increases sizes.

## 4. Verification

| Check | Level |
| --- | --- |
| Target size audit on Home, Create, Join, Lobby, Board, Menu, Rules, Settings, Victory | E |
| Primary actions are 56 px high | E |
| Double-tap does not zoom controls | M (device) |
| No hover-only information (touch emulation) | E |
| Mouse and keyboard parity for the core journey | E (US-047) |

## 5. Tasks

1. Add target tokens and enforce them in shared components.
2. Add `touch-action` rules.
3. Build the audit helper and run it in the E2E suite.

## 6. Dependencies and risks

- Depends on US-009, US-050.
- Risk: dense layouts on 320 px. Mitigation: scrollable rows and bottom sheets.
