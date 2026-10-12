# Dev spec — US-027 Leave the room or close it

| Item | Value |
| --- | --- |
| Story | [US-027](../user-stories/release-1.0.1/US-027-leave-the-room-or-close-it.md) · Must · Victory, leaving, and rematch |
| Status | Draft v0.1 (proposed) · [Baseline](README.md) |
| Refs | F-08, FR-13 |
| Area | `apps/server` (room), `apps/client` (victory, session) |

## 1. Goal

Players can leave when done; the host can close the room. Tokens stop working and the room's data is deleted when it closes.

## 2. Technical design

### 2.1 Messages

| Message | Rule |
| --- | --- |
| `room.leave` (any member, phase `FINISHED` or `LOBBY`) | Member is removed (status `LEFT` is kept only until the next rematch or room close so recap names remain); their token hash is revoked; others receive `room.update` and a public notice "{name} left the room"; the leaver's client clears the session and goes Home |
| `room.close` (host, any phase) | Broadcast `room.ended {reason:'HOST_CLOSED'}` to every connection, revoke all tokens, delete the room (US-056) |
| `room.leave` by the host | Host role transfers first (US-059), then the leave proceeds |

During `PLAYING` the leave path is the game menu (US-028).

### 2.2 Client

- `Leave room` (victory or lobby) → send `room.leave`; clear `sessionStorage["wb.session"]`; navigate `/`.
- **Close room** (host) → `ConfirmDialog` "Close the room?" → `room.close`.
- On `room.ended`: clear the session and show "The host closed the room" with **Home** (copy keyed by reason).
- A used-up token fails later with `BAD_TOKEN`; the client shows "We couldn't find your seat" (US-043).

### 2.3 Resource cleanup (server)

On close: cancel timers, drop member and connection references, write a tombstone `{ code, closedAt, reason }` for `CODE_QUARANTINE_MS` (US-056), and never log member names.

## 3. Edge cases and errors

- Host leaves with no other members: the room closes (reason `EMPTY`).
- Leave by a non-member: `NOT_IN_ROOM`.
- Close by a non-host: `NOT_HOST`.
- A leaver's seat, avatar, and name are free for later joiners in the lobby.

## 4. Verification

| Check | Level |
| --- | --- |
| Leave removes the member, revokes the token, notifies others | I |
| Close deletes the room and notifies all connections | I |
| Old token rejected after leave or close | I |
| Host leave triggers transfer | I |
| Close confirmation and messages | C |
| Contexts: player leaves, host closes, everyone lands Home | E |

## 5. Tasks

1. Implement `room.leave` and `room.close` cleanup and tombstones.
2. Build client handling and copy.
3. Add tests.

## 6. Dependencies and risks

- Depends on US-025, US-059; cleanup rules in US-056.
- Risk: dangling timers after close. Mitigation: timers keyed by room, cleared in one `dispose()`.
