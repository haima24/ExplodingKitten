# US-014 — Build the deck by player count

[Back to story index](README.md) | Source: [user-stories.md](../../user-stories.md)

- **Priority:** Must
- **Epic:** Cards and game rules
- **User story:** As a player, I want the right mix of cards for the number of players, so that the game is balanced and always has a Boom Cat to find.
- **Context:** F-03, DAC-04. Counts are proposed (brief §C4) and tunable. Cozy Cats are not playable (OQ-06).
- **Acceptance criteria:**
  - Given the MVP set, then the complete deck is: Hop Over ×4, Peek ×4, Shake Up ×4, Cozy Cat ×15 (5 designs × 3), Treat ×(players + 2), Boom Cat ×(players − 1).
  - Given 2 players, then there is 1 Boom Cat; given 4 players, then there are 3.
  - Given the host starts the game with N players in the room, then the deck is built for exactly N players.
  - Given the deck is built, then every card has a unique id and an effect text of ≤ 12 words in the card data.
  - Given Pass It On and Ask a Friend are not yet implemented, then they are absent from the deck (they are added by US-021 and US-022).
  - Given the Cozy Cat, then its card text states it "just likes to cuddle" and it has no effect.
  - Negative: Given a deck configuration with Boom Cats ≥ players, then the engine rejects it.
- **Dependencies:** [US-051](US-051-pure-game-engine-module.md).
- **Notes:** The counts are explicitly open to playtest tuning.
