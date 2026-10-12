# Dev spec — US-019 Peek (look at the top 3 cards)

| Item | Value |
| --- | --- |
| Story | [US-019](../user-stories/US-019-peek-look-at-the-top-3-cards.md) · Must · Cards and rules |
| Status | Draft v0.1 (proposed) · [Baseline](README.md) |
| Refs | F-06, DAC-13, DAC-37 |
| Area | `packages/engine`, `apps/server` (private delivery), `apps/client` (`PeekOverlay`) |

## 1. Goal

The player secretly sees the top three cards of the draw pile; nobody else does. The cards exist on the player's device only while the overlay is open.

## 2. Technical design

### 2.1 Engine

`PLAY_CARD` with kind `PEEK`:

- Card → `discardPile`; public `CARD_PLAYED` and `PEEKED { playerId }`.
- Private `PEEK_RESULT { cards }` to the actor with the first `min(3, drawPile.length)` cards in pile order (index 0 = top).
- The draw pile is unchanged; the turn is **not** ended.

### 2.2 Server

`visibleEvents` delivers `PEEK_RESULT` only in the actor's `game.update`. The result is never stored in room state and is not resent on reconnect.

### 2.3 Client

- `PeekOverlay` (modal `<dialog>`): title "Your secret peek!", three cards left-to-right (top first), primary **Got it — hide**.
- Opened from the event; kept in `ui.peek` (memory only). **Got it** and reducer cleanup set `ui.peek = null`, so card data does not remain in the store or DOM.
- Draw and Play behind the overlay are inert (modal).
- Screen reader: reads "Top card: {name}. Second card: {name}. Third card: {name}." in order.
- Reconnecting while open: the overlay is gone (the data is not resent); the player can Peek again only by playing another Peek.

## 3. Edge cases and errors

- Fewer than 3 cards: show only what exists.
- Peek then Hop Over: legal.
- Another player never receives `PEEK_RESULT` (leak scan).
- Peek of a pile whose top is a Boom Cat: shown like any card (no extra effect).

## 4. Verification

| Check | Level |
| --- | --- |
| Result has `min(3, n)` cards in order; pile unchanged; turn not ended | U |
| Only the actor's payload contains `PEEK_RESULT`; others get `PEEKED` | I |
| Overlay content cleared after closing | C |
| Screen-reader order and focus handling | C, M |
| Other context shows only "{name} peeked" | E |

## 5. Tasks

1. Implement the Peek branch and the private event.
2. Build `PeekOverlay`, store handling, and copy.
3. Add leak-scan and component tests.

## 6. Dependencies and risks

- Depends on US-011, US-008, US-051.
- Risk: card data lingering in memory snapshots. Mitigation: cleared on close; not persisted.
