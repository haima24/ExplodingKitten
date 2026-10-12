# US-067 — Vietnamese player names

[Back to story index](../README.md) | Format: NT user story standard ([UserStoryGeneration.agent.md](../../../../instructions/BA/UserStoryGeneration.agent.md)) | Status: **Draft for review** | Release: **1.0.2** (proposed)

| Field | Value |
| --- | --- |
| Project | Whisker Boom (Exploding Kittens-style family card game, online multiplayer) |
| Module | Rooms and lobby (identity); Localization |
| Audience | Product owner, dev team, QA, Vietnamese-speaking reviewer, child-safety reviewer |
| Source inputs | Team note (Vietnamese): "tên nhân vật lúc chọn first name, last name cũng cần có tên tiếng việt"; current code in `working-artifacts/src/` (`packages/protocol/src/identity.ts`, `features/rooms/IdentityStep.tsx`); [US-004](../release-1.0.1/US-004-choose-a-name-and-avatar.md), [US-064](US-064-vietnamese-localization.md) |
| Confidence | Medium. Today's behaviour is confirmed from the code. The Vietnamese words are **drafts for a native reviewer** |

---

## 1. User Story

### User Story ID
US-067

### User Story Name
Vietnamese player names

### Epic
Rooms and lobby · Localization

### User Story
As a **Vietnamese-speaking player (child or parent)** I want **the two words I pick for my character name, the "first name" and "last name", to have Vietnamese versions that read naturally**, so that **I understand the names, choose one I like, and see all players' names in Vietnamese.**

### Raw input from the team (kept for traceability; Vietnamese, intent preserved)
- Tên nhân vật lúc chọn first name, last name cũng cần có tên tiếng Việt (when choosing the character name, the first name and the last name also need Vietnamese names).

### What the game does today (confirmed from the code)
| Area | Today | Consequence |
| --- | --- | --- |
| Name builder | The player picks **two words** from curated English lists: 26 "first words" (adjectives, e.g. Sleepy) and 26 "last words" (nouns, e.g. Biscuit). There is no free text ([US-004](../release-1.0.1/US-004-choose-a-name-and-avatar.md)) | The two lists need Vietnamese versions |
| Name stored and shared | The server stores the two English words (plus a number if two players have the same name). Every device formats them as "Sleepy Biscuit" | The English words can remain the **fixed identity** of a name, while each device **displays** them in its own language |
| Name shown | In lobby, chips, log, dialogs, victory, screen-reader text | Every place must show the display form |
| Avatar names | Already translated in [US-064](US-064-vietnamese-localization.md) | None |
| Bot names | "Beepy Buddy", "Boopy Buddy", "Zappy Buddy" | Need Vietnamese forms |
| US-064 decision | Player names are **not** translated (Q5) | **This story reverses that decision** for the curated words |

---

## 2. Assumptions

| ID | Description | Impact if wrong |
| --- | --- | --- |
| A01 | The two lists stay **curated**: no free text. Each word has an English and a Vietnamese display form. | Free text would need filtering and moderation (OQ-14) |
| A02 | A name is **the same name in both languages**: a player who picks "Sleepy Biscuit" is "Bánh Quy Buồn Ngủ" to a Vietnamese viewer and "Sleepy Biscuit" to an English viewer. | If each viewer should see exactly what the picker saw, names would have to be stored as text and could not follow the viewer's language |
| A03 | The **English words stay the stored identity** of a name, so the server, the protocol, the duplicate check and rejoin do not change. Only the display changes. | If the stored identity changes, the server and tests need changes too |
| A04 | Vietnamese names read in the natural **Vietnamese order** (thing first, then the describing word), so the display order differs from English (Q2). | If the order must stay the same, some names will read awkwardly |
| A05 | The Vietnamese words are chosen to be child-safe and neutral in both regions (north and south) where possible (Q4). | A word with an unfortunate meaning must be replaced before release |
| A06 | The picker lists, preview, and chosen words follow the **current language** and switch immediately when the language changes ([US-064](US-064-vietnamese-localization.md)). | None |

---

## 3. Pre-conditions

| ID | Description |
| --- | --- |
| PR01 | Vietnamese is available as a language ([US-064](US-064-vietnamese-localization.md)). |
| PR02 | A native Vietnamese reviewer has approved the word list (see §6.3 and Q1). |
| PR03 | The identity step is shown before creating or joining a room ([US-003](../release-1.0.1/US-003-host-creates-a-room.md), [US-006](../release-1.0.1/US-006-player-joins-a-room-by-link-or-code.md)). |

---

## 4. Workflow / Activity Description

