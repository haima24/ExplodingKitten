# Developer Specifications — "Whisker Boom" (working title)

| Item | Value |
| --- | --- |
| Status | Draft v0.1 — **proposed**, for engineering review |
| Last updated | 2026-10-12 |
| Scope | One developer spec per user story (65 specs) plus this shared baseline |
| Inputs | [User stories](../user-stories/README.md) · [UI/UX specification](../../ui-ux.md) · [Product brief](../../product-brief.md) |
| Repository baseline | **No application code exists.** Every module, path, message, and command below is a *proposal*. Nothing here describes existing code. |

## 1. How to use these specs

Each file `US-xxx-<slug>.md` in this folder is the **implementation contract** for the story with the same name in [../user-stories](../user-stories/README.md). It names the modules to change, the interfaces and rules to implement, the edge cases, the tests, and an ordered task list. The user story stays the source of truth for **acceptance criteria**; if a spec and a story disagree, fix the spec and raise it in review.

Specs contain interface sketches (types, message shapes, config) but **no application code**. Numbers marked *(proposed)* have no baseline.

Every spec uses this outline:

1. Goal · 2. Technical design (modules, interfaces and data, behaviour) · 3. Edge cases and errors · 4. Verification · 5. Tasks · 6. Dependencies and risks.

## 2. Shared technical baseline

All specs rely on the names below. They are a *proposal* (OQ-07, OQ-20) and must be confirmed in Stage 0.

### 2.1 Stack and repository layout

| Concern | Proposal |
| --- | --- |
| Language and runtime | TypeScript (strict) on the current Node.js LTS, client and server |
| Packages | pnpm workspaces: `packages/engine`, `packages/protocol`, `apps/server`, `apps/client`, `tests/e2e`, `tests/load` |
| Client | React, Vite, React Router, CSS Modules plus CSS variables |
| Server | Node.js, `ws` WebSocket library, a schema library (for example `zod`) for message validation |
| Tests | Vitest (unit, integration), React Testing Library (component), Playwright with Page Objects (E2E), `axe-core` (accessibility) |
| State | Server: in-memory, single instance. Client: reducer plus context. No database, no accounts. |

Dependency rules: `engine` imports nothing; `protocol` may import `engine` types and card data; `server` imports `engine` and `protocol`; `client` imports `protocol` and only the `engine/cards` and `engine/types` entry points (never `applyAction` or `createGame`).

### 2.2 Engine contract (`packages/engine`, spec in US-051)

- API: `createGame(config, players, rng)`, `applyAction(state, action, rng)`, `viewFor(state, playerId)`, `visibleEvents(events, playerId)`, `checkInvariants(state)`.
- `Rng` is injected (`nextInt(maxExclusive)`); the engine never calls `Math.random` or `Date`.
- Card kinds: `BOOM_CAT`, `TREAT`, `HOP_OVER`, `PEEK`, `SHAKE_UP`, `COZY_CAT`, `PASS_IT_ON`, `ASK_A_FRIEND`, `NOPE`.
- Actions (the client **never sends `playerId`**; the server injects it from the connection): `PLAY_CARD {cardId, targetId?}`, `DRAW`, `USE_TREAT`, `REINSERT_BOOM {position: TOP|MIDDLE|BOTTOM|RANDOM}`, `PICK_FAVOR_CARD {cardId}`, `NOPE`, `PASS_NOPE`, `PLAY_PAIR {cardIds: [id, id], targetId}` (US-065), `PICK_STEAL {position}` (US-066), plus server-issued `LEAVE`, `REMOVE`, `SKIP_ABSENT`, `EXPIRE_NOPE` (US-062), `TIMEOUT` (US-063).
- Phases: `turn`, `decision` (with `pending` = `TREAT_DECISION` | `REINSERT` | `FAVOR_PICK` | `STEAL_PICK` | `NOPE_WINDOW`), `finished`.
- Engine error codes: `GAME_FINISHED`, `NOT_IN_GAME`, `PLAYER_OUT`, `NOT_YOUR_TURN`, `WRONG_PHASE`, `CARD_NOT_IN_HAND`, `NOT_PLAYABLE`, `INVALID_TARGET`, `INVALID_POSITION`, `INVALID_CONFIG`.
- Events: public `CARD_PLAYED`, `CARD_DRAWN`, `PEEKED`, `DECK_SHUFFLED`, `TREAT_USED`, `BOOM_TUCKED`, `PLAYER_OUT`, `FAVOR_REQUESTED`, `FAVOR_GIVEN`, `TURN_STARTED`, `GAME_FINISHED`, `NOPE_PLAYED`, `EFFECT_APPLIED` (a played card takes effect), `NOPE_RESOLVED`, `TURN_TIMEOUT` (US-063), `STEAL_STARTED`, `CARD_STOLEN` (US-065, US-066); private `DRAWN_CARD`, `PEEK_RESULT`, `BOOM_DRAWN {hasTreat}`, `FAVOR_RECEIVED`, `STOLEN_CARD` (US-065).
- Invariants I1–I8 (US-051): boom count = active players − 1; draw pile never empty of Exploding Kittens while ≥ 2 players are active; card conservation; current player is active; `pendingTurns ≥ 1`; out players hold no cards; `phase = decision` iff `pending`; unique card ids.

