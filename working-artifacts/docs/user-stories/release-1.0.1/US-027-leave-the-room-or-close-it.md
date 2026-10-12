# US-027 — Leave the room or close it

[Back to story index](../README.md) | Source: [user-stories.md](../../../user-stories.md)

- **Priority:** Must
- **Release:** 1.0.1
- **Epic:** Victory, leaving, and rematch
- **User story:** As a player, I want to leave when I'm done, and as a host I want to close the room, so that nobody is left hanging.
- **Context:** F-08, FR-13.
- **Acceptance criteria:**
  - Given the victory screen, when I press **Leave room**, then I go Home and the other players see "[Name] left the room".
  - Given I am the host and press **Close room** and confirm, then every device shows "The host closed the room" with **Home**, and the room and its data are deleted.
  - Given I leave, then my seat, avatar, and name become free for anyone joining the lobby later.
  - Given I am the host and press **Leave room**, then the host role transfers (US-059).
  - Negative: Given I have left or the room is closed, then my old rejoin token no longer works (US-043).
- **Dependencies:** [US-025](US-025-victory-screen.md), [US-059](US-059-host-leaves-or-disconnects.md).
- **Notes:** None.
