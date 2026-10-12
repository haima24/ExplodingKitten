# Dev spec — US-044 Loading and asset-failure handling

| Item | Value |
| --- | --- |
| Story | [US-044](../user-stories/US-044-loading-and-asset-failure-handling.md) · Should · Error handling, reliability, connection, and privacy |
| Status | Draft v0.1 (proposed) · [Baseline](README.md) |
| Refs | F-27 |
| Area | `apps/client` (`LoadingScreen`, image fallback, boot script) |

## 1. Goal

Show loading only when it matters, keep cards usable if an image fails, and never leave a blank page if the bundle fails to load.

## 2. Technical design

### 2.1 Loading screen

- `LoadingScreen` ("Getting the cards ready…", cat spinner) appears only if loading lasts more than 300 ms (a delayed-visibility hook), so fast loads show nothing.
- Spinner is static when reduced motion is on (US-038).
- Route-level code splitting (Rules, Settings, Privacy) uses `Suspense` with the same screen.

### 2.2 Asset failure

- `CardArt` renders an SVG `<img>` with an `onError` fallback icon by card kind; the card always shows name and type text, so play is unaffected.
- Fonts use `font-display: swap`; system fallbacks keep text readable.

### 2.3 Bundle failure

`index.html` contains a `<noscript>` message and a tiny same-origin `boot-check.js` (external, so CSP-compliant) that, if the app has not mounted after 10 s or a `script` error fires, replaces the root with a plain-HTML message "Something went wrong loading the game" and a **Reload** link. The script has no dependencies.

### 2.4 Network loss mid-game

Already-loaded UI stays visible; the connection banner (US-043) explains the state; no extra fetches are required to render the board.

## 3. Edge cases and errors

- Slow 3G: skeleton-free; loading screen after 300 ms, then the app.
- Failed route chunk: error boundary (US-041) shows recovery; Reload fixes stale chunks after a deploy.
- Offline PWA is a Could item (not here).

## 4. Verification

| Check | Level |
| --- | --- |
| No loading screen for loads under 300 ms; shown after | C (fake timers) |
| Blocked card images: cards still show name and fallback icon | E (route blocking) |
| Blocked JS bundle: plain-HTML message with Reload | E |
| Reduced motion: static spinner | C |
| Axe on loading and failure messages | A |

## 5. Tasks

1. Build `LoadingScreen` and the delayed-visibility hook.
2. Add `CardArt` fallback.
3. Add `boot-check.js` and the `noscript` message.
4. Add tests.

## 6. Dependencies and risks

- Depends on US-050; uses US-038, US-041, US-043.
- Risk: the boot script masking real errors. Mitigation: it only acts when the app never mounted.
