# US-01 — Turn timer and card sound effects

[Back to story index](README.md) | Format: NT user story standard ([UserStoryGeneration.agent.md](../../../instructions/BA/UserStoryGeneration.agent.md)) | Status: **Draft for review**

| Field | Value |
| --- | --- |
| Project | Whisker Boom (Exploding Kittens-style family card game, online multiplayer) |
| Module | Gameplay and turn management; Responsive UI and accessibility |
| Audience | Product owner, dev team, QA, accessibility reviewer |
| Source inputs | Team note (Vietnamese, see §1); existing stories [US-007](US-007-show-whose-turn-it-is-and-each-player-s-status.md), [US-012](US-012-draw-a-card-to-end-the-turn.md), [US-021](US-021-pass-it-on-extra-turn-attack-card.md), [US-038](US-038-settings-reduced-motion-and-sound.md), [US-052](US-052-sound-effects-muted-by-default.md), [US-058](US-058-absent-player-during-the-game.md), [US-062](US-062-nope-card.md); current code in `working-artifacts/src/` |
| Confidence | Medium. Rules and current behaviour are confirmed from the code. Timer values, timeout behaviour and sound design are **proposals** awaiting decisions (see §12). |

---

## 1. User Story

### User Story ID
US-01 (see Open question Q11 about the ID)

### User Story Name
Turn timer and card sound effects

### Epic
Gameplay and turn management (timer) · Responsive UI and accessibility (sound)

### User Story
As a **player in a multiplayer room** I want **each turn to have a visible time limit, and every card to make its own sound when it is played** so that **the game keeps moving without anyone stalling, and every card feels fun and is easy to recognise by ear.**

### Raw input from the team (kept for traceability; Vietnamese, intent preserved)
- Giả sử có 5 người chơi (assume a 5-player game).
- Mỗi người có X giây để suy nghĩ; trong lượt, chọn đánh bài hoặc rút bài (each player has X seconds to think; on their turn they play a card or draw).
- Hết X giây mà không có hành động thì tự động chuyển sang người tiếp theo, "next" (after X seconds with no action the game moves to the next player).
- Lá Attack gọi là "vả": khi đánh ra và chọn mục tiêu thì phát âm thanh "vả vào mặt" hài hước (Attack is nicknamed "vả" (slap); when played and a target is chosen, play a funny slap sound).
- Mỗi loại bài khi đánh ra có âm thanh riêng, ví dụ lá "tiên tri" (See the Future) phát âm thanh huyền bí (every card type has its own sound, e.g. See the Future plays a mysterious sound).

### Reconciliation of the raw input with the game as built
| Team statement | What the game actually does | How this story handles it |
| --- | --- | --- |
| "5 players" | A room holds **at most 4** players (OQ-13); the deck is built for 2–4 ([US-014](US-014-build-the-deck-by-player-count.md)). | Rules are written for **any player count the game supports**. 5-player scenarios apply only once capacity is raised (A01, Q1). |
| "Play a card **or** draw" | A turn is *optionally play any number of cards, then draw to end the turn* ([US-012](US-012-draw-a-card-to-end-the-turn.md)). Drawing is what ends a turn. | The timer covers the whole turn. The timeout result is an open question (Q2) with a recommendation. |
| "Attack: when a target is chosen" | **Attack has no target.** It ends the turn without drawing and the **next active player** takes 2 turns ([US-021](US-021-pass-it-on-extra-turn-attack-card.md)). **Favor** is the only card where a target is chosen. | The slap sound plays when Attack is played. The "target" is the next player, who is highlighted. Q4 asks whether the team wants a different design. |
| "Next" on timeout | Not defined today. There is no turn timer; only a Nope window (8 s) and the absent-player wait (60 s). | Defined in the acceptance criteria below. |
| Sounds | [US-052](US-052-sound-effects-muted-by-default.md) (Could) already has 5 synthesized sounds (draw, play, Exploding Kitten, out, win). All cards share one "play" sound. Sound is off by default. | This story extends US-052 with one sound per card. Muted-by-default is kept (Q6). |

---

## 2. Assumptions

