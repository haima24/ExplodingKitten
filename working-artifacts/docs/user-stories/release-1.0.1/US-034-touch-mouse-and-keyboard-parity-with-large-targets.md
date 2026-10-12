# US-034 — Touch, mouse, and keyboard parity with large targets

[Back to story index](../README.md) | Source: [user-stories.md](../../../user-stories.md)

- **Priority:** Must
- **Release:** 1.0.1
- **Epic:** Responsive UI and accessibility
- **User story:** As a child with small hands, I want big targets I can tap easily, so that I don't make mistakes.
- **Context:** F-11, F-12, DAC-19.
- **Acceptance criteria:**
  - Given any interactive element, then its tap area is ≥ 48 × 48 CSS px, with ≥ 8 px between adjacent targets; primary actions are 56 px high.
  - Given any action, then it can be performed without hover, long-press, drag, or multi-finger gestures.
  - Given a touch device, then tapping does not trigger double-tap zoom on game controls.
  - Given a pointer device, then hover effects exist but no information appears only on hover.
  - Negative: Given a card in the hand at minimum size, then its visible width is ≥ 56 px.
- **Dependencies:** [US-009](US-009-view-my-hand.md).
- **Notes:** Exceeds the WCAG 2.5.8 minimum.
