# Dev spec — US-063 Turn timer and card sound effects

| Item | Value |
| --- | --- |
| Story | [US-063](../user-stories/release-1.0.2/US-063-turn-timer-and-card-sounds.md) · Should (timer) / Could (sounds) · Gameplay and turn management; Responsive UI and accessibility |
| Release | 1.0.2 |
| Status | Draft v0.1 (implemented) · [Baseline](README.md) |
| Refs | US-007, US-012, US-021, US-038, US-052, US-058, US-062 |
| Area | `packages/engine`, `packages/protocol`, `apps/server`, `apps/client` |

## 1. Goal

Give every turn a time limit that the **server** enforces and every device displays, and give every card its own sound, without breaking the rules that the engine is pure and the server is authoritative. Sound stays optional and off by default.

## 2. Decisions taken for the open questions

The story leaves these open (§12 of the story). The build uses the story's recommendation; each is one change to reverse.

| Q | Question | Implemented |
| --- | --- | --- |
| Q2 | Timeout = draw or pass? | **Auto-draw.** The engine plays the default move for what the player owes |
| Q3 | Timeout inside a decision | Defuse is **used automatically**; the Exploding Kitten is tucked at a **random** position; a Favor gives a **random** card from the giver's hand |
| Q4 | Attack target | None added. Slap sound at play; the next player's chip is highlighted |
| Q5 | Away player | Clock **pauses**; full time again on return |
| Q6 | Sound default | Off |
| Q8 | Stopped card sound | Card sound at play, then Nope, then a fizzle |
| Q9 | Audio source | **Synthesised** with Web Audio. No files, no download |
| Q12 | Default and options | **30 s** default; Off, 15, 30, 60. `TURN_TIMER_SEC` sets the default for new rooms |

## 3. Technical design

### 3.1 Engine (`packages/engine`)

- New server-only action `TIMEOUT` (`ServerAction`). The engine has no clock; the server decides **when**, the engine decides **what**.
- `timeout(state, playerId, rng)` in `game.ts`:

| State | Result |
| --- | --- |
| `pending = null` (turn) | emit `TURN_TIMEOUT {playerId, step: 'TURN'}`, then `draw` |
| `TREAT_DECISION` | emit `TURN_TIMEOUT {step: 'TREAT_DECISION'}`, then `useTreat` |
| `REINSERT` | emit, then `reinsertBoom` with `RANDOM` |
| `FAVOR_PICK` | emit, then `pickFavorCard` with a card chosen by `rng` |
| `NOPE_WINDOW` | `WRONG_PHASE` (never timed out here; it has its own timer, US-062) |

- `playerId` must be the player owed the move (`pending.playerId` or `currentPlayerId`), else `NOT_YOUR_TURN`.
- New public event `TURN_TIMEOUT`. A timeout that draws an Exploding Kitten with no Defuse eliminates the player through the normal path (US-017).
- No new invariants; I1–I8 hold (3,000 simulated games with random timeouts, about 29,000 timeouts).

### 3.2 Protocol (`packages/protocol`)

- `RoomView.turnTimerSec: 0 | 15 | 30 | 60`.
- `RoomView.turnClock?: { playerId: string; deadlineAt: number | null }`. `deadlineAt` is server time in ms; `null` means paused.
- `TURN_TIMER_OPTIONS` (browser-safe, in `types.ts`).
- Client → server `room.settings { turnTimerSec }` (zod literal union). Host only, lobby only; otherwise `NOT_HOST` / `WRONG_ROOM_PHASE`.

### 3.3 Server (`apps/server`)

- `Config.turnTimerDefaultSec` from `TURN_TIMER_SEC` (30 by default, 0 under `TEST_MODE`; must be 0, 15, 30 or 60).
- `Room.turnTimerSec` (copied from the default at creation) and `Room.turn: { key, playerId, deadlineAt, remainingMs } | null`.
- `syncTurnClock(hub, room)` in `gameService.ts` runs after every accepted action, at game start, and from `recomputeAbsent`:

