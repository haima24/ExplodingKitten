# US-041 — Unexpected-error recovery

[Back to story index](../README.md) | Source: [user-stories.md](../../../user-stories.md)

- **Priority:** Must
- **Release:** 1.0.1
- **Epic:** Error handling, reliability, connection, and privacy
- **User story:** As a parent, I want a friendly recovery screen if something breaks, so that my child isn't left with a blank page.
- **Context:** F-14, DAC-26.
- **Acceptance criteria:**
  - Given an unhandled render or engine error, then a recovery screen shows "Oops, something went wrong." with **Try again** and **Back to home**; no stack trace is displayed.
  - Given I press **Try again**, then the app attempts to rejoin my seat in the room (US-043), or returns Home if I have no seat.
  - Given the error, then it is logged to the browser console only; no names or game content are sent anywhere.
  - Negative: Given repeated failures (3 within 1 minute), then **Try again** is replaced by **Back to home** to avoid a loop.
- **Dependencies:** [US-050](US-050-project-scaffold-and-design-tokens.md).
- **Notes:** Verified with a deliberately injected error in tests.
