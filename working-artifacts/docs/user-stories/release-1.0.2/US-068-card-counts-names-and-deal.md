# US-068 — Card counts, new card names and the opening deal

[Back to story index](../README.md) | Format: NT user story standard ([UserStoryGeneration.agent.md](../../../../instructions/BA/UserStoryGeneration.agent.md)) | Status: **Draft for review (updated after the product owner's answers)** | Release: **1.0.2** (proposed)

| Field | Value |
| --- | --- |
| Project | Whisker Boom (Exploding Kittens-style family card game, online multiplayer) |
| Module | Cards and game rules; Localization; Sound |
| Audience | Product owner, dev team, QA, Vietnamese-speaking reviewer, audio |
| Source inputs | Team notes (Vietnamese): the card list with Vietnamese names and counts ("giữ tổng 56 lá"), "đổi tên và âm thanh tương ứng", the opening-deal rule ("mỗi người chơi được chia 4 lá bất kì và thêm 1 lá gỡ bom … 56 lá, không bỏ ra bớt"); the product owner's answers ("luật số lá mèo nổ giữ như cũ. ý mình là các lá defuse"; names in sentence case; new sounds wanted); current rules and code in `working-artifacts/src/`; [US-014](../release-1.0.1/US-014-build-the-deck-by-player-count.md), [US-005](../release-1.0.1/US-005-start-a-game-and-deal-cards.md), [US-015](../release-1.0.1/US-015-draw-a-boom-cat-and-use-a-treat.md), [US-017](../release-1.0.1/US-017-draw-a-boom-cat-without-a-treat-player-is-out.md), [US-063](US-063-turn-timer-and-card-sounds.md), [US-064](US-064-vietnamese-localization.md), [US-065](US-065-cat-card-pairs.md) |
| Confidence | Medium. The counts, names and deal rule are from the team. The effect on the "56 cards" total and the new sound concepts are proposals (see §12) |

---

## 1. User Story

### User Story ID
US-068

### User Story Name
Card counts, new card names and the opening deal

### Epic
Cards and game rules

### User Story
As a **player** I want **the game to use the team's card set (6 Defuse, 5 See the Future and the other counts), dealt as 4 random cards plus a Defuse each with everything else in the draw pile, with card names and sounds that match**, so that **the game is easy to understand, every card has a clear name and sound, and no card is left out except the surplus Exploding Kittens as today.**

### How this relates to the game as built
| Today | Needed |
| --- | --- |
| Defuse in the game = players + 2 (4, 5, 6 for 2, 3, 4 players) | **Always 6 Defuse**: 1 dealt to each player, the other **6 − players** in the draw pile |
| See the Future ×4 | **×5** |
| Skip 4, Attack 4, Shuffle 4, Favor 4, Nope 5, Cat cards 20 | Same |
| Exploding Kittens = **players − 1**; when a player is out, a surplus kitten is retired | **Unchanged** (product owner decision) |
| A smaller `mvp` deck profile exists | Retired: one card set (A02) |
| Opening deal: 1 Defuse + 4 other cards each; extras and kittens in the draw pile | The same rule, with the new counts |
| Vietnamese names: Mèo Nổ Tung, Bỏ Qua, Vả, Nhờ Vả, Không!, Tiên Tri | **New names** (table below) |
| Voice lines and card sounds are written around the old names | Updated, and new sound effects for the renamed cards (§6.3) |

### About the number 56
The team's card list adds up to **56 cards when 4 Exploding Kittens are counted** (6 + 4 + 4 + 4 + 4 + 5 + 5 + 20 = 52 other cards, plus 4 kittens). The product owner decided the **Exploding Kitten rule stays as it is** (players − 1). So the cards actually in a game are **52 plus (players − 1) kittens: 53, 54 or 55**. 56 is the size of the full set and would be reached only with 4 kittens in play (Q1).

---

## 2. Assumptions

| ID | Description | Impact if wrong |
| --- | --- | --- |
| A01 | The 20 remaining cards are the **Cat cards** (5 designs × 4), as in [US-065](US-065-cat-card-pairs.md). The team's list does not mention them. | If a different number is wanted, the totals change |
| A02 | One card set is used for 2, 3 and 4 players. The smaller `mvp` profile is retired. | If a short set must stay, a second set of counts is needed |
| A03 | The Exploding Kitten rule is **unchanged**: kittens in the deck = players − 1, and the surplus-kitten retiring when a player is out stays as today. | None (decision) |
| A04 | The "4 random cards" are drawn from the 46 cards that are not Exploding Kittens and not Defuse (52 − 6), so no one starts with a kitten or an extra Defuse (as in [US-005](../release-1.0.1/US-005-start-a-game-and-deal-cards.md)). | A kitten in a starting hand would be an unfair start |
| A05 | The English card names do not change; only the Vietnamese names change. | None |
| A06 | New sound effect concepts in §6.3 are **proposals** for the audio owner to approve (Q3). | The sounds may be different |

---

## 3. Pre-conditions

| ID | Description |
| --- | --- |
| PR01 | A room has 2 to 4 players and the host presses **Start game** ([US-005](../release-1.0.1/US-005-start-a-game-and-deal-cards.md)). |
| PR02 | Vietnamese text and voice exist ([US-064](US-064-vietnamese-localization.md)). |
| PR03 | A native Vietnamese reviewer and the audio owner are available to approve names, lines and sounds. |

---

## 4. Workflow / Activity Description

1. The host starts the game. The server builds the deck: **52 cards that are always in the game** (6 Defuse and 46 others) plus **players − 1 Exploding Kittens**.
2. For each player, the server puts **1 Defuse** in their hand and deals them **4 random cards** from the 46 cards that are not kittens or Defuse.
3. **All other cards** go to the shared draw pile, shuffled by the server: the Exploding Kittens, the **6 − players** remaining Defuse, and the rest of the 46. **No card is left out.**
4. Every device shows its own hand (5 cards) and the draw pile count. The first player is chosen as today.

| Players | Cards in the game | Dealt (5 each) | Draw pile | Exploding Kittens in it | Defuse in it |
| --- | --- | --- | --- | --- | --- |
| 2 | 53 | 10 | 43 | 1 | 4 |
| 3 | 54 | 15 | 39 | 2 | 3 |
| 4 | 55 | 20 | 35 | 3 | 2 |

---

## 5. Suggested Mock-up Screens

*Text description. No new screen is needed; these elements show the new names and counts.*

| Field / element | Type | Mandatory | Default | Description |
| --- | --- | --- | --- | --- |
| Draw pile count | Text on the pile | Yes | 43, 39 or 35 at the start | By player count, as in §4 |
| Hand | Cards | Yes | 5 cards | The Defuse and 4 cards, shown by name and icon in the selected language |
| Card guide and tour | Text and card list | Yes | New names and counts | Lists all 9 card types with the counts below |
| Card names | Text | Yes | See table | Same names on the card face, detail panel, dialogs, log, announcements and help |

### The card set and the names

| Card (EN, unchanged) | Count in a game | Vietnamese name now | **New Vietnamese name** |
| --- | --- | --- | --- |
| Exploding Kitten | players − 1 (the full set has 4) | Mèo Nổ Tung | **Mèo nổ** |
| Defuse | 6 | Gỡ Bom | **Gỡ bom** |
| Skip | 4 | Bỏ Qua | **Qua lượt** |
| Attack | 4 | Vả | **Tấn công** |
| Shuffle | 4 | Xáo Bài | **Xáo bài** |
| Favor | 4 | Nhờ Vả | **Thiện ý** |
| Nope | 5 | Không! | **Không** |
| See the Future | 5 | Tiên Tri | **Xem trước tương lai** |
| Cat cards (5 designs × 4) | 20 | (design names, [US-065](US-065-cat-card-pairs.md)) | unchanged |

*Capitalisation: sentence case (decision).*

---

## 6. Business Acceptance Criteria

### 6.1 The deck

| AC ID | Description |
| --- | --- |
| AC01 | **Card counts.** Given a new game with N players (2 to 4), then the deck has exactly: Defuse ×6, Skip ×4, Attack ×4, Shuffle ×4, Favor ×4, Nope ×5, See the Future ×5, Cat cards ×20, and Exploding Kitten ×(N − 1): 53, 54 or 55 cards. |
| AC02 | **Defuse is always 6.** Given 2, 3 or 4 players, then there are 6 Defuse in the game: N dealt (one each) and 6 − N in the draw pile. |
| AC03 | **Nothing is lost.** Given any game, then the sum of cards in hands, the draw pile, the discard pile and any card being played always equals the deck total, from the deal to the end of the game. |
| AC04 | **Kitten rule unchanged.** Given a player is out, then the surplus-kitten rule works as today (Exploding Kittens stay equal to active players − 1). |
| AC05 | **Unique cards.** Given the deal, then every card has a unique id that does not reveal its kind or position. |
| AC06 | **Invalid setup.** Given a setup that cannot build or deal this deck (misconfiguration), then the server fails with a clear error and the room shows the error screen ([US-041](../release-1.0.1/US-041-unexpected-error-recovery.md)). |

### 6.2 The opening deal

| AC ID | Description |
| --- | --- |
| AC07 | **5 cards each.** Given the host starts the game, then every player holds exactly 5 cards: 1 Defuse and 4 other cards. |
| AC08 | **Random cards.** Given the 4 other cards, then they are chosen at random by the server from the 46 cards that are not Exploding Kittens and not Defuse, and differ from game to game. |
| AC09 | **No kitten, no spare Defuse.** Given any starting hand, then it holds no Exploding Kitten and exactly one Defuse. |
| AC10 | **Everything else in the draw pile.** Given the deal is complete, then every card not dealt is in the draw pile (43, 39 or 35 cards), shuffled by the server, and the draw pile count shows on every device. |
| AC11 | **Fair and private.** Given the deal, then each player sees only their own hand and the order of the draw pile is never sent to any device ([US-008](../release-1.0.1/US-008-private-hands-on-every-device.md)). |
| AC12 | **First player.** Given the deal, then "Everyone has cards! [Name] goes first" shows as today. |
| AC13 | **Rematch.** Given the host starts a rematch ([US-026](../release-1.0.1/US-026-host-starts-a-rematch.md)), then a new deck is built and dealt in the same way. |

### 6.3 Names, sounds and voice

| AC ID | Description |
| --- | --- |
| AC14 | **New names everywhere.** Given Vietnamese is selected, then each card shows its new name from §5 on the card face, detail panel, dialogs, discard pile label, log, toasts, screen-reader text, How to Play and the card guide. No old name remains. |
| AC15 | **Spoken lines.** Given Voice-over is on, then every line that mentions a card uses the new name, and the audio is re-made to match ([US-064](US-064-vietnamese-localization.md)). Proposed wording: |

| Line | Trigger | New Vietnamese line (draft) | Was |
| --- | --- | --- | --- |
| V06 | Attack played, others | "Tấn công! Người tiếp theo phải đi hai lượt." | "Vả! …" |
| V06a | Attack played, the next player | "Tấn công! Bạn phải đi hai lượt." | "Vả! …" |
| V07 | Skip played | "Qua lượt!" | "Bỏ qua lượt!" |
| V08 | See the Future played | "Xem trước tương lai: bạn thấy ba lá bài trên cùng." | "Tiên tri: …" |
| V10 | Favor: asked for a card | "Thiện ý: bạn được nhờ một lá bài. Hãy chọn một lá." | "Bạn được nhờ …" |
| V13 | Exploding Kitten drawn, with a Defuse | "Mèo nổ! Hãy gỡ bom." | "Mèo nổ tung! …" |
| V14 | Defuse used | "Đã gỡ bom!" | unchanged |

| AC ID | Description |
| --- | --- |
| AC16 | **New sound effects for the renamed cards.** Given Sound is on, then each renamed card has a sound that fits its new name, still distinct from every other card ([US-063](US-063-turn-timer-and-card-sounds.md)). Proposed concepts (Q3) are in the table below. |
| AC17 | **English unchanged.** Given English is selected, then card names and English lines are unchanged. |
| AC18 | **Counts in help.** Given the card guide and How to Play, then they show the card counts of this story. |
| AC19 | **Release check.** Given a release build, then an automated check fails if a card has no Vietnamese name, a voice line contains an old name, or the deck counts differ from AC01. |

| Card (new name) | Sound today (US-063) | Proposed new concept |
| --- | --- | --- |
| Mèo nổ | Cat yowl, then a cartoon blast | Cat yowl, then a **bigger blast** with a rumble (matches the animation in [US-069](US-069-explosion-and-winner-animations.md)) |
| Qua lượt | Quick whoosh and a hop | A fast **"pass-on" swish** ending in a soft "next" tick |
| Tấn công | Funny slap and wobble (matched the old name "Vả") | A strong **strike**: a sharp whoosh and a heavy impact with a short echo |
| Thiện ý | Three rising "pretty please" notes | A **warm, kind** soft chime of two rising notes |
| Không | Firm "uh-uh" buzzer | Same concept, kept |
| Xem trước tương lai | Mysterious shimmer | Same concept, kept |
| Gỡ bom, Xáo bài, Cat cards | Existing | Unchanged |

---

## 7. Business Rules

| ID | Rule |
| --- | --- |
| BR01 | A game uses 6 Defuse, 4 Skip, 4 Attack, 4 Shuffle, 4 Favor, 5 Nope, 5 See the Future, 20 Cat cards and (players − 1) Exploding Kittens. |
| BR02 | Each player starts with 1 Defuse and 4 random other cards (never a kitten); all remaining cards go to the shared, server-shuffled draw pile. |
| BR03 | The Exploding Kitten rule (players − 1, surplus retired when a player is out) does not change. |
| BR04 | The English names do not change; the Vietnamese names follow §5. |
| BR05 | The server alone builds, deals and shuffles the deck. |

---

## 8. Out of Scope

| ID | Description |
| --- | --- |
| OOS1 | Changing the Exploding Kitten rule or the game's other rules (turn flow, Nope, pairs). |
| OOS2 | New artwork. |
| OOS3 | More than 4 players. |
| OOS4 | Letting the host choose a deck. |
| OOS5 | Renaming the Cat card designs ([US-065](US-065-cat-card-pairs.md)). |
| OOS6 | Producing the final sound files (the audio owner does it from the approved concepts). |

---

## 9. Non-functional Requirements

*Values marked "proposed" are not from the source input and need confirmation.*

| Requirement | Description |
| --- | --- |
| Fairness | The shuffle and the random hands use the server's random source; a test deal with a fixed seed is repeatable |
| Integrity | Every action keeps the card total and the unique ids; checked after every action in tests and by the server's own integrity check |
| Simulation | 10,000 simulated games per player count finish with no broken rule |
| Localization | New names and lines fit on card faces, buttons and the log at 320 px width and 150 % text ([US-064](US-064-vietnamese-localization.md) AC22) |
| Sound | Each new effect is short and starts with the same speed as the existing ones ([US-063](US-063-turn-timer-and-card-sounds.md)); size is checked against the existing budget |
| Privacy | No change to what is sent to a device |

---

## 10. Dependencies

| Dependency | Why |
| --- | --- |
| [US-014](../release-1.0.1/US-014-build-the-deck-by-player-count.md) | Replaced: counts change as in §5 |
| [US-005](../release-1.0.1/US-005-start-a-game-and-deal-cards.md) | The deal wording: Defuse in the pile is 6 − players, not 2 |
| [US-065](US-065-cat-card-pairs.md) | The 20 Cat cards |
| [US-063](US-063-turn-timer-and-card-sounds.md), [US-064](US-064-vietnamese-localization.md) | Sounds, voice lines, Vietnamese names |
| [US-029](../release-1.0.1/US-029-how-to-play-tour.md), [US-030](../release-1.0.1/US-030-card-guide-and-per-card-help.md) | Help text and counts |
| [US-069](US-069-explosion-and-winner-animations.md) | The "Mèo nổ" sound is shared with the explosion animation |
| Product brief §C4 and [user-stories.md](../../../user-stories.md) | Card counts shown in the documents |

### Changes to existing stories (to apply when this story is approved)
- **US-014:** Defuse in the game becomes 6 for every player count; See the Future becomes 5; the smaller `mvp` set is retired.
- **US-005:** "2 extra Defuse cards" in the draw pile becomes "the remaining Defuse (6 − players)".
- **US-015 to US-017:** unchanged (the kitten rule stays).
- **US-063 and US-064:** Vietnamese names, voice lines and the new sound effects as in §6.3.

---

## 11. Traceability

| Requirement source | Covered by |
| --- | --- |
| Team: the card list and counts | AC01, AC02, BR01 |
| Team: "giữ tổng 56 lá" | §1 "About the number 56", Q1 |
| Product owner: "luật số lá mèo nổ giữ như cũ. ý mình là các lá defuse" | A03, AC02, AC04, BR03 |
| Team: "đổi tên và âm thanh tương ứng" | §5, AC14–AC16, AC19 |
| Team: "mỗi người được chia 4 lá bất kì và thêm 1 lá gỡ bom; tất cả lá còn lại vào xấp bài chung" | AC07–AC10, BR02 |

---

## 12. Decisions and open questions

### Decisions taken by the product owner
| # | Decision |
| --- | --- |
| D1 | **Exploding Kitten rule unchanged** (players − 1). The team's note about 6 Defuse and the full list applies to the other cards, mainly Defuse. |
| D2 | **Names in sentence case**, for example "Xem trước tương lai". |
| D3 | **New sound effects are wanted** for the renamed cards. |

### Still open
| # | Area | Question | Recommendation / default used | Owner |
| --- | --- | --- | --- | --- |
| **Q1** | Rules | The set adds up to 56 only with 4 kittens in play. With the kitten rule unchanged, a game has 53, 54 or 55 cards. Is that what is wanted? | Yes (the full set stays 56; the unused kittens are not in the game, as today) | Product owner |
| **Q2** | Balance | 2 and 3 player games now have 4 and 3 spare Defuse in the draw pile (before: 2), so surviving a kitten is easier and games may be longer. Acceptable? | Playtest and tune; counts are data | Product owner |
| **Q3** | Sound | Are the proposed sound concepts in §6.3 right, especially a strong strike for Tấn công instead of the slap? | Audio owner produces drafts for approval | Product owner / audio |
| **Q4** | Content | Native review of the new names and lines ("Thiện ý", "Không" and "Xem trước tương lai" on a small card and in the Nope dialog) | Reviewer | Product owner |
| **Q5** | Release | Is this release 1.0.2 or later? | 1.0.2 (proposed) | Product owner |

---

## 13. Review (INVEST, Definition of Ready)

| Check | Result |
| --- | --- |
| **Independent** | Mostly. It changes counts, names and sounds; [US-069](US-069-explosion-and-winner-animations.md) shares only the "Mèo nổ" sound |
| **Negotiable** | Yes. The sound concepts and the totals (Q1) are open |
| **Valuable** | Yes. One clear card set with names and sounds that match the team's wording |
| **Estimable** | Yes once Q3 is decided |
| **Small** | Borderline. Counts and deal are small; renaming, re-making voice lines and new sounds touch many places. It could be split into counts and deal (AC01–AC13) and names, voice and sound (AC14–AC19) |
| **Testable** | Yes. Counts and totals are exact; sound quality needs a listening review |
| DoR | Present, except **priority** (suggested **Should**) |

**Quality notes:** the list was checked: 6 + 4 + 4 + 4 + 4 + 5 + 5 + 20 = 52 other cards; with (players − 1) kittens the totals are 53, 54 and 55 (Q1). The Exploding Kitten rule is not changed, so US-015 to US-017 stand. No hidden information is sent (AC11).
