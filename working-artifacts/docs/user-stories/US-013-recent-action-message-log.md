# US-013 — Recent-action message log

[Back to story index](README.md) | Source: [user-stories.md](../../user-stories.md)

- **Priority:** Should
- **Epic:** Gameplay and turn management
- **User story:** As a child player, I want to read what just happened, so that I can follow other players' turns.
- **Context:** Hidden-hand games are hard to follow. F-24.
- **Acceptance criteria:**
  - Given a card is played, then a one-line entry appears ("Pip played Shake Up").
  - Given the log panel is open (side panel on desktop, sheet on mobile), then the last 10 entries are shown, newest first.
  - Given a draw, then the log records "Pip drew a card" without revealing the card.
  - Given a screen reader, then the log is a `role="log"` region and does not duplicate the live announcements.
  - Negative: Given a Peek, then the log records "Mia peeked" but not the cards seen.
- **Dependencies:** [US-011](US-011-select-and-play-an-action-card.md), [US-012](US-012-draw-a-card-to-end-the-turn.md).
- **Notes:** None.
