# US-009 — View my hand

[Back to story index](../README.md) | Source: [user-stories.md](../../../user-stories.md)

- **Priority:** Must
- **Release:** 1.0.1
- **Epic:** Gameplay and turn management
- **User story:** As a player, I want to see and scroll through all the cards in my hand, so that I can choose what to play.
- **Context:** F-05, DAC-18, DAC-19.
- **Acceptance criteria:**
  - Given the game is running, then every card in my hand is shown by name, icon, and card type.
  - Given a hand of up to 12 cards on a 320 px-wide screen, then cards are in a horizontally scrollable, scroll-snapping row and each card shows ≥ 56 px of its width with height ≥ 100 px.
  - Given the hand is scrolled, then a "n cards" counter is shown and the selected card remains in view.
  - Given a keyboard, then Left/Right arrows move between cards (roving tabindex).
  - Given an empty hand (possible only in rare edge cases), then the text "No cards. Draw one!" is shown.
  - Given it is another player's turn, then my hand stays visible to me and cards can be inspected, but nothing can be played.
  - Negative: Given another player looks at their own screen, then they cannot see my hand (US-008).
- **Dependencies:** [US-008](US-008-private-hands-on-every-device.md).
- **Notes:** Overlap and size rules per [ui-ux.md §C1](../../../ui-ux.md#c1-layout-matrix).
