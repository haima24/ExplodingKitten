# US-064 — Vietnamese localization (text and voice)

[Back to story index](../README.md) | Format: NT user story standard ([UserStoryGeneration.agent.md](../../../../instructions/BA/UserStoryGeneration.agent.md)) | Status: **Draft for review** | Release: **1.0.2**

> **Implementation:** built in release 1.0.2 following [the dev spec](../../dev-specs/US-064-vietnamese-localization.md). The spec lists the answers used for the open questions in §12; each can be changed later.

| Field | Value |
| --- | --- |
| Project | Whisker Boom (Exploding Kittens-style family card game, online multiplayer) |
| Module | Localization; Responsive UI and accessibility |
| Audience | Product owner, dev team, QA, Vietnamese-speaking reviewer, accessibility reviewer |
| Source inputs | Team note (Vietnamese, see §1); [US-063](US-063-turn-timer-and-card-sounds.md); [US-004](../release-1.0.1/US-004-choose-a-name-and-avatar.md), [US-029](../release-1.0.1/US-029-how-to-play-tour.md), [US-030](../release-1.0.1/US-030-card-guide-and-per-card-help.md), [US-036](../release-1.0.1/US-036-screen-reader-support.md), [US-038](../release-1.0.1/US-038-settings-reduced-motion-and-sound.md), [US-039](../release-1.0.1/US-039-text-size-setting.md), [US-040](../release-1.0.1/US-040-invalid-action-feedback.md), [US-042](../release-1.0.1/US-042-privacy-by-default.md), [US-052](../release-1.0.1/US-052-sound-effects-muted-by-default.md); current code in `working-artifacts/src/` |
| Confidence | Medium. Current limits are confirmed from the code. All Vietnamese wording below is a **draft for review by a native speaker**, not final copy. |

---

## 1. User Story

### User Story ID
US-064 

### User Story Name
Vietnamese localization (text and voice)

### Epic
Localization (new). Closest existing epic: Responsive UI and accessibility

### User Story
As a **Vietnamese-speaking player (child or parent)** I want **to play the whole game in Vietnamese, including spoken lines such as "Đến lượt bạn rút"** so that **I and my family understand every screen and instruction without needing English, and the game feels made for us.**

