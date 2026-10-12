# User Stories — "Whisker Boom" (working title)

| Item | Value |
| --- | --- |
| Status | Draft v0.2 — updated for online rooms (host + players) |
| Last updated | 2026-10-12 |
| Related documents | [Product brief](product-brief.md) (scope, features F-xx) · [UI/UX specification](ui-ux.md) (screens, DAC-xx) |
| Implementation status | **No story is implemented.** The repository contains no application code (see [brief §H](product-brief.md#h-technical-context)). Every story below is *Planned*. |

## How to read this document

- **Priority:** Must / Should / Could map to the MVP scope in the [product brief §D](product-brief.md#d-mvp-scope). **Out-of-scope features have no story** (see the brief's §B2).
- **Rules assumptions:** card behaviour follows the proposed **Family Rules v0** ([brief §C4](product-brief.md#c4-high-level-gameplay-loop-proposed-simplified-ruleset--family-rules-v0)), which is a **product decision, not official rules** (OQ-04). Card counts are tunable.
- **Personas and roles:** *Host* (usually a parent, Priya) and *Player* (any family member, such as Mia, 6–10). A host is also a player. There are no accounts. See [brief §A4](product-brief.md#a4-target-audience-and-personas) and [§A4a](product-brief.md#a4a-roles-no-accounts). *Developer* and *Tester* appear in enabler and quality stories.
- **Online model (v0.2):** every person uses their own device; the host creates a room, gets a **room code** and a **share link**, and sends them to the players. A real-time server holds the game and sends each device only what that player may see.
- **Delivery order:** Epic 10 (Foundation) is delivered first, then Epics 1–5 and 9 for the playable core, then Epics 6–8 hardening (see [brief §J](product-brief.md#j-delivery-roadmap)).
- **Design references:** `DAC-xx` = design acceptance criteria in [ui-ux.md §I](ui-ux.md#i-design-acceptance-criteria). Where a story says "per DAC-xx", those criteria are part of the story's acceptance.
- **Edge cases and negative scenarios** are included in each story's acceptance criteria.

## Epics

| # | Epic | Stories |
| --- | --- | --- |
| 1 | Home and navigation | US-001, US-002 |
| 2 | Rooms and lobby (create, share, join, start) | US-003, US-004, US-005, US-006, US-054, US-055 |
| 3 | Gameplay and turn management | US-007 – US-013 |
| 4 | Cards and game rules | US-014 – US-023 |
| 5 | Victory, leaving, and rematch | US-025 – US-028 |
| 9 | Rules and help | US-029 – US-032 |
| 6 | Responsive UI and accessibility | US-033 – US-039 |
| 7 | Error handling, reliability, connection, and privacy | US-040 – US-045, US-056, US-058, US-059, US-061 |
| 8 | Testing and quality | US-046 – US-049 |
| 10 | Foundation (technical enablers) | US-050, US-051, US-060 |
| — | Could-have backlog | US-023, US-052, US-053 |

---

# Epic 10 — Foundation (technical enablers)

### US-050 — Project scaffold and design tokens

- **Priority:** Must (enabler)
- **Epic:** Foundation
- **User story:** As a developer, I want a runnable web-app scaffold with design tokens, linting, and a test runner, so that features can be built and verified consistently.
- **Context:** The repository has no application code, build configuration, server, or tests. This story is the prerequisite for all others. Stack choice is OQ-07 (proposed: React + TypeScript client and a Node.js + TypeScript server sharing the engine).
- **Acceptance criteria:**
  - Given a fresh clone, when the documented install and start commands are run, then the client and the server both start locally and the client shows a placeholder Home that can reach the server.
  - Given the project, when lint, type-check, and unit-test commands run, then each completes without errors for both client and server (even if only a sample test exists).
  - Given `styles/tokens`, then the colour, typography, spacing, radius, and elevation tokens from [ui-ux.md §B](ui-ux.md#b-design-system) exist as CSS variables.
  - Given fonts are used, then they are self-hosted and **no third-party network request** is made on first load (DAC-27).
  - Given the asset folder, then an `assets/LICENSES.md` records the origin and licence of each asset; no Exploding Kittens artwork, logos, or card text are present; card names are the permitted exception (DAC-30).
  - Negative: Given an unsupported Node/tool version, then the install step fails with a clear message.
- **Dependencies:** OQ-07 decision.
- **Notes:** Follow `instructions/react/*` if React is chosen. Do not install or change anything until this story is scheduled.

### US-051 — Pure game engine module

- **Priority:** Must (enabler)
- **Epic:** Foundation
- **User story:** As a developer, I want the game rules in a UI-independent module with an injectable random source, so that rules can be tested deterministically and the UI stays thin.
- **Context:** Rules correctness is the core risk (R2). The engine runs on the server (authoritative) and in tests, and it decides what each player may see.
- **Acceptance criteria:**
  - Given the engine API, when `createGame(players, rng)` is called with a seeded RNG, then the same seed always produces the same deck order and deal.
  - Given a game state and an action (play card, draw, confirm Boom resolution), when `applyAction(state, action)` is called, then a new state is returned and the input state is not mutated.
  - Given an illegal action (wrong player, card not in hand, not playable), then the engine returns an explicit error result and the state is unchanged.
  - Given any reachable state with ≥ 2 active players, then the draw pile contains at least one Exploding Kitten (invariant).
  - Given no DOM is available (Node test environment), then the engine runs.
  - Given `viewFor(state, playerId)`, then the result contains that player's own hand, the number of cards in other hands, the draw-pile count, the discard pile, whose turn it is, and public flags, and it does **not** contain other hands, the draw-pile order, or other players' private results (See the Future, re-insert position).
- **Dependencies:** US-050.
- **Notes:** Cards and counts are data, not code, so tuning needs no logic change.

### US-060 — Real-time room server (authoritative)

- **Priority:** Must (enabler)
- **Epic:** Foundation
- **User story:** As a developer, I want a server that owns rooms and game state and pushes updates to connected devices, so that players on different devices see a consistent game and cannot see hidden cards.
- **Context:** New in v0.2 because the game is played online. Nothing exists in the repository. F-17, FR-06. Hosting and stack: OQ-07, OQ-20.
- **Acceptance criteria:**
  - Given the server, when a client sends create-room, join-room, start, and game actions over a secure WebSocket, then the server validates each message (schema, sender, room state, turn) and applies it using the engine.
  - Given a state change, then the server sends each connected client **its own** `viewFor` projection within 300 ms (p95) on a local test network.
  - Given a message from a player who is not the sender of record, who is not in the room, or who acts out of turn, then it is rejected with an error code and no state changes.
  - Given duplicate or out-of-order messages (retries after reconnect), then they are ignored safely (idempotent action ids).
  - Given an automated test inspecting every outbound message for each client, then no message contains another player's cards, the draw-pile order, or another player's See the Future result.
  - Given a malformed or oversized message, then the connection is not crashed; the sender gets a generic error.
  - Given the server restarts, then clients receive a "room ended" result when they reconnect (acceptable for MVP).
  - Negative: Given a client tries to set its own role to host or change another player's hand, then the server rejects it.
- **Dependencies:** US-050, US-051.
- **Notes:** State is in memory on a single instance for the MVP (no database). Horizontal scaling is out of scope.

---

# Epic 1 — Home and navigation

### US-001 — Landing screen with clear entry points

- **Priority:** Must
- **Epic:** Home and navigation
- **User story:** As a child player or host, I want a friendly home screen with big **Create a room** and **Join a room** buttons, so that I can start or join a game immediately.
- **Context:** First impression; entry to every journey (J1, J1b, J2). F-01, DAC-01.
- **Acceptance criteria:**
  - Given the app is opened, when Home loads, then I see the title, a **Create a room** button, a **Join a room** button, a **How to Play** button, and a **Settings** button.
  - Given Home, then **Create a room** is the visually dominant control and every button is operable by tap, click, and Enter/Space.
  - Given Home, then the footer states that there is no sign-up, no ads, and that only a nickname is kept for as long as the room is open.
  - Given a phone in portrait (320 px wide), then all four buttons are visible without horizontal scrolling and are ≥ 48 px high.
  - Given this device holds a valid rejoin token for an active room (US-043), then Home also shows the **Rejoin banner** above the buttons.
  - Negative: Given assets fail to load, then text labels and buttons still render (see US-044).
  - Negative: Given the server cannot be reached, then **Create a room** and **Join a room** show a clear "Can't connect right now" message when pressed, while **How to Play** and **Settings** still work.
- **Dependencies:** US-050.
- **Notes:** Logo and illustration are placeholders until OQ-08.

### US-002 — Navigation and back behaviour

- **Priority:** Must
- **Epic:** Home and navigation
- **User story:** As a player, I want to move between Home, Create, Join, Rules, and Settings predictably, so that I never get lost or leave a game by accident.
- **Context:** Children press Back frequently; leaving a shared game by accident affects other people. Share links must open the right screen. F-01, F-10, DAC-02.
- **Acceptance criteria:**
  - Given I am on Create, Join, Rules, or Settings, when I press the on-screen **Back** or the browser Back button, then I return to the previous screen.
  - Given a game is in progress, when I press the browser Back button, then the **game menu** opens instead of leaving the game.
  - Given I open a `/room/:code` URL and this device has no seat in that room, then I am sent to Join with the code prefilled.
  - Given I open `/join/:code` from a share link, then Join opens with the code prefilled (US-006).
  - Given the app is reloaded on `/rules` or `/settings`, then that screen renders correctly.
  - Given any screen, then Menu, Help, or Back controls are in a consistent position.
  - Negative: Given an unknown URL, then a friendly "Page not found" screen offers **Home**.
- **Dependencies:** US-001, US-028.
- **Notes:** Routing library is a stack decision (OQ-07).

---

# Epic 2 — Rooms and lobby

### US-003 — Host creates a room

- **Priority:** Must
- **Epic:** Rooms and lobby
- **User story:** As a host, I want to create a private room, so that my family can join me and play together.
- **Context:** The starting point of the host journey (J1). F-18, FR-03, DAC-03. A room holds at most 4 players (OQ-13).
- **Acceptance criteria:**
  - Given Home, when I press **Create a room** and complete the identity step (US-004), then a room is created and I am in its lobby as the **host** and as a player.
  - Given the room is created, then it has a unique room code (proposed: 6 characters, no look-alike symbols) and a share link (see US-054).
  - Given the Create screen, then it suggests "Ask a grown-up to be the host" but does not block a child (OQ-17).
  - Given I press **Create room** twice quickly, then only one room is created.
  - Given this device already holds a seat in an active room, then Create asks "You're already in room K7M4QX. Rejoin it, or leave it first?" and does not create a second room silently.
  - Given creation fails (server unreachable), then "We couldn't make a room. Try again." is shown with **Try again**, and no partial room remains.
  - Negative: Given the Create screen, then no account, login, email, or age is requested.
- **Dependencies:** US-004, US-060.
- **Notes:** Room timeouts: US-056. Host rules: US-055, US-058, US-059.
### US-004 — Choose a name and avatar

- **Priority:** Must
- **Epic:** Rooms and lobby
- **User story:** As a host or player, I want to pick a fun name and an animal avatar, so that the game feels like mine without sharing personal details.
- **Context:** Names are now shown to other people on other devices, so the MVP uses a curated name builder rather than free text (OQ-14). F-02, F-15, DAC-03.
- **Acceptance criteria:**
  - Given the identity step (shown to the host before creating and to a player before joining), then I choose a name from two curated word lists (for example "Sleepy" + "Biscuit") with a live preview and a **Shuffle names** button; there is no free-text name field.
  - Given I do not choose, then a random valid name is preselected so that **Continue** always works.
  - Given I pick an avatar already taken in this room, then that avatar is disabled with the visible text "taken".
  - Given two players end up with the same name, then the server makes them distinct (for example "Sleepy Biscuit 2") so the lobby and game never show two identical names.
  - Given the avatar list, then each avatar has a text name ("Biscuit the tabby") and is a radio option operable by keyboard.
  - Given the server receives a name part or avatar that is not on the allowed lists, then it rejects the request (server-side validation).
  - Given any screen, then names are rendered as plain text.
  - Negative: Given the identity step, then no email, age, photo, or real-name field is present, and a hint says "Don't use real names".
- **Dependencies:** US-001, US-060.
- **Notes:** The word lists are product content that needs a child-safety review. Free-text names with filtering are a later option.

### US-005 — Start a game and deal cards

- **Priority:** Must
- **Epic:** Rooms and lobby
- **User story:** As a host, I want to start the game when everyone has joined, so that the server shuffles and deals cards fairly and we can all play.
- **Context:** Establishes initial state; F-03, DAC-04. Only the host can start (FR-04).
- **Acceptance criteria:**
  - Given I am the host and 2–4 players are in the lobby, when I press **Start game**, then the room locks, the server builds and deals the deck for the players present, and every device shows its own hand.
  - Given 3 players, then each player holds exactly 1 Defuse and 4 other cards, none of which is an Exploding Kitten or an extra Defuse.
  - Given the deal is complete, then Exploding Kittens (players − 1) and 2 extra Defuse cards are added to the draw pile and it is shuffled by the server.
  - Given the game starts, then every device shows "Everyone has cards! [Name] goes first".
  - Given I press Start twice quickly, then only one game is created.
  - Given any player count (2–4), then no player's initial hand contains an Exploding Kitten.
  - Given a player tries to join at the moment of Start, then they either are in the game or are told "This game has already started", never in a half state.
  - Negative: Given only the host is in the lobby, then **Start game** is disabled with the text "You need at least 2 players".
  - Negative: Given I am a player and not the host, then no Start control is shown, and a start request from my client is rejected by the server.
  - Negative: Given the deck definition cannot supply enough cards for the dealt hands (misconfiguration), then the server fails with a clear error and the room shows the error screen (US-041).
- **Dependencies:** US-055, US-014, US-051, US-060.
- **Notes:** Starting-player choice: random for the first game; rotate on a rematch (UQ-04).

### US-006 — Player joins a room by link or code

- **Priority:** Must
- **Epic:** Rooms and lobby
- **User story:** As a player, I want to join my family's room by tapping a link or typing a code, so that I can play from my own device.
- **Context:** The player journey (J1b). F-19, FR-22, DAC-03, DAC-33.
- **Acceptance criteria:**
  - Given I tap a valid share link, then Join opens with the code prefilled and the text "Joining room K7M4QX"; after I complete the identity step (US-004) I am in the lobby.
  - Given I open **Join a room** from Home and type or paste a valid code, then the same happens. Lower-case letters and surrounding spaces are accepted and normalised.
  - Given I join, then everyone already in the lobby sees "[Name] joined" within 1 s.
  - Given the code is malformed, then the field shows "That code has 6 letters and numbers".
  - Given the room does not exist or has expired, then I see "We can't find that room. Check the code with your host."
  - Given the room already has 4 players, then I see "This room is full".
  - Given the game has already started, then I see "This game has already started. Ask the host to play again."
  - Given the room was closed by the host, then I see "This room has ended".
  - Given this device already holds a seat in an active room, then Join offers to rejoin it instead of creating a second seat.
  - Given a share link carries an invalid code, then Join shows the error and lets me type a different code.
  - Negative: Given too many failed attempts from this device or network (proposed 10 per minute), then I see "Too many tries. Wait a minute and try again." (US-061).
- **Dependencies:** US-003, US-004, US-060.
- **Notes:** The server must not reveal who is in a room before a successful join.

### US-054 — Share the room code and link

- **Priority:** Must
- **Epic:** Rooms and lobby
- **User story:** As a host, I want to copy or share the room code and link in one tap, so that I can quickly invite my family.
- **Context:** The "host gives a code and a shared link to the players" requirement. F-18, FR-03, DAC-31. Who may re-share: OQ-18. Code format and link: OQ-19.
- **Acceptance criteria:**
  - Given I am in the lobby as host, then I see the room code as large readable text and three controls: **Copy code**, **Copy link**, and **Share…** (shown only when the device supports the native share sheet).
  - Given I press **Copy link**, then the clipboard contains `https://<domain>/join/<code>` and "Link copied" is shown and announced to screen readers.
  - Given I press **Share…**, then the native share sheet opens with the link and a short child-safe message ("Join my Whisker Boom game!").
  - Given clipboard access fails, then the code and link are shown selected so they can be copied manually.
  - Given the room is full or the game has started, then the share panel shows "Room full" or "Game in progress" and the link is no longer promoted.
  - Given I am a player (not the host), then I can see the code but the Share controls are not shown (OQ-18).
  - Given the panel, then it shows "Only share this with people you trust."
  - Negative: Given the link is opened after the room expires or closes, then the Join screen shows "This room has ended" (US-056).
  - The link contains only the room code, never a name, an id, or a rejoin token.
- **Dependencies:** US-003.
- **Notes:** A QR code is Could (US-053).

### US-055 — Lobby with host controls

- **Priority:** Must
- **Epic:** Rooms and lobby
- **User story:** As a host, I want to see who has joined and remove anyone who shouldn't be there, so that I stay in control of the room.
- **Context:** Child safety and clarity. F-18, FR-04, FR-23, DAC-17, DAC-32.
- **Acceptance criteria:**
  - Given the lobby, then every device lists each player with avatar, name, a "Host" badge for the host, and a connection status in text ("online" or "reconnecting").
  - Given a player joins or leaves, then the list updates on all devices within 1 s and a polite announcement is made.
  - Given I am the host, then each other player has a **Remove** button; pressing it asks "Remove [Name]?" with **Cancel** (default) and **Remove**.
  - Given I confirm Remove, then that player is taken out of the room, sees "The host removed you from the room" and **Home**, and their seat and avatar become free.
  - Given a removed player uses the same link or code again, then they may rejoin unless the host has locked the room (proposed: a removed device cannot rejoin the same room, see US-061).
  - Given 4 players are present, then the lobby shows "Room full".
  - Given a player presses **Leave room**, then they leave immediately with no confirmation needed in the lobby.
  - Given I am a player (not host), then Start, Remove, and Close room are not shown, and requests for them from my client are rejected by the server.
  - Given I am the host and press **Close room** and confirm, then everyone sees "The host closed the room" and the room is deleted.
  - Negative: Given a game is in progress, then the lobby controls are unavailable and joining is closed.
- **Dependencies:** US-003, US-006, US-060.
- **Notes:** Join approval (host accepts each player) is not in the MVP; the host can remove instead (OQ-18).

---

# Epic 3 — Gameplay and turn management

### US-007 — Show whose turn it is and each player's status

- **Priority:** Must
- **Epic:** Gameplay and turn management
- **User story:** As a child player, I want to see clearly whose turn it is and what to do next, so that I always know how to proceed.
- **Context:** Core clarity requirement. F-04, F-05, DAC-05.
- **Acceptance criteria:**
  - Given it is my turn, then the turn banner reads "[Name], it's your turn!" with the hint "Play a card or tap the deck to draw".
  - Given it is another player's turn, then my banner reads "It's [Name]'s turn".
  - Given the board, then each other player is shown with avatar, name, card count, status (active / waiting / out), and connection status in text.
  - Given the active player changes, then the banner updates on every device and a polite screen-reader announcement is made.
  - Given a player is out, then their chip shows a "zzz" badge and "out" text (not colour only).
  - Given it is not my turn, or my connection is down, then Draw and Play are inert and labelled "Wait for [Name]" or "Reconnecting…".
  - Given 8+ cards in hand and 4 players on 320 px width, then the opponents' row scrolls without covering the banner.
- **Dependencies:** US-005.
- **Notes:** The "×2 turns" badge applies only after US-021.

### US-008 — Private hands on every device

- **Priority:** Must
- **Epic:** Gameplay and turn management
- **User story:** As a player, I want only me to see my cards, so that nobody can learn my hand.
- **Context:** Hidden information is the heart of the game; with one device per player the server enforces it (risk R3). Replaces the v0.1 handoff screen. F-04, FR-06, DAC-06, DAC-37.
- **Acceptance criteria:**
  - Given a game is running, then my device shows my hand, and for every other player only avatar, name, and card count.
  - Given the server sends game state to my device, then the message contains no other player's cards, no draw-pile order, and no other player's private results (an automated test inspects every outbound message, see US-060).
  - Given another player plays See the Future, tucks an Exploding Kitten, or gives me a card (Favor), then I learn only the public facts ("Mia peeked", "Exploding Kitten tucked back in").
  - Given I open the game menu, then my own hand is hidden on my screen while it is open (protects against someone looking over my shoulder or a screen share).
  - Given a screen reader, then no other player's cards exist anywhere in the page or accessibility tree.
  - Given I reconnect (US-043), then I receive only my own hand again.
  - Given a player is eliminated, then their cards are discarded face-up (proposed) and the discard pile updates for everyone.
  - Negative: Given a modified client asks the server for another player's hand, then the request is rejected.
- **Dependencies:** US-007, US-051, US-060.
- **Notes:** Open-hand teaching mode was removed in v0.2 because each person has their own device.

### US-009 — View my hand

- **Priority:** Must
- **Epic:** Gameplay and turn management
- **User story:** As a player, I want to see and scroll through all the cards in my hand, so that I can choose what to play.
- **Context:** F-05, DAC-18, DAC-19.
- **Acceptance criteria:**
  - Given the game is running, then every card in my hand is shown by name, icon, and card type.
  - Given a hand of up to 12 cards on a 320 px-wide screen, then cards are in a horizontally scrollable, scroll-snapping row and each card shows ≥ 56 px of its width with height ≥ 100 px.
  - Given the hand is scrolled, then a "n cards" counter is shown and the selected card remains in view.
  - Given a keyboard, then Left/Right arrows move between cards (roving tabindex).
  - Given an empty hand (possible only in rare edge cases), then the text "No cards. Draw one!" is shown.
  - Given it is another player's turn, then my hand stays visible to me and cards can be inspected, but nothing can be played.
  - Negative: Given another player looks at their own screen, then they cannot see my hand (US-008).
- **Dependencies:** US-008.
- **Notes:** Overlap and size rules per [ui-ux.md §C1](ui-ux.md#c1-layout-matrix).

### US-010 — See the draw pile and discard pile

- **Priority:** Must
- **Epic:** Gameplay and turn management
- **User story:** As a player, I want to see how many cards remain to draw and what was last played, so that I can follow the game.
- **Context:** F-05, DAC-09.
- **Acceptance criteria:**
  - Given the board, then the draw pile shows its card count ("Draw pile, 12 cards") and the discard pile shows the top played card.
  - Given a card is played or drawn, then both counts and the top discard update on every device within 300 ms (p95).
  - Given no card has been played, then the discard pile shows an empty outline "Played cards go here".
  - Given the draw pile contains Exploding Kittens, then their positions are never revealed to players.
  - Negative: Given the draw pile count is 0 while ≥ 2 players remain, then the engine reports an invariant error (it must not happen; see US-046).
- **Dependencies:** US-005.
- **Notes:** None.

### US-011 — Select and play an action card

- **Priority:** Must
- **Epic:** Gameplay and turn management
- **User story:** As a child player, I want to tap a card to see what it does and then confirm playing it, so that I don't play cards by accident.
- **Context:** Two-step select → confirm pattern; F-04, F-06, DAC-07.
- **Acceptance criteria:**
  - Given my turn, when I tap a card, then it is raised with a check badge and the detail panel shows its name, art, and effect sentence; game state is unchanged.
  - Given a card is selected, when I tap it again, press Escape, or tap elsewhere, then it is deselected.
  - Given a playable card is selected, then the primary button reads **Play "[Card]"**.
  - Given I press **Play**, then the request goes to the server; until it confirms, controls are inert (a spinner appears after 1 s); once confirmed the card moves to the discard pile on every device and its effect resolves (Epic 4 stories).
  - Given the server rejects the request (for example the turn changed a moment earlier), then the card stays in my hand and I see "Oops, that was too late. It's [Name]'s turn now."
  - Given I may play multiple action cards, then after a card resolves I can still select another card or draw.
  - Given I press **Play** twice quickly, then the card is played only once.
  - Negative: Given no card is selected, then **Play** is disabled and the hint reads "Pick a card to play, or draw."
  - Negative: Given it is not my turn, then I can still tap a card to read what it does, but **Play** stays disabled with "Wait for [Name]".
- **Dependencies:** US-009, US-051.
- **Notes:** Drag-and-drop is not included (UQ-02).

### US-012 — Draw a card to end the turn

- **Priority:** Must
- **Epic:** Gameplay and turn management
- **User story:** As a player, I want to draw a card to finish my turn, so that the game moves on to the next player.
- **Context:** F-04, DAC-08.
- **Acceptance criteria:**
  - Given my turn, when I tap the draw pile or the **Draw** button, then the top card is added to my hand and I see "You got [Card]".
  - Given the drawn card is not an Exploding Kitten, then my turn ends, the next active player's turn begins on their device, and everyone else sees "[Name] drew a card" without the card.
  - Given the drawn card is an Exploding Kitten, then the Boom resolution applies (US-015, US-017).
  - Given I double-tap Draw, then only one card is drawn.
  - Given it is not my turn, my connection is down, or a dialog is open, then Draw is disabled and inert.
  - Given the server rejects the draw (stale tap), then I see "Oops, that was too late. It's [Name]'s turn now." and no card is drawn.
  - Negative: Given I have just played Skip (US-018), then my turn already ended and I cannot draw.
- **Dependencies:** US-011.
- **Notes:** Drawn cards are shown only to the drawer.

### US-013 — Recent-action message log

- **Priority:** Should
- **Epic:** Gameplay and turn management
- **User story:** As a child player, I want to read what just happened, so that I can follow other players' turns.
- **Context:** Hidden-hand games are hard to follow. F-24.
- **Acceptance criteria:**
  - Given a card is played, then a one-line entry appears ("Pip played Shuffle").
  - Given the log panel is open (side panel on desktop, sheet on mobile), then the last 10 entries are shown, newest first.
  - Given a draw, then the log records "Pip drew a card" without revealing the card.
  - Given a screen reader, then the log is a `role="log"` region and does not duplicate the live announcements.
  - Negative: Given a See the Future, then the log records "Mia peeked" but not the cards seen.
- **Dependencies:** US-011, US-012.
- **Notes:** None.

---

# Epic 4 — Cards and game rules

### US-014 — Build the deck by player count

- **Priority:** Must
- **Epic:** Cards and game rules
- **User story:** As a player, I want the right mix of cards for the number of players, so that the game is balanced and always has an Exploding Kitten to find.
- **Context:** F-03, DAC-04. Counts are proposed (brief §C4) and tunable. Cat cards are played only as a pair (OQ-06 resolved by US-065).
- **Acceptance criteria:**
  - Given the MVP set, then the complete deck is: Skip ×4, See the Future ×4, Shuffle ×4, Cat card ×20 (5 designs × 4, US-065), Defuse ×(players + 2), Exploding Kitten ×(players − 1).
  - Given 2 players, then there is 1 Exploding Kitten; given 4 players, then there are 3.
  - Given the host starts the game with N players in the room, then the deck is built for exactly N players.
  - Given the deck is built, then every card has a unique id and an effect text of ≤ 12 words in the card data.
  - Given Attack and Favor are not yet implemented, then they are absent from the deck (they are added by US-021 and US-022).
  - Given the Cat card, then its card text says it is played as a pair of the same design to take a random card (US-065); a single Cat card is still not playable.
  - Negative: Given a deck configuration with Exploding Kittens ≥ players, then the engine rejects it.
- **Dependencies:** US-051.
- **Notes:** The counts are explicitly open to playtest tuning.

### US-015 — Draw an Exploding Kitten and use a Defuse

- **Priority:** Must
- **Epic:** Cards and game rules
- **User story:** As a player, I want a Defuse to calm an Exploding Kitten I draw, so that I stay in the game.
- **Context:** The signature moment. F-07, DAC-10.
- **Acceptance criteria:**
  - Given I draw an Exploding Kitten and hold ≥ 1 Defuse, then a dialog "Uh-oh, an Exploding Kitten!" shows with the primary **Use Defuse**.
  - Given I press **Use Defuse**, then exactly one Defuse moves to the discard pile, everyone sees "[Name] used a Defuse!", and I proceed to the reinsert step (US-016).
  - Given I hold 2 or more Defuse cards, then only one is consumed.
  - Given the dialog is open, then I cannot dismiss it with Escape or by tapping outside (forced choice).
  - Given a screen reader, then the dialog is announced assertively and focus is on **Use Defuse**.
  - Given my connection drops while the dialog is open, then the server keeps the decision pending, other players see "Waiting for [Name]…" (US-058), and the dialog returns when I reconnect.
  - Negative: Given I do not hold a Defuse, then this dialog is never shown (see US-017).
- **Dependencies:** US-012, US-014.
- **Notes:** Defuse cards cannot be played manually from the hand (see US-040).

### US-016 — Tuck the Exploding Kitten back into the deck

- **Priority:** Must
- **Epic:** Cards and game rules
- **User story:** As a player, I want to choose where to hide the Exploding Kitten, so that the game stays exciting.
- **Context:** F-07, DAC-10.
- **Acceptance criteria:**
  - Given I used a Defuse, then a picker offers **Top**, **Middle**, **Bottom**, and **Random** (default Random), each as a labelled radio option.
  - Given I confirm a position, then the Exploding Kitten is inserted at that position in the draw pile and the draw pile count increases by 1.
  - Given the picker, then the choice goes only to the server and is never shown to others; other players see only "Exploding Kitten tucked back in!".
  - Given the pile is small (e.g. 1 card), then "Middle" is still valid and inserts at the nearest valid position.
  - Given I confirm, then my turn ends and the next player's turn begins on their device.
  - Negative: Given no position is chosen, then the default Random is used rather than blocking.
- **Dependencies:** US-015.
- **Notes:** Mixed with See the Future (US-019), a tucked Top position is knowable by the next drawer; that is intended.

### US-017 — Draw an Exploding Kitten without a Defuse (player is out)

- **Priority:** Must
- **Epic:** Cards and game rules
- **User story:** As a player, I want a gentle, clear message when an Exploding Kitten pops and I have no Defuse, so that being out feels like a nap and not a failure.
- **Context:** F-07, DAC-11, OQ-05.
- **Acceptance criteria:**
  - Given I draw an Exploding Kitten and hold no Defuse, then I see a dialog "Oh no, an Exploding Kitten popped!" with "[Name] is out of this round and gets a nap. Cheer the others on!" and a single **OK** button, and everyone else sees "[Name] is taking a nap".
  - Given I press **OK**, then my hand and the Exploding Kitten move to the discard pile (face-up, proposed), my seat shows the out marker on every device, and play continues with the next active player.
  - Given a player is out, then they are skipped for all future turns.
  - Given only one player remains active, then the game goes to the victory screen (US-025).
  - Given a 2-player game, then the single remaining player wins immediately.
  - The wording never uses "lose", "dead", "die", or violent imagery.
  - Negative: Given an out player, then they cannot draw, play, or be chosen as a target, and the server rejects such requests.
- **Dependencies:** US-012, US-025.
- **Notes:** Out players stay in the room and keep watching; they see the normal board with their seat marked out and no longer receive a hand view.

### US-018 — Skip (skip) card

- **Priority:** Must
- **Epic:** Cards and game rules
- **User story:** As a player, I want to play Skip to skip my draw, so that I can avoid a risky draw.
- **Context:** F-06.
- **Acceptance criteria:**
  - Given I play Skip on my turn, then it moves to the discard pile, my turn ends without drawing, and everyone sees "[Name] hopped over their draw!".
  - Given I have already played other action cards this turn, then Skip still ends the turn without a draw.
  - Given Skip is played, then the next active player's turn begins on their device.
  - Negative: Given a pending "×2" extra turn **[after US-021]**, then Skip ends only one of the pending turns.
- **Dependencies:** US-011.
- **Notes:** Interaction with Attack is defined in US-021.

### US-019 — See the Future (look at the top 3 cards)

- **Priority:** Must
- **Epic:** Cards and game rules
- **User story:** As a player, I want to privately look at the top three cards of the deck, so that I can decide what to do next.
- **Context:** F-06, DAC-13.
- **Acceptance criteria:**
  - Given I play See the Future, then an overlay appears **on my device only**, showing the top 3 cards of the draw pile in order, titled "Your secret peek!".
  - Given the draw pile has fewer than 3 cards, then only the existing cards are shown.
  - Given I press **Got it — hide**, then the overlay closes, the cards are not kept on my device, and the draw pile order is unchanged.
  - Given I peek, then it does not end my turn.
  - Given a screen reader, then the three card names are read in order.
  - Given other players, then they see only "[Name] peeked", and the server sends the three cards to my device only (US-008, US-060).
  - Negative: Given the overlay is open, then Draw and Play controls behind it are inert.
- **Dependencies:** US-011.
- **Notes:** The overlay is the only place deck contents are shown.

### US-020 — Shuffle (shuffle) card

- **Priority:** Must
- **Epic:** Cards and game rules
- **User story:** As a player, I want to shuffle the draw pile, so that nobody can use what they know about the order.
- **Context:** F-06.
- **Acceptance criteria:**
  - Given I play Shuffle, then the server shuffles the draw pile using its random source, the count is unchanged, and everyone sees "Deck shuffled!".
  - Given the shuffle, then my turn continues (I can play another card or draw).
  - Given a seeded random source, then the resulting order is reproducible in tests.
  - Given reduced motion is enabled, then no shuffle animation plays and the toast still appears.
- **Dependencies:** US-011.
- **Notes:** None.

### US-021 — Attack (extra-turn attack) card

- **Priority:** Should
- **Epic:** Cards and game rules
- **User story:** As a player, I want to make the next player take two turns, so that I can pass the danger along.
- **Context:** F-21. Adds tension and turn-stacking rules (OQ-04).
- **Acceptance criteria:**
  - Given I play Attack, then my turn ends without drawing and the next active player has 2 turns to take, shown by a "2 turns" badge on every device.
  - Given I am the target of an extra turn and I play Attack, then my pending turns end and the next player takes 2 turns (not 4).
  - Given I play Skip during a pending extra turn, then only one of my turns is consumed.
  - Given the deck definition, then 4 Attack cards are added to the deck for new games.
  - Negative: Given only 2 players remain, then Attack targets the other player.
- **Dependencies:** US-011, US-018.
- **Notes:** Stacking rules are a product decision.

### US-022 — Favor (favour) card

- **Priority:** Should
- **Epic:** Cards and game rules
- **User story:** As a player, I want to ask a friend to give me a card, so that I can get what I need.
- **Context:** F-22. Needs a target choice and a prompt on another player's device.
- **Acceptance criteria:**
  - Given I play Favor, then I choose one active player with ≥ 1 card using large avatar buttons.
  - Given I choose a friend, then their device shows "[Name] asks you for a card. Pick one to give" with their own hand; when they choose, the card moves to my hand and everyone sees "[Friend] gave [Name] a card" without the card name.
  - Given no other active player has any cards, then the card is blocked with "Nobody has a card to share."
  - Given the friend does not answer because they are absent, then the absent-player rule applies (US-058) and the host can skip them.
  - Negative: Given the friend's only card is a Defuse, then the friend can still choose to give it (no special protection).
  - Negative: Given an out player, then they are not selectable.
- **Dependencies:** US-008, US-011, US-058.
- **Notes:** Friend's choice is private; only the receiver learns the card.

### US-062 — Nope card

- **Priority:** Should
- **Epic:** Cards and game rules
- **User story:** As a player, I want to play a Nope to stop another player's action card, so that I can protect myself or spoil a plan.
- **Context:** F-41. Adds the only out-of-turn interaction in the game, so it needs a short response window (OQ-04).
- **Acceptance criteria:**
  - Given another player plays Skip, See the Future, Shuffle, Attack, or Favor and I hold a Nope, then a "Nope it?" dialog appears on my device showing who played which card, with **Nope!** and **Let it go**, and a visible countdown in seconds.
  - Given I play my Nope, then my Nope goes to the discard pile, everyone sees "[Name] played Nope!", and the stopped card has no effect (it stays in the discard pile and the turn carries on as if it had not been played).
  - Given a Nope was played, then every other player holding a Nope (including the player whose card was stopped) gets the same prompt and can Nope it back; each extra Nope flips the result, so an odd number of Nopes stops the card and an even number lets it through.
  - Given the window closes with no further Nope, then the card takes effect or is stopped and everyone sees the result ("[Name]'s [Card] was stopped!" when stopped).
  - Given nobody else holds a Nope, then the card takes effect immediately and no window opens.
  - Given a player does not answer (slow, absent, or offline), then the server closes the window after the countdown so the game is never held up.
  - Given I do not hold a Nope, then I see "Waiting to see if anyone plays a Nope" and my controls stay inert until the window closes.
  - Given I select a Nope in my hand on my own turn, then it is marked as played in response to another card and Play is disabled with that explanation.
  - Negative: Given a Nope, then it cannot stop an Exploding Kitten draw, a Defuse, or the Exploding Kitten position choice (only action cards).
  - Negative: Given the player whose card is waiting leaves the game, then the card is dropped and the window closes.
  - Negative: Given a player who holds a Nope leaves during the window, then they are removed from the responders and the window closes if nobody is left.
  - Negative: Given a modified client sends a Nope when there is no window or it is not a responder, then the server rejects it with no state change.
- **Dependencies:** [US-011](docs/user-stories/release-1.0.1/US-011-select-and-play-an-action-card.md), [US-058](docs/user-stories/release-1.0.1/US-058-absent-player-during-the-game.md), [US-060](docs/user-stories/release-1.0.1/US-060-real-time-room-server-authoritative.md).
- **Notes:** The window reveals that at least one other player holds a Nope; who holds it stays private. 5 Nope cards are added to the deck in profile `mvp+should`. Bots stop an occasional card and never chain Nopes (US-023).

### US-023 — Bot Buddies fill empty seats

- **Priority:** Could
- **Epic:** Cards and game rules
- **User story:** As a host, I want to add computer-controlled Bot Buddies to the lobby, so that a small family can still have a full game.
- **Context:** Outside the host/player model, so moved from Should to Could in v0.2. F-20, OQ-12 (one gentle difficulty).
- **Acceptance criteria:**
  - Given I am the host in the lobby, when I press **Add Bot Buddy**, then a bot takes a seat (up to 4 total), is labelled "Bot" in text, and counts toward the 2-player minimum.
  - Given a bot's turn, then "[Bot] is thinking…" shows for 0.8–1.5 s, then the bot acts using only legal actions.
  - Given the bot holds Skip and the next card is unknown, then it plays Skip with a fixed probability (proposed 30 %) using the injected random source.
  - Given an Exploding Kitten is drawn with a Defuse, then the bot uses it and tucks the Exploding Kitten in at a random position.
  - Given a bot's actions, then each is announced like a human's.
  - Given a seeded random source, then a simulation of 10,000 all-bot games completes without any illegal action or invariant break.
  - Negative: Given the bot's hand contains only unplayable cards, then it simply draws.
  - Negative: Given the bot decides, then it never reads other players' hands or the draw pile order (no cheating).
  - Negative: Given only bots would remain active, then the game ends with the last human declared the winner or the room waits per US-058.
- **Dependencies:** US-051, US-055, US-060, US-018–US-020.
- **Notes:** Strategy is deliberately simple. Not part of the MVP commitment.

---

# Epic 5 — Victory, leaving, and rematch

### US-025 — Victory screen

- **Priority:** Must
- **Epic:** Victory, leaving, and rematch
- **User story:** As a player, I want a happy celebration when someone wins, so that the game ends on a positive note.
- **Context:** F-08, DAC-14.
- **Acceptance criteria:**
  - Given one active player remains, then the victory screen appears on **every** device showing the winner's avatar and "[Name] wins the round!".
  - Given the screen, then a short recap lists who took naps and a simple stat (turns played, Exploding Kittens defused).
  - Given reduced motion, then a static starburst replaces the confetti.
  - Given a screen reader, then the headline is announced and focus lands on the heading.
  - Given I am the host, then the actions are **Play again** and **Close room**.
  - Given I am a player, then I see "Waiting for [Host] to play again" and **Leave room**.
  - Negative: Given a 4-player game where the last two players are eliminated in quick succession, then exactly one winner is declared.
  - Negative: Given a player is disconnected when the game ends, then they see the same screen when they reconnect (US-043).
- **Dependencies:** US-017.
- **Notes:** The tone must not shame eliminated players.

### US-026 — Host starts a rematch

- **Priority:** Must
- **Epic:** Victory, leaving, and rematch
- **User story:** As a host, I want to play again with the same people in one tap, so that we can keep having fun.
- **Context:** F-08, FR-13.
- **Acceptance criteria:**
  - Given the victory screen, when I (the host) press **Play again**, then everyone still in the room returns to the lobby with the same names and avatars, and I can press **Start game** (US-005).
  - Given a rematch, then the starting player is the next seat after the previous first player.
  - Given the new game, then no state (hands, piles, out markers) leaks from the previous game.
  - Given a player left during or after the last game, then they are not in the new lobby.
  - Given the lobby is open again, then the share link works again until the room is full or started.
  - Negative: Given I am a player (not the host), then there is no **Play again** control and a request from my client is rejected by the server.
- **Dependencies:** US-025, US-005, US-055.
- **Notes:** Starting-player rotation is a proposal (UQ-04).

### US-027 — Leave the room or close it

- **Priority:** Must
- **Epic:** Victory, leaving, and rematch
- **User story:** As a player, I want to leave when I'm done, and as a host I want to close the room, so that nobody is left hanging.
- **Context:** F-08, FR-13.
- **Acceptance criteria:**
  - Given the victory screen, when I press **Leave room**, then I go Home and the other players see "[Name] left the room".
  - Given I am the host and press **Close room** and confirm, then every device shows "The host closed the room" with **Home**, and the room and its data are deleted.
  - Given I leave, then my seat, avatar, and name become free for anyone joining the lobby later.
  - Given I am the host and press **Leave room**, then the host role transfers (US-059).
  - Negative: Given I have left or the room is closed, then my old rejoin token no longer works (US-043).
- **Dependencies:** US-025, US-059.
- **Notes:** None.

### US-028 — Game menu, leave game, and end game with confirmation

- **Priority:** Must
- **Epic:** Victory, leaving, and rematch
- **User story:** As a player, I want a menu where I can get help or leave safely, and as a host I want to end the game for everyone, so that mistakes are reversible and nobody is stuck.
- **Context:** F-10, DAC-17. One person cannot pause an online game for everyone, so the menu covers only that person's screen.
- **Acceptance criteria:**
  - Given a game, when I press **Menu** (or Escape, or browser Back), then a dialog offers Back to game, How to Play, Settings, and **Leave game**; the host also sees **End game for everyone** and **Remove a player**. My hand is hidden while the dialog is open.
  - Given the menu is open, then the game continues for everyone, and if it becomes my turn a "It's your turn!" banner is visible above the dialog.
  - Given I choose **Leave game**, then a confirmation explains "You'll be out of the round and your cards go away. You can't come back to this game." with **Stay** (default focus) and **Leave** (danger); on Leave I go Home, my seat is marked out for the others, and my cards go to the discard pile.
  - Given I am the host and choose **End game for everyone**, then a confirmation explains "Everyone goes back to the lobby and this game is lost." with **Keep playing** (default) and **End game** (danger); on confirm everyone returns to the lobby.
  - Given I am the host and choose **Remove a player** and confirm, then that player is out of the game and the room (as in US-055) and the others see "[Name] was removed".
  - Given I press Escape in the menu, then it closes and I return to the game.
  - Given only one player remains after a leave or removal, then the game ends and the last player wins (US-025).
  - Negative: Given an Exploding Kitten dialog is open (forced choice), then Menu is disabled until it is resolved.
  - Negative: Given I am a player (not host), then End game and Remove a player are not shown, and requests for them are rejected by the server.
- **Dependencies:** US-002, US-005, US-055, US-060.
- **Notes:** Closing or reloading the tab does not leave the game; the device can rejoin (US-043).

---

# Epic 9 — Rules and help

### US-029 — How to Play tour

- **Priority:** Must
- **Epic:** Rules and help
- **User story:** As a first-time player, I want a short illustrated tour of the rules, so that I can learn the game in about two minutes.
- **Context:** F-09, DAC-15.
- **Acceptance criteria:**
  - Given Home or the in-game Help or game menu, when I choose **How to Play**, then a tour of ≤ 5 steps is shown with illustrations, text ≥ 18 px, and "Step n of 5".
  - Given the tour, then I can move with **Next**/**Back** buttons and swipe; no step auto-advances.
  - Given I open the tour mid-game, then the game continues for everyone, and on close I return to the same screen; if it became my turn meanwhile I see the "It's your turn!" banner.
  - Given the tour, then the steps are Goal, Your turn, Exploding Kittens and Defuse cards, Special cards, and Winning.
  - Given I press **Skip** or **Done**, then I return to where I came from.
  - Negative: Given a game is mid-turn, then opening the tour does not reveal my hand to anyone.
- **Dependencies:** US-001, US-028.
- **Notes:** Copy must be reviewed at reading level ≈ age 6–7.

### US-030 — Card guide and per-card help

- **Priority:** Must
- **Epic:** Rules and help
- **User story:** As a child player, I want to see what every card does, so that I can choose with confidence.
- **Context:** F-09, DAC-16.
- **Acceptance criteria:**
  - Given the card guide, then every MVP card type is listed with its art, name, and effect of ≤ 12 words.
  - Given a card in my hand, when I select it, then the same effect text appears in the detail panel (US-011).
  - Given the guide, then no content depends on hover; opening and closing work with tap, click, and keyboard.
  - Given the info popover is open, when I press Escape or tap outside, then it closes.
  - Negative: Given cards not in the MVP (Attack, Favor before US-021/US-022), then they are not listed.
- **Dependencies:** US-014.
- **Notes:** Card text is data driven, so one source feeds the guide, hand, and tests.

### US-031 — Contextual "what now" hints

- **Priority:** Must
- **Epic:** Rules and help
- **User story:** As a first-time player, I want the game to tell me what I can do right now, so that I never feel stuck.
- **Context:** F-09, DAC-05.
- **Acceptance criteria:**
  - Given my turn start, then the hint reads "Play a card or tap the deck to draw".
  - Given I have selected a card, then the hint reads "Tap Play to use [Card]".
  - Given I have just played Shuffle or See the Future, then the hint reads "You can play another card, or draw to end your turn."
  - Given an Exploding Kitten dialog, then the dialog text states the next step.
  - Given the hints, then they are plain text ≤ 12 words and appear in the live region once per change.
  - Negative: Given a hint is displayed, then it does not repeat as an announcement if the content is unchanged.
- **Dependencies:** US-007, US-011.
- **Notes:** Hints are separate from the coach marks of US-032.

### US-032 — Guided first game (coach marks)

- **Priority:** Should
- **Epic:** Rules and help
- **User story:** As a child player, I want gentle tips during my first game, so that I learn without reading the whole rules.
- **Context:** F-23; supports metric M3.
- **Acceptance criteria:**
  - Given it is my first game on this device, then up to 4 tips appear in context (your hand, the deck, selecting a card, Exploding Kittens).
  - Given a tip is shown, then I can dismiss it with a button; tips never block the controls.
  - Given I dismiss or complete the tips, then they do not appear again on this device, and I can re-enable them in Settings.
  - Given reduced motion, then tips appear without animation.
  - Negative: Given local storage is unavailable, then tips are shown each session and no error appears.
- **Dependencies:** US-031.
- **Notes:** Stores only a "tips seen" flag locally.

---

# Epic 6 — Responsive UI and accessibility

### US-033 — Responsive layouts across device classes

- **Priority:** Must
- **Epic:** Responsive UI and accessibility
- **User story:** As a family, I want the game to be comfortable on a phone, tablet, or desktop, so that we can play on whatever device we have.
- **Context:** F-11, DAC-18, DAC-24. Layouts per [ui-ux.md §C](ui-ux.md#c-responsive-behaviour).
- **Acceptance criteria:**
  - Given each of 320 × 568, 390 × 844 (mobile portrait), 844 × 390 (mobile landscape), 768 × 1024 (tablet), 1280 × 800, and 1920 × 1080 (desktop), then each screen has no horizontal page scroll (the hand excluded), no overlapping controls, and all actions are reachable.
  - Given I rotate a phone mid-game, then the game state, selected card, and open dialogs are preserved.
  - Given 200 % browser zoom, then all content remains readable and operable.
  - Given a mobile browser with dynamic toolbars, then the action bar and hand are not hidden by them (dynamic viewport height and safe-area insets).
  - Given dialogs, then they appear as bottom sheets on mobile portrait and centred modals on tablet and desktop.
  - Negative: Given a viewport shorter than 360 px, then the board scrolls vertically; it does not show a "please rotate" blocker.
- **Dependencies:** US-050 and the screen stories.
- **Notes:** Browser support per brief §F.

### US-034 — Touch, mouse, and keyboard parity with large targets

- **Priority:** Must
- **Epic:** Responsive UI and accessibility
- **User story:** As a child with small hands, I want big targets I can tap easily, so that I don't make mistakes.
- **Context:** F-11, F-12, DAC-19.
- **Acceptance criteria:**
  - Given any interactive element, then its tap area is ≥ 48 × 48 CSS px, with ≥ 8 px between adjacent targets; primary actions are 56 px high.
  - Given any action, then it can be performed without hover, long-press, drag, or multi-finger gestures.
  - Given a touch device, then tapping does not trigger double-tap zoom on game controls.
  - Given a pointer device, then hover effects exist but no information appears only on hover.
  - Negative: Given a card in the hand at minimum size, then its visible width is ≥ 56 px.
- **Dependencies:** US-009.
- **Notes:** Exceeds the WCAG 2.5.8 minimum.

### US-035 — Keyboard operation and visible focus

- **Priority:** Must
- **Epic:** Responsive UI and accessibility
- **User story:** As a player using a keyboard, I want to play the entire game without a mouse, so that I can play comfortably.
- **Context:** F-12, DAC-20.
- **Acceptance criteria:**
  - Given a keyboard, then I can complete the journey Home → Create or Join → lobby → full game → Victory using only Tab, Shift+Tab, arrows, Enter, Space, and Escape.
  - Given any focused element, then a visible focus ring (≥ 3:1, ≥ 2 px) is shown and is not hidden by fixed bars.
  - Given a dialog opens, then focus moves into it and is trapped; when it closes, focus returns to the control that opened it.
  - Given the hand, then Left/Right arrows move between cards and Enter/Space selects.
  - Given any shortcut keys are implemented (UQ-05), then they are inactive inside text fields and are documented in Help.
  - Negative: Given any screen, then there are no keyboard traps outside dialogs.
- **Dependencies:** US-009, US-011.
- **Notes:** None.

### US-036 — Screen-reader support

- **Priority:** Must
- **Epic:** Responsive UI and accessibility
- **User story:** As a player who uses a screen reader, I want the game's events announced, so that I know what is happening.
- **Context:** F-12, DAC-21.
- **Acceptance criteria:**
  - Given a screen reader, then each screen has a main heading, landmarks, and `lang="en"`.
  - Given a card, then its accessible name includes its name, type, effect, and selected state.
  - Given a join, a leave, a turn change, another player's card played or drawn, a Boom event, an elimination, a connection change, or the winner, then a concise announcement is made in a polite live region (assertive only for Boom dialogs).
  - Given the game menu is open, then my own hand is not available in the accessibility tree, and other players' hands never are (US-008).
  - Given the room code in the lobby, then it is read letter by letter, and the result of Copy code or Copy link is announced.
  - Given the See the Future overlay, then the three cards are read in order.
  - Negative: Given the same message is repeated, then it is not announced twice.
- **Dependencies:** US-007, US-011.
- **Notes:** Manual verification: NVDA, VoiceOver, TalkBack.

### US-037 — Colour independence and contrast

- **Priority:** Must
- **Epic:** Responsive UI and accessibility
- **User story:** As a player with colour-vision difference or low vision, I want clear contrast and non-colour cues, so that I can read the game.
- **Context:** F-12, DAC-22.
- **Acceptance criteria:**
  - Given any text, then the contrast ratio is ≥ 4.5:1 (≥ 3:1 for large text); UI components and focus indicators ≥ 3:1.
  - Given active player, selected card, playable/unplayable, out, and error states, then each is indicated by an icon or text in addition to colour.
  - Given card types, then each has a distinct icon silhouette and visible label.
  - Given text on illustrations, then it sits on a solid plate.
  - Negative: Given the page in greyscale, then every state remains distinguishable.
- **Dependencies:** US-050.
- **Notes:** High-contrast theme is Could (F-35).

### US-038 — Settings: reduced motion and sound

- **Priority:** Must
- **Epic:** Responsive UI and accessibility
- **User story:** As a parent, I want to calm motion and control sound, so that the game is comfortable for my child.
- **Context:** F-13, DAC-23.
- **Acceptance criteria:**
  - Given the OS has "reduce motion" on, then the app starts with reduced motion on; I can override it in Settings.
  - Given reduced motion is on, then there are no confetti, sliding, shaking, or shuffle animations; state changes cross-fade in ≤ 100 ms or are immediate.
  - Given Settings, then a **Sound** toggle is shown and defaults to off (disabled with a note "Coming soon" until sound exists).
  - Given I change a setting, then it applies immediately and persists locally.
  - Given Settings is opened mid-game from the game menu, then the game continues for everyone and nothing changes when I return.
  - Negative: Given local storage is unavailable, then settings apply for the session and no error appears.
- **Dependencies:** US-001.
- **Notes:** No flashing more than 3 times per second.

### US-039 — Text size setting

- **Priority:** Should
- **Epic:** Responsive UI and accessibility
- **User story:** As a grandparent, I want to make the text bigger, so that I can read it comfortably.
- **Context:** F-26, DAC-24.
- **Acceptance criteria:**
  - Given Settings, then I can choose 100 %, 125 %, or 150 % text size.
  - Given 150 %, then no text is clipped or overlapped on the board at 390 × 844 and 1280 × 800.
  - Given the setting, then it persists locally and applies on all screens.
  - Negative: Given 150 % and 8 cards in hand, then the hand still scrolls and the Play and Draw buttons stay reachable.
- **Dependencies:** US-038.
- **Notes:** None.

---

# Epic 7 — Error handling, reliability, connection, and privacy

### US-040 — Invalid-action feedback

- **Priority:** Must
- **Epic:** Error handling, reliability, connection, and privacy
- **User story:** As a child player, I want a friendly reason when something can't be done, so that I can fix it and carry on.
- **Context:** F-14, DAC-12, DAC-25. See [ui-ux.md §E6](ui-ux.md#e6-invalid-actions-and-error-recovery).
- **Acceptance criteria:**
  - Given I select Cat card and press Play, then the message "Cat cards are played in pairs. Tap a second matching Cat card!" appears, and the game state is unchanged.
  - Given I select a Defuse in hand, then Play is disabled and the detail panel says "Defuse cards save you automatically when an Exploding Kitten shows up."
  - Given it is not my turn or my connection is down, then Play and Draw are inert and labelled with the reason ("Wait for [Name]" or "Reconnecting…").
  - Given the server rejects an action (for example a stale tap just after the turn changed), then the state is unchanged and I see "Oops, that was too late. It's [Name]'s turn now."
  - Given any invalid action, then the message appears next to the control, is available to screen readers, and clears after 5 s or on the next interaction.
  - Given the engine returns an illegal-action error, then the UI shows "That move didn't work. Try something else." and the state stays unchanged.
  - Negative: Given a message, then it is never red-only and never blames the player.
- **Dependencies:** US-011, US-051.
- **Notes:** None.

### US-041 — Unexpected-error recovery

- **Priority:** Must
- **Epic:** Error handling, reliability, connection, and privacy
- **User story:** As a parent, I want a friendly recovery screen if something breaks, so that my child isn't left with a blank page.
- **Context:** F-14, DAC-26.
- **Acceptance criteria:**
  - Given an unhandled render or engine error, then a recovery screen shows "Oops, something went wrong." with **Try again** and **Back to home**; no stack trace is displayed.
  - Given I press **Try again**, then the app attempts to rejoin my seat in the room (US-043), or returns Home if I have no seat.
  - Given the error, then it is logged to the browser console only; no names or game content are sent anywhere.
  - Negative: Given repeated failures (3 within 1 minute), then **Try again** is replaced by **Back to home** to avoid a loop.
- **Dependencies:** US-050.
- **Notes:** Verified with a deliberately injected error in tests.

### US-042 — Privacy by default

- **Priority:** Must
- **Epic:** Error handling, reliability, connection, and privacy
- **User story:** As a parent, I want assurance that only the minimum is collected and that it disappears when the game ends, so that I can trust the game with my child.
- **Context:** F-15, DAC-27; OQ-10. In v0.2 nicknames and avatars reach a server, so privacy is a launch gate.
- **Acceptance criteria:**
  - Given a first page load, then no third-party requests are made, no cookies are set, and no analytics scripts run.
  - Given the app, then no account, email, age, location, microphone, camera, or notification permission is requested.
  - Given I create or join a room, then the only data sent to the server is the room code, the curated name parts, the avatar id, a random rejoin token, and game actions.
  - Given the server, then room data (names, avatars, game state) is held in memory only, never written to a database or disk, and is deleted when the room closes or expires (US-056).
  - Given server and hosting logs, then they contain no names and no game content, and IP addresses are retained for at most 7 days (proposed).
  - Given a production build, then it is served over HTTPS and WSS with a Content-Security-Policy that blocks inline script and third-party origins.
  - Given the footer, then a plain-language **Privacy** page states exactly what is kept and for how long.
  - Negative: Given another player, then they cannot see my IP address, device details, or anything beyond my name and avatar.
  - Negative: Given the dependency list, then no tracking or advertising SDK is included.
- **Dependencies:** US-050, US-056, US-060.
- **Notes:** Legal review of child-privacy requirements is a launch gate (OQ-10). Re-review before adding any analytics.

### US-043 — Reconnect and rejoin my seat

- **Priority:** Must
- **Epic:** Error handling, reliability, connection, and privacy
- **User story:** As a player, I want my device to rejoin my seat automatically after a connection drop or reload, so that a bad signal doesn't end my game.
- **Context:** F-40, FR-21, DAC-29, M12. Phones sleep, tabs reload, and mobile networks drop. Replaces the v0.1 "resume saved game" story.
- **Acceptance criteria:**
  - Given I create or join a room, then my device stores a random rejoin token in session storage; the token never appears in a URL or share link.
  - Given my connection drops, then a banner shows "Reconnecting… your cards are safe", Play and Draw are inert, and the app retries automatically with back-off.
  - Given I reconnect within 60 s, then I return to the same seat with my current hand and the latest state, and the banner shows "Back online".
  - Given I reload the page or reopen the tab in the same browser session while the room exists, then Home or the room URL shows **Rejoin** and returns me to my seat.
  - Given I open the share link on a device that already holds my seat, then Join offers **Rejoin** instead of a new seat.
  - Given the token is invalid, the seat was removed, or the room has ended, then I see "We couldn't find your seat" with **Home**, and no room data is revealed.
  - Given the same token is used from a second device or tab, then the newest connection takes over and the older one shows "You joined from another device".
  - Given I was away longer than 60 s and the host skipped me (US-058), then I rejoin as an out player and can keep watching.
  - Negative: Given session storage is unavailable, then rejoin is not possible and a plain message says so.
- **Dependencies:** US-006, US-060.
- **Notes:** The 60 s window is proposed (OQ-15).

### US-044 — Loading and asset-failure handling

- **Priority:** Should
- **Epic:** Error handling, reliability, connection, and privacy
- **User story:** As a player on a slow connection, I want to see that the game is loading and recover if an image fails, so that the game remains usable.
- **Context:** F-27.
- **Acceptance criteria:**
  - Given loading takes > 300 ms, then a loading screen with "Getting the cards ready…" is shown; faster loads show none.
  - Given a card image fails to load, then the card still shows its name, type text, and a fallback icon.
  - Given the network drops mid-game, then the connection banner appears (US-043) and the already-loaded screen stays usable for reading.
  - Given the initial bundle fails to load, then a plain-HTML message with a **Reload** link is shown.
  - Negative: Given reduced motion is on, then the loading spinner is static.
- **Dependencies:** US-050.
- **Notes:** Offline installable PWA is Could (F-36).

### US-045 — Unsupported browser notice

- **Priority:** Could
- **Epic:** Error handling, reliability, connection, and privacy
- **User story:** As a parent using an old browser, I want a clear message if the game can't run, so that I know what to do.
- **Context:** Browser support per brief §F.
- **Acceptance criteria:**
  - Given a browser lacking required features, then a plain message lists supported browsers and shows no broken UI.
  - Given a supported browser, then the message never appears.
- **Dependencies:** US-050.
- **Notes:** Low priority; depends on browser targets.

### US-056 — Room lifetime and data deletion

- **Priority:** Must
- **Epic:** Error handling, reliability, connection, and privacy
- **User story:** As a parent, I want rooms to expire and be deleted automatically, so that nothing about my child's game lingers.
- **Context:** F-18, F-15, FR-26, DAC-36, M7. Timeouts are proposed (OQ-15).
- **Acceptance criteria:**
  - Given a room in the lobby with no activity for 30 min, a game with no actions for 30 min, a finished room for 15 min, or any room older than 3 h, then the room expires.
  - Given a room expires or the host closes it, then the server deletes all its data, invalidates the room code, share link, and rejoin tokens, and every connected device shows "This room has ended" with the reason when known and a **Home** button.
  - Given a code was used by a closed or expired room, then it is not issued again for at least 24 h.
  - Given 2 minutes before an idle expiry, then everyone sees "This room will close soon. Tap anywhere to keep it open."
  - Given the server restarts, then every room ends and reconnecting devices see "This room has ended".
  - Negative: Given someone opens a share link for an expired or closed room, then Join shows "This room has ended" and reveals nothing else.
- **Dependencies:** US-060.
- **Notes:** Verified with accelerated-clock tests.

### US-058 — Absent player during the game

- **Priority:** Must
- **Epic:** Error handling, reliability, connection, and privacy
- **User story:** As a player, I want the game to wait briefly for someone whose connection dropped and let the host move on if they don't return, so that the game doesn't stall forever.
- **Context:** F-40, FR-24, DAC-34, R12. Waiting is never shamed (ui-ux §F9).
- **Acceptance criteria:**
  - Given a player loses connection, then their chip shows "reconnecting" on every device.
  - Given it is not their turn and no decision of theirs is pending, then the game continues normally.
  - Given it is their turn, or a decision of theirs is pending (Exploding Kitten dialog, Favor), then everyone sees "Waiting for [Name] to come back…" with a 60 s countdown shown as text, and the game waits.
  - Given they reconnect within 60 s, then play resumes exactly where it stopped.
  - Given 60 s pass, then the host sees **Keep waiting** and **Skip [Name]**; other players see "Waiting for the host to decide".
  - Given the host chooses **Skip [Name]**, then that player is out (their cards go to the discard pile, and a pending Exploding Kitten counts as a pop), everyone sees "[Name] was skipped", and play continues; if one player remains, they win (US-025).
  - Given the host chooses **Keep waiting**, then the countdown restarts for 60 s and the host is asked again.
  - Given the absent player is the host, then US-059 applies.
  - Negative: Given a player who is not the host, then no skip control is shown and a skip request from their client is rejected by the server.
- **Dependencies:** US-043, US-060, US-017.
- **Notes:** A configurable wait time is a later option (OQ-15).

### US-059 — Host leaves or disconnects

- **Priority:** Must
- **Epic:** Error handling, reliability, connection, and privacy
- **User story:** As a player, I want the room to keep working if the host leaves, so that the family's game doesn't end suddenly.
- **Context:** F-40, FR-25, DAC-35, R14. Transfer versus close is OQ-16 (proposed: transfer).
- **Acceptance criteria:**
  - Given the host loses connection, then everyone sees "[Host] lost connection" and the game continues (unless it is the host's turn, then US-058 applies); the host keeps host rights if they return within 60 s.
  - Given the host leaves on purpose or stays away beyond 60 s, then the host role passes to the longest-present connected player and everyone sees "[Name] is the new host".
  - Given the host role changes, then the new host gets the host controls (Start, Remove, End game, Skip, Play again, Close room, Share) on their next screen update, and the old host becomes a normal player if they return.
  - Given no connected player remains for 60 s, then the room closes (US-056).
  - Given the host leaves while in the lobby, then the same rules apply and the lobby keeps working.
  - Negative: Given any moment, then there is exactly one host, enforced by the server.
  - Negative: Given a player's client claims to be the host, then the server rejects it.
- **Dependencies:** US-055, US-043, US-060.
- **Notes:** If product prefers closing the room when the host leaves, only the second criterion changes.

### US-061 — Room-code security and abuse protection

- **Priority:** Must
- **Epic:** Error handling, reliability, connection, and privacy
- **User story:** As a parent, I want strangers to be unable to guess or flood our room, so that my child plays only with people I invited.
- **Context:** F-15, FR-26, DAC-33, R10, OQ-19. The link and code are the only access control, so they must resist guessing.
- **Acceptance criteria:**
  - Given a new room, then its code comes from a cryptographically secure random generator over about 30 symbols without look-alike characters (proposed: 6 characters) and is unique among active and recently closed rooms.
  - Given repeated failed joins from one device or network (proposed 10 per minute), then further attempts are blocked for a minute with "Too many tries. Wait a minute and try again."
  - Given a failed join, then the message and response time do not reveal whether a code is close to a real one.
  - Given a room is full or started, then the server rejects joins regardless of what the client claims.
  - Given a player was removed by the host, then that device cannot rejoin the same room for its lifetime.
  - Given any WebSocket connection, then message size and rate are limited, every message is schema-validated, and unknown fields are ignored.
  - Given one network address, then the number of active rooms it can create is limited (proposed 5).
  - Given automated security tests, then they cover code enumeration, tampered messages, role spoofing, and replayed or stolen rejoin tokens.
  - Negative: Given a link or code is posted publicly, then the worst case is that someone enters a lobby that has not started; the host can remove them, and nobody can join once the game starts.
- **Dependencies:** US-060, US-055.
- **Notes:** Join approval by the host is not in the MVP (OQ-18).

---

# Epic 8 — Testing and quality

### US-046 — Engine unit and simulation tests

- **Priority:** Must
- **Epic:** Testing and quality
- **User story:** As a tester, I want automated tests for every rule, so that rule changes cannot silently break the game.
- **Context:** F-16, M8.
- **Acceptance criteria:**
  - Given the engine, then each MVP card behaviour, the deal, the draw, Boom with Defuse, Boom without a Defuse, elimination, and victory have at least one passing unit test.
  - Given a seeded random source, then 10,000 simulated games (2–4 players, random legal actions) finish with no illegal state, and the invariant "draw pile has ≥ 1 Exploding Kitten while ≥ 2 players remain" holds after every action.
  - Given illegal actions (wrong player, missing card, playing Cat card, drawing when out), then each returns an error and leaves the state unchanged.
  - Given the server, then automated tests cover the room lifecycle, join limits, host-only actions, host transfer, reconnect, absent-player skip, and expiry (US-055, US-056, US-058, US-059).
  - Given every outbound message for every client in simulated games, then no message contains another player's cards, the draw-pile order, or another player's private results (US-008, US-060).
  - Given the CI run, then engine branch coverage is ≥ 90 %.
  - Negative: Given a deliberately broken rule (mutation spot-check), then at least one test fails.
- **Dependencies:** US-051, US-060.
- **Notes:** Targets are proposed.

### US-047 — Multi-device end-to-end tests (host and players)

- **Priority:** Must
- **Epic:** Testing and quality
- **User story:** As a tester, I want automated browser tests where a host and players each use their own browser session, so that regressions in rooms, real-time play, and reconnection are caught before release.
- **Context:** F-16, M4, M11, M12. The repository's testing instructions specify Playwright with the Page Object Model (`instructions/testing/copilot-instructions.md`); Playwright supports several browser contexts in one test.
- **Acceptance criteria:**
  - Given a test with a host and 2 players in three separate browser contexts and a seeded random source, then the scripted journey runs: host creates a room, copies the link, players open the link and join, host starts, the game is played to a winner, and the host starts a rematch.
  - Given the run, then it covers See the Future, Skip, Shuffle, an Exploding Kitten defused, an Exploding Kitten elimination, the game menu, Leave game, and Play again.
  - Given the host runs at 1280 × 800 and the players at 390 × 844 and 768 × 1024 (and a landscape 844 × 390 variant), then every step passes.
  - Given a simulated offline period of 20 s for one player, then that player rejoins the same seat with the same hand; given 70 s on that player's turn, then the host's **Skip** option appears (US-058).
  - Given the join error cases (wrong code, full room, started game, closed room), then each shows its expected message.
  - Given the tests, then they use roles and labels (not CSS selectors) and Page Objects, and they run in any order.
  - Given a failure, then screenshots and traces for every context are stored as artifacts.
  - Negative: Given a keyboard-only variant for one player, then the same journey completes (supports US-035).
- **Dependencies:** US-033, US-025, US-043, US-058, US-060.
- **Notes:** Requires a deterministic RNG and a short-timeout switch that are not exposed in production builds.

### US-048 — Automated accessibility checks

- **Priority:** Should
- **Epic:** Testing and quality
- **User story:** As a tester, I want automated accessibility scans, so that obvious issues are caught on every change.
- **Context:** F-28, M6, DAC-22. Manual checks follow `.github/skills/testing-accessibility-testing/`.
- **Acceptance criteria:**
  - Given each MVP screen and dialog, then an automated accessibility scan reports 0 serious or critical violations.
  - Given the CI pipeline, then a failing scan fails the build.
  - Given the manual checklist (keyboard, NVDA, VoiceOver, TalkBack, 200 % zoom), then results are recorded before each release.
  - Negative: Given a newly introduced low-contrast colour, then the scan fails.
- **Dependencies:** US-047.
- **Notes:** Automated tools find only part of the issues; the manual pass remains required.

### US-049 — Performance budget check

- **Priority:** Should
- **Epic:** Testing and quality
- **User story:** As a parent on a mid-range phone, I want the game to load quickly, so that my child doesn't wait.
- **Context:** F-28, M5, DAC-28, DAC-38.
- **Acceptance criteria:**
  - Given a production build, then the initial JS ≤ 200 KB gzip, and Lighthouse reports Performance ≥ 90 and LCP ≤ 2.5 s on a mobile profile for Home.
  - Given a load test with 4-player rooms, then an action on one device updates all other devices within 300 ms (p95) at 200 concurrent rooms on the proposed single server instance.
  - Given the server under that load, then memory and CPU stay within the limits agreed with operations (OQ-20) and no room is dropped.
  - Given card animations, then they run on transform/opacity only and do not drop below 50 fps on a mid-range device profile.
  - Given the CI, then exceeding the budget fails the check.
  - Negative: Given a large image is added, then the budget check flags it.
- **Dependencies:** US-050, US-060.
- **Notes:** Budgets are proposed with no baseline; revisit after the first build.

---

# Could-have backlog (not committed for MVP)

### US-052 — Sound effects (muted by default)

- **Priority:** Could
- **Epic:** Responsive UI and accessibility
- **User story:** As a child player, I want fun sounds, so that the game feels alive.
- **Context:** F-30, OQ-09.
- **Acceptance criteria:**
  - Given Settings, when I turn Sound on, then short effects play for draw, play, Boom, and victory at a low default volume.
  - Given Sound is off (default), then no audio plays and no audio is preloaded.
  - Given a browser autoplay restriction, then audio starts only after a user gesture.
  - Negative: Given any sound, then the same information is also given visually and in text.
- **Dependencies:** US-038.
- **Notes:** Needs original or licensed audio.

### US-053 — QR code for joining a room

- **Priority:** Could
- **Epic:** Rooms and lobby
- **User story:** As a host, I want a QR code for the room link, so that people sitting nearby can join by scanning it.
- **Context:** F-32, UQ-07.
- **Acceptance criteria:**
  - Given I am the host in the lobby, when I press **Show QR code**, then a QR code of the share link is shown with the room code below it as text.
  - Given the QR code is shown, then it is generated on the device without a third-party service.
  - Given the room is full or the game has started, then the QR code is hidden.
  - Negative: Given a screen reader, then the QR code has the text alternative "QR code for joining room K7M4QX" and the same information is available as text.
- **Dependencies:** US-054.
- **Notes:** Other Could items (interrupt card, best-of-N, read-aloud, high-contrast theme, PWA, preset reactions, single-device pass-and-play) are listed in the brief §D1 and §B3 and are not yet storied. Bot Buddies are US-023.

---

# Coverage matrix (MVP features → stories)

Every **Must** feature has at least one story.

| Feature | Priority | Stories | Covered |
| --- | --- | --- | --- |
| F-01 Landing and navigation | Must | US-001, US-002 | Yes |
| F-02 Player identity (curated name, avatar) | Must | US-004 | Yes |
| F-03 Deck and dealing | Must | US-005, US-014 | Yes |
| F-04 Turn management and private hands per device | Must | US-007, US-008, US-011, US-012 | Yes |
| F-05 Hand, deck, discard display | Must | US-009, US-010 | Yes |
| F-06 Core cards | Must | US-014 (Cat card), US-018, US-019, US-020, US-040 | Yes |
| F-07 Exploding Kitten / Defuse / elimination | Must | US-015, US-016, US-017 | Yes |
| F-08 Victory and host-led rematch | Must | US-025, US-026, US-027 | Yes |
| F-09 Rules and contextual help | Must | US-029, US-030, US-031 | Yes |
| F-10 Game menu: leave game, host ends game | Must | US-028 | Yes |
| F-11 Responsive layouts | Must | US-033, US-034 | Yes |
| F-12 Accessibility baseline | Must | US-035, US-036, US-037 | Yes |
| F-13 Settings (motion, sound) | Must | US-038 | Yes |
| F-14 Invalid action and error recovery | Must | US-040, US-041 | Yes |
| F-15 Privacy and room safety | Must | US-042, US-056, US-061 | Yes |
| F-16 Automated tests | Must | US-046, US-047 | Yes |
| F-17 Scaffold, shared engine, real-time room server | Must (enabler) | US-050, US-051, US-060 | Yes |
| F-18 Rooms: create, share code and link, lobby, expiry | Must | US-003, US-054, US-055, US-056 | Yes |
| F-19 Join a room via link or code | Must | US-006 | Yes |
| F-40 Connection resilience: rejoin, absent player, host leaves | Must | US-043, US-058, US-059 | Yes |
| F-21 Attack | Should | US-021 | Yes |
| F-22 Favor | Should | US-022 | Yes |
| F-41 Nope | Should | US-062 | Yes |
| F-23 Guided first game | Should | US-032 | Yes |
| F-24 Action log | Should | US-013 | Yes |
| F-26 Text size | Should | US-039 | Yes |
| F-27 Loading and asset failure | Should | US-044 | Yes |
| F-28 Automated a11y and performance | Should | US-048, US-049 | Yes |
| F-20 Bot Buddies | Could | US-023 | Yes |
| F-30, F-32 Sound; QR code for joining | Could | US-052, US-053 | Yes |
| F-29 Unsupported-browser notice | Could | US-045 | Yes |
| F-31, F-33–F-36 Other Could items | Could | — | Not yet storied (intentional) |

> Note: US-024 is intentionally unassigned (reserved), and US-057 is also unused; story IDs are stable and are not renumbered.

## Story-to-design cross-reference (DAC)

| DAC | Stories | DAC | Stories |
| --- | --- | --- | --- |
| DAC-01 | US-001 | DAC-16 | US-030 |
| DAC-02 | US-002, US-028 | DAC-17 | US-028, US-055 |
| DAC-03 | US-003, US-004, US-006 | DAC-18 | US-033 |
| DAC-04 | US-005, US-014 | DAC-19 | US-034 |
| DAC-05 | US-007, US-031 | DAC-20 | US-035 |
| DAC-06 | US-008, US-060 | DAC-21 | US-036 |
| DAC-07 | US-011 | DAC-22 | US-037, US-048 |
| DAC-08 | US-012 | DAC-23 | US-038 |
| DAC-09 | US-010 | DAC-24 | US-033, US-039 |
| DAC-10 | US-015, US-016 | DAC-25 | US-040 |
| DAC-11 | US-017 | DAC-26 | US-041 |
| DAC-12 | US-040 | DAC-27 | US-042, US-050 |
| DAC-13 | US-019 | DAC-28 | US-049 |
| DAC-14 | US-025, US-026, US-027 | DAC-29 | US-043 |
| DAC-15 | US-029, US-031 | DAC-30 | US-050 |
| DAC-31 | US-054, US-006 | DAC-32 | US-055 |
| DAC-33 | US-006, US-061 | DAC-34 | US-058 |
| DAC-35 | US-059 | DAC-36 | US-056 |
| DAC-37 | US-016, US-019, US-060 | DAC-38 | US-049 |

---

# Definition of Done

A story is **Done** when all applicable items are met:

**Implementation**
- [ ] Acceptance criteria are met, including negative and edge cases.
- [ ] Code follows the project's conventions (for React: `instructions/react/*`) and passes lint and type checks.
- [ ] Game rules live in the engine module, not the UI components.
- [ ] No Exploding Kittens artwork, logos, or card text; asset licences recorded. Card names are the permitted exception.
- [ ] Reviewed by another developer (see the `code-review` skill).

**Testing**
- [ ] Unit tests added or updated (engine: branch coverage not reduced).
- [ ] Component tests use semantic queries (role, label).
- [ ] E2E coverage added or updated for user-visible flows (Playwright with Page Objects).
- [ ] No regression in the existing test suite.

**Responsive behaviour**
- [ ] Verified at 320 × 568, 390 × 844, 844 × 390, 768 × 1024, and 1280 × 800.
- [ ] No horizontal page scroll; touch targets ≥ 48 px; works with touch, mouse, and keyboard.

**Accessibility**
- [ ] Automated scan shows no serious or critical violations.
- [ ] Keyboard operation and visible focus verified.
- [ ] Screen-reader names, live announcements, and hidden-hand handling verified where relevant.
- [ ] Contrast, colour independence, and reduced motion verified.

**Privacy and quality**
- [ ] No new third-party requests, cookies, or personal-data fields.
- [ ] Copy reviewed for plain language and a kind tone.
- [ ] Performance budget not exceeded.

**Documentation**
- [ ] Relevant sections in this document, [ui-ux.md](ui-ux.md), or [product-brief.md](product-brief.md) updated if behaviour or decisions changed.
- [ ] Open questions resolved or explicitly deferred.
