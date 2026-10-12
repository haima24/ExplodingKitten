# Dev spec — US-056 Room lifetime and data deletion

| Item | Value |
| --- | --- |
| Story | [US-056](../user-stories/US-056-room-lifetime-and-data-deletion.md) · Must · Error handling, reliability, connection, and privacy |
| Status | Draft v0.1 (proposed) · [Baseline](README.md) |
| Refs | F-18, F-15, FR-26, DAC-36, OQ-15 |
| Area | `apps/server` (`roomManager`, timers) |

## 1. Goal

Rooms expire and are fully deleted automatically; nothing about the game lingers.

## 2. Technical design

### 2.1 Deadlines (all from the injected `Clock`)

| Rule | Default |
| --- | --- |
| Lobby idle (`IDLE_LOBBY_MS`) | 30 min since `lastActivityAt` |
| Playing idle (`IDLE_GAME_MS`) | 30 min since the last applied game action |
| Finished (`FINISHED_TTL_MS`) | 15 min after the game ended unless a rematch starts |
| Absolute maximum (`MAX_LIFETIME_MS`) | 3 h since `createdAt` |
| Empty room (`EMPTY_ROOM_GRACE_MS`) | 60 s with no connected human member |
| Warning (`IDLE_WARN_MS`) | 2 min before an **idle** expiry |

`lastActivityAt` is updated by real activity only: room messages from members, game actions, joins, and `room.keepAlive` (below). Heartbeat `ping` does **not** count.

### 2.2 Sweep loop

`roomManager` runs every 1 s: for each room compute the nearest deadline; if reached, close with reason `EXPIRED` (or `EMPTY`). A sweep is cheap (≤ 500 rooms).

### 2.3 Warning and keep-alive

When an idle expiry is `IDLE_WARN_MS` away, set `RoomView.idleWarning = { expiresAt }` and broadcast. The client shows "This room will close soon. Tap anywhere to keep it open." and sends `room.keepAlive {}` on the first pointer or key event; the server then refreshes `lastActivityAt` and clears the warning. The absolute 3 h maximum has no keep-alive; a warning for it reads "This room will close in {n} minutes."

### 2.4 Close procedure (`dispose(room, reason)`)

1. Broadcast `room.ended { reason }` to all connected members.
2. Cancel all timers; revoke tokens; close sockets; remove the room from the map; drop all references (members, game, bans).
3. Write a tombstone `{ code, closedAt, reason }` for `CODE_QUARANTINE_MS` (24 h); the code is not reissued meanwhile (US-061). Tombstones contain no names.
4. Log `room_closed { codeHash, reason, ageMs }` only.

### 2.5 Server restart

On shutdown clients get `SERVER_RESTART`; after a restart all rooms are gone and tombstones are lost, so old codes return `ROOM_NOT_FOUND`; clients show "This room has ended".

### 2.6 Client

`room.ended` handler clears the session and shows the reason text with **Home**: "This room has ended" (`EXPIRED`, `EMPTY`, `SERVER_RESTART`, `ERROR`), "The host closed the room" (`HOST_CLOSED`), "The host removed you from the room" (`REMOVED`), "You joined from another device" (`REPLACED`).

## 3. Edge cases and errors

- Activity at the exact deadline: the sweep re-reads `lastActivityAt`; the later time wins.
- Warning shown, then game action: warning cleared.
- Idle expiry during a decision wait: expiry still applies (no infinite hold).
- Join to a tombstoned code: `ROOM_CLOSED`; no further information.

## 4. Verification

| Check | Level |
| --- | --- |
| Each deadline closes the room with the correct reason (accelerated fake clock) | I |
| Warning at 2 min before idle; keep-alive refreshes | I |
| Absolute maximum ignores keep-alive | I |
| After dispose, no references remain (object-graph or `WeakRef` test) | I |
| Code quarantine for 24 h | I |
| Client shows each reason text | C |
| Expired link shows "This room has ended" | E |

## 5. Tasks

1. Implement deadline calculation, sweep loop, and `dispose`.
2. Add the warning, `room.keepAlive`, and tombstones.
3. Build client reason texts and the warning banner.
4. Add tests.

## 6. Dependencies and risks

- Depends on US-060; used by US-027, US-042, US-059, US-061.
- Risk: leaked timers or references. Mitigation: a single `dispose` and tests for the object graph.
