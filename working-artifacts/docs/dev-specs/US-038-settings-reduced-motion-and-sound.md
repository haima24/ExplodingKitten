# Dev spec — US-038 Settings: reduced motion and sound

| Item | Value |
| --- | --- |
| Story | [US-038](../user-stories/release-1.0.1/US-038-settings-reduced-motion-and-sound.md) · Must · Responsive UI and accessibility |
| Status | Draft v0.1 (proposed) · [Baseline](README.md) |
| Refs | F-13, DAC-23, [UI/UX §D10](../../ui-ux.md#d10-settings--m-us-038-text-size-s-us-039) |
| Area | `apps/client` (`features/settings`, motion utilities) |

## 1. Goal

Settings for reduced motion (default follows the OS) and sound (off by default, disabled until sound exists), stored on the device only.

## 2. Technical design

### 2.1 Storage (`lib/settings.ts`)

`localStorage["wb.settings"] = { motion: 'system'|'on'|'off', sound: false, textScale: 100|125|150, tipsSeen: boolean }`. All access goes through one module with try/catch; if storage fails the settings apply for the session from an in-memory copy and no error is shown. Values are validated on read (unknown values reset to defaults).

### 2.2 Motion

- Effective reduced motion = `motion === 'on'` or (`motion === 'system'` and `matchMedia('(prefers-reduced-motion: reduce)').matches`). `useReducedMotion()` exposes it and reacts to OS changes.
- The shell sets `data-motion="reduced"` on `<html>`. CSS under `[data-motion="reduced"]` removes confetti, card slides, shuffle and shake animations, parallax, and replaces transitions with ≤ 100 ms cross-fades or none.
- JS animations (Celebration, shuffle, card flight) check `useReducedMotion()` first.
- Safety: no flashing more than 3 times per second (WCAG 2.3.1), regardless of the setting.

### 2.3 Sound

Toggle shown, default off. Until US-052 ships it is rendered disabled with the note "Coming soon". The stored value is respected by the audio module when built.

### 2.4 Settings screen and dialog

`SettingsPanel` is used by the `/settings` route and as a dialog from the game menu. Changes apply immediately and persist. Opening Settings mid-game leaves the game untouched for everyone.

## 3. Edge cases and errors

- Changing the OS setting while the app runs: `system` mode updates live.
- Corrupted stored JSON: reset to defaults silently.
- Settings opened inside the game menu: closing returns to the menu or board.

## 4. Verification

| Check | Level |
| --- | --- |
| Default follows `prefers-reduced-motion` (emulated) | E |
| Override on/off applies immediately and persists | C |
| No confetti, slide, shuffle animation when reduced (computed animation names) | E |
| Sound toggle disabled with note | C |
| Storage failure handled silently | C |
| Corrupted storage resets | U |

## 5. Tasks

1. Build the settings storage module and tests.
2. Add `useReducedMotion` and the `data-motion` attribute with CSS rules.
3. Build `SettingsPanel` with motion, sound, text size (US-039), tips reset (US-032).

## 6. Dependencies and risks

- Depends on US-001; feeds US-020, US-025, US-032, US-039, US-052.
- Risk: forgotten animations. Mitigation: a CSS lint test lists all `@keyframes` and requires a reduced-motion override.
