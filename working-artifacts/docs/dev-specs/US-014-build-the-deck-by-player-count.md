# Dev spec — US-014 Build the deck by player count

| Item | Value |
| --- | --- |
| Story | [US-014](../user-stories/US-014-build-the-deck-by-player-count.md) · Must · Cards and rules |
| Status | Draft v0.1 (proposed) · [Baseline](README.md) |
| Refs | F-03, DAC-04, OQ-04, OQ-06 |
| Area | `packages/engine` (`deck.ts`, `cards.ts`) |

## 1. Goal

Build the right mix of cards for 2–4 players from data, with unique opaque ids, and deal hands. Counts are tunable without changing logic.

## 2. Technical design

### 2.1 Card catalog (`cards.ts`, exported as `engine/cards`)

| Kind | Name | Effect text (≤ 12 words) | Playable | Notes |
| --- | --- | --- | --- | --- |
| `BOOM_CAT` | Boom Cat | Draw one and you're out, unless you have a Treat. | no | `notPlayableReason: boom` |
| `TREAT` | Treat | Calms a Boom Cat so you can stay in. | no | reason: "Treats save you automatically when a Boom Cat shows up." |
| `HOP_OVER` | Hop Over | Skip your draw and end your turn. | yes | |
| `PEEK` | Peek | Secretly look at the top 3 cards. | yes | |
| `SHAKE_UP` | Shake Up | Shuffle the draw pile. | yes | |
| `COZY_CAT` | Cozy Cat | Just likes to cuddle. No effect. | no (OQ-06) | reason: "Cozy Cats just like to cuddle. Pick another card!"; 5 designs |
| `PASS_IT_ON` | Pass It On | Skip your draw. Next player takes 2 turns. | yes | profile `mvp+should` |
| `ASK_A_FRIEND` | Ask a Friend | Pick a player. They give you a card. | yes | profile `mvp+should` |

A unit test asserts every effect text has ≤ 12 words (US-030).

### 2.2 Deck configuration (data)

```ts
interface DeckProfile { hopOver: 4; peek: 4; shakeUp: 4; cozyDesigns: 5; cozyPerDesign: 3
                        passItOn?: 4; askAFriend?: 4; extraTreats: 2; startingHandSize: 4 }
```

Profile `mvp` omits Pass It On and Ask a Friend; `mvp+should` includes them.

### 2.3 Algorithm

1. Create the non-special cards (all kinds except `BOOM_CAT`, `TREAT`). Assign ids from the `Rng` (random 32-bit hex strings; regenerate on collision so ids are unique, I8). Shuffle.
2. For each player (seat order) deal 1 Treat and `startingHandSize` cards from the shuffled non-special cards.
3. Add `extraTreats` Treats and `players − 1` Boom Cats to the remaining cards; shuffle → `drawPile`.
4. Validate before dealing: players 2–4; Boom Cats < players; the non-special pool ≥ `players × startingHandSize`; else `INVALID_CONFIG`.

### 2.4 Resulting counts (MVP profile)

| Players | Non-special | Dealt | Treats total | Boom Cats | Draw pile size |
| --- | --- | --- | --- | --- | --- |
| 2 | 27 | 8 | 4 | 1 | 22 |
| 3 | 27 | 12 | 5 | 2 | 19 |
| 4 | 27 | 16 | 6 | 3 | 16 |

Draw pile = non-special − dealt + extra Treats + Boom Cats (for 4 players: 27 − 16 + 2 + 3 = 16).

## 3. Edge cases and errors

- Card ids never encode kind or position.
- Unknown profile or counts that cannot cover the deal: `INVALID_CONFIG`.
- Changing counts only edits the profile data and the table above (tuning after playtests).

## 4. Verification

| Check | Level |
| --- | --- |
| Counts per player count match the table | U |
| Boom Cats = players − 1 (1 for 2 players, 3 for 4) | U |
| Hands hold 1 Treat + 4 others, no Boom Cat | U |
| Ids unique; no id reveals kind | U |
| Effect texts ≤ 12 words; Cozy Cat text present | U |
| Boom Cats ≥ players rejected | U |
| Seeded deal reproducible | U |

## 5. Tasks

1. Write the catalog data and the word-count test.
2. Implement `buildDeck` and `deal` with validation.
3. Add the profile data and the counts test.

## 6. Dependencies and risks

- Depends on US-051. Feeds US-005, US-030.
- Risk: balance. Mitigation: data-only tuning; simulation stats (turns per game) tracked in US-046.
