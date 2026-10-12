# Dev spec — US-032 Guided first game (coach marks)

| Item | Value |
| --- | --- |
| Story | [US-032](../user-stories/US-032-guided-first-game-coach-marks.md) · Should · Rules and help |
| Status | Draft v0.1 (proposed) · [Baseline](README.md) |
| Refs | F-23, metric M3 |
| Area | `apps/client` (`features/game/CoachMarks`, settings storage) |

## 1. Goal

Up to four short tips during the first game on a device, never blocking controls, shown once, and re-enableable in Settings.

## 2. Technical design

### 2.1 Tips (state machine)

| # | Anchor | Trigger | Text key |
| --- | --- | --- | --- |
| 1 | Hand | First `game.update` of the first game | `tips.hand` "These are your cards." |
| 2 | Deck pile | My first turn starts | `tips.deck` "Tap the deck to draw a card." |
| 3 | A playable card | I select a card for the first time | `tips.select` "Tap Play to use it." |
| 4 | Boom Cat | The first time `BOOM_DRAWN` is received | `tips.boom` "A Treat saves you from a Boom Cat." |

Each tip is shown at most once per device and is dismissed with a button (**Got it**). A tip never covers the control it points at (positioned beside the anchor; on small screens as a strip above the action bar).

### 2.2 Storage

`localStorage["wb.settings"].tipsSeen` (boolean) set when all four are done or the user chooses **Skip tips**. Settings has **Show tips again** (US-038) which resets it. If storage is unavailable (private mode, quota) wrap access in try/catch and keep an in-memory flag: tips then show once per session and no error appears.

### 2.3 Rendering rules

- Tips are not shown while a dialog is open; they appear without animation when reduced motion is on.
- Do not announce tips assertively; they are `role="status"` and are skipped by the hint announcer to avoid double speech with US-031.

## 3. Edge cases and errors

- Joining mid-session with `tipsSeen = true`: no tips.
- Reconnect: tips already shown stay marked (in-memory counter plus storage).
- Tip anchored to an element that is not on screen: skipped, not blocked.

## 4. Verification

| Check | Level |
| --- | --- |
| Tips appear once, in order, with the triggers above | C |
| Dismiss and Skip tips behave; flag persists | C |
| Never overlaps the action bar or the anchor (bounding boxes) | E |
| Storage unavailable: no errors, per-session behaviour | C |
| Show tips again resets | C |

## 5. Tasks

1. Implement the tips state machine and storage wrapper.
2. Build `CoachMark` and anchors.
3. Add Settings toggle and tests.

## 6. Dependencies and risks

- Depends on US-031, US-038.
- Risk: tips crowding small screens. Mitigation: strip layout and maximum one tip at a time.
