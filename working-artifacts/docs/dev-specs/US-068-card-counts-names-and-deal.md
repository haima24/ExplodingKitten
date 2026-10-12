# Dev spec — US-068 Card counts, new card names and the opening deal

| Item | Value |
| --- | --- |
| Story | [US-068](../user-stories/release-1.0.2/US-068-card-counts-names-and-deal.md) · Should · Cards and game rules; Localization; Sound; Card artwork |
| Release | 1.0.2 |
| Status | Draft v0.1 (implemented) · [Baseline](README.md) |
| Refs | US-005, US-014, US-063, US-064, US-065, US-069 |
| Area | `packages/engine`, `packages/protocol`, `apps/server`, `apps/client` |

## 1. Goal

One card set for 2 to 5 players (6 Defuse, 5 See the Future and the other counts), dealt as 1 Defuse plus 4 random cards each with everything else in the draw pile; new Vietnamese card names, spoken lines, sound effects and pictures that match. The Exploding Kitten rule (players − 1) is unchanged.

## 2. Decisions

| # | Decision |
| --- | --- |
| D1 | Exploding Kittens stay at **players − 1** (surplus retired when a player is out). The team's "6" applies to Defuse |
| D2 | Names in sentence case: Mèo nổ, Gỡ bom, Qua lượt, Tấn công, Xáo bài, Thiện ý, Không, Xem trước tương lai |
| D3 | New sound effects for the renamed cards |
| D4 | Card pictures: Qua lượt, Tấn công and Thiện ý redrawn; Mèo nổ gets a bigger burst and a fuse spark |
| D5 | **Up to 5 players** (was 4). The full 56-card set is in play with 5 players |
| D6 | The smaller `mvp` profile is retired: one set |

## 3. Technical design

### 3.1 Engine (`packages/engine`)

- `MAX_PLAYERS` is **5** (`deck.ts`). `createGame` and `buildDeal` accept 2 to 5 players.
- `DeckProfileName` is now only `'mvp+should'`. The `DECK_PROFILES` entry is: Skip 4, See the Future **5**, Shuffle 4, Cat cards 5 × 4, Attack 4, Favor 4, Nope 5, `treats: 6`, hand 4. `extraTreats` is replaced by `treats` (the **total** Defuse count).
- `buildDeal`: each hand gets 1 Defuse and 4 cards from the 46 non-kitten, non-Defuse cards; the rest receives `treats − players` Defuse and `players − 1` Exploding Kittens and is shuffled. Validation: `treats ≥ players` and enough non-special cards for the hands (`INVALID_CONFIG` otherwise).
- Nothing else changes: kitten retiring, invariants I1 to I8 and the card-conservation check hold for the new totals.

| Players | Cards in the game | Dealt | Draw pile | Kittens in it | Defuse in it |
| --- | --- | --- | --- | --- | --- |
| 2 | 53 | 10 | 43 | 1 | 4 |
| 3 | 54 | 15 | 39 | 2 | 3 |
| 4 | 55 | 20 | 35 | 3 | 2 |
| 5 | 56 | 25 | 31 | 4 | 1 |

### 3.2 Server and protocol

- `ROOM_CAPACITY` defaults to **5** (`config.ts`); `DECK_PROFILE` accepts only `mvp+should` (the server refuses to start otherwise). The lobby, join and add-bot checks already use the capacity.
- Bot Buddies: a fourth robot avatar (`bot-4`) so a room with a host and four bots has distinct robot pictures; bot names beyond three repeat with a number as before.

### 3.3 Names and spoken lines (client)

- `copy/vi.ts`: every string and card entry uses the new Vietnamese names (about 40 strings: hints, dialogs, log, rules, errors). Short verbs in the log changed too: "đã qua lượt!" (Skip) and "đã tấn công người tiếp theo!" (Attack). English is unchanged.
- Six spoken lines were re-worded and their audio **re-made**: V06 and V06a ("Tấn công! …"), V07 ("Qua lượt!"), V08 ("Xem trước tương lai: …"), V10 ("Thiện ý: …"), V13 ("Mèo nổ! Hãy gỡ bom."). `generate-voice.py` gained `--only vi:V06,V06a,…` so only those six files changed.
- **Release check** (`pnpm lint`, `check-copy.mjs`): fails if any Vietnamese string still contains an old card name (Mèo Nổ Tung, Gỡ Bom, Bỏ Qua, Tiên Tri, Nhờ Vả, Vả), in addition to the existing checks (English and Vietnamese keys match, every name word has a Vietnamese form, every voice line has a file in both languages).

