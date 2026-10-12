# US-026 — Host starts a rematch

[Back to story index](README.md) | Source: [user-stories.md](../../user-stories.md)

- **Priority:** Must
- **Epic:** Victory, leaving, and rematch
- **User story:** As a host, I want to play again with the same people in one tap, so that we can keep having fun.
- **Context:** F-08, FR-13.
- **Acceptance criteria:**
  - Given the victory screen, when I (the host) press **Play again**, then everyone still in the room returns to the lobby with the same names and avatars, and I can press **Start game** (US-005).
  - Given a rematch, then the starting player is the next seat after the previous first player.
  - Given the new game, then no state (hands, piles, out markers) leaks from the previous game.
  - Given a player left during or after the last game, then they are not in the new lobby.
  - Given the lobby is open again, then the share link works again until the room is full or started.
  - Negative: Given I am a player (not the host), then there is no **Play again** control and a request from my client is rejected by the server.
- **Dependencies:** [US-025](US-025-victory-screen.md), [US-005](US-005-start-a-game-and-deal-cards.md), [US-055](US-055-lobby-with-host-controls.md).
- **Notes:** Starting-player rotation is a proposal (UQ-04).
