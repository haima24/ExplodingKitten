# US-016 — Tuck the Boom Cat back into the deck

[Back to story index](README.md) | Source: [user-stories.md](../../user-stories.md)

- **Priority:** Must
- **Epic:** Cards and game rules
- **User story:** As a player, I want to choose where to hide the Boom Cat, so that the game stays exciting.
- **Context:** F-07, DAC-10.
- **Acceptance criteria:**
  - Given I used a Treat, then a picker offers **Top**, **Middle**, **Bottom**, and **Random** (default Random), each as a labelled radio option.
  - Given I confirm a position, then the Boom Cat is inserted at that position in the draw pile and the draw pile count increases by 1.
  - Given the picker, then the choice goes only to the server and is never shown to others; other players see only "Boom Cat tucked back in!".
  - Given the pile is small (e.g. 1 card), then "Middle" is still valid and inserts at the nearest valid position.
  - Given I confirm, then my turn ends and the next player's turn begins on their device.
  - Negative: Given no position is chosen, then the default Random is used rather than blocking.
- **Dependencies:** [US-015](US-015-draw-a-boom-cat-and-use-a-treat.md).
- **Notes:** Mixed with Peek (US-019), a tucked Top position is knowable by the next drawer; that is intended.