1. A player opens the identity step. With Vietnamese selected, the two lists show the Vietnamese words, in Vietnamese alphabetical order, with a Vietnamese preview "Bạn sẽ là [name]".
2. The player picks a word from each list, or presses the shuffle button. Names are preselected at random.
3. The player continues. The choice is sent as the fixed (English) words, as today.
4. Every other device shows the name in **its own language**: a Vietnamese device shows the Vietnamese form, an English device shows "Sleepy Biscuit".
5. If the player later changes language in Settings, all names on that device (lobby, chips, log, dialogs, victory) switch at once.

**Alternate flows:** two players with the same name get a number as today ("…2"); the number is shown in both languages. A language with no translation for a word falls back to English ([US-064](US-064-vietnamese-localization.md) AC10).

---

## 5. Suggested Mock-up Screens

*Text description. No visual design exists yet; wireframe is TBD.*

| Field / element | Type | Mandatory | Default | Description |
| --- | --- | --- | --- | --- |
| First-word list | Single choice (large options) | Yes | Random | 26 words in the current language, sorted for that language. Label "Từ thứ nhất" in Vietnamese (Q3) |
| Last-word list | Single choice (large options) | Yes | Random | 26 words in the current language. Label "Từ thứ hai" in Vietnamese (Q3) |
| Preview | Text with a status role | — | Preselected name | "Bạn sẽ là Bánh Quy Buồn Ngủ" |
| Shuffle button | Button | — | — | Picks a random pair |
| Name display | Plain text | — | — | Wherever a name appears; long names wrap or are shortened with the full name available (see AC08) |

### Proposed Vietnamese words (draft, for native review)

| # | First word (EN) | VI | | # | Last word (EN) | VI |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Sleepy | Buồn Ngủ | | 1 | Biscuit | Bánh Quy |
| 2 | Happy | Vui Vẻ | | 2 | Pickle | Dưa Chuột |
| 3 | Sparkly | Lấp Lánh | | 3 | Muffin | Bánh Muffin |
| 4 | Fluffy | Bông Xù | | 4 | Noodle | Sợi Mì |
| 5 | Brave | Dũng Cảm | | 5 | Pancake | Bánh Kếp |
| 6 | Silly | Tinh Nghịch | | 6 | Waffle | Bánh Tổ Ong |
| 7 | Cozy | Ấm Áp | | 7 | Cupcake | Bánh Cupcake |
| 8 | Jolly | Hớn Hở | | 8 | Pudding | Bánh Pudding |
| 9 | Bouncy | Nhún Nhảy | | 9 | Cookie | Bánh Cookie |
| 10 | Cuddly | Dễ Ôm | | 10 | Bubble | Bong Bóng |
| 11 | Sunny | Nắng Vàng | | 11 | Button | Nút Áo |
| 12 | Giggly | Khúc Khích | | 12 | Pebble | Sỏi Nhỏ |
| 13 | Zippy | Nhanh Nhẹn | | 13 | Sprout | Mầm Non |
| 14 | Snuggly | Rúc Rích | | 14 | Pumpkin | Bí Ngô |
| 15 | Clever | Thông Minh | | 15 | Acorn | Quả Sồi |
| 16 | Cheery | Tươi Tắn | | 16 | Marshmallow | Kẹo Dẻo |
| 17 | Gentle | Dịu Dàng | | 17 | Peanut | Đậu Phộng |
| 18 | Mighty | Mạnh Mẽ | | 18 | Dumpling | Bánh Bao |
| 19 | Speedy | Tốc Độ | | 19 | Toast | Bánh Mì Nướng |
| 20 | Wiggly | Ngoe Nguẩy | | 20 | Sprinkle | Cốm Rắc |
| 21 | Dizzy | Chóng Mặt | | 21 | Jellybean | Kẹo Đậu |
| 22 | Perky | Lanh Lợi | | 22 | Cricket | Dế Mèn |
| 23 | Lucky | May Mắn | | 23 | Whisker | Râu Mèo |
| 24 | Merry | Hân Hoan | | 24 | Mittens | Găng Tay |
| 25 | Breezy | Gió Mát | | 25 | Comet | Sao Chổi |
| 26 | Fuzzy | Lông Tơ | | 26 | Pretzel | Bánh Xoắn |

Bot Buddy names: "Beepy / Boopy / Zappy Buddy" become "Bạn Robot Bíp / Bạn Robot Bốp / Bạn Robot Tách" (draft).

---

## 6. Business Acceptance Criteria

### 6.1 Choosing a name

