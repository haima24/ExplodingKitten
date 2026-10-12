# Dev spec — US-007 Show whose turn it is and each player's status

| Item | Value |
| --- | --- |
| Story | [US-007](../user-stories/release-1.0.1/US-007-show-whose-turn-it-is-and-each-player-s-status.md) · Must · Gameplay |
| Status | Draft v0.1 (proposed) · [Baseline](README.md) |
| Refs | F-04, F-05, DAC-05, [UI/UX §D4, §E1](../../ui-ux.md#e1-turn-indicators-and-player-status) |
| Area | `apps/client` (`features/game`), engine events |

## 1. Goal

A turn banner and player chips that always say whose turn it is, what the player can do, and each player's status, with Draw and Play inert when the player cannot act.

## 2. Technical design

### 2.1 Selectors (pure, in `features/game/selectors.ts`)

| Selector | Returns |
| --- | --- |
| `selectCanAct(state)` | `connection.status === 'online' && game.view.phase === 'turn' && game.view.currentPlayerId === me && !ui.pendingActionId && !ui.menuOpen && !ui.dialog` |
| `selectBanner(state)` | `{ kind: 'MY_TURN' \| 'OTHER_TURN' \| 'WAITING' \| 'OFFLINE', name?, hintKey }` |
| `selectChips(state)` | One entry per player: avatar, name, card count, status (`active`/`waiting`/`out`), connection text, "×2" badge |

`waiting` means not the current player. Names and connection flags come from `room.members`; counts and status from `view.others`.

### 2.2 Components

- `TurnBanner`: H2 text plus hint line (US-031). Copy: `turn.mine` "{name}, it's your turn!", `turn.other` "It's {name}'s turn". Polite live announcement on change (via `Announcer`, US-036), driven by the engine `TURN_STARTED` event.
- `PlayerChip`: avatar 40 px, name, count badge, status icon **and** text ("out", "zzz" badge). The active chip has the accent ring plus a paw badge (never colour alone).
- `PlayerChipRow`: horizontal scroll on phones; the active chip is kept in view; the row never covers the banner (CSS grid row, not overlay).
- Inert state: when `selectCanAct` is false, `ActionBar` buttons get `aria-disabled` and a visible reason ("Wait for {name}" or "Reconnecting…").

## 3. Edge cases and errors

- 4 players and 8+ cards on 320 px: opponents row scrolls; banner stays visible.
- Out player: chip shows out text; banner skips them (the engine never makes them current).
- Connection lost: banner text switches to "Reconnecting…" (US-043); status of others unknown until the next snapshot.
- Pending decision by another player: banner "Waiting for {name}…" from `view.waitingFor`.

## 4. Verification

| Check | Level |
| --- | --- |
| `selectCanAct` truth table (turn, phase, offline, pending, menu) | U |
| Banner text for my turn, other turn, waiting, offline | C |
| Out and active states show text, not colour only | C |
| Announcement on turn change | C |
| 320 px with 4 players: no overlap | E |
| Two contexts show the correct banners | E |

## 5. Tasks

1. Implement selectors and unit tests.
2. Build `TurnBanner`, `PlayerChip`, `PlayerChipRow`.
3. Add copy keys and announcer hookup.
4. Wire inert reasons into `ActionBar` (shared with US-011, US-012).

## 6. Dependencies and risks

- Depends on US-005 (game exists) and US-051 (`TURN_STARTED`); uses US-036, US-043.
- The "×2" badge appears only after US-021.