### 2.3 Protocol contract (`packages/protocol`, spec in US-060)

- Transport: secure WebSocket at `/ws`, JSON text frames, envelope `{ v: 1, t: "<type>", id?: "<client msg id>", p: { … } }`.
- Client → server: `room.create`, `room.join`, `room.rejoin`, `room.leave`, `room.close`, `room.kick`, `room.start`, `room.rematch`, `room.keepAlive`, `room.addBot` *(Could)*, `room.settings` (host, lobby: turn timer, US-063), `game.action`, `game.hover` (the taker's finger position, US-066), `game.end`, `game.skipAbsent`, `ping`.
- Server → client: `hello`, `ack`, `error`, `room.joined`, `room.update`, `game.update`, `absent.update`, `game.hover` (relayed, US-066), `room.ended`, `pong`.
- `game.update` carries `{ version, view: PlayerView, events: GameEvent[] }`, already filtered for that player.
- Room error codes: `INVALID_MESSAGE`, `RATE_LIMITED`, `INVALID_CODE`, `ROOM_NOT_FOUND`, `ROOM_FULL`, `GAME_STARTED`, `ROOM_CLOSED`, `INVALID_NAME`, `INVALID_AVATAR`, `AVATAR_TAKEN`, `ALREADY_IN_ROOM`, `NOT_HOST`, `NOT_IN_ROOM`, `BAD_TOKEN`, `REMOVED`, `TOO_MANY_ROOMS`, `NOT_ENOUGH_PLAYERS`, `WRONG_ROOM_PHASE`, `SERVER_ERROR`. Engine codes are passed through on `game.action` failures.
- `room.ended` reasons: `HOST_CLOSED`, `EXPIRED`, `REMOVED`, `EMPTY`, `SERVER_RESTART`, `ERROR`, `REPLACED` (the same token connected from another device).
- Room phases: `LOBBY`, `PLAYING`, `FINISHED`, `CLOSED`.
- Room code: 6 characters from `23456789ABCDEFGHJKMNPQRSTVWXYZ` (30 symbols, no `0 O 1 I L U`); share link `https://<domain>/join/<code>`.

### 2.4 Server defaults (all *proposed*; read from config, see US-060)

| Setting | Default | Setting | Default |
| --- | --- | --- | --- |
| `ROOM_CAPACITY` / `MIN_PLAYERS` | 4 / 2 | `HEARTBEAT_MS` / `DEAD_AFTER_MS` | 15 000 / 35 000 |
| `RECONNECT_WINDOW_MS` | 60 000 | `HOST_AWAY_MS` | 60 000 |
| `IDLE_LOBBY_MS` / `IDLE_GAME_MS` | 1 800 000 | `FINISHED_TTL_MS` | 900 000 |
| `MAX_LIFETIME_MS` | 10 800 000 | `IDLE_WARN_MS` | 120 000 |
| `EMPTY_ROOM_GRACE_MS` | 60 000 | `CODE_QUARANTINE_MS` | 86 400 000 |
| `JOIN_FAIL_LIMIT` | 10 per 60 s | `MAX_ROOMS_PER_IP` / `MAX_ROOMS` | 5 / 500 |
| `MAX_MESSAGE_BYTES` | 4096 | `MSG_RATE` | 20/s, burst 40 |
| `ACTION_DEDUPE_WINDOW` | 64 ids per player | `ACK_TIMEOUT_MS` (client) | 5 000 |
| `NOPE_WINDOW_MS` | 8 000 | `TURN_TIMER_SEC` | 30 (0, 15, 30, 60; US-063) |

### 2.5 Client conventions (`apps/client`, spec in US-001, US-002, US-043)

- Routes: `/`, `/create`, `/join`, `/join/:code`, `/room/:code`, `/rules`, `/settings`, `*`.
- Store slices: `connection`, `session`, `room`, `game`, `ui`, `settings`. Server data is never edited locally; controls are inert until the server answers.
- Browser storage: `sessionStorage["wb.session"] = { code, token, playerId }`; `localStorage["wb.settings"] = { motion, sound, volume, voice, voiceVolume, language, textScale, tipsSeen }`. Nothing else.
- All user-visible strings live in a **copy catalog** (`copy/en.ts`, with `copy/vi.ts` for Vietnamese, US-064), keyed and parameterised, so wording can be reviewed and translated. A missing translation falls back to English; `pnpm check:copy` keeps the two in step. Card text is read through `copy/cards.ts`.
- A single `Announcer` owns the polite and assertive live regions.

### 2.6 Test levels used in the specs

| Code | Level | Tooling |
| --- | --- | --- |
| U | Unit (engine, protocol, pure client functions) | Vitest |
| I | Server integration (in-process server, real WebSocket clients, fake clock) | Vitest and `ws` |
| C | Component | React Testing Library |
| E | End-to-end, multi-context (host and players in separate browser contexts) | Playwright |
| A | Automated accessibility | `axe-core` in Playwright |
| P | Performance or load | Lighthouse CI, k6 |
| M | Manual (screen reader, device, content review) | Checklist |

## 3. Spec index

| Story | Dev spec | Main area |
| --- | --- | --- |
| US-001 | [Landing screen](US-001-landing-screen-with-clear-entry-points.md) | client |
| US-002 | [Navigation and back behaviour](US-002-navigation-and-back-behaviour.md) | client |
| US-003 | [Host creates a room](US-003-host-creates-a-room.md) | server, client |
| US-004 | [Choose a name and avatar](US-004-choose-a-name-and-avatar.md) | protocol, server, client |
| US-005 | [Start a game and deal cards](US-005-start-a-game-and-deal-cards.md) | server, engine |
| US-006 | [Player joins by link or code](US-006-player-joins-a-room-by-link-or-code.md) | server, client |
| US-007 | [Whose turn and player status](US-007-show-whose-turn-it-is-and-each-player-s-status.md) | client |
| US-008 | [Private hands on every device](US-008-private-hands-on-every-device.md) | engine, server |
| US-009 | [View my hand](US-009-view-my-hand.md) | client |
| US-010 | [Draw and discard piles](US-010-see-the-draw-pile-and-discard-pile.md) | client, engine |
| US-011 | [Select and play an action card](US-011-select-and-play-an-action-card.md) | client, server |
| US-012 | [Draw a card](US-012-draw-a-card-to-end-the-turn.md) | engine, client |
| US-013 | [Recent-action log](US-013-recent-action-message-log.md) | client |
| US-014 | [Build the deck](US-014-build-the-deck-by-player-count.md) | engine |
| US-015 | [Exploding Kitten with a Defuse](US-015-draw-a-boom-cat-and-use-a-treat.md) | engine, client |
| US-016 | [Tuck the Exploding Kitten back](US-016-tuck-the-boom-cat-back-into-the-deck.md) | engine, client |
| US-017 | [Exploding Kitten without a Defuse](US-017-draw-a-boom-cat-without-a-treat-player-is-out.md) | engine, client |
| US-018 | [Skip](US-018-hop-over-skip-card.md) | engine |
| US-019 | [See the Future](US-019-peek-look-at-the-top-3-cards.md) | engine, client |
| US-020 | [Shuffle](US-020-shake-up-shuffle-card.md) | engine |
| US-021 | [Attack](US-021-pass-it-on-extra-turn-attack-card.md) | engine |
| US-022 | [Favor](US-022-ask-a-friend-favour-card.md) | engine, client |
| US-062 | [Nope card](US-062-nope-card.md) | engine, server, client |
| US-063 | [Turn timer and card sound effects](US-063-turn-timer-and-card-sounds.md) *(Release 1.0.2)* | engine, protocol, server, client |
| US-064 | [Vietnamese localization (text and voice)](US-064-vietnamese-localization.md) *(Release 1.0.2)* | client |
| US-065 | [Cat card pairs](US-065-cat-card-pairs.md) *(Release 1.0.2)* | engine, protocol, server, client |
| US-066 | [Pick a card from a fanned-out hand](US-066-pick-a-card-from-a-fanned-hand.md) *(Release 1.0.2)* | engine, protocol, server, client |
| US-067 | [Vietnamese player names](US-067-vietnamese-player-names.md) *(Release 1.0.2)* | client, protocol (one optional field) |
| US-023 | [Bot Buddies](US-023-bot-buddies-fill-empty-seats.md) | server |
| US-025 | [Victory screen](US-025-victory-screen.md) | client, server |
| US-026 | [Host starts a rematch](US-026-host-starts-a-rematch.md) | server, client |
| US-027 | [Leave the room or close it](US-027-leave-the-room-or-close-it.md) | server, client |
| US-028 | [Game menu, leave, end game](US-028-game-menu-leave-game-and-end-game-with-confirmation.md) | client, server |
| US-029 | [How to Play tour](US-029-how-to-play-tour.md) | client |
| US-030 | [Card guide and per-card help](US-030-card-guide-and-per-card-help.md) | client, engine data |
| US-031 | ["What now" hints](US-031-contextual-what-now-hints.md) | client |
| US-032 | [Guided first game](US-032-guided-first-game-coach-marks.md) | client |
| US-033 | [Responsive layouts](US-033-responsive-layouts-across-device-classes.md) | client |
| US-034 | [Large targets and input parity](US-034-touch-mouse-and-keyboard-parity-with-large-targets.md) | client |
| US-035 | [Keyboard and focus](US-035-keyboard-operation-and-visible-focus.md) | client |
| US-036 | [Screen-reader support](US-036-screen-reader-support.md) | client |
| US-037 | [Colour independence and contrast](US-037-colour-independence-and-contrast.md) | client |
| US-038 | [Settings: motion and sound](US-038-settings-reduced-motion-and-sound.md) | client |
| US-039 | [Text size](US-039-text-size-setting.md) | client |
| US-040 | [Invalid-action feedback](US-040-invalid-action-feedback.md) | client |
| US-041 | [Unexpected-error recovery](US-041-unexpected-error-recovery.md) | client |
| US-042 | [Privacy by default](US-042-privacy-by-default.md) | all |
| US-043 | [Reconnect and rejoin](US-043-reconnect-and-rejoin-my-seat.md) | client, server |
| US-044 | [Loading and asset failure](US-044-loading-and-asset-failure-handling.md) | client |
| US-045 | [Unsupported browser notice](US-045-unsupported-browser-notice.md) | client |
| US-046 | [Engine and server tests](US-046-engine-unit-and-simulation-tests.md) | tests |
| US-047 | [Multi-device E2E tests](US-047-multi-device-end-to-end-tests-host-and-players.md) | tests |
| US-048 | [Automated accessibility checks](US-048-automated-accessibility-checks.md) | tests |
| US-049 | [Performance budget](US-049-performance-budget-check.md) | tests, CI |
| US-050 | [Project scaffold](US-050-project-scaffold-and-design-tokens.md) | foundation |
| US-051 | [Game engine module](US-051-pure-game-engine-module.md) | foundation |
| US-052 | [Sound effects](US-052-sound-effects-muted-by-default.md) | client |
| US-053 | [QR code for joining](US-053-qr-code-for-joining-a-room.md) | client |
| US-054 | [Share code and link](US-054-share-the-room-code-and-link.md) | client |
| US-055 | [Lobby with host controls](US-055-lobby-with-host-controls.md) | server, client |
| US-056 | [Room lifetime and deletion](US-056-room-lifetime-and-data-deletion.md) | server |
| US-058 | [Absent player](US-058-absent-player-during-the-game.md) | server, client |
| US-059 | [Host leaves or disconnects](US-059-host-leaves-or-disconnects.md) | server, client |
| US-060 | [Real-time room server](US-060-real-time-room-server-authoritative.md) | server, protocol |
| US-061 | [Room-code security and abuse protection](US-061-room-code-security-and-abuse-protection.md) | server |

US-024 and US-057 are unused IDs.

## 4. Suggested build order

Foundation first, then the playable core, then hardening (see [brief §J](../../product-brief.md#j-delivery-roadmap)):

1. **Stage 0:** US-050 → US-051 → US-060 (+ US-014 deck, US-046 started).
2. **Stage 1:** US-003, US-004, US-006, US-054, US-055 → US-005 → US-007 – US-012, US-015 – US-020 → US-025 – US-027, US-001, US-002.
3. **Stage 2:** US-028 – US-031, US-033 – US-043, US-056, US-058, US-059, US-061, US-040 – US-042, US-047.
4. **Stage 3 (Should):** US-013, US-021, US-022, US-062, US-032, US-039, US-044, US-048, US-049.
5. **Could:** US-023, US-045, US-052, US-053.
6. **Release 1.0.2:** US-063 (timer, then sounds), then US-064 (text, then voice), then US-065 (deck and names, then pairs), US-066 (pick step, then the fan), US-067 (names).
