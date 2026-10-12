# Dev spec — US-041 Unexpected-error recovery

| Item | Value |
| --- | --- |
| Story | [US-041](../user-stories/release-1.0.1/US-041-unexpected-error-recovery.md) · Must · Error handling, reliability, connection, and privacy |
| Status | Draft v0.1 (proposed) · [Baseline](README.md) |
| Refs | F-14, DAC-26 |
| Area | `apps/client` (`ErrorBoundary`, `ErrorScreen`) |

## 1. Goal

If rendering or client logic throws, show a friendly recovery screen instead of a blank page, and let the player get back into their seat or Home.

## 2. Technical design

### 2.1 Components

- `ErrorBoundary` at the app root and one per route. On error: log to the browser console only (no names, no game content, nothing sent anywhere), then render `ErrorScreen`.
- `ErrorScreen`: confused-cat art, "Oops, something went wrong.", buttons **Try again** and **Back to home**. No stack trace or technical text is rendered.

### 2.2 Try again

1. Reset the boundary.
2. If a stored session exists, call `room.rejoin` (US-043) to rebuild state from a fresh server snapshot; on success render the room, else go Home.
3. If there is no session, go Home.

### 2.3 Loop protection

The boundary counts failures in memory with timestamps. After 3 failures within 60 s the **Try again** button is not rendered; only **Back to home** remains.

### 2.4 Server-originated failures

- `room.ended {reason:'ERROR'}` and `SERVER_ERROR` map to the same screen with the room-ended wording ("This room has ended") and **Home** (US-056 copy).
- Unhandled promise rejections in the connection layer are caught and routed to the same boundary through a store flag.

## 3. Edge cases and errors

- Error inside the `ErrorScreen`: a minimal static fallback in `index.html` handling via a global error listener (external script) shows a plain "Reload" link (US-044).
- Errors during rejoin: counted by the same limiter.
- No state is persisted before or after the failure.

## 4. Verification

| Check | Level |
| --- | --- |
| Injected render error shows `ErrorScreen`, not a blank page; no stack trace in the DOM | C, E |
| Try again rejoins or goes Home | E |
| Third failure within 60 s hides Try again | C |
| Console logging only; no network request on error (network assertion) | E |
| Axe scan of the error screen | A |

## 5. Tasks

1. Build `ErrorBoundary` and `ErrorScreen`.
2. Implement failure counting and Try again logic.
3. Add a test-only error trigger (disabled in production builds).
4. Add tests.

## 6. Dependencies and risks

- Depends on US-050; uses US-043.
- Risk: the test trigger shipping to production. Mitigation: guarded by a build flag and checked in the production bundle test.
