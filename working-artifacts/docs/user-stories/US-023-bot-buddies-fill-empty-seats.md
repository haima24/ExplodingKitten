# US-023 — Bot Buddies fill empty seats

[Back to story index](README.md) | Source: [user-stories.md](../../user-stories.md)

- **Priority:** Could
- **Epic:** Cards and game rules
- **User story:** As a host, I want to add computer-controlled Bot Buddies to the lobby, so that a small family can still have a full game.
- **Context:** Outside the host/player model, so moved from Should to Could in v0.2. F-20, OQ-12 (one gentle difficulty).
- **Acceptance criteria:**
  - Given I am the host in the lobby, when I press **Add Bot Buddy**, then a bot takes a seat (up to 4 total), is labelled "Bot" in text, and counts toward the 2-player minimum.
  - Given a bot's turn, then "[Bot] is thinking…" shows for 0.8–1.5 s, then the bot acts using only legal actions.
  - Given the bot holds Skip and the next card is unknown, then it plays Skip with a fixed probability (proposed 30 %) using the injected random source.
  - Given an Exploding Kitten is drawn with a Defuse, then the bot uses it and tucks the Exploding Kitten in at a random position.
  - Given a bot's actions, then each is announced like a human's.
  - Given a seeded random source, then a simulation of 10,000 all-bot games completes without any illegal action or invariant break.
  - Negative: Given the bot's hand contains only unplayable cards, then it simply draws.
  - Negative: Given the bot decides, then it never reads other players' hands or the draw pile order (no cheating).
  - Negative: Given only bots would remain active, then the game ends with the last human declared the winner or the room waits per US-058.
- **Dependencies:** [US-051](US-051-pure-game-engine-module.md), [US-055](US-055-lobby-with-host-controls.md), [US-060](US-060-real-time-room-server-authoritative.md), [US-018](US-018-hop-over-skip-card.md)–[US-020](US-020-shake-up-shuffle-card.md).
- **Notes:** Strategy is deliberately simple. Not part of the MVP commitment.
