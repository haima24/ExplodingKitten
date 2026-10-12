# Dev spec — US-040 Invalid-action feedback

| Item | Value |
| --- | --- |
| Story | [US-040](../user-stories/release-1.0.1/US-040-invalid-action-feedback.md) · Must · Error handling, reliability, connection, and privacy |
| Status | Draft v0.1 (proposed) · [Baseline](README.md) |
| Refs | F-14, DAC-12, DAC-25, [UI/UX §E6](../../ui-ux.md#e6-invalid-actions-and-error-recovery) |
| Area | `apps/client` (`copy/errors.ts`, `InlineMessage`), engine reasons |

## 1. Goal

Friendly, specific messages for everything that can't be done, without changing game state and without blaming the player.

## 2. Technical design

### 2.1 Error → copy mapping (`copy/errors.ts`)

| Source code | Message |
| --- | --- |
| Catalog `notPlayableReason` Cat card / `NOT_PLAYABLE` | "Cat cards just like to cuddle. Pick another card!" |
| Catalog reason Defuse | "Defuse cards save you automatically when an Exploding Kitten shows up." |
| `NOT_YOUR_TURN` (stale tap) | "Oops, that was too late. It's {name}'s turn now." |
| Not my turn (pre-check) | "Wait for {name}." |
| Offline | "Reconnecting… try again in a moment." |
| `WRONG_PHASE`, `INVALID_TARGET`, `CARD_NOT_IN_HAND`, others | "That move didn't work. Try something else." |
| `NOT_ENOUGH_PLAYERS` | "You need at least 2 players." |
| `NOT_HOST` | "Only the host can do that." |
| Network timeout on an action | "That didn't work. Try again." |

Room errors for create and join have their own keys (US-003, US-006). Unknown codes fall back to the generic message and are logged to the console in development only.

### 2.2 Pre-checks (client, advisory only)

The client uses the catalog's `playable` flag and `selectCanAct` to disable Play and show the reason **before** any request. The server remains authoritative and always re-validates (a modified client gets the same error).

### 2.3 `InlineMessage` component

- Rendered next to the source control (under the Play button or the selected card), `role="status"` (polite), icon plus text, never red-only, never blames ("you did something wrong").
- Clears after 5 s or on the next interaction. Only one message at a time (a new one replaces the old).
- Does not move focus.

## 3. Edge cases and errors

- Error arrives after the user changed selection: the message is attached to the control, not the old card.
- State is never changed locally on error (the card stays in the hand).
- Messages are keyed, parameterised strings from the copy catalog (no string concatenation in components).

## 4. Verification

| Check | Level |
| --- | --- |
| Cat card and Defuse reasons shown without a request | C |
| Every engine and room error code has a mapping (exhaustiveness test) | U |
| Server rejection leaves state unchanged and shows the message | I, C |
| Message auto-clears in 5 s and on next interaction; announced politely | C |
| Not colour-only (icon plus text) | C |

## 5. Tasks

1. Build the mapping module with exhaustive typing over the code unions.
2. Build `InlineMessage`.
3. Wire pre-checks and server errors into the card flow.
4. Add tests.

## 6. Dependencies and risks

- Depends on US-011, US-051; used by US-006, US-043.
- Risk: new codes without copy. Mitigation: the exhaustiveness test fails the build.
