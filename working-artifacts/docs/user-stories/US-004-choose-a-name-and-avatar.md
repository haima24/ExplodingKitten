# US-004 — Choose a name and avatar

[Back to story index](README.md) | Source: [user-stories.md](../../user-stories.md)

- **Priority:** Must
- **Epic:** Rooms and lobby
- **User story:** As a host or player, I want to pick a fun name and an animal avatar, so that the game feels like mine without sharing personal details.
- **Context:** Names are now shown to other people on other devices, so the MVP uses a curated name builder rather than free text (OQ-14). F-02, F-15, DAC-03.
- **Acceptance criteria:**
  - Given the identity step (shown to the host before creating and to a player before joining), then I choose a name from two curated word lists (for example "Sleepy" + "Biscuit") with a live preview and a **Shuffle names** button; there is no free-text name field.
  - Given I do not choose, then a random valid name is preselected so that **Continue** always works.
  - Given I pick an avatar already taken in this room, then that avatar is disabled with the visible text "taken".
  - Given two players end up with the same name, then the server makes them distinct (for example "Sleepy Biscuit 2") so the lobby and game never show two identical names.
  - Given the avatar list, then each avatar has a text name ("Biscuit the tabby") and is a radio option operable by keyboard.
  - Given the server receives a name part or avatar that is not on the allowed lists, then it rejects the request (server-side validation).
  - Given any screen, then names are rendered as plain text.
  - Negative: Given the identity step, then no email, age, photo, or real-name field is present, and a hint says "Don't use real names".
- **Dependencies:** [US-001](US-001-landing-screen-with-clear-entry-points.md), [US-060](US-060-real-time-room-server-authoritative.md).
- **Notes:** The word lists are product content that needs a child-safety review. Free-text names with filtering are a later option.
