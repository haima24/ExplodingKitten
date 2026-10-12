# Dev spec — US-066 Pick a card from a fanned-out hand

| Item | Value |
| --- | --- |
| Story | [US-066](../user-stories/release-1.0.2/US-066-pick-a-card-from-a-fanned-hand.md) · Should · Cards and game rules (interaction) |
| Release | 1.0.2 |
| Status | Draft v0.1 (implemented) · [Baseline](README.md) |
| Refs | US-022, US-058, US-062, US-063, US-064, US-065 |
| Area | `packages/engine`, `packages/protocol`, `apps/server`, `apps/client` |

## 1. Goal

After a Cat card pair stands, the taker sees the target's cards fanned out **face down**, sweeps across them, and chooses one to take. Everyone else watches the fan and the taker's finger move. The server turns the chosen position into the real card, so no card identity reaches a client before the take.

## 2. Decisions

| Q | Question | Implemented |
| --- | --- | --- |
| Q1 | Do others see the finger live? | **Yes** (product owner): about 5 updates a second, from the taker only |
| Q2 | Timeout | The server picks a random slot (the engine's `TIMEOUT`) |
| Q3 | Time limit | The host's **Turn timer** setting (US-063): a fresh clock for the pick; with the timer Off there is no limit |
| Q4 | Reshuffle | The slot order is shuffled by the server for every steal |
| Q5 | Favor | Unchanged (the target chooses) |
| Q6 | Confirm | Highlight first, then **Take this card** (or Enter): lifting a finger never takes |
| Q8 | US-065 | AC12, AC13 and BR03 updated |

## 3. Technical design

### 3.1 Engine

- New pending state `STEAL_PICK { playerId (taker), targetId, order: string[] }`. `order` holds the target's card ids in a fresh random order. It lives only in the server's game state; **it is never sent to any client**.
- `effects.ts`, case `COZY_CAT`: when the pair stands and the target is still active with at least one card, the engine builds `order` with `shuffle` and the injected `Rng`, sets `phase = 'decision'`, and emits public `STEAL_STARTED { thiefId, targetId, count }`. If the target is gone or empty the pair ends quietly (as before).
- New player action `PICK_STEAL { position }`. `pickSteal` checks: a `STEAL_PICK` is pending (`WRONG_PHASE`), the sender is the taker (`NOT_YOUR_TURN`), `position` is an integer in `0 … order.length - 1` (`INVALID_POSITION`). Then it moves the card at `order[position]` from the target's hand to the taker's, clears the pending state, returns to `phase = 'turn'`, and emits public `CARD_STOLEN { fromId, toId }` and private `STOLEN_CARD { card }` to the taker.
- `TIMEOUT` (US-063): for `STEAL_PICK` it calls `pickSteal` with `rng.nextInt(order.length)` after emitting `TURN_TIMEOUT { step: 'STEAL_PICK' }`.
- Elimination: if the taker or the target leaves, is removed or skipped, the pending state is cleared and nothing is taken.
- `viewFor`: public `steal { thiefId, targetId, count }` for everyone; `decision { kind: 'STEAL_PICK', targetId, count }` for the taker only. `waitingFor` is the taker, so the absent-player rule (US-058) and the turn clock (US-063) apply with no change.
- No new invariant: only the pending state is new, and cards still only move between hands (card conservation, unique ids, `phase = decision` iff `pending`).

### 3.2 Protocol and server

- `game.action` accepts `{ type: 'PICK_STEAL', position }` (integer 0–99).
- New client → server message `game.hover { position: number | null }` (no reply expected) and server → client `game.hover { playerId, position }`.
- `onHover` relays only if the sender is the taker of the current `STEAL_PICK` and `position` is within the fan; everyone else's hover messages are ignored. It sends to every other connected member. It stores nothing and is covered by the per-connection message rate limit. After a reconnect the watcher simply sees no highlight until the next move.
- Bots (`bots.ts`) answer a `STEAL_PICK` decision with a random position, after the usual bot delay (about 1 to 1.5 s).
- The turn clock needs no change: the pending owner is the taker, so a new `STEAL_PICK:<taker>:<turn>` key arms a full clock; if the taker is disconnected the clock pauses and US-058 applies.

### 3.3 Client

- `features/game/StealFan.tsx`:
  - `Fan`: face-down cards in an arc (`left` from 12 % to 88 %, rotation up to ±42°, shown backs only; it receives a count, never a card). Opening animation (`fanOpen`, staggered 25 ms), gentle sway on an inner layer so the focus outline stays still, a lift and outline plus the card number on the highlighted card.
  - **Interaction:** pointer position over the fan sets the highlight (touch drag, mouse hover; `touch-action: none` while live). Keyboard: Left/Right (wrapping), Home, End, Enter or Space to confirm. The fan is a listbox with `aria-activedescendant`; each card reads "Card 3 of 6, face down"; highlight changes are announced politely.
  - `StealPickDialog` (taker, a forced `Modal`): heading "Pick a card from [Target]", hint, fan, countdown (`CountdownText`), and **Take this card** (soft-disabled until a card is highlighted). With one card the fan auto-takes after 1 s. Highlight changes send `game.hover` (at most one per 200 ms, last position always sent, `null` on close) and play a soft tick.
  - `StealWatch` (everyone else): heading "[Taker] is choosing a card from [Target]", a smaller fan, and the live highlight from `state.hover`. For a Bot Buddy the highlight wanders on the device.
  - `StealReveal` (taker): the taken card flips face up for about 1.8 s over the board.
- State: `hover` (relayed position) and `ui.reveal`; `game/update` clears `hover` when no steal is pending.
- Events: `STEAL_STARTED` plays the shuffle sound for everyone and voice line V21 "Pick a card." (taker); `STOLEN_CARD` plays a flip sound and sets the reveal; `CARD_STOLEN` keeps V19 and V20 (US-065).
- Sounds: two new synthesised cues, `tick` and `flip` (`lib/audio.ts`).
- Reduced motion: no opening, sway or flip animation; the same arc is drawn still.
- Layout: the fan is a fixed height block; at 320 px the cards overlap (spacing is a percentage of width) so up to 12 or more cards are reachable by dragging.
- Copy (both languages): `steal.title`, `steal.hint`, `steal.take`, `steal.position`, `steal.watching`, `steal.fanLabel`, voice `V21`; the pair target picker text now says "Then you choose one of their cards, face down."

## 4. Edge cases and errors

| Case | Behaviour |
| --- | --- |
| Pair stopped by a Nope | No fan; nothing moves |
| Target holds one card | Single card; auto-taken after 1 s (or one tap) |
| Time runs out | Server picks a random slot; same take animation |
| Timer Off | No clock; the taker can take their time |
| Taker disconnects | Clock paused, US-058 banner; host may skip them, which clears the pick |
| Taker or target leaves mid-pick | Pick cleared, nothing taken, game continues |
| Reload during the pick | Snapshot carries `decision` / `steal` and the remaining time; the fan reappears (the highlight restarts) |
| Second `PICK_STEAL`, wrong player, no pending pick, position out of range | Rejected (`WRONG_PHASE`, `NOT_YOUR_TURN`, `INVALID_POSITION`), no state change |
| `game.hover` from a non-taker or out of range | Ignored |
| Spectator on a slow link | Sees the latest relayed position only |

## 5. Verification

| Check | Level |
| --- | --- |
| 3,000 simulated games: about 15,500 picks, 1,600 invalid picks, pairs, Nopes, timeouts, leaves; invariants hold, no hidden card id in any view or event | U (done) |
| Pick maps slots to cards through `order`; order is reshuffled per steal; timeout picks a valid slot | U |
| Schema and handler: `PICK_STEAL`, `game.hover` accepted from the taker only | I |
| Two browsers: fan opens with one back per card, no face or name in the DOM, Take disabled until highlight, sweep moves the highlight, the other player sees the same highlight live, arrow keys move it, take moves the card (taker -1 net, victim -1), the card flips for the taker, the fan disappears for both | E (done, headless Chrome) |
| Timeout: with a 15 s timer the pick resolves at random and the hands change by the same amounts | E (done) |
| Full game with a bot: no errors | E (done) |
| Screen reader reads "Card n of N, face down" and announces moves | A, M |
| Feel of the animation and the tick and flip sounds on real phones | M (UX review) |
| 320 px with 12 or more cards | M |

## 6. Tasks (all done unless noted)

1. Engine pending state, `PICK_STEAL`, timeout, elimination, view fields.
2. Protocol, handler, relay for `game.hover`, bot pick.
3. Fan, sweep, keyboard, taker dialog, spectator view, reveal; copy, sounds, voice line and file.
4. Docs: US-065 story and spec updated for the chosen (not random) card.
5. Open: unit and integration tests (deferred, as agreed); real-device feel check; native review of the new Vietnamese lines.

## 7. Dependencies and risks

- Depends on US-062, US-063, US-064, US-065, US-058, US-038.
- Risk: live hover messages add traffic. Mitigation: 200 ms throttle, taker only, ignored from anyone else, covered by the rate limit.
- Risk: a sloppy touch on a dense fan. Mitigation: highlight first, confirm with a large button; dragging moves the highlight, lifting does not take.
- Risk: positions leaking information. Mitigation: the order is reshuffled for every steal on the server and never sent; clients only know the count.
