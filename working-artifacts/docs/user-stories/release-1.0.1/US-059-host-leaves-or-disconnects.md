# US-059 — Host leaves or disconnects

[Back to story index](../README.md) | Source: [user-stories.md](../../../user-stories.md)

- **Priority:** Must
- **Release:** 1.0.1
- **Epic:** Error handling, reliability, connection, and privacy
- **User story:** As a player, I want the room to keep working if the host leaves, so that the family's game doesn't end suddenly.
- **Context:** F-40, FR-25, DAC-35, R14. Transfer versus close is OQ-16 (proposed: transfer).
- **Acceptance criteria:**
  - Given the host loses connection, then everyone sees "[Host] lost connection" and the game continues (unless it is the host's turn, then US-058 applies); the host keeps host rights if they return within 60 s.
  - Given the host leaves on purpose or stays away beyond 60 s, then the host role passes to the longest-present connected player and everyone sees "[Name] is the new host".
  - Given the host role changes, then the new host gets the host controls (Start, Remove, End game, Skip, Play again, Close room, Share) on their next screen update, and the old host becomes a normal player if they return.
  - Given no connected player remains for 60 s, then the room closes (US-056).
  - Given the host leaves while in the lobby, then the same rules apply and the lobby keeps working.
  - Negative: Given any moment, then there is exactly one host, enforced by the server.
  - Negative: Given a player's client claims to be the host, then the server rejects it.
- **Dependencies:** [US-055](US-055-lobby-with-host-controls.md), [US-043](US-043-reconnect-and-rejoin-my-seat.md), [US-060](US-060-real-time-room-server-authoritative.md).
- **Notes:** If product prefers closing the room when the host leaves, only the second criterion changes.
