# US-018 — Skip (skip) card

[Back to story index](../README.md)

- **Priority:** Must
- **Release:** 1.0.1
- **Epic:** Cards and game rules
- **User story:** As a player, I want to play Skip to skip my draw, so that I can avoid a risky draw.
- **Context:** F-06.
- **Acceptance criteria:**
  - Given I play Skip on my turn, then it moves to the discard pile, my turn ends without drawing, and everyone sees "[Name] hopped over their draw!".
  - Given I have already played other action cards this turn, then Skip still ends the turn without a draw.
  - Given Skip is played, then the next active player's turn begins on their device.
  - Negative: Given a pending "×2" extra turn **[after US-021]**, then Skip ends only one of the pending turns.
- **Dependencies:** [US-011](US-011-select-and-play-an-action-card.md).
- **Notes:** Interaction with Attack is defined in US-021.
