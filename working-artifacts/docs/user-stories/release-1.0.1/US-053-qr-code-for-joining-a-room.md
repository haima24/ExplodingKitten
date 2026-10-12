# US-053 — QR code for joining a room

[Back to story index](../README.md)

- **Priority:** Could
- **Release:** 1.0.1
- **Epic:** Rooms and lobby
- **User story:** As a host, I want a QR code for the room link, so that people sitting nearby can join by scanning it.
- **Context:** F-32, UQ-07.
- **Acceptance criteria:**
  - Given I am the host in the lobby, when I press **Show QR code**, then a QR code of the share link is shown with the room code below it as text.
  - Given the QR code is shown, then it is generated on the device without a third-party service.
  - Given the room is full or the game has started, then the QR code is hidden.
  - Negative: Given a screen reader, then the QR code has the text alternative "QR code for joining room K7M4QX" and the same information is available as text.
- **Dependencies:** [US-054](US-054-share-the-room-code-and-link.md).
- **Notes:** Other Could items (interrupt card, best-of-N, read-aloud, high-contrast theme, PWA, preset reactions, single-device pass-and-play) are listed in the brief §D1 and §B3 and are not yet storied. Bot Buddies are US-023.
