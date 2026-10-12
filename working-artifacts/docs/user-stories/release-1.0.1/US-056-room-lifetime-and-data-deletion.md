# US-056 — Room lifetime and data deletion

[Back to story index](../README.md) | Source: [user-stories.md](../../../user-stories.md)

- **Priority:** Must
- **Release:** 1.0.1
- **Epic:** Error handling, reliability, connection, and privacy
- **User story:** As a parent, I want rooms to expire and be deleted automatically, so that nothing about my child's game lingers.
- **Context:** F-18, F-15, FR-26, DAC-36, M7. Timeouts are proposed (OQ-15).
- **Acceptance criteria:**
  - Given a room in the lobby with no activity for 30 min, a game with no actions for 30 min, a finished room for 15 min, or any room older than 3 h, then the room expires.
  - Given a room expires or the host closes it, then the server deletes all its data, invalidates the room code, share link, and rejoin tokens, and every connected device shows "This room has ended" with the reason when known and a **Home** button.
  - Given a code was used by a closed or expired room, then it is not issued again for at least 24 h.
  - Given 2 minutes before an idle expiry, then everyone sees "This room will close soon. Tap anywhere to keep it open."
  - Given the server restarts, then every room ends and reconnecting devices see "This room has ended".
  - Negative: Given someone opens a share link for an expired or closed room, then Join shows "This room has ended" and reveals nothing else.
- **Dependencies:** [US-060](US-060-real-time-room-server-authoritative.md).
- **Notes:** Verified with accelerated-clock tests.
