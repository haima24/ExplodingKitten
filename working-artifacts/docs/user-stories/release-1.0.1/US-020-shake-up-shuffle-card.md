# US-020 — Shuffle (shuffle) card

[Back to story index](../README.md) | Source: [user-stories.md](../../../user-stories.md)

- **Priority:** Must
- **Release:** 1.0.1
- **Epic:** Cards and game rules
- **User story:** As a player, I want to shuffle the draw pile, so that nobody can use what they know about the order.
- **Context:** F-06.
- **Acceptance criteria:**
  - Given I play Shuffle, then the server shuffles the draw pile using its random source, the count is unchanged, and everyone sees "Deck shuffled!".
  - Given the shuffle, then my turn continues (I can play another card or draw).
  - Given a seeded random source, then the resulting order is reproducible in tests.
  - Given reduced motion is enabled, then no shuffle animation plays and the toast still appears.
- **Dependencies:** [US-011](US-011-select-and-play-an-action-card.md).
- **Notes:** None.
