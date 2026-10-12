# Dev spec — US-069 Bomb explosion and winner trophy animations

| Item | Value |
| --- | --- |
| Story | [US-069](../user-stories/release-1.0.2/US-069-explosion-and-winner-animations.md) · Should · Gameplay UI; Victory |
| Release | 1.0.2 |
| Status | Draft v0.1 (implemented) · [Baseline](README.md) |
| Refs | US-017, US-025, US-038, US-063, US-064, US-067, US-068 |
| Area | `packages/protocol`, `apps/server`, `apps/client` (no engine change) |

## 1. Goal

When an Exploding Kitten eliminates a player, every device plays a short animation of that player's name with a bomb that explodes; when the game ends with a winner, every device plays the winner receiving a trophy with their name, then shows the victory screen. The game waits for the explosion: the next turn, its clock and bot moves start after it.

## 2. Decisions

| # | Decision |
| --- | --- |
| D1 | Tone: a real, dramatic explosion is fine (the gentle-wording rule no longer limits the animation). Default: no gore |
| D2 | The out player still gets the **OK** dialog, after the animation |
| D3 | **The turn clock waits** for the animation; the server holds the game |
| D4 | Durations: explosion 3 s (fuse about 1.1 s, then the blast), trophy 4 s; both skippable on the viewer's own device |

## 3. Technical design

### 3.1 Protocol and server (the hold)

- `ANIMATION_MS = { explosion: 3000, trophy: 4000 }` in `packages/protocol/src/types.ts`, shared by the server and the client.
- `Room.holdUntil: number | null`. After each accepted action, if its events contain a `PLAYER_OUT` with reason `BOOM`, `holdForAnimation` sets `holdUntil = max(holdUntil, now) + ANIMATION_MS.explosion` **before** the turn clock is synced.
- While `now < holdUntil` the server rejects `game.action` with the new room error `PLEASE_WAIT` (no state change); the client maps it to "One moment, the animation is still playing."
- `syncTurnClock` adds the remaining hold to any deadline it arms or resumes, so the next player gets the full time **after** the animation. Verified: with a 15 s timer the next player's clock showed 17.8 s right after the explosion.
- `scheduleBot` adds the remaining hold to the bot's due time, so a Bot Buddy never moves during the animation.
- `holdUntil` is cleared on start and on return to the lobby. The trophy needs no hold (the game is over).
- Engine events are unchanged: the client builds both animations from `PLAYER_OUT` (reason `BOOM`) and `GAME_FINISHED`.

### 3.2 Client