### 3.4 Sound effects (`lib/audio.ts`, all synthesised, no files)

| Card | New concept |
| --- | --- |
| Mèo nổ | Yowl, then a **bigger blast** (low-passed noise sweep, crackle and a sub-bass thump). Also used by the explosion animation (US-069) |
| Qua lượt | A fast **pass-on swish** that ends in two soft "next" ticks |
| Tấn công | A whoosh, then a **heavy strike** (sharp noise hit, low thud, a short echo) instead of the slap that matched "Vả" |
| Thiện ý | A **warm chime**: two rising notes with soft octave shimmer |
| Không, Xem trước tương lai, Gỡ bom, Xáo bài, Cat cards | Unchanged |
| (new) fuse | A one-second sizzle with crackles, played before the blast (US-069) |

### 3.5 Card pictures (`features/game/art/CardIcon.tsx`)

| Card | Picture |
| --- | --- |
| Mèo nổ | The startled cat in front of a bigger two-layer burst, plus a fuse and a spark |
| Qua lượt | A paw on an arc jumping over a small "next turn" marker (a yellow token with a play triangle) |
| Tấn công | Three claw slashes over an impact star, with the "2" badge for the double turn |
| Thiện ý | A paw below a pink heart, with two sparkles |
| Others | Unchanged |

All are original inline SVG in the existing palette, decorative (`aria-hidden`); the card name is text beside them. They contain no words, only the digit "2" and the "z z" of the sleeping cat.

## 4. Edge cases and errors

| Case | Behaviour |
| --- | --- |
| 6th player joins | `ROOM_FULL` |
| 5 players | 4 kittens, 1 spare Defuse in the pile, 56 cards |
| A player is out | Surplus kitten retired as before; the total in hands, piles and discard stays constant |
| `DECK_PROFILE=mvp` | Server refuses to start with a clear message |
| A Vietnamese string with an old name | `pnpm lint` fails |
| A voice line without a file | `pnpm lint` fails |

## 5. Verification

| Check | Level |
| --- | --- |
| Deal for 2, 3, 4 and 5 players: totals 53, 54, 55, 56; piles 43, 39, 35, 31; each hand 1 Defuse + 4 others, no kitten; counts per kind match the story | U (done, script) |
| 3,000 simulated games with 2 to 5 players, pairs, picks, timeouts, Nopes and leaves: every invariant holds, invalid actions rejected, no hidden card leaked | U (done) |
| Lobby shows "n of 5"; a 3-player game starts with a 39-card pile and 5 cards each | E (done) |
| Bot game finishes with no errors | E (done) |
| `pnpm lint` catches a missing name word and an old card name | automated (done for the name words) |
| New names, six voice lines and the three icons reviewed by the native speaker, UX and audio | M (**required before release**) |
| 5 players at 320 px and 150 % text: chips, banner, pickers, victory screen | M (chip row scrolls; not yet checked with five humans) |
| Listening check of the new sound effects | M |

## 6. Tasks (all done unless noted)

1. Engine deck set, 5 players, kept the kitten rule; simulations.
2. Server capacity and profile; a fourth bot avatar.
3. Vietnamese names and verbs; six voice lines and audio; release check for old names.
4. New and changed sound effects; four card pictures.
5. Docs: US-014, US-005, US-055, US-060, product brief and UI/UX updated for 2 to 5 players and the new counts.
6. Open: native review; listening review; 5-human layout check; unit and integration tests (deferred, as agreed).

## 7. Dependencies and risks

- Depends on US-005, US-014, US-063, US-064, US-065; shares the blast sound with US-069.
- Risk: 2 and 3 player games have more spare Defuse (4 and 3 in the pile, before 2), so games may run longer; a 5-player game has 4 kittens and 1 spare Defuse and may feel harsher. Mitigation: counts are data in `deck.ts`; playtest.
- Risk: five players on a phone. Mitigation: the player row scrolls and has an indicator-free hidden scrollbar; to be checked on real devices.
- Risk: drafted Vietnamese names or audio sound wrong. Mitigation: all text is in `vi.ts`, audio is regenerated by one command.
