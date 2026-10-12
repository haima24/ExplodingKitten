# Dev spec — US-064 Vietnamese localization (text and voice)

| Item | Value |
| --- | --- |
| Story | [US-064](../user-stories/release-1.0.2/US-064-vietnamese-localization.md) · Should (text) / Could (voice) · Localization |
| Release | 1.0.2 |
| Status | Draft v0.1 (implemented; Vietnamese wording is **draft**, native review required) · [Baseline](README.md) |
| Refs | US-004, US-029, US-030, US-036, US-038, US-039, US-040, US-042, US-052, US-063 |
| Area | `apps/client` only (no protocol or engine change) |

## 1. Goal

Let a device play the whole game in Vietnamese or English, and optionally hear short spoken lines, without changing rules, the protocol, or what other players see. Language is a **per-device** setting.

## 2. Decisions taken for the open questions

| Q | Question | Implemented |
| --- | --- | --- |
| Q2 | Pre-recorded or text-to-speech | **Pre-rendered files**, as the story recommends. The browser's speech engine gave a wrong or missing Vietnamese voice on Chrome and Firefox (Windows), so every line is a small MP3 (`public/voice/<lang>/<id>.mp3`, about 12 KB each, 46 files) made by `apps/client/scripts/generate-voice.py` from the catalog with Microsoft neural voices (Jenny for English, HoaiMy for Vietnamese). They sound the same in every browser. The browser's speech engine is only a fallback if a file cannot be played. Licence of the generated audio must be checked before a commercial release; recordings can replace the files (same names) |
| Q3 | "Vả" or "Tấn Công" | Card name "Vả" |
| Q4 | V01 wording | "Đến lượt bạn rút." (team's wording) |
| Q5 | Player names | ~~Shown as created, never translated~~ **Reversed by [US-067](US-067-vietnamese-player-names.md):** the curated name words have Vietnamese forms and each viewer sees names in their own language |
| Q6 | English voice | Yes, same 18 lines |
| Q7 | Screen readers | Voice-over stays off by default; one-step off switch |
| Q8 | Stale line | 3 s |
| Q9 | Privacy page | Vietnamese draft plus a notice that it awaits legal review |
| Q10 | Voice volume | Separate slider, default 100 % of the device speech volume |

## 3. Technical design

### 3.1 Text catalog

- `copy/en.ts` stays the source of keys (`CopyKey`). `copy/vi.ts` is `Partial<Record<CopyKey, string>>`, so a typo in a key fails the build and a missing key falls back to English.
- `t(key, params)` reads the current language and uses `vi[key] ?? en[key]`. No key, blank or `undefined` can reach the screen.
- `copy/locale.ts`: `Language = 'en' | 'vi'`, `getLocale`, `setLocale`, `subscribeLocale`, `detectLanguage`, `speechTag`.
- **Card text** (`copy/cards.ts`): `cardName`, `cardEffect`, `cardNotPlayableReason`. English comes from the engine catalog (the engine stays language-free); `viCards` overrides it. Every component uses these helpers instead of reading the catalog text.

| Card | Vietnamese (draft) |
| --- | --- |
| Exploding Kitten | Mèo Nổ Tung |
| Defuse | Gỡ Bom |
| Skip | Bỏ Qua |
| See the Future | Tiên Tri |
| Shuffle | Xáo Bài |
| Cat card | Thẻ Mèo |
| Attack | Vả |
| Favor | Nhờ Vả |
| Nope | Không! |

- **Log entries** are stored as `{ seq, key, params?, cards? }` (card kinds, not words), so the whole history re-words when the language changes. `logText(entry)` renders it. The deck-shuffle animation tests `entry.key`, not text.
- Names with no player use `common.someone`.

### 3.2 Language setting

- `Settings.language`, saved with the other device settings (`wb.settings`). Rule: **saved choice, else the browser language (`vi*` → Vietnamese), else English.**
- Applying: `applySettings` sets `<html lang>`; the document title follows the language.
- Re-rendering: `setLocale` runs in a layout effect in `StoreProvider` (before paint). `App` subscribes to the locale store (`useSyncExternalStore`), so the whole tree re-renders while all state (open dialogs, game, hand, turn) is kept. Switching mid-game keeps the Settings dialog open.
- Switchers: Settings (radio buttons, each name in its own language, with `lang` attributes) and a one-tap button on Home that names the other language.
- Reducer action `settings/patch` (see US-063).

### 3.3 Fonts and layout

- `main.tsx` also imports the **Vietnamese subsets** of Baloo 2 (700, 800) and Nunito (400, 700). They are self-hosted (no outside request) and the browser fetches them only when Vietnamese letters are shown.
- Tone marks on capitals are covered by the existing line heights; text wraps; the Vietnamese catalog was checked at 390 px width.
- Text is UTF-8 and written in composed form.

### 3.4 Release check

`apps/client/scripts/check-copy.mjs` (run by `pnpm lint`, or `pnpm check:copy`) fails if an English key has no Vietnamese value or the Vietnamese file has a key English does not (story AC11).

### 3.5 Voice-over

- `Settings.voice` (default off) and `voiceVolume` (default 100). `lib/voice.ts` is a lazy chunk loaded only after the player turns voice on; the audio files are fetched only then (all 20 lines of the chosen language are preloaded, about 250 KB).
- Lines live in the catalog as `voice.V01` … `voice.V18` (and `V05b`), in both languages. **They never contain a player name or a card in a hand.**
- `processGameUpdate` returns `voice: { id, priority }[]` computed for **this player** from the events they receive:

| ID | Trigger | Priority | Who |
| --- | --- | --- | --- |
| V01 | `TURN_STARTED` for me | 1 | me |
| V03 | `DRAWN_CARD` (private) | 0 | the drawer |
| V04 | 5 s left (`TurnClockEffects`) | 2 | the active player |
| V05 / V05b | `TURN_TIMEOUT` for me (turn / other step) | 2 | me |
| V06 / V06a | `EFFECT_APPLIED` Attack (others / the next player) | 1 | all |
| V07 | `EFFECT_APPLIED` Skip | 0 | all |
| V08 | `PEEKED` by me | 0 | me (never the cards) |
| V09 | `DECK_SHUFFLED` | 0 | all |
| V10 | `FAVOR_REQUESTED` with me as target | 1 | the target |
| V11 | `NOPE_RESOLVED` cancelled | 0 | all |
| V12 | window opens and I hold a Nope (`decision`) | 0 | Nope holders |
| V13 | `BOOM_DRAWN` with a Defuse (private) | 1 | the drawer |
| V14 | `TREAT_USED` | 0 | all |
| V15 / V16 | `PLAYER_OUT` (me / someone else) | 2 / 0 | all |
| V17 / V18 | `GAME_FINISHED` (I won / someone else) | 2 | all |
| V19 / V20 | `CARD_STOLEN` (I took / was taken from) | 0 / 1 | the taker / the target (US-065) |
| V21 | `STEAL_STARTED` with me as the taker | 1 | the taker (US-066) |

- Because these use the same events as the log, a voice line can never reveal more than the log or the player's private events already show. Attack, Skip and the Nope result use `EFFECT_APPLIED` / `NOPE_RESOLVED`, so a stopped card is not voiced as if it happened.
- Playback (`enqueueVoice`): one line at a time, highest priority first, lines older than 3 s are dropped, a priority-2 line cuts off a low-priority line, nothing speaks while the tab is hidden, and nothing is replayed after a reconnect (snapshots carry no events). A sound effect plays first (the voice starts after it, up to 1.5 s).
- Controls: Settings radio and slider; a "Replay last line" button in the game banner; a note when the device has no voice for the language; turning voice on speaks a short sample.
- Files: each line is fetched once and kept as a local blob (plain `fetch`, so it works in every browser without range requests), then played with an audio element at the voice volume. The server serves `.mp3` as `audio/mpeg` and the content-security policy gains `media-src 'self' blob:` (see US-042). If a file is missing, blocked or refused, the browser's speech engine reads the line instead.
- Regenerating: change a line in `en.ts` / `vi.ts`, then run `python apps/client/scripts/generate-voice.py` (needs `pip install edge-tts` and internet). `pnpm lint` fails if any voice line lacks a file in either language.
- Errors: any failure to play is ignored; the text is always shown.

## 4. Edge cases and errors

| Case | Behaviour |
| --- | --- |
| Missing Vietnamese string | English text for that string only |
| Language changed during a game | Everything re-words at once, nothing resets; the log history re-words; transient toasts shown just before stay in their old language |
| Two players, two languages | Each sees their own; each log is built locally from events |
| Storage unavailable | Language applies for the session |
| Vietnamese browser, saved English choice | English (saved choice wins) |
| No speech engine or no Vietnamese voice | Voice-over works as far as the browser allows; Settings explains; text unchanged |
| Reload | Language and voice setting restored; no spoken backlog |
| Player names | Shown in each viewer's language (US-067, reverses Q5) |
| Privacy page | Vietnamese draft with a legal-review notice |

## 5. Verification

| Check | Level |
| --- | --- |
| `check:copy`: every key present in both catalogs | automated (in `pnpm lint`) |
| Browser language `vi-VN` opens in Vietnamese; saved choice wins; Home switch works | E (done) |
| Switch mid-game keeps the Settings dialog open; hand labels, countdown and log history are Vietnamese | E (done) |
| Another player in the same room stays in English | E (done) |
| Vietnamese font subsets are fetched | E (done) |
| Reload keeps Vietnamese and shows the correct countdown | E (done) |
| Voice lines reach only the right player; no card or name is spoken | E (done, spy on `speechSynthesis`) |
| Lines play from the MP3 files in a full game, the speech engine is not used, no console or content-security errors | E (done, headless Chrome) |
| Same voice in Chrome, Firefox and Edge on Windows | M (**to confirm on each**) |
| Text expansion at 320 px and 150 % text size; tone marks on capitals not clipped | M (screenshots at 390 px reviewed; 320 px open) |
| Native speaker approves all Vietnamese text, card names and lines | M (**required before release**) |
| Screen reader reads Vietnamese correctly; voice and announcements do not clash | A, M |

## 6. Tasks (all done unless noted)

1. Locale module, `t()` fallback, card text helpers, log entries as keys.
2. `vi.ts` catalog and card text; fonts; `<html lang>`.
3. Language switcher in Settings and Home; setting persisted.
4. Voice module, line catalog, per-player cue rules, controls.
5. Copy parity script.
6. Open: native-speaker review; 320 px check; recorded voice set (Q2, Q11).

## 7. Dependencies and risks

- Depends on US-063 (audio settings, timer lines), US-038, US-039, US-036, US-040, US-029 to US-032, US-042.
- Risk: draft wording. Mitigation: all Vietnamese text is in `vi.ts` and `viCards`; review before release.
- Risk: the generated voice files use Microsoft's service. Mitigation: licence check before a commercial release; files are replaceable by recordings with the same names.
- Risk: pronunciation of a line may still be off. Mitigation: native-speaker review; fix by changing the line's spelling and regenerating.
- Risk: legal text translated without review. Mitigation: visible notice (US-042 launch gate).
