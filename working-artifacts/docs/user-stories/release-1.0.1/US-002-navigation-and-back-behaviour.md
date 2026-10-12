# US-002 — Navigation and back behaviour

[Back to story index](../README.md)

- **Priority:** Must
- **Release:** 1.0.1
- **Epic:** Home and navigation
- **User story:** As a player, I want to move between Home, Create, Join, Rules, and Settings predictably, so that I never get lost or leave a game by accident.
- **Context:** Children press Back frequently; leaving a shared game by accident affects other people. Share links must open the right screen. F-01, F-10, DAC-02.
- **Acceptance criteria:**
  - Given I am on Create, Join, Rules, or Settings, when I press the on-screen **Back** or the browser Back button, then I return to the previous screen.
  - Given a game is in progress, when I press the browser Back button, then the **game menu** opens instead of leaving the game.
  - Given I open a `/room/:code` URL and this device has no seat in that room, then I am sent to Join with the code prefilled.
  - Given I open `/join/:code` from a share link, then Join opens with the code prefilled (US-006).
  - Given the app is reloaded on `/rules` or `/settings`, then that screen renders correctly.
  - Given any screen, then Menu, Help, or Back controls are in a consistent position.
  - Negative: Given an unknown URL, then a friendly "Page not found" screen offers **Home**.
- **Dependencies:** [US-001](US-001-landing-screen-with-clear-entry-points.md), [US-028](US-028-game-menu-leave-game-and-end-game-with-confirmation.md).
- **Notes:** Routing library is a stack decision (OQ-07).
