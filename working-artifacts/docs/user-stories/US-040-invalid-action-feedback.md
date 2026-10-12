# US-040 — Invalid-action feedback

[Back to story index](README.md) | Source: [user-stories.md](../../user-stories.md)

- **Priority:** Must
- **Epic:** Error handling, reliability, connection, and privacy
- **User story:** As a child player, I want a friendly reason when something can't be done, so that I can fix it and carry on.
- **Context:** F-14, DAC-12, DAC-25. See [ui-ux.md §E6](../../ui-ux.md#e6-invalid-actions-and-error-recovery).
- **Acceptance criteria:**
  - Given I select Cozy Cat and press Play, then the message "Cozy Cats just like to cuddle. Pick another card!" appears, and the game state is unchanged.
  - Given I select a Treat in hand, then Play is disabled and the detail panel says "Treats save you automatically when a Boom Cat shows up."
  - Given it is not my turn or my connection is down, then Play and Draw are inert and labelled with the reason ("Wait for [Name]" or "Reconnecting…").
  - Given the server rejects an action (for example a stale tap just after the turn changed), then the state is unchanged and I see "Oops, that was too late. It's [Name]'s turn now."
  - Given any invalid action, then the message appears next to the control, is available to screen readers, and clears after 5 s or on the next interaction.
  - Given the engine returns an illegal-action error, then the UI shows "That move didn't work. Try something else." and the state stays unchanged.
  - Negative: Given a message, then it is never red-only and never blames the player.
- **Dependencies:** [US-011](US-011-select-and-play-an-action-card.md), [US-051](US-051-pure-game-engine-module.md).
- **Notes:** None.
