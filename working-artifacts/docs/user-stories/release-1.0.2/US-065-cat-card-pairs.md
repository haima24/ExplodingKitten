# US-065 — Cat card pairs

[Back to story index](../README.md) | Format: NT user story standard ([UserStoryGeneration.agent.md](../../../../instructions/BA/UserStoryGeneration.agent.md)) | Status: **Draft for review** | Release: **1.0.2** (proposed)

> **Implementation:** built in release 1.0.2 following [the dev spec](../../dev-specs/US-065-cat-card-pairs.md). The spec lists the answers used for the open questions in §12; each can be changed later.

| Field | Value |
| --- | --- |
| Project | Whisker Boom (Exploding Kittens-style family card game, online multiplayer) |
| Module | Cards and game rules |
| Audience | Product owner, dev team, QA |
| Source inputs | Team notes (Vietnamese): "thiếu lá bài mèo? (2 lá, 3 lá với nhau)", "5 kiểu x 4 lá", "bỏ bộ 3 lá, chỉ có bộ 2 lá, vẫn là 5 loại x 4"; current game rules and code in `working-artifacts/src/`; [US-014](../release-1.0.1/US-014-build-the-deck-by-player-count.md), [US-022](../release-1.0.1/US-022-ask-a-friend-favour-card.md), [US-062](../release-1.0.1/US-062-nope-card.md), [US-063](US-063-turn-timer-and-card-sounds.md), [US-064](US-064-vietnamese-localization.md) |
| Confidence | Medium. The rule follows the Exploding Kittens pair. The count (5 designs × 4 cards) and "pairs only" are from the team. Design names, bot behaviour and art are open (see §12) |

---

## 1. User Story

### User Story ID
US-065

### User Story Name
Cat card pairs

### Epic
Cards and game rules

### User Story
As a **player** I want to **play two matching Cat cards together to take a random card from another player**, so that **my Cat cards are useful and I have another way to plan and take risks.**

### Reconciliation with the game as built
| Today | Needed |
| --- | --- |
| Cat cards cannot be played. Selecting one shows "Cat cards just like to cuddle. Pick another card!" (decision OQ-06, [US-014](../release-1.0.1/US-014-build-the-deck-by-player-count.md)) | Cat cards can be played **only as a pair of the same design**. A single Cat card still cannot be played |
| 15 Cat cards: 5 designs × 3 | **20 Cat cards: 5 designs × 4** (team decision). A player can hold up to two pairs of one design |
| The hand selects one card at a time | The hand must let a player select two matching cards as one play |
| Favor is the only card that picks a target | A pair also picks a target |
| Nope can stop any action card ([US-062](../release-1.0.1/US-062-nope-card.md)) | Nope can also stop a pair |

**Update:** the steal is a chosen face-down card, not a random one, from [US-066](US-066-pick-a-card-from-a-fanned-hand.md).

**Decision (team):** the three-of-a-kind combo (name a card) is **not** part of the game. Only pairs exist.

---

## 2. Assumptions

| ID | Description | Impact if wrong |
| --- | --- | --- |
| A01 | "Matching" means the **same design** (one of 5). Two different designs do not make a pair. | If any two Cat cards paired, pairs would be much easier to make; deck balance changes |
| A02 | A pair is **one play**. It does **not** end the turn; the player still draws afterwards, exactly like other action cards. | If it ended the turn, it would be a new kind of card |
| A03 | The stolen card moves to the player's hand **without** the target choosing. A target therefore never has a decision to make, so the turn timer and the absent-player rule ([US-058](../release-1.0.1/US-058-absent-player-during-the-game.md)) need no new step. | If the target should choose, a new decision and timer step are needed |
| A04 | A Nope window opens for a pair as for any action card; an odd number of Nopes stops it and both cards stay in the discard pile. | Pairs would be unstoppable, which is not how Exploding Kittens works |
| A05 | The 5 designs get **names** (see Q1) so they can be told apart without colour and read by screen readers. | Colour-only identification breaks accessibility ([US-037](../release-1.0.1/US-037-colour-independence-and-contrast.md)) |
| A06 | Room capacity stays 4 (OQ-13), so there are 1–3 possible targets. | None for this story |
| A07 | The two cards go to the discard pile and cannot be reused. | None |

---

## 3. Pre-conditions

| ID | Description |
| --- | --- |
| PR01 | A game is in progress and it is my turn, with no pending decision ([US-012](../release-1.0.1/US-012-draw-a-card-to-end-the-turn.md)). |
| PR02 | I hold two or more Cat cards of the same design. |
| PR03 | At least one other active player holds at least one card (the same rule as a Favor target). |

