# US-062 — Nope card

[Back to story index](README.md) | Source: [user-stories.md](../../user-stories.md)

- **Priority:** Should
- **Epic:** Cards and game rules
- **User story:** As a player, I want to play a Nope to stop another player's action card, so that I can protect myself or spoil a plan.
- **Context:** F-41. Adds the only out-of-turn interaction in the game, so it needs a short response window (OQ-04).
- **Acceptance criteria:**
  - Given another player plays Skip, See the Future, Shuffle, Attack, or Favor and I hold a Nope, then a "Nope it?" dialog appears on my device showing who played which card, with **Nope!** and **Let it go**, and a visible countdown in seconds.
  - Given I play my Nope, then my Nope goes to the discard pile, everyone sees "[Name] played Nope!", and the stopped card has no effect (it stays in the discard pile and the turn carries on as if it had not been played).
  - Given a Nope was played, then every other player holding a Nope (including the player whose card was stopped) gets the same prompt and can Nope it back; each extra Nope flips the result, so an odd number of Nopes stops the card and an even number lets it through.
  - Given the window closes with no further Nope, then the card takes effect or is stopped and everyone sees the result ("[Name]'s [Card] was stopped!" when stopped).
  - Given nobody else holds a Nope, then the card takes effect immediately and no window opens.
  - Given a player does not answer (slow, absent, or offline), then the server closes the window after the countdown so the game is never held up.
  - Given I do not hold a Nope, then I see "Waiting to see if anyone plays a Nope" and my controls stay inert until the window closes.
  - Given I select a Nope in my hand on my own turn, then it is marked as played in response to another card and Play is disabled with that explanation.
  - Negative: Given a Nope, then it cannot stop an Exploding Kitten draw, a Defuse, or the Exploding Kitten position choice (only action cards).
  - Negative: Given the player whose card is waiting leaves the game, then the card is dropped and the window closes.
  - Negative: Given a player who holds a Nope leaves during the window, then they are removed from the responders and the window closes if nobody is left.
  - Negative: Given a modified client sends a Nope when there is no window or it is not a responder, then the server rejects it with no state change.
- **Dependencies:** [US-011](US-011-select-and-play-an-action-card.md), [US-058](US-058-absent-player-during-the-game.md), [US-060](US-060-real-time-room-server-authoritative.md).
- **Notes:** The window reveals that at least one other player holds a Nope; who holds it stays private. 5 Nope cards are added to the deck in profile `mvp+should`. Bots stop an occasional card and never chain Nopes (US-023).
