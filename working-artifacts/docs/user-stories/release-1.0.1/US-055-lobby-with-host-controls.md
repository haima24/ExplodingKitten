# US-055 — Lobby with host controls

[Back to story index](../README.md) | Source: [user-stories.md](../../../user-stories.md)

- **Priority:** Must
- **Release:** 1.0.1
- **Epic:** Rooms and lobby
- **User story:** As a host, I want to see who has joined and remove anyone who shouldn't be there, so that I stay in control of the room.
- **Context:** Child safety and clarity. F-18, FR-04, FR-23, DAC-17, DAC-32.
- **Acceptance criteria:**
  - Given the lobby, then every device lists each player with avatar, name, a "Host" badge for the host, and a connection status in text ("online" or "reconnecting").
  - Given a player joins or leaves, then the list updates on all devices within 1 s and a polite announcement is made.
  - Given I am the host, then each other player has a **Remove** button; pressing it asks "Remove [Name]?" with **Cancel** (default) and **Remove**.
  - Given I confirm Remove, then that player is taken out of the room, sees "The host removed you from the room" and **Home**, and their seat and avatar become free.
  - Given a removed player uses the same link or code again, then they may rejoin unless the host has locked the room (proposed: a removed device cannot rejoin the same room, see US-061).
  - Given 4 players are present, then the lobby shows "Room full".
  - Given a player presses **Leave room**, then they leave immediately with no confirmation needed in the lobby.
  - Given I am a player (not host), then Start, Remove, and Close room are not shown, and requests for them from my client are rejected by the server.
  - Given I am the host and press **Close room** and confirm, then everyone sees "The host closed the room" and the room is deleted.
  - Negative: Given a game is in progress, then the lobby controls are unavailable and joining is closed.
- **Dependencies:** [US-003](US-003-host-creates-a-room.md), [US-006](US-006-player-joins-a-room-by-link-or-code.md), [US-060](US-060-real-time-room-server-authoritative.md).
- **Notes:** Join approval (host accepts each player) is not in the MVP; the host can remove instead (OQ-18).
