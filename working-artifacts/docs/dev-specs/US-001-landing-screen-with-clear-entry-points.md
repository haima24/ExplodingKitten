# Dev spec — US-001 Landing screen with clear entry points

| Item | Value |
| --- | --- |
| Story | [US-001](../user-stories/release-1.0.1/US-001-landing-screen-with-clear-entry-points.md) · Must · Home and navigation |
| Status | Draft v0.1 (proposed) · [Baseline](README.md) |
| Refs | F-01, FR-01, DAC-01, [UI/UX §D1](../../ui-ux.md#d1-landing--home-screen--m-us-001-us-002) |
| Area | `apps/client` |

## 1. Goal

Home shows **Create a room**, **Join a room**, **How to Play**, **Settings**, a rejoin banner when applicable, and a plain privacy footer. It works without the server for the two static buttons.

## 2. Technical design

### 2.1 Modules

| Path | Change |
| --- | --- |
| `features/home/HomePage.tsx` | Page layout (portrait stack, landscape split) |
| `features/home/RejoinBanner.tsx` | Shown when `sessionStorage["wb.session"]` exists; **Rejoin** and **Forget it** |
| `components/common/Button` | `variant: primary | secondary`, min height 56 px / 48 px |
| `components/common/Logo`, `Illustration` | SVG, decorative (`aria-hidden`) |
| `copy/en.ts` | `home.create`, `home.join`, `home.rules`, `home.settings`, `home.footer`, `home.cannotConnect`, `home.rejoin.*` |

### 2.2 Behaviour

1. Buttons navigate: Create → `/create`, Join → `/join`, How to Play → `/rules`, Settings → `/settings`.
2. **Create** and **Join** first ensure a connection: the `ConnectionManager` (US-043) tries to connect with a 5 s timeout. On failure show `home.cannotConnect` inline under the buttons and stay on Home; the two static buttons never depend on the server.
3. **Rejoin banner:** shown when a stored session exists. **Rejoin** calls `room.rejoin` (US-043); on success navigate to `/room/:code`; on `BAD_TOKEN`, `ROOM_NOT_FOUND`, or `ROOM_CLOSED` clear the session and hide the banner. **Forget it** clears the session (no server call needed).
4. **Footer copy:** "No sign-up. No ads. We only keep a nickname for as long as your room is open."
5. **Visual priority:** Create uses `variant="primary"`; the other three use `secondary`.

### 2.3 Layout

Mobile portrait: single column, full-width buttons, illustration above. Mobile landscape (`max-height: 500px`): illustration left, buttons right. All four buttons visible at 320 × 568 without scrolling.

## 3. Edge cases and errors

- Assets fail to load: text labels and buttons still render (no text inside images).
- Session storage unavailable: banner never shows; no error.
- Rapid repeated presses on Create: only one connection attempt in flight.

## 4. Verification

| Check | Level |
| --- | --- |
| Four buttons with roles and names; Create is the only primary | C |
| Banner visible with stored session; Forget clears it | C |
| 320 × 568: no horizontal scroll, buttons ≥ 48 px high | E |
| Server down: Create shows the message; How to Play still opens | E |
| Axe scan of Home, with and without banner | A |

## 5. Tasks

1. Build `Button`, `Logo`, `Illustration`, copy keys.
2. Build `HomePage` layout with responsive CSS.
3. Build `RejoinBanner` with the session helper.
4. Wire connection check and error message.
5. Add component, E2E, and axe tests.

## 6. Dependencies and risks

- Depends on US-050; uses US-043 for connection and rejoin.
- Risk: placeholder art. Mitigation: layout does not depend on art size.