| ID | Description | Impact if wrong |
| --- | --- | --- |
| A01 | The timer must work for every supported player count (2–4 today). The 5-player case is covered once the room capacity and deck for 5 players are approved. That change is outside this story. | If 5 players is a hard launch requirement, a separate story is needed first (capacity, deck counts, layout). |
| A02 | Default time per turn **X = 30 seconds** (proposal; no value was given). | Too short frustrates children; too long lets the game drag. Easy to change if it is configuration, not code. |
| A03 | The timer is **host-configurable per game** in the lobby with the values **Off, 15 s, 30 s, 60 s**, and the choice applies to the whole game. | If it must be fixed, drop the lobby control (AC02 changes). |
| A04 | The **server is authoritative** for time (consistent with [US-060](US-060-real-time-room-server-authoritative.md)); clients only display the countdown using the server clock offset. | None for players; guards against clock cheating. |
| A05 | Bots (US-023) act within about 1–2 seconds and need no timer. | If bots can be slow, apply the same timer. |
| A06 | Sound stays **off by default** and is a per-device setting, as in US-038/US-052. | If sound should be on by default, the autoplay and consent rules need revisiting. |
| A07 | Card sounds are **original** (synthesized or produced for the project). No third-party or copyrighted samples (OQ-09). | Licensing exposure if third-party audio is used. |
| A08 | The existing audio module (Web Audio synthesis, loaded only after sound is turned on) can be extended. Final format is open (Q9). | NFR file-size limits apply only if recorded samples are chosen. |

---

## 3. Pre-conditions

| ID | Description |
| --- | --- |
| PR01 | A game is in progress with at least 2 active players ([US-005](US-005-start-a-game-and-deal-cards.md)). |
| PR02 | For the timer: the host chose a time other than **Off** in the lobby ([US-055](US-055-lobby-with-host-controls.md)). |
| PR03 | For sound: the player turned **Sound** on in Settings on this device (user gesture done) ([US-038](US-038-settings-reduced-motion-and-sound.md)). |
| PR04 | The Nope response window ([US-062](US-062-nope-card.md)) and absent-player handling ([US-058](US-058-absent-player-during-the-game.md)) exist and keep their own timers. |

---

## 4. Workflow / Activity Description

**A. Turn timer (main flow)**
1. A turn starts (including each of the 2 turns after an Attack). The server sets a deadline = now + X and every device shows the countdown.
2. The active player plays zero or more cards and then draws. Drawing ends the turn and the countdown stops.
3. At 5 seconds left, a warning cue appears (visual always; sound and voice only if enabled).
4. At 0 seconds with no draw, the **timeout rule** (Q2, recommended: auto-draw) runs, everyone sees "[Name] ran out of time", and the turn passes on as it normally would.

**Alternate flows:** the clock **pauses** during a Nope window and while a player is disconnected (the [US-058](US-058-absent-player-during-the-game.md) wait takes over); it **restarts at full X** when the next turn begins or when the player returns. A pending decision of the active player (Exploding Kitten position) or of another player (Favor card choice) has its own countdown of X seconds.

**B. Card sound (main flow)**
1. A card is played; the server announces it to everyone.
2. Each device with Sound on plays that card's own sound at once, together with the existing visual cue and log line.
3. If a Nope stops the card, the Nope sound plays, followed by a short "fizzle" cue. The stopped card's sound is not repeated.

---

## 5. Suggested Mock-up Screens

*Text description. No visual design exists yet; wireframe is TBD.*

| Field / element | Type | Mandatory | Default | Description |
| --- | --- | --- | --- | --- |
| Turn timer (lobby) | Single choice (host only) | Yes | 30 s | Off / 15 s / 30 s / 60 s. Shown to all players read-only after the game starts. |
| Countdown (turn banner) | Text + progress bar | Shown when timer ≠ Off | X s | "Biscuit has 24 s". Seconds are always text; bar is secondary. Visible to every player, on every device. Updates once per second. |
| Warning state | Text + icon | Auto | At 5 s left | "Hurry! 5 s". Not colour-only. No flashing faster than 3 per second. |
| Timeout message | Toast + log line | Auto | — | "[Name] ran out of time". Neutral wording, no blame ([US-058](US-058-absent-player-during-the-game.md) tone). |
| Sound toggle | Choice (exists) | No | Off | Existing in Settings. |
| Volume | Slider 0–100 % | No | 40 % (current level) | Applies to all effects. Keyboard operable. Shows the value as text. |
| Sound-off indicator | Icon + text label in game top bar | Auto | Visible when Sound is off | "Sound off". Tapping opens Settings. Tells players why they hear nothing. |
| "Tap to turn on sound" notice | Inline banner | Auto | Hidden | Shown only when Sound is on but the browser blocked audio. Never blocks play. |