---

## 4. Workflow / Activity Description

**Pair (random steal)**
1. I select a Cat card. The other Cat cards of the same design in my hand show as available to add.
2. I add a second card of that design. The action button changes to **Play pair**.
3. I press it and pick a player to take from (players with no cards are not offered).
4. Both cards go to the discard pile. If another player holds a Nope, the Nope window opens ([US-062](../release-1.0.1/US-062-nope-card.md)).
5. If the pair stands, one random card from that player's hand moves to my hand. I see which card it is. Everyone sees that I took a card from that player, but not which one.

**Alternate flows:** I deselect or tap elsewhere to cancel (no card is played). If time runs out during selection ([US-063](US-063-turn-timer-and-card-sounds.md)), nothing is played and the normal timeout applies.

---

## 5. Suggested Mock-up Screens

*Text description. No visual design exists yet; wireframe is TBD.*

| Field / element | Type | Mandatory | Default | Description |
| --- | --- | --- | --- | --- |
| Cat card design | Name plus symbol on the card | Yes | — | 5 designs, each with a **name** and a distinct symbol, never colour alone (A05, Q1) |
| Pair selection in the hand | Cards with a "selected" mark | — | Single selection | Tapping a second Cat card of the **same design** adds it (at most 2). Other designs are not added, with a short reason |
| Play button label | Text | — | "Play …" | "Play pair" with 2 selected. Disabled with a reason when not playable |
| Target picker | Large avatar buttons | Yes | — | Same pattern as Favor. Only active players with at least one card |
| Pair log line | Text | — | — | "Pip played a pair and took a card from Biscuit" |
| Private result | Toast and screen-reader text | — | — | "You took [card]" shown only to the player who took it |

---

## 6. Business Acceptance Criteria

### 6.1 The deck

| AC ID | Description |
| --- | --- |
| AC01 | **20 Cat cards.** Given a new game, then the deck has 5 Cat designs with 4 cards each (20 in total), in every deck profile that has Cat cards. All other counts are unchanged, so Defuse and Exploding Kitten counts follow [US-014](../release-1.0.1/US-014-build-the-deck-by-player-count.md). |
| AC02 | **Fair deal.** Given the deal, then no starting hand contains an Exploding Kitten, and the deck is still valid for 2 to 4 players with the larger Cat count. |
| AC03 | **Design names.** Given any Cat card, then it shows its design name and symbol, in both languages ([US-064](US-064-vietnamese-localization.md)), and its accessible name includes the design. |

### 6.2 Playing a pair

| AC ID | Description |
| --- | --- |
| AC04 | **A single Cat card is not playable.** Given I select one Cat card, then Play is disabled and the reason says Cat cards are played in pairs. |
| AC05 | **Build a pair.** Given I hold two or more Cat cards of the same design, when I select one and then tap another of the same design, then both are selected and the button reads **Play pair**. |
| AC06 | **Different designs do not pair.** Given I select a Cat card and tap a Cat card of another design, then it is not added, and the screen explains it must be the same design. |
| AC07 | **At most two.** Given I hold three or four of one design, then at most two can be selected at once; I can play a pair now and another pair later. |
| AC08 | **It is my turn only.** Given it is not my turn, then I cannot select a pair to play. |
| AC09 | **Turn continues.** Given I play a pair that stands, then my turn does not end; I may play more cards and I must still draw to end the turn. |
| AC10 | **Cancel.** Given I have selected a pair, when I deselect or tap elsewhere, then nothing is played. |

### 6.3 Taking a random card

| AC ID | Description |
| --- | --- |
| AC11 | **Choose a target.** Given I play a pair, then I pick one active player who holds at least one card. Players with no cards and players who are out are not offered. |
| AC12 | **Choose a card.** Given the pair is not stopped, then I choose one face-down card from the target's hand ([US-066](US-066-pick-a-card-from-a-fanned-hand.md)) and it moves to my hand. I see which card it is; the target and everyone else see only that a card was taken. |
| AC13 | **Server resolves the pick.** Given I chose a face-down position, then the server maps it to the real card; no one can see it in advance. If time runs out the server picks at random. |
| AC14 | **The two cards are spent either way.** Given a pair, then both cards go to the discard pile whether or not a Nope stops it. |

### 6.4 Stopping and edge cases

