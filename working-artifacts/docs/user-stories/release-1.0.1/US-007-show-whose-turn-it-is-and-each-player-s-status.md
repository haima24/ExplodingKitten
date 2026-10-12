# US-007 — Show whose turn it is and each player's status

[Back to story index](../README.md)

- **Priority:** Must
- **Release:** 1.0.1
- **Epic:** Gameplay and turn management
- **User story:** As a child player, I want to see clearly whose turn it is and what to do next, so that I always know how to proceed.
- **Context:** Core clarity requirement. F-04, F-05, DAC-05.
- **Acceptance criteria:**
  - Given it is my turn, then the turn banner reads "[Name], it's your turn!" with the hint "Play a card or tap the deck to draw".
  - Given it is another player's turn, then my banner reads "It's [Name]'s turn".
  - Given the board, then each other player is shown with avatar, name, card count, status (active / waiting / out), and connection status in text.
  - Given the active player changes, then the banner updates on every device and a polite screen-reader announcement is made.
  - Given a player is out, then their chip shows a "zzz" badge and "out" text (not colour only).
  - Given it is not my turn, or my connection is down, then Draw and Play are inert and labelled "Wait for [Name]" or "Reconnecting…".
  - Given 8+ cards in hand and 4 players on 320 px width, then the opponents' row scrolls without covering the banner.
- **Dependencies:** [US-005](US-005-start-a-game-and-deal-cards.md).
- **Notes:** The "×2 turns" badge applies only after US-021.
