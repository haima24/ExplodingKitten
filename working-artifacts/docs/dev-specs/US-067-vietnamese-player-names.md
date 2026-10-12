# Dev spec — US-067 Vietnamese player names

| Item | Value |
| --- | --- |
| Story | [US-067](../user-stories/release-1.0.2/US-067-vietnamese-player-names.md) · Should · Rooms and lobby; Localization |
| Release | 1.0.2 |
| Status | Draft v0.1 (implemented; Vietnamese words are **draft**, native review required) · [Baseline](README.md) |
| Refs | US-004, US-023, US-064 |
| Area | `apps/client` (display); `packages/protocol` and `apps/server` (one optional field) |

## 1. Goal

Give the two name words Vietnamese forms and show every name in each viewer's own language, without changing what the server stores. The English word stays the **identity** of a name; only its display changes.

## 2. Decisions

| Q | Question | Implemented |
| --- | --- | --- |
| Q2 | Word order | Vietnamese reads noun then describing word ("Bánh Quy Buồn Ngủ"); English stays "Sleepy Biscuit" |
| Q3 | List labels | "Tên đệm" (the noun list, shown first) and "Tên" (the describing word, second) |
| Q4 | Regional words | Widely understood words ("Đậu Phộng", "Dưa Chuột") |
| Q5 | Which language | Each viewer sees names in their own language |
| Q6 | List size | 26 words per list, as today |

## 3. Technical design

### 3.1 Words and display (`apps/client/src/copy/names.ts`)

- `VI_ADJECTIVES` and `VI_NOUNS` map each stored English word to its Vietnamese form (the table in the story). They also cover the Bot Buddy words: Beepy → Bíp, Boopy → Bốp, Zappy → Tách, Buddy → Bạn Robot.
- `wordLabel(kind, word)` returns the word in the current language, or the English word if there is no translation (the fallback rule of US-064).
- `displayName(name)` joins the two words in the language's order and adds the duplicate number ("… 2") when present.
- `nameToken` / `resolveNameTokens`: log lines are stored as keys so they can be re-worded (US-064); a name inside one is stored as a token and turned into text only when shown, so **the whole history re-words when the language changes**. Announcements and toasts are resolved when created.

### 3.2 Where names appear

Every place that formatted a name now calls `displayName`: lobby, player chips, turn banner, dialogs, game menu (remove list), victory screen, absent-player banner, hints, fan dialogs, action log, toasts and screen-reader announcements. The protocol's `formatName` stays for the server's own use.

### 3.3 Name builder (`IdentityStep.tsx`)

- Both lists show the current language's words. In Vietnamese they are sorted with `Intl.Collator('vi')` (correct order for Đ, Ă, Â and tone marks); English keeps its list order.
- The Vietnamese page shows the noun list first ("Tên đệm") then the describing word list ("Tên"), so the lists read like the name. English shows "First word" then "Second word" as before.
- The radio **value** remains the English word, so the request sent to the server is unchanged and server validation (exact match against the curated lists) is unchanged.
- Preview ("Bạn sẽ là …"), the shuffle button and the preselected random name work in both languages. The language switch re-words the picker and keeps the choice.

### 3.4 Notices from the server

Room notices ("X joined", "X left", "X is the new host", "X's connection dropped") carried the name as finished English text. They now also carry `who` (the name words), and the client shows `displayName(who)`. The old `name` text stays for older clients. This is the only protocol change (`RoomNotice.who?`, optional).

### 3.5 Release check

`pnpm lint` runs `apps/client/scripts/check-copy.mjs`, which now also fails if any word in `ADJECTIVES`, `NOUNS` or the Bot Buddy names has no Vietnamese form (story AC17).

## 4. Edge cases and errors

| Case | Behaviour |
| --- | --- |
| Two players, two languages | Each device shows every name in its own language |
| Same two words | Server adds a number as today; shown after the name in both languages |
| Language switched mid-game | All names, including past log lines, re-word at once |
| A word with no Vietnamese form | English word shown |
| Very long name (for example "Bánh Mì Nướng Khúc Khích") | Wraps; no sideways page scroll at 320 px and 150 % text |
| Older client or a missing `who` | Falls back to the English `name` text |
| Rejoin | The stored English words are unchanged; names re-render in the viewer's language |
| Bot Buddy | "Bạn Robot Bíp" in Vietnamese, "Beepy Buddy" in English |

## 5. Verification

| Check | Level |
| --- | --- |
| `check:copy` fails when a word is missing (tried by removing one) | automated (done) |
| English labels and preview unchanged; Vietnamese labels "Tên đệm" / "Tên", words sorted in Vietnamese order, no English word in the Vietnamese lists | E (done, headless Chrome) |
| English device shows the Vietnamese guest as "Giggly Waffle"; Vietnamese device shows the English host as "Bánh Quy Buồn Ngủ" and itself as "Bánh Tổ Ong Khúc Khích" | E (done) |
| Same log history reads in Vietnamese, then in English after switching | E (done) |
| Longest name in the 320 px lobby at 150 % text: no sideways scroll | E (done) |
| Native and child-safety review of all 52 words and the bot names | M (**required before release**) |
| Screen reader reads Vietnamese names correctly | A, M |

## 6. Tasks (all done unless noted)

1. Word maps, `displayName`, tokens, fallback.
2. Replace name formatting everywhere in the client; picker lists, order and labels.
3. `RoomNotice.who` (protocol, server, client).
4. Completeness check in `pnpm lint`.
5. Fix found on the way: the 6-letter room code overflowed a 320 px screen at 150 % text (also in English); it now scales down on narrow phones.
6. Open: native review of the word list; real-device check of long names.

## 7. Dependencies and risks

- Depends on US-004, US-064; reverses US-064 decision Q5 (names not translated).
- Risk: a Vietnamese word or a pair of words with an unfortunate meaning. Mitigation: native and child-safety review before release; the lists are data in one file.
- Risk: names differ between devices in screenshots or support conversations. Accepted by decision; the stored English words identify a name.
