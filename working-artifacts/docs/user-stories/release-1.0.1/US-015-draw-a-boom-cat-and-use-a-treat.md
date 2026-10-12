# US-015 — Draw an Exploding Kitten and use a Defuse

[Back to story index](../README.md)

- **Priority:** Must
- **Release:** 1.0.1
- **Epic:** Cards and game rules
- **User story:** As a player, I want a Defuse to calm an Exploding Kitten I draw, so that I stay in the game.
- **Context:** The signature moment. F-07, DAC-10.
- **Acceptance criteria:**
  - Given I draw an Exploding Kitten and hold ≥ 1 Defuse, then a dialog "Uh-oh, an Exploding Kitten!" shows with the primary **Use Defuse**.
  - Given I press **Use Defuse**, then exactly one Defuse moves to the discard pile, everyone sees "[Name] used a Defuse!", and I proceed to the reinsert step (US-016).
  - Given I hold 2 or more Defuse cards, then only one is consumed.
  - Given the dialog is open, then I cannot dismiss it with Escape or by tapping outside (forced choice).
  - Given a screen reader, then the dialog is announced assertively and focus is on **Use Defuse**.
  - Given my connection drops while the dialog is open, then the server keeps the decision pending, other players see "Waiting for [Name]…" (US-058), and the dialog returns when I reconnect.
  - Negative: Given I do not hold a Defuse, then this dialog is never shown (see US-017).
- **Dependencies:** [US-012](US-012-draw-a-card-to-end-the-turn.md), [US-014](US-014-build-the-deck-by-player-count.md).
- **Notes:** Defuse cards cannot be played manually from the hand (see US-040).
