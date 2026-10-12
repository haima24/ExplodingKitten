# US-069 — Bomb explosion and winner trophy animations

[Back to story index](../README.md) | Format: NT user story standard ([UserStoryGeneration.agent.md](../../../../instructions/BA/UserStoryGeneration.agent.md)) | Status: **Draft for review (updated after the product owner's answers)** | Release: **1.0.2** (proposed)

| Field | Value |
| --- | --- |
| Project | Whisker Boom (Exploding Kittens-style family card game, online multiplayer) |
| Module | Gameplay UI; Victory |
| Audience | Product owner, dev team, QA, UX, accessibility reviewer |
| Source inputs | Team notes (Vietnamese): "mỗi khi có người chơi bị nổ, hiện hoạt ảnh tên của người trên đó kèm trái bom sau đó phát nổ" and "cuối game, hiện 1 hoạt ảnh của người chơi chiến thắng kèm tên nhận cúp"; current rules and code in `working-artifacts/src/`; [US-017](../release-1.0.1/US-017-draw-a-boom-cat-without-a-treat-player-is-out.md), [US-025](../release-1.0.1/US-025-victory-screen.md), [US-038](../release-1.0.1/US-038-settings-reduced-motion-and-sound.md), [US-063](US-063-turn-timer-and-card-sounds.md), [US-064](US-064-vietnamese-localization.md), [US-067](US-067-vietnamese-player-names.md) |
| Confidence | Medium. The two moments are described by the team. Timing, whether input is blocked, and how it fits the gentle tone are proposals (see §12) |

---

## 1. User Story

### User Story ID
US-069

### User Story Name
Bomb explosion and winner trophy animations

### Epic
Gameplay UI · Victory, leaving, and rematch

### User Story
As a **player in a game** I want to **see a short, fun animation when someone blows up (their name with a bomb that explodes) and when someone wins (the winner's name on a trophy)**, so that **the two biggest moments of the game feel dramatic and shared by everyone, not just a line of text.**

### How this relates to the game as built
| Today | Needed |
| --- | --- |
| When a player draws an Exploding Kitten without a Defuse, **only that player** sees a dialog "Oh no, an Exploding Kitten popped!" with **OK** ([US-017](../release-1.0.1/US-017-draw-a-boom-cat-without-a-treat-player-is-out.md)). Others get a log line, a toast and a sound | **Everyone** sees an animation: the player's name with a bomb, then the bomb explodes |
| At the end of the game a victory screen shows the winner's avatar and "[Name] wins the round!" with confetti ([US-025](../release-1.0.1/US-025-victory-screen.md)) | Before the victory screen, **everyone** sees an animation of the winner receiving a **trophy with their name** |
| The wording rule in US-017 and US-025: gentle, no "lose", "dead", "die" or violent imagery; being out feels like a nap | **Decision:** the explosion animation does **not** have to stay gentle; it can be a real, lively explosion. The out player's **OK** dialog from US-017 stays after it |

---

## 2. Assumptions

| ID | Description | Impact if wrong |
| --- | --- | --- |
| A01 | The explosion animation is for an **Exploding Kitten that eliminates a player** (no Defuse). It is **not** shown for a player who leaves, is removed or is skipped, and not when a Defuse saves a player. | If other eliminations or the Defuse moment should have an animation, more variants are needed (Q2) |
| A02 | Both animations are **shown on every device at about the same moment**, started by the same game event. They never change the **result** of the game (who is out, who wins), but the game **waits** for them: the next turn starts after the animation time (decision, AC25). | The server must know the fixed animation time |
| A03 | The explosion lasts about **3 seconds** and the trophy animation about **4 seconds** (proposed), then the usual screen follows. | Too long becomes annoying, too short is missed |
| A04 | Each animation can be **skipped** with a tap, click or key press, by each player on their own device. | If skipping is not allowed, a player could be stuck watching |
| A05 | The animations show the **name in the viewer's language** ([US-067](US-067-vietnamese-player-names.md)) and the player's avatar. | None |
| A06 | The out player still gets the nap message and **OK** from [US-017](../release-1.0.1/US-017-draw-a-boom-cat-without-a-treat-player-is-out.md) **after** the animation (Q3). | If the dialog is replaced, US-017 changes |
| A07 | Animations missed because of a reload, reconnect or a hidden tab are **not replayed**; the board and the victory screen show the true state. | None |
| A08 | The explosion is dramatic but has **no gore or realistic injury** (a bright blast, smoke, shake, the name card scorched). | Only a safe default; the team may relax it |

---

## 3. Pre-conditions

| ID | Description |
| --- | --- |
| PR01 | A game is in progress ([US-005](../release-1.0.1/US-005-start-a-game-and-deal-cards.md)). |
| PR02 | For the explosion: a player drew an Exploding Kitten and holds no Defuse. |
| PR03 | For the trophy: the game ends with one winner ([US-025](../release-1.0.1/US-025-victory-screen.md)). |

---

## 4. Workflow / Activity Description

**A. Explosion (every device)**
1. A player draws an Exploding Kitten and has no Defuse. The game announces it to everyone.
2. A **spotlight card** appears over the board with the player's **avatar and name** and a cartoon **bomb with a burning fuse** next to it. A fuse sizzle plays (if Sound is on).
3. The fuse burns for about one second. The bomb **explodes** (a bright puff, a short shake, a boom). The name card fades and the player's chip shows the out marker.
4. The animation closes and play goes on. The out player then sees the nap message and **OK** ([US-017](../release-1.0.1/US-017-draw-a-boom-cat-without-a-treat-player-is-out.md)).

**B. Winner (every device)**
1. One player remains and wins. The game announces the winner to everyone.
2. A **trophy** appears and rises into view. The winner's **avatar and name** are shown on or beside it, as the one who receives the trophy. Confetti and a fanfare play.
3. After about four seconds the usual **victory screen** appears with the recap and **Play again** ([US-025](../release-1.0.1/US-025-victory-screen.md)).

**Both:** if the explosion eliminates the second-last player, the explosion plays first and then the trophy animation, never together.

---

## 5. Suggested Mock-up Screens

*Text description. No visual design exists yet; wireframe and art are TBD (UX).*

| Field / element | Type | Mandatory | Default | Description |
| --- | --- | --- | --- | --- |
| Spotlight overlay | Full-board overlay, not a normal dialog | Yes | Dimmed board behind | Centred card with avatar, name and bomb. Does not hide the player row for long |
| Name | Text | Yes | — | The player's name in the viewer's language; long names wrap |
| Bomb | Original cartoon SVG | Yes | — | Round bomb with a lit fuse; no realistic violence |
| Explosion | Animation | Yes | — | A bright starburst with a short shake. A static starburst under reduced motion |
| Trophy | Original cartoon SVG | Yes | — | A cup with a plate showing the winner's name |
| Winner | Avatar plus name | Yes | — | Shown with the trophy, plus confetti |
| Skip hint | Small text | Yes | "Tap to skip" | Shown after the first second; also available by keyboard (Enter or Escape) |
| Screen-reader text | Hidden live text | Yes | — | "[Name] exploded" / "[Name] wins the round" announced once |

---

## 6. Business Acceptance Criteria

### 6.1 Explosion

| AC ID | Description |
| --- | --- |
| AC01 | **Shown to everyone.** Given a player draws an Exploding Kitten and has no Defuse, then every device, including the out player's, shows the spotlight animation with that player's avatar and name next to a bomb. |
| AC02 | **Fuse then blast.** Given the animation, then the bomb's fuse burns for about one second, then the bomb explodes with a starburst, a short shake and a boom, then the animation closes (total about 3 s, A03). |
| AC03 | **Name in the viewer's language.** Given the animation, then the name is shown in that device's language ([US-067](US-067-vietnamese-player-names.md)), wrapping if long, and is never cut off. |
| AC04 | **Only for an Exploding Kitten.** Given a player is out by leaving, removal or being skipped, or a Defuse saves a player, then no explosion animation plays. |
| AC05 | **The board catches up.** Given the animation ends, then the player's chip shows the out marker, the Exploding Kitten is in the discard pile, and the game moves to the next player as in [US-017](../release-1.0.1/US-017-draw-a-boom-cat-without-a-treat-player-is-out.md). |
| AC06 | **Nap message.** Given I am the out player, then after the animation I see the message and **OK** from US-017 (A06). |
| AC07 | **One at a time.** Given two players are out in quick succession, then the animations play one after another, never overlapping. |
| AC08 | **A lively explosion.** Given the animation, then the bomb goes off with a proper dramatic blast (flash, smoke, shake and a loud boom), without gore or realistic injury (A08). The gentle-wording rule of US-017 does not apply to the animation. |

### 6.2 Winner trophy

| AC ID | Description |
| --- | --- |
| AC09 | **Shown to everyone.** Given the game ends with a winner, then every device shows the trophy animation with the winner's avatar and name on or beside the trophy, with confetti and a fanfare. |
| AC10 | **Then the victory screen.** Given the animation ends (about 4 s, A03) or is skipped, then the victory screen of [US-025](../release-1.0.1/US-025-victory-screen.md) appears with the recap and the host's **Play again**. |
| AC11 | **My own win.** Given I am the winner, then the animation says it is me ("Bạn thắng rồi!" / "You won!") and the trophy is handed to my name. |
| AC12 | **Last one standing.** Given the game ends because all other players left or were removed, then the remaining player still gets the trophy animation. |
| AC13 | **No trophy for an ended game.** Given the host ends the game for everyone ([US-028](../release-1.0.1/US-028-game-menu-leave-game-and-end-game-with-confirmation.md)), then there is no winner and no trophy animation. |
| AC14 | **After an explosion.** Given the explosion eliminates the second-last player, then the explosion animation plays first, then the trophy animation. |
| AC15 | **Names.** Given the trophy, then the winner's name is in the viewer's language, wraps if long, and the plate stays readable at 320 px and 150 % text. |

### 6.3 Both animations: access, sound and edge cases

| AC ID | Description |
| --- | --- |
| AC16 | **Skip.** Given either animation, when I tap, click, or press Enter or Escape, then it ends at once on my device only. |
| AC17 | **Reduced motion.** Given reduced motion is on ([US-038](../release-1.0.1/US-038-settings-reduced-motion-and-sound.md)), then there is no movement: a still card with the name and bomb, a static starburst when it "explodes", and a still trophy with the name, shown for the same time or until skipped. |
| AC18 | **Safe visuals.** Given any animation, then nothing flashes more than 3 times per second. |
| AC19 | **Sound.** Given Sound is on, then the explosion plays a fuse sizzle and then the boom, and the trophy plays a fanfare; given Sound is off, then no audio plays and nothing is lost ([US-063](US-063-turn-timer-and-card-sounds.md)). |
| AC20 | **Voice.** Given Voice-over is on, then the existing lines ("you are out", "a player is out", "you won", "game over, congratulations to the winner") play after the animation starts and never name a card ([US-064](US-064-vietnamese-localization.md)). |
| AC21 | **Screen readers.** Given a screen reader, then "[Name] blew up" or "[Name] wins the round" is announced once, and the animation itself is hidden from assistive technology. |
| AC22 | **The result is not affected.** Given an animation is running, then who is out and who wins is exactly what the server decided; skipping or missing the animation changes nothing about the result. |
| AC23 | **Reload and reconnect.** Given a player reloads or reconnects, then they do not see a replay; they see the true board or the victory screen. |
| AC24 | **Hidden tab.** Given the page is in a background tab, then the animation does not play and nothing is queued. |
| AC25 | **The game waits.** Given an animation is showing, then the next turn does not start until the animation's fixed time (about 3 s for the explosion) has passed: the next player cannot act, and their turn clock ([US-063](US-063-turn-timer-and-card-sounds.md)) starts only afterwards. This holds for every player, even for someone who skipped the animation on their own device. |
| AC26 | **Both languages.** Given English or Vietnamese, then all text in the animations exists in both. |

---

## 7. Business Rules

| ID | Rule |
| --- | --- |
| BR01 | The explosion animation is shown only when an Exploding Kitten eliminates a player. |
| BR02 | The trophy animation is shown only when the game ends with a winner. |
| BR03 | Both are shown to every device. They never change who is out or who wins, but the game waits for the animation time before the next turn starts. |
| BR04 | The explosion may be dramatic but has no gore; no text mocks the player who blew up. |
| BR05 | Each player may skip each animation on their own device. |
| BR06 | Animations play one at a time, in the order the events happened. |

---

## 8. Out of Scope

| ID | Description |
| --- | --- |
| OOS1 | An animation for a Defuse save, a Nope or other cards. |
| OOS2 | Animations for leaving, removal or skipping. |
| OOS3 | Replays, recordings or sharing the winner clip. |
| OOS4 | A trophy shop, ranks or any prize outside the game. |
| OOS5 | Final art and audio production beyond the described concepts (UX and audio own them). |

---

## 9. Non-functional Requirements

*Values marked "proposed" are not from the source input and need confirmation.*

| Requirement | Description |
| --- | --- |
| Duration | Explosion about 3 s and trophy about 4 s (proposed); both skippable |
| Smoothness | Plays smoothly on a mid-range phone without hiding the game for longer than its duration (proposed: no visible dropped frames) |
| Accessibility | Reduced motion, no flashing above 3 per second, skip by pointer and keyboard, screen-reader text ([US-035](../release-1.0.1/US-035-keyboard-operation-and-visible-focus.md), [US-036](../release-1.0.1/US-036-screen-reader-support.md), [US-038](../release-1.0.1/US-038-settings-reduced-motion-and-sound.md)) |
| Layout | Name card and trophy plate fit 320 px width and 150 % text, in both languages |
| Size | Art is inline SVG and CSS; no large downloads (proposed: no new file over 30 KB) |
| Privacy | No new data; the animation uses only public information |

---

## 10. Dependencies

| Dependency | Why |
| --- | --- |
| [US-017](../release-1.0.1/US-017-draw-a-boom-cat-without-a-treat-player-is-out.md) | The out moment; its dialog moves after the animation |
| [US-025](../release-1.0.1/US-025-victory-screen.md) | The victory screen that follows the trophy |
| [US-067](US-067-vietnamese-player-names.md) | Names in the viewer's language |
| [US-063](US-063-turn-timer-and-card-sounds.md), [US-064](US-064-vietnamese-localization.md) | Sounds, voice lines, text |
| [US-038](../release-1.0.1/US-038-settings-reduced-motion-and-sound.md) | Reduced motion and sound settings |
| [US-068](US-068-card-counts-names-and-deal.md) | New card names used in any text |
| [US-028](../release-1.0.1/US-028-game-menu-leave-game-and-end-game-with-confirmation.md), [US-043](../release-1.0.1/US-043-reconnect-and-rejoin-my-seat.md) | Ended games and reconnecting |

### Changes to existing stories (to apply when this story is approved)
- **US-017:** "everyone else sees [Name] is taking a nap" becomes the explosion animation for everyone; the out player's dialog (with **OK**) follows it. The gentle-wording rule no longer applies to the animation.
- **US-063:** the turn clock for the next turn starts after the animation time (AC25).
- **US-025:** the trophy animation comes before the victory screen.

---

## 11. Traceability

| Requirement source | Covered by |
| --- | --- |
| Team: "mỗi khi có người chơi bị nổ, hiện hoạt ảnh tên của người trên đó kèm trái bom sau đó phát nổ" | AC01–AC08 |
| Team: "cuối game, hiện 1 hoạt ảnh của người chơi chiến thắng kèm tên nhận cúp" | AC09–AC15 |
| Product owner: tone not limited to gentle; keep the OK dialog; the clock waits | AC06, AC08, AC25, A06 |
| Accessibility rules | AC16–AC18, AC21 |

---

## 12. Decisions and open questions

### Decisions taken by the product owner
| # | Decision |
| --- | --- |
| D1 | **Tone:** the explosion does not have to be gentle or cartoon-only. A proper dramatic explosion is fine (a no-gore default is assumed, A08). |
| D2 | **Keep the out player's OK dialog** after the animation. |
| D3 | **The turn clock waits** during the animation (the game waits for the animation time). |

### Still open
| # | Area | Question | Recommendation / default used | Owner |
| --- | --- | --- | --- | --- |
| **Q1** | Tone | Confirm the no-gore default (A08), or allow stronger imagery? | No gore; a bright blast with smoke | Product owner |
| **Q2** | Scope | Should a Defuse save, or a removal or skip, also have a short animation? | No (A01, OOS1, OOS2) | Product owner |
| **Q3** | Time | Are 3 s for the explosion and 4 s for the trophy right? The server now waits for them | Test with families | Product owner |
| **Q4** | UX | Should the trophy plate show the name only, or also the number of turns or Defuse used? | Name only | UX |
| **Q5** | Release | Is this release 1.0.2 or later? | 1.0.2 (proposed) | Product owner |

---

## 13. Review (INVEST, Definition of Ready)

| Check | Result |
| --- | --- |
| **Independent** | Yes. It depends only on the existing out and victory flows |
| **Negotiable** | Yes. Timing, art and the tone are open |
| **Valuable** | Yes. Makes the two biggest moments memorable and shared |
| **Estimable** | Yes once the art and Q4 are decided |
| **Small** | Borderline. Two animations with art, sound, accessibility and skip. It could be split into the explosion (§6.1) and the trophy (§6.2) |
| **Testable** | Yes for behaviour (who sees what, when, skip, reduced motion, order); the feel of the animation needs UX review |
| DoR | Present, except **priority** (suggested **Should**) and a **wireframe** (TBD) |

**Quality notes:** who is out and who wins is not changed by an animation (AC22), but the game now waits for the animation time (AC25), which the server must know about. The old gentle-tone rule no longer limits the explosion (D1). No new data is collected.
