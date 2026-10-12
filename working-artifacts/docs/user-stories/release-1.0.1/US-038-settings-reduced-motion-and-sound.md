# US-038 — Settings: reduced motion and sound

[Back to story index](../README.md) | Source: [user-stories.md](../../../user-stories.md)

- **Priority:** Must
- **Release:** 1.0.1
- **Epic:** Responsive UI and accessibility
- **User story:** As a parent, I want to calm motion and control sound, so that the game is comfortable for my child.
- **Context:** F-13, DAC-23.
- **Acceptance criteria:**
  - Given the OS has "reduce motion" on, then the app starts with reduced motion on; I can override it in Settings.
  - Given reduced motion is on, then there are no confetti, sliding, shaking, or shuffle animations; state changes cross-fade in ≤ 100 ms or are immediate.
  - Given Settings, then a **Sound** toggle is shown and defaults to off (disabled with a note "Coming soon" until sound exists).
  - Given I change a setting, then it applies immediately and persists locally.
  - Given Settings is opened mid-game from the game menu, then the game continues for everyone and nothing changes when I return.
  - Negative: Given local storage is unavailable, then settings apply for the session and no error appears.
- **Dependencies:** [US-001](US-001-landing-screen-with-clear-entry-points.md).
- **Notes:** No flashing more than 3 times per second.
