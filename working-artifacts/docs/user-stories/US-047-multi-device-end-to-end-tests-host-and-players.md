# US-047 — Multi-device end-to-end tests (host and players)

[Back to story index](README.md) | Source: [user-stories.md](../../user-stories.md)

- **Priority:** Must
- **Epic:** Testing and quality
- **User story:** As a tester, I want automated browser tests where a host and players each use their own browser session, so that regressions in rooms, real-time play, and reconnection are caught before release.
- **Context:** F-16, M4, M11, M12. The repository's testing instructions specify Playwright with the Page Object Model (`instructions/testing/copilot-instructions.md`); Playwright supports several browser contexts in one test.
- **Acceptance criteria:**
  - Given a test with a host and 2 players in three separate browser contexts and a seeded random source, then the scripted journey runs: host creates a room, copies the link, players open the link and join, host starts, the game is played to a winner, and the host starts a rematch.
  - Given the run, then it covers Peek, Hop Over, Shake Up, a Boom Cat defused, a Boom Cat elimination, the game menu, Leave game, and Play again.
  - Given the host runs at 1280 × 800 and the players at 390 × 844 and 768 × 1024 (and a landscape 844 × 390 variant), then every step passes.
  - Given a simulated offline period of 20 s for one player, then that player rejoins the same seat with the same hand; given 70 s on that player's turn, then the host's **Skip** option appears (US-058).
  - Given the join error cases (wrong code, full room, started game, closed room), then each shows its expected message.
  - Given the tests, then they use roles and labels (not CSS selectors) and Page Objects, and they run in any order.
  - Given a failure, then screenshots and traces for every context are stored as artifacts.
  - Negative: Given a keyboard-only variant for one player, then the same journey completes (supports US-035).
- **Dependencies:** [US-033](US-033-responsive-layouts-across-device-classes.md), [US-025](US-025-victory-screen.md), [US-043](US-043-reconnect-and-rejoin-my-seat.md), [US-058](US-058-absent-player-during-the-game.md), [US-060](US-060-real-time-room-server-authoritative.md).
- **Notes:** Requires a deterministic RNG and a short-timeout switch that are not exposed in production builds.
