# US-035 — Keyboard operation and visible focus

[Back to story index](../README.md)

- **Priority:** Must
- **Release:** 1.0.1
- **Epic:** Responsive UI and accessibility
- **User story:** As a player using a keyboard, I want to play the entire game without a mouse, so that I can play comfortably.
- **Context:** F-12, DAC-20.
- **Acceptance criteria:**
  - Given a keyboard, then I can complete the journey Home → Create or Join → lobby → full game → Victory using only Tab, Shift+Tab, arrows, Enter, Space, and Escape.
  - Given any focused element, then a visible focus ring (≥ 3:1, ≥ 2 px) is shown and is not hidden by fixed bars.
  - Given a dialog opens, then focus moves into it and is trapped; when it closes, focus returns to the control that opened it.
  - Given the hand, then Left/Right arrows move between cards and Enter/Space selects.
  - Given any shortcut keys are implemented (UQ-05), then they are inactive inside text fields and are documented in Help.
  - Negative: Given any screen, then there are no keyboard traps outside dialogs.
- **Dependencies:** [US-009](US-009-view-my-hand.md), [US-011](US-011-select-and-play-an-action-card.md).
- **Notes:** None.
