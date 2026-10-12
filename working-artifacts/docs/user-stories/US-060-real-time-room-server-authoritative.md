# US-060 — Real-time room server (authoritative)

[Back to story index](README.md) | Source: [user-stories.md](../../user-stories.md)

- **Priority:** Must (enabler)
- **Epic:** Foundation
- **User story:** As a developer, I want a server that owns rooms and game state and pushes updates to connected devices, so that players on different devices see a consistent game and cannot see hidden cards.
- **Context:** New in v0.2 because the game is played online. Nothing exists in the repository. F-17, FR-06. Hosting and stack: OQ-07, OQ-20.
- **Acceptance criteria:**
  - Given the server, when a client sends create-room, join-room, start, and game actions over a secure WebSocket, then the server validates each message (schema, sender, room state, turn) and applies it using the engine.
  - Given a state change, then the server sends each connected client **its own** `viewFor` projection within 300 ms (p95) on a local test network.
  - Given a message from a player who is not the sender of record, who is not in the room, or who acts out of turn, then it is rejected with an error code and no state changes.
  - Given duplicate or out-of-order messages (retries after reconnect), then they are ignored safely (idempotent action ids).
  - Given an automated test inspecting every outbound message for each client, then no message contains another player's cards, the draw-pile order, or another player's See the Future result.
  - Given a malformed or oversized message, then the connection is not crashed; the sender gets a generic error.
  - Given the server restarts, then clients receive a "room ended" result when they reconnect (acceptable for MVP).
  - Negative: Given a client tries to set its own role to host or change another player's hand, then the server rejects it.
- **Dependencies:** [US-050](US-050-project-scaffold-and-design-tokens.md), [US-051](US-051-pure-game-engine-module.md).
- **Notes:** State is in memory on a single instance for the MVP (no database). Horizontal scaling is out of scope.
