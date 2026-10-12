# US-010 — See the draw pile and discard pile

[Back to story index](../README.md)

- **Priority:** Must
- **Release:** 1.0.1
- **Epic:** Gameplay and turn management
- **User story:** As a player, I want to see how many cards remain to draw and what was last played, so that I can follow the game.
- **Context:** F-05, DAC-09.
- **Acceptance criteria:**
  - Given the board, then the draw pile shows its card count ("Draw pile, 12 cards") and the discard pile shows the top played card.
  - Given a card is played or drawn, then both counts and the top discard update on every device within 300 ms (p95).
  - Given no card has been played, then the discard pile shows an empty outline "Played cards go here".
  - Given the draw pile contains Exploding Kittens, then their positions are never revealed to players.
  - Negative: Given the draw pile count is 0 while ≥ 2 players remain, then the engine reports an invariant error (it must not happen; see US-046).
- **Dependencies:** [US-005](US-005-start-a-game-and-deal-cards.md).
- **Notes:** None.
