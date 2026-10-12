# Dev spec — US-026 Host starts a rematch

| Item | Value |
| --- | --- |
| Story | [US-026](../user-stories/release-1.0.1/US-026-host-starts-a-rematch.md) · Must · Victory, leaving, and rematch |
| Status | Draft v0.1 (proposed) · [Baseline](README.md) |
| Refs | F-08, FR-13 |
| Area | `apps/server` (room), `apps/client` (victory, lobby) |

## 1. Goal

After a game the host returns everyone to the lobby in one tap, keeping names and avatars; the host then starts the next game.

## 2. Technical design

### 2.1 Message

`room.rematch {}` (host only, `room.phase = FINISHED`).

Server steps (inside the room queue):

1. Verify host and phase; else `NOT_HOST` / `WRONG_ROOM_PHASE`.
2. Remove members with status `LEFT` or `REMOVED`; free their avatars and names.
3. Reset members to status `LOBBY`; keep names, avatars, join order, and host.
4. Clear `room.game` (no hands, piles, or out markers survive).
5. Remember `previousFirstPlayerId`; the next Start (US-005) sets `firstPlayerId` to the next seat after it.
6. `room.phase = LOBBY`; reset activity timers; `broadcastRoom`.
7. The share link works again until the room is full or started.

### 2.2 `game.end` (host mid-game)

`game.end {}` (US-028) uses the same reset but from `PLAYING`: the game is discarded without a winner and everyone returns to the lobby.

### 2.3 Client

- **Play again** on the victory screen sends `room.rematch`; on the `room.update` with phase `LOBBY` the route shows the lobby (US-055).
- Players see the lobby with "Waiting for {host} to start the game".
- If the lobby is full after removals, the share panel shows "Room full".

## 3. Edge cases and errors

- Non-host `room.rematch`: `NOT_HOST`, no change.
- A player who left is not in the new lobby.
- Disconnected members stay listed as "reconnecting" and keep their seats.
- Host changes between games: rotate the starting player by seat order, skipping departed seats.

## 4. Verification

| Check | Level |
| --- | --- |
| Rematch returns to `LOBBY`, keeps names and avatars, prunes departed members | I |
| No state from the previous game remains (hands, piles, out flags) | I, U |
| Next Start rotates the first player | I |
| Player cannot rematch | I |
| Both contexts show the lobby after Play again | E |

## 5. Tasks

1. Implement `room.rematch` and the shared lobby reset helper (used by `game.end`).
2. Wire the Victory screen button and lobby transition.
3. Add tests.

## 6. Dependencies and risks

- Depends on US-025, US-005, US-055.
- Risk: stale client state after the reset. Mitigation: the store clears `game` on `room.update` with `phase = LOBBY`.
