# US-021 — Attack (extra-turn attack) card

[Back to story index](../README.md)

- **Priority:** Should
- **Release:** 1.0.1
- **Epic:** Cards and game rules
- **User story:** As a player, I want to make the next player take two turns, so that I can pass the danger along.
- **Context:** F-21. Adds tension and turn-stacking rules (OQ-04).
- **Acceptance criteria:**
  - Given I play Attack, then my turn ends without drawing and the next active player has 2 turns to take, shown by a "2 turns" badge on every device.
  - Given I am the target of an extra turn and I play Attack, then my pending turns end and the next player takes 2 turns (not 4).
  - Given I play Skip during a pending extra turn, then only one of my turns is consumed.
  - Given the deck definition, then 4 Attack cards are added to the deck for new games.
  - Negative: Given only 2 players remain, then Attack targets the other player.
- **Dependencies:** [US-011](US-011-select-and-play-an-action-card.md), [US-018](US-018-hop-over-skip-card.md).
- **Notes:** Stacking rules are a product decision.
