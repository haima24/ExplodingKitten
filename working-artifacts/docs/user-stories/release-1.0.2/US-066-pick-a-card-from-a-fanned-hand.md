# US-066 — Pick a card from a fanned-out hand

[Back to story index](../README.md) | Format: NT user story standard ([UserStoryGeneration.agent.md](../../../../instructions/BA/UserStoryGeneration.agent.md)) | Status: **Draft for review** | Release: **1.0.2** (proposed)

| Field | Value |
| --- | --- |
| Project | Whisker Boom (Exploding Kittens-style family card game, online multiplayer) |
| Module | Cards and game rules; Gameplay UI |
| Audience | Product owner, dev team, QA, UX, accessibility reviewer |
| Source inputs | Team note (Vietnamese): "cái khúc mà rút 1 lá từ player khác, phải làm hiệu ứng xoè bài, lướt qua lướt lại rùi chọn 1 lá để cướp"; current rules and code in `working-artifacts/src/`; [US-065](US-065-cat-card-pairs.md), [US-062](../release-1.0.1/US-062-nope-card.md), [US-063](US-063-turn-timer-and-card-sounds.md), [US-064](US-064-vietnamese-localization.md) |
| Confidence | Medium. The interaction is described by the team; timing, what spectators see, and the timeout rule are proposals (see §12) |

---

## 1. User Story

### User Story ID
US-066

### User Story Name
Pick a card from a fanned-out hand

### Epic
Cards and game rules (interaction)

### User Story
As a **player who has just won a Cat card pair**, I want to **see the other player's hand fanned out face down, sweep across the cards back and forth, and choose the one I want to take**, so that **taking a card feels exciting and in my hands, instead of the game picking one for me.**

### Raw input from the team (kept for traceability; Vietnamese, intent preserved)
- Khúc rút 1 lá từ người chơi khác (the moment you take one card from another player).
- Phải có hiệu ứng xoè bài (a fan-out card effect).
- Lướt qua lướt lại, rồi chọn 1 lá để cướp (swipe back and forth, then pick one card to grab).

### How this relates to the game as built
| Today | Needed |
| --- | --- |
| A Cat card pair ([US-065](US-065-cat-card-pairs.md)) takes **one random card**, chosen by the server instantly. The taker never sees the other hand | The taker **chooses** one face-down card from a fanned-out hand with an animation |
| The only other "take from another hand" is Favor ([US-022](../release-1.0.1/US-022-ask-a-friend-favour-card.md)), where the **target** chooses what to give | Favor is **unchanged** |
| A Nope window runs first and can stop the pair | Unchanged. The fan appears only if the pair **stands** |
| No decision belongs to the thief after the target is chosen | A new step: the thief must pick, with a time limit |

**Change to existing stories:** this story **replaces** [US-065](US-065-cat-card-pairs.md) AC12, AC13 and business rule BR03 ("one random card, chosen by the server") with "a card chosen by the taker from face-down cards". US-065 should be updated when this story is approved (Q8).

---

## 2. Assumptions

| ID | Description | Impact if wrong |
| --- | --- | --- |
| A01 | The fan is shown only for the **Cat card pair** steal. | If Favor should also use it, Favor's rule (target chooses) changes |
| A02 | The taker sees only **face-down backs**, never any card face, and the **number** of cards is the only information they get. | If faces were visible, the pair would be a peek, not a steal |
| A03 | For each steal the **server shuffles the order** of the target's cards before presenting them. A position therefore tells nothing (not the draw order, not the order the target holds them). | Players could learn which slot is the newest card, and choose it every time |
| A04 | The game state does not change during the pick: it is the taker's turn, and the target has no decision to make. | If the target could act, the pick would need to be locked to the state it started with |
| A05 | The taker's chosen position is sent to the server, which maps it to a real card. The client never knows which card is where. | Cheating or leaking if the client held card identities |
| A06 | The pick has a **time limit** (Q3). When it runs out, the server picks one at random. | A player who stalls would block the game |
| A07 | Players who are not the taker see the same fan and **where the taker's finger is, live** (decision, Q1). They never see which card is under it. | More messages are needed (about 5 a second) |

---

## 3. Pre-conditions

| ID | Description |
| --- | --- |
| PR01 | A Cat card pair was played at a target who holds at least one card ([US-065](US-065-cat-card-pairs.md)). |
| PR02 | The Nope window closed and the pair was **not** stopped ([US-062](../release-1.0.1/US-062-nope-card.md)). |
| PR03 | The taker is connected, or the absent-player rule applies ([US-058](../release-1.0.1/US-058-absent-player-during-the-game.md)). |

