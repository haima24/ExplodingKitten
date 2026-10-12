# US-005 — Start a game and deal cards

[Back to story index](../README.md) | Source: [user-stories.md](../../../user-stories.md)

- **Priority:** Must
- **Release:** 1.0.1
- **Epic:** Rooms and lobby
- **User story:** As a host, I want to start the game when everyone has joined, so that the server shuffles and deals cards fairly and we can all play.
- **Context:** Establishes initial state; F-03, DAC-04. Only the host can start (FR-04).
- **Acceptance criteria:**
  - Given I am the host and 2–5 players are in the lobby, when I press **Start game**, then the room locks, the server builds and deals the deck for the players present, and every device shows its own hand.
  - Given 3 players, then each player holds exactly 1 Defuse and 4 other cards, none of which is an Exploding Kitten or an extra Defuse.
  - Given the deal is complete, then Exploding Kittens (players − 1) and 2 extra Defuse cards are added to the draw pile and it is shuffled by the server.
  - Given the game starts, then every device shows "Everyone has cards! [Name] goes first".
  - Given I press Start twice quickly, then only one game is created.
  - Given any player count (2–5), then no player's initial hand contains an Exploding Kitten.
  - Given a player tries to join at the moment of Start, then they either are in the game or are told "This game has already started", never in a half state.
  - Negative: Given only the host is in the lobby, then **Start game** is disabled with the text "You need at least 2 players".
  - Negative: Given I am a player and not the host, then no Start control is shown, and a start request from my client is rejected by the server.
  - Negative: Given the deck definition cannot supply enough cards for the dealt hands (misconfiguration), then the server fails with a clear error and the room shows the error screen (US-041).
- **Dependencies:** [US-055](US-055-lobby-with-host-controls.md), [US-014](US-014-build-the-deck-by-player-count.md), [US-051](US-051-pure-game-engine-module.md), [US-060](US-060-real-time-room-server-authoritative.md).
- **Notes:** Starting-player choice: random for the first game; rotate on a rematch (UQ-04).
