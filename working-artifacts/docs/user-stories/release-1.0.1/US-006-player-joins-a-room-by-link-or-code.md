# US-006 — Player joins a room by link or code

[Back to story index](../README.md)

- **Priority:** Must
- **Release:** 1.0.1
- **Epic:** Rooms and lobby
- **User story:** As a player, I want to join my family's room by tapping a link or typing a code, so that I can play from my own device.
- **Context:** The player journey (J1b). F-19, FR-22, DAC-03, DAC-33.
- **Acceptance criteria:**
  - Given I tap a valid share link, then Join opens with the code prefilled and the text "Joining room K7M4QX"; after I complete the identity step (US-004) I am in the lobby.
  - Given I open **Join a room** from Home and type or paste a valid code, then the same happens. Lower-case letters and surrounding spaces are accepted and normalised.
  - Given I join, then everyone already in the lobby sees "[Name] joined" within 1 s.
  - Given the code is malformed, then the field shows "That code has 6 letters and numbers".
  - Given the room does not exist or has expired, then I see "We can't find that room. Check the code with your host."
  - Given the room already has 4 players, then I see "This room is full".
  - Given the game has already started, then I see "This game has already started. Ask the host to play again."
  - Given the room was closed by the host, then I see "This room has ended".
  - Given this device already holds a seat in an active room, then Join offers to rejoin it instead of creating a second seat.
  - Given a share link carries an invalid code, then Join shows the error and lets me type a different code.
  - Negative: Given too many failed attempts from this device or network (proposed 10 per minute), then I see "Too many tries. Wait a minute and try again." (US-061).
- **Dependencies:** [US-003](US-003-host-creates-a-room.md), [US-004](US-004-choose-a-name-and-avatar.md), [US-060](US-060-real-time-room-server-authoritative.md).
- **Notes:** The server must not reveal who is in a room before a successful join.