---

## 6. Business Acceptance Criteria

### 6.1 Turn timer

| AC ID | Description |
| --- | --- |
| AC01 | **Default.** Given a new room, when the host opens the lobby, then **Turn timer** shows **30 s** (A02). |
| AC02 | **Configurable.** Given I am the host in the lobby, when I choose Off, 15 s, 30 s or 60 s, then every player sees the choice, and it stays fixed after the game starts. Given I am not the host, then the control is read-only. |
| AC03 | **Visible to all.** Given a turn is running with a timer, then every player on every device sees whose turn it is and the seconds left, as text, updated each second. |
| AC04 | **Timer Off.** Given the timer is Off, then no countdown or timeout appears and turns behave exactly as today. |
| AC05 | **Normal play.** Given I draw before time runs out, then the countdown stops, my turn ends and the next player's countdown starts at full X. |
| AC06 | **Warning.** Given 5 seconds are left, then a warning shows on every device. A screen reader announces it once (not every second). With Sound on, a warning cue plays on the active player's device only. |
| AC07 | **Timeout, recommended behaviour (Q2).** Given X seconds pass with no draw, then the server draws a card for the active player on their behalf, the turn ends as if they had drawn, and everyone sees "[Name] ran out of time". Cards played earlier in the turn stay played. |
| AC08 | **Timeout draws an Exploding Kitten.** Given the automatic draw is an Exploding Kitten and the player holds a Defuse, then the Defuse is used automatically and the kitten goes back at a random position (Q3). Given there is no Defuse, then the player is out as in [US-017](US-017-draw-a-boom-cat-without-a-treat-player-is-out.md). |
| AC09 | **Timeout during a decision.** Given the player is in the Exploding Kitten position dialog, when X seconds pass, then the kitten is placed at a random position and the turn ends. Given a player is choosing which card to give for a Favor, when X seconds pass, then the server gives a random card from their hand (Q3). |
| AC10 | **Choosing a target when time runs out.** Given I am selecting the target of a Favor (before the card is committed), when time runs out, then nothing is played, the card stays in my hand, and AC07 applies. |
| AC11 | **Attack, 2 turns.** Given I am the target of an Attack and must take 2 turns, then each turn gets its own full X. A timeout in the first turn uses up that turn only, and the second turn starts with a fresh X. |
| AC12 | **Nope window.** Given a card is played and a Nope window opens, then the turn clock pauses for the window and resumes with the time that was left when the window closes. The Nope window keeps its own countdown ([US-062](US-062-nope-card.md)). |
| AC13 | **Disconnected player.** Given the active player loses their connection, then the turn clock pauses, everyone sees the "Waiting for [Name] to come back…" banner ([US-058](US-058-absent-player-during-the-game.md)), and on return the clock restarts at full X (Q5). |
| AC14 | **Bots.** Given the active player is a Bot Buddy, then no countdown is shown for it and it acts on its own. |
| AC15 | **Server decides.** Given a modified client claims time is up or sends a draw late, then the server's clock is the only authority: early timeout requests are ignored; a draw that arrives after the server deadline has already been resolved by the timeout. |
| AC16 | **Last two players and end of game.** Given only one player remains or the game finishes, then all countdowns stop. |
| AC17 | **Reconnect display.** Given I reload or rejoin mid-turn, then I see the correct seconds left (from the server deadline, not restarted). |
| AC18 | **Accessibility of time.** Given the timer is on, then a player can still be warned without sound or colour, and the host can turn the timer Off for players who need more time. |

### 6.2 Card sounds

One sound per card type. Concepts below are design intent, to be produced and reviewed (Q7). Vietnamese card names are provisional, defined in [US-02](US-02-vietnamese-localization.md).

