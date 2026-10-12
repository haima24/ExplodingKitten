# Dev spec — US-060 Real-time room server (authoritative)

| Item | Value |
| --- | --- |
| Story | [US-060](../user-stories/release-1.0.1/US-060-real-time-room-server-authoritative.md) · Must (enabler) · Foundation |
| Status | Draft v0.1 (proposed) · [Baseline](README.md) |
| Refs | F-17, FR-06, DAC-06, DAC-37, OQ-07, OQ-20 |
| Area | `apps/server`, `packages/protocol` |

## 1. Goal

A single Node.js process that owns all rooms and games, validates every message, applies actions through the engine, and sends each connected device only its own projection. This spec defines the **server skeleton and message pipeline**; room features are specified in US-003 – US-006, US-054 – US-056, US-058, US-059, US-061.

## 2. Technical design

### 2.1 Modules

| Module | Responsibility |
| --- | --- |
| `gateway` | HTTP server (`/healthz`, `/readyz`), WebSocket upgrade on `/ws`, origin allow-list, framing, heartbeat |
| `connection` | One object per socket: id, remote address, bucket state, bound member (room code, player id) |
| `pipeline` | parse → size check → schema validate → rate limit → route → handler → `ack` or `error` |
| `roomManager` | Map of rooms by code, tombstones, per-IP room counts, sweep loop (1 s) |
| `room` | Room state machine (`LOBBY`, `PLAYING`, `FINISHED`, `CLOSED`), members, host, timers |
| `gameService` | Wraps the engine for a room; builds per-player `game.update`; dedupes action ids |
| `codes`, `limits`, `presence`, `bots` | Code generation (US-061), rate limiters (US-061), connection presence (US-043, US-058), bots (US-023) |
| `config`, `logger`, `clock`, `rngFactory` | Env config; structured logs without names; injected `Clock`; injected `Rng` source |
| `protocol` (package) | Envelope, message schemas, error codes, name and avatar lists, shared types |

### 2.2 Message pipeline

1. Reject frames larger than `MAX_MESSAGE_BYTES` (close with code 1009) and non-text frames.
2. Parse JSON; validate the envelope `{ v, t, id?, p }`; unknown `t` or `v` → `INVALID_MESSAGE`.
3. Validate `p` against the schema for `t` (unknown fields ignored, not trusted).
4. Apply per-connection rate limit (`MSG_RATE`); exceed → `RATE_LIMITED`, repeated → close.
5. Route to the handler. Handlers run **sequentially per room** (one queue per room), so there are no races between, for example, `room.start` and `room.join`.
6. Reply `ack {id}` or `error {id, code}`. State changes then broadcast.

### 2.3 Broadcast

- `broadcastRoom(room)`: sends `room.update` (members, host, phase, capacity, idle warning) to every connected member.
- `broadcastGame(room, events)`: for each connected member sends `game.update { version, view: viewFor(state, id), events: visibleEvents(events, id) }`.
- Disconnected members receive nothing; on rejoin they get a full snapshot (US-043).
- Before sending, in test and non-production builds, a **leak guard** asserts that the serialised payload contains no card id owned by another player or in the draw pile.

### 2.4 Action handling (`game.action`)

- Client payload: `{ actionId, action }` with no player id. The server binds the sender to a member and builds the engine action with that player id.
- Dedupe: keep the last `ACTION_DEDUPE_WINDOW` action ids per player; a repeat returns the original `ack` and is not re-applied.
- After each applied action run `checkInvariants`; on violation log `invariant_violation`, send `room.ended {reason:'ERROR'}`, and close the room.
- Engine errors are returned as `error` with the engine code.

### 2.5 Config and test mode

All defaults are in the [baseline](README.md#24-server-defaults-all-proposed-read-from-config-see-us-060). `TEST_MODE=1` enables a deterministic seed per room, shortened timers, and `/test/clock/advance`. **The process refuses to start when `TEST_MODE` is set and `NODE_ENV=production`.**

### 2.6 Lifecycle

- `SIGTERM`: stop accepting rooms, send `room.ended {reason:'SERVER_RESTART'}`, close sockets, exit.
- Restart loses all rooms (accepted for MVP). Reconnecting clients get `ROOM_NOT_FOUND` and show "This room has ended".

## 3. Edge cases and errors

| Case | Behaviour |
| --- | --- |
| Malformed or oversized message | Generic `error`; connection stays open unless repeated |
| Client claims host, another player, or a hand | Ignored; identity comes only from the bound connection; host actions check `room.hostId` |
| Out-of-order or duplicate messages | Idempotent via action ids; stale turn → engine `NOT_YOUR_TURN` |
| Handler throws | Log without payload, reply `SERVER_ERROR`, keep the room if state is intact, else close with `ERROR` |
| Origin not on the allow-list | Reject the upgrade (403) |

## 4. Verification

| Check | Level |
| --- | --- |
| Create, join, start, play over real WebSockets with 2–4 clients | I |
| Every outbound message scanned in simulated games: no foreign card ids, no draw-pile order, no See the Future of others | I (US-046) |
| Out-of-turn, non-member, and non-host requests rejected with no state change | I |
| Duplicate action ids applied once | I |
| Update reaches all clients within 300 ms p95 locally | I, then P (US-049) |
| Production start refuses `TEST_MODE` | U |
| Oversized, malformed, and flooding frames handled | I |

## 5. Tasks

1. Define envelope, schemas, and error codes in `packages/protocol`.
2. Build the gateway, connection object, and pipeline with limits.
3. Build `roomManager`, `room`, and per-room queues with injected `Clock` and `Rng`.
4. Build `gameService` and the projection broadcast with the leak guard.
5. Add config, logging (no names), health endpoints, and graceful shutdown.
6. Add the in-process test harness (real `ws` clients, fake clock).

## 6. Dependencies and risks

- Depends on US-050 and US-051.
- Risk: single-process capacity. Mitigation: load test (US-049); shared state is a later enhancement.
- Risk: leaking hidden data through a new event. Mitigation: the leak guard and scan test run in CI.
