# Dev spec — US-011 Select and play an action card

| Item | Value |
| --- | --- |
| Story | [US-011](../user-stories/US-011-select-and-play-an-action-card.md) · Must · Gameplay |
| Status | Draft v0.1 (proposed) · [Baseline](README.md) |
| Refs | F-04, F-06, DAC-07, [UI/UX §D5](../../ui-ux.md#d5-card-selection-and-card-action-interactions--m-us-011-us-018-us-019-us-020-us-040) |
| Area | `apps/client` (`features/game`), `apps/server` (`game.action`) |

## 1. Goal

A two-step pattern: tap a card to read it, then press **Play** to commit. The server confirms every play; the UI never assumes success.

## 2. Technical design

### 2.1 Client state (`ui` slice)

`selectedCardId | null`, `pendingActionId | null`, `pendingSince`, `inlineMessage`.

### 2.2 Flow

1. **Select:** tap, click, or Enter/Space on a card sets `selectedCardId` (no server call, no game state change). Selecting the same card again, Escape, or a tap outside clears it.
2. **Detail panel** (`CardDetailPanel`): name, art, effect text from the catalog, and whether it is playable (catalog `playable` plus `notPlayableReason`).
3. **Play button:** label `Play "{card}"`. Disabled with the reason when no card is selected ("Pick a card to play, or draw."), the card is unplayable, or `selectCanAct` is false ("Wait for {name}").
4. **Send:** `game.action { actionId: uuid, action: { type: 'PLAY_CARD', cardId, targetId? } }` (no player id). Set `pendingActionId`; controls become inert; show a spinner if no reply after 1 s; fail after `ACK_TIMEOUT_MS` (5 s) with "That didn't work. Try again." and re-enable.
5. **Confirm:** on `ack` and the following `game.update`, clear `pendingActionId` and `selectedCardId`; the card appears in the discard pile on every device; effect handling continues per card spec (US-018 – US-022).
6. **Reject:** on `error`, clear pending, keep the card in hand, show the mapped message (US-040). Stale-turn text: "Oops, that was too late. It's {name}'s turn now."
7. **After a play** the player can select another card or draw (the engine allows multiple plays per turn).

### 2.3 Double-press protection

Client: no second send while `pendingActionId` is set. Server: action id dedupe (US-060). Either layer alone prevents a double play.

### 2.4 Targeted cards

`PLAY_CARD` for Favor opens `TargetPicker` first (US-022) and then sends `targetId`.

## 3. Edge cases and errors

- Not my turn: selection still works for reading; Play disabled.
- Connection drops after sending: the pending action is resolved by the next snapshot (the engine state is the truth); the client then clears pending.
- Selected card disappears from the hand (state changed): clear selection.
- Drag-and-drop is not provided (UQ-02).

## 4. Verification

| Check | Level |
| --- | --- |
| Select does not call the server; Play does | C |
| Play button label and disabled reasons | C |
| Double click sends one action; server dedupes a repeat id | C, I |
| Server rejection leaves the card in the hand and shows the message | I, C |
| Multiple plays in one turn allowed | U (engine) |
| Two contexts: discard pile updates in both | E |

## 5. Tasks

1. Add `ui` slice reducers and `useCardSelection` hook.
2. Build `CardDetailPanel`, `ActionBar`, and the pending/timeout logic.
3. Add the `game.action` sender with action ids in the connection layer (US-043).
4. Wire error mapping (US-040).
5. Add tests.

## 6. Dependencies and risks

- Depends on US-007, US-009, US-051, US-060.
- Risk: perceived lag. Mitigation: spinner only after 1 s; target p95 ≤ 300 ms.