| Card (EN) | Tên thẻ (VI, provisional) | Sound concept | Trigger moment | Heard by |
| --- | --- | --- | --- | --- |
| Exploding Kitten | Mèo Nổ Tung | Rising cat yowl, fuse hiss, then a cartoon blast | Public reveal: Defuse used or player out. The drawer's own device also plays it at the draw (existing behaviour). | Everyone (public reveal) |
| Defuse | Gỡ Bom | Quick "snip" and a relieved chime | Defuse is used | Everyone |
| Skip | Bỏ Qua | Fast "whoosh" with a small hop | Skip is played | Everyone |
| See the Future | Tiên Tri | **Mysterious**: rising, shimmering glissando with a soft echo | See the Future is played | Everyone. **Never** includes or hints at which cards were seen |
| Shuffle | Xáo Bài | Rapid card riffle | Shuffle is played | Everyone |
| Cat card | Thẻ Mèo | Soft purr | **No trigger today**: Cat cards are not playable (OQ-06). The sound is reserved for when they become playable. | — |
| Attack | Vả | **Funny slap**: sharp "chát" smack followed by a cartoon wobble | Attack is played | Everyone. The next player's chip is highlighted and shows the "2 turns" badge |
| Favor | Nhờ Vả | Two-note rising "pretty please" tone | Favor is played (target shown) | Everyone |
| Nope | Không! | Firm buzzer "uh-uh" | Nope is played | Everyone |

Existing sounds (draw, player out, victory) stay as they are in US-052. A card that is stopped by a Nope plays its card sound, then the Nope sound, then a short fizzle (Q8).

| AC ID | Description |
| --- | --- |
| AC20 | **One sound per card.** Given Sound is on, when any playable card is played by anyone, then the sound for that card type in the table above plays on my device at the same moment the card appears in the log. No two card types share a sound. |
| AC21 | **Attack slap.** Given someone plays Attack, then the slap sound plays for everyone, the next active player's chip is highlighted for a moment, and the log says whose turns doubled. With reduced motion on, the highlight is static. |
| AC22 | **See the Future privacy.** Given someone plays See the Future, then everyone hears the mysterious sound, and nothing in the audio reveals the cards. Only the player who played it sees them. |
| AC23 | **Stopped cards.** Given a Nope stops a card, then the Nope sound and a fizzle play, and the stopped card's own effect sound is not repeated. |
| AC24 | **Sound is never the only signal.** Given any sound, then the same information is available as on-screen text or a log line and in the screen-reader announcements (extends [US-052](US-052-sound-effects-muted-by-default.md)). |
| AC25 | **Mute and volume.** Given Settings, then I can turn Sound off and on and set volume from 0 to 100 %. Changes apply at once, persist on this device, and affect only me. If storage is unavailable, they apply for the session. |
| AC26 | **Sound off by default.** Given a new device, then Sound is off, no audio code or file is loaded, and the game top bar shows **Sound off** with a way to open Settings. |
| AC27 | **Visual cue when sound is off.** Given Sound is off, then the "Sound off" indicator is visible during the game, and no important information is lost. |
| AC28 | **Audio blocked by the browser.** Given Sound is on but the browser blocks audio (no user gesture yet, or the audio context is suspended), then the game works normally and a non-blocking notice "Tap to turn on sound" appears. After one tap, later sounds play. Sounds missed in the meantime are **not** replayed. |
| AC29 | **Hidden tab.** Given the page is in a background tab, then no sound plays. |
| AC30 | **Overlap.** Given several events arrive together (for example, a card, a Nope and a shuffle), then sounds play in event order, short cues may overlap, and the total never exceeds the volume setting. |
| AC31 | **Per-player timeout and warning sounds.** Given Sound is on, then the 5-second warning and the timeout each have their own cue, played only for the active player (the warning) and everyone (the timeout). |
| AC32 | **Failure.** Given a sound fails to play or load, then the game continues, no error is shown to players, and the visual information remains. |

---

## 7. Business Rules

