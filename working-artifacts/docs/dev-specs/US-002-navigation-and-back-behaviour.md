# Dev spec — US-002 Navigation and back behaviour

| Item | Value |
| --- | --- |
| Story | [US-002](../user-stories/US-002-navigation-and-back-behaviour.md) · Must · Home and navigation |
| Status | Draft v0.1 (proposed) · [Baseline](README.md) |
| Refs | F-01, F-10, DAC-02 |
| Area | `apps/client` (router, history), static hosting |

## 1. Goal

Predictable routing: working Back buttons, share links that open the right screen, protection against leaving a game by accident, and a friendly not-found page.

## 2. Technical design

### 2.1 Routes and guards

| Route | Screen | Guard |
| --- | --- | --- |
| `/` | Home | none |
| `/create` | Identity step, then create | none |
| `/join` | Code entry | none |
| `/join/:code` | Identity step with the code prefilled | normalise code (US-006); if the device already holds a seat, offer **Rejoin** |
| `/room/:code` | Lobby or game | needs a stored session for `:code`; otherwise redirect to `/join/:code` |
| `/rules`, `/settings` | Static pages | none |
| `*` | NotFound with **Home** | none |

### 2.2 Back button

- On-screen **Back** uses `navigate(-1)` when `history.state.idx > 0`, else navigates to `/`.
- **In a game** (`room.phase = PLAYING`): on entering `/room/:code` push a sentinel history entry. A `popstate` handler re-pushes the sentinel and opens the **GameMenu** (US-028). In lobby and finished states, Back leaves normally (leaving the lobby does not leave the room; the Rejoin banner is offered on Home).
- A forced-choice dialog (Exploding Kitten decision) disables the Back-opens-menu behaviour (the menu is disabled then).

### 2.3 Hosting rule

The static host MUST serve `index.html` for every non-asset path (SPA fallback) so reloads on `/rules`, `/settings`, `/join/:code`, and `/room/:code` work.

### 2.4 Header

`AppShell` renders a consistent header: Menu or Back on the left, Help and the connection indicator on the right, in the same position on every screen (WCAG 3.2.3).

## 3. Edge cases and errors

- `/room/:code` opened on a device without a seat: redirect to Join (no room data requested).
- Code in the URL fails the format check: show Join with "That code has 6 letters and numbers".
- Reload on a deep link when the server is down: the page renders; connection banner shows.

## 4. Verification

| Check | Level |
| --- | --- |
| Back from Create, Join, Rules, Settings returns to the previous screen | C, E |
| Browser Back during a game opens the menu and does not leave | E |
| Reload on `/rules` and `/settings` renders | E |
| `/room/ABC234` without a seat redirects to `/join/ABC234` | C |
| Unknown URL shows NotFound with Home | C |
| Header controls in the same position across screens | E (bounding-box check) |

## 5. Tasks

1. Define the route table and guards.
2. Implement `AppShell` header.
3. Implement the sentinel-history Back handling for the game state.
4. Add NotFound page and the hosting fallback note to the delivery docs.
5. Add tests.

## 6. Dependencies and risks

- Depends on US-001; the menu content is US-028; sessions come from US-043.
- Risk: sentinel history logic is fiddly across browsers. Mitigation: isolate in one hook with E2E coverage on Chromium, Firefox, and WebKit.