---

## 4. Workflow / Activity Description

1. The pair stands. The game enters a **pick** step for the taker. Every device shows that "[Taker] is choosing a card from [Target]".
2. On the taker's device the target's cards **fan out** face down in an arc, with a short opening animation and a riffle sound. They gently sway.
3. The taker **sweeps** a finger, pointer or the arrow keys back and forth across the fan. The card under the finger lifts and is highlighted.
4. The taker settles on one card and confirms it (release then **Take this card**, or press Enter).
5. The server turns the chosen position into the real card. The card **flips** and flies into the taker's hand. Only the taker sees the face.
6. Everyone sees "[Taker] took a card from [Target]". The turn goes on as in [US-065](US-065-cat-card-pairs.md).

**Alternate flows**
- *Time runs out:* the server picks a random card and the same flip animation plays.
- *Target has one card:* the fan shows a single card, taken with one tap (or automatically after about one second).
- *Reduced motion:* no sway or flying; the cards show as a still row, with a simple highlight and confirm.
- *Taker disconnects:* the absent-player wait applies, and a random pick happens if the host skips them.

---

## 5. Suggested Mock-up Screens

*Text description. No visual design exists yet; wireframe is TBD.*

| Field / element | Type | Mandatory | Default | Description |
| --- | --- | --- | --- | --- |
| Fan of face-down cards | Interactive arc of card backs | Yes | N cards for N cards in the target's hand | Opens with a short fan animation. At 320 px width the cards overlap and the fan scrolls sideways |
| Highlighted card | Raised card with an outline | Yes | None until the finger moves | Follows the finger, pointer or arrow keys. Not colour-only (lifted, outlined, with a number) |
| "Take this card" | Button | Yes | Disabled until a card is highlighted | Confirms. Large target (≥ 44 px) |
| Countdown | Text | Yes (timer on) | X s | Same clock text as [US-063](US-063-turn-timer-and-card-sounds.md) |
| Heading | Text | Yes | — | "Pick a card from [Target]" for the taker; "[Taker] is choosing a card from [Target]" for everyone else |
| Position label | Text | Yes | "Card 3 of 6" | Read by screen readers and shown on the highlighted card |
| Reveal | Flip animation | — | — | The chosen card flips face up on the taker's device only |

---

## 6. Business Acceptance Criteria

### 6.1 The fan

| AC ID | Description |
| --- | --- |
| AC01 | **Fan opens.** Given the pair stands and the target holds N cards, then on the taker's device N face-down cards fan out with an opening animation and a fan sound. |
| AC02 | **Only backs.** Given the fan, then no card face or hint of a card's identity is shown or sent to the taker. |
| AC03 | **Shuffled slots.** Given the fan, then the order of the cards is shuffled by the server for this steal, so a position never matches the order the target holds or drew the cards. |
| AC04 | **Sweep.** Given the fan, when the taker moves a finger or pointer across it back and forth, then the card under it lifts and is highlighted, and moving away lowers it again. |
| AC05 | **Keyboard and screen reader.** Given the fan, when the taker uses the left and right arrow keys, then the highlight moves one card at a time, wrapping at the ends; each card is announced as "Card 3 of 6, face down", and Enter confirms. |
| AC06 | **Large hands.** Given the target holds many cards (up to 12 or more), then every card can still be reached on a 320 px wide screen, by overlapping the cards and scrolling the fan sideways. |
| AC07 | **Single card.** Given the target holds only one card, then one card is shown and taken with one tap, or automatically after about one second. |

### 6.2 Choosing and taking

| AC ID | Description |
| --- | --- |
| AC08 | **Confirm to take.** Given a card is highlighted, when the taker presses **Take this card** (or Enter), then the choice is sent; before that, nothing is final and the highlight may change. |
| AC09 | **No accidental take.** Given the taker lifts a finger after sweeping, then the card is only highlighted, not taken. |
| AC10 | **The server resolves.** Given a chosen position, then the server picks the real card at that slot and moves it to the taker's hand; the client never knows which card was where. |
| AC11 | **Reveal.** Given the card is taken, then it flips face up in the taker's view and joins their hand, and a toast names it ("You took [card]!") to the taker only. |
| AC12 | **Public record.** Given a take, then everyone sees "[Taker] took a card from [Target]" without the card; the target's hand count drops by one. |
| AC13 | **One pick only.** Given a pick was made, when a second pick arrives, then it is ignored. |

### 6.3 Other players, timer and edge cases

