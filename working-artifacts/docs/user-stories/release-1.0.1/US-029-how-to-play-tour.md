# US-029 — How to Play tour

[Back to story index](../README.md)

- **Priority:** Must
- **Release:** 1.0.1
- **Epic:** Rules and help
- **User story:** As a first-time player, I want a short illustrated tour of the rules, so that I can learn the game in about two minutes.
- **Context:** F-09, DAC-15.
- **Acceptance criteria:**
  - Given Home or the in-game Help or game menu, when I choose **How to Play**, then a tour of ≤ 5 steps is shown with illustrations, text ≥ 18 px, and "Step n of 5".
  - Given the tour, then I can move with **Next**/**Back** buttons and swipe; no step auto-advances.
  - Given I open the tour mid-game, then the game continues for everyone, and on close I return to the same screen; if it became my turn meanwhile I see the "It's your turn!" banner.
  - Given the tour, then the steps are Goal, Your turn, Exploding Kittens and Defuse cards, Special cards, and Winning.
  - Given I press **Skip** or **Done**, then I return to where I came from.
  - Negative: Given a game is mid-turn, then opening the tour does not reveal my hand to anyone.
- **Dependencies:** [US-001](US-001-landing-screen-with-clear-entry-points.md), [US-028](US-028-game-menu-leave-game-and-end-game-with-confirmation.md).
- **Notes:** Copy must be reviewed at reading level ≈ age 6–7.