| Condition | Clock |
| --- | --- |
| Timer Off, game not running, owner is a Bot Buddy, or owner has left | none |
| Owner of the move is away (`room.absent`) | paused, no remaining time; a **full** clock starts when they return |
| `NOPE_WINDOW` open | paused; `remainingMs` kept; resumed with that time if the turn key is unchanged |
| New `key` (see below) | armed at `now + X` |
| Same `key` | unchanged (playing a card does not reset the clock) |

- `key` is `TURN:<current>:<turnsPlayed>` or `<pending.kind>:<owner>:<turnsPlayed>`. A new turn, each of the two turns after an Attack, a Defuse step and a Favor step are therefore all fresh clocks. After a Favor the turn gets a fresh clock.
- `room.update` is broadcast whenever the clock changes, so every device has the deadline. Game updates are unchanged.
- The 250 ms sweep calls `expireTurn`, which applies `TIMEOUT` for the clock owner. If the engine rejects it (should not happen), the clock is re-armed for a full interval and a warning is logged, so the sweep never spins.
- `resetToLobby`, `startGame` and room finish clear or re-arm the clock.

### 3.4 Client: timer (`apps/client`)

- `TurnClock.tsx`: `useTurnClock()` (seconds left from the server deadline plus the clock offset, ticks every 250 ms only while running), `CountdownText` (text first, bar second, `data-testid="turn-clock"`), `TurnClockEffects`.
- `CountdownText` appears in the turn banner and in the Defuse, Exploding Kitten position and Favor dialogs. Texts: "You have 24 s", "Pip has 24 s", "Hurry! 5 s left" (≤ 5 s), "Timer paused".
- `TurnClockEffects` (once per clock): polite announcement at 10 s for the player whose turn it is; assertive announcement at 5 s for everyone; at 5 s the warning beep and spoken line on **that player's device only**.
- Lobby: `Choice` radios for the host (`client.setTurnTimer`), read-only line for others.
- `TURN_TIMEOUT` event: log "X ran out of time", toast, announcement, timeout sound.
- Reduced motion: the bar does not animate. No flashing.

### 3.5 Client: sounds

- `lib/audio.ts` (lazy chunk, about 3 KB): one synthesised sound per card plus warning and timeout. Parts are tones (with optional glide) or filtered noise.

| Card | VI name | Sound | Triggered by | Heard by |
| --- | --- | --- | --- | --- |
| Exploding Kitten | Mèo Nổ Tung | `boom`: yowl glide, blast | `BOOM_DRAWN` (drawer); `TREAT_USED` / `PLAYER_OUT(BOOM)` (everyone else) | all |
| Defuse | Gỡ Bom | `defuse`: two snips, chime | `TREAT_USED` | all |
| Skip | Bỏ Qua | `skip`: whoosh and hop | `CARD_PLAYED` | all |
| See the Future | Tiên Tri | `future`: rising shimmer, detuned pair, echo pings | `CARD_PLAYED` | all (never the cards) |
| Shuffle | Xáo Bài | `shuffle`: riffle of clicks | `CARD_PLAYED` | all |
| Cat card | Thẻ Mèo | `cat`: purr | none today (not playable, OQ-06) | — |
| Attack | Vả | `attack`: smack, thump, cartoon wobble | `CARD_PLAYED` | all |
| Favor | Nhờ Vả | `favor`: three rising notes | `CARD_PLAYED` | all |
| Nope | Không! | `nope`: two-buzz "uh-uh" | `NOPE_PLAYED` | all |
| Stopped card | — | `fizzle` | `NOPE_RESOLVED` with `cancelled` | all |
| Turn warning / timeout | — | `warn` (active player), `timeout` (all) | `TurnClockEffects`, `TURN_TIMEOUT` | see text |

