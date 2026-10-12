# Dev spec — US-053 QR code for joining a room

| Item | Value |
| --- | --- |
| Story | [US-053](../user-stories/release-1.0.1/US-053-qr-code-for-joining-a-room.md) · **Could** · Rooms and lobby |
| Status | Draft v0.1 (proposed) · [Baseline](README.md) |
| Refs | F-32, UQ-07 |
| Area | `apps/client` (`ShareRoomPanel`) |

## 1. Goal

Let the host show a QR code of the share link so people in the same place can join by scanning, with no third-party service.

## 2. Technical design

- A small, dependency-light QR generator library is imported **lazily** (dynamic import) only when the host presses **Show QR code**, so it does not count toward the initial bundle (US-049).
- The QR encodes exactly the share link from `buildShareLink` (US-054): `https://<domain>/join/<code>`. Error correction level M; quiet zone ≥ 4 modules; rendered as inline `<svg>` (crisp at any size), at least 200 px.
- The component wraps it as `role="img"` with `aria-label="QR code for joining room K7M4QX"`; the room code stays visible as text below it.
- The QR is shown only while the room is joinable (phase `LOBBY` and fewer than 4 members); otherwise it is hidden and the toggle is removed.
- Colours: dark modules on white regardless of theme, for scanner contrast.
- No network call is made; generation is local.

## 3. Edge cases and errors

- Generation throws or the module fails to load: show "Couldn't make a QR code. Use the link or code instead." and keep the other controls.
- Reduced motion: no animated reveal.
- Link changes (rematch lobby, new code never happens within a room); the QR re-renders on `room.update`.

## 4. Verification

| Check | Level |
| --- | --- |
| Decoding the rendered QR (test decoder) yields the exact share link | U, C |
| QR hidden when full or started | C |
| Lazy chunk absent from the initial bundle | CI (bundle report) |
| Text alternative and visible code present | C |
| No third-party requests | E |

## 5. Tasks

1. Add lazy QR generation and the `QrCode` component.
2. Add the toggle to `ShareRoomPanel`.
3. Add tests.

## 6. Dependencies and risks

- Depends on US-054.
- Risk: library size. Mitigation: pick a small implementation; the budget check covers it.