| AC ID | Description |
| --- | --- |
| AC01 | **Vietnamese lists.** Given Vietnamese is selected, when I open the identity step, then both lists show the Vietnamese words, sorted in Vietnamese alphabetical order, with the labels and preview in Vietnamese. |
| AC02 | **English unchanged.** Given English is selected, then the lists, labels and preview are as today. |
| AC03 | **Same choice in both languages.** Given I pick the 4th first word and the 2nd last word, when I switch language, then the same two words are still selected, shown in the new language. |
| AC04 | **Preselected and shuffle.** Given the identity step, then a random valid name is preselected and the shuffle button picks another, in either language, so Continue always works. |
| AC05 | **Server validation unchanged.** Given the server receives a name that is not one of the curated words, then it rejects it, as today ([US-004](../release-1.0.1/US-004-choose-a-name-and-avatar.md)). |

### 6.2 Seeing names

| AC ID | Description |
| --- | --- |
| AC06 | **Each viewer's language.** Given players with different languages in the same room, then each device shows every name in that device's language (A02). |
| AC07 | **Everywhere.** Given a name, then it appears in the current language in the lobby, player chips, turn banner, dialogs, action log, toasts, victory screen, screen-reader announcements, and the host's remove and skip controls. |
| AC08 | **Long names.** Given the longest Vietnamese names, then they do not overlap or cut off controls at 320 px width and 150 % text size; a name may wrap or be shortened with an ellipsis where space is tight, and the full name is available as text for assistive technology and in the log. |
| AC09 | **Duplicates.** Given two players with the same two words, then the server adds a number as today and every device shows the number after the name in its language ("…2"). |
| AC10 | **Language switch.** Given I change language while in a room or a game, then all names on my device change at once, including past log lines ([US-064](US-064-vietnamese-localization.md)). |
| AC11 | **Bots.** Given a Bot Buddy, then its name shows in the viewer's language. |
| AC12 | **Reading order.** Given a Vietnamese name, then the two words appear in the Vietnamese order (Q2) and the English name keeps "adjective noun". |
| AC13 | **Screen readers.** Given Vietnamese names, then they are marked with the Vietnamese language so they are read correctly. |

### 6.3 Quality and safety

| AC ID | Description |
| --- | --- |
| AC14 | **Native review.** Given release, then a native speaker has approved all 52 words and the bot names for meaning, tone and spelling, including tone marks. |
| AC15 | **Child safety.** Given any word, then it has no vulgar, insulting or sensitive meaning in standard, northern or southern Vietnamese, or in combinations of any first and last word (checked for all pairs, or the lists are shaped so no pair can read badly). |
| AC16 | **Diacritics.** Given any Vietnamese word, then every letter and tone mark renders in the game's fonts ([US-064](US-064-vietnamese-localization.md) AC20). |
| AC17 | **Completeness check.** Given a release build, then an automated check fails if an English word has no Vietnamese form, or the lists have different lengths. |
| AC18 | **No new personal data.** Given the change, then no new data is collected or stored; the stored name is still two curated words ([US-042](../release-1.0.1/US-042-privacy-by-default.md)). |

---

## 7. Business Rules

| ID | Rule |
| --- | --- |
| BR01 | A name is two curated words. Both lists have a Vietnamese and an English form. |
| BR02 | The stored identity of a name does not depend on language; only its display does. |
| BR03 | A viewer always sees names in their own language, with a fallback to English for any missing word. |
| BR04 | Vietnamese names follow Vietnamese word order. |
| BR05 | Names are plain text everywhere, never executed or styled from user input. |

---

## 8. Out of Scope

| ID | Description |
| --- | --- |
| OOS1 | Free-text names in any language (OQ-14). |
| OOS2 | More than 26 words per list, or new themes (can be added later as data). |
| OOS3 | Other languages. |
| OOS4 | Speaking names aloud ([US-064](US-064-vietnamese-localization.md) OOS4). |
| OOS5 | Translating avatar names (already done in US-064). |
| OOS6 | Letting a player pick a name by typing. |

---

## 9. Non-functional Requirements

*Values marked "proposed" are not from the source input and need confirmation.*

| Requirement | Description |
| --- | --- |
| Compatibility | The protocol, the server and stored names do not change (A03); a player on an older client still joins |
| Performance | Both word lists load with the language catalog; switching language is instant ([US-064](US-064-vietnamese-localization.md)) |
| Layout | The longest name fits or wraps cleanly at 320 px and 150 % text size, in all places listed in AC07 |
| Accessibility | Language tag on names; no colour-only cues; lists operable by keyboard as today ([US-035](../release-1.0.1/US-035-keyboard-operation-and-visible-focus.md)) |
| Privacy | No new data; names stay in memory for the life of the room ([US-056](../release-1.0.1/US-056-room-lifetime-and-data-deletion.md)) |

