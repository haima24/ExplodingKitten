# Dev spec — US-035 Keyboard operation and visible focus

| Item | Value |
| --- | --- |
| Story | [US-035](../user-stories/US-035-keyboard-operation-and-visible-focus.md) · Must · Responsive UI and accessibility |
| Status | Draft v0.1 (proposed) · [Baseline](README.md) |
| Refs | F-12, DAC-20, WCAG 2.4.7, 2.4.11, 2.1.1, 2.1.4 |
| Area | `apps/client` (focus styles, dialogs, hand, shortcuts) |

## 1. Goal

The whole journey (Home, Create or Join, lobby, game, victory) works with a keyboard only, with a clearly visible focus indicator and no traps.

## 2. Technical design

### 2.1 Focus indicator

Global `:focus-visible` style: 3 px solid `--color-focus` outline with a 2 px white halo (`box-shadow`), offset 2 px; visible on every background; never removed with `outline: none` without a replacement. Sticky bars use `scroll-padding` so a focused element is not hidden behind them (WCAG 2.4.11).

### 2.2 Dialogs

Use native `<dialog>` with `showModal()`: focus moves into the dialog (first logical control, or the safe action for confirmations), focus is trapped by the browser, Escape closes (except forced-choice dialogs), and on close focus returns to the invoking element (store `document.activeElement` before opening).

### 2.3 Hand and lists

Roving tabindex in the hand (US-009): arrows, Home, End; Enter or Space selects; Tab moves on to the action bar. Lists of buttons (player list, avatars as a radio group) follow native radio-group behaviour (arrow keys).

### 2.4 Tab order

Header (Menu, Help, connection) → banner (non-focusable) → player chips (non-focusable unless interactive) → deck → hand → action bar. The DOM order matches the visual order; no positive `tabindex`.

### 2.5 Shortcuts (optional, UQ-05)

If implemented: `D` draw, `P` play selected, `?` help, `Esc` menu or close. Active only when no text field has focus and no dialog is open; documented in Help; can be disabled by a Settings toggle (WCAG 2.1.4). Omitted from the MVP if the toggle is not built.

## 3. Edge cases and errors

- Forced-choice dialogs: Escape does nothing; there is always a focusable primary button.
- After a dialog closes because the underlying element disappeared (for example a played card), focus goes to the nearest card or the action bar.
- Skip link to the main content at the top of every page.

## 4. Verification

| Check | Level |
| --- | --- |
| Full keyboard-only journey completes | E (US-047 keyboard variant) |
| Focus indicator ≥ 3:1 contrast, ≥ 2 px, not obscured by sticky bars | E (computed style, screenshot), M |
| Dialog focus in, trap, return | C |
| Roving tabindex behaviour | C |
| No keyboard traps outside dialogs | E |
| Shortcuts inactive in text fields (if built) | C |

## 5. Tasks

1. Add global focus styles and `scroll-padding`.
2. Build a `Dialog` wrapper with focus return.
3. Verify tab order per screen; add the skip link.
4. Add tests and the keyboard E2E variant.

## 6. Dependencies and risks

- Depends on US-009, US-011.
- Risk: custom components breaking native behaviour. Mitigation: native elements first.
