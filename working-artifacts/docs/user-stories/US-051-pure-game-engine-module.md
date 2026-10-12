# US-051 — Pure game engine module

[Back to story index](README.md) | Source: [user-stories.md](../../user-stories.md)

- **Priority:** Must (enabler)
- **Epic:** Foundation
- **User story:** As a developer, I want the game rules in a UI-independent module with an injectable random source, so that rules can be tested deterministically and the UI stays thin.
- **Context:** Rules correctness is the core risk (R2). The engine runs on the server (authoritative) and in tests, and it decides what each player may see.
- **Acceptance criteria:**
  - Given the engine API, when `createGame(players, rng)` is called with a seeded RNG, then the same seed always produces the same deck order and deal.
  - Given a game state and an action (play card, draw, confirm Boom resolution), when `applyAction(state, action)` is called, then a new state is returned and the input state is not mutated.
  - Given an illegal action (wrong player, card not in hand, not playable), then the engine returns an explicit error result and the state is unchanged.
  - Given any reachable state with ≥ 2 active players, then the draw pile contains at least one Boom Cat (invariant).
  - Given no DOM is available (Node test environment), then the engine runs.
  - Given `viewFor(state, playerId)`, then the result contains that player's own hand, the number of cards in other hands, the draw-pile count, the discard pile, whose turn it is, and public flags, and it does **not** contain other hands, the draw-pile order, or other players' private results (Peek, re-insert position).
- **Dependencies:** [US-050](US-050-project-scaffold-and-design-tokens.md).
- **Notes:** Cards and counts are data, not code, so tuning needs no logic change.
