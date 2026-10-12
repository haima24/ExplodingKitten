# Dev spec — US-010 See the draw pile and discard pile

| Item | Value |
| --- | --- |
| Story | [US-010](../user-stories/release-1.0.1/US-010-see-the-draw-pile-and-discard-pile.md) · Must · Gameplay |
| Status | Draft v0.1 (proposed) · [Baseline](README.md) |
| Refs | F-05, DAC-09 |
| Area | `apps/client` (`DeckPile`, `DiscardPile`), `packages/engine` (`checkInvariants`), `apps/server` |

## 1. Goal

Show the draw count and the top discard on every device, update them promptly, and never reveal pile contents or Exploding Kitten positions.

## 2. Technical design

### 2.1 Data

From `PlayerView`: `drawCount` and `discardPile` (public, most recent first). No draw-pile cards are ever sent.

### 2.2 Components

| Component | Behaviour |
| --- | --- |
| `DeckPile` | A `<button>` with accessible name "Draw pile, {n} cards". Enabled as the Draw action only when `selectCanAct` (US-007); otherwise rendered as a non-interactive element with the same label. Shows a card-back and the count (text) |
| `DiscardPile` | Shows the most recent discard as a `Card` (non-interactive) with name "Discard pile, top card {name}". Empty state: dotted outline and text `piles.discardEmpty` ("Played cards go here") |
| `DiscardList` (optional) | Opens from the discard pile to browse recent cards (public data) |

### 2.3 Update path

`game.update` → store → components re-render. Target: other devices show the change within 300 ms (p95) of the action (server push path measured in US-049).

### 2.4 Invariant guard (server)

After each action the server runs `checkInvariants`. I2 states the draw pile holds an Exploding Kitten while ≥ 2 players are active, so `drawCount === 0` with ≥ 2 active players is a violation: log `invariant_violation`, send `room.ended {reason:'ERROR'}` (US-060). Clients never compute this.

## 3. Edge cases and errors

- Count shown as 0 only at the very end of a game (cannot occur while ≥ 2 active).
- Rapid updates: the store keeps the highest `version`; older snapshots are ignored.
- Reduced motion: no card flight animation; counts change immediately.

## 4. Verification

| Check | Level |
| --- | --- |
| Counts and top discard update after play, draw, Exploding Kitten events | C, I |
| Empty discard shows the outline and text | C |
| No draw-pile card data in any payload | I (leak scan) |
| Invariant I2 holds in 10,000 simulated games | U (US-046) |
| Two contexts: both piles update after a draw | E |

## 5. Tasks

1. Build `DeckPile`, `DiscardPile`, copy keys.
2. Add the version guard in the store reducer.
3. Add the server-side invariant check hook (with US-060).
4. Add tests.

## 6. Dependencies and risks

- Depends on US-005, US-051, US-060; Draw wiring is US-012.
- Risk: showing a count that reveals Exploding Kitten position. It does not: only the total is shown.
