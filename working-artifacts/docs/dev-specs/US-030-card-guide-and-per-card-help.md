# Dev spec — US-030 Card guide and per-card help

| Item | Value |
| --- | --- |
| Story | [US-030](../user-stories/US-030-card-guide-and-per-card-help.md) · Must · Rules and help |
| Status | Draft v0.1 (proposed) · [Baseline](README.md) |
| Refs | F-09, DAC-16 |
| Area | `apps/client` (`features/rules`, `CardDetailPanel`), `packages/engine/cards` |

## 1. Goal

One data source (the card catalog) feeds the card guide, the card detail panel, and tests, so every card has the same ≤ 12-word explanation everywhere.

## 2. Technical design

### 2.1 Data

`engine/cards` exports `CARD_CATALOG` (kind, name, effect text, playable flag, not-playable reason key, art id). The client imports **only** this data (dependency rule). The deck profile (`mvp` or `mvp+should`) decides which kinds the guide lists; the server publishes the active profile in `room.joined` (`deckProfile`).

### 2.2 Components

- `CardGuide`: list of cards with art, name, effect. Lives in the Rules page and dialog (US-029) as a second tab or section.
- `CardDetailPanel` (shared with US-011): same text, plus the playable status ("Playable now", "Not playable: {reason}").
- `InfoPopover`: tap- or Enter-triggered help bubble (never hover); opens on activation, closes with Escape, outside tap, or a close button; focus returns to the trigger.

### 2.3 Accessibility

- Card art decorative; effect text is real text.
- Popover uses `role="dialog"` (non-modal) or the native `popover` attribute with a labelled trigger; no content is hover-only (DAC-16).

## 3. Edge cases and errors

- Cards not in the current profile are not listed (Attack and Favor with `mvp`).
- A card kind missing from the catalog: the guide skips it and a test fails (catalog completeness test).

## 4. Verification

| Check | Level |
| --- | --- |
| Catalog has an entry per kind; texts ≤ 12 words | U |
| Guide lists exactly the cards of the active profile | C |
| Detail panel text equals the catalog text | C |
| Popover opens and closes by tap, click, keyboard; Escape; outside tap | C |
| Nothing depends on hover | E (touch emulation) |

## 5. Tasks

1. Expose `CARD_CATALOG` and the profile in `room.joined`.
2. Build `CardGuide`, `CardDetailPanel`, `InfoPopover`.
3. Add tests.

## 6. Dependencies and risks

- Depends on US-014 (catalog), US-029 (host screen).
- Risk: client and server profiles out of sync. Mitigation: profile comes from the server.
