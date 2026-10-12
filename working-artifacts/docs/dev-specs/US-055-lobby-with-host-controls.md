# Dev spec — US-055 Lobby with host controls

| Item | Value |
| --- | --- |
| Story | [US-055](../user-stories/US-055-lobby-with-host-controls.md) · Must · Rooms and lobby |
| Status | Draft v0.1 (proposed) · [Baseline](README.md) |
| Refs | F-18, FR-04, FR-23, DAC-17, DAC-32, [UI/UX §D3](../../ui-ux.md#d3-lobby--m-us-054-us-055) |
| Area | `apps/server` (room), `apps/client` (`features/rooms/LobbyPage`) |

## 1. Goal

Everyone sees who is in the room with live status; the host can remove players, start the game, or close the room; players can leave.

## 2. Technical design

### 2.1 Room view (sent in `room.update`)

```ts
interface RoomView {
  code: string; phase: 'LOBBY'|'PLAYING'|'FINISHED'|'CLOSED'
  hostId: string; capacity: 4
  members: { playerId; name: DisplayName; avatarId; isHost: boolean; connected: boolean
             status: 'LOBBY'|'ACTIVE'|'OUT'|'LEFT' }[]
  idleWarning?: { expiresAt: number }     // US-056
}
```

Never included: tokens, token hashes, IP addresses.

### 2.2 Messages and server rules

| Message | Who | Rule |
| --- | --- | --- |
| `room.kick { playerId }` | host | In `LOBBY` or `PLAYING`. Target must be another member. Sends `room.ended {reason:'REMOVED'}` to the target, adds the token hash to the room's ban list (US-061), removes the member; in a game also applies engine `REMOVE`. Others get `room.update` |
| `room.leave` | any member | In `LOBBY`: remove member, free avatar and name. In `PLAYING`/`FINISHED`: see US-028 and US-027. Host leaving triggers transfer (US-059) |
| `room.close` | host | Any phase except `CLOSED`: broadcast `room.ended {reason:'HOST_CLOSED'}`, delete the room (US-056) |
| `room.start` | host | US-005 |

Every handler checks the sender's role on the server; the client UI is not trusted. A `room.update` is sent within 1 s of any member change.

### 2.3 Client `LobbyPage`

- Layout from UI/UX D3: `ShareRoomPanel` (host, US-054), `PlayerList` (avatar, name, **Host** badge, connection text "online" or "reconnecting"), footer actions.
- **Host:** Remove buttons (accessible name "Remove {name}"), **Start game** (US-005), **Close room**. **Player:** only **Leave room**; text "Waiting for {host} to start the game".
- Remove and Close use `ConfirmDialog` (safe action default-focused): "Remove {name}?" with **Cancel** and **Remove**; "Close the room?" with **Cancel** and **Close room**.
- A removed device receives `room.ended REMOVED`, clears its session, and shows "The host removed you from the room" with **Home**.
- `Room full` banner at 4 members.
- Announcements: "{name} joined", "{name} left".

## 3. Edge cases and errors

- Kick the host or self: rejected (`NOT_HOST`/`INVALID_MESSAGE`).
- Kick during a game: the player's seat becomes out; game continues or ends (US-028).
- A kicked device reusing the link: refused by the ban list (US-061).
- Non-host sending `room.kick`, `room.close`, or `room.start`: `NOT_HOST`, nothing changes.

## 4. Verification

| Check | Level |
| --- | --- |
| `room.update` after join, leave, kick within 1 s | I |
| Host-only handlers reject players | I |
| Kicked token cannot rejoin | I |
| `RoomView` contains no token or IP | I (schema test) |
| Remove and Close confirmations default to the safe action | C |
| Player view has no Start, Remove, Close controls | C |
| Lobby shows the correct statuses in two contexts | E |

## 5. Tasks

1. Define `RoomView` and `room.update` in `protocol`.
2. Implement `kick`, `leave`, `close` handlers and the ban list hook.
3. Build `LobbyPage`, `PlayerList`, `ConfirmDialog` usage.
4. Add announcements and copy keys.
5. Add tests.

## 6. Dependencies and risks

- Depends on US-003, US-006, US-060; uses US-054, US-056, US-059, US-061.
- Risk: lobby changes racing with Start. Mitigation: per-room queue and phase lock (US-005).
