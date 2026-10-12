# Dev spec — US-065 Cat card pairs

| Item | Value |
| --- | --- |
| Story | [US-065](../user-stories/release-1.0.2/US-065-cat-card-pairs.md) · Should · Cards and game rules |
| Release | 1.0.2 |
| Status | Draft v0.1 (implemented) · [Baseline](README.md) |
| Refs | OQ-06, US-011, US-014, US-022, US-062, US-063, US-064 |
| Area | `packages/engine`, `packages/protocol`, `apps/server`, `apps/client` |

## 1. Goal

Make Cat cards useful: two Cat cards of the same design, played together at another player, take one card from that player's hand, chosen by the taker from face-down cards ([US-066](US-066-pick-a-card-from-a-fanned-hand.md)). No three-of-a-kind. The deck becomes 5 designs × 4 cards (20 Cat cards). The engine stays pure, the server stays authoritative, and the taken card is revealed only to the player who took it.

## 2. Decisions taken for the open questions

| Q | Question | Implemented |
| --- | --- | --- |
| Q1 | Design names | Short Exploding Kittens-style names: Tacocat, Potato Cat, Beard Cat, Rainbow Cat, Cattermelon. Vietnamese: Mèo Taco, Mèo Khoai, Mèo Râu, Mèo Cầu Vồng, Mèo Dưa Hấu (**draft**, native review and trademark check, OQ-01, still needed) |
| Q2 | "Matching" | Same design (`variant`) |
| Q3 | Who knows the card | The taker (private event); everyone sees only that a card was taken |
| Q4 | Bots | Yes: 25 % chance per turn to play a pair when they hold one and a target has cards |
| Q5 | 20 Cat cards balance | Counts are data (`cozyPerDesign`); tune after playtests |
| Q6 | Art | Original symbol per design on the existing sleeping-cat icon; illustrations later (OOS4) |

## 3. Technical design

### 3.1 Engine (`packages/engine`)

- Deck: `cozyPerDesign` is 4 in both profiles (`mvp`, `mvp+should`). All other counts are unchanged. A single Cat card keeps `playable: false`; the catalog gains `pair: true` and new texts ("Play two matching Cat cards to take a random card." and "Cat cards are played in pairs. Tap a second matching Cat card!").
- New player action `PLAY_PAIR { cardIds: [string, string], targetId: string }`.
- `playPair` in `game.ts` checks, in order: it is the player's turn (`NOT_YOUR_TURN`), phase is `turn` (`WRONG_PHASE`), the two ids differ and both are in hand (`CARD_NOT_IN_HAND`), both are `COZY_CAT` of the same `variant` (`NOT_PLAYABLE`), the target is another active player holding at least one card (`INVALID_TARGET`). No new error code.
- On success: both cards go to the discard pile (the first on top), public `CARD_PLAYED { playerId, kind: 'COZY_CAT', cardId, pair: true, targetId, variant }`, then `openWindowOrResolve` with the first card. So the **Nope window works as for any action card** (US-062), and the pair does not end the turn.
- Effect (`effects.ts`, case `COZY_CAT`): if the target is still active and holds a card, the engine opens a `STEAL_PICK` step (see [US-066](US-066-pick-a-card-from-a-fanned-hand.md)): the taker chooses a face-down slot, and the chosen card moves to the actor's hand with public `CARD_STOLEN { fromId, toId }` (no card id) and private `STOLEN_CARD { card }`. A timeout picks a random slot. Otherwise the pair ends quietly (the same re-check Favor does).
- New events: `CARD_STOLEN` (public), `STOLEN_CARD` (private).
- Invariants are unchanged (cards only move between hands and the discard pile). The existing leak scan holds: the stolen card id appears only in the actor's private event and hand.

### 3.2 Protocol and server

- `game.action` accepts `{ type: 'PLAY_PAIR', cardIds: [id, id], targetId }` (zod tuple of two strings, strings capped at 64). The handler injects `playerId` as usual. Dedupe, rate limits and the leak guard apply.
- Bots (`bots.ts`): with probability 25 % per turn, if the bot holds two Cat cards of one design and some active player holds a card, it plays a pair at a random such player. Otherwise it behaves as before.
- The turn timer (US-063) needs no change: selection is client-side, nothing is committed until the target is chosen, and the target makes no decision.

### 3.3 Client (`apps/client`)

- **Names and art:** `cardName(kind, variant?)` returns the design name for a Cat card (`cat.1` … `cat.5` in both catalogs). `Card`, `CardArt`, `CardIcon` and `cardAriaLabel` take a `variant`. `CardIcon` draws a symbol per design (taco, potato, beard, rainbow, melon slice) in the top-left corner, so designs are never told apart by colour alone. Cards show `data-variant`.
- **Selection:** `ui.pairCardId` holds the second card (action `ui/pair`; `ui/select` clears it; a snapshot that no longer holds it clears it). In `Hand`, with a Cat card selected:

| Tap | Result |
| --- | --- |
| Another Cat card of the same design | Becomes the pair (both shown selected) |
| A Cat card of a different design | Message "A pair needs two Cat cards of the same design." |
| A third card of the design | Message "A pair is two cards. Tap one of them to take it out." |
| The pair card again | Removes it from the pair |
| The first card again | Deselects both |

- **Action bar:** with a pair, the primary button reads **Play pair** (Vietnamese: Chơi cặp). Pressing it opens the target picker (the Favor picker with pair wording: "Take a card from who?"; only active players with a card). Choosing a target sends `PLAY_PAIR`. With one Cat card the button stays disabled and explains why; the detail panel shows "Played as a pair". The hint line says "Tap another [design] to make a pair." / "A Cat card needs a matching Cat card to play." / "Tap Play pair, then pick who to take a card from."
- **Feedback:** log "X played a pair of Cat cards on Y" and "X took a card from Y" (log entries are keys, so they re-word on a language change); toast "You took [card]!" for the taker only; the Cat card sound (US-063) plays for everyone; voice lines V19 "You took a card." (taker) and V20 "A card was taken from you." (victim), both in English and Vietnamese, name no card.
- **Help:** the card guide and tour list the Cat card with its pair rule.
- **Copy:** 20 new keys per language; `pnpm lint` keeps English and Vietnamese in step and checks that V19 and V20 have audio files in both languages (regenerate with `scripts/generate-voice.py`).

## 4. Edge cases and errors

| Case | Behaviour |
| --- | --- |
| Single Cat card, Play pressed | Disabled with the reason; a modified client gets `NOT_PLAYABLE` |
| Different designs, same card twice, cards not in hand, wrong count | Rejected by schema or engine, no state change |
| Target has no cards, is out, or is yourself | `INVALID_TARGET` |
| Everyone else has no cards | Button explains "Nobody has a card to share." |
| Nope stops the pair | Both cards stay in the discard pile; nothing moves |
| Target left or emptied their hand during the Nope window | Pair ends quietly |
| Target disconnected | Resolves normally (no decision needed) |
| Turn timer runs out while choosing | Nothing played; normal timeout |
| Owner leaves during the Nope window | Window dropped; the cards were already in the discard pile |
| Four of one design | Two pairs over two plays |
| Reload mid-selection | Selection is local and cleared; hand comes from the snapshot |

## 5. Verification

| Check | Level |
| --- | --- |
| 3,000 simulated games with about 16,000 random pairs, 7,700 invalid pairs, Nopes, timeouts and leaves: all invariants hold, invalid pairs rejected, no leaked hand or pile card ids | U (done) |
| Deck has 20 Cat cards (5 × 4) and valid deals for 2 to 5 players | U |
| Pair: right cards, discard order, target rules, Nope odd and even, fizzles when the target is empty | U |
| `PLAY_PAIR` schema rejects wrong shapes; handler injects `playerId` | I |
| Two clients: select a pair, picker, target, hands change by -1 for both, log lines on both | E (done, headless Chrome) |
| Different-design tap, single-cat hint and disabled Play | E (done) |
| Bot game with pairs finishes without errors | E (done) |
| Third matching card refused (at most two) | E (not hit in the run), M |
| Keyboard and screen reader: group selection and labels | A, M |
| 320 px and 150 % text: five design names fit on the card face | M (names kept short on purpose) |
| Native review of Vietnamese design names and lines | M (required before release) |

## 6. Tasks (all done unless noted)

1. Deck counts and catalog text; `PLAY_PAIR`, events, effect, tests by simulation.
2. Protocol schema, handler, bot behaviour.
3. Design names, symbols, `variant` through the card components.
4. Pair selection, action bar, target picker, hints, log, sounds, voice lines.
5. Docs: US-014, US-040, brief, UI/UX and story text updated for 20 Cat cards and the new message.
6. Open: unit and integration tests (deferred, as agreed); native review; playtest balance.

## 7. Dependencies and risks

- Depends on US-011, US-014, US-022, US-062, US-063, US-064.
- Risk: 20 Cat cards (about 25 % of the deck) make draws feel padded in 2 to 3 player games. Mitigation: counts are data; playtest.
- Risk: a long design name overflows a small card face. Mitigation: short names, wrapping, checked at 390 px; 320 px still to review.
- Risk: a pair reveals nothing public beyond the target, so a player cannot plan around the stolen card. Accepted, as in the set.