| AC ID | Description |
| --- | --- |
| AC14 | **Others watch live.** Given someone else is picking, then every other device (the target's included) shows an animated fan with "[Taker] is choosing a card from [Target]", and the highlighted card follows the taker's finger live, with no information about which card is under it. |
| AC15 | **Time limit.** Given the pick step runs, then it uses the host's **Turn timer** setting ("Giới hạn thời gian mỗi lượt", [US-063](US-063-turn-timer-and-card-sounds.md)): a fresh clock of that length, shown to everyone; given time runs out, then the server picks one card at random and the take animation plays. |
| AC16 | **Absent taker.** Given the taker is disconnected, then the absent-player rule ([US-058](../release-1.0.1/US-058-absent-player-during-the-game.md)) applies and a random pick happens if the host skips them. |
| AC17 | **Bots.** Given a Bot Buddy is the taker, then it sweeps for about one to two seconds and takes a random card, with the same animation for others. |
| AC18 | **Target leaves.** Given the target leaves or is removed during the pick, then the pick ends with nothing taken and the turn goes on. |
| AC19 | **Rejected requests.** Given a modified client sends a pick when it is not the taker, when there is no pick step, or with a position outside the fan, then the server rejects it with no state change. |
| AC20 | **Reload.** Given the taker reloads during the pick, then the fan reappears with the remaining time, with the same shuffled order. |
| AC21 | **Reduced motion.** Given reduced motion is on ([US-038](../release-1.0.1/US-038-settings-reduced-motion-and-sound.md)), then there is no sway, no sweeping effect and no flying card; the cards show as a still row with a highlight and the same confirm step. |

### 6.4 Sound, voice and language

| AC ID | Description |
| --- | --- |
| AC22 | **Sound.** Given Sound is on, then a riffle plays as the fan opens, a soft tick plays as the highlight changes (at most a few per second), and a flip sound plays on the take, on the taker's device; other devices hear only the fan sound. |
| AC23 | **Voice.** Given Voice-over is on, then the taker hears a short generic line ("Pick a card") and the target hears "A card was taken from you" ([US-064](US-064-vietnamese-localization.md)); no line names a card. |
| AC24 | **Both languages.** Given English or Vietnamese, then all new text and voice lines exist in both. |

---

## 7. Business Rules

| ID | Rule |
| --- | --- |
| BR01 | The taker chooses a **position**, never a card. Only the server knows which card is in each position. |
| BR02 | The order of the face-down cards is shuffled by the server for each steal. |
| BR03 | The taker learns nothing about the target's cards except how many there are, until they take one. |
| BR04 | Only the taker sees the face of the taken card. |
| BR05 | A pick that times out is random, so a stalling player cannot block the game. |
| BR06 | Favor stays as it is: the target chooses what to give. |

---

## 8. Out of Scope

| ID | Description |
| --- | --- |
| OOS1 | Using the fan for Favor or any other card. |
| OOS2 | Letting the taker look at a face (a peek). |
| OOS3 | Showing the face of the card under the taker's finger to anyone but the taker. |
| OOS4 | Haptic feedback. |
| OOS5 | Sound or animation design beyond the described concepts (final art and audio come from UX). |

---

## 9. Non-functional Requirements

*Values marked "proposed" are not from the source input and need confirmation.*

| Requirement | Description |
| --- | --- |
| Smoothness | The fan and the highlight run at an even frame rate on a mid-range phone (proposed target: no dropped frames you can see during the sweep) |
| Responsiveness | The highlight follows the finger within 100 ms (proposed). The take is resolved in one server round trip |
| Fairness and privacy | The shuffle uses the server's random source; no card identity reaches the client before the take; the existing leak check on every update still passes |
| Accessibility | Works by touch, mouse and keyboard ([US-034](../release-1.0.1/US-034-touch-mouse-and-keyboard-parity-with-large-targets.md), [US-035](../release-1.0.1/US-035-keyboard-operation-and-visible-focus.md)); screen-reader labels ([US-036](../release-1.0.1/US-036-screen-reader-support.md)); highlight is not colour-only ([US-037](../release-1.0.1/US-037-colour-independence-and-contrast.md)); no flashing above 3 per second |
| Layout | Fan fits 320 px width and 150 % text size, in English and Vietnamese |
| Reliability | A dropped connection never leaves the game stuck in the pick step: the server resolves it on timeout or when the player is skipped |
| Message volume | Live hovering sends at most about 5 updates per second from the picker (proposed) |

---

## 10. Dependencies

| Dependency | Why |
| --- | --- |
| [US-065](US-065-cat-card-pairs.md) | The pair that leads to the pick; its AC12, AC13 and BR03 change |
| [US-062](../release-1.0.1/US-062-nope-card.md) | The fan appears only after the Nope window |
| [US-063](US-063-turn-timer-and-card-sounds.md) | Pick time limit and sounds |
| [US-064](US-064-vietnamese-localization.md) | Text and voice in both languages |
| [US-058](../release-1.0.1/US-058-absent-player-during-the-game.md) | Absent taker |
| [US-038](../release-1.0.1/US-038-settings-reduced-motion-and-sound.md) | Reduced motion |
| [US-008](../release-1.0.1/US-008-private-hands-on-every-device.md), [US-042](../release-1.0.1/US-042-privacy-by-default.md) | No card identity before the take |
| [US-023](../release-1.0.1/US-023-bot-buddies-fill-empty-seats.md) | Bot takes |

---

## 11. Traceability

| Requirement source | Covered by |
| --- | --- |
| Team: "rút 1 lá từ player khác" | §4, AC08–AC13 |
| Team: "hiệu ứng xoè bài" | AC01, AC02, AC21 |
| Team: "lướt qua lướt lại" | AC04, AC05, AC09 |
| Team: "chọn 1 lá để cướp" | AC08, AC10, AC11 |

---

## 12. Decisions and open questions

### Decisions taken by the product owner
| # | Decision |
| --- | --- |
| D1 | **Live finger for everyone** (Q1): the other players see the highlight move live. |
| D2 | **Time limit** (Q3): the pick uses the existing **Turn timer** setting; with the timer Off there is no limit and no timeout pick. |
| D3 | **No split**: delivered as one story (the proposed split in §13 is not used). |
| D4 | The slot order is reshuffled on every steal (Q4), Favor is unchanged (Q5), tap-then-confirm (Q6), random pick on timeout (Q2), and US-065 is updated (Q8). Release 1.0.2 (Q9). |

### Still open
| # | Area | Question | Owner |
| --- | --- | --- | --- |
| Q7 | Content | Native review of the Vietnamese wording ("Chọn một lá bài của …", "Lấy lá này", "Hãy chọn một lá bài.") | Product owner |

### Original questions (answered above)

| # | Area | Question | Recommendation / default used | Owner |
| --- | --- | --- | --- | --- |
| **Q1** | UX | Should the other players (the target especially) see the taker's finger moving across the fan live? | Show an animated "choosing" fan without the live finger first; live hovering later (OOS3) | Product owner / UX |
| **Q2** | Rules | If time runs out, random pick (as written) or lose the take? | Random pick | Product owner |
| **Q3** | Rules | How long is the pick? | The same X as the turn clock (default 30 s), capped lower if the clock is longer (for example 15 s) | Product owner |
| **Q4** | Fairness | Reshuffle the slots on every steal? | Yes (A03). Without it the newest card is always at the end | Product owner |
| **Q5** | Rules | Does the same fan apply to Favor? | No; the target chooses (BR06) | Product owner |
| **Q6** | UX | Is tap-then-confirm right, or should lifting the finger take the card? | Tap-then-confirm, to avoid accidents (AC09) | UX |
| **Q7** | Content | Wording for "Pick a card" and the voice line in Vietnamese? | Native reviewer | Product owner |
| **Q8** | Process | Update US-065 AC12, AC13 and BR03 when this story is approved? | Yes | BA |
| **Q9** | Release | Is this release 1.0.2 or later? | 1.0.2 (proposed) | Product owner |

---

## 13. Review (INVEST, Definition of Ready)

| Check | Result |
| --- | --- |
| **Independent** | No. It builds on US-065 and the Nope window |
| **Negotiable** | Yes. Timing, spectator view and animation are open |
| **Valuable** | Yes. Makes the steal tense and fun, and gives the player control |
| **Estimable** | Rules part: yes. Animation and gestures: depends on UX design |
| **Small** | **No. Too big for one week.** It adds a new game step, a new message, and a hand-built animation with touch, mouse and keyboard |
| **Testable** | Yes for rules and privacy; the feel of the animation needs UX review |
| DoR | Present, except **priority** (suggested **Should**) and a **wireframe** (TBD) |

**Proposed split (not used, see D3):**
- **US-066a — Pick step (rules):** AC08–AC13, AC15–AC20, AC24. A simple row of face-down cards (no animation) to choose from. Can ship first.
- **US-066b — Fan and sweep animation:** AC01–AC07, AC21, AC22.
- **US-066c — Spectator view:** AC14 (and OOS3 if Q1 is yes).

**Quality notes:** no mechanic beyond the team's description is added except the time limit and the shuffle, both flagged; no hidden information reaches a client before the take (BR01–BR04).
