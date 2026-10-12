# Dev spec — US-016 Tuck the Exploding Kitten back into the deck

| Item | Value |
| --- | --- |
| Story | [US-016](../user-stories/US-016-tuck-the-boom-cat-back-into-the-deck.md) · Must · Cards and rules |
| Status | Draft v0.1 (proposed) · [Baseline](README.md) |
| Refs | F-07, DAC-10, DAC-37 |
| Area | `packages/engine`, `apps/client` (`ReinsertPicker`) |

## 1. Goal

After using a Defuse the player chooses where the Exploding Kitten goes. The choice is secret: it goes to the server only and is never broadcast.

## 2. Technical design

### 2.1 Engine (`REINSERT_BOOM`)

- Preconditions: `pending.kind = 'REINSERT'` and actor = `pending.playerId`; else `WRONG_PHASE` / `NOT_YOUR_TURN`. Unknown position → `INVALID_POSITION`.
- Let `n = drawPile.length` before insertion. Index by position:

| Position | Index |
| --- | --- |
| `TOP` | 0 |
| `MIDDLE` | `floor(n / 2)` |
| `BOTTOM` | `n` |
| `RANDOM` | `rng.nextInt(n + 1)` |

- Insert `pending.boomCard`; `pending = null`; `phase = 'turn'`; public `BOOM_TUCKED { playerId }` (no position); then `endTurnUnit` (the turn ends).
- If `n = 0`, every position inserts at index 0.

### 2.2 Client (`ReinsertPicker`)

- Radio group with four large labelled options: **Top**, **Middle**, **Bottom**, **Random** (default **Random**), each with a one-line description; button **Hide it**.
- Prompt: "Pick where to tuck it in, secretly!".
- Not dismissible without choosing (same forced-choice dialog behaviour as US-015); no choice made is impossible because Random is preselected.
- Sends `game.action { REINSERT_BOOM, position }`.
- Others see only "Exploding Kitten tucked back in!" (public event).

## 3. Edge cases and errors

- See the Future after a Top tuck lets the next player see it; this is intended (story note).
- Pile of 1 card: all positions valid and handled by the index table.
- Skip or leave while `REINSERT` is pending: the Exploding Kitten goes to the discard pile (US-017 path) so I1 stays true.
- Reconnect: the picker reappears from `view.decision`.

## 4. Verification

| Check | Level |
| --- | --- |
| Index for each position and for `n = 0, 1, 2, 5` | U |
| `RANDOM` uses the injected `Rng` (seeded test) | U |
| Position is absent from every event and payload | U, I (leak scan) |
| Default selection is Random | C |
| Turn ends after the tuck | U |
| Others see only the public message | E |

## 5. Tasks

1. Implement `REINSERT_BOOM` and index math.
2. Build `ReinsertPicker` and copy keys.
3. Add the leak-scan assertion for positions.
4. Add tests.

## 6. Dependencies and risks

- Depends on US-015.
- Risk: position inferred from timing. Accepted; no timing differences are introduced.