| AC ID | Description |
| --- | --- |
| AC15 | **Nope.** Given another player holds a Nope, then a Nope window opens ([US-062](../release-1.0.1/US-062-nope-card.md)); given an odd number of Nopes, then no card moves and the pair stays in the discard pile; given an even number, the pair takes effect. |
| AC16 | **No valid target.** Given every other player has no cards, then the pair cannot be played and the reason is shown. |
| AC17 | **Target changes during the Nope window.** Given the target left or ran out of cards while the window was open, then the pair ends quietly with no effect, as Favor does. |
| AC18 | **Absent or disconnected target.** Given the target is disconnected, then the pair still resolves, since they have no decision to make (A03). |
| AC19 | **Timer.** Given the turn timer is running and time ends while I am choosing a target, then nothing is played, the cards stay in my hand, and the normal timeout applies ([US-063](US-063-turn-timer-and-card-sounds.md)). |
| AC20 | **Rejected requests.** Given a modified client sends a pair with cards that are not mine, are of different designs, or a wrong count, or names an invalid target, then the server rejects it with no change to the game. |

### 6.5 Privacy, feedback and help

| AC ID | Description |
| --- | --- |
| AC21 | **Privacy.** Given a pair, then the identity of the taken card is sent only to the player who took it. The target's remaining hand, the draw pile and other hands are never revealed ([US-008](../release-1.0.1/US-008-private-hands-on-every-device.md)). |
| AC22 | **Public record.** Given a pair, then the log and screen-reader announcements say who played it and who the target was. |
| AC23 | **Sound.** Given Sound is on, then a pair plays the Cat card sound that [US-063](US-063-turn-timer-and-card-sounds.md) reserves, for everyone. |
| AC24 | **Both languages and voice.** Given English or Vietnamese is selected, then all new text, including the design names, the button label and log lines, exists in both; new voice lines (a card was taken from you; you took a card) are generic and name no card ([US-064](US-064-vietnamese-localization.md)). |
| AC25 | **Help.** Given How to Play and the card guide, then they explain pairs and how to build one. |
| AC26 | **Keyboard and screen reader.** Given a keyboard or screen reader, then a pair can be built, played, and its target chosen without a pointer, and each selected card and the button label are announced. |
| AC27 | **Bots.** Given a Bot Buddy holds a pair, then it never gets stuck; whether it plays pairs is Q4. |

---

## 7. Business Rules

| ID | Rule |
| --- | --- |
| BR01 | A Cat card is played only as a pair of the **same design**. There is no three-of-a-kind combo. |
| BR02 | A pair is an action card for Nope purposes and for the turn flow: it can be stopped and it does not end the turn. |
| BR03 | The taker chooses a face-down position (US-066); the server turns it into the real card and applies the pair. The client never knows which card is where. |
| BR04 | Only the player who takes a card learns its identity. |
| BR05 | A pair always needs a target who holds at least one card. |
| BR06 | The two cards are always spent, even when the pair is stopped. |

---

## 8. Out of Scope

| ID | Description |
| --- | --- |
| OOS1 | Three-of-a-kind (name a card): removed by the team. |
| OOS2 | The Exploding Kittens "five different cats" combo and any group of four or more. |
| OOS3 | Using a Cat card as a Nope or any other card. |
| OOS4 | New artwork for the 5 designs (a symbol and name are required now; commissioned illustrations later, UI/UX A3). |
| OOS5 | Changes to room capacity or the number of Defuse and Exploding Kitten cards. |

---

## 9. Non-functional Requirements

*Values marked "proposed" are not from the source input and need confirmation.*

| Requirement | Description |
| --- | --- |
| Fairness and privacy | Random choice comes from the server's random source. The existing leak check on every update confirms no hidden card id is sent |
| Responsiveness | A pair uses the same server round trip as Favor; selection feedback is immediate on the device |
| Accessibility | No colour-only cue ([US-037](../release-1.0.1/US-037-colour-independence-and-contrast.md)); pair selection works by keyboard and screen reader ([US-035](../release-1.0.1/US-035-keyboard-operation-and-visible-focus.md), [US-036](../release-1.0.1/US-036-screen-reader-support.md)); touch targets stay large ([US-034](../release-1.0.1/US-034-touch-mouse-and-keyboard-parity-with-large-targets.md)) |
| Layout | The selection and picker fit at 320 px width and 150 % text size, in both languages |
| Reliability | 10,000 simulated games with random pairs keep every game invariant (card conservation, unique ids), including with the larger deck |
| Balance | Pair frequency is checked in playtests; counts remain tunable data ([US-014](../release-1.0.1/US-014-build-the-deck-by-player-count.md)) |

