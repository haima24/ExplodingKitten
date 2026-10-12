# Dev spec — US-013 Recent-action message log

| Item | Value |
| --- | --- |
| Story | [US-013](../user-stories/release-1.0.1/US-013-recent-action-message-log.md) · Should · Gameplay |
| Status | Draft v0.1 (proposed) · [Baseline](README.md) |
| Refs | F-24 |
| Area | `apps/client` (`features/game/ActionLog`) |

## 1. Goal

A short list of what just happened, built only from **public** events, so players can follow other turns.

## 2. Technical design

### 2.1 Data

The store keeps `game.log: LogEntry[]` (max 10, newest first). Each `game.update` appends entries for its **public** events only; private events (`DRAWN_CARD`, `PEEK_RESULT`, `BOOM_DRAWN`, `FAVOR_RECEIVED`) never create entries.

| Event | Entry text (copy key) |
| --- | --- |
| `CARD_PLAYED` | "{name} played {card}" (`log.played`) |
| `CARD_DRAWN` | "{name} drew a card" (`log.drew`) |
| `PEEKED` | "{name} peeked" |
| `DECK_SHUFFLED` | "{name} shuffled the deck" |
| `TREAT_USED` / `BOOM_TUCKED` | "{name} used a Defuse" / "Exploding Kitten tucked back in" |
| `PLAYER_OUT` | "{name} is taking a nap" (reason `SKIPPED`: "{name} was skipped"; `REMOVED`: "{name} was removed"; `LEFT`: "{name} left the game") |
| `FAVOR_GIVEN` | "{from} gave {to} a card" |
| `GAME_FINISHED` | "{name} wins the round!" |

Names come from the room members; card names from the catalog.

### 2.2 Component

`ActionLog` renders `<ol role="log" aria-live="off">` (so it does not duplicate the live announcements from the `Announcer`). Placement: side panel at ≥ 1024 px; a bottom sheet opened by a **Log** button on smaller screens (opens through the game menu or a header icon with an accessible name).

## 3. Edge cases and errors

- Reconnect: the log is rebuilt only from events after reconnection; earlier entries may be missing (acceptable).
- Rapid events: kept in order of `seq`.
- Names with suffixes (US-004) are displayed as given.

## 4. Verification

| Check | Level |
| --- | --- |
| Public events produce the right entries; private events produce none | U |
| Max 10 entries, newest first | U |
| `role="log"` present and not live-announced | C |
| See the Future entry shows no cards | C |

## 5. Tasks

1. Implement `formatEvent` and the `log` reducer.
2. Build `ActionLog` and its sheet or panel.
3. Add copy keys and tests.

## 6. Dependencies and risks

- Depends on US-011, US-012, US-036; engine events (US-051).
- Risk: showing private data by mistake. Mitigation: formatter has an allow-list of event types.
