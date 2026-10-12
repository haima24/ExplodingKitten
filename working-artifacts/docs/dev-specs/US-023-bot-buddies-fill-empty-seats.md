# Dev spec — US-023 Bot Buddies fill empty seats

| Item | Value |
| --- | --- |
| Story | [US-023](../user-stories/release-1.0.1/US-023-bot-buddies-fill-empty-seats.md) · **Could** · Cards and rules |
| Status | Draft v0.1 (proposed) · [Baseline](README.md) |
| Refs | F-20, OQ-12 |
| Area | `apps/server` (`bots`), `apps/client` (lobby) |

## 1. Goal

The host can add computer players to the lobby. Bots play legal, simple turns and can never see hidden information. Not part of the MVP commitment.

## 2. Technical design

### 2.1 Messages and room rules

- `room.addBot {}` (host, lobby only) adds a member with `isBot = true`, a bot name and avatar from reserved lists, up to `ROOM_CAPACITY`; counts toward `MIN_PLAYERS`. `room.kick` on a bot removes it.
- Bot members are always `connected`, never need tokens, and are never absent (US-058 ignores bots).
- `RoomView.members[].isBot` lets the UI show the text label "Bot".

### 2.2 Bot policy (`apps/server/src/bots/policy.ts`)

- Pure function `chooseAction(view: PlayerView, rng): Action | null`. **It receives only the bot's own `PlayerView`**, so it cannot cheat by construction.
- Rules (one gentle difficulty):
  1. `decision = TREAT_DECISION` → `USE_TREAT`; `REINSERT` → `REINSERT_BOOM` with `RANDOM`; `FAVOR_PICK` → give a random card; `NOPE_WINDOW` → `NOPE` with probability 0.25 when no Nope has been played yet, otherwise `PASS_NOPE` (bots never chain Nopes).
  2. On its turn: with probability 0.3 (`rng`) play Skip if held; otherwise play nothing else (See the Future and Shuffle are optional: play Shuffle with probability 0.2 if held).
  3. Otherwise `DRAW`.
  4. If only unplayable cards are held, `DRAW`.

### 2.3 Scheduler

When the current player (or decider) is a bot, schedule its action after a random delay 800–1500 ms using the injected `Clock`; emit a public notice "{name} is thinking…" (a transient `room.update` flag, not an engine event). Cancel the timer if the state changes first.

### 2.4 Game end

The engine's normal rule applies: the last active player wins, human or bot. If a bot wins, the victory screen names the bot. A room with no connected humans closes after `EMPTY_ROOM_GRACE_MS`.

## 3. Edge cases and errors

- Adding a bot to a full room or during a game: `ROOM_FULL` / `WRONG_ROOM_PHASE`.
- Non-host `room.addBot`: `NOT_HOST`.
- Bot name collisions: suffix rule from US-004.

## 4. Verification

| Check | Level |
| --- | --- |
| `chooseAction` returns only legal actions for random views | U |
| 10,000 all-bot simulated games finish with invariants intact | U |
| Policy signature accepts only `PlayerView` (type-level and import test) | U |
| Scheduler delay bounds with the fake clock | I |
| Lobby labels bots in text; host can add and remove | C |

## 5. Tasks

1. Add bot members and the host messages.
2. Implement `chooseAction` and the scheduler.
3. Add the lobby UI and tests.

## 6. Dependencies and risks

- Depends on US-051, US-055, US-060; touches US-018 – US-020.
- Risk: bots hiding bugs in human flows. Mitigation: E2E uses humans; bots tested only through simulation.