---

## 10. Dependencies

| Dependency | Why |
| --- | --- |
| [US-014](../release-1.0.1/US-014-build-the-deck-by-player-count.md) | Deck counts change from 5 × 3 to 5 × 4; its wording about "not playable" changes |
| [US-011](../release-1.0.1/US-011-select-and-play-an-action-card.md), [US-009](../release-1.0.1/US-009-view-my-hand.md) | Card selection and the hand now support a pair |
| [US-022](../release-1.0.1/US-022-ask-a-friend-favour-card.md) | Target picker pattern |
| [US-062](../release-1.0.1/US-062-nope-card.md) | Nope can stop a pair |
| [US-063](US-063-turn-timer-and-card-sounds.md) | Timer behaviour and the reserved Cat card sound |
| [US-064](US-064-vietnamese-localization.md) | Translation of new text and voice lines |
| [US-008](../release-1.0.1/US-008-private-hands-on-every-device.md), [US-042](../release-1.0.1/US-042-privacy-by-default.md) | Privacy of the taken card |
| [US-023](../release-1.0.1/US-023-bot-buddies-fill-empty-seats.md) | Bot behaviour (Q4) |
| [US-030](../release-1.0.1/US-030-card-guide-and-per-card-help.md), [US-029](../release-1.0.1/US-029-how-to-play-tour.md) | Help content |

---

## 11. Traceability

| Requirement source | Covered by |
| --- | --- |
| Team: "thiếu lá bài mèo? (2 lá, 3 lá với nhau)" | AC04–AC14 (pairs only after the later decision) |
| Team: "5 kiểu x 4 lá" | AC01, AC03 |
| Team: "bỏ bộ 3 lá, chỉ có bộ 2 lá" | BR01, OOS1 |
| Exploding Kittens rules (pair = random steal) | §4, AC11–AC14 |
| OQ-06 (are Cat cards playable?) | This story resolves it: yes, as a pair |

---

## 12. Open Questions (Assumptions to validate), by priority

| # | Area | Question | Recommendation / default used | Owner |
| --- | --- | --- | --- | --- |
| **Q1** | Content | What are the 5 design names and their Vietnamese names? | Use the Exploding Kittens cat names (Tacocat, Hairy Potato Cat, Beard Cat, Rainbow-Ralphing Cat, Cattermelon) with Vietnamese names chosen by the native reviewer; trademark check first (OQ-01) | Product owner |
| **Q2** | Rules | Does "matching" mean the same design? | Yes (A01) | Product owner |
| **Q3** | Rules | Should the target know which card was taken? | The taker sees it; others see only that a card was taken. The target can tell from their hand | Product owner |
| **Q4** | Bots | Do Bot Buddies play pairs? | Yes, occasionally | Product owner |
| **Q5** | Balance | Is 20 Cat cards too many for the 2–3 player decks (hands of 4)? | Playtest; counts are data | Product owner |
| **Q6** | Art | Can 5 distinct symbols be used now and illustrations later? | Yes (OOS4) | UX |
| **Q7** | Release | Is this release 1.0.2 or later? | 1.0.2 (proposed) | Product owner |

---

## 13. Review (INVEST, Definition of Ready)

| Check | Result |
| --- | --- |
| **Independent** | Mostly. It needs the Nope window, the target picker pattern and the deck data, which exist. It changes US-014 counts |
| **Negotiable** | Yes. Names and bot behaviour are proposals |
| **Valuable** | Yes. Gives Cat cards a purpose and adds player interaction |
| **Estimable** | Yes once Q1 is decided |
| **Small** | Borderline. Dropping the three-of-a-kind and its request picker makes it fit one iteration, but it still touches the deck, the engine rules, the protocol and a new hand-selection pattern |
| **Testable** | Yes. Every AC has an observable result |
| DoR: role, goal, value, assumptions, AC, out of scope, NFRs, traceability | Present. **Priority is not set:** suggested **Should** |

**Optional split if it proves too large:**
- **US-065a — Cat card designs and the 5 × 4 deck** (AC01–AC03): names, symbols, counts. Can ship alone with Cat cards still unplayable.
- **US-065b — Play a pair** (AC04–AC27).

**Quality notes:** no mechanic is invented beyond the Exploding Kittens pair; every open decision is in §12; no hidden information in any message (BR04, AC21).
