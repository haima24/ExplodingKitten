# US-054 — Share the room code and link

[Back to story index](../README.md)

- **Priority:** Must
- **Release:** 1.0.1
- **Epic:** Rooms and lobby
- **User story:** As a host, I want to copy or share the room code and link in one tap, so that I can quickly invite my family.
- **Context:** The "host gives a code and a shared link to the players" requirement. F-18, FR-03, DAC-31. Who may re-share: OQ-18. Code format and link: OQ-19.
- **Acceptance criteria:**
  - Given I am in the lobby as host, then I see the room code as large readable text and three controls: **Copy code**, **Copy link**, and **Share…** (shown only when the device supports the native share sheet).
  - Given I press **Copy link**, then the clipboard contains `https://<domain>/join/<code>` and "Link copied" is shown and announced to screen readers.
  - Given I press **Share…**, then the native share sheet opens with the link and a short child-safe message ("Join my Whisker Boom game!").
  - Given clipboard access fails, then the code and link are shown selected so they can be copied manually.
  - Given the room is full or the game has started, then the share panel shows "Room full" or "Game in progress" and the link is no longer promoted.
  - Given I am a player (not the host), then I can see the code but the Share controls are not shown (OQ-18).
  - Given the panel, then it shows "Only share this with people you trust."
  - Negative: Given the link is opened after the room expires or closes, then the Join screen shows "This room has ended" (US-056).
  - The link contains only the room code, never a name, an id, or a rejoin token.
- **Dependencies:** [US-003](US-003-host-creates-a-room.md).
- **Notes:** A QR code is Could (US-053).
