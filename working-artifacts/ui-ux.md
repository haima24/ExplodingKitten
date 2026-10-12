# UI/UX Specification — "Whisker Boom" (working title)

| Item | Value |
| --- | --- |
| Status | Draft v0.2 — updated for online rooms (host + players) |
| Last updated | 2026-10-12 |
| Related documents | [Product brief](product-brief.md) · [User stories](user-stories.md) |
| Repository baseline | **No UI exists** in the repository (no components, styles, or assets). All items below are *Proposed*. See [product brief §H](product-brief.md#h-technical-context). |

Terminology follows the brief: **Exploding Kitten** (exploding card), **Defuse** (defuse), **Skip** (skip), **See the Future** (see the future), **Shuffle** (shuffle), **Cat card** (no-effect card), **Attack** (attack, Should), **Favor** (favor, Should), **Nope** (nope, Should). The ruleset is a product decision (OQ-04); this document never asserts it is official.

Priority tags: **[M]** MVP Must, **[S]** Should, **[C]** Could, **[F]** Future / out of MVP.

**Roles and context (v0.2).** There are only two roles: **Host** (creates the room, gets the **room code** and **share link**, starts the game, can remove players) and **Player** (joins by link or code). Everyone plays on **their own device**; each device shows only that person's hand. There is no handoff screen, no chat, and no accounts. See [product brief §A4a](product-brief.md#a4a-roles-no-accounts).

---

## A. Design Direction

### A1. Personality and visual identity

| Trait | Means | Avoid |
| --- | --- | --- |
| **Playful** | Rounded shapes, bouncy but short motion, funny micro-copy | Slapstick that mocks players, chaotic motion |
| **Welcoming** | Warm cream background, friendly cat characters, encouraging words | Dark, edgy, horror, or violent tone |
| **Clear** | One focal action per moment, big type, generous spacing | Dense HUDs, many simultaneous animations |
| **Family-sized** | Works equally for a child's tap and an adult's click | Hover-only tricks, tiny controls |

**Style keyword set:** "sticker-book", chunky outlines, flat colour, soft shadows, round fonts.

### A2. Child-friendly, not overwhelming

- Maximum **one primary button** per screen state.
- Maximum **three colours of emphasis** on screen at once (surface, one accent, one status colour).
- Decorative animation is limited to the single element that changed (a card, a pile, a banner).
- Confetti and "pop" effects last ≤ 1.2 s, are skippable by tap, and are disabled under reduced motion.

### A3. Original assets and illustration direction

- **Do not** copy, trace, or imitate Exploding Kittens' illustrations, typography, card layouts, colours, or logo. Card **names** are the Exploding Kittens names by product-owner decision.
- Characters: an original cast of **four round animal friends** (placeholder names: Biscuit the tabby, Pip the grey kitten, Marmalade the orange cat, Mochi the white cat) used as player avatars. Style: simple geometric shapes, 2–3 flat colours each, 3 px ink outline.
- The **Exploding Kitten** is a surprised, *cute* cat in a puff of confetti and glitter, not a bomb, flames, or anything frightening.
- All card art is **SVG** (small, crisp at any size). Each card type has a distinct **icon silhouette**, so cards are identifiable without colour.
- Source of art: OQ-08 (default: in-house SVG placeholders). Record the licence of every asset in an `assets/LICENSES.md`.

### A4. Visual hierarchy and readability

1. **Whose turn + what to do next** (banner, largest text on the board).
2. **The player's own hand** (largest, bottom of screen on phones, within thumb reach). In the lobby, the **room code and share buttons** take this place for the host.
3. **Draw pile / discard pile** (central).
4. **Opponent statuses** (compact, top).
5. **Secondary controls** (menu, help, connection status), small but ≥ 48 px, in a consistent corner.

---

## B. Design System

All values are **Proposed** starting tokens (no existing design system in the repo). Contrast ratios are approximate and **must be verified with a contrast tool** during implementation. If the team adopts the NashTech default in `.github/skills/ba-design-md-starter/references/nashtech-default-design-system.md`, map semantic roles below to it; the roles stay the same. A `DESIGN.md` can be generated from this section using the `ba-design-md-starter` skill.

### B1. Colour palette

| Token | Role | Value | Notes / contrast |
| --- | --- | --- | --- |
| `--color-bg` | App background (warm cream) | `#FFF8EC` | Base surface |
| `--color-surface` | Cards, dialogs, panels | `#FFFFFF` | |
| `--color-surface-alt` | Subtle panels, pile wells | `#F1ECFF` | |
| `--color-ink` | Primary text, outlines | `#1F1A3D` | ≈ 15:1 on bg |
| `--color-ink-soft` | Secondary text | `#4A4468` | ≈ 8:1 on bg |
| `--color-primary` | Main buttons, active-player highlight | `#5B3FD9` | White text ≈ 6.6:1 |
| `--color-primary-pressed` | Pressed primary | `#4A31B8` | |
| `--color-accent` | Highlights, "your turn" glow, Defuse | `#FFC83D` | Ink text ≈ 10:1 |
| `--color-boom` | Exploding Kitten, danger-ish emphasis | `#C93217` | White text ≈ 5.3:1 |
| `--color-success` | Success, "safe" | `#17784A` | White text ≈ 5.5:1 |
| `--color-info` | Info, See the Future | `#0F6E8C` | White text ≈ 5.8:1 |
| `--color-border` | Component borders | `#8A84A8` | ≈ 3.5:1 on white (UI component minimum 3:1) |
| `--color-focus` | Focus ring | `#1F1A3D` + 2 px white halo | Visible on every background |
| `--color-disabled-bg` / `-text` | Disabled controls | `#E6E2F0` / `#5E5880` | Disabled text still ≥ 4.5:1 on the disabled background |

Per-card-type colours are **decorative**; identity is always conveyed by icon + label too (see F3).

| Card | Fill | Icon (silhouette) |
| --- | --- | --- |
| Exploding Kitten | `--color-boom` tint | Surprised cat head with confetti puff |
| Defuse | `--color-accent` tint | Fish-shaped treat |
| Skip | `--color-info` tint | Hopping paw arc |
| See the Future | `--color-primary` tint | Eye with magnifier |
| Shuffle | `--color-success` tint | Two circular arrows |
| Cat card | `--color-surface-alt` | Sleeping cat on a cushion |
| Attack *(S)* | orange tint | Arrow handing off a paw |
| Favor *(S)* | teal tint | Speech bubble with a paw |
| Nope *(S)* | red tint | Stop sign with a crossed-out paw |

### B2. Typography

Self-hosted, open-licence fonts only (no third-party font requests; see privacy NFR). Proposed: **Baloo 2** (headings, buttons) and **Nunito** (body), both SIL OFL, with `system-ui, sans-serif` fallbacks and `font-display: swap`.

| Style | Size / line-height (rem, at 16 px root) | Weight | Use |
| --- | --- | --- | --- |
| Display | 2.5 / 1.1 (40 px) | 800 | Home title, winner |
| H1 | 2.0 / 1.15 (32 px) | 700 | Screen titles |
| H2 | 1.5 / 1.2 (24 px) | 700 | Dialog titles, turn banner |
| H3 | 1.25 / 1.3 (20 px) | 700 | Card name in detail view |
| Body | **1.125 / 1.5 (18 px)** | 400–600 | Default text, instructions |
| Small | 1.0 / 1.4 (16 px) | 600 | Pile counts, labels (**never below 16 px**) |
| Card label | 0.875–1.0 (14–16 px) | 800 | Text on small cards, always paired with an icon |

- Display and H1 scale with `clamp()` between viewport classes.
- User text size setting (**[S]**): 100 % / 125 % / 150 %. All layouts must work with browser zoom to 200 % and text spacing overrides (WCAG 1.4.4, 1.4.12) with no loss of content.
- Sentence case. No ALL CAPS for body text. Left-aligned. Max line length ≈ 60 characters.

### B3. Spacing scale (4-pt base)

`--space-1: 4px`, `-2: 8`, `-3: 12`, `-4: 16`, `-5: 24`, `-6: 32`, `-7: 48`, `-8: 64`. Minimum gap between adjacent tap targets: **8 px**. Screen padding: 16 px (mobile), 24 px (tablet), 32 px (desktop).

### B4. Radius and elevation

| Token | Value | Use |
| --- | --- | --- |
| `--radius-sm` | 8 px | Chips, tooltips |
| `--radius-md` | 16 px | Buttons, inputs, cards |
| `--radius-lg` | 24 px | Dialogs, sheets |
| `--radius-full` | 999 px | Avatars, badges |
| `--outline-sticker` | 3 px solid `--color-ink` | Cards, buttons, avatars (sticker look) |
| `--elev-1` | `0 2px 0 rgba(31,26,61,.25)` | Resting cards and buttons |
| `--elev-2` | `0 6px 0 rgba(31,26,61,.25)` | Selected / raised card |
| `--elev-3` | `0 12px 24px rgba(31,26,61,.30)` | Dialogs, sheets |
| `--scrim` | `rgba(31,26,61,.55)` | Modal backdrop |

### B5. Buttons and interactive states

| Variant | Appearance | Use |
| --- | --- | --- |
| **Primary** | `--color-primary` fill, white text, sticker outline | One per screen state ("Play", "Draw", "I'm Mia") |
| **Secondary** | White fill, ink text, border | "How to Play", "Back" |
| **Danger** | `--color-boom` fill, white text | Only in destructive confirmations ("End game for everyone", "Remove player", "Leave game") |
| **Icon button** | 48 × 48 px minimum, with visible text label or an accessible name | Menu, help, settings, copy |

Sizes: default **min-height 56 px** (children), compact **48 px** (secondary), **never < 48 × 48 px**.

| State | Requirement |
| --- | --- |
| Default | Sticker outline + `--elev-1` |
| Hover (pointer) | Slight brightness shift only; **no information is conveyed only on hover** |
| Focus-visible | 3 px `--color-focus` ring with 2 px white halo, not removed by `outline: none` without replacement |
| Pressed | Translate down 2 px, `--elev-1` → none |
| Disabled | Disabled colours **plus** an explanation text or tooltip reachable by tap (e.g., "Not your turn yet") |
| Loading | Spinner + text; button stays at same width |

### B6. Cards and game tokens

- **Card size** (aspect ratio 5:7): hand card min **72 × 100 px** (phone), **96 × 134 px** (tablet), **120 × 168 px** (desktop); detail view up to 280 × 392 px.
- **Card face:** top-left name (≤ 2 lines), centred large icon, bottom one-line effect text (hidden below 96 px width; the detail view always shows it).
- **Card back:** a plain paw-print pattern in `--color-primary`, with a different pattern from any face.
- **Selected card:** raised 16 px, `--elev-2`, 4 px `--color-accent` outline **plus** a check badge (not colour alone).
- **Playable vs unplayable:** unplayable cards show a small "lock/zzz" badge and reduced saturation, but remain selectable so their explanation can be read.
- **Tokens:** active-player marker = glowing ring **plus** a paw-print badge; eliminated marker = sleeping "zzz" badge and desaturated avatar; turn-order arrow between seats on tablet/desktop.

### B7. Icons and illustrations

Single SVG icon set, 2 px stroke, rounded caps, 24/32/48 px sizes, `currentColor`. Every icon either has a visible text label or an accessible name; purely decorative graphics use `aria-hidden="true"`.

### B8. Feedback, alerts, tooltips, modals

| Element | Spec |
| --- | --- |
| **Turn banner** | Always visible; H2 text ("Mia, it's your turn!") + one hint line ("Play a card or tap the deck to draw"). Announced politely to assistive tech. |
| **Toast / action message** | Bottom-centre (above hand), 4 s minimum, dismissible, does not steal focus. Replaced by the **action log** in the game menu / log panel **[S]**. |
| **Connection banner** | Top of the screen, below the header, `role="status"`. States: "Connecting…", "Reconnecting… your cards are safe", "Back online" (auto-dismisses after 3 s). Never blocks the board. A text label is always shown with the icon. |
| **Absent-player banner** | Shown to everyone when the player whose turn it is has lost connection: "Waiting for Pip to come back…" with a 60 s countdown shown as text. After 60 s the **host** also sees **Keep waiting** and **Skip Pip**. |
| **Inline error** (invalid action) | Appears next to the attempted control, friendly wording, icon + text, `role="status"`. Example: "Cat cards are played in pairs. Tap a second matching Cat card!" Never red-only. |
| **Info popover** (card help) | Opens on tap/Enter (not hover). Closes with Escape, outside tap, or close button. |
| **Modal dialog** | `role="dialog"` with `aria-modal`, labelled title, focus trapped and returned to the invoking control on close, Escape closes (except forced-choice dialogs), scrim `--scrim`. Max width 560 px; becomes a bottom sheet on phones. |
| **Confirmation dialog** | Title states the consequence; the safe action is the primary, auto-focused button; destructive action is a separate danger button on the other side. |
| **Celebration** | Confetti burst ≤ 1.2 s; replaced by a static starburst under reduced motion. |

### B9. Motion

Durations: 120 ms (press), 200 ms (select / hover-equivalent), 400 ms (card move), 1.2 s max (celebrations). Easing: `cubic-bezier(.2,.8,.2,1)`. Only `transform` and `opacity` are animated. Under `prefers-reduced-motion: reduce` or the in-app toggle: replace movement with instant state change or short cross-fades (≤ 100 ms), and no parallax, shake, or confetti.

---

## C. Responsive Behaviour

Recommended breakpoints (no existing stack to inherit from; **Proposed**; adjust if a UI library is adopted). Use `min-width` queries, fluid sizing, and container queries for cards.

| Class | Viewport | Query |
| --- | --- | --- |
| **Mobile portrait** | 320–599 px wide | default (mobile-first) |
| **Mobile landscape** | height ≤ 500 px, width ≥ 568 px | `(orientation: landscape) and (max-height: 500px)` |
| **Tablet** | 600–1023 px | `min-width: 600px` |
| **Desktop** | ≥ 1024 px | `min-width: 1024px` |

Use `100dvh` (with fallback) so mobile browser toolbars never hide the hand. Respect safe-area insets (`env(safe-area-inset-*)`). No horizontal page scrolling at any size ≥ 320 px, except the intentionally scrollable hand.

### C1. Layout matrix

| Area | Mobile portrait | Mobile landscape | Tablet | Desktop |
| --- | --- | --- | --- | --- |
| **Board** | Vertical stack: status bar → opponents strip → piles → banner → hand | Two columns: left = status + piles; right = hand and actions | Stack with bigger piles; opponents in a row | Three zones: opponents on top, centred table with piles, hand at bottom; side panel for log/help |
| **Player areas** | Compact chips (avatar 40 px, name, card-count badge) in a horizontally scrollable row; active chip pinned | Vertical chip list at left edge | Row of larger chips with turn-order arrows | Seats arranged around the table (top / left / right), labels outside card areas |
| **Card hand** | Single row, horizontal **scroll-snap**, cards overlap ≤ 25 %, each card shows ≥ 56 px of its width; scroll arrows hidden (swipe) with a "n cards" counter | Single row, same as portrait but taller cards | Single row, cards overlap ≤ 15 % | Fan-less single row; no overlap up to 8 cards, then slight overlap |
| **Action controls** | Fixed bottom bar: primary action (Play selected / Draw) full width, 56 px high | Action stack at right of hand | Bottom bar, 2-column | Inline buttons under the hand; keyboard shortcuts documented |
| **Dialogs** | Bottom sheet, full width, up to 85 % height, internal scroll | Centred dialog max 90 % height | Centred modal 560 px | Centred modal 560–720 px |
| **Navigation** | Top-left Menu (☰), top-right Help (?) and connection icon; no tab bar | Same, in the left column | Same, with text labels | Same, with text labels; Rules also as a side panel |
| **Typography** | Body 18 px | Body 18 px | Body 18 px | Body 18–20 px |

### C2. Interaction rules

- **Touch, mouse, and keyboard parity.** Every action is available through all three. No action requires hover, long-press, drag, or multi-finger gestures. (Drag-to-play may be offered as an *optional* enhancement; tap-select + Play button is always present, per WCAG 2.5.1/2.5.7.)
- **Targets.** ≥ 48 × 48 px for interactive elements, ≥ 8 px between them. The hand's cards meet this through height (≥ 100 px) and ≥ 56 px visible width.
- **Orientation.** Rotation preserves all state and scroll position. No orientation lock. If a viewport is too short for the board (e.g. < 360 px high), show the board scrollable, not a "please rotate" blocker.
- **Resize.** Layouts reflow; no fixed pixel layout assumptions. Dialogs re-fit.
- **Zoom.** 200 % zoom and 320 px reflow both remain fully usable.

### C3. Wireframes (low fidelity, text only)

**Mobile portrait — game board (active player view)**

```text
┌──────────────────────────────┐
│ [☰]   Whisker Boom   ● [?]  │  <- menu / connection / help (48 px)
├──────────────────────────────┤
│ (Pip 5) (Mochi 3) (Sam zZz)  │  <- opponent chips; active ring + badge
├──────────────────────────────┤
│  Mia, it's your turn!        │  <- turn banner (H2)
│  Play a card or tap the deck │
├──────────────────────────────┤
│   ┌─────┐        ┌─────┐     │
│   │DECK │        │TOP  │     │
│   │ 12  │        │CARD │     │  <- draw pile (tappable), discard pile
│   └─────┘        └─────┘     │
├──────────────────────────────┤
│ ◄ [Hop][See the Future][Cozy][Defuse] ► │  <- scroll-snap hand, 7 cards
│        (selected: See the Future ✓)    │
├──────────────────────────────┤
│ [   Play “See the Future”  ]  [ Draw ] │  <- primary action bar (56 px)
└──────────────────────────────┘
```

**Desktop — game board**

```text
┌────────────────────────────────────────────────────────────────────┐
│ [☰ Menu]     Whisker Boom      ● Connected              [? Help]   │
├────────────────────────────────────────────────────────────────────┤
│        (Pip · 5 cards)        (Mochi · 3 cards)     (Sam · out zZz) │
│                                                                    │
│   Mia, it's your turn!   Play a card, or draw to end your turn.    │
│                                                                    │
│            ┌──────┐   ┌──────┐                       ┌───────────┐ │
│            │ DECK │   │ DISC.│                       │ Last move │ │
│            │  12  │   │ Hop  │                       │ Pip played│ │
│            └──────┘   └──────┘                       │ Shuffle  │ │
│                                                      └───────────┘ │
│  [Hop] [See the Future✓] [Shake] [Cozy] [Cozy] [Defuse] [Skip]                │
│  [ Play “See the Future” ]  [ Draw a card ]                                  │
└────────────────────────────────────────────────────────────────────┘
```

**Mobile portrait — lobby (host view)**

```text
┌──────────────────────────────┐
│ [☰]   Whisker Boom   ● [?]  │
├──────────────────────────────┤
│ Your room                    │
│ Share this with your family  │
│                              │
│        K 7 M 4 Q X           │  <- room code (H1, spaced letters)
│  [ Copy code ] [ Copy link ] │
│  [      Share…           ]  │  <- native share sheet if available
│  Only share with people you  │
│  trust.                      │
├──────────────────────────────┤
│ Players (2 of 4)             │
│ (Mia ★ Host)                 │
│ (Sleepy Biscuit)    [Remove] │  <- host-only
│ … waiting for more players   │
├──────────────────────────────┤
│ [      Start game        ]   │  <- primary; enabled with 2+ players
│ [ Close room ]              │
└──────────────────────────────┘
```

Player view of the lobby: the same page without Remove, Start, and Close room; the primary area reads "Waiting for Mia to start the game" and **Leave room** is the only action.

---

## D. Screen Specifications

Routes (Proposed, path based, so that browser Back and shared links work): `/` Home, `/create` (host identity), `/join` (enter code), `/join/:code` (code prefilled from a share link), `/room/:code` (lobby and game states), `/rules`, `/settings`. Game states (board, See the Future, Boom, victory) are **states** of `/room/:code`. A room code in the URL is never used as proof of membership; membership is held by the rejoin token (see US-043).

### D1. Landing / home screen — **[M]** (US-001, US-002)

| Aspect | Specification |
| --- | --- |
| Purpose | Welcome and route into creating a room, joining a room, or learning the rules |
| Primary action | **Create a room** |
| Layout | Centred logo and tagline; large **Create a room** button (primary); **Join a room** (secondary, equally large); then How to Play and Settings; friendly cat illustration; footer: "No sign-up. No ads. We only keep a nickname for as long as your room is open." plus credits link |
| Components | Logo, Button (primary/secondary), Illustration, Footer note, RejoinBanner |
| States | Default; **Rejoin banner** ("You're still in room K7M4QX. [Rejoin] [Forget it]") when this device holds a valid rejoin token; error banner if assets or the server cannot be reached |
| Mobile | Single column; buttons full width; illustration shrinks above buttons; landscape puts illustration left, buttons right |
| Accessibility | Page `<h1>`; Create is **not** auto-focused; logical Tab order Create → Join → How to Play → Settings; illustration decorative |

### D2. Create a room and Join a room (identity) — **[M]** (US-003, US-004, US-006)

Two entry paths share one **identity step**: pick a nickname and avatar.

| Aspect | Specification |
| --- | --- |
| Purpose | Host: start a room. Player: get into an existing room. |
| Primary action | Host: **Create room**. Player: **Join room**. |
| Join: code entry (`/join`) | One large code field (6 boxes or a single field, uppercase, no look-alike characters accepted), paste supported, **Continue** button. Opening a share link (`/join/:code`) skips this step and shows "Joining room K7M4QX". |
| Identity step layout | **Name builder:** two dropdown-style pickers made of big buttons ("Sleepy", "Zippy", "Fluffy"… + "Biscuit", "Pip", "Mochi"…) with a live preview ("Sleepy Biscuit") and a **Shuffle names** button. **Avatar picker:** 4–6 original animal avatars as a radio group. Host-only hint: "Ask a grown-up to be the host." (does not block, OQ-17). |
| Components | CodeInput, NameBuilder, AvatarPicker, Button |
| States | Default; code invalid format ("That code has 6 letters and numbers"); **room not found** ("We can't find that room. Check the code with your host."); **room full** ("This room is full"); **game already started** ("This game has already started. Ask the host to play again."); **room closed or expired**; avatar already taken in the room (option disabled and labelled "taken"); too many attempts ("Too many tries. Wait a minute and try again."); server unreachable (retry button) |
| Mobile | Single column; primary button pinned to the bottom; name builder buttons wrap in a grid |
| Accessibility | Labelled controls, `<fieldset>`/`<legend>`; avatars as radio buttons with names ("Biscuit the tabby"); no placeholder-only labels; error text next to the field and announced; no real-name wording ("Pick a fun name"); no free-text nickname in the MVP (OQ-14) |

### D3. Lobby — **[M]** (US-054, US-055)

| Aspect | Specification |
| --- | --- |
| Purpose | Gather players and let the host start the game |
| Primary action | Host: **Start game**. Player: none (waits); **Leave room** is secondary. |
| Layout | See the lobby wireframe in C3. **Share panel (host):** large room code, **Copy code**, **Copy link**, **Share…** (Web Share API when available), a safety line "Only share this with people you trust." **Player list:** avatar, nickname, "Host" badge, connection dot with text ("online" / "reconnecting"), and **Remove** (host only). **Footer:** Start game (host), Close room (host), Leave room (player). |
| Components | ShareRoomPanel, PlayerList, PlayerListItem, Button, ConnectionBanner, ConfirmDialog |
| States | Waiting for players (1 of 4); ready (2+ players, Start enabled); full (4 of 4, share panel shows "Room full"); a player joins or leaves (polite announcement "Pip joined"); copy succeeded ("Code copied" toast); copy failed (shows the text selected for manual copy); host removed a player (the removed player sees "The host removed you from the room"); host left (see US-059); room closing; reconnecting |
| Mobile | Share panel first, player list below, Start button pinned to the bottom; on tablets and desktop the share panel and list sit side by side |
| Accessibility | Code is real text with letter spacing (not an image) and is announced letter by letter ("K, 7, M, 4, Q, X"); copy buttons announce the result in a live region; list is a `ul` with status text, not colour-only; **Remove** has an accessible name ("Remove Sleepy Biscuit") and opens a confirmation |

### D4. Game board — **[M]** (US-007, US-009, US-010, US-012, US-033)

| Aspect | Specification |
| --- | --- |
| Purpose | Play the game on your own device. Your hand is always shown to you and to nobody else. |
| Primary action | On your turn: Draw a card (end turn) or Play selected card. Off your turn: none (wait and watch). |
| Layout | See C1 and C3 wireframes |
| Components | MenuButton, HelpButton, ConnectionIndicator, PlayerSeat/Chip ×N, TurnBanner, DeckPile, DiscardPile, Hand, Card, ActionBar, ToastRegion, ConnectionBanner, AbsentPlayerBanner, (Log panel **[S]**) |
| States | See G (state catalogue). Off-turn: hand stays visible and cards can be inspected, but Play and Draw are inert and labelled "Wait for Pip". |
| Mobile | See C1 |
| Accessibility | Landmarks: `header` (controls), `main` (board), `region` labelled "Your hand" (list of buttons). Tab order: Menu, Help, opponents (info only, non-focusable unless interactive), Deck, Hand, Action bar. Arrow keys move within the hand (roving tabindex). Live region announces turn changes and other players' public actions ("Pip played Shuffle"). |

### D5. Card selection and card action interactions — **[M]** (US-011, US-018, US-019, US-020, US-040)

| Aspect | Specification |
| --- | --- |
| Purpose | Let a player understand and commit to an action card |
| Primary action | **Play "[Card]"** |
| Flow | 1) Tap/click/Enter a card → it raises, check badge appears, a **card detail panel** shows name, art, one-sentence effect, and whether it is playable. 2) Primary button reads **Play "See the Future"** (disabled with explanation if unplayable). 3) Confirm → card animates to the discard pile → effect resolves. 4) Tap the selected card again, press Escape, or tap elsewhere → deselect. |
| Effect-specific sub-flows | **Skip:** immediate, turn ends, banner for everyone "Mia hopped over her draw!", then the next player's turn begins. **See the Future:** See the Future overlay on the actor's device only (D5a); others see "Mia peeked". **Shuffle:** brief shuffle animation, toast for everyone "Deck shuffled!", player continues the turn. **Attack** **[S]**: next player takes 2 turns, banner shows "×2". **Favor** **[S]**: choose a player (large avatar buttons); the chosen player's device shows "Mia asks you for a card. Pick one to give" with their hand; when they choose, the card moves privately to Mia. If the friend is absent, the absent-player rule applies (US-058). **Nope** **[S]**: after an action card is played, players holding a Nope see a "Nope it?" dialog (who played what, **Nope!** and **Let it go**, a seconds countdown); everyone else sees "Waiting to see if anyone plays a Nope". The result is announced ("Pip played Nope!", "Mia's Skip was stopped!"). Escape means Let it go. |
| States | Unselected / selected / unplayable / **sent, waiting for the server** (controls inert; typically ≤ 300 ms, a spinner appears after 1 s) / resolved / rejected by the server (message shown and the card stays in the hand) |
| Mobile | Detail panel is a compact strip above the action bar (so the hand stays visible); long text collapses with "More" |
| Accessibility | Each card is a `button` with accessible name "See the Future, action card, look at the top 3 cards. Selected." Selection state exposed via `aria-pressed` or `aria-selected` in a listbox pattern. Result announced via live region. |

