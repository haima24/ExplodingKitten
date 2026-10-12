# Dev spec — US-054 Share the room code and link

| Item | Value |
| --- | --- |
| Story | [US-054](../user-stories/release-1.0.1/US-054-share-the-room-code-and-link.md) · Must · Rooms and lobby |
| Status | Draft v0.1 (proposed) · [Baseline](README.md) |
| Refs | F-18, FR-03, DAC-31, OQ-18, OQ-19 |
| Area | `apps/client` (`features/rooms/ShareRoomPanel`) |

## 1. Goal

One-tap copy and share of the room code and link for the host, with accessible feedback and safe wording.

## 2. Technical design

### 2.1 Component `ShareRoomPanel`

| Part | Behaviour |
| --- | --- |
| Code display | Real text, letter-spaced, `H1` size. `aria-label` reads letters separately ("K, 7, M, 4, Q, X") |
| **Copy code** | `navigator.clipboard.writeText(code)`; success → toast and announcement "Code copied" |
| **Copy link** | Copies `` `${location.origin}/join/${code}` ``; announcement "Link copied" |
| **Share…** | Rendered only when `navigator.share` exists; calls it with `{ title, text: copy("share.message"), url }`; user cancel is silent |
| Fallback | If the clipboard call rejects or is missing, show the text in a read-only input, selected, with "Press and hold to copy" |
| Safety line | `share.trust` = "Only share this with people you trust." |
| State | `phase !== LOBBY` or members = 4 → panel shows "Room full" or "Game in progress"; Copy and Share are hidden |

- **Host only:** the buttons render when `room.hostId === session.playerId`; players see the code text only (OQ-18).
- The link contains only the room code: never a name, id, or token. A unit test asserts the builder's output matches `/join/[A-Z2-9]{6}`.
- Copy strings: `share.message` = "Join my Whisker Boom game!".

### 2.2 Link building

`buildShareLink(origin, code)` is a pure function in `lib/links.ts`. `origin` comes from `location.origin` (the production domain still has to be chosen, see OQ-20).

## 3. Edge cases and errors

- Clipboard blocked (insecure context, permissions): fallback input.
- Share sheet unsupported (desktop): button not rendered, never disabled.
- Link opened after expiry: handled by US-006 and US-056.

## 4. Verification

| Check | Level |
| --- | --- |
| Link builder output has only the code | U |
| Copy success announces text; failure shows the fallback | C |
| Share button absent when `navigator.share` is undefined | C |
| Share controls absent for non-hosts | C |
| Panel switches to "Room full" and "Game in progress" | C |
| Code read letter by letter by the accessible name | C, M (screen reader) |

## 5. Tasks

1. Build `buildShareLink` and `ShareRoomPanel`.
2. Wire clipboard, share, fallback, and announcer.
3. Add copy keys and tests.

## 6. Dependencies and risks

- Depends on US-003 (code exists); the lobby hosts the panel (US-055); QR is US-053.
- Risk: mobile browser share-sheet quirks. Mitigation: feature-detect; manual device test.
