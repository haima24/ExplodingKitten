# US-025 — Victory screen

[Back to story index](README.md) | Source: [user-stories.md](../../user-stories.md)

- **Priority:** Must
- **Epic:** Victory, leaving, and rematch
- **User story:** As a player, I want a happy celebration when someone wins, so that the game ends on a positive note.
- **Context:** F-08, DAC-14.
- **Acceptance criteria:**
  - Given one active player remains, then the victory screen appears on **every** device showing the winner's avatar and "[Name] wins the round!".
  - Given the screen, then a short recap lists who took naps and a simple stat (turns played, Exploding Kittens defused).
  - Given reduced motion, then a static starburst replaces the confetti.
  - Given a screen reader, then the headline is announced and focus lands on the heading.
  - Given I am the host, then the actions are **Play again** and **Close room**.
  - Given I am a player, then I see "Waiting for [Host] to play again" and **Leave room**.
  - Negative: Given a 4-player game where the last two players are eliminated in quick succession, then exactly one winner is declared.
  - Negative: Given a player is disconnected when the game ends, then they see the same screen when they reconnect (US-043).
- **Dependencies:** [US-017](US-017-draw-a-boom-cat-without-a-treat-player-is-out.md).
- **Notes:** The tone must not shame eliminated players.
