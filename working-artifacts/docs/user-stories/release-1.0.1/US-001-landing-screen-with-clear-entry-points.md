# US-001 — Landing screen with clear entry points

[Back to story index](../README.md) | Source: [user-stories.md](../../../user-stories.md)

- **Priority:** Must
- **Release:** 1.0.1
- **Epic:** Home and navigation
- **User story:** As a child player or host, I want a friendly home screen with big **Create a room** and **Join a room** buttons, so that I can start or join a game immediately.
- **Context:** First impression; entry to every journey (J1, J1b, J2). F-01, DAC-01.
- **Acceptance criteria:**
  - Given the app is opened, when Home loads, then I see the title, a **Create a room** button, a **Join a room** button, a **How to Play** button, and a **Settings** button.
  - Given Home, then **Create a room** is the visually dominant control and every button is operable by tap, click, and Enter/Space.
  - Given Home, then the footer states that there is no sign-up, no ads, and that only a nickname is kept for as long as the room is open.
  - Given a phone in portrait (320 px wide), then all four buttons are visible without horizontal scrolling and are ≥ 48 px high.
  - Given this device holds a valid rejoin token for an active room (US-043), then Home also shows the **Rejoin banner** above the buttons.
  - Negative: Given assets fail to load, then text labels and buttons still render (see US-044).
  - Negative: Given the server cannot be reached, then **Create a room** and **Join a room** show a clear "Can't connect right now" message when pressed, while **How to Play** and **Settings** still work.
- **Dependencies:** [US-050](US-050-project-scaffold-and-design-tokens.md).
- **Notes:** Logo and illustration are placeholders until OQ-08.
