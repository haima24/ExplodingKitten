# Dev spec — US-036 Screen-reader support

| Item | Value |
| --- | --- |
| Story | [US-036](../user-stories/US-036-screen-reader-support.md) · Must · Responsive UI and accessibility |
| Status | Draft v0.1 (proposed) · [Baseline](README.md) |
| Refs | F-12, DAC-21, [UI/UX §F7](../../ui-ux.md#f7-screen-reader-support) |
| Area | `apps/client` (`Announcer`, semantics) |

## 1. Goal

A screen-reader user can follow the lobby and the game through headings, landmarks, accessible names, and concise live announcements, without duplicates.

## 2. Technical design

### 2.1 `Announcer` (single owner of live regions)

- Two visually hidden regions in `AppShell`: `aria-live="polite"` (default) and `aria-live="assertive"` (Exploding Kitten dialogs only).
- API: `announce(text, { priority: 'polite' | 'assertive', key? })`. Dedupe: ignore the same `key` or text within 1 s; clear then set the text on the next frame so repeated messages are re-read.

### 2.2 Event → announcement map

| Source | Text (examples) |
| --- | --- |
| Room events | "{name} joined", "{name} left", "{name} was removed", "{name} is the new host", "Reconnecting…", "Back online" |
| Turn | "It's your turn." / "It's {name}'s turn." |
| Public events | "{name} played {card}", "{name} drew a card", "{name} peeked", "Deck shuffled", "{name} used a Defuse", "{name} is taking a nap" |
| Result | "{name} wins the round" |
| Copy results | "Code copied", "Link copied" |
| Boom dialogs | assertive: dialog title plus first sentence |

Private results (See the Future) are read by the overlay itself in order, not by the live region.

### 2.3 Semantics

- One `h1` per screen; landmarks: `header`, `main`, `nav` where applicable; `lang="en"` on `<html>`.
- Card accessible name: "{name}, {type}. {effect}. {Selected | Not selected}." Type words: "action card" for playable cards, "special card" for Defuse and Exploding Kitten, "cat card" for Cat card.
- Hand: `<ul aria-label="Your hand">`; piles and chips have labels ("Draw pile, 12 cards"; "Pip, 5 cards, active").
- Room code: `aria-label="K, 7, M, 4, Q, X"` (letter by letter).
- Menu open: own hand not in the accessibility tree (`inert` plus not rendered); other players' hands never exist in the page (US-008).
- Action log is `role="log"` with `aria-live="off"` (US-013).

### 2.4 Manual verification

NVDA with Firefox and Chrome, VoiceOver with Safari on macOS and iOS, TalkBack with Chrome on Android; checklist stored with the test assets.

## 3. Edge cases and errors

- Burst of events: queue and merge when more than 3 arrive within 300 ms ("Pip played See the Future and drew a card").
- Dialog open: announcements for the underlying game continue only if they affect the dialog's task.
- Reduced chatter: do not announce the hint when it repeats the last announcement.

## 4. Verification

| Check | Level |
| --- | --- |
| `Announcer` dedupe and priority behaviour | C |
| Event-to-text mapping covers every public event | U |
| Accessible names for cards, piles, chips, code | C |
| Headings and landmarks per screen | A |
| Real screen-reader pass on the core journey | M |

## 5. Tasks

1. Build `Announcer` and the mapping module.
2. Apply semantics to shared components.
3. Add automated checks and the manual checklist.

## 6. Dependencies and risks

- Depends on US-007, US-011; used by nearly every feature.
- Risk: over-announcing. Mitigation: dedupe, merge, and manual review.