**D5a. See the Future overlay (private).** A modal on the **acting player's device only**, showing the top 3 cards face-up (left = top). Title "Your secret peek!". Primary: **"Got it — hide"**. Other players see only "Mia peeked". Closing returns to the board. Under screen readers, card names are read in order. The cards are sent to this device only when See the Future is played and are not kept after the overlay closes.

### D6. Draw interaction and Boom resolution — **[M]** (US-012, US-015, US-016, US-017)

| Aspect | Specification |
| --- | --- |
| Purpose | Resolve the draw, including the dramatic Exploding Kitten moment |
| Primary action | Tap the deck / **Draw a card** |
| Normal draw | Top card flips and slides into the hand with a short animation; toast to the drawer "You got Cat card"; everyone else sees "Mia drew a card" (card not shown); the turn passes to the next player |
| **Exploding Kitten with Defuse** | The drawer sees a dialog "Uh-oh, an Exploding Kitten!" with the Exploding Kitten illustration and "Use your Defuse to calm it down!" → primary **Use Defuse**. Next: **Hide the Exploding Kitten** with a position picker (Top / Middle / Bottom / Random, big labelled buttons, default Random; "Pick where to tuck it in, secretly!"). The picker choice goes only to the server and is never shown to others. Everyone else sees a banner "Mia found an Exploding Kitten and used a Defuse!" then "Exploding Kitten tucked back in!". The turn then passes. |
| **Exploding Kitten, no Defuse** | The drawer sees a dialog "Oh no, an Exploding Kitten popped!" with a gentle confetti puff illustration, "[Name] is out of this round and gets a nap. Cheer the others on!" (with a sleeping-cat illustration). Primary **OK**. The avatar becomes sleeping. Everyone else sees a banner "Mia is taking a nap". Not a "game over" or "you lost" phrase. |
| States | Drawing / boom-with-treat / reinserting / boom-no-treat / eliminated |
| Accessibility | Dialog with assertive announcement; focus on primary; position picker is a radio group with descriptions |

