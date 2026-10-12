# US-003 — Host creates a room

[Back to story index](README.md) | Source: [user-stories.md](../../user-stories.md)

- **Priority:** Must
- **Epic:** Rooms and lobby
- **User story:** As a host, I want to create a private room, so that my family can join me and play together.
- **Context:** The starting point of the host journey (J1). F-18, FR-03, DAC-03. A room holds at most 4 players (OQ-13).
- **Acceptance criteria:**
  - Given Home, when I press **Create a room** and complete the identity step (US-004), then a room is created and I am in its lobby as the **host** and as a player.
  - Given the room is created, then it has a unique room code (proposed: 6 characters, no look-alike symbols) and a share link (see US-054).
  - Given the Create screen, then it suggests "Ask a grown-up to be the host" but does not block a child (OQ-17).
  - Given I press **Create room** twice quickly, then only one room is created.
  - Given this device already holds a seat in an active room, then Create asks "You're already in room K7M4QX. Rejoin it, or leave it first?" and does not create a second room silently.
  - Given creation fails (server unreachable), then "We couldn't make a room. Try again." is shown with **Try again**, and no partial room remains.
  - Negative: Given the Create screen, then no account, login, email, or age is requested.
- **Dependencies:** [US-004](US-004-choose-a-name-and-avatar.md), [US-060](US-060-real-time-room-server-authoritative.md).
- **Notes:** Room timeouts: US-056. Host rules: US-055, US-058, US-059.
