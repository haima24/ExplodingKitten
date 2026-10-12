# Dev spec — US-039 Text size setting

| Item | Value |
| --- | --- |
| Story | [US-039](../user-stories/US-039-text-size-setting.md) · Should · Responsive UI and accessibility |
| Status | Draft v0.1 (proposed) · [Baseline](README.md) |
| Refs | F-26, DAC-24 |
| Area | `apps/client` (settings, CSS) |

## 1. Goal

Let a player choose 100 %, 125 %, or 150 % text size that applies to every screen without clipping or overlap.

## 2. Technical design

- Setting `textScale` in `wb.settings` (US-038): 100, 125, or 150.
- Apply by setting `--text-scale` on `<html>`; the root font size is `calc(16px * var(--text-scale))`, so every rem-based size scales together (all typography and most spacing already use rem; fixed px layout sizes are not allowed).
- Card and chip sizes derive from rem or `clamp()` so they scale; hand overlap logic is recomputed from container size.
- The setting persists on the device and applies on all screens at load (before first paint, applied in a small boot script served as an external file to comply with CSP, US-042).
- Radio group UI in Settings with labels "Normal", "Bigger", "Biggest", each showing a live sample.

## 3. Edge cases and errors

- 150 % with 8 cards: the hand scrolls; Play and Draw stay reachable (action bar sticky).
- Browser zoom and `textScale` combine; layouts must still pass at 200 % zoom (US-033).
- Storage unavailable: setting applies for the session.

## 4. Verification

| Check | Level |
| --- | --- |
| Selecting a size updates the root variable and persists | C |
| No clipping or overlap at 150 % on 390×844 and 1280×800 for Home, Lobby, Board, Victory | E (overlap and overflow helper) |
| Hand scrolls and actions reachable at 150 % with 8 cards | E |
| Setting applies before first paint (no layout jump) | E (screenshot compare) |

## 5. Tasks

1. Add the setting, the root variable, and the boot-time application.
2. Convert any px sizes in layout to rem or `clamp()`.
3. Add the Settings control and tests.

## 6. Dependencies and risks

- Depends on US-038, US-033.
- Risk: px-based sizes sneaking in. Mitigation: a lint rule flags `px` in layout CSS except for borders, outlines, and tokens.
