# Dev spec — US-047 Multi-device end-to-end tests (host and players)

| Item | Value |
| --- | --- |
| Story | [US-047](../user-stories/US-047-multi-device-end-to-end-tests-host-and-players.md) · Must · Testing and quality |
| Status | Draft v0.1 (proposed) · [Baseline](README.md) |
| Refs | F-16, metrics M4, M11, M12; `instructions/testing/copilot-instructions.md` |
| Area | `tests/e2e`, server test mode |

## 1. Goal

Automated browser tests in which a host and players each use their own browser context, covering rooms, real-time play, reconnection, and viewports.

## 2. Technical design

### 2.1 Structure (per repository testing conventions)

```text
tests/e2e/
  pageobjects/   HomePage, CreateRoomPage, JoinPage, LobbyPage, BoardPage, VictoryPage, GameMenu, ...
  fixtures/      multiPlayerFixture (creates N contexts and the page objects)
  tests/         journey.spec.ts, errors.spec.ts, reconnect.spec.ts, a11y.spec.ts, keyboard.spec.ts
  helpers/       targets.ts, overflow.ts, leak.ts
playwright.config.ts
```

Rules from the repo's testing instructions: Page Object Model; fixtures create page objects; **tests call page-object methods only** (no raw `page.*` in specs); tests are independent and order-free; selectors are roles and labels, not CSS or XPath.

### 2.2 Fixtures

`multiPlayerFixture({ players: 3, viewports })` launches one browser, creates one **context per person** (separate storage, so separate sessions), applies per-context viewports (host `1280×800`; players `390×844` and `768×1024`; landscape variant `844×390`), and exposes `host`, `player1`, `player2` page objects.

### 2.3 Test mode (server)

`TEST_MODE=1` (refused in production, US-060): `room.create` accepts `testSeed` for a deterministic shuffle; timers are shortened by env (reconnect window 5 s, absent wait 5 s); `POST /test/clock/advance` jumps the server clock. The client gets no special code paths.

### 2.4 Scenarios

| Spec | Covers |
| --- | --- |
| `journey` | Host creates room, copies link, players open link and join, host starts, scripted game covering Peek, Hop Over, Shake Up, Boom Cat defused, Boom Cat elimination, menu, Leave game, win, rematch |
| `errors` | Wrong code, full room, started game, closed room, rate limit message |
| `reconnect` | Context goes offline 20 s and returns with the same hand; 70 s on that player's turn shows the host's **Skip** (use test timers); host transfer |
| `keyboard` | One player completes the journey keyboard-only (US-035) |
| `viewports` | Core journey on each viewport class with overflow and target audits (US-033, US-034) |
| `privacy` | No third-party requests, no cookies; leak check of visible DOM (no foreign cards) |

### 2.5 Artifacts and CI

On failure save screenshots, video, and trace for **every** context. Run on Chromium, Firefox, and WebKit nightly and Chromium on every pull request. Retries disabled for deterministic scripted tests (a retry would hide flakiness).

## 3. Edge cases and errors

- Waiting: tests wait on UI state (banners, roles), never fixed sleeps.
- Deterministic game: seeded deck plus a scripted action list so each scenario's cards are known; helper `playUntil(condition)` for variable parts.
- Parallelism: each test uses its own server room (unique code); the server instance is shared.

## 4. Verification (of the suite)

| Check | Level |
| --- | --- |
| Suite is green three times in a row in CI | CI |
| A deliberately broken hidden-info rule makes the privacy test fail | CI (sampled) |
| Report lists screenshots and traces for all contexts on failure | CI |

## 5. Tasks

1. Create config, fixtures, and page objects as screens land.
2. Add the server test-mode hooks.
3. Write the scenarios in the table.
4. Add helpers for overflow, targets, and the leak check.

## 6. Dependencies and risks

- Depends on US-033, US-025, US-043, US-058, US-060; uses US-034, US-035.
- Risk: slow multi-context tests. Mitigation: three contexts only; scripted, seeded games; headless in CI.
