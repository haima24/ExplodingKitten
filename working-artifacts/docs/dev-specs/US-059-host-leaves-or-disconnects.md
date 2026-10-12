# Dev spec — US-059 Host leaves or disconnects

| Item | Value |
| --- | --- |
| Story | [US-059](../user-stories/release-1.0.1/US-059-host-leaves-or-disconnects.md) · Must · Error handling, reliability, connection, and privacy |
| Status | Draft v0.1 (proposed) · [Baseline](README.md) |
| Refs | F-40, FR-25, DAC-35, OQ-16 |
| Area | `apps/server` (room host logic), `apps/client` (host-dependent UI) |

## 1. Goal

The room keeps working if the host leaves or loses connection: host rights pass to another player, and there is always exactly one host.

## 2. Technical design

### 2.1 Rules (proposed, OQ-16)

| Situation | Behaviour |
| --- | --- |
| Host loses connection | Everyone sees "{host} lost connection". The game continues (if it is the host's turn, US-058 applies). The host keeps host rights if they return within `HOST_AWAY_MS` (60 s) |
| Host away beyond 60 s | Transfer: the new host is the connected member with the earliest `joinedAt` (excluding bots and the old host) |
| Host leaves on purpose (`room.leave`, or leaving the game) | Immediate transfer by the same rule, then the leave proceeds |
| Old host returns after a transfer | Rejoins as a normal player |
| No connected human member for `EMPTY_ROOM_GRACE_MS` (60 s) | Room closes with `EMPTY` (US-056) |
| Host leaves in the lobby | Same transfer rules; the lobby keeps working |

### 2.2 Implementation

- `room.hostAwayDeadline` is set when the host's `connected` becomes false and cleared on return. The sweep triggers `transferHost(room)` at the deadline.
- `transferHost`: pick the successor; set `room.hostId`; broadcast `room.update` (members' `isHost` flags change) and a public notice "{name} is the new host".
- If no successor exists the room is left to the empty-room rule.
- The server holds **one** `hostId`; all host-only handlers check it on every request. A client claiming host status is ignored.
- Host-only data (the share panel, Start, Remove, End game, Skip, Play again, Close room) appears for the new host on the next `room.update` because the client derives it from `room.hostId === me`.

### 2.3 Client

- Toast and announcement for "{name} lost connection" and "{name} is the new host".
- The new host's UI shows host controls without a reload (derived state).
- The old host's controls disappear if they return as a player.

## 3. Edge cases and errors

- Host is also the absent decider: both timers end together; the transfer happens first, so the new host sees **Keep waiting** and **Skip**.
- Two hosts must never exist: transfer is atomic inside the room queue.
- Host removed by themselves via `room.kick`: rejected (cannot kick self).
- A successor who is disconnected is skipped; the next connected member is chosen.

## 4. Verification

| Check | Level |
| --- | --- |
| Return within 60 s keeps host rights | I (fake clock) |
| Transfer after 60 s and on intentional leave; successor rule | I |
| Exactly one host at all times (property test across random sequences) | U, I |
| Spoofed host claims rejected | I |
| New host UI appears; old host demoted | C, E |
| Empty room closes after the grace period | I |

## 5. Tasks

1. Implement `hostAwayDeadline`, `transferHost`, and the empty-room rule.
2. Add notices and client-derived host UI.
3. Add tests.

## 6. Dependencies and risks

- Depends on US-055, US-043, US-060; interacts with US-058, US-056.
- Risk: a policy change to "close when host leaves". Mitigation: the rule is isolated in `transferHost` and one test.
