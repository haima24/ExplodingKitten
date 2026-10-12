# Dev spec — US-004 Choose a name and avatar

| Item | Value |
| --- | --- |
| Story | [US-004](../user-stories/US-004-choose-a-name-and-avatar.md) · Must · Rooms and lobby |
| Status | Draft v0.1 (proposed) · [Baseline](README.md) |
| Refs | F-02, F-15, DAC-03, OQ-14 |
| Area | `packages/protocol` (lists, validation), `apps/server`, `apps/client` |

## 1. Goal

A curated name builder and an avatar picker, used by the host (before create) and by players (before join). **No free text.** The server validates every value against the same lists.

## 2. Technical design

### 2.1 Shared data (`packages/protocol/src/identity.ts`)

- `ADJECTIVES[]`, `NOUNS[]`: curated word lists (≥ 24 each, product-owned, child-safety reviewed; placeholders until OQ-14 content review).
- `AVATARS[]`: ids `biscuit`, `pip`, `marmalade`, `mochi`, `juniper`, `waffles` (placeholders; text names in the copy catalog, for example "Biscuit the tabby").
- `type DisplayName = { adjective: string; noun: string; suffix?: number }`.
- `validateIdentity({ name, avatarId })` returns `INVALID_NAME` or `INVALID_AVATAR`.
- `formatName(name)` returns `"Sleepy Biscuit"` or `"Sleepy Biscuit 2"` when `suffix` is set.

### 2.2 Server

- Reject any value not found in the lists (exact match, no trimming tricks).
- **Unique names:** if the display name already exists in the room, set `suffix = 2, 3, …` (smallest free).
- **Unique avatars:** if the avatar is used by a member, reject with `AVATAR_TAKEN` and include `data: { taken: AvatarId[] }` so the client can disable them. (This reveals taken avatars only to someone who attempted a join; it is the accepted trade-off for the "taken" UI, see US-006 notes.)

### 2.3 Client (`features/rooms/IdentityStep`)

- `NameBuilder`: two radio groups of large buttons (adjectives, nouns) with a live preview and **Shuffle names** (client random is fine here).
- A random valid name is preselected so **Continue** is always enabled.
- `AvatarPicker`: radio group; options listed in `taken` are disabled and show the text "taken".
- Hint text: `identity.noRealNames` ("Don't use real names").
- Names are always rendered as plain text (no `dangerouslySetInnerHTML`).

## 3. Edge cases and errors

- Tampered request with unknown word or avatar: rejected by the server.
- Two players choosing the same name at once: the per-room queue assigns the suffix to the second.
- Same avatar at once: first wins; second gets `AVATAR_TAKEN` and picks again.

## 4. Verification

| Check | Level |
| --- | --- |
| `validateIdentity` accepts every list entry and rejects others | U |
| Suffix assignment for duplicate names | I |
| `AVATAR_TAKEN` carries the taken list | I |
| Picker disables taken avatars; keyboard operable; radio semantics | C |
| `<b>x</b>` in a forged name is rejected; rendered output is text | I, C |
| No email, age, photo, or real-name fields exist | E (DOM assertion) |
| Word list content review for child safety | M |

## 5. Tasks

1. Create `identity.ts` with lists, validation, and formatting.
2. Add server-side validation and suffix logic in room join and create.
3. Build `NameBuilder`, `AvatarPicker`, `IdentityStep` and copy keys.
4. Add tests and the content-review checklist.

## 6. Dependencies and risks

- Depends on US-001 (routing) and US-060 (server); consumed by US-003 and US-006.
- Risk: word-list content. Mitigation: closed lists, human review before launch.
