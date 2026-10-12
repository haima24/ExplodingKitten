# US-016 — Tuck the Exploding Kitten back into the deck

[Back to story index](../README.md)

- **Priority:** Must
- **Release:** 1.0.1
- **Epic:** Cards and game rules
- **User story:** As a player, I want to choose where to hide the Exploding Kitten, so that the game stays exciting.
- **Context:** F-07, DAC-10.
- **Acceptance criteria:**
  - Given I used a Defuse, then a picker offers **Top**, **Middle**, **Bottom**, and **Random** (default Random), each as a labelled radio option.
  - Given I confirm a position, then the Exploding Kitten is inserted at that position in the draw pile and the draw pile count increases by 1.
  - Given the picker, then the choice goes only to the server and is never shown to others; other players see only "Exploding Kitten tucked back in!".
  - Given the pile is small (e.g. 1 card), then "Middle" is still valid and inserts at the nearest valid position.
  - Given I confirm, then my turn ends and the next player's turn begins on their device.
  - Negative: Given no position is chosen, then the default Random is used rather than blocking.
- **Dependencies:** [US-015](US-015-draw-a-boom-cat-and-use-a-treat.md).
- **Notes:** Mixed with See the Future (US-019), a tucked Top position is knowable by the next drawer; that is intended.
