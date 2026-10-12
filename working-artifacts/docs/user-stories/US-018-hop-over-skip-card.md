# US-018 — Hop Over (skip) card

[Back to story index](README.md) | Source: [user-stories.md](../../user-stories.md)

- **Priority:** Must
- **Epic:** Cards and game rules
- **User story:** As a player, I want to play Hop Over to skip my draw, so that I can avoid a risky draw.
- **Context:** F-06.
- **Acceptance criteria:**
  - Given I play Hop Over on my turn, then it moves to the discard pile, my turn ends without drawing, and everyone sees "[Name] hopped over their draw!".
  - Given I have already played other action cards this turn, then Hop Over still ends the turn without a draw.
  - Given Hop Over is played, then the next active player's turn begins on their device.
  - Negative: Given a pending "×2" extra turn **[after US-021]**, then Hop Over ends only one of the pending turns.
- **Dependencies:** [US-011](US-011-select-and-play-an-action-card.md).
- **Notes:** Interaction with Pass It On is defined in US-021.
