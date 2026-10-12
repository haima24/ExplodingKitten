# US-031 — Contextual "what now" hints

[Back to story index](README.md) | Source: [user-stories.md](../../user-stories.md)

- **Priority:** Must
- **Epic:** Rules and help
- **User story:** As a first-time player, I want the game to tell me what I can do right now, so that I never feel stuck.
- **Context:** F-09, DAC-05.
- **Acceptance criteria:**
  - Given my turn start, then the hint reads "Play a card or tap the deck to draw".
  - Given I have selected a card, then the hint reads "Tap Play to use [Card]".
  - Given I have just played Shake Up or Peek, then the hint reads "You can play another card, or draw to end your turn."
  - Given a Boom Cat dialog, then the dialog text states the next step.
  - Given the hints, then they are plain text ≤ 12 words and appear in the live region once per change.
  - Negative: Given a hint is displayed, then it does not repeat as an announcement if the content is unchanged.
- **Dependencies:** [US-007](US-007-show-whose-turn-it-is-and-each-player-s-status.md), [US-011](US-011-select-and-play-an-action-card.md).
- **Notes:** Hints are separate from the coach marks of US-032.