- **Queue** (`ui.anim`, `AnimItem { id, kind: 'explosion' | 'trophy', playerId }`): `processGameUpdate` returns `anims` (one explosion per `PLAYER_OUT`/`BOOM`, then a trophy for `GAME_FINISHED` with a winner). `GameClient.onGameUpdate` queues them unless the tab is hidden. Animations played one at a time, in order; the explosion that ends the game plays before the trophy.
- **No replay:** reload, reconnect and a hidden tab never queue anything (snapshots carry no events), so the board or the victory screen shows the true state.
- **Client-side hold:** `GameClient.hold(ms)` sets `ui.holdUntil` (explosion length + 250 ms); `selectCanAct` is false until then and the action bar says "One moment…". This matches the server hold, even for a player who skips the animation.
- **`AnimationLayer`** (rendered by `RoomPage` so it covers the board and the victory screen): a full-screen overlay with `data-testid` `anim-explosion` or `anim-trophy` and `data-phase`.
  - *Explosion:* a card with the avatar, the name and a bomb whose fuse spark flickers; at 1.1 s the bomb is replaced by the blast with one white flash, a short shake and a darker backdrop; at 3 s it closes.
  - *Trophy:* a trophy rising into view with a plate showing the winner's name, the winner's avatar, a confetti shower and the line "[Name] wins the round!" ("You won!" on the winner's own device); at 4 s it closes and `RoomPage` shows the victory screen (it renders the board while the queue is not empty).
  - *Skip:* tap, click, Enter or Escape (capture phase, so the game menu does not open); a "Tap to skip" hint appears after 1 s.
  - *Reduced motion:* `data-still` removes the pop, pulse, shake, flash, rise and confetti; the same pictures show still, for the same time.
  - Names use `displayName` (the viewer's language, US-067) and wrap.
- **Nap message:** `result.nap` (the out player's own private event) sets `ui.napPending`; when the explosion queue empties, `AnimationLayer` opens the existing nap dialog. With a hidden tab it opens at once.
- **Screen readers:** the overlay is `aria-hidden`; one polite announcement per animation ("[Name] blew up!" / "[Name] wins the round!"); the existing log lines are unchanged. The announcer now queues polite messages (see US-070) so none is lost.
- **Sound:** the explosion plays the new `fuse` sizzle, then `boom` (a sequence of about 1.1 s plus the blast). The drawer's earlier private `boom` is played only when they hold a Defuse (tension before the save), not when they blow up. The trophy plays the existing `win` fanfare.
- **Art** (`art/AnimArt.tsx`): `BombArt`, `BlastArt`, `TrophyArt`, original inline SVG, decorative.
- **Copy** (both languages): `anim.exploded`, `anim.skip`, `anim.wait`, `anim.youWon`, `error.wait`.

## 4. Edge cases and errors

| Case | Behaviour |
| --- | --- |
| Leave, removal or skip of a player | No explosion (only an Exploding Kitten) |
| Defuse saves a player | No animation |
| Two players out in quick succession | Animations queue; the server hold adds 3 s each |
| The explosion ends the game | Explosion, then trophy, then the victory screen |
| The host ends the game (`resetToLobby`) | No winner, no trophy |
| Skip on one device | Only that device's picture ends; the hold still applies to everyone |
| Action sent during the hold | Rejected with `PLEASE_WAIT`; the clock and bots were already shifted |
| Reload during an animation | No replay; the board shows the current state |
| Hidden tab | Nothing plays or queues |
| Long names | Wrap; the card is at most 92 % of the screen width |

## 5. Verification

| Check | Level |
| --- | --- |
| Three browsers (one in Vietnamese): the explosion shows for all three with the name in each viewer's language; fuse phase then blast phase; lasts about 3 s (2.9 s measured) | E (done) |
| The next player's controls are inert during the animation and free after it; the out player's nap dialog follows it | E (done) |
| The game goes on with two players; the last explosion plays before the trophy; the trophy shows for the remaining players with the winner's name; lasts about 4 s (4.0 s measured); the victory screen follows | E (done) |
| Server hold: an action 0.2 s after the explosion gets `PLEASE_WAIT`; the same action after 3.3 s is accepted | I (done, raw WebSocket test) |
| Turn clock after the explosion: 17.8 s with a 15 s timer | I (done) |
| Bot game completes without errors | E (done) |
| Skip by tap, click and Enter or Escape; reduced motion shows still pictures; no more than one flash per animation | E (partly), A, M |
| Screen reader announces each animation once | A, M |
| Look and feel of the explosion and the trophy on real phones | M (UX review) |

## 6. Tasks (all done unless noted)

1. Shared durations, `PLEASE_WAIT`, server hold for the clock, bots and actions.
2. Animation queue, layer, art, skip, reduced motion, nap message, victory screen after the trophy.
3. Sounds (fuse, boom), voice and announcements, copy.
4. Open: unit and integration tests (deferred), real-device review, confirm the no-gore default.

## 7. Dependencies and risks

- Depends on US-017, US-025, US-038, US-063, US-064, US-067, US-068.
- Risk: client and server clocks differ slightly, so a fast player could try an action just before the hold ends. Mitigation: the client hold is 250 ms longer than the server's; the server answers `PLEASE_WAIT` with a friendly message.
- Risk: the animation delays play at every explosion (3 s). Mitigation: skippable picture, short length; the hold is not skippable by design (the story requires the game to wait).
- Risk: five explosions in a long game feel repetitive. Mitigation: at most four per game.
