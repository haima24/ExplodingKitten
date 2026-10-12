# US-037 — Colour independence and contrast

[Back to story index](README.md) | Source: [user-stories.md](../../user-stories.md)

- **Priority:** Must
- **Epic:** Responsive UI and accessibility
- **User story:** As a player with colour-vision difference or low vision, I want clear contrast and non-colour cues, so that I can read the game.
- **Context:** F-12, DAC-22.
- **Acceptance criteria:**
  - Given any text, then the contrast ratio is ≥ 4.5:1 (≥ 3:1 for large text); UI components and focus indicators ≥ 3:1.
  - Given active player, selected card, playable/unplayable, out, and error states, then each is indicated by an icon or text in addition to colour.
  - Given card types, then each has a distinct icon silhouette and visible label.
  - Given text on illustrations, then it sits on a solid plate.
  - Negative: Given the page in greyscale, then every state remains distinguishable.
- **Dependencies:** [US-050](US-050-project-scaffold-and-design-tokens.md).
- **Notes:** High-contrast theme is Could (F-35).
