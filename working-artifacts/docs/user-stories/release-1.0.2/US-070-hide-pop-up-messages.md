# US-070 — Option to hide pop-up messages (toasts)

[Back to story index](../README.md) | Format: NT user story standard ([UserStoryGeneration.agent.md](../../../../instructions/BA/UserStoryGeneration.agent.md)) | Status: **Draft for review** | Release: **1.0.2** (proposed)

| Field | Value |
| --- | --- |
| Project | Whisker Boom (Exploding Kittens-style family card game, online multiplayer) |
| Module | Settings; Gameplay UI |
| Audience | Product owner, dev team, QA, accessibility reviewer |
| Source inputs | Team note (Vietnamese): "viết thêm 1 US về ẩn toast (mặc định là hiện)"; current code in `working-artifacts/src/` (the `Toast` component and the places that raise toasts); [US-013](../release-1.0.1/US-013-recent-action-message-log.md), [US-036](../release-1.0.1/US-036-screen-reader-support.md), [US-038](../release-1.0.1/US-038-settings-reduced-motion-and-sound.md), [US-040](../release-1.0.1/US-040-invalid-action-feedback.md), [US-064](US-064-vietnamese-localization.md) |
| Confidence | Medium-high. The behaviour is confirmed from the code. The exact list of what is hidden is a proposal (see §12) |

---

## 1. User Story

### User Story ID
US-070

### User Story Name
Option to hide pop-up messages (toasts)

### Epic
Responsive UI and accessibility (settings)

### User Story
As a **player** I want to **turn off the short pop-up messages that appear over the game, and keep them on by default**, so that **they do not cover my cards and buttons, or distract me, while the information I need is still available elsewhere.**

### Raw input from the team (kept for traceability; Vietnamese, intent preserved)
- Viết thêm 1 US về ẩn toast (mặc định là hiện): add a story about hiding toasts, **shown by default**.

### What a "toast" is today (confirmed from the code)
A toast is a small dark message at the bottom of the screen. It shows for **4 seconds**, one at a time (a new one replaces the old one), and has an **×** to close it. It is the **visual copy** of a message: the spoken version is handled separately by the screen-reader announcements.

| Raised by | Example text |
| --- | --- |
| Start of the game | "Everyone has cards! [Name] goes first" |
| Skip, Attack | "[Name] hopped over their draw!", "[Name] passed it on!" |
| Nope | "[Name] played Nope!", "[Name]'s [Card] was stopped!" |
| Shuffle | "Deck shuffled!" |
| Turn timer | "[Name] ran out of time" |
| Your own private results | "You got [Card]" (a draw), "You got [Card]!" (Favor), "You took [Card]!" (Cat card pair) |
| Room notices | "[Name] is the new host", "[Name]'s connection dropped" |

**Not toasts** (and not affected): the recent-moves log, inline messages next to a control after a refused move ([US-040](../release-1.0.1/US-040-invalid-action-feedback.md)), the connection banner and indicator, the absent-player banner, hints, dialogs, the turn countdown, voice lines, sounds and the screen-reader announcements.

**Why it matters:** on a phone the toast sits over the hand and the action buttons, and covers cards for 4 seconds after almost every move. This was seen in the test screenshots at 390 px wide.

---

## 2. Assumptions

| ID | Description | Impact if wrong |
| --- | --- | --- |
| A01 | The setting is **per device**, like the other settings in [US-038](../release-1.0.1/US-038-settings-reduced-motion-and-sound.md) (stored on the device only). | If it must be per room, the host would choose it for everyone |
| A02 | It is **one switch for all toasts**, not one per type. | Per-type choices would need a longer list (Q3) |
| A03 | Hiding toasts must not remove information. Public events stay in the log and the screen-reader announcements. Private results ("You got [Card]") stay visible as the card in the hand and are announced to a screen reader (see AC08). | A player could miss that they received a card |
| A04 | A toast already on screen disappears at once when the switch is turned off. | None |
| A05 | The default is **on** (toasts shown), as the team said. | None |

---

## 3. Pre-conditions

| ID | Description |
| --- | --- |
| PR01 | The Settings panel exists on the Settings page and as a dialog from the game menu ([US-038](../release-1.0.1/US-038-settings-reduced-motion-and-sound.md)). |
| PR02 | Local storage is available, or the setting is kept for the session only. |

