# Dev spec — US-017 Draw a Boom Cat without a Treat (player is out)

| Item | Value |
| --- | --- |
| Story | [US-017](../user-stories/US-017-draw-a-boom-cat-without-a-treat-player-is-out.md) · Must · Cards and rules |
| Status | Draft v0.1 (proposed) · [Baseline](README.md) |
| Refs | F-07, DAC-11, OQ-05 |
| Area | `packages/engine` (`eliminate.ts`), `apps/client` (`NapDialog`, out state) |

## 1. Goal

A Boom Cat with no Treat removes the player from the round gently ("nap time"). The same elimination path serves Leave, Remove, and Skip.

## 2. Technical design

### 2.1 Engine: `eliminate(state, playerId, reason)`

1. `status = 'out'`, `outReason = reason` (`BOOM` here). Hand → `discardPile` (face-up, proposed); public `PLAYER_OUT { playerId, reason }`.
2. Pending cleanup (for skip/leave during a decision):
   - `TREAT_DECISION` or `REINSERT` owned by the player: `boomCard` → `discardPile` (keeps I1).
   - `FAVOR_PICK` where the player is the target or requester: cancel; no card moves; the requester's turn continues (target case) or the favour is dropped (requester case).
3. If the player was `currentPlayerId`: next active player, `pendingTurns = 1` (extra turns are lost), `TURN_STARTED`.
4. If exactly one player is active: `phase = 'finished'`, `winnerId`, public `GAME_FINISHED { winnerId, stats }`. Else `phase = 'turn'` when no pending remains.

### 2.2 Engine: `DRAW` with a Boom Cat and no Treat

Private `BOOM_DRAWN { hasTreat: false }` to the drawer, then `eliminate(…, 'BOOM')` in the same action. The elimination is applied **immediately** (a design choice that keeps the state machine small); the "OK" button only dismisses the client dialog, so the observable behaviour matches the story.

### 2.3 Client

- `NapDialog` (not forced; has **OK**): title "Oh no, a Boom Cat popped!", body "{name} is out of this round and gets a nap. Cheer the others on!", sleeping-cat art. Wording must not use "lose", "dead", "die" (copy lint test).
- Others see the banner "{name} is taking a nap" (public `PLAYER_OUT`).
- Seat state: chip shows the out marker and text; `view.you.status = 'out'` removes the hand, Play and Draw, and shows `out.cheer` ("Cheer the others on!").
- Out players keep receiving public updates until they leave.

## 3. Edge cases and errors

- 2-player game: the single remaining player wins at once.
- The last two eliminated in quick succession: only the first call finishes the game; later actions get `GAME_FINISHED`.
- An out player sending any action: `PLAYER_OUT`.
- Out players cannot be targeted (`INVALID_TARGET`).

## 4. Verification

| Check | Level |
| --- | --- |
| No-Treat draw eliminates, discards hand and Boom Cat, advances the turn | U |
| Victory when one remains; 2-player case | U |
| Elimination during each pending kind keeps I1 and I3 | U |
| Out player actions rejected; out player not targetable | U |
| Dialog copy lint (forbidden words) | U |
| Out marker and text on every device | C, E |

## 5. Tasks

1. Implement `eliminate` and the no-Treat branch.
2. Build `NapDialog`, out-state UI, copy and the forbidden-words lint.
3. Add tests (engine, component, E2E).

## 6. Dependencies and risks

- Depends on US-012, US-025 (victory screen); reused by US-028 and US-058.
- Risk: confusing sudden hand removal. Mitigation: public banner plus discard face-up.
