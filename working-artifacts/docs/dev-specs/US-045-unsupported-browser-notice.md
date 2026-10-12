# Dev spec — US-045 Unsupported browser notice

| Item | Value |
| --- | --- |
| Story | [US-045](../user-stories/US-045-unsupported-browser-notice.md) · **Could** · Error handling, reliability, connection, and privacy |
| Status | Draft v0.1 (proposed) · [Baseline](README.md) |
| Refs | [Brief §F browser support](../../product-brief.md#f-non-functional-requirements) |
| Area | `apps/client` (boot script) |

## 1. Goal

If the browser lacks features the game needs, show a plain explanation instead of a broken page. The message never appears on supported browsers.

## 2. Technical design

- A small external script `boot-check.js` (shared with US-044, CSP-compliant) runs before the app and feature-detects the required APIs:
  `WebSocket`, `Promise`, `fetch`, `Map`, `Set`, `URL`, `CSS.supports('height', '100dvh')` (or a fallback acceptable), `HTMLDialogElement` with `showModal`, `Intl`, and `sessionStorage` (soft requirement: missing storage only disables rejoin, so it does not block).
- If a hard requirement is missing, replace the page content with a static message: "This game needs a newer browser. Please try the latest Chrome, Edge, Firefox, or Safari." plus the supported list from the brief (latest two stable versions of Chrome, Edge, Firefox, Safari including iOS 16+, Android Chrome).
- No user-agent sniffing; detection is by feature only.
- Markup is plain HTML with real text, headings, and sufficient contrast; no images required.

## 3. Edge cases and errors

- Detection must not run twice or flash the message on slow loads (it decides once, synchronously).
- Soft requirements produce a console warning in development only.

## 4. Verification

| Check | Level |
| --- | --- |
| Feature stubs removed one by one trigger the notice | U (JSDOM or script unit test) |
| Supported browsers never show it (Chromium, Firefox, WebKit) | E |
| Notice is accessible (heading, contrast) | A |

## 5. Tasks

1. Implement the detection list in `boot-check.js`.
2. Add the static notice markup and copy.
3. Add tests.

## 6. Dependencies and risks

- Depends on US-050 and US-044.
- Risk: the required-feature list drifting. Mitigation: it lives in one array reviewed with the browser target list.
