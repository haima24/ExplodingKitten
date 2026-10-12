# Dev spec — US-029 How to Play tour

| Item | Value |
| --- | --- |
| Story | [US-029](../user-stories/release-1.0.1/US-029-how-to-play-tour.md) · Must · Rules and help |
| Status | Draft v0.1 (proposed) · [Baseline](README.md) |
| Refs | F-09, DAC-15, [UI/UX §D7](../../ui-ux.md#d7-rules-and-contextual-help--m-us-029-us-030-us-031) |
| Area | `apps/client` (`features/rules`) |

## 1. Goal

A short illustrated tour (≤ 5 steps) that teaches the game in about two minutes, reachable from Home and from inside a game without disturbing the game.

## 2. Technical design

### 2.1 Content (copy catalog, `rules.steps[]`)

| Step | Title | Content focus |
| --- | --- | --- |
| 1 | Goal | Be the last player still in the round |
| 2 | Your turn | Play cards if you want, then draw one |
| 3 | Exploding Kittens and Defuse cards | Exploding Kittens make you nap unless you have a Defuse |
| 4 | Special cards | Skip, See the Future, Shuffle (and later Attack, Favor, Nope) |
| 5 | Winning | Last player wins; the host can play again |

Text is plain, ≥ 18 px, reading level ≈ age 6–7 (content review, M). Step 4 lists only cards in the current deck profile.

### 2.2 Components

- `RulesTour`: step index in local state; **Next** and **Back** buttons; swipe via pointer events as an optional extra (never the only way); "Step {n} of 5" text; **Skip** and **Done**. No auto-advance.
- Two hosts for the same component: the `/rules` route (page) and a dialog (`RulesDialog`) opened from the game menu or the header Help button.
- `RulesDialog` does not touch game state: the room store keeps updating underneath; on close focus returns to the invoker.

### 2.3 Return behaviour

**Skip** or **Done** returns to where the user came from (history back, or close the dialog). Opening the tour mid-game never reveals the hand (the dialog covers the board; the hand is not rendered while a dialog is open from the menu).

## 3. Edge cases and errors

- It becomes the player's turn while reading: a small "Your turn!" indicator stays visible (US-028).
- Reload on `/rules`: works (SPA fallback, US-002).
- Illustrations are decorative with text alternatives in the copy.

## 4. Verification

| Check | Level |
| --- | --- |
| ≤ 5 steps, correct order, step counter text | C |
| Next, Back, Skip, Done; no auto-advance | C |
| Opened mid-game: game continues, return to same screen | E |
| Text size ≥ 18 px | C (computed style) |
| Keyboard operation; Escape closes the dialog | C |
| Reading-level review of copy | M |

## 5. Tasks

1. Write the step copy and illustration placeholders.
2. Build `RulesTour` and the two hosts.
3. Wire entries from Home, Help, and the game menu.
4. Add tests.

## 6. Dependencies and risks

- Depends on US-001, US-028.
- Risk: step 4 drifting from the real deck. Mitigation: generate the card list from `engine/cards` and the active profile.