### Raw input from the team (kept for traceability)
- Thêm tiếng Việt vào game (add Vietnamese to the game).
- Bao gồm cả dẫn thoại bằng âm thanh (voice-over lines), ví dụ "đến lượt bạn rút" (it's your turn to draw).

### What the game does today (confirmed from the code)
| Area | Today | Consequence for this story |
| --- | --- | --- |
| UI text | One English catalog (`copy/en.ts`) read through a `t()` helper. No locale concept. `<html lang="en">`. | Add a second catalog and a language choice. |
| Card names and descriptions | Stored as English strings **inside the game engine's card catalog**, and used directly by the UI, dialogs, log and rules tour. | Card text must be selectable by language wherever it appears. This crosses the engine boundary (dev note, not a business rule). |
| Game log and announcements | Built on each device from game events, using the catalog. | Each player's log can show in their own language. |
| Error messages | Server sends a **code**; the client turns it into friendly English wording. | Only the client text needs translating. |
| Player names | Built from curated English word lists (adjective + noun) plus an avatar. Bots have fixed English names. | Open question Q5. |
| Fonts | Self-hosted Baloo 2 and Nunito, **Latin subset only**. | Vietnamese letters would fall back to a system font unless the Vietnamese subset is added. |
| Sound | Off by default, per-device setting, synthesized cues ([US-052](../release-1.0.1/US-052-sound-effects-muted-by-default.md)). No voice, no speech. | Voice-over is a new capability. |

---

## 2. Assumptions

| ID | Description | Impact if wrong |
| --- | --- | --- |
| A01 | Two languages only: **English (default fallback) and Vietnamese**. | Adding more later should only mean a new catalog. |
| A02 | Language is a **per-device setting**, like text size ([US-039](../release-1.0.1/US-039-text-size-setting.md)). Players in the same room can use different languages. | If the room must share one language, the host sets it and the rules change. |
| A03 | Default rule: **saved choice first; otherwise the browser language (any Vietnamese variant → Vietnamese); otherwise English.** | A wrong default annoys first-time users; the switcher is one tap away. |
| A04 | Voice-over is **off by default** and separate from sound effects (browser autoplay rules, consistency with [US-052](../release-1.0.1/US-052-sound-effects-muted-by-default.md)). | If it must be on by default, consent and autoplay need a decision. |
| A05 | Voice-over is provided in **both languages**, because [US-063](US-063-turn-timer-and-card-sounds.md) requires the timer warning and timeout lines in the selected language. Vietnamese is the priority. | If English voice is not wanted, the timer lines are Vietnamese-only and English players get text and sound only. |
| A06 | Voice lines contain **no player names or card contents** (they are generic) so they can be pre-recorded and never leak hidden information. | If names must be spoken, text-to-speech is needed (Q2). |
| A07 | All Vietnamese text and card names below are **proposals** pending native review. Card names follow the team's words ("Tiên Tri" for See the Future, "Vả" for Attack). | Final names may change; they are data, not logic. |
| A08 | Privacy page and legal wording need a **reviewed** translation (child-privacy launch gate, OQ-10). | If untranslated, those pages stay English with a notice. |

---

## 3. Pre-conditions

| ID | Description |
| --- | --- |
| PR01 | The English catalog is complete and has stable keys (every visible string comes from the catalog). |
| PR02 | A native Vietnamese reviewer is available before release. |
| PR03 | For voice-over: audio settings from [US-038](../release-1.0.1/US-038-settings-reduced-motion-and-sound.md)/[US-052](../release-1.0.1/US-052-sound-effects-muted-by-default.md) exist and a user gesture has happened (autoplay). |
| PR04 | For timer lines: [US-063](US-063-turn-timer-and-card-sounds.md) is delivered or planned. |

---

## 4. Workflow / Activity Description

**A. First visit.** The app picks the language by the default rule (A03) and sets the page language. The player can change it from the Home page or Settings at any time.

**B. Changing language.** The player picks English or Tiếng Việt. All visible text, card names, dialogs, hints, the log and the screen-reader announcements switch at once, with no reload and without leaving the room or the game. The choice is saved on this device.

**C. Voice-over.** During a game, the app turns selected game events into short spoken lines in the selected language (table §6.3), only if Voice-over is on. Lines are queued one at a time, relevant lines only, never reveal hidden information, and are always also available as text.

**D. Missing text.** If a Vietnamese string is missing, the English text is shown (never an empty space or a raw key).

---

## 5. Suggested Mock-up Screens

*Text description. No visual design exists yet; wireframe is TBD.*

| Field / element | Type | Mandatory | Default | Description |
| --- | --- | --- | --- | --- |
| Language | Single choice (Settings) | Yes | By default rule (A03) | Options labelled in their own language: **English**, **Tiếng Việt**. Applies at once. Persists on this device. |
| Language shortcut | Link/button on Home and in the game menu | No | Current language | Shows the other language's name ("Tiếng Việt" / "English") for one-tap switching. |
| Voice-over | Choice (Settings) | No | Off | On/Off. Disabled with a note when the browser has no audio. Separate from Sound effects. |
| Voice volume | Slider 0–100 % | No | Follows the sound volume (Q10) | Keyboard operable; value as text. |
| Replay last line | Button (game top bar) | No | Shown when Voice-over is on | Repeats the last line, for players who missed it. |
| Voice-off indicator | Icon + text | Auto | Visible when Voice-over is off | Same pattern as "Sound off" in US-063. |
| Fallback notice | None visible to players | — | — | Missing strings simply show English; developers see a console warning in development builds. |

---

## 6. Business Acceptance Criteria

### 6.1 Interface text

| AC ID | Description |
| --- | --- |
| AC01 | **Switcher.** Given any screen where Settings or the Home page is shown, when I choose Tiếng Việt, then every visible string changes to Vietnamese at once without a reload. Choosing English switches back. |
| AC02 | **Default.** Given a new device whose browser language is Vietnamese (any region), then the game opens in Vietnamese. Given any other language, then English. Given I previously chose a language, then my choice wins. |
| AC03 | **Persistence.** Given I chose a language, then it is remembered on this device. Given storage is unavailable, then it applies for the session only and no error appears ([US-038](../release-1.0.1/US-038-settings-reduced-motion-and-sound.md)). |
| AC04 | **Mid-game switch.** Given a game is running and I change language from the game menu, then the game continues for everyone, my hand, turn and decisions are unchanged, and any open dialog is shown in the new language. |
| AC05 | **Whole product covered.** Given the language is Vietnamese, then these are all in Vietnamese: Home, create/join, lobby, game board, hints and coach marks, dialogs (Exploding Kitten, Defuse, Favor, Nope, See the Future, leave/end game), victory screen, How to Play tour, card guide, settings, error and offline messages, 404 page, the recent-action log and toasts. |
| AC06 | **Card names and descriptions.** Given the language is Vietnamese, then each card shows its Vietnamese name and effect text everywhere it appears (hand, detail panel, piles, dialogs, log, rules tour, card guide). See the name table below. |
| AC07 | **Per-device language.** Given two players in the same room use different languages, then each sees their own language, and the same game event appears in each player's language in their own log. |
| AC08 | **Screen readers.** Given Vietnamese is selected, then the page language is Vietnamese, and live announcements, labels and dialog titles are Vietnamese. (English words that are still left, such as a player name, do not break the reading of the rest.) |
| AC09 | **Errors.** Given a rejected action or connection problem, then the same friendly, non-blaming message is shown in Vietnamese ([US-040](../release-1.0.1/US-040-invalid-action-feedback.md)). |
| AC10 | **Fallback.** Given a Vietnamese string is missing, then the English text is shown for that string only; no key name, blank or `undefined` is ever visible. |
| AC11 | **Completeness check.** Given a release build, then an automated check reports any English key without a Vietnamese value, and the release is blocked when keys for the screens listed in AC05 are missing. |
| AC12 | **Numbers and units.** Given Vietnamese is selected, then counts and times read naturally ("2 lượt", "30 giây"), and no English plural suffix such as "(s)" appears. |
| AC13 | **Player names (Q5).** Given a name was built in the name builder, then it is shown exactly as created to everyone, in every language. |
| AC14 | **Privacy page.** Given Vietnamese is selected, then the privacy page shows a reviewed Vietnamese version, or the English text with a short Vietnamese notice if the translation is not yet approved (A08). |

**Proposed Vietnamese card names** (for review, A07):

| Card (EN) | Tên thẻ (VI) | Note |
| --- | --- | --- |
| Exploding Kitten | Mèo Nổ Tung | |
| Defuse | Gỡ Bom | |
| Skip | Bỏ Qua | |
| See the Future | Tiên Tri | Team's own word |
| Shuffle | Xáo Bài | |
| Cat card | Thẻ Mèo | Not playable today (OQ-06) |
| Attack | Vả | Team's nickname; alternative "Tấn Công" (Q3) |
| Favor | Nhờ Vả | |
| Nope | Không! | Short, fits on the card |

### 6.2 Layout, fonts and quality

| AC ID | Description |
| --- | --- |
| AC20 | **Diacritics render.** Given Vietnamese is shown, then every letter and tone mark (for example ă â ê ô ơ ư đ and ạ ả ã á à ẳ ẵ ắ ằ ặ) displays in the game's own fonts, not in a fallback system font. The fonts used are the self-hosted ones (no request to an outside font service, [US-042](../release-1.0.1/US-042-privacy-by-default.md)). |
| AC21 | **No clipping of marks.** Given stacked tone marks on capital letters (for example "Ế", "Ổ"), then they are not cut off in buttons, cards, badges or banners. |
| AC22 | **Text expansion.** Given Vietnamese text that is longer than the English text, then no text overlaps, is cut off or goes outside its control, at 320 px width and at 100 %, 125 % and 150 % text size ([US-033](../release-1.0.1/US-033-responsive-layouts-across-device-classes.md), [US-039](../release-1.0.1/US-039-text-size-setting.md)). Long text wraps; the card name never hides the card icon. |
| AC23 | **Encoding.** Given any Vietnamese text is stored, sent or shown, then it is UTF-8 and the same on every browser; text is stored in a single consistent composed form, so equal words compare equal. |
| AC24 | **Contrast and targets unchanged.** Given Vietnamese is shown, then contrast, focus visibility and 44 px targets still pass ([US-034](../release-1.0.1/US-034-touch-mouse-and-keyboard-parity-with-large-targets.md), [US-037](../release-1.0.1/US-037-colour-independence-and-contrast.md)). |
| AC25 | **Quality.** Given release, then a native speaker has approved all Vietnamese text, card names and voice scripts, with tone suitable for children and no blame wording. |

### 6.3 Voice-over

Voice lines are short, generic (no names, no card contents; A06), and always matched by on-screen text. Wording is a draft for native review. "Heard by" is who plays the line; a "—" means no voice by design.

| ID | Event (trigger moment) | Vietnamese line (draft) | English meaning | Heard by |
| --- | --- | --- | --- | --- |
| V01 | My turn starts | **Đến lượt bạn rút.** (team's wording) | It's your turn to draw. | Active player |
| V02 | Another player's turn starts | — | (shown on the banner only, to avoid chatter) | — |
| V03 | I drew a safe card | Bạn đã rút một lá bài. | You drew a card. | The drawer. The card is **never** named aloud. |
| V04 | Timer warning, 5 seconds left ([US-063](US-063-turn-timer-and-card-sounds.md)) | **Còn năm giây!** | 5 seconds left! | Active player |
| V05 | Timeout ([US-063](US-063-turn-timer-and-card-sounds.md)) | **Hết giờ rồi! Bạn tự động rút bài.** | Time's up! You draw automatically. | Active player. Others see the text only. |
| V06 | Attack played | **Vả!** Người tiếp theo phải đi hai lượt. | Slap! The next player takes two turns. | Everyone. The affected player hears: "Vả! Bạn phải đi hai lượt." |
| V07 | Skip played | Bỏ qua lượt! | Skip the turn! | Everyone |
| V08 | See the Future played | Tiên tri: bạn thấy ba lá bài trên cùng. | You see the top three cards. | The player who played it. **Does not read the cards.** |
| V09 | Shuffle played | Bài đã được xáo. | The deck was shuffled. | Everyone |
| V10 | Favor: my card is requested | Bạn được nhờ một lá bài. Hãy chọn một lá. | A friend asks you for a card. Choose one. | The target |
| V11 | Nope played | Không! Lá bài đã bị chặn. | Nope! The card was stopped. | Everyone |
| V12 | Nope window opens and I hold a Nope | Bạn có muốn chặn không? | Do you want to stop it? | Nope holders only |
| V13 | I drew an Exploding Kitten and have a Defuse | Mèo nổ tung! Hãy gỡ bom. | Exploding Kitten! Defuse it. | The drawer |
| V14 | Defuse used (public) | Đã gỡ bom! | Defused! | Everyone |
| V15 | I am out | Bạn đã bị loại. | You are out. | The player who is out |
| V16 | Another player is out | Có một người chơi bị loại. | A player is out. | Everyone else |
| V17 | I win | **Bạn thắng rồi!** | You won! | The winner |
| V18 | Someone else wins / I lose | Trò chơi kết thúc. Chúc mừng người thắng cuộc! | Game over. Congratulations to the winner! | Everyone else |

| AC ID | Description |
| --- | --- |
| AC30 | **Voice in the selected language.** Given Voice-over is on, then each line in the table plays in the selected language. Given I switch language, then the next line plays in the new language. |
| AC31 | **Timer lines in the selected language.** Given the timer is on ([US-063](US-063-turn-timer-and-card-sounds.md)), then the warning (V04) and timeout (V05) lines play in the selected language, and the matching text is shown. |
| AC32 | **Who hears what.** Given a line is addressed to one player (V01, V03, V04, V05, V08, V10, V12, V13, V15, V17), then only that player's device speaks it. Given a public line (V06, V07, V09, V11, V14, V16, V18), then every device with Voice-over on speaks it. |
| AC33 | **No hidden information.** Given any voice line, then it never names or describes cards in a hand, cards seen with See the Future, the deck order, or who holds a Nope. |
| AC34 | **Off by default.** Given a new device, then Voice-over is off and no voice file or speech engine is loaded until it is turned on by the player. |
| AC35 | **Separate controls.** Given Settings, then I can turn Voice-over and Sound effects on and off independently. Both can be muted at once from the game top bar. |
| AC36 | **One line at a time.** Given several events arrive together, then lines play one after another and never overlap each other. A higher-priority line (timeout, out, win) goes first. |
| AC37 | **No clash with effects.** Given a card sound effect and a voice line start together, then the effect plays first and the voice follows, or the effect volume is lowered while the voice speaks. |
| AC38 | **Stale lines are dropped.** Given a line is older than a few seconds when its turn to play comes (or I reconnect after missing events), then it is skipped. Missed lines are never replayed in a burst (threshold TBD, Q8). |
| AC39 | **Replay.** Given Voice-over is on, when I press **Replay last line**, then the last line I heard plays again. |
| AC40 | **Audio blocked.** Given the browser blocks audio, then the game continues, text and sound-off cues remain, and the "Tap to turn on sound" notice from [US-063](US-063-turn-timer-and-card-sounds.md) appears. No lines queued while blocked are played later. |
| AC41 | **Screen-reader users.** Given a screen reader is in use, then voice lines and live announcements do not repeat each other at the same time (decision in Q7). Voice-over can be turned off in one step. |
| AC42 | **Text always available.** Given Voice-over is off or fails to play, then all information is still shown as text, announcements and log ([US-052](../release-1.0.1/US-052-sound-effects-muted-by-default.md) rule). |
| AC43 | **Voice file missing.** Given a voice file fails to load for a line, then the game continues silently for that line and no error is shown. |
| AC44 | **Hidden tab.** Given the page is in a background tab, then no voice plays. |

---

## 7. Business Rules

| ID | Rule |
| --- | --- |
| BR01 | Every string a player can see or hear exists in English; Vietnamese is optional per string, and English is the fallback. |
| BR02 | Language and voice settings belong to the device and affect only that player. |
| BR03 | Game rules, card counts, turn flow and server messages' codes never change with language. |
| BR04 | Voice never carries information that is not also shown as text. |
| BR05 | Voice lines are generic and never reveal private information. |
| BR06 | Tone is friendly and non-blaming, suitable for children (same as [US-058](../release-1.0.1/US-058-absent-player-during-the-game.md)/[US-040](../release-1.0.1/US-040-invalid-action-feedback.md)). |
| BR07 | Voice recordings (or speech engine use) need rights cleared and recorded in `assets/LICENSES.md`. A voice performer's consent is kept on file. |

---

## 8. Out of Scope

| ID | Description |
| --- | --- |
| OOS1 | Languages other than English and Vietnamese. |
| OOS2 | Right-to-left layout. |
| OOS3 | Translating player names or the name word lists (Q5), unless decided. |
| OOS4 | Speaking player names or card names aloud (needs text-to-speech, Q2). |
| OOS5 | Voice commands or speech input. |
| OOS6 | Regional Vietnamese accents or multiple voices. |
| OOS7 | Translating developer docs, specs and the repository README. |
| OOS8 | Translated marketing or store pages. |
| OOS9 | Auto-detection from the server or IP address. |

---

## 9. Non-functional Requirements

*Values marked "proposed" are not from the source input and need confirmation.*

| Requirement | Description |
| --- | --- |
| Encoding and fonts | UTF-8 everywhere. Self-hosted fonts that include the Vietnamese character set (the current builds load only the Latin subset). No external font requests. |
| Layout | Text expansion verified at 320 px, three text sizes, and the longest Vietnamese string per control. |
| Performance | Switching language is instant (no reload). The Vietnamese catalog is loaded only when needed. Page weight growth for Vietnamese fonts and text is measured against the existing budget ([US-049](../release-1.0.1/US-049-performance-budget-check.md)); the limit is TBD. |
| Voice latency | From the event to the start of speech ≤ 300 ms for pre-recorded lines (proposed). |
| Voice size | Pre-recorded lines: compressed audio all supported browsers play (MP3 or AAC), ≤ 40 KB per line and loaded only after Voice-over is turned on (proposed). |
| Accessibility | Page language set correctly; no voice-only information; settings reachable by keyboard; a replay control; respects reduced motion and the muted settings ([US-036](../release-1.0.1/US-036-screen-reader-support.md), [US-038](../release-1.0.1/US-038-settings-reduced-motion-and-sound.md)). |
| Compatibility | Works on the supported browsers. If the browser has no speech engine and recordings are not used, Voice-over is shown as unavailable with a reason. |
| Privacy | Language is stored only on the device. No language or voice data is sent to a server or analytics ([US-042](../release-1.0.1/US-042-privacy-by-default.md)). |
| Maintainability | Adding a new language needs only a new text catalog and voice set, not code changes. |

---

## 10. Dependencies

| Dependency | Why |
| --- | --- |
| [US-063](US-063-turn-timer-and-card-sounds.md) | Timer warning and timeout lines; "Tap to turn on sound" notice; the same audio settings. |
| [US-038](../release-1.0.1/US-038-settings-reduced-motion-and-sound.md), [US-052](../release-1.0.1/US-052-sound-effects-muted-by-default.md) | Settings panel and audio on/off pattern. |
| [US-039](../release-1.0.1/US-039-text-size-setting.md), [US-033](../release-1.0.1/US-033-responsive-layouts-across-device-classes.md) | Layout checks for longer text. |
| [US-036](../release-1.0.1/US-036-screen-reader-support.md), [US-040](../release-1.0.1/US-040-invalid-action-feedback.md) | Announcements and error wording. |
| [US-029](../release-1.0.1/US-029-how-to-play-tour.md), [US-030](../release-1.0.1/US-030-card-guide-and-per-card-help.md), [US-031](../release-1.0.1/US-031-contextual-what-now-hints.md), [US-032](../release-1.0.1/US-032-guided-first-game-coach-marks.md) | All help content is translated. |
| [US-004](../release-1.0.1/US-004-choose-a-name-and-avatar.md) | Name builder behaviour (Q5). |
| [US-042](../release-1.0.1/US-042-privacy-by-default.md) | Privacy page; no outside font or speech service. |
| Native Vietnamese reviewer and voice talent or TTS decision | Content quality and rights. |

---

## 11. Traceability

| Requirement source | Covered by |
| --- | --- |
| Team: "add Vietnamese" | AC01–AC14 |
| Team: "voice-over lines, e.g. đến lượt bạn rút" | V01, AC30–AC44 |
| Team (US-063): timer warning/timeout spoken in the selected language | V04, V05, AC31 |
| Card names kept in Vietnamese | Card name table, AC06 |
| Diacritics, expansion, fallback | AC10, AC20–AC23 |
| Language switcher and default rule | AC01–AC03 |

---

## 12. Open Questions (Assumptions to validate), by priority

| # | Area | Question | Recommendation / default used | Owner |
| --- | --- | --- | --- | --- |
| **Q1** | Content | Who approves the Vietnamese wording and card names? Are the proposed names right ("Tiên Tri", "Vả", "Nhờ Vả", "Không!")? | A native reviewer signs off before release (PR02). | Product owner |
| **Q2** | Voice | **Pre-recorded or text-to-speech?** | **Pre-recorded, name-free lines** (A06): consistent quality, works offline once loaded, no dependence on the voices a device happens to have. Text-to-speech would allow names, but Vietnamese voices are not guaranteed on every device and quality varies. Cost: a recording session and a rights agreement. | Product owner / dev lead |
| **Q3** | Content | Is "Vả" the card name, or only the nickname with "Tấn Công" as the name? | Use "Vả" on the card, "Tấn Công" in the description. | Product owner |
| **Q4** | Voice | Is the team's line "Đến lượt bạn rút" right at turn start? A turn can also start with playing cards, not only drawing. | Keep as the team wrote it (V01); alternative "Đến lượt bạn!" | Product owner |
| **Q5** | Names | Should player names be localized? Today they come from English word lists and are shown as created. | Do not translate (AC13). Add Vietnamese word lists later if wanted. | Product owner |
| **Q6** | Scope | English voice-over: needed (A05)? | Yes, for the timer lines and parity. | Product owner |
| **Q7** | Accessibility | Should Voice-over turn itself off for screen-reader users? A browser cannot tell reliably. | Leave off by default; one-step off switch (AC41). | Accessibility |
| **Q8** | Voice | How old is "stale"? | 3 seconds (proposed). | UX |
| **Q9** | Legal | Who translates and approves the privacy page? | Legal review (A08, OQ-10). | Legal |
| **Q10** | Voice | Separate voice volume or shared with sound effects? | Separate slider, default equal to the effects volume. | UX |
| **Q11** | Rights | Who is the voice performer and what permission do we need? Are child voices wanted? | Adult actor with a written licence. | Product owner |
| **Q13** | Scope | Should the Vietnamese How to Play tour and card guide be translated by the same release? | Yes (AC05). | Product owner |

---

## 13. Review (INVEST, Definition of Ready)

| Check | Result |
| --- | --- |
| **Independent** | Text (§6.1–6.2) is independent. Voice (§6.3) depends on the text, on language, and on [US-063](US-063-turn-timer-and-card-sounds.md) for the timer lines. |
| **Negotiable** | Yes. Wording, voice approach and defaults are proposals. |
| **Valuable** | Yes. Makes the game usable by Vietnamese-speaking families. |
| **Estimable** | Text: yes. Voice: depends on Q2 and Q11. |
| **Small** | **No. Too big for one week** (every screen, fonts, help content, and a new voice capability). |
| **Testable** | Yes, though wording quality needs a native reviewer. |
| DoR: role, goal, value, assumptions, AC, out of scope, NFRs, traceability | Present. **Priority is not set:** suggested **Should** for text and **Could** for voice. |

**Proposed split (still delivered as one file as requested):**
- **US-064a — Vietnamese interface text, card names and language switcher** (§6.1, §6.2; Should). Includes fonts and the layout checks.
- **US-064b — Spoken voice-over lines** (§6.3; Could). Depends on 02a, on US-063's audio settings, and on Q2/Q11.
- **Optional US-064c — Translated help content and privacy page** if the team wants to release text before the long-form content.

**Quality notes:** no invented rules; all Vietnamese wording marked as draft; no hidden information in any voice line (BR05, AC33); no client names.
