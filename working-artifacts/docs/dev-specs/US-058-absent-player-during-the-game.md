# Dev spec — US-058 Absent player during the game

| Item | Value |
| --- | --- |
| Story | [US-058](../user-stories/US-058-absent-player-during-the-game.md) · Must · Error handling, reliability, connection, and privacy |
| Status | Draft v0.1 (proposed) · [Baseline](README.md) |
| Refs | F-40, FR-24, DAC-34, OQ-15 |
| Area | `apps/server` (`presence`, room), `apps/client` (`AbsentPlayerBanner`) |

## 1. Goal

The game waits briefly for a player whose connection dropped and lets the host move on if they do not return, so no game stalls forever.

## 2. Technical design

### 2.1 Who is being waited for

`decider(state) = pending?.playerId ?? currentPlayerId` while `phase ≠ finished`. Bots are never absent (US-023). The server recomputes `absent` after **every** state change and every presence change.

### 2.2 Absent record

```ts
interface AbsentInfo { playerId: string; since: number; deadlineAt: number; hostMayDecide: boolean }
```

- Created when `decider` is a member with `connected = false`: `since = now`, `deadlineAt = now + RECONNECT_WINDOW_MS`, `hostMayDecide = false`.
- Cleared when the player reconnects (US-043), is eliminated, or the decider changes.
- When `now ≥ deadlineAt` the sweep sets `hostMayDecide = true` and broadcasts.
- Non-decider disconnects only set the chip to "reconnecting" (`room.update`); the game continues.

### 2.3 Message and host decision

- Broadcast `absent.update { absent: AbsentInfo | null, hostId }` to everyone on every change.
- Host sends `game.skipAbsent { playerId, decision: 'WAIT' | 'SKIP' }` (non-hosts get `NOT_HOST`; only valid while `hostMayDecide`).
  - `WAIT`: `deadlineAt = now + 60 s`, `hostMayDecide = false`; asked again later.
  - `SKIP`: engine `SKIP_ABSENT` for the player (`outReason = SKIPPED`): hand and any pending Exploding Kitten go to the discard pile; the favour or decision is cancelled; play continues or the game finishes (US-017, US-025). The member stays in the room as an **out** player; if they return they can watch (US-043).

### 2.4 Client `AbsentPlayerBanner`

- Everyone: "Waiting for {name} to come back…" with the remaining seconds as **text** computed from `deadlineAt − serverNow` (using the clock offset from `hello`); updates once per second; announced politely only when it first appears and when the host may decide.
- Host after the deadline: **Keep waiting** and **Skip {name}**. Others: "Waiting for the host to decide."
- Copy is neutral ("{name}'s connection dropped"); never blames.

## 3. Edge cases and errors

- Host is the absent decider: host transfer happens at the same deadline (US-059) and the new host decides.
- Player reconnects at the same instant as `SKIP`: the queue order decides; if `SKIP` is processed first they return as out.
- Two disconnected players: only the **decider** is counted; the other is handled when they become the decider.
- Pending decisions (Exploding Kitten dialog, favour pick) use the same rule.
- Room expiry still applies (US-056).

## 4. Verification

| Check | Level |
| --- | --- |
| Absent record created only for the decider; cleared on reconnect | I (fake clock) |
| Game continues when a non-decider drops | I |
| `hostMayDecide` flips at 60 s; `WAIT` restarts 60 s | I |
| `SKIP` eliminates, cancels pending states, continues or finishes | I, U |
| Non-host `skipAbsent` rejected | I |
| Banner text, countdown, and host-only buttons | C |
| 70 s offline on the player's turn shows the Skip option on the host | E (US-047) |

## 5. Tasks

1. Implement `decider`, the absent record, and sweep integration.
2. Add `game.skipAbsent`, `absent.update`, and the engine call.
3. Build the banner with the clock-offset countdown.
4. Add tests.

## 6. Dependencies and risks

- Depends on US-043, US-017, US-060; interacts with US-022 and US-059.
- Risk: clock skew in countdowns. Mitigation: server-time offset and countdown display only; the server decides.
