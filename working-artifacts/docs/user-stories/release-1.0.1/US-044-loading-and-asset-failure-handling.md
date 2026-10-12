# US-044 — Loading and asset-failure handling

[Back to story index](../README.md)

- **Priority:** Should
- **Release:** 1.0.1
- **Epic:** Error handling, reliability, connection, and privacy
- **User story:** As a player on a slow connection, I want to see that the game is loading and recover if an image fails, so that the game remains usable.
- **Context:** F-27.
- **Acceptance criteria:**
  - Given loading takes > 300 ms, then a loading screen with "Getting the cards ready…" is shown; faster loads show none.
  - Given a card image fails to load, then the card still shows its name, type text, and a fallback icon.
  - Given the network drops mid-game, then the connection banner appears (US-043) and the already-loaded screen stays usable for reading.
  - Given the initial bundle fails to load, then a plain-HTML message with a **Reload** link is shown.
  - Negative: Given reduced motion is on, then the loading spinner is static.
- **Dependencies:** [US-050](US-050-project-scaffold-and-design-tokens.md).
- **Notes:** Offline installable PWA is Could (F-36).