### D7. Rules and contextual help — **[M]** (US-029, US-030, US-031)

| Aspect | Specification |
| --- | --- |
| Purpose | Teach the game in under two minutes and answer "what does this card do?" |
| Primary action | **Next** (tour) / **Back to game** |
| Layout | **How to Play tour**: 4–5 swipeable steps with illustrations ("1 Goal", "2 Your turn", "3 Exploding Kittens and Defuse cards", "4 Special cards", "5 Winning"); progress dots with text "Step 2 of 5"; Skip and Done. **Card guide**: a list of all card types with art and one-sentence effect. **Contextual help**: "?" in the game header opens the same content in a dialog (bottom sheet on mobile) without losing game state. **Turn hint line** inside the turn banner. |
| States | Opened from Home; opened mid-game (the game **keeps running** for everyone; the dialog covers only this player's screen, and a small "Your turn!" indicator stays visible if it becomes their turn); first-play coach marks **[S]** (sequence of ≤ 4 dismissible tips, never repeated once dismissed; remembered locally) |
| Mobile | Swipe, plus visible Next/Previous buttons (no swipe-only) |
| Accessibility | Step content is a normal reading order; no auto-advance; Escape closes the dialog; no hover tooltips; text ≥ 18 px |

### D8. Game menu, leave, and end game — **[M]** (US-028, US-002)

In an online game **nobody can pause for everyone**, so the menu opens over this player's screen only.

| Aspect | Specification |
| --- | --- |
| Purpose | Let a person get help, change settings, or leave safely, and let the host end the game |
| Primary action | **Back to game** |
| Game menu | Dialog listing: Back to game (primary), How to Play, Settings, **Leave game** (danger). **Host only:** **End game for everyone** and **Remove a player** (danger). The player's hand is hidden while the menu is open. The game keeps running; if it becomes this player's turn, a banner "It's your turn!" is visible above the dialog. |
| Confirmation: Leave game | "Leave this game?" — "You'll be out of the round and your cards go away. You can't come back to this game." Buttons: **Stay** (primary, default focus) and **Leave** (danger). |
| Confirmation: End game (host) | "End the game for everyone?" — "Everyone goes back to the lobby and this game is lost." Buttons: **Keep playing** (primary, default focus) and **End game** (danger). |
| Confirmation: Remove a player (host) | "Remove Sleepy Biscuit?" — "They will be taken out of the room." Buttons: **Cancel** (primary) and **Remove** (danger). |
| Browser actions | Browser Back during a game opens the game menu instead of leaving silently (US-002). Closing or refreshing the tab does **not** leave the game; the device can rejoin (US-043). No `beforeunload` warning is used. |
| Accessibility | Focus trap; Escape = Back to game; destructive actions are never the default |

### D9. Game-over / victory screen — **[M]** (US-025, US-026, US-027)

| Aspect | Specification |
| --- | --- |
| Purpose | Celebrate and decide what's next |
| Primary action | Host: **Play again**. Players: wait for the host, or **Leave room**. |
| Layout | Winner avatar large with a celebration; headline "Mia wins the round!"; short, kind recap ("Pip and Sam took naps"); stats: turns played, Exploding Kittens defused (simple, fun). **Host:** **Play again** (primary) and **Close room**. **Players:** the text "Waiting for [Host] to play again" and **Leave room**. |
| States | Default; reduced motion (static starburst); 2-player vs multi-player copy; host disconnected (see US-059); a player left (list updates) |
| Mobile | Stack vertically; buttons full width |
| Accessibility | Heading announced on arrival; focus lands on the heading then Play again; no sound-only cues |

### D10. Settings — **[M]** (US-038), text size **[S]** (US-039)

Reduced motion toggle (default follows OS), Sound toggle (default **off**, **[C]** feature; hidden or disabled with note until sound exists), Text size **[S]**, "Show tips again" **[S]**. Changes apply immediately and persist **on this device only** (local storage; never sent to the server). Accessible as a screen from Home and as a dialog in game.

### D11. Error, loading, and empty screens — **[M]** (US-041), **[S]** (US-044)

| Screen | Spec |
| --- | --- |
| **Loading** | Cat spinner (static under reduced motion) with "Getting the cards ready…". Appears only if loading exceeds 300 ms to avoid flashes. |
| **Error / recovery** | Friendly illustration (confused cat) and "Oops, something went wrong." Buttons: **Try again** (re-joins the room if the device still has a seat) and **Back to home**. No technical stack trace. |
| **Connection lost** | Non-blocking banner (see B8): "Reconnecting… your cards are safe". After 60 s without success the board is replaced by "We lost the connection. [Try again] [Home]". |
| **Room ended** | "This room has ended" with the reason when known (host closed it, it timed out, or the server restarted) and a **Home** button. |
| **Unsupported browser** **[C]** | Plain text message listing supported browsers. |

### D12. Future screens — **[F]**

Single-device pass-and-play (with a handoff screen), Bot Buddies seat selector **[C]**, QR-code panel in the lobby **[C]**, preset reactions or stickers, player profile, parent zone, achievements/stickers, deck/theme picker, match scoreboard, expansion pack browser. **Not committed for MVP.**

---

## E. Core Gameplay Interaction Design

### E1. Turn indicators and player status

- **Turn banner** (always) names the active player and provides one hint line.
- **Active player** is shown with: glowing `--color-accent` ring + paw badge + bold name, never colour alone.
- **Opponent chip** shows avatar, nickname, card-count badge, and status icon: active (paw), waiting (none), out (zzz).
- **Turn order**: small arrow icons on tablet/desktop; on phone, order shown in the player list in the game menu.
- **Pending "×2" extra turn** **[S]** shown as a "2 turns" badge.

### E2. Card selection and play

See D5. Rules: one selected card at a time; selection never changes game state; only **Play** does. Playing a card that has a free, immediate effect (Skip) still needs the Play confirmation, as a deliberate two-step, to protect children from accidental taps. Cards for which playing would be pointless are not blocked unless illegal (see E6).

### E3. Draw interaction

The deck is both a large tappable target and the **Draw a card** button in the action bar (same action, two ways). It is enabled only for the active player. After the draw the turn is over and the next player's device becomes active; there is no handoff screen.

### E4. Exploding Kitten and Defuse feedback

See D6. Principles: **surprise, not scare**; **always a clear next step**; **names the cause** ("an Exploding Kitten popped"); **never uses "you lose"**; spectators see a short, friendly recap.

### E5. Card explanations and confirmation

- First tap = **explain** (detail panel), second step = **confirm** (Play).
- Every card's effect text is ≤ 12 words, e.g. "Skip: skip your draw and end your turn." / "Defuse: calms an Exploding Kitten so you can stay in."
- Confirmation dialogs are used **only** for destructive or irreversible out-of-game choices (leave game, end game, remove player, close room). In-game plays use the select → Play pattern, not an extra "Are you sure?".

### E6. Invalid actions and error recovery

| Situation | Behaviour | Message (friendly) |
| --- | --- | --- |
| Tap Play while no card selected | Play disabled; hint reads "Pick a card first" | "Pick a card to play, or draw." |
| Select Cat card and press Play | Not allowed | "Cat cards are played in pairs. Tap a second matching Cat card!" |
| Tap Draw / Play when it is another player's turn | Controls inert | "Wait for Pip's turn." |
| Server rejects an action (for example a stale tap just after the turn changed) | State unchanged; the card stays in the hand | "Oops, that was too late. It's Pip's turn now." |
| Connection is down when tapping Draw / Play | Controls inert until reconnected | "Reconnecting… try again in a moment." |
| Tap Defuse directly in hand | Not playable (used only when an Exploding Kitten is drawn) | "Defuse cards save you automatically when an Exploding Kitten shows up." |
| Favor with no valid target **[S]** | Blocked | "Nobody has a card to share." |
| Engine receives an illegal action (bug) | State unchanged, error logged to console only | Generic "That move didn't work. Try something else." |
| Unexpected exception | Error boundary screen (D11) | "Oops, something went wrong." |

Rules: no state change on invalid input; message appears next to the source control and in the live region; message auto-clears after 5 s or on next interaction; never red-only.

### E7. Victory, replay, return-home flows

`Last player remains → Victory screen for everyone → { Host: Play again → everyone returns to the lobby with the same names and avatars, host presses Start | Host: Close room → all players see "The host closed the room" and go Home | Player: Leave room → Home }`. Players cannot start a rematch; they see "Waiting for [Host]". The starting player rotates on each new game (proposal; UQ-04). A room that is closed or expired cannot be reopened with the same code.

### E8. Multi-device events and private information (proposal)

- **Public events** are shown to everyone in a banner or toast and announced politely: whose turn it is, a card played (name visible), a card drawn (card hidden), a Defuse used, a player out, a player disconnected, reconnected, or removed, and the winner.
- **Private events** go only to the player concerned: their own hand, See the Future results, the Exploding Kitten dialog and position picker, and Favor prompts.
- Public banners queue so that two events never overlap; each stays ≥ 2 s and is skippable by tap.
- If a player is absent when it is their turn, everyone sees the absent-player banner (B8) and the host gets **Keep waiting** and **Skip [Name]** after 60 s.

---

## F. Accessibility and Child-Friendly Design

Target: **WCAG 2.2 Level AA** (Proposed; no existing conformance target). Verification approach: automated `axe` checks, keyboard-only pass, screen reader pass (NVDA + Firefox/Chrome, VoiceOver + Safari iOS, TalkBack), and the checklists in `.github/skills/testing-accessibility-testing/`.

### F1. Readable text and scalable typography
Body ≥ 18 px, nothing below 14 px (card labels) and card help always available at ≥ 16 px; rem-based sizing; 200 % zoom and 320 px reflow supported; text-spacing overrides supported without clipping.

### F2. Plain language
Short sentences, present tense, concrete verbs ("Pick a card", "Tap the deck"). Avoid jargon ("deck exhausted", "resolve", "eliminate"). One idea per sentence. Reading level ≈ age 6–7 for in-game text.

### F3. Colour-independent state indicators
Active player, selected card, playable/unplayable, eliminated, and error states all use **icon + text/shape + colour**. Card types carry distinct icons and text labels. Error messages include an icon and wording; success messages likewise.

### F4. Contrast
Text ≥ 4.5:1 (large ≥ 3:1), UI components and focus indicators ≥ 3:1 (WCAG 1.4.3, 1.4.11). Text on illustrations and card art must sit on a solid plate. High-contrast theme is **[C]** (F-35).

### F5. Large touch targets
≥ 48 × 48 CSS px with ≥ 8 px spacing (exceeds WCAG 2.5.8 minimum of 24 px). Primary actions 56 px high.

### F6. Keyboard navigation and focus
All functionality keyboard-operable. Visible focus indicator (≥ 3:1, ≥ 2 px, not obscured by sticky bars; WCAG 2.4.11/2.4.13). Roving tabindex within the hand: ← → to move, Enter/Space to select, then Tab to Play. Shortcuts (**Proposed**): `D` draw, `P` play selected, `?` help, `Esc` menu/close. Single-character shortcuts must be remappable or only active when focus is not in a text field (WCAG 2.1.4), or be omitted if that is too costly.

### F7. Screen-reader support
- Landmarks and headings per screen; `lang="en"`.
- Hand = labelled list of buttons; card names include type and effect.
- A single polite **live region** announces: turn changes, other players' public actions, cards drawn/played, Boom events, eliminations, joins and leaves, connection changes, victory. Assertive only for Exploding Kitten dialogs.
- The game menu removes hidden hand content from the accessibility tree (`inert`/not rendered); other players' hands are never sent to the device, so they cannot be read by assistive technology.
- The room code is read letter by letter; copy results are announced.
- See the Future overlay reads the three cards in order.
- Dragging is never the only way to act (WCAG 2.5.7).

### F8. Reduced motion and sensory safety
Honour `prefers-reduced-motion` and the in-app toggle (US-038). No flashing more than 3 times per second (WCAG 2.3.1). No autoplay audio; sound off by default. No vibration. No parallax or full-screen shaking.

### F9. Child-friendly and ethical design
- No ads, no in-app purchases, no countdown pressure, no streaks or "come back" nudges, no fake urgency.
- No external links on game screens. A footer "About" page may link out only behind an adult-oriented "For grown-ups" label **[C]**.
- Minimal data. Players pick a name from a **curated name builder** and an avatar. No real names, photos, or emails are requested. A hint says "Don't use real names."
- **No chat and no free text** shown to other players. Names come from word lists; the host can remove a player.
- **Safe sharing:** the lobby says "Only share this with people you trust." Rooms hold at most 5 players, lock when the game starts, and expire.
- The Create screen suggests "Ask a grown-up to be the host" without blocking children (OQ-17).
- Failure is gentle: "nap time", no leaderboards of "losers", rematch is one tap for the host.
- Waiting is never shamed: an absent player is described neutrally ("Pip's connection dropped"), not as a fault.
- Consistent placement of Menu and Help on every screen to reduce confusion (WCAG 3.2.3 Consistent Navigation, 3.2.6 Consistent Help).
- Authentication is absent, so WCAG 3.3.8 does not apply. Redundant entry is avoided: a rematch reuses names and avatars (3.3.7), and a share link pre-fills the room code.

---

## G. UI State Catalogue

| # | State | Where | Visual / behaviour | Related story |
| --- | --- | --- | --- | --- |
| S1 | **Loading** | App start, asset load (>300 ms) | Spinner + "Getting the cards ready…"; static under reduced motion | US-044 |
| S2 | **Empty** | Discard pile at game start; empty hand after a rare edge case; lobby with only the host | Discard shows a dotted outline "Played cards go here"; lobby shows "Waiting for players" | US-010, US-055 |
| S3 | **Game ready** | Game start, on every device | "Everyone has cards! [Name] goes first" confirmation | US-005 |
| S4 | **Lobby** | After Create or Join | Share panel (host), player list, Start (host, 2+ players) or "Waiting for [Host]" | US-054, US-055 |
| S5 | **Player's turn** | Active player's board | Banner + active glow; hand visible; Deck and Play enabled | US-007 |
| S6 | **Another player's turn** | Waiting state on your device | Banner "It's Pip's turn"; Play and Draw inert and labelled "Wait for Pip"; hand stays visible to you | US-007 |
| S7 | **Card selected** | Hand | Raised card, check badge, detail panel, Play enabled (if playable) | US-011 |
| S8 | **Card unplayable selected** | Hand | Detail panel explains why; Play disabled | US-040 |
| S9 | **Action in progress** | Sent to the server, waiting for confirmation, then animation | Controls inert, `aria-busy`; ≤ 300 ms typical; spinner after 1 s; animation ≤ 600 ms and skippable | US-011 |
| S10 | **See the Future viewing** | See the Future overlay | Modal with 3 cards, "Got it — hide" | US-019 |
| S11 | **Exploding Kitten drawn (has Defuse)** | Dialog | Use Defuse → position picker | US-015, US-016 |
| S12 | **Exploding Kitten drawn (no Defuse) / player out** | Dialog → spectator state | Out marker, "nap time", game continues | US-017 |
| S13 | **Invalid action** | Inline message | Friendly text + icon, no state change | US-040 |
| S14 | **Game menu open** | Menu dialog | Hand hidden on this device only; the game continues for everyone; "Your turn" indicator if it becomes your turn | US-028 |
| S15 | **Leave / end game / remove confirmation** | Confirmation dialog | Safe action default | US-028 |
| S16 | **Game won** | Victory screen on every device | Winner celebration, recap; host: Play again / Close room; players: "Waiting for [Host]" / Leave room | US-025 |
| S17 | **Player eliminated (spectating)** | Board for out players | Own seat marked "zzz"; remaining players keep playing; no hand shown to them | US-017 |
| S18 | **Rematch starting** | After the host chooses Play again | Everyone returns to the lobby with the same names and avatars | US-026 |
| S19 | **Error and recovery** | Error boundary | Friendly screen with Try again / Home | US-041 |
| S20 | **Rejoin prompt** | Home | "You're still in room K7M4QX. [Rejoin] [Forget it]" | US-043 |
| S21 | **Offline / asset failure** **[S]** | Any | Message + retry | US-044 |
| S22 | **Connecting / reconnecting** | Any room screen | Connection banner, "Reconnecting… your cards are safe"; actions inert | US-043 |
| S23 | **Player disconnected** | Board, any device | Chip shows "reconnecting"; if it is their turn, the absent-player banner and countdown appear for everyone | US-058 |
| S24 | **Host can skip** | Board, host device | After 60 s: **Keep waiting** and **Skip [Name]** | US-058 |
| S25 | **Host left / host changed** | Lobby or board | "Mia is the new host" (or "The host left, so the room has closed") | US-059 |
| S26 | **Removed from room** | Removed player's device | "The host removed you from the room" with Home | US-055 |
| S27 | **Join errors** | Join screen | Room not found / full / already started / closed / too many attempts | US-006, US-061 |
| S28 | **Room ended** | Any device | "This room has ended" with reason and Home | US-056 |

---

## H. Component Inventory

**Repository evidence:** no existing components or UI libraries. Everything below is *to be created*. If the React stack is chosen, follow the feature-first folder structure and shared `components/common` convention described in `instructions/react/react-archiecture.instructions.md`, and the testing conventions in `instructions/react/react-testing-security.instructions.md` (semantic queries by role/label).

| Component | Responsibility | Responsive / a11y notes | Stories |
| --- | --- | --- | --- |
| **AppShell** | Page frame, routing, skip link, live-region host | Safe areas, `100dvh`; skip link | US-002, US-050 |
| **Button** | Primary / secondary / danger variants with states | ≥ 48 px, full width on mobile, visible focus | all |
| **IconButton** | Menu, Help, Settings, Copy | 48 px, accessible name, tooltip on focus/tap | US-028, US-054 |
| **Dialog** (modal / bottom sheet) | Game menu, confirmations, Boom, See the Future, help | Focus trap and return, Esc, `aria-modal`; sheet on phones | US-028, US-029 |
| **ToastRegion / Announcer** | Visual messages + live-region announcements | Polite, not focus-stealing, ≥ 4 s | US-007, US-040 |
| **Logo / Illustration** | Branding and art (SVG) | Decorative `aria-hidden`; scales | US-001 |
| **CodeInput** | Enter or paste a room code | One field or 6 boxes, uppercase, rejects look-alike characters, error text; announces errors | US-006 |
| **NameBuilder** | Pick a curated nickname from word lists, with Shuffle | Big buttons, live preview, no free text | US-004 |
| **AvatarPicker** | Select one of N avatars | Radio group, text names, taken state | US-004 |
| **ShareRoomPanel** | Show room code; Copy code, Copy link, Share… | Real text code; copy result announced; native share only where supported | US-054 |
| **PlayerList / PlayerListItem** | Joined players, host badge, connection status, Remove (host) | List semantics; status text not colour-only; accessible Remove name | US-055 |
| **ConnectionIndicator / ConnectionBanner** | Show Connecting, Reconnecting, Back online | `role="status"`; icon + text; never blocks the board | US-043 |
| **AbsentPlayerBanner** | "Waiting for Pip…" with countdown; host buttons Keep waiting / Skip | Polite live region; countdown as text | US-058 |
| **RejoinBanner** | Offer to rejoin an active room from Home | Clear Rejoin / Forget actions | US-043 |
| **TurnBanner** | Active player + hint | Polite live announcement; large text | US-007, US-031 |
| **PlayerSeat / PlayerChip** | Avatar, name, card count, status | Scrollable row on phone; status not colour-only | US-007 |
| **Card** | Card face/back, selected, unplayable states | Min size per B6; name + icon + text; button semantics | US-009, US-011 |
| **Hand** | Scroll-snap row of cards with roving tabindex | Arrow-key nav; ≥ 56 px visible width; scroll hints | US-009 |
| **CardDetailPanel** | Name, art, effect, playable status | Collapsible on mobile; read by SR | US-011, US-030 |
| **DeckPile** | Draw pile with count; tappable | Same action as Draw button; label "Draw pile, 12 cards" | US-010, US-012 |
| **DiscardPile** | Top discarded card; empty state | Label "Discard pile, top card See the Future" | US-010 |
| **ActionBar** | Play selected / Draw | Fixed bottom on phones; 56 px | US-011, US-012 |
| **NopeDialog** | Response prompt shown only to players who hold a Nope while a card is waiting | Modal with countdown; Escape = Let it go | US-062 |
| **PeekOverlay** | Private view of top 3 cards on the actor's device | Modal; removes content on close | US-019 |
| **BoomDialog** | Exploding Kitten with/without Defuse | Assertive announcement; focus on primary | US-015, US-017 |
| **ReinsertPicker** | Choose where to put the Exploding Kitten | Radio group with descriptions | US-016 |
| **GameMenu** | Back to game / Rules / Settings / Leave game; host: End game, Remove player | Hides own hand; game continues; Esc closes | US-028 |
| **ConfirmDialog** | Destructive confirmations | Safe default focus | US-028 |
| **RulesTour** | Step-based How to Play | Buttons + swipe; progress text | US-029 |
| **CardGuide** | List of all card types | Searchless, short list | US-030 |
| **CoachMark** **[S]** | First-game hints | Dismissible, never blocks | US-032 |
| **ActionLog** **[S]** | Recent events list | `role="log"`, collapsible on mobile | US-013 |
| **VictoryScreen** | Winner, recap, host next actions or player wait state | Static fallback for celebration | US-025, US-026, US-027 |
| **Celebration / Confetti** | Decorative effect | Disabled for reduced motion; `aria-hidden` | US-025, US-038 |
| **SettingsPanel** | Motion, sound, text size, show tips again | Immediate apply; labelled switches; stored on this device only | US-038, US-039 |
| **LoadingScreen / ErrorScreen** | Loading and recovery | Friendly copy, focusable actions | US-041, US-044 |
| **ErrorBoundary** | Catch render errors | Shows ErrorScreen | US-041 |
| **Tooltip / InfoPopover** | Tap-triggered help | No hover-only; Esc closes | US-030 |

Non-visual modules referenced by the UI (not components): the **game engine** (US-051), the **real-time room server** (US-060), and design tokens (US-050).

---

## I. Design Acceptance Criteria

Observable criteria for developers and testers. Each maps to one or more stories in [user-stories.md](user-stories.md).

| ID | Criterion | Stories |
| --- | --- | --- |
| DAC-01 | Home shows **Create a room**, **Join a room**, **How to Play**, and **Settings**, with Create visually dominant and reachable within 1 tap or Enter key from page load | US-001 |
| DAC-02 | Every screen has Menu/Help (in-game) or Back/Home in a consistent position; browser Back during a game opens the game menu rather than leaving silently | US-002, US-028 |
| DAC-03 | The host can create a room after picking a curated name and an avatar; a player can join from the same identity step; avatars are unique within a room; no free-text name field exists | US-003, US-004, US-006 |
| DAC-04 | After Start, each player holds 1 Defuse plus 4 other cards; the draw pile count matches the deck definition | US-005, US-014 |
| DAC-05 | The active player's name and a one-line hint are visible in the turn banner on every board state, and changes are announced to screen readers | US-007, US-031 |
| DAC-06 | A device never receives or renders another player's hand; the player's own hand is hidden only while the game menu is open; the accessibility tree contains no other player's cards | US-008, US-060 |
| DAC-07 | Selecting a card does not change game state; only **Play** does; selection is shown by raise + check badge + outline (not colour only) | US-011 |
| DAC-08 | Drawing ends the turn; the draw is possible by tapping the deck or pressing **Draw** | US-012 |
| DAC-09 | Deck count and discard top card are visible and update after every action | US-010 |
| DAC-10 | Exploding Kitten with a Defuse: Defuse is consumed, the Exploding Kitten can be placed at Top/Middle/Bottom/Random, and the player stays in | US-015, US-016 |
| DAC-11 | Exploding Kitten without a Defuse: the dialog says the player is out of this round ("nap time"), the seat shows an out marker, and play continues with the remaining players | US-017 |
| DAC-12 | Cat card shows a clear reason on Play attempt and does not change state | US-040 |
| DAC-13 | See the Future shows exactly the top 3 cards (or fewer if the pile is smaller), only after See the Future is played, and hides them on close | US-019 |
| DAC-14 | Last player standing triggers the victory screen on every device; the host sees **Play again** and **Close room**; players see "Waiting for [Host]" and **Leave room**; Play again returns everyone to the lobby with names and avatars kept | US-025–US-027 |
| DAC-15 | The How to Play tour has ≤ 5 steps, is reachable from Home and in-game, and returning from it keeps the game state | US-029, US-031 |
| DAC-16 | Each card type has an info view with ≤ 12 words of effect text, available by tap/keyboard (no hover-only) | US-030 |
| DAC-17 | Leave game, End game for everyone, Remove player, and Close room require confirmation; the safe option is default-focused | US-028, US-055 |
| DAC-18 | At 320 × 568, 390 × 844, 844 × 390, 768 × 1024, 1280 × 800, and 1920 × 1080 there is no horizontal page scroll, no overlapping controls, and all actions reachable | US-033 |
| DAC-19 | All interactive elements are ≥ 48 × 48 px with ≥ 8 px spacing (cards: height ≥ 100 px, visible width ≥ 56 px) | US-034 |
| DAC-20 | A complete game can be played with a keyboard only, with visible focus at all times and no keyboard traps | US-035 |
| DAC-21 | A screen reader announces the turn, card played, card drawn, Boom events, eliminations, and victory | US-036 |
| DAC-22 | Text contrast ≥ 4.5:1, UI/focus ≥ 3:1; automated axe checks report 0 serious/critical violations on all MVP screens | US-037, US-048 |
| DAC-23 | With reduced motion on (OS or in-app), no confetti, shake, or sliding card motion occurs; transitions ≤ 100 ms cross-fade | US-038 |
| DAC-24 | At 200 % browser zoom and 320 px width, content is readable and operable without two-dimensional scrolling (except the hand) | US-033, US-039 |
| DAC-25 | Invalid actions show a friendly inline message and never alter state | US-040 |
| DAC-26 | A simulated render error shows the recovery screen with **Try again** and **Home** (no blank page, no stack trace) | US-041 |
| DAC-27 | First load makes zero third-party requests and sets no cookies; the only data sent to the server is the room code, the curated nickname, the avatar id, and game actions; no personal data is requested | US-042 |
| DAC-28 | LCP ≤ 2.5 s and Lighthouse Performance ≥ 90 on home (proposed budget) | US-049 |
| DAC-29 | After a reload or a short connection loss (≤ 60 s) the same device returns to the same seat with the same hand; a **Rejoin** banner appears on Home when applicable; actions are inert while offline | US-043 |
| DAC-30 | Original art only: no Exploding Kittens logos, artwork, or card text appear in the UI or assets. Card names are the permitted exception | US-050 |
| DAC-31 | The host sees the room code as text with **Copy code**, **Copy link**, and (where supported) **Share…**; each copy action is announced; opening the copied link shows Join with the code prefilled | US-054, US-006 |
| DAC-32 | The lobby lists every joined player with a Host badge and connection status text; **Start game** is enabled only for the host with 2–5 players; **Remove** needs confirmation and the removed player is told | US-055 |
| DAC-33 | Room not found, room full, game already started, room closed, and too many attempts each show a distinct plain-language message and a way back | US-006, US-061 |
| DAC-34 | If it is an absent player's turn, every device shows the absent-player banner with a countdown; after 60 s only the host sees **Keep waiting** and **Skip [Name]** | US-058 |
| DAC-35 | When the host leaves or is gone beyond the window, everyone sees either "[Name] is the new host" or "The host left, so the room has closed" | US-059 |
| DAC-36 | An expired or closed room shows "This room has ended" with a reason and a Home button on every device | US-056 |
| DAC-37 | See the Future results and the Exploding Kitten re-insert position are visible only on the acting player's device | US-016, US-019, US-060 |
| DAC-38 | A public action on one device (card played, draw, elimination) is visible on all other devices within 300 ms (p95) on a typical connection | US-049 |

---

## Appendix — Open design questions

| ID | Question | Default |
| --- | --- | --- |
| UQ-01 | Final avatar cast and art style | Four placeholder SVG cats, upgrade later (OQ-08) |
| UQ-02 | Do we allow drag-and-drop as an optional enhancement? | No for MVP; tap + Play only |
| UQ-03 | Sound design | Deferred; muted by default (OQ-09) |
| UQ-04 | Does the starting player rotate on a rematch? | Yes |
| UQ-05 | Shortcut keys: include or omit? | Include `D`, `P`, `?`, `Esc` if no conflict with WCAG 2.1.4 |
| UQ-06 | High-contrast theme | **[C]**, post-MVP |
| UQ-07 | Show a QR code of the share link in the lobby? | **[C]**, post-MVP (US-053) |
| UQ-08 | Should the room code be shown on the game board for late reference? | Yes, inside the game menu (read-only) |
