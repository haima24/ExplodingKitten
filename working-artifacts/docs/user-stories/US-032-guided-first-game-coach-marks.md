# US-032 — Guided first game (coach marks)

[Back to story index](README.md) | Source: [user-stories.md](../../user-stories.md)

- **Priority:** Should
- **Epic:** Rules and help
- **User story:** As a child player, I want gentle tips during my first game, so that I learn without reading the whole rules.
- **Context:** F-23; supports metric M3.
- **Acceptance criteria:**
  - Given it is my first game on this device, then up to 4 tips appear in context (your hand, the deck, selecting a card, Boom Cats).
  - Given a tip is shown, then I can dismiss it with a button; tips never block the controls.
  - Given I dismiss or complete the tips, then they do not appear again on this device, and I can re-enable them in Settings.
  - Given reduced motion, then tips appear without animation.
  - Negative: Given local storage is unavailable, then tips are shown each session and no error appears.
- **Dependencies:** [US-031](US-031-contextual-what-now-hints.md).
- **Notes:** Stores only a "tips seen" flag locally.
