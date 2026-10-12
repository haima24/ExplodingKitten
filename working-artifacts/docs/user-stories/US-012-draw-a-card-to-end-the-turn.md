# US-012 — Draw a card to end the turn

[Back to story index](README.md) | Source: [user-stories.md](../../user-stories.md)

- **Priority:** Must
- **Epic:** Gameplay and turn management
- **User story:** As a player, I want to draw a card to finish my turn, so that the game moves on to the next player.
- **Context:** F-04, DAC-08.
- **Acceptance criteria:**
  - Given my turn, when I tap the draw pile or the **Draw** button, then the top card is added to my hand and I see "You got [Card]".
  - Given the drawn card is not a Boom Cat, then my turn ends, the next active player's turn begins on their device, and everyone else sees "[Name] drew a card" without the card.
  - Given the drawn card is a Boom Cat, then the Boom resolution applies (US-015, US-017).
  - Given I double-tap Draw, then only one card is drawn.
  - Given it is not my turn, my connection is down, or a dialog is open, then Draw is disabled and inert.
  - Given the server rejects the draw (stale tap), then I see "Oops, that was too late. It's [Name]'s turn now." and no card is drawn.
  - Negative: Given I have just played Hop Over (US-018), then my turn already ended and I cannot draw.
- **Dependencies:** [US-011](US-011-select-and-play-an-action-card.md).
- **Notes:** Drawn cards are shown only to the drawer.
