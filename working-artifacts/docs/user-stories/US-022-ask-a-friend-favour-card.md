# US-022 — Ask a Friend (favour) card

[Back to story index](README.md) | Source: [user-stories.md](../../user-stories.md)

- **Priority:** Should
- **Epic:** Cards and game rules
- **User story:** As a player, I want to ask a friend to give me a card, so that I can get what I need.
- **Context:** F-22. Needs a target choice and a prompt on another player's device.
- **Acceptance criteria:**
  - Given I play Ask a Friend, then I choose one active player with ≥ 1 card using large avatar buttons.
  - Given I choose a friend, then their device shows "[Name] asks you for a card. Pick one to give" with their own hand; when they choose, the card moves to my hand and everyone sees "[Friend] gave [Name] a card" without the card name.
  - Given no other active player has any cards, then the card is blocked with "Nobody has a card to share."
  - Given the friend does not answer because they are absent, then the absent-player rule applies (US-058) and the host can skip them.
  - Negative: Given the friend's only card is a Treat, then the friend can still choose to give it (no special protection).
  - Negative: Given an out player, then they are not selectable.
- **Dependencies:** [US-008](US-008-private-hands-on-every-device.md), [US-011](US-011-select-and-play-an-action-card.md), [US-058](US-058-absent-player-during-the-game.md).
- **Notes:** Friend's choice is private; only the receiver learns the card.
