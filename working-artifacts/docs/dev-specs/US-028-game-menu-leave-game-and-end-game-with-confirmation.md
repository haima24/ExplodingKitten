# Dev spec — US-028 Game menu, leave game, and end game with confirmation

| Item | Value |
| --- | --- |
| Story | [US-028](../user-stories/release-1.0.1/US-028-game-menu-leave-game-and-end-game-with-confirmation.md) · Must · Victory, leaving, and rematch |
| Status | Draft v0.1 (proposed) · [Baseline](README.md) |
| Refs | F-10, DAC-17, [UI/UX §D8](../../ui-ux.md#d8-game-menu-leave-and-end-game--m-us-028-us-002) |
| Area | `apps/client` (`GameMenu`), `apps/server` (leave, end, kick in game) |

## 1. Goal

A per-player menu to get help or leave, plus host controls to end the game for everyone or remove a player. One player can never pause the game for others.

## 2. Technical design

### 2.1 Client `GameMenu`

- `<dialog>` opened by the header **Menu** button, Escape, or browser Back (US-002).
- Items: **Back to game** (primary), **How to Play**, **Settings**, **Leave game** (danger). Host only: **End game for everyone**, **Remove a player** (opens a list).
- While open: `ui.menuOpen = true`; the player's own hand is hidden (not rendered, `inert`, US-008); the game keeps running; if it becomes my turn a banner "It's your turn!" shows above the dialog.
- Disabled while a forced-choice dialog is open (Exploding Kitten decision, re-insert, favour pick).

### 2.2 Confirmations (`ConfirmDialog`, safe action default-focused)

| Action | Title and body | Buttons |
| --- | --- | --- |
| Leave game | "Leave this game?" "You'll be out of the round and your cards go away. You can't come back to this game." | **Stay** (default), **Leave** (danger) |
| End game (host) | "End the game for everyone?" "Everyone goes back to the lobby and this game is lost." | **Keep playing** (default), **End game** (danger) |
| Remove a player (host) | "Remove {name}?" "They will be taken out of the room." | **Cancel** (default), **Remove** (danger) |

### 2.3 Server

| Request | Behaviour |
| --- | --- |
| `room.leave` during `PLAYING` | Engine `LEAVE` for the sender (hand and any pending Exploding Kitten to discard, US-017 path); remove the member and revoke the token; if one active player remains the game finishes (US-025); public notice "{name} left the game" |
| `game.end` (host) | Discard the game without a winner; reset to the lobby (shared helper with US-026) |
| `room.kick` (host) during `PLAYING` | Engine `REMOVE` for the target, then remove the member (US-055); public notice "{name} was removed" |

Players (non-host) sending `game.end` or `room.kick`: `NOT_HOST`.

### 2.4 Tab close or reload

Closing the tab does **not** leave the game; the device can rejoin (US-043). No `beforeunload` warning.

## 3. Edge cases and errors

- Leaving while it is your turn: the next active player becomes current (engine elimination path).
- Leaving when only two players remain: the other player wins.
- Menu open when the game ends: the victory screen takes over.
- Escape inside a confirmation closes only the confirmation.

## 4. Verification

| Check | Level |
| --- | --- |
| Menu opens by button, Escape, and browser Back; Escape closes | C, E |
| Hand not in the DOM while the menu is open | C |
| Game continues for others; "Your turn" banner appears | E |
| Confirmations default to the safe action | C |
| Leave, end, and remove effects and permissions | I |
| Menu disabled during an Exploding Kitten decision | C |

## 5. Tasks

1. Build `GameMenu` and the three confirmations.
2. Implement server `LEAVE` handling and `game.end`.
3. Add the Back-button integration with US-002.
4. Add copy and tests.

## 6. Dependencies and risks

- Depends on US-002, US-005, US-055, US-060; shares code with US-026, US-017.
- Risk: accidental Leave. Mitigation: confirmation with Stay as default.
