# US-046 — Engine unit and simulation tests

[Back to story index](README.md) | Source: [user-stories.md](../../user-stories.md)

- **Priority:** Must
- **Epic:** Testing and quality
- **User story:** As a tester, I want automated tests for every rule, so that rule changes cannot silently break the game.
- **Context:** F-16, M8.
- **Acceptance criteria:**
  - Given the engine, then each MVP card behaviour, the deal, the draw, Boom with Treat, Boom without a Treat, elimination, and victory have at least one passing unit test.
  - Given a seeded random source, then 10,000 simulated games (2–4 players, random legal actions) finish with no illegal state, and the invariant "draw pile has ≥ 1 Boom Cat while ≥ 2 players remain" holds after every action.
  - Given illegal actions (wrong player, missing card, playing Cozy Cat, drawing when out), then each returns an error and leaves the state unchanged.
  - Given the server, then automated tests cover the room lifecycle, join limits, host-only actions, host transfer, reconnect, absent-player skip, and expiry (US-055, US-056, US-058, US-059).
  - Given every outbound message for every client in simulated games, then no message contains another player's cards, the draw-pile order, or another player's private results (US-008, US-060).
  - Given the CI run, then engine branch coverage is ≥ 90 %.
  - Negative: Given a deliberately broken rule (mutation spot-check), then at least one test fails.
- **Dependencies:** [US-051](US-051-pure-game-engine-module.md), [US-060](US-060-real-time-room-server-authoritative.md).
- **Notes:** Targets are proposed.