---

## 4. Workflow / Activity Description

1. The player opens **Settings** (from Home, or from the game menu during a game).
2. They see **Pop-up messages** with two choices, **Show** (selected) and **Hide**.
3. They choose **Hide**. Any toast on screen goes away; no new toast appears. The choice is saved on the device.
4. During a game the log, the screen-reader announcements and everything else still report events. Private results still appear in the hand and are announced.
5. The player can choose **Show** again at any time; toasts come back for the next event.

---

## 5. Suggested Mock-up Screens

*Text description. No visual design exists yet; wireframe is TBD.*

| Field / element | Type | Mandatory | Default | Description |
| --- | --- | --- | --- | --- |
| Pop-up messages | Two large radio options in Settings, like Motion and Sound | Yes | **Show** | "Show" and "Hide". Labelled in the selected language ("Hiện" and "Ẩn" in Vietnamese) |
| Help text | Text under the choice | Yes | — | "Short messages that appear over the game for a few seconds. Everything is still in the recent-moves log." |
| Toast | Message at the bottom of the screen | — | Shown | As today when **Show**; never rendered when **Hide** |

---

## 6. Business Acceptance Criteria

### 6.1 The setting

| AC ID | Description |
| --- | --- |
| AC01 | **Default is Show.** Given a new device, or one with no saved choice, then toasts are shown as today. |
| AC02 | **The control.** Given Settings (the page and the dialog from the game menu), then a **Pop-up messages** choice with **Show** and **Hide** is available, reachable by keyboard and screen reader like the other settings. |
| AC03 | **Immediate.** Given I choose **Hide**, then a toast that is on screen disappears at once and no later event shows one; given I choose **Show**, then the next event shows its toast. |
| AC04 | **Remembered.** Given I choose, then the choice is saved on this device and applies in every room and game; given local storage is unavailable, then it applies for the session and no error appears ([US-038](../release-1.0.1/US-038-settings-reduced-motion-and-sound.md)). |
| AC05 | **Per device.** Given two players in a room, then each player's choice affects only their own screen. |
| AC06 | **Mid-game.** Given I change the setting from the game menu, then the game continues for everyone and nothing else changes. |
| AC07 | **Both languages.** Given English or Vietnamese, then the label, the options and the help text exist in both. |

### 6.2 Nothing important is lost

| AC ID | Description |
| --- | --- |
| AC08 | **Private results are still known.** Given I drew, received (Favor) or took (Cat card pair) a card and toasts are hidden, then I still see the card in my hand, and a screen reader announces it to me politely ("You got [Card]"); this announcement is the same whether toasts are shown or hidden. |
| AC09 | **Public events stay in the log.** Given toasts are hidden, then every public event that would have shown a toast is still in the recent-moves log ([US-013](../release-1.0.1/US-013-recent-action-message-log.md)). |
| AC10 | **Announcements unchanged.** Given toasts are hidden, then the screen-reader announcements are exactly the same as when they are shown ([US-036](../release-1.0.1/US-036-screen-reader-support.md)). |
| AC11 | **Other feedback unaffected.** Given toasts are hidden, then inline messages after a refused move, the connection banner, the absent-player banner, hints, dialogs, the turn countdown, sounds and voice lines all work as before. |
| AC12 | **No empty gap.** Given toasts are hidden, then the space they used is not reserved on screen (the hand and buttons use the full area). |

### 6.3 Edge cases

| AC ID | Description |
| --- | --- |
| AC13 | **Start of the game.** Given toasts are hidden, then the "Everyone has cards! [Name] goes first" message is not a toast, but the first player is still clear from the turn banner and announced. |
| AC14 | **Reload.** Given I reload the page, then the saved choice applies from the first screen. |
| AC15 | **Reduced motion and sound unaffected.** Given I change this setting, then the motion and sound settings do not change, and the other way round. |
| AC16 | **New toasts later.** Given a new kind of toast is added in the future, then it follows this setting without extra work. |

---

## 7. Business Rules

