# US-033 — Responsive layouts across device classes

[Back to story index](../README.md) | Source: [user-stories.md](../../../user-stories.md)

- **Priority:** Must
- **Release:** 1.0.1
- **Epic:** Responsive UI and accessibility
- **User story:** As a family, I want the game to be comfortable on a phone, tablet, or desktop, so that we can play on whatever device we have.
- **Context:** F-11, DAC-18, DAC-24. Layouts per [ui-ux.md §C](../../../ui-ux.md#c-responsive-behaviour).
- **Acceptance criteria:**
  - Given each of 320 × 568, 390 × 844 (mobile portrait), 844 × 390 (mobile landscape), 768 × 1024 (tablet), 1280 × 800, and 1920 × 1080 (desktop), then each screen has no horizontal page scroll (the hand excluded), no overlapping controls, and all actions are reachable.
  - Given I rotate a phone mid-game, then the game state, selected card, and open dialogs are preserved.
  - Given 200 % browser zoom, then all content remains readable and operable.
  - Given a mobile browser with dynamic toolbars, then the action bar and hand are not hidden by them (dynamic viewport height and safe-area insets).
  - Given dialogs, then they appear as bottom sheets on mobile portrait and centred modals on tablet and desktop.
  - Negative: Given a viewport shorter than 360 px, then the board scrolls vertically; it does not show a "please rotate" blocker.
- **Dependencies:** [US-050](US-050-project-scaffold-and-design-tokens.md) and the screen stories.
- **Notes:** Browser support per brief §F.
