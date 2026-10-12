# Dev spec — US-021 Attack (extra-turn attack) card

| Item | Value |
| --- | --- |
| Story | [US-021](../user-stories/US-021-pass-it-on-extra-turn-attack-card.md) · Should · Cards and rules |
| Status | Draft v0.1 (proposed) · [Baseline](README.md) |
| Refs | F-21, OQ-04 |
| Area | `packages/engine` (profile `mvp+should`), `apps/client` (badge) |

## 1. Goal

The player skips their draw and the next active player takes two turns.

## 2. Technical design

### 2.1 Engine

`PLAY_CARD` with kind `PASS_IT_ON`:

1. Card → `discardPile`; public `CARD_PLAYED`.
2. End **all** of the actor's pending turn units (not just one).
3. Next active player becomes current with `pendingTurns = 2` (never added to existing counts: if the actor was the target of an earlier Attack, the next player still gets 2, not 4).
4. Emit `TURN_STARTED { playerId, pendingTurns: 2 }`. No draw.
5. With only 2 active players the "next" player is the other player.

### 2.2 Turn accounting with `pendingTurns > 1`

- Each normal draw or Skip consumes one unit (`endTurnUnit`).
- A player eliminated while holding units loses them; the next active player gets 1 (US-017).

### 2.3 Deck profile

`mvp+should` adds 4 Attack cards. With the MVP profile they are absent and the card does not appear in the guide (US-030). Server config `DECK_PROFILE` selects the profile.

### 2.4 Client

- `view.pendingTurns > 1` shows a "2 turns" badge on the current player's chip and in the banner on every device (text, not colour only).
- Copy: card text from the catalog; public message "{name} passed it on!".

## 3. Edge cases and errors

- Timing: with profile `mvp+should`, the effect described above resolves after the Nope window (US-062). A stopped card stays in the discard pile and has no effect. Public `EFFECT_APPLIED` marks the moment it takes effect.
- Skip while holding 2 units: consumes 1 (US-018).
- Attack in reply to Attack: next player still gets 2.
- Cannot be played when it is not your turn or during a decision.

## 4. Verification

| Check | Level |
| --- | --- |
| Actor's turn ends without drawing; next gets `pendingTurns = 2` | U |
| Chain gives 2, not 4 | U |
| Skip consumption with 2 units | U |
| Two-player case | U |
| Badge visible to all, with text | C, E |
| Card only present in the `mvp+should` deck | U |

## 5. Tasks

1. Implement the card branch and profile data.
2. Add the badge and copy.
3. Add tests.

## 6. Dependencies and risks

- Depends on US-011, US-018, US-014 (profile).
- Risk: stacking rules differ from what players expect. Mitigation: documented as a product decision (OQ-04); tune after playtests.
