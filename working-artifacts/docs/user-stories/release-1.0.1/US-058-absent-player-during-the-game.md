# US-058 — Absent player during the game

[Back to story index](../README.md) | Source: [user-stories.md](../../../user-stories.md)

- **Priority:** Must
- **Release:** 1.0.1
- **Epic:** Error handling, reliability, connection, and privacy
- **User story:** As a player, I want the game to wait briefly for someone whose connection dropped and let the host move on if they don't return, so that the game doesn't stall forever.
- **Context:** F-40, FR-24, DAC-34, R12. Waiting is never shamed (ui-ux §F9).
- **Acceptance criteria:**
  - Given a player loses connection, then their chip shows "reconnecting" on every device.
  - Given it is not their turn and no decision of theirs is pending, then the game continues normally.
  - Given it is their turn, or a decision of theirs is pending (Exploding Kitten dialog, Favor), then everyone sees "Waiting for [Name] to come back…" with a 60 s countdown shown as text, and the game waits.
  - Given they reconnect within 60 s, then play resumes exactly where it stopped.
  - Given 60 s pass, then the host sees **Keep waiting** and **Skip [Name]**; other players see "Waiting for the host to decide".
  - Given the host chooses **Skip [Name]**, then that player is out (their cards go to the discard pile, and a pending Exploding Kitten counts as a pop), everyone sees "[Name] was skipped", and play continues; if one player remains, they win (US-025).
  - Given the host chooses **Keep waiting**, then the countdown restarts for 60 s and the host is asked again.
  - Given the absent player is the host, then US-059 applies.
  - Negative: Given a player who is not the host, then no skip control is shown and a skip request from their client is rejected by the server.
- **Dependencies:** [US-043](US-043-reconnect-and-rejoin-my-seat.md), [US-060](US-060-real-time-room-server-authoritative.md), [US-017](US-017-draw-a-boom-cat-without-a-treat-player-is-out.md).
- **Notes:** A configurable wait time is a later option (OQ-15).
