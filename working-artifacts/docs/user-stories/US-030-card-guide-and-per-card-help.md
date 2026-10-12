# US-030 — Card guide and per-card help

[Back to story index](README.md) | Source: [user-stories.md](../../user-stories.md)

- **Priority:** Must
- **Epic:** Rules and help
- **User story:** As a child player, I want to see what every card does, so that I can choose with confidence.
- **Context:** F-09, DAC-16.
- **Acceptance criteria:**
  - Given the card guide, then every MVP card type is listed with its art, name, and effect of ≤ 12 words.
  - Given a card in my hand, when I select it, then the same effect text appears in the detail panel (US-011).
  - Given the guide, then no content depends on hover; opening and closing work with tap, click, and keyboard.
  - Given the info popover is open, when I press Escape or tap outside, then it closes.
  - Negative: Given cards not in the MVP (Pass It On, Ask a Friend before US-021/US-022), then they are not listed.
- **Dependencies:** [US-014](US-014-build-the-deck-by-player-count.md).
- **Notes:** Card text is data driven, so one source feeds the guide, hand, and tests.
