# US-061 — Room-code security and abuse protection

[Back to story index](../README.md) | Source: [user-stories.md](../../../user-stories.md)

- **Priority:** Must
- **Release:** 1.0.1
- **Epic:** Error handling, reliability, connection, and privacy
- **User story:** As a parent, I want strangers to be unable to guess or flood our room, so that my child plays only with people I invited.
- **Context:** F-15, FR-26, DAC-33, R10, OQ-19. The link and code are the only access control, so they must resist guessing.
- **Acceptance criteria:**
  - Given a new room, then its code comes from a cryptographically secure random generator over about 30 symbols without look-alike characters (proposed: 6 characters) and is unique among active and recently closed rooms.
  - Given repeated failed joins from one device or network (proposed 10 per minute), then further attempts are blocked for a minute with "Too many tries. Wait a minute and try again."
  - Given a failed join, then the message and response time do not reveal whether a code is close to a real one.
  - Given a room is full or started, then the server rejects joins regardless of what the client claims.
  - Given a player was removed by the host, then that device cannot rejoin the same room for its lifetime.
  - Given any WebSocket connection, then message size and rate are limited, every message is schema-validated, and unknown fields are ignored.
  - Given one network address, then the number of active rooms it can create is limited (proposed 5).
  - Given automated security tests, then they cover code enumeration, tampered messages, role spoofing, and replayed or stolen rejoin tokens.
  - Negative: Given a link or code is posted publicly, then the worst case is that someone enters a lobby that has not started; the host can remove them, and nobody can join once the game starts.
- **Dependencies:** [US-060](US-060-real-time-room-server-authoritative.md), [US-055](US-055-lobby-with-host-controls.md).
- **Notes:** Join approval by the host is not in the MVP (OQ-18).
