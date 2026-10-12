# Dev spec — US-005 Start a game and deal cards

| Item | Value |
| --- | --- |
| Story | [US-005](../user-stories/US-005-start-a-game-and-deal-cards.md) · Must · Rooms and lobby |
| Status | Draft v0.1 (proposed) · [Baseline](README.md) |
| Refs | F-03, FR-04, DAC-04 |
| Area | `apps/server` (room, gameService), `packages/engine` (createGame), `apps/client` (Start button) |

## 1. Goal

Only the host can start. The server locks the room, builds and deals the deck for the players present, and every device receives its own hand.

## 2. Technical design

### 2.1 Message

- Request: `room.start {}` (host only).
- Result: `ack`, then `room.update` (phase `PLAYING`) and `game.update` per player. A public `TURN_STARTED` event announces the first player; the client shows "Everyone has cards! [Name] goes first".
- Errors: `NOT_HOST`, `WRONG_ROOM_PHASE`, `NOT_ENOUGH_PLAYERS`, engine `INVALID_CONFIG`.

### 2.2 Server algorithm (inside the room queue)

1. Verify sender is host and `room.phase = LOBBY` (a second Start returns `WRONG_ROOM_PHASE`; the client treats it as success).
2. Count members. `< MIN_PLAYERS` → `NOT_ENOUGH_PLAYERS`. `> ROOM_CAPACITY` cannot occur (join limit).
3. Set `room.phase = PLAYING` **first** so concurrent joins get `GAME_STARTED`.
4. Build `PlayerSeed[]` from members in join order (`seat` = index). Members who are bots are included (Could, US-023).
5. Config: `deckProfile` from server config (default `mvp`); `firstPlayerId`: unset for the first game (engine picks with `rng`), or the next seat after the previous first player on a rematch (US-026).
6. `createGame(config, seeds, rng)`; on `INVALID_CONFIG` roll back `phase = LOBBY`, reply `SERVER_ERROR`, log; the client shows the error screen (US-041).
7. Store `room.game`, reset activity timers, `broadcastRoom`, `broadcastGame` with the initial events.

### 2.3 Client

- `StartButton` in the lobby footer: visible and enabled for the host when members ≥ 2; disabled with "You need at least 2 players" when alone; not rendered for players.
- On `game.update` arrival the route content switches from lobby to board.

## 3. Edge cases and errors

| Case | Behaviour |
| --- | --- |
| Double press | One game; the second request gets `WRONG_ROOM_PHASE` |
| Join racing with Start | Either seated before the lock or told "This game has already started" |
| Non-host client sends `room.start` | `NOT_HOST`, no change |
| A disconnected member is listed | Included in the deal; handled by absent-player rules (US-058) |
| Deck cannot cover the deal | Engine error, rollback, friendly error |

## 4. Verification

| Check | Level |
| --- | --- |
| 2, 3, 4 players: each hand = 1 Treat + 4 others, no Boom Cat | U (engine), I |
| Draw pile has Boom Cats = players − 1 and 2 extra Treats | U |
| Double Start creates one game | I |
| Join during Start: never half-seated | I |
| Player cannot start | I |
| Every device receives only its own hand | I (leak scan) |
| Host starts with two browser contexts | E |

## 5. Tasks

1. Add `room.start` handler with the phase lock and validation.
2. Map members to engine seeds; wire `deckProfile` and first-player rules.
3. Broadcast initial state with `TURN_STARTED`.
4. Build the Start button and the "goes first" message.
5. Add tests.

## 6. Dependencies and risks

- Depends on US-055 (lobby), US-014, US-051, US-060.
- Risk: starting with a disconnected seat. Mitigation: US-058 handles it; the lobby shows connection status so the host can wait.
