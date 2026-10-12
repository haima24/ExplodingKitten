# US-015 — Draw a Boom Cat and use a Treat

[Back to story index](README.md) | Source: [user-stories.md](../../user-stories.md)

- **Priority:** Must
- **Epic:** Cards and game rules
- **User story:** As a player, I want a Treat to calm a Boom Cat I draw, so that I stay in the game.
- **Context:** The signature moment. F-07, DAC-10.
- **Acceptance criteria:**
  - Given I draw a Boom Cat and hold ≥ 1 Treat, then a dialog "Uh-oh, a Boom Cat!" shows with the primary **Use Treat**.
  - Given I press **Use Treat**, then exactly one Treat moves to the discard pile, everyone sees "[Name] used a Treat!", and I proceed to the reinsert step (US-016).
  - Given I hold 2 or more Treats, then only one is consumed.
  - Given the dialog is open, then I cannot dismiss it with Escape or by tapping outside (forced choice).
  - Given a screen reader, then the dialog is announced assertively and focus is on **Use Treat**.
  - Given my connection drops while the dialog is open, then the server keeps the decision pending, other players see "Waiting for [Name]…" (US-058), and the dialog returns when I reconnect.
  - Negative: Given I do not hold a Treat, then this dialog is never shown (see US-017).
- **Dependencies:** [US-012](US-012-draw-a-card-to-end-the-turn.md), [US-014](US-014-build-the-deck-by-player-count.md).
- **Notes:** Treats cannot be played manually from the hand (see US-040).
