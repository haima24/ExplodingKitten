# Dev spec — US-025 Victory screen

| Item | Value |
| --- | --- |
| Story | [US-025](../user-stories/US-025-victory-screen.md) · Must · Victory, leaving, and rematch |
| Status | Draft v0.1 (proposed) · [Baseline](README.md) |
| Refs | F-08, DAC-14, [UI/UX §D9](../../ui-ux.md#d9-game-over--victory-screen--m-us-025-us-026-us-027) |
| Area | `packages/engine` (finish), `apps/server` (room phase), `apps/client` (`VictoryScreen`) |

## 1. Goal

When one active player remains, every device shows a kind celebration and the right next actions for its role.

## 2. Technical design

### 2.1 Engine and server

- The engine sets `phase = 'finished'`, `winnerId`, and emits public `GAME_FINISHED { winnerId, stats }` (US-017, US-028, US-058 paths all end here).
- The server reacts to `phase = 'finished'`: `room.phase = FINISHED`, sets the finished expiry (`FINISHED_TTL_MS`, US-056), broadcasts `room.update` and the final `game.update` (the `view` carries `winnerId` and `stats`).
- Exactly one winner: the engine finishes once; later actions get `GAME_FINISHED`.

### 2.2 Client (`features/game/VictoryScreen`)

| Element | Rule |
| --- | --- |
| Headline | "{name} wins the round!" (H1) |
| Recap | List of players who took naps (`outReason` BOOM, SKIPPED, REMOVED, LEFT with wording matching US-013) and stats: turns played, Boom Cats defused (`stats.treatsUsed`) |
| Celebration | `Celebration` component: confetti ≤ 1.2 s; static starburst when reduced motion is on |
| Host actions | **Play again** (US-026) and **Close room** (US-027) |
| Player actions | Text "Waiting for {host} to play again" and **Leave room** |
| Focus | Moves to the headline on arrival; headline announced politely |

Names come from `RoomView.members`; if a member left, the recap uses the name stored on the member record (kept until the room closes).

### 2.3 Reconnect

A device that was offline at the end receives `game.update` with `phase = 'finished'` on rejoin and shows the same screen (US-043).

## 3. Edge cases and errors

- Last two eliminated almost together: the second action fails with `GAME_FINISHED`; one winner only.
- Winner disconnected: screen unchanged for others; the host decides next steps.
- Host disconnected: the host role may transfer (US-059) so someone can start a rematch.

## 4. Verification

| Check | Level |
| --- | --- |
| Single winner in all finishing paths (boom, leave, remove, skip) | U |
| Room phase and expiry set on finish | I |
| Screen shows the right controls for host and player | C |
| Reduced motion shows the static starburst | C |
| Focus and announcement on arrival | C, M |
| Victory visible on all devices; offline device sees it after rejoin | E |

## 5. Tasks

1. Wire `FINISHED` handling in the room.
2. Build `VictoryScreen` and `Celebration`.
3. Add copy and tests.

## 6. Dependencies and risks

- Depends on US-017; leads to US-026, US-027.
- Risk: tone toward eliminated players. Mitigation: copy review.
