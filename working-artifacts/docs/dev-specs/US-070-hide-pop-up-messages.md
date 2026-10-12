# Dev spec — US-070 Option to hide pop-up messages (toasts)

| Item | Value |
| --- | --- |
| Story | [US-070](../user-stories/release-1.0.2/US-070-hide-pop-up-messages.md) · Should · Responsive UI and accessibility (settings) |
| Release | 1.0.2 |
| Status | Draft v0.1 (implemented) · [Baseline](README.md) |
| Refs | US-013, US-036, US-038, US-040, US-064 |
| Area | `apps/client` only |

## 1. Goal

A device setting **Pop-up messages: Show (default) / Hide**. Hiding removes the short toast messages without losing information: public events stay in the log, announcements keep working, and private results ("You got …") stay visible in the hand and are announced.

## 2. Decisions

| # | Decision |
| --- | --- |
| D1 | One switch for all toasts (no per-type choices) |
| D2 | Default **Show**; stored on the device with the other settings |
| D3 | Private results are announced to screen readers whether or not toasts show (this fixes a gap: they used to be a toast only) |
| D4 | While toasts are hidden, a card just received gets a short **"New"** mark in the hand (about 3.5 s) |

## 3. Technical design

- `Settings.toasts: boolean`, default `true` (`lib/settings.ts`); `validate` keeps `true` unless the saved value is `false`, so older saved settings get the default.
- **Settings panel:** a "Pop-up messages" radio group (Show, Hide) with a help line, same pattern as Motion and Sound, on the Settings page and in the dialog from the game menu. Copy in both languages (`settings.toasts*`, "Tin nhắn nhanh", "Hiện", "Ẩn").
- **Not shown when hidden:** `GameClient.toast()` returns early when the setting is off, and the `Toast` component renders nothing when it is off, so nothing appears even if a message is already in the store.
- **Gone at once:** the reducer rule `withToastRule` clears `ui.toast` whenever settings change to `toasts: false`.
- **Private results announced:** `processGameUpdate` now also pushes the text of "You got [card]" (a draw), "You got [card]!" (Favor) and "You took [card]!" (a Cat card pair) to `announcements`.
- **"New" mark:** `processGameUpdate` returns `newCardId` for those three events. When toasts are hidden, `GameClient` sets `ui.newCardId` and clears it after 3.5 s; `Hand` passes `isNew` to `Card`, which shows a "New" badge (`card.new`: "New" / "Mới").
- **Announcer queue** (`lib/announcer.ts`): polite messages used to overwrite each other when several arrived in one update, so only the last was spoken. They are now queued and spoken one after another (900 ms apart, at most 6 waiting, the oldest dropped). Assertive messages are still immediate. Without this the new private announcements, and the explosion and trophy lines (US-069), could be lost.
- **Privacy page:** the settings line now lists pop-up messages (both languages).

## 4. Edge cases and errors

| Case | Behaviour |
| --- | --- |
| Local storage unavailable | Applies for the session only; no error |
| Two players in one room | Each device decides for itself |
| Toasts hidden mid-game from the menu | The game continues for everyone |
| Reload | The saved choice applies from the first screen |
| Many announcements in one update | Spoken in order; a backlog beyond 6 drops the oldest |
| Inline messages after a refused move, banners, hints, dialogs, countdown, sounds, voice | Not toasts; unaffected |
| Older saved settings without `toasts` | Treated as Show |

## 5. Verification

| Check | Level |
| --- | --- |
| Default is Show; a draw shows "You got …" | E (done) |
| Choosing Hide from the game menu's Settings dialog removes the toast on screen at once; the choice is saved | E (done) |
| With Hide: no toast after a draw; the new card is marked "New" and the mark goes away by itself | E (done) |
| The draw is still announced (queue shows "You got …" among the messages) | E (done) |
| The recent-moves log still lists moves | E (done) |
| After a reload the choice still applies; Show brings the pop-ups back | E (done) |
| Screen-reader check of the queued announcements | A, M |
| Settings panel at 320 px and 150 % text, both languages | M |

## 6. Tasks (all done unless noted)

1. Setting, storage and panel; both languages.
2. Hide logic in the client, the component and the reducer.
3. Private-result announcements and the "New" mark.
4. Announcer queue.
5. Open: unit tests (deferred), screen-reader review.

## 7. Dependencies and risks

- Depends on US-013, US-036, US-038, US-040, US-064.
- Risk: the announcer queue makes spoken messages arrive up to a few seconds after the event in busy updates. Mitigation: 900 ms gap, 6-message cap.
- Risk: a player hides pop-ups and misses a private result. Mitigation: the announcement and the "New" mark.
