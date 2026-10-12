# US-036 — Screen-reader support

[Back to story index](../README.md) | Source: [user-stories.md](../../../user-stories.md)

- **Priority:** Must
- **Release:** 1.0.1
- **Epic:** Responsive UI and accessibility
- **User story:** As a player who uses a screen reader, I want the game's events announced, so that I know what is happening.
- **Context:** F-12, DAC-21.
- **Acceptance criteria:**
  - Given a screen reader, then each screen has a main heading, landmarks, and `lang="en"`.
  - Given a card, then its accessible name includes its name, type, effect, and selected state.
  - Given a join, a leave, a turn change, another player's card played or drawn, a Boom event, an elimination, a connection change, or the winner, then a concise announcement is made in a polite live region (assertive only for Boom dialogs).
  - Given the game menu is open, then my own hand is not available in the accessibility tree, and other players' hands never are (US-008).
  - Given the room code in the lobby, then it is read letter by letter, and the result of Copy code or Copy link is announced.
  - Given the See the Future overlay, then the three cards are read in order.
  - Negative: Given the same message is repeated, then it is not announced twice.
- **Dependencies:** [US-007](US-007-show-whose-turn-it-is-and-each-player-s-status.md), [US-011](US-011-select-and-play-an-action-card.md).
- **Notes:** Manual verification: NVDA, VoiceOver, TalkBack.
