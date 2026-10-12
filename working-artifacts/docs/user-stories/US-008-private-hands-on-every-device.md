# US-008 — Private hands on every device

[Back to story index](README.md) | Source: [user-stories.md](../../user-stories.md)

- **Priority:** Must
- **Epic:** Gameplay and turn management
- **User story:** As a player, I want only me to see my cards, so that nobody can learn my hand.
- **Context:** Hidden information is the heart of the game; with one device per player the server enforces it (risk R3). Replaces the v0.1 handoff screen. F-04, FR-06, DAC-06, DAC-37.
- **Acceptance criteria:**
  - Given a game is running, then my device shows my hand, and for every other player only avatar, name, and card count.
  - Given the server sends game state to my device, then the message contains no other player's cards, no draw-pile order, and no other player's private results (an automated test inspects every outbound message, see US-060).
  - Given another player plays See the Future, tucks an Exploding Kitten, or gives me a card (Favor), then I learn only the public facts ("Mia peeked", "Exploding Kitten tucked back in").
  - Given I open the game menu, then my own hand is hidden on my screen while it is open (protects against someone looking over my shoulder or a screen share).
  - Given a screen reader, then no other player's cards exist anywhere in the page or accessibility tree.
  - Given I reconnect (US-043), then I receive only my own hand again.
  - Given a player is eliminated, then their cards are discarded face-up (proposed) and the discard pile updates for everyone.
  - Negative: Given a modified client asks the server for another player's hand, then the request is rejected.
- **Dependencies:** [US-007](US-007-show-whose-turn-it-is-and-each-player-s-status.md), [US-051](US-051-pure-game-engine-module.md), [US-060](US-060-real-time-room-server-authoritative.md).
- **Notes:** Open-hand teaching mode was removed in v0.2 because each person has their own device.
