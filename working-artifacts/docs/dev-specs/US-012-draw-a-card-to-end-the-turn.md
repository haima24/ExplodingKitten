# Dev spec — US-012 Draw a card to end the turn

| Item | Value |
| --- | --- |
| Story | [US-012](../user-stories/US-012-draw-a-card-to-end-the-turn.md) · Must · Gameplay |
| Status | Draft v0.1 (proposed) · [Baseline](README.md) |
| Refs | F-04, DAC-08 |
| Area | `packages/engine` (`DRAW`), `apps/client` (Draw control) |

## 1. Goal

Drawing takes the top card, ends the turn (unless a Boom Cat intervenes), and tells everyone what happened without revealing the card.

## 2. Technical design

### 2.1 Engine (`DRAW`)

Preconditions: phase `turn`; actor is `currentPlayerId`; actor active.

| Top card | Result |
| --- | --- |
| Not a Boom Cat | Card to the actor's hand; private `DRAWN_CARD {card}` to the actor; public `CARD_DRAWN {playerId}`; `endTurnUnit` (so `TURN_STARTED` for the next player or the remaining extra turn) |
| Boom Cat and the actor holds a Treat | `pending = TREAT_DECISION`, `phase = 'decision'`; private `BOOM_DRAWN {hasTreat:true}` (US-015) |
| Boom Cat and no Treat | Elimination (US-017) |

The draw pile can never be empty here while ≥ 2 players are active (I2). If it is anyway, the engine returns `WRONG_PHASE` and the server treats it as an invariant failure (US-010).

### 2.2 Client

- Two entry points for one action: the `DeckPile` button (US-010) and the **Draw** button in `ActionBar`. Both call `sendDraw()`.
- `sendDraw()` uses the same pending/timeout/ack pattern as US-011: `game.action { actionId, action: { type: 'DRAW' } }`.
- On `DRAWN_CARD`: toast "You got {card}" (copy `draw.got`) and a short slide-in (skipped when reduced motion is on). Others: public message "{name} drew a card" via the announcer and log.
- Controls are disabled when `selectCanAct` is false or a dialog is open.
- After a Hop Over or Pass It On the turn is already over, so Draw is inert (engine returns `NOT_YOUR_TURN`).

## 3. Edge cases and errors

| Case | Behaviour |
| --- | --- |
| Double tap | One draw (client guard plus action id) |
| Stale tap after the turn changed | Engine `NOT_YOUR_TURN`; message "Oops, that was too late…" |
| Connection lost during draw | Snapshot after reconnect shows the result; the pending flag clears |
| Draw while a decision is pending | `WRONG_PHASE` |

## 4. Verification

| Check | Level |
| --- | --- |
| Draw moves the top card to the hand and advances the turn | U |
| Only the drawer receives `DRAWN_CARD`; others never see the card | U, I |
| Boom Cat branches route to decision or elimination | U |
| Double tap draws once | C, I |
| Deck and Draw button both work | C |
| Two contexts: turn passes and both UIs update | E |

## 5. Tasks

1. Implement `DRAW` and events in the engine.
2. Build `sendDraw()` and wire both controls.
3. Add the toast and public announcement.
4. Add tests.

## 6. Dependencies and risks

- Depends on US-011 (action pattern), US-051, US-060; Boom branches in US-015 and US-017.
- Risk: duplicated logic between the two controls. Mitigation: one `sendDraw()`.
