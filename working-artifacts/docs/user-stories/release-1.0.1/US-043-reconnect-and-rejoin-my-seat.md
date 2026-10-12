# US-043 — Reconnect and rejoin my seat

[Back to story index](../README.md)

- **Priority:** Must
- **Release:** 1.0.1
- **Epic:** Error handling, reliability, connection, and privacy
- **User story:** As a player, I want my device to rejoin my seat automatically after a connection drop or reload, so that a bad signal doesn't end my game.
- **Context:** F-40, FR-21, DAC-29, M12. Phones sleep, tabs reload, and mobile networks drop. Replaces the v0.1 "resume saved game" story.
- **Acceptance criteria:**
  - Given I create or join a room, then my device stores a random rejoin token in session storage; the token never appears in a URL or share link.
  - Given my connection drops, then a banner shows "Reconnecting… your cards are safe", Play and Draw are inert, and the app retries automatically with back-off.
  - Given I reconnect within 60 s, then I return to the same seat with my current hand and the latest state, and the banner shows "Back online".
  - Given I reload the page or reopen the tab in the same browser session while the room exists, then Home or the room URL shows **Rejoin** and returns me to my seat.
  - Given I open the share link on a device that already holds my seat, then Join offers **Rejoin** instead of a new seat.
  - Given the token is invalid, the seat was removed, or the room has ended, then I see "We couldn't find your seat" with **Home**, and no room data is revealed.
  - Given the same token is used from a second device or tab, then the newest connection takes over and the older one shows "You joined from another device".
  - Given I was away longer than 60 s and the host skipped me (US-058), then I rejoin as an out player and can keep watching.
  - Negative: Given session storage is unavailable, then rejoin is not possible and a plain message says so.
- **Dependencies:** [US-006](US-006-player-joins-a-room-by-link-or-code.md), [US-060](US-060-real-time-room-server-authoritative.md).
- **Notes:** The 60 s window is proposed (OQ-15).
