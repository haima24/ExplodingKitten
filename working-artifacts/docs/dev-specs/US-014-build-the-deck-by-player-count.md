# Dev spec — US-014 Build the deck by player count

| Item | Value |
| --- | --- |
| Story | [US-014](../user-stories/release-1.0.1/US-014-build-the-deck-by-player-count.md) · Must · Cards and rules |
| Status | Draft v0.1 (proposed) · [Baseline](README.md) |
| Refs | F-03, DAC-04, OQ-04, OQ-06 |
| Area | `packages/engine` (`deck.ts`, `cards.ts`) |

## 1. Goal

Build the right mix of cards for 2–5 players from data, with unique opaque ids, and deal hands. Counts are tunable without changing logic.

## 2. Technical design

### 2.1 Card catalog (`cards.ts`, exported as `engine/cards`)

| Kind | Name | Effect text (≤ 12 words) | Playable | Notes |
| --- | --- | --- | --- | --- |
| `BOOM_CAT` | Exploding Kitten | Draw one and you're out, unless you have a Defuse. | no | `notPlayableReason: boom` |
| `TREAT` | Defuse | Calms an Exploding Kitten so you can stay in. | no | reason: "Defuse cards save you automatically when an Exploding Kitten shows up." |
| `HOP_OVER` | Skip | Skip your draw and end your turn. | yes | |
| `PEEK` | See the Future | Secretly look at the top 3 cards. | yes | |
| `SHAKE_UP` | Shuffle | Shuffle the draw pile. | yes | |
| `COZY_CAT` | Cat card | Play two matching Cat cards to take a random card. | only as a pair (US-065) | reason: "Cat cards are played in pairs. Tap a second matching Cat card!"; 5 designs × 4 |
| `PASS_IT_ON` | Attack | Skip your draw. Next player takes 2 turns. | yes | profile `mvp+should` |
| `ASK_A_FRIEND` | Favor | Pick a player. They give you a card. | yes | profile `mvp+should` |
| `NOPE` | Nope | Stop another player's action card. Play it any time. | no (played only in a response window, US-062) | profile `mvp+should`; `reaction: true`; 5 cards |

A unit test asserts every effect text has ≤ 12 words (US-030).

### 2.2 Deck configuration (data)

```ts
interface DeckProfile { hopOver: 4; peek: 5; shakeUp: 4; cozyDesigns: 5; cozyPerDesign: 4
                        passItOn: 4; askAFriend: 4; nope: 5; treats: 6; startingHandSize: 4 }
```

Since [US-068](US-068-card-counts-names-and-deal.md) there is **one** card set (`mvp+should`, the smaller `mvp` profile is retired) for 2 to 5 players. `treats` is the **total** number of Defuse cards in the game (6): one is dealt to each player and the other `6 − players` go in the draw pile. `peek` (See the Future) is 5.

### 2.3 Algorithm

1. Create the non-special cards (all kinds except `BOOM_CAT`, `TREAT`): 46 cards. Assign ids from the `Rng` (random 32-bit hex strings; regenerate on collision so ids are unique, I8). Shuffle.
2. For each player (seat order) deal 1 Defuse and `startingHandSize` cards from the shuffled non-special cards.
3. Add `treats − players` Defuse cards and `players − 1` Exploding Kittens to the remaining cards; shuffle → `drawPile`.
4. Validate before dealing: players 2–5; `treats ≥ players`; the non-special pool ≥ `players × startingHandSize`; else `INVALID_CONFIG`.

The Exploding Kitten rule (`players − 1`, surplus retired when a player is out) is **unchanged**.

### 2.4 Resulting counts

| Players | Cards in the game | Dealt | Draw pile | Exploding Kittens in it | Defuse in it |
| --- | --- | --- | --- | --- | --- |
| 2 | 53 | 10 | 43 | 1 | 4 |
| 3 | 54 | 15 | 39 | 2 | 3 |
| 4 | 55 | 20 | 35 | 3 | 2 |
| 5 | 56 | 25 | 31 | 4 | 1 |

Draw pile = 46 − 4 × players + (6 − players) + (players − 1) = 51 − 4 × players (for 5 players: 51 − 20 = 31).

## 3. Edge cases and errors

- Card ids never encode kind or position.
- Unknown profile or counts that cannot cover the deal: `INVALID_CONFIG`.
- Changing counts only edits the profile data and the table above (tuning after playtests).

## 4. Verification

| Check | Level |
| --- | --- |
| Counts per player count match the table | U |
| Exploding Kittens = players − 1 (1 for 2 players, 3 for 4) | U |
| Hands hold 1 Defuse + 4 others, no Exploding Kitten | U |
| Ids unique; no id reveals kind | U |
| Effect texts ≤ 12 words; Cat card text present | U |
| Exploding Kittens ≥ players rejected | U |
| Seeded deal reproducible | U |

## 5. Tasks

1. Write the catalog data and the word-count test.
2. Implement `buildDeck` and `deal` with validation.
3. Add the profile data and the counts test.

## 6. Dependencies and risks

- Depends on US-051. Feeds US-005, US-030.
- Risk: balance. Mitigation: data-only tuning; simulation stats (turns per game) tracked in US-046.
