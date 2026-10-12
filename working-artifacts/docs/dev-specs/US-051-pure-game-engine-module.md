# Dev spec — US-051 Pure game engine module

| Item | Value |
| --- | --- |
| Story | [US-051](../user-stories/US-051-pure-game-engine-module.md) · Must (enabler) · Foundation |
| Status | Draft v0.1 (proposed) · [Baseline](README.md) |
| Refs | F-17, FR-06, DAC-06, DAC-37 |
| Area | `packages/engine` |

## 1. Goal

Implement the rules of Family Rules v0 as a pure, deterministic library that the server runs and the client uses only for card data and types. This spec defines the **shared types and mechanics**; the card-specific specs (US-014 – US-022) define each rule.

## 2. Technical design

### 2.1 Modules

| File | Responsibility |
| --- | --- |
| `types.ts` | `Card`, `GameState`, `PlayerState`, `Pending`, `Action`, `GameEvent`, `PlayerView`, `EngineError` |
| `cards.ts` | Card catalog (kind, name, effect text ≤ 12 words, playable flag, not-playable reason key); exported as `engine/cards` |
| `rng.ts` | `Rng` interface; `shuffle(items, rng)` (Fisher–Yates); `mulberry`-style seeded `Rng` for tests |
| `deck.ts` | Build deck and deal (US-014) |
| `game.ts` | `createGame`, `applyAction` dispatcher |
| `turn.ts` | `endTurnUnit`, `nextActive` |
| `eliminate.ts` | Single elimination path (US-017, US-028, US-058) |
| `view.ts` | `viewFor`, `visibleEvents` |
| `invariants.ts` | `checkInvariants` |
| `index.ts` | Public exports; the client-safe entry points are `engine/cards` and `engine/types` |

### 2.2 Core types (sketch)

```ts
type CardKind = 'BOOM_CAT'|'TREAT'|'HOP_OVER'|'PEEK'|'SHAKE_UP'|'COZY_CAT'|'PASS_IT_ON'|'ASK_A_FRIEND'
interface Card { id: string; kind: CardKind; variant?: 1|2|3|4|5 }          // ids are opaque and meaningless
interface GameState {
  version: number; phase: 'turn'|'decision'|'finished'
  players: PlayerState[]; currentPlayerId: string; pendingTurns: number
  drawPile: Card[]; discardPile: Card[]; pending: Pending | null
  winnerId?: string; stats: { turnsPlayed: number; treatsUsed: number }; firstPlayerId: string
}
interface PlayerState { id: string; seat: number; hand: Card[]; status: 'active'|'out'
                        outReason?: 'BOOM'|'LEFT'|'REMOVED'|'SKIPPED' }
type Pending = { kind:'TREAT_DECISION'; playerId: string; boomCard: Card }
             | { kind:'REINSERT'; playerId: string; boomCard: Card }
             | { kind:'FAVOR_PICK'; playerId: string; requesterId: string }
```

### 2.3 Mechanics shared by all rules

- **Immutability:** `applyAction` returns a new state; tests deep-freeze inputs.
- **Result type:** `{ ok: true, state, events } | { ok: false, error: { code, message } }`; on error the state is unchanged.
- **Versioning:** `version` increases by one per accepted action.
- **Turn model:** `endTurnUnit`: if `pendingTurns > 1` decrement and keep the player, else move to `nextActive()` with `pendingTurns = 1`; always emit `TURN_STARTED` when the current player or the count changes and `stats.turnsPlayed++`.
- **Events:** each has `seq` (per game), `type`, `visibility` (`PUBLIC` or `{ to }`), and `data`.
- **`viewFor`:** returns `you` (own hand), `others[]` (id, seat, `handCount`, status), `phase`, `currentPlayerId`, `pendingTurns`, `drawCount`, `discardPile`, optional `decision` (only for the decider), optional `waitingFor` (public decider id), `winnerId`, and stats when finished. It **never** includes other hands, draw-pile contents or order, `boomCard`, re-insert positions, or Peek results.
- **Invariants:** I1 boom cards in `drawPile` plus pending `boomCard` = active players − 1; I2 draw pile holds ≥ 1 Boom Cat while ≥ 2 active and no pending; I3 card conservation (same multiset of ids across hands, piles, pending); I4 current player is active unless finished; I5 `pendingTurns ≥ 1`; I6 out players have empty hands; I7 `phase = 'decision'` iff `pending ≠ null`; I8 card ids unique.

## 3. Edge cases and errors

- Every illegal action returns one of the engine codes in the [baseline](README.md#22-engine-contract-packagesengine-spec-in-us-051) with no state change.
- Actions after `finished` return `GAME_FINISHED`.
- The engine never reads the clock or global randomness; the same seed and action list must reproduce identical states and events.

## 4. Verification

| Check | Level |
| --- | --- |
| Same seed → same deck order and deal | U |
| Input state not mutated (deep-freeze) | U |
| Each illegal action returns the right code and leaves the state equal | U |
| Invariants I1–I8 hold after every action in 10,000 simulated games | U (US-046) |
| Engine runs under Node with no DOM | U |
| `viewFor` contains no foreign card ids (scan JSON) | U |
| Import rules: `engine` has no imports; client cannot import `applyAction` | lint |

## 5. Tasks

1. Define types and the card catalog data.
2. Implement `Rng`, `shuffle`, and the seeded test `Rng`.
3. Implement `createGame` with deck building (see US-014) and `applyAction` dispatch with `Result`.
4. Implement turn helpers and the elimination path.
5. Implement `viewFor`, `visibleEvents`, and `checkInvariants`.
6. Write the test harness: deep-freeze, event scanner, and the simulation runner used by US-046.

## 6. Dependencies and risks

- Depends on US-050.
- Risk: rule changes after playtests. Mitigation: card counts and texts are data; each rule has focused tests.
- Open: Cozy Cats playable or not (OQ-06) is a one-flag change in the catalog.
