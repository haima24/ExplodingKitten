# Dev spec — US-020 Shuffle (shuffle) card

| Item | Value |
| --- | --- |
| Story | [US-020](../user-stories/US-020-shake-up-shuffle-card.md) · Must · Cards and rules |
| Status | Draft v0.1 (proposed) · [Baseline](README.md) |
| Refs | F-06 |
| Area | `packages/engine`, `apps/client` |

## 1. Goal

Shuffle the draw pile with the server's random source, keep the turn going, and tell everyone.

## 2. Technical design

### 2.1 Engine

`PLAY_CARD` with kind `SHAKE_UP`:

- Card → `discardPile`; public `CARD_PLAYED` and `DECK_SHUFFLED { playerId }`.
- `drawPile = shuffle(drawPile, rng)` (Fisher–Yates with `Rng.nextInt`). Count unchanged; Exploding Kitten count unchanged (I1, I3 hold).
- The turn continues: the player may play more cards or draw.

### 2.2 Randomness

The server's `Rng` is seeded from the platform secure random source. Tests inject a seeded `Rng` so the resulting order is reproducible.

### 2.3 Client

- Public toast and announcement: "Deck shuffled!" (copy `log.shuffled`).
- Short shuffle animation on the deck pile (transform and opacity only, ≤ 400 ms). **Skipped entirely when reduced motion is on** (US-038); the toast still appears.
- No information about the new order is sent.

## 3. Edge cases and errors

- Timing: with profile `mvp+should`, the effect described above resolves after the Nope window (US-062). A stopped card stays in the discard pile and has no effect. Public `EFFECT_APPLIED` marks the moment it takes effect.
- Pile of 0 or 1 cards: shuffle is a no-op but still valid.
- Illegal use (not your turn, wrong phase, card not in hand): standard engine errors.
- A See the Future before and after a Shuffle shows different cards (expected).

## 4. Verification

| Check | Level |
| --- | --- |
| Order changes for a seeded RNG, reproducibly; multiset unchanged | U |
| Count unchanged; Exploding Kittens preserved; turn not ended | U |
| Toast appears; no animation under reduced motion | C |
| Two contexts both show the toast | E |

## 5. Tasks

1. Implement the Shuffle branch and shuffle helper tests.
2. Add toast, animation, reduced-motion handling.
3. Add tests.

## 6. Dependencies and risks

- Depends on US-011, US-051, US-038.
- Risk: none notable.
