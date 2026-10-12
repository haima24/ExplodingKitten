# US-019 — See the Future (look at the top 3 cards)

[Back to story index](../README.md)

- **Priority:** Must
- **Release:** 1.0.1
- **Epic:** Cards and game rules
- **User story:** As a player, I want to privately look at the top three cards of the deck, so that I can decide what to do next.
- **Context:** F-06, DAC-13.
- **Acceptance criteria:**
  - Given I play See the Future, then an overlay appears **on my device only**, showing the top 3 cards of the draw pile in order, titled "Your secret peek!".
  - Given the draw pile has fewer than 3 cards, then only the existing cards are shown.
  - Given I press **Got it — hide**, then the overlay closes, the cards are not kept on my device, and the draw pile order is unchanged.
  - Given I peek, then it does not end my turn.
  - Given a screen reader, then the three card names are read in order.
  - Given other players, then they see only "[Name] peeked", and the server sends the three cards to my device only (US-008, US-060).
  - Negative: Given the overlay is open, then Draw and Play controls behind it are inert.
- **Dependencies:** [US-011](US-011-select-and-play-an-action-card.md).
- **Notes:** The overlay is the only place deck contents are shown.
