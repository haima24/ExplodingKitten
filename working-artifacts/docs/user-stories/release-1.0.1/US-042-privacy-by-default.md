# US-042 — Privacy by default

[Back to story index](../README.md)

- **Priority:** Must
- **Release:** 1.0.1
- **Epic:** Error handling, reliability, connection, and privacy
- **User story:** As a parent, I want assurance that only the minimum is collected and that it disappears when the game ends, so that I can trust the game with my child.
- **Context:** F-15, DAC-27; OQ-10. In v0.2 nicknames and avatars reach a server, so privacy is a launch gate.
- **Acceptance criteria:**
  - Given a first page load, then no third-party requests are made, no cookies are set, and no analytics scripts run.
  - Given the app, then no account, email, age, location, microphone, camera, or notification permission is requested.
  - Given I create or join a room, then the only data sent to the server is the room code, the curated name parts, the avatar id, a random rejoin token, and game actions.
  - Given the server, then room data (names, avatars, game state) is held in memory only, never written to a database or disk, and is deleted when the room closes or expires (US-056).
  - Given server and hosting logs, then they contain no names and no game content, and IP addresses are retained for at most 7 days (proposed).
  - Given a production build, then it is served over HTTPS and WSS with a Content-Security-Policy that blocks inline script and third-party origins.
  - Given the footer, then a plain-language **Privacy** page states exactly what is kept and for how long.
  - Negative: Given another player, then they cannot see my IP address, device details, or anything beyond my name and avatar.
  - Negative: Given the dependency list, then no tracking or advertising SDK is included.
- **Dependencies:** [US-050](US-050-project-scaffold-and-design-tokens.md), [US-056](US-056-room-lifetime-and-data-deletion.md), [US-060](US-060-real-time-room-server-authoritative.md).
- **Notes:** Legal review of child-privacy requirements is a launch gate (OQ-10). Re-review before adding any analytics.
