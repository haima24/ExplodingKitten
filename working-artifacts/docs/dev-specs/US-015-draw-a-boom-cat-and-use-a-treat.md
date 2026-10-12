# Dev spec — US-015 Draw an Exploding Kitten and use a Defuse

| Item | Value |
| --- | --- |
| Story | [US-015](../user-stories/US-015-draw-a-boom-cat-and-use-a-treat.md) · Must · Cards and rules |
| Status | Draft v0.1 (proposed) · [Baseline](README.md) |
| Refs | F-07, DAC-10, [UI/UX §D6](../../ui-ux.md#d6-draw-interaction-and-boom-resolution--m-us-012-us-015-us-016-us-017) |
| Area | `packages/engine`, `apps/client` (`BoomDialog`) |

## 1. Goal

When a player draws an Exploding Kitten and holds a Defuse, they must use one Defuse (forced choice), then continue to the re-insert step.

## 2. Technical design

### 2.1 Engine

- `DRAW` with an Exploding Kitten and ≥ 1 Defuse: the Exploding Kitten is held in `pending = { kind: 'TREAT_DECISION', playerId, boomCard }` (not in the hand, not in the draw pile); `phase = 'decision'`; private `BOOM_DRAWN { hasTreat: true }` to the actor; public view shows `waitingFor = playerId`.
- `USE_TREAT` (actor = `pending.playerId`): **exactly one** Defuse leaves the hand to `discardPile`; `stats.treatsUsed++`; `pending = { kind: 'REINSERT', playerId, boomCard }`; public `TREAT_USED { playerId }`.
- Errors: `WRONG_PHASE` if there is no `TREAT_DECISION`; `NOT_YOUR_TURN` for anyone else.
- A player with two Defuse cards loses one; the other stays.

### 2.2 Client (`BoomDialog`)

- Shown when the private `BOOM_DRAWN { hasTreat: true }` arrives or `view.decision.kind === 'TREAT_DECISION'` (survives reconnect).
- Content: title "Uh-oh, an Exploding Kitten!", Exploding Kitten art, "Use your Defuse to calm it down!", primary **Use Defuse**.
- **Forced choice:** native `<dialog>` opened with `showModal()`; the `cancel` event (Escape) is prevented; backdrop clicks are ignored; no close button.
- Focus goes to **Use Defuse**; the title is announced assertively (US-036).
- Pressing **Use Defuse** sends `game.action { USE_TREAT }` with the standard pending/ack pattern; on success the dialog is replaced by the re-insert picker (US-016).
- Other players: banner "Waiting for {name}…" from `waitingFor`, then the public "{name} used a Defuse!".
- The game menu button is disabled while this dialog is open (US-028).

## 3. Edge cases and errors

- Connection drops while the dialog is open: the decision stays pending on the server; others see the absent-player banner (US-058); on reconnect the dialog reappears from the snapshot.
- The player is skipped, removed, or leaves: the pending `boomCard` goes to the discard pile (US-017 elimination path, invariant I1 holds).
- Double tap on **Use Defuse**: one action (client guard plus action id).

## 4. Verification

| Check | Level |
| --- | --- |
| Defuse decision created; exactly one Defuse consumed (including with two Defuse cards) | U |
| `USE_TREAT` out of phase or by another player rejected | U |
| Exploding Kitten is never in hand or draw pile while pending (I3) | U |
| Dialog cannot be dismissed with Escape or backdrop | C |
| Assertive announcement and initial focus | C, M |
| Dialog returns after reconnect | I, E |
| Defused Exploding Kitten flow in two contexts (others see public text only) | E |

## 5. Tasks

1. Implement the `TREAT_DECISION` branch and `USE_TREAT` in the engine.
2. Build `BoomDialog` (forced-choice behaviour) and copy keys.
3. Connect the `view.decision` and `waitingFor` display.
4. Add tests.

## 6. Dependencies and risks

- Depends on US-012, US-014; continues in US-016; elimination variants in US-017.
- Risk: forced dialog trapping users. Mitigation: only one visible button and server timeouts via US-058.
