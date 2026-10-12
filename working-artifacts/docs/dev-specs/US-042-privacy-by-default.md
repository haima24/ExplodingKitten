# Dev spec — US-042 Privacy by default

| Item | Value |
| --- | --- |
| Story | [US-042](../user-stories/US-042-privacy-by-default.md) · Must · Error handling, reliability, connection, and privacy |
| Status | Draft v0.1 (proposed) · [Baseline](README.md) |
| Refs | F-15, DAC-27, OQ-10 |
| Area | Client, server, static hosting configuration |

## 1. Goal

Collect the minimum, keep it only in memory for the life of the room, and make that verifiable. Legal review of child-privacy requirements is a launch gate (OQ-10) and may change this spec.

## 2. Technical design

### 2.1 Data inventory

| Data | Where | Retention | Notes |
| --- | --- | --- | --- |
| Name parts, avatar id | Server memory (room) | Until room closes or expires (max 3 h) | Curated lists only (US-004) |
| Room code | Server memory, URL | Same; tombstone 24 h (code only) | Not personal |
| Game state | Server memory | Until game or room end | No persistence |
| Rejoin token | Client `sessionStorage`; server stores a hash | Until leave, removal, end, or tab session | Never in URLs or logs |
| Settings | Client `localStorage` | Until cleared by the user | Never sent to the server |
| IP address | Hosting and proxy logs only | ≤ 7 days (proposed) | Not stored by the application, not joined with names |

No cookies, no analytics, no third-party scripts, fonts, images, or iframes.

### 2.2 Controls

| Control | Spec |
| --- | --- |
| Requests | `connect-src 'self'` plus the server's `wss://` origin only |
| CSP | `default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'self' wss://<server-origin>; object-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'none'` |
| Other headers | `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: no-referrer` (the share link path contains the room code), `Permissions-Policy` denying camera, microphone, geolocation, `Cross-Origin-Opener-Policy: same-origin` |
| Indexing | `noindex` for `/join/*` and `/room/*` (meta robots and `robots.txt`) |
| Permissions | The app never calls camera, microphone, geolocation, or notification APIs |
| Logging | Structured logs with no names, no game content; room codes only as a truncated hash; connection ids random |
| Transport | HTTPS and WSS only; HTTP redirects to HTTPS |
| Page | **Privacy** page in plain language listing exactly what is kept and for how long (content matches 2.1) |
| Dependencies | Lockfile committed; CI step fails on denylisted packages (analytics, ads, tracking SDKs) and on high-severity advisories |

### 2.3 Boundaries between players

Other players see only the curated name and avatar. The server never sends IP addresses, connection ids, tokens, or device details in any `RoomView` or event (schema test, US-055).

## 3. Edge cases and errors

- Third-party fonts or icons accidentally added: network test fails.
- A new log field containing a name: log-schema test fails (allow-list of fields).
- CSP violations: reported to the console only in development; no report endpoint.

## 4. Verification

| Check | Level |
| --- | --- |
| First load: zero third-party requests, zero cookies | E (network and cookie assertions) |
| No permission prompts; no forbidden API calls (stubbed API spies) | E |
| Only allowed fields sent on create and join (inspect WebSocket frames) | E, I |
| Room data absent from memory dump after close (object graph test) | I |
| Headers present on the static host and the server | I, P (deploy check) |
| Log output contains no names (log-schema test) | I |
| Denylist and audit step | CI |
| Privacy page content review | M |

## 5. Tasks

1. Define header and CSP configuration for the static host and the server.
2. Add log allow-list and tests; add the network and cookie E2E assertions.
3. Build the Privacy page.
4. Add the dependency denylist and audit step.
5. Prepare the legal review pack (data inventory, flows).

## 6. Dependencies and risks

- Depends on US-050, US-056, US-060.
- Risk: legal requirements add consent or notices. Mitigation: early review (a launch gate) and an isolated Privacy page and header config.
