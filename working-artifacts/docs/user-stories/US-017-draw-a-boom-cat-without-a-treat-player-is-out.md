# US-017 — Draw a Boom Cat without a Treat (player is out)

[Back to story index](README.md) | Source: [user-stories.md](../../user-stories.md)

- **Priority:** Must
- **Epic:** Cards and game rules
- **User story:** As a player, I want a gentle, clear message when a Boom Cat pops and I have no Treat, so that being out feels like a nap and not a failure.
- **Context:** F-07, DAC-11, OQ-05.
- **Acceptance criteria:**
  - Given I draw a Boom Cat and hold no Treat, then I see a dialog "Oh no, a Boom Cat popped!" with "[Name] is out of this round and gets a nap. Cheer the others on!" and a single **OK** button, and everyone else sees "[Name] is taking a nap".
  - Given I press **OK**, then my hand and the Boom Cat move to the discard pile (face-up, proposed), my seat shows the out marker on every device, and play continues with the next active player.
  - Given a player is out, then they are skipped for all future turns.
  - Given only one player remains active, then the game goes to the victory screen (US-025).
  - Given a 2-player game, then the single remaining player wins immediately.
  - The wording never uses "lose", "dead", "die", or violent imagery.
  - Negative: Given an out player, then they cannot draw, play, or be chosen as a target, and the server rejects such requests.
- **Dependencies:** [US-012](US-012-draw-a-card-to-end-the-turn.md), [US-025](US-025-victory-screen.md).
- **Notes:** Out players stay in the room and keep watching; they see the normal board with their seat marked out and no longer receive a hand view.