| ID | Rule |
| --- | --- |
| BR01 | Time is decided by the server. Clients display only. |
| BR02 | The timer applies per turn, not per game, and each of the 2 turns after an Attack is a separate turn. |
| BR03 | Waiting phases that have their own rules keep them: Nope window 8 s ([US-062](US-062-nope-card.md)), absent player 60 s ([US-058](US-058-absent-player-during-the-game.md)). The turn clock pauses during these. |
| BR04 | A timeout never blames the player in the wording. |
| BR05 | Sound never carries information that is not also shown as text. |
| BR06 | Sound is a per-device choice. One player's setting never affects another player. |
| BR07 | No sound reveals hidden information (hand contents, cards seen with See the Future, the deck order). |
| BR08 | A timeout cannot make a player skip the draw, so the deck pressure of the base game stays (recommendation, Q2). |

---

## 8. Out of Scope

| ID | Description |
| --- | --- |
| OOS1 | Raising room capacity to 5 players and the 5-player deck (separate decision, A01/Q1). |
| OOS2 | Background music. |
| OOS3 | Different timers per player or per card; a "strike" system for repeated timeouts (Q10). |
| OOS4 | Voice-over lines and Vietnamese text. These are in [US-02](US-02-vietnamese-localization.md), except that the warning and timeout cues exist as sounds here. |
| OOS5 | Haptic (vibration) feedback. |
| OOS6 | A new visual design for the countdown (the wireframe is TBD). |
| OOS7 | Sounds for lobby, join and menu events. |

---

## 9. Non-functional Requirements

*Values marked "proposed" are not from the source input and need confirmation.*

| Requirement | Description |
| --- | --- |
| Timing accuracy | Countdown shown on any device is within 1 second of the server deadline (proposed). Resolved by the server at the deadline (±250 ms sweep, proposed from the existing 250 ms sweep loop). |
| Sound latency | From receiving the play event to audio start: ≤ 150 ms on a mid-range phone (proposed). |
| Format and size | If cues are synthesized (current approach): no download. If recorded files are chosen: compressed audio that all supported browsers play (MP3 or AAC), ≤ 30 KB per cue and ≤ 300 KB in total (proposed); loaded only after Sound is turned on. |
| Licensing | All audio original or licensed with proof kept in `assets/LICENSES.md` (A07). |
| Accessibility | Countdown and warning are text, not colour-only. No flashing above 3 per second ([US-038](US-038-settings-reduced-motion-and-sound.md)). A timer-off option exists. Announcements are polite and happen at 10 s, 5 s and timeout only (WCAG 2.2.1 Timing Adjustable intent). |
| Privacy | Timer and sound add no new personal data and no analytics. |
| Cross-platform | Works on current phone, tablet and desktop browsers supported by the game; audio follows each browser's autoplay rules. |
| Reliability | A dropped timer message must not freeze the game: the server resolves the timeout itself. |

---

## 10. Dependencies

| Dependency | Why |
| --- | --- |
| [US-007](US-007-show-whose-turn-it-is-and-each-player-s-status.md), [US-012](US-012-draw-a-card-to-end-the-turn.md) | Turn display and draw mechanics. |
| [US-015](US-015-draw-a-boom-cat-and-use-a-treat.md), [US-016](US-016-tuck-the-boom-cat-back-into-the-deck.md), [US-017](US-017-draw-a-boom-cat-without-a-treat-player-is-out.md) | Timeout outcomes when an Exploding Kitten is drawn. |
| [US-018](US-018-hop-over-skip-card.md) – [US-022](US-022-ask-a-friend-favour-card.md), [US-062](US-062-nope-card.md) | The cards that get sounds and the Nope window. |
| [US-055](US-055-lobby-with-host-controls.md) | Host setting for the timer. |
| [US-058](US-058-absent-player-during-the-game.md), [US-043](US-043-reconnect-and-rejoin-my-seat.md) | Disconnect behaviour. |
| [US-038](US-038-settings-reduced-motion-and-sound.md), [US-052](US-052-sound-effects-muted-by-default.md) | Settings and the base sound system. |
| [US-060](US-060-real-time-room-server-authoritative.md) | Server clock authority. |
| [US-023](US-023-bot-buddies-fill-empty-seats.md) | Bot behaviour with a timer. |
| Room capacity decision (OQ-13) | Needed for the 5-player assumption. |

---

## 11. Traceability