---

## 10. Dependencies

| Dependency | Why |
| --- | --- |
| [US-004](../release-1.0.1/US-004-choose-a-name-and-avatar.md) | The name builder this story extends |
| [US-064](US-064-vietnamese-localization.md) | Language switch, catalogs, fonts; its Q5 decision is reversed here |
| [US-007](../release-1.0.1/US-007-show-whose-turn-it-is-and-each-player-s-status.md), [US-013](../release-1.0.1/US-013-recent-action-message-log.md), [US-025](../release-1.0.1/US-025-victory-screen.md), [US-055](../release-1.0.1/US-055-lobby-with-host-controls.md) | Places that show names |
| [US-023](../release-1.0.1/US-023-bot-buddies-fill-empty-seats.md) | Bot names |
| [US-033](../release-1.0.1/US-033-responsive-layouts-across-device-classes.md), [US-039](../release-1.0.1/US-039-text-size-setting.md) | Layout with longer names |
| Native Vietnamese reviewer; child-safety review | Word quality and safety (OQ-14) |

---

## 11. Traceability

| Requirement source | Covered by |
| --- | --- |
| Team: "tên nhân vật … first name, last name … tên tiếng Việt" | AC01–AC04, §5 word table |
| Names visible to other players | AC06, AC07, AC09, AC10 |
| OQ-14 (curated words, child safety) | AC14, AC15 |
| US-064 Q5 (names not translated) | Reversed by A02, AC06 |

---

## 12. Decisions and open questions

### Decisions taken by the product owner
| # | Decision |
| --- | --- |
| D1 | **Word order** (Q2): the Vietnamese name reads in the natural Vietnamese order, noun then describing word ("Bánh Quy Buồn Ngủ"). English stays "Sleepy Biscuit". |
| D2 | **Each viewer's language** (Q5): every device shows every name in its own language. |
| D3 | **Labels** (Q3): the two lists are called **"Tên đệm"** (first, the noun) and **"Tên"** (second, the describing word), in the order they read. |
| D4 | **Common words** (Q4): use widely understood words (for example "Đậu Phộng", "Dưa Chuột"). |
| D5 | Release 1.0.2 (Q7); 26 words per list (Q6). |

### Still open
| # | Area | Question | Owner |
| --- | --- | --- | --- |
| Q1 | Content | Native and child-safety review of the 52 words and the bot names | Product owner |

### Original questions (answered above)

| # | Area | Question | Recommendation / default used | Owner |
| --- | --- | --- | --- | --- |
| **Q1** | Content | Who reviews the 52 Vietnamese words and the bot names (meaning, tone, regional use)? | A native reviewer plus the child-safety review before release | Product owner |
| **Q2** | Content | Should the Vietnamese name read "thing + describing word" (Bánh Quy Buồn Ngủ) or keep the English order (Buồn Ngủ Bánh Quy)? | Vietnamese order | Product owner |
| **Q3** | UX | What do the two list labels say in Vietnamese? The team calls them "first name" and "last name". | "Từ thứ nhất / Từ thứ hai" (as in the current catalog) or "Tên đệm / Tên" | Product owner |
| **Q4** | Content | North and south differences: "Đậu Phộng" (south) or "Lạc" (north); "Dưa Chuột" (north) or "Dưa Leo" (south)? | Pick one set and keep all words understandable in both regions | Reviewer |
| **Q5** | Product | Should each viewer see the name in their own language (A02), or exactly as the picker saw it? | Each viewer's own language | Product owner |
| **Q6** | Content | Are 26 words per list enough, and should more fun words be added now? | Keep 26 each; add later as data | Product owner |
| **Q7** | Release | Is this release 1.0.2 or later? | 1.0.2 (proposed) | Product owner |

---

## 13. Review (INVEST, Definition of Ready)

| Check | Result |
| --- | --- |
| **Independent** | Yes, once Vietnamese exists ([US-064](US-064-vietnamese-localization.md)) |
| **Negotiable** | Yes. Words, order and labels are proposals |
| **Valuable** | Yes. Names are the most visible text the players choose themselves |
| **Estimable** | Yes. It is mostly data (52 words, 3 bot names) plus display changes |
| **Small** | Yes. It fits one iteration, if the word review is ready |
| **Testable** | Yes. Word quality needs a native reviewer |
| DoR | Present, except **priority** (suggested **Should**) and the **reviewed word list** |

**Quality notes:** the stored name does not change, so no protocol or server change is needed (A03); every open choice is in §12; no new personal data (AC18).
