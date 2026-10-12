# Dev spec — US-006 Player joins a room by link or code

| Item | Value |
| --- | --- |
| Story | [US-006](../user-stories/release-1.0.1/US-006-player-joins-a-room-by-link-or-code.md) · Must · Rooms and lobby |
| Status | Draft v0.1 (proposed) · [Baseline](README.md) |
| Refs | F-19, FR-22, DAC-03, DAC-31, DAC-33 |
| Area | `apps/server` (join), `apps/client` (`/join`, `/join/:code`) |

## 1. Goal

Join from a share link (code prefilled) or by typing a code, with a distinct, friendly message for every failure and no information leak before a successful join.

## 2. Technical design

### 2.1 Message

- Request: `room.join { code, name, avatarId }`.
- Success: `room.joined { playerId, token, isHost: false, room }`; others receive `room.update`.
- Errors: `INVALID_CODE`, `ROOM_NOT_FOUND`, `ROOM_FULL`, `GAME_STARTED`, `ROOM_CLOSED`, `INVALID_NAME`, `INVALID_AVATAR`, `AVATAR_TAKEN`, `ALREADY_IN_ROOM`, `RATE_LIMITED`.

### 2.2 Code normalisation (client and server)

Uppercase; remove spaces and hyphens; the result must match `^[23456789ABCDEFGHJKMNPQRSTVWXYZ]{6}$`, else `INVALID_CODE`. Characters outside the alphabet are **not** auto-corrected (the alphabet has no look-alikes).

### 2.3 Server order of checks

1. Rate-limit by IP and by connection (US-061); failed attempts count.
2. Connection already bound to a member → `ALREADY_IN_ROOM`.
3. Validate code format, then identity (US-004).
4. Look up the room: unknown code → `ROOM_NOT_FOUND`; tombstoned (closed or expired within the quarantine) → `ROOM_CLOSED`.
5. `room.phase = PLAYING` or `FINISHED` with a game → `GAME_STARTED` (the room is locked); `LOBBY` with `ROOM_CAPACITY` members → `ROOM_FULL`.
6. Avatar taken → `AVATAR_TAKEN` with `taken` list.
7. Create the member (token, hash, join order), bind the connection, reply `room.joined`, `broadcastRoom`.

Failure responses use a small randomised delay (100–200 ms) so timing does not distinguish "almost right" codes (US-061). The server reveals nothing about members before step 7.

### 2.4 Client

- `/join`: `CodeInput` (single field, uppercase, paste supported, `autocomplete="off"`, `inputmode="text"`), **Continue**.
- `/join/:code`: the code is prefilled and shown as "Joining room K7M4QX"; the identity step follows (US-004). An invalid code in the link shows the format error and the input.
- If a stored session exists, offer **Rejoin** instead of a new seat (US-043).
- Error copy keys: `join.invalidCode`, `join.notFound` ("We can't find that room. Check the code with your host."), `join.full`, `join.started`, `join.ended`, `join.rateLimited`.
- After success: store the session and navigate to `/room/:code`.

## 3. Edge cases and errors

- Two players join at the same instant: serialised by the room queue; the last seat goes to the first.
- Link opened after the room expired: "This room has ended"; nothing else is shown.
- Lower-case or spaced code pasted: accepted after normalisation.

## 4. Verification

| Check | Level |
| --- | --- |
| Normalisation table (case, spaces, bad characters) | U |
| Each error code reachable and mapped to its copy | I, C |
| Lobby sees "[Name] joined" within 1 s | I |
| No member data in any failure response | I |
| Share link opens Join prefilled; typing a code works | E |
| Wrong code, full, started, closed cases | E (US-047) |
| Rate-limit message after 10 failures in a minute | I |

## 5. Tasks

1. Add `room.join` schema and normalisation helper to `protocol`.
2. Implement the ordered server checks and tombstones.
3. Build `CodeInput` and the join routes.
4. Map errors to copy; add Rejoin offer.
5. Add tests.

## 6. Dependencies and risks

- Depends on US-003, US-004, US-060, US-061.
- Risk: the `AVATAR_TAKEN` response leaks taken avatars to a would-be joiner. Accepted; revisit if the abuse review objects.