| Requirement source | Covered by |
| --- | --- |
| Team: "X seconds to think" | AC01–AC03, AC05 |
| Team: "no action in X seconds → next" | AC07–AC11 (Q2) |
| Team: "Attack = vả, slap sound" | AC21, sound table |
| Team: "each card has its own sound; See the Future mysterious" | AC20, AC22, sound table |
| Team: "5 players" | A01, Q1 |
| Mute, volume, blocked audio, visual cue | AC25–AC28 |
| Latency, format, size, accessibility | §9 |

---

## 12. Open Questions (Assumptions to validate), by priority

| # | Area | Question | Recommendation / default used | Owner |
| --- | --- | --- | --- | --- |
| **Q1** | Scope | Is **5 players** a requirement? Rooms are capped at 4 (OQ-13), and the deck is built for 2–4. | Keep the story player-count-agnostic; raise capacity in its own story. | Product owner |
| **Q2** | Rules | Does a timeout mean **auto-draw** or just **pass the turn without drawing**? The team did not say. | **Auto-draw.** Drawing is what ends a turn; passing without drawing lets a player dodge the deck forever and breaks fairness. Auto-draw can eliminate a child who stepped away, so see Q10. | Product owner |
| **Q3** | Rules | Timeout inside a decision (kitten position, Favor card choice): is a random result acceptable? | Random position for the kitten; random card for Favor. Alternative: always put the kitten on top. | Product owner |
| **Q4** | Design | Attack has no target in the current rules. Should it get one (choose who takes the turns)? | Keep as is. Slap plays on play; the next player is highlighted. | Product owner |
| **Q5** | Rules | Disconnected active player: pause and restart at full X, or let the timeout run? | Pause (US-058 owns the wait). | Product owner |
| **Q6** | Product | Sound on by default? Currently off (US-052). | Keep off. | Product owner |
| **Q7** | Content | Who produces the audio, and are the concepts approved (especially the "slap")? | Synthesized or in-house first; review by 2 children and 1 parent. | Product owner / audio |
| **Q8** | Design | Should a stopped card play its own sound at play time or only a fizzle? | Card sound at play, then Nope, then fizzle. | UX |
| **Q9** | Technical | Synthesized (current) or recorded files? | Keep synthesized if quality is acceptable; the size NFR then needs no value. | Dev lead |
| **Q10** | Product | Repeated timeouts: warn once first, or treat the player as absent after N timeouts? | Out of scope now; consider "first timeout = no penalty". | Product owner |
| **Q11** | Process | The requested ID **US-01** looks like the existing **US-001** (landing screen). Rename to **US-063**? | Rename; the index (README) is not updated until decided. | BA |
| **Q12** | Default | Is **30 s** the right X, and are 15/30/60/Off the right options? | Test with real families. | Product owner |
| **Q13** | Accessibility | Is "Off" enough for players who need more time, or is an "extend time" button needed? | "Off" now; review after playtests. | Accessibility |

---

## 13. Review (INVEST, Definition of Ready)

| Check | Result |
| --- | --- |
| **Independent** | Mostly. The timer and the sounds do not depend on each other. They are joined only because they came as one request. |
| **Negotiable** | Yes. Values, sound concepts and the timeout rule are proposals. |
| **Valuable** | Yes. Stops stalling; makes the game livelier. |
| **Estimable** | Timer: yes. Sound: depends on Q9 (synthesis versus recorded). |
| **Small** | **No. Too big for one week.** Both halves touch the engine/server (timer) and client audio (sound). |
| **Testable** | Yes. Every AC has an observable result. |
| DoR: role, goal, value, priority, assumptions, AC, out of scope, NFRs, traceability | Present. **Priority is not set:** suggested **Should** for the timer (reliability of the game flow) and **Could** for the sounds (as US-052). |

**Proposed split (still delivered as one file as requested):**
- **US-01a — Turn timer and automatic timeout** (§6.1; Should). Server and UI; depends on Q2, Q3, Q5.
- **US-01b — One sound per card** (§6.2; Could). Client audio only; extends US-052; depends on Q7, Q9.

**Quality notes:** no inventions beyond the proposals marked above; no hidden information in any sound (BR07); no client names; wireframe is TBD.
