# US-028 — Game menu, leave game, and end game with confirmation

[Back to story index](../README.md) | Source: [user-stories.md](../../../user-stories.md)

- **Priority:** Must
- **Release:** 1.0.1
- **Epic:** Victory, leaving, and rematch
- **User story:** As a player, I want a menu where I can get help or leave safely, and as a host I want to end the game for everyone, so that mistakes are reversible and nobody is stuck.
- **Context:** F-10, DAC-17. One person cannot pause an online game for everyone, so the menu covers only that person's screen.
- **Acceptance criteria:**
  - Given a game, when I press **Menu** (or Escape, or browser Back), then a dialog offers Back to game, How to Play, Settings, and **Leave game**; the host also sees **End game for everyone** and **Remove a player**. My hand is hidden while the dialog is open.
  - Given the menu is open, then the game continues for everyone, and if it becomes my turn a "It's your turn!" banner is visible above the dialog.
  - Given I choose **Leave game**, then a confirmation explains "You'll be out of the round and your cards go away. You can't come back to this game." with **Stay** (default focus) and **Leave** (danger); on Leave I go Home, my seat is marked out for the others, and my cards go to the discard pile.
  - Given I am the host and choose **End game for everyone**, then a confirmation explains "Everyone goes back to the lobby and this game is lost." with **Keep playing** (default) and **End game** (danger); on confirm everyone returns to the lobby.
  - Given I am the host and choose **Remove a player** and confirm, then that player is out of the game and the room (as in US-055) and the others see "[Name] was removed".
  - Given I press Escape in the menu, then it closes and I return to the game.
  - Given only one player remains after a leave or removal, then the game ends and the last player wins (US-025).
  - Negative: Given an Exploding Kitten dialog is open (forced choice), then Menu is disabled until it is resolved.
  - Negative: Given I am a player (not host), then End game and Remove a player are not shown, and requests for them are rejected by the server.
- **Dependencies:** [US-002](US-002-navigation-and-back-behaviour.md), [US-005](US-005-start-a-game-and-deal-cards.md), [US-055](US-055-lobby-with-host-controls.md), [US-060](US-060-real-time-room-server-authoritative.md).
- **Notes:** Closing or reloading the tab does not leave the game; the device can rejoin (US-043).
