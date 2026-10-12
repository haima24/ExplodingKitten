# Dev spec — US-008 Private hands on every device

| Item | Value |
| --- | --- |
| Story | [US-008](../user-stories/release-1.0.1/US-008-private-hands-on-every-device.md) · Must · Gameplay |
| Status | Draft v0.1 (proposed) · [Baseline](README.md) |
| Refs | F-04, FR-06, DAC-06, DAC-37 |
| Area | `packages/engine` (`viewFor`, `visibleEvents`), `apps/server` (broadcast), `apps/client` (menu) |

## 1. Goal

Nobody can learn another player's cards. Hidden information never leaves the server, so no client can leak it. Replaces the v0.1 handoff screen.

## 2. Technical design

### 2.1 Projection rules

| Data | Sent to the owner | Sent to others |
| --- | --- | --- |
| Hand | Full cards | `handCount` only |
| Draw pile | `drawCount` | `drawCount` |
| Discard pile | Full (public) | Full (public) |
| Exploding Kitten decision and re-insert position | `decision` flag and private events | Public events without positions |
| See the Future result | `PEEK_RESULT` private event | `PEEKED` public event |
| Drawn card | `DRAWN_CARD` private event | `CARD_DRAWN` without the card |
| Eliminated player's cards | — | Discarded face-up (proposed) and visible in the discard pile |

### 2.2 Enforcement points

1. **Engine:** `viewFor(state, playerId)` and `visibleEvents(events, playerId)` are the only sources of outbound data (US-051).
2. **Server:** `gameService.broadcastGame` builds each payload per member; there is no code path that serialises raw `GameState` to a socket.
3. **Leak guard:** in test and non-production builds every outbound payload is scanned; the card ids owned by other players or in the draw pile must not appear.
4. **Reconnect:** a rejoining device receives only its own snapshot (US-043).
5. **Client:** while the game menu is open the player's own hand is not rendered (`inert` plus not in the DOM) so a shoulder-surfer or screen share cannot see it (US-028). No other player's hand exists in the page, so nothing needs hiding.

### 2.3 Leak scanner (test utility, shared with US-046)

`collectCardIds(state)` returns per-player ids and draw-pile ids. `assertNoLeak(payload, recipientId, state)` fails if the serialised payload contains a foreign id. Card ids are opaque and random (US-014) so a match is never a coincidence.

## 3. Edge cases and errors

- A modified client requests another hand: no such message exists; unknown types return `INVALID_MESSAGE`.
- Out player: view has an empty hand and no actions; still receives public state.
- Spectator-like cases (out players): never receive hidden data of active players.
- Screen reader: no foreign cards in the accessibility tree because they are never in the page.

## 4. Verification

| Check | Level |
| --- | --- |
| `viewFor` contains no foreign ids across 10,000 simulated games | U |
| Every outbound message scanned during simulated multi-client games | I |
| See the Future, Defuse, re-insert, and favour events reach only the right recipients | I |
| Rejoin returns only own hand | I |
| Menu open hides own hand from DOM and accessibility tree | C |
| Looking at the page DOM in another context shows no foreign cards | E |

## 5. Tasks

1. Implement and test `viewFor` and `visibleEvents` (with US-051).
2. Implement per-recipient broadcast and the leak guard (with US-060).
3. Build the leak scanner utility.
4. Implement the menu-hides-hand behaviour in the client.
5. Add tests.

## 6. Dependencies and risks

- Depends on US-007, US-051, US-060.
- Risk: a future event carrying a card by mistake. Mitigation: the leak guard and scan tests run on every build.
