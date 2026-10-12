# Dev spec — US-022 Favor (favour) card

| Item | Value |
| --- | --- |
| Story | [US-022](../user-stories/US-022-ask-a-friend-favour-card.md) · Should · Cards and rules |
| Status | Draft v0.1 (proposed) · [Baseline](README.md) |
| Refs | F-22, OQ-04 |
| Area | `packages/engine`, `apps/server` (absent handling), `apps/client` (`TargetPicker`, `FavorPickDialog`) |

## 1. Goal

The player picks another active player, who privately chooses one of their cards to give. This is the only card that needs input from a different player.

## 2. Technical design

### 2.1 Engine

- `PLAY_CARD` with kind `ASK_A_FRIEND` and `targetId`:
  - Preconditions: target is active, not the actor, and `hand.length ≥ 1`; else `INVALID_TARGET`. If no valid target exists the client blocks the card (see 2.3) and the engine would return `INVALID_TARGET`.
  - Card → `discardPile`; public `CARD_PLAYED` and `FAVOR_REQUESTED { requesterId, targetId }`.
  - `pending = { kind: 'FAVOR_PICK', playerId: targetId, requesterId }`; `phase = 'decision'`. The requester's turn is **not** ended.
- `PICK_FAVOR_CARD { cardId }` by the target: card moves to the requester's hand; public `FAVOR_GIVEN { fromId, toId }` (no card); private `FAVOR_RECEIVED { card }` to the requester; `pending = null`, `phase = 'turn'`. The requester continues their turn.
- The target may give a Defuse (no protection).

### 2.2 Server

`waitingFor` is the target. If the target disconnects, the absent-player rule applies (US-058): after 60 s the host can skip them; the engine's elimination path cancels the favour (US-017).

### 2.3 Client

- **Requester:** after pressing Play, `TargetPicker` shows large avatar buttons for valid targets only (active, ≠ self, handCount ≥ 1; counts come from `view.others`). If none: the card is blocked with "Nobody has a card to share."
- **Target:** `FavorPickDialog` (forced choice) lists their hand: "{name} asks you for a card. Pick one to give"; choosing sends `PICK_FAVOR_CARD`.
- **Others:** banner "Waiting for {target}…" then public "{from} gave {to} a card".

## 3. Edge cases and errors

- Timing: with profile `mvp+should`, the effect described above resolves after the Nope window (US-062). A stopped card stays in the discard pile and has no effect. Public `EFFECT_APPLIED` marks the moment it takes effect.
- Target eliminated, leaves, or is skipped during the pick: favour cancelled, requester continues.
- Requester eliminated during the pick: favour dropped.
- Out players are not selectable.
- Only the target can answer; anyone else gets `NOT_YOUR_TURN`.

## 4. Verification

| Check | Level |
| --- | --- |
| Card transfer, events, phase transitions | U |
| `INVALID_TARGET` for self, out, or empty-handed targets | U |
| Cancellation when target or requester leaves | U |
| Only the requester receives `FAVOR_RECEIVED` with the card | I (leak scan) |
| Picker excludes invalid players; blocked card message | C |
| Two-context flow including an absent target | E |

## 5. Tasks

1. Implement the card, pending kind, and `PICK_FAVOR_CARD`.
2. Build `TargetPicker` and `FavorPickDialog`.
3. Add tests including elimination during the pending state.

## 6. Dependencies and risks

- Depends on US-008, US-011, US-058; profile `mvp+should` (US-014).
- Risk: a stalled target. Mitigation: US-058.
