# Dev spec — US-062 Nope card

| Item | Value |
| --- | --- |
| Story | [US-062](../user-stories/US-062-nope-card.md) · Should · Cards and rules |
| Status | Draft v0.1 (implemented in the first build) · [Baseline](README.md) |
| Refs | F-41, OQ-04 |
| Area | `packages/engine`, `packages/protocol`, `apps/server`, `apps/client` |

## 1. Goal

Let players stop another player's action card by playing a Nope out of turn, including Noping a Nope, without breaking the rule that the engine is pure and the server is authoritative.

## 2. Technical design

### 2.1 Rules

| Situation | Behaviour |
| --- | --- |
| Action card played (Skip, See the Future, Shuffle, Attack, Favor) | Card goes to the discard pile and `CARD_PLAYED` is emitted. If no other active player holds a Nope, the effect resolves at once. Otherwise a **window** opens |
| Window | `phase = 'decision'`, `pending = NOPE_WINDOW { playerId (card owner), card, targetId?, nopes: 0, responders }`. `responders` are the other active players holding a Nope |
| `NOPE` by a responder | One Nope leaves the hand to the discard pile, `nopes++`, public `NOPE_PLAYED {playerId, count}`. New responders = every active player holding a Nope **except the one who just played** (so the card owner may Nope it back). Empty list means resolve |
| `PASS_NOPE` by a responder | Removed from `responders`. Empty list means resolve |
| Resolve | `phase = 'turn'`, `pending = null`, public `NOPE_RESOLVED {cancelled: nopes is odd, kind, playerId}`. If not cancelled the effect runs (`applyEffect`) and public `EFFECT_APPLIED {playerId, kind}` is emitted first |
| `EXPIRE_NOPE` (server only) | Clears `responders` and resolves; used when the timer ends |

The effect code (`effects.ts`) is the same code that used to run immediately; only its timing moved. Favor re-checks its target at resolution time (the target may have left or run out of cards) and fizzles quietly if invalid.

### 2.2 Engine details

- `NOPE` is a catalog card with `playable: false` and `reaction: true`, so `PLAY_CARD` on it returns `NOT_PLAYABLE` with a friendly reason; it can only be played through the `NOPE` action.
- Errors: `WRONG_PHASE` when there is no window; `NOT_YOUR_TURN` when the sender is not a responder; `CARD_NOT_IN_HAND` when a responder has no Nope (cannot happen through the UI).
- `PLAY_CARD` and `DRAW` during a window return `WRONG_PHASE` (or `NOT_YOUR_TURN` for non-current players).
- Elimination (US-017): owner leaves → window dropped; responder leaves → removed, resolve when empty. `eliminate` therefore receives the `Rng`.
- Invariants are unchanged. `pendingBoomCard(state)` replaces direct `pending.boomCard` reads, because `NOPE_WINDOW` and `FAVOR_PICK` hold no Exploding Kitten.
- Deck profile `mvp+should` adds `nope: 5` (US-014).

### 2.3 View and privacy

- Public in every `PlayerView`: `nopeWindow { actorId, cardKind, nopes }`.
- Only a responder receives `decision { kind: 'NOPE_WINDOW', actorId, cardKind, nopes }`.
- `waitingFor` is **not** set during a window (many players may answer), so absent-player logic does not treat the card owner as blocking.
- The window reveals that someone holds a Nope; it does not reveal who. Accepted trade-off (documented in the story notes).

### 2.4 Server

- The engine has no clock. `gameService.trackNopeWindow` starts a countdown (`NOPE_WINDOW_MS`, default 8000, 1500 in `TEST_MODE`) when a window opens and restarts it whenever `nopes` changes. It is stored as `room.nopeDeadlineAt` and added to each `PlayerView` as `nopeDeadlineAt` so clients can show seconds left.
- The 250 ms sweep calls `expireNopeWindow`, which applies `EXPIRE_NOPE` for the room. Disconnected or silent humans therefore never block the game.
- Protocol: `game.action` accepts `{type:'NOPE'}` and `{type:'PASS_NOPE'}`; both go through the normal pipeline (per-room order, action-id dedupe, invariants, leak guard).
- Bots: `botToAct(room)` returns the first bot responder during a window; `chooseAction` answers `NOPE` 25% of the time when `nopes = 0`, otherwise `PASS_NOPE`.

### 2.5 Client

- `NopeDialog` (modal, Escape = Let it go): title "Nope it?", "{name} played {card}.", **Nope!** (primary, focused) and **Let it go**, `role="timer"` countdown, announced assertively.
- Everyone else: banner "{name} played {card}…", hint "Anyone holding a Nope can stop it.", action bar reason "Waiting to see if anyone plays a Nope".
- Log, toast, and announcements: "{name} played Nope!", "{name}'s {card} was stopped!". The "hopped over" and "passed it on" messages now follow `EFFECT_APPLIED`, so they appear only if the card was not stopped.
- Hand: the Nope card shows a lightning badge and "Played in response to another card" in its accessible name and detail panel.
- Art: `art/CardIcon` draws a stop sign with a crossed-out paw (red tint).

## 3. Edge cases and errors

| Case | Behaviour |
| --- | --- |
| Nope played, nobody else holds one | Resolve at once: the card is stopped |
| Two Nopes in a row | Even count: the original card takes effect |
| Card owner holds a Nope | May Nope a Nope played against their card, never their own card |
| Responder disconnects | Timer closes the window; if they leave, they are removed |
| Owner leaves mid-window | Card dropped, window closed, turn passes per US-017 |
| Game finishes during the window | `pending` cleared by the finish path |
| Favor target noped away their last card | Favor fizzles at resolution |
| Reconnect during a window | Snapshot includes `nopeWindow`, `decision` (if responder), and `nopeDeadlineAt` |

## 4. Verification

| Check | Level |
| --- | --- |
| Odd Nopes stop the card, even Nopes let it through, for all five cards | U |
| Window closes when all responders pass or leave; `EXPIRE_NOPE` resolves it | U |
| Invariants I1 to I8 hold across 10,000 simulated games with random Nope play and leaves | U (US-046) |
| `viewFor` shows `decision` only to responders; no foreign card ids appear | U, I |
| Non-responder `NOPE` or `PASS_NOPE` rejected without state change | I |
| Window timer expires with a silent client; deadline restarts after each Nope | I (fake clock) |
| Bot answers windows without deadlock | I |
| Two clients: Nope, Nope back, effect resolves, log and toasts match | E |
| Dialog focus, Escape, countdown announced, no colour-only cues | A, M |

## 5. Tasks

1. Add `NOPE` to the catalog, deck profile, and types; add `pendingBoomCard`.
2. Move effects to `effects.ts`; add `nope.ts` (window, resolve) and the `NOPE`, `PASS_NOPE`, `EXPIRE_NOPE` actions.
3. Update elimination, `viewFor`, and invariants helpers.
4. Protocol schema, server timer, sweep hook, leak-guard update, bot responses.
5. Client dialog, banner and hint, log and toast text, card badge, rules tour entry.
6. Original SVG icon for the card.

## 6. Dependencies and risks

- Depends on US-011, US-051, US-058, US-060.
- Risk: the response window slows play when a Nope holder is thinking. Mitigation: 8 s default, restart only on a new Nope, and only players holding a Nope are asked.
- Risk: a window reveals that a Nope exists. Mitigation: accepted and documented; who holds it stays hidden.