| ID | Rule |
| --- | --- |
| BR01 | Toasts are shown by default. |
| BR02 | The choice is per device and is stored on the device only. |
| BR03 | Hiding toasts never removes information: it is always in the log, in the hand or in the announcements. |
| BR04 | The setting affects toasts only; no other message, banner, inline message, dialog, sound or voice line is hidden by it. |

---

## 8. Out of Scope

| ID | Description |
| --- | --- |
| OOS1 | Changing how long toasts last or where they appear. |
| OOS2 | Choosing which kinds of toast to hide (Q3). |
| OOS3 | Hiding the recent-moves log, inline messages, banners or hints. |
| OOS4 | Muting the screen-reader announcements. |
| OOS5 | A room-wide or host-controlled setting. |

---

## 9. Non-functional Requirements

*Values marked "proposed" are not from the source input and need confirmation.*

| Requirement | Description |
| --- | --- |
| Accessibility | Settings control is a real radio group with a visible selected mark and a text label ([US-035](../release-1.0.1/US-035-keyboard-operation-and-visible-focus.md), [US-037](../release-1.0.1/US-037-colour-independence-and-contrast.md)); announcements unchanged |
| Performance | No extra work when toasts are hidden; the change applies at once |
| Privacy | The choice is stored only on the device and never sent anywhere ([US-042](../release-1.0.1/US-042-privacy-by-default.md)); the privacy page's settings line mentions it |
| Layout | The setting fits the Settings panel at 320 px width and 150 % text, in both languages |
| Compatibility | A device with older saved settings gets the default (Show) |

---

## 10. Dependencies

| Dependency | Why |
| --- | --- |
| [US-038](../release-1.0.1/US-038-settings-reduced-motion-and-sound.md) | The Settings panel and how settings are stored |
| [US-013](../release-1.0.1/US-013-recent-action-message-log.md) | The log that keeps every public event |
| [US-036](../release-1.0.1/US-036-screen-reader-support.md) | Announcements that carry the same information |
| [US-040](../release-1.0.1/US-040-invalid-action-feedback.md) | Inline messages, which are not toasts |
| [US-064](US-064-vietnamese-localization.md) | Text in both languages |
| [US-042](../release-1.0.1/US-042-privacy-by-default.md) | The privacy page lists device settings |

---

## 11. Traceability

| Requirement source | Covered by |
| --- | --- |
| Team: "ẩn toast" | AC02, AC03 |
| Team: "mặc định là hiện" | AC01, A05, BR01 |
| Accessibility and no information lost | AC08–AC11, BR03 |
| Existing settings pattern | AC04–AC06 |

---

## 12. Open Questions (Assumptions to validate), by priority

| # | Area | Question | Recommendation / default used | Owner |
| --- | --- | --- | --- | --- |
| **Q1** | Accessibility | Private results ("You got [Card]") are currently shown only as a toast, with no spoken announcement. AC08 adds the announcement for everyone. Agreed? | Yes; it fixes a gap for screen-reader users whether or not toasts are hidden | Accessibility |
| **Q2** | UX | When toasts are hidden, should a card you just received be marked "new" in the hand for a moment? | Yes, a short "new" mark (and the first one to land on keyboard focus is not needed) | UX |
| **Q3** | Scope | One switch for all toasts, or separate switches (for example hide other players' moves but keep "You got [Card]")? | One switch (A02) | Product owner |
| **Q4** | Content | Wording of the setting and help text in Vietnamese ("Tin nhắn nhanh"?) | Native reviewer | Product owner |
| **Q5** | Release | Is this release 1.0.2 or later? | 1.0.2 (proposed) | Product owner |

---

## 13. Review (INVEST, Definition of Ready)

| Check | Result |
| --- | --- |
| **Independent** | Yes. It only needs the existing Settings panel |
| **Negotiable** | Yes. One switch or several, and the "new" mark are open |
| **Valuable** | Yes. Frees the screen, especially on phones, without losing information |
| **Estimable** | Yes. One setting and one condition on showing toasts, plus one announcement |
| **Small** | Yes. Fits well within an iteration |
| **Testable** | Yes. Every AC has an observable result |
| DoR | Present, except **priority** (suggested **Should**) |

**Quality notes:** the list of toasts was taken from the code; the missing spoken announcement for private results was found while writing this story and is covered by AC08 (Q1). No new data is collected.
