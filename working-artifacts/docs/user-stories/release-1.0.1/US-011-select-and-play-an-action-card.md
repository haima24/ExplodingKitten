# US-011 — Select and play an action card

[Back to story index](../README.md)

- **Priority:** Must
- **Release:** 1.0.1
- **Epic:** Gameplay and turn management
- **User story:** As a child player, I want to tap a card to see what it does and then confirm playing it, so that I don't play cards by accident.
- **Context:** Two-step select → confirm pattern; F-04, F-06, DAC-07.
- **Acceptance criteria:**
  - Given my turn, when I tap a card, then it is raised with a check badge and the detail panel shows its name, art, and effect sentence; game state is unchanged.
  - Given a card is selected, when I tap it again, press Escape, or tap elsewhere, then it is deselected.
  - Given a playable card is selected, then the primary button reads **Play "[Card]"**.
  - Given I press **Play**, then the request goes to the server; until it confirms, controls are inert (a spinner appears after 1 s); once confirmed the card moves to the discard pile on every device and its effect resolves (Epic 4 stories).
  - Given the server rejects the request (for example the turn changed a moment earlier), then the card stays in my hand and I see "Oops, that was too late. It's [Name]'s turn now."
  - Given I may play multiple action cards, then after a card resolves I can still select another card or draw.
  - Given I press **Play** twice quickly, then the card is played only once.
  - Negative: Given no card is selected, then **Play** is disabled and the hint reads "Pick a card to play, or draw."
  - Negative: Given it is not my turn, then I can still tap a card to read what it does, but **Play** stays disabled with "Wait for [Name]".
- **Dependencies:** [US-009](US-009-view-my-hand.md), [US-051](US-051-pure-game-engine-module.md).
- **Notes:** Drag-and-drop is not included (UQ-02).
