# Dev spec — US-009 View my hand

| Item | Value |
| --- | --- |
| Story | [US-009](../user-stories/US-009-view-my-hand.md) · Must · Gameplay |
| Status | Draft v0.1 (proposed) · [Baseline](README.md) |
| Refs | F-05, DAC-18, DAC-19, [UI/UX §B6, §C1](../../ui-ux.md#b6-cards-and-game-tokens) |
| Area | `apps/client` (`features/game/Hand`, `components/common/Card`) |

## 1. Goal

Show every card in my hand, scrollable and keyboard-navigable, with large enough targets on a 320 px phone.

## 2. Technical design

### 2.1 Components

| Component | Spec |
| --- | --- |
| `Card` | Props: `card`, `selected`, `playable`, `size`. Renders name, icon, effect text (hidden below 96 px width), and badges (check for selected, "zzz/lock" for unplayable). Native `<button>` |
| `Hand` | `<ul aria-label="Your hand">` of `<li><Card/></li>`; horizontal scroll with `scroll-snap-type: x proximity`; overlap ≤ 25 % (phone), ≤ 15 % (tablet); desktop no overlap up to 8 cards |
| `HandCounter` | "n cards" text, `aria-live="off"` |

### 2.2 Sizing rules (CSS tokens)

| Viewport | Card size | Visible width per card |
| --- | --- | --- |
| Phone | 72 × 100 px minimum | ≥ 56 px |
| Tablet | 96 × 134 px | ≥ 72 px |
| Desktop | 120 × 168 px | full |

Use a CSS custom property `--card-w` and container queries on the hand container; overlap is a negative margin computed from `--card-overlap` so the visible width never drops under the minimum.

### 2.3 Keyboard

Roving tabindex: one card has `tabindex=0`; Left/Right arrows move focus (wrap off); Home/End jump; Enter or Space selects (US-011). Focus moves to the nearest remaining card after a play.

### 2.4 Scroll behaviour

On selection or focus call `scrollIntoView({ inline: 'nearest' })` with `behavior: 'auto'` when reduced motion is on (US-038), else `smooth`.

## 3. Edge cases and errors

- Empty hand (rare): show `hand.empty` "No cards. Draw one!".
- 12+ cards: still scrollable; counter shows the total.
- Another player's turn: the hand stays visible and inspectable; selection works for reading, Play is inert (US-011).
- The hand renders only the player's own cards by construction (US-008).

## 4. Verification

| Check | Level |
| --- | --- |
| Renders each card with name and type | C |
| Roving tabindex and arrow-key movement | C |
| 320 × 568 with 12 cards: each card ≥ 56 px visible, height ≥ 100 px | E (bounding boxes) |
| Selected card stays in view | E |
| Empty-hand text | C |
| Axe scan with a full hand | A |

## 5. Tasks

1. Build `Card` with states and CSS.
2. Build `Hand` with scroll-snap, overlap, roving tabindex.
3. Add the counter, empty state, and copy keys.
4. Add tests.

## 6. Dependencies and risks

- Depends on US-008, US-050 (tokens), US-051 (catalog); selection logic is US-011.
- Risk: overlap hides card labels. Mitigation: label placement at the top-left of the visible slice.