- `processGameUpdate` returns `sounds[]`; the client plays up to three **one after another** (`playSequence`). Sounds are skipped while the tab is hidden.
- Master gain follows the **Volume** setting (0–100, default 40 = the previous fixed level).
- Blocked audio: `watchAudio` reports a suspended context; `AudioStatus` shows "Tap to turn on sound". A tap anywhere also unlocks it. Missed sounds are not replayed. Turning sound on does not wait for `resume()` (a browser may hold it until a tap), so the toggle always switches.
- "Sound off" cue: an icon button in the game header (`SoundOffButton`, text on wide screens); it opens Settings.
- Attack: `Processed.flash` highlights the next player's chip for about 1.3 s (`ui.flash`); static outline under reduced motion.

### 3.6 Settings changes

`Settings` gains `volume` (default 40). A new reducer action `settings/patch` merges into the latest settings, so a slow toggle cannot undo a newer change.

## 4. Edge cases and errors

| Case | Behaviour |
| --- | --- |
| Timer Off | No clock, no countdown; behaviour as before |
| Player draws in time | New key; next player gets a full clock |
| Timeout draws a kitten, has Defuse | Defuse used, then a fresh clock for the tuck step; if that times out the kitten is tucked at random |
| Timeout draws a kitten, no Defuse | Player is out (US-017) |
| Attack received | Each of the two turns has a full clock |
| Nope window opens | Clock pauses; resumes with the same remaining time |
| Owner disconnects | Clock paused; US-058 banner; full time on return |
| Bot's turn | No clock |
| Reload or rejoin | Snapshot plus `room.update` carry the deadline; the countdown is not restarted |
| Rematch / end game | Clock cleared |
| Client claims time is up | Not possible: there is no such message |
| Modified client sends `room.settings` | `NOT_HOST` or `WRONG_ROOM_PHASE`; value outside the list fails schema validation |
| Audio blocked / failed | Game continues; text and visual cues remain |
| Two events together | Sounds play in order, at most three |

## 5. Verification

| Check | Level |
| --- | --- |
| `TIMEOUT` plays the right default for turn, Defuse, tuck and Favor; invariants hold over 3,000 games with random timeouts | U (done) |
| `TIMEOUT` rejected for a non-owner and during a Nope window | U |
| Clock arms, pauses for a Nope window, pauses for an away player, restarts on a new key | I (fake clock) |
| Host-only, lobby-only `room.settings`; invalid values rejected | I |
| Lobby control, read-only view, countdown for both players, "Hurry!" at 5 s, timeout log, turn passes, new countdown | E (done, headless Chrome, 15 s) |
| Sounds and voice reach only the right players during a full game with Nope, Attack, Favor, Defuse | E (done) |
| Volume slider, "Sound off" cue, "Tap to turn on sound" | E, M |
| Screen reader: announcement at 10 s and 5 s only | A, M |
| No flashing above 3 per second; reduced motion removes the bar animation and the chip shake | A, M |
| Quality of the synthesised sounds (especially the slap) with 2 children and 1 parent | M (Q7) |

## 6. Tasks (all done unless noted)

1. Engine `TIMEOUT` action and `TURN_TIMEOUT` event, with a simulation run.
2. Protocol: room view fields, `room.settings`.
3. Server: config, room fields, `syncTurnClock`, `expireTurn`, sweep, `room.settings` handler.
4. Client: countdown, warnings, lobby control, dialogs.
5. Audio: sound set, volume, blocked notice, header cue, Attack highlight.
6. Open: server integration tests with a fake clock; real-device listening review (Q7).

## 7. Dependencies and risks

- Depends on US-007, US-012, US-015–US-022, US-038, US-052, US-058, US-060, US-062.
- 5 players: rooms still hold 4 (OQ-13). The timer works for any count the engine supports.
- Risk: an auto-draw can eliminate a child who stepped away. Mitigation: Off and 60 s options; no blame wording; strikes are out of scope (Q10).
- Risk: audio quality of synthesised effects. Mitigation: parts are data, so a recorded set can replace them behind `playSound`.
