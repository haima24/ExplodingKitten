# Dev spec — US-018 Hop Over (skip) card

| Item | Value |
| --- | --- |
| Story | [US-018](../user-stories/US-018-hop-over-skip-card.md) · Must · Cards and rules |
| Status | Draft v0.1 (proposed) · [Baseline](README.md) |
| Refs | F-06 |
| Area | `packages/engine`, `apps/client` (messages) |

## 1. Goal

Hop Over ends the player's turn without drawing and tells everyone.

## 2. Technical design

### 2.1 Engine

`PLAY_CARD` with kind `HOP_OVER`:

1. Preconditions: phase `turn`, actor is current, card in hand, kind playable.
2. Card → `discardPile`; public `CARD_PLAYED { playerId, kind: 'HOP_OVER' }`.
3. `endTurnUnit` **consumes one turn unit** and emits `TURN_STARTED` for the next state. No draw occurs.
4. It may be played after other action cards in the same turn (Peek, Shake Up).
5. With `pendingTurns = 2` (after Pass It On, US-021) Hop Over consumes only one unit: the same player continues with `pendingTurns = 1`.

### 2.2 Client

- Message for everyone: "{name} hopped over their draw!" (copy `log.hopOver`) as a toast and announcement.
- No special dialog; the Play button flow is US-011.
- After the play the Draw control is inert because the turn passed (engine returns `NOT_YOUR_TURN` if tapped).

## 3. Edge cases and errors

- Hop Over with no Hop Over in hand: `CARD_NOT_IN_HAND`.
- Played when it is not your turn: `NOT_YOUR_TURN`.
- Played during a pending decision: `WRONG_PHASE`.
- 2 players: the other player becomes current.

## 4. Verification

| Check | Level |
| --- | --- |
| Turn ends without a draw; next active player becomes current | U |
| Consumes one unit when `pendingTurns = 2` | U |
| Allowed after another action card; card ends in discard | U |
| Rejections for wrong player, phase, card | U |
| Toast text on all devices | C, E |

## 5. Tasks

1. Implement the Hop Over branch.
2. Add copy and event handling.
3. Add tests.

## 6. Dependencies and risks

- Depends on US-011, US-051. Interacts with US-021.
- Risk: none notable; covered by turn-model tests.
