# Dev spec — US-031 Contextual "what now" hints

| Item | Value |
| --- | --- |
| Story | [US-031](../user-stories/US-031-contextual-what-now-hints.md) · Must · Rules and help |
| Status | Draft v0.1 (proposed) · [Baseline](README.md) |
| Refs | F-09, DAC-05 |
| Area | `apps/client` (`selectHint`, `TurnBanner`) |

## 1. Goal

A one-line hint under the turn banner that always says the next useful action, announced once per change.

## 2. Technical design

### 2.1 `selectHint(state)` (pure)

Returns a copy key (and params) by the first matching rule:

| # | Condition | Hint (≤ 12 words) |
| --- | --- | --- |
| 1 | Offline or reconnecting | "Reconnecting… your cards are safe." |
| 2 | My decision pending: Treat | "Use your Treat to calm the Boom Cat." |
| 3 | My decision pending: re-insert | "Pick where to tuck the Boom Cat in." |
| 4 | My decision pending: favour | "Pick a card to give." |
| 5 | Waiting for someone else's decision | "Waiting for {name}…" |
| 6 | My turn, card selected and playable | "Tap Play to use {card}." |
| 7 | My turn, I already played Peek or Shake Up this turn | "You can play another card, or draw to end your turn." |
| 8 | My turn | "Play a card or tap the deck to draw." |
| 9 | Another player's turn | "It's {name}'s turn." |
| 10 | Out | "Cheer the others on!" |

"Already played this turn" is derived from the last public events by me since `TURN_STARTED`.

### 2.2 Announcing

The `Announcer` receives the hint text only when the **key or params change** (no repeats for unchanged content). Hints are plain text, ≤ 12 words, enforced by a copy-catalog test.

### 2.3 Boundaries

Hints are not coach marks (US-032). The Boom Cat dialogs state their own next step in their text.

## 3. Edge cases and errors

- Multiple rules match: first match wins (table order).
- Names with suffixes are inserted as plain text.
- Hint during the game menu: still computed; the banner is behind the dialog.

## 4. Verification

| Check | Level |
| --- | --- |
| Truth table for rules 1–10 | U |
| Word count ≤ 12 for every hint key | U |
| Announcer called once per change; not repeated for the same text | C |
| Hint visible on the banner in each state | C |

## 5. Tasks

1. Implement `selectHint` and tests.
2. Add copy keys and the word-count test.
3. Hook into `TurnBanner` and the announcer.

## 6. Dependencies and risks

- Depends on US-007, US-011; uses US-036.
- Risk: rules drifting from game flow. Mitigation: table tests per game state.
