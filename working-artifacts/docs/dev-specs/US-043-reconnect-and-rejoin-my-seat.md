# Dev spec — US-043 Reconnect and rejoin my seat

| Item | Value |
| --- | --- |
| Story | [US-043](../user-stories/US-043-reconnect-and-rejoin-my-seat.md) · Must · Error handling, reliability, connection, and privacy |
| Status | Draft v0.1 (proposed) · [Baseline](README.md) |
| Refs | F-40, FR-21, DAC-29, metric M12 |
| Area | `apps/client` (`ConnectionManager`, banner), `apps/server` (presence, rejoin) |

## 1. Goal

A dropped connection or a reload returns the player to their seat with their current hand, automatically when possible, with clear status.

## 2. Technical design

### 2.1 Client `ConnectionManager`

States: `idle → connecting → online → reconnecting → offline`.

- **Heartbeat:** send `ping` every `HEARTBEAT_MS` (15 s); no `pong` within 10 s counts as lost.
- **Backoff:** on close or loss retry after 0.5, 1, 2, 4, 8 s (cap 8 s) with ±25 % jitter, until `RECONNECT_WINDOW_MS`+10 s (70 s) have passed, then `offline`.
- **On open:** if a session exists, immediately send `room.rejoin { code, token }`; the server answers `room.joined` and a full `game.update` snapshot (no event replay).
- **Requests:** `send(type, payload)` returns a promise settled by `ack` or `error` with `ACK_TIMEOUT_MS` (5 s). Pending requests are rejected when the connection drops; callers re-evaluate from the next snapshot.
- Server time offset is computed from `hello.serverTime` (used by countdowns, US-058).

### 2.2 Session storage

`sessionStorage["wb.session"] = { code, token, playerId }`, written on `room.joined`, cleared on leave, removal, `room.ended`, or `BAD_TOKEN`. The token never appears in URLs or share links. `sessionStorage` survives reloads and restored tabs but not a fully closed browser session; this is intentional (no long-lived identifier). A device that lost its session can only join again as a new member while the room is still in the lobby.

### 2.3 UI

- `ConnectionBanner` (`role="status"`): "Connecting…", "Reconnecting… your cards are safe", "Back online" (auto-dismiss 3 s); actions are inert while not online (US-007).
- `RejoinBanner` on Home (US-001) and a **Rejoin** offer on Join when a session for that code exists (US-006).
- After the window passes without success: "We lost the connection. [Try again] [Home]".

### 2.4 Server `rejoin`

1. Validate `{ code, token }`; look up the room and the member by `SHA-256(token)` using a timing-safe comparison; unknown → `BAD_TOKEN` or `ROOM_NOT_FOUND`/`ROOM_CLOSED`; removed token → `REMOVED`.
2. If another connection is bound to the member, send it `room.ended {reason:'REPLACED'}` (client text: "You joined from another device") and close it; bind the new connection.
3. Mark the member connected, clear their absent timer (US-058), broadcast `room.update` ("reconnecting" → "online").
4. Send `room.joined` and, in a game, `game.update` with the member's own `viewFor` snapshot.
5. A member skipped while away rejoins as an out player and keeps watching (US-058).

## 3. Edge cases and errors

- Session storage unavailable: rejoin cannot work; a plain message says so.
- Token valid but room ended: `ROOM_CLOSED` → "We couldn't find your seat" with Home; nothing else is revealed.
- Duplicate connections from one tab: the newest wins.
- Very short drops: the banner appears only after 1 s to avoid flicker.

## 4. Verification

| Check | Level |
| --- | --- |
| Backoff sequence and window (fake timers) | U |
| Rejoin within 60 s restores seat and hand; snapshot only own data | I |
| Replaced connection is told and closed | I |
| Invalid, removed, and ended tokens give the right errors | I |
| Offline 20 s then online: same seat; context offline emulation | E |
| Reload mid-game returns to the room | E |
| Banner states and inert controls | C |

## 5. Tasks

1. Build `ConnectionManager` with heartbeat, backoff, request/ack.
2. Implement session storage helpers and banners.
3. Implement server `room.rejoin`, presence, and takeover.
4. Add tests including offline emulation.

## 6. Dependencies and risks

- Depends on US-006, US-060; feeds US-058 and US-059.
- Risk: mobile browsers suspending sockets. Mitigation: the heartbeat plus the visibility-change handler (`visibilitychange` triggers an immediate reconnect check).
