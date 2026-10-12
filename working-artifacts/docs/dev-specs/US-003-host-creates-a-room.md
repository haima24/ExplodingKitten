# Dev spec — US-003 Host creates a room

| Item | Value |
| --- | --- |
| Story | [US-003](../user-stories/release-1.0.1/US-003-host-creates-a-room.md) · Must · Rooms and lobby |
| Status | Draft v0.1 (proposed) · [Baseline](README.md) |
| Refs | F-18, FR-03, DAC-03, OQ-13, OQ-17 |
| Area | `apps/server` (room manager), `apps/client` (`/create`) |

## 1. Goal

A host picks a name and avatar, the server creates a room with a unique code, and the host lands in the lobby holding a rejoin token.

## 2. Technical design

### 2.1 Message

- Request: `room.create { name: { adjective, noun }, avatarId }` (identity rules in US-004).
- Success: `room.joined { playerId, token, isHost: true, room: RoomView }`. `token` is sent **only** in this reply.
- Errors: `INVALID_NAME`, `INVALID_AVATAR`, `ALREADY_IN_ROOM`, `TOO_MANY_ROOMS`, `RATE_LIMITED`, `SERVER_ERROR`.

### 2.2 Server

1. Check limits: active rooms created from this IP < `MAX_ROOMS_PER_IP` (5) and total < `MAX_ROOMS`; else `TOO_MANY_ROOMS`.
2. Reject if the connection is already bound to a member (`ALREADY_IN_ROOM`).
3. Generate a code (US-061), create `Room { code, phase: LOBBY, hostId, members, createdAt, lastActivityAt }`, create the host member (random `playerId`, token, store `SHA-256(token)` only), join order index 0.
4. Register the room; start expiry deadlines (US-056).
5. Bind the connection to the member; reply `room.joined`.
6. Creation is atomic: if any step fails nothing is registered.

### 2.3 Client (`features/rooms/CreateRoomPage`)

- Shows `IdentityStep` (US-004) and the hint `create.grownup` ("Ask a grown-up to be the host"; does not block).
- On submit: disable the button and show a spinner; send `room.create`; on success store `sessionStorage["wb.session"] = { code, token, playerId }` and navigate to `/room/:code`.
- If a stored session exists, show a choice dialog first: "You're already in room {code}. Rejoin it, or leave it first?" with **Rejoin** (US-043) and **Leave it first** (send `room.leave`, clear session, continue).
- On failure show `create.failed` ("We couldn't make a room. Try again.") with **Try again**.

## 3. Edge cases and errors

- Double submit: the client has one in-flight request; the server rejects a second create on a bound connection.
- Connection drops mid-create: no room is created unless the reply was sent; the client may retry safely (the old connection's member, if created, expires with its room).
- No account, email, or age fields exist anywhere in the flow.

## 4. Verification

| Check | Level |
| --- | --- |
| Create returns a valid code, token, host flag, one member | I |
| Only the token hash is stored (inspect room object) | I |
| 6th room from one IP rejected | I |
| Second create on the same connection rejected | I |
| Client stores the session and navigates; shows the error on failure | C |
| Existing-session dialog offers Rejoin or Leave | C |
| Host creates a room and sees the lobby with the code | E |

## 5. Tasks

1. Add `room.create` schema and `room.joined` payload to the protocol.
2. Implement `roomManager.create` with limits and atomic registration.
3. Build `CreateRoomPage` using `IdentityStep`.
4. Add the session helper and the existing-session dialog.
5. Add tests.

## 6. Dependencies and risks

- Depends on US-004, US-060, US-061 (codes and limits); lobby is US-055.
- Risk: a child hosting (OQ-17). Mitigation: copy hint only; rooms are small and host-controlled.
