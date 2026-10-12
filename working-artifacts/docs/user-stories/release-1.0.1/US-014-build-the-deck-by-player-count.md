# US-014 — Build the deck by player count

[Back to story index](../README.md) | Source: [user-stories.md](../../../user-stories.md)

- **Priority:** Must
- **Release:** 1.0.1
- **Epic:** Cards and game rules
- **User story:** As a player, I want the right mix of cards for the number of players, so that the game is balanced and always has an Exploding Kitten to find.
- **Context:** F-03, DAC-04. Counts are proposed (brief §C4) and tunable. Cat cards are played only as a pair (OQ-06 resolved by US-065).
- **Acceptance criteria:**
  - Given the MVP set, then the complete deck is: Skip ×4, See the Future ×4, Shuffle ×4, Cat card ×20 (5 designs × 4, US-065), Defuse ×(players + 2), Exploding Kitten ×(players − 1).
  - Given 2 players, then there is 1 Exploding Kitten; given 4 players, then there are 3.
  - Given the host starts the game with N players in the room, then the deck is built for exactly N players.
  - Given the deck is built, then every card has a unique id and an effect text of ≤ 12 words in the card data.
  - Given Attack and Favor are not yet implemented, then they are absent from the deck (they are added by US-021 and US-022).
  - Given the Cat card, then its card text says it is played as a pair of the same design to take a random card (US-065); a single Cat card is still not playable.
  - Negative: Given a deck configuration with Exploding Kittens ≥ players, then the engine rejects it.
- **Dependencies:** [US-051](US-051-pure-game-engine-module.md).
- **Notes:** The counts are explicitly open to playtest tuning.
