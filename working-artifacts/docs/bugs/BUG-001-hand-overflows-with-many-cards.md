# BUG-001 — Hand overflows the screen with many cards (scrollbar, no indicator)

[Back to bug index](README.md) | Reported by: product owner | Written by: BA | Status: **Fixed in two passes, verified** (Release 1.0.2)

| Field | Value |
| --- | --- |
| Severity | Medium (the game stays playable, but cards are hard to find and the screen looks broken) |
| Priority | Should fix in 1.0.2 |
| Area | Game board, "Your hand" ([US-009](../user-stories/release-1.0.1/US-009-view-my-hand.md), [US-033](../user-stories/release-1.0.1/US-033-responsive-layouts-across-device-classes.md)) |
| Found in | Release 1.0.1 and the 1.0.2 build |
| Environment | Desktop browsers (a classic scrollbar appears), phone-size screens (320 to 430 px wide), English and Vietnamese |
| Source | Product owner report (Vietnamese): "khi số lá bài được rút quá nhiều, bị tràn màn hình, xuất hiện thanh cuộn. Tôi không muốn thanh cuộn, thay vào đó hãy hiện indicator, ngoài ra rê chuột sang trái hoặc phải để xem các lá bài. Và sửa luôn khi giao diện responsive là mobile." |

## 1. Summary

When a player holds more cards than fit across the screen, the extra cards run off the edge. On desktop a horizontal **scrollbar** appears under the hand. Nothing tells the player that **more cards exist**, how many, or on which side, and a mouse user has no easy way to reach them. The same problem exists on phones, where only about six cards are visible at 390 px wide.

## 2. Steps to reproduce

1. Create a room, add a second player (or a Bot Buddy) and start a game with the turn timer Off.
2. Let both players draw without playing cards until one hand has 15 cards (about 7 rounds each).
3. Look at "Your hand" on that player's device, on a desktop window (1024 px wide) and on a phone-size screen (390 px wide).

Reproduced three times on 1.0.2 with a 15-card hand. Evidence: [desktop](assets/BUG-001-before-desktop.png), [phone](assets/BUG-001-before-mobile.png).

## 3. Actual result

| Device | What happens |
| --- | --- |
| Desktop | The hand is wider than its area (1,615 px of cards in a 664 px area). A horizontal scrollbar shows under the cards. Only about 6 of 15 cards are visible |
| Desktop, mouse | The only ways to see the rest are to drag the scrollbar or use a wheel with Shift. Moving the mouse to the edge does nothing |
| Phone | About 6 of 15 cards are visible. There is no sign that cards continue to the right. The only way is to swipe, which a player may not try |
| Both | The "15 cards" counter is the only hint, and it does not say how many are hidden or where |

## 4. Expected result

1. **No scrollbar** is shown on the hand (or on the player row), on any device.
2. An **indicator** shows when cards are cut off, on each side: a count and an arrow ("9 ›" on the right, "‹ 4" on the left), disappearing when nothing is cut off on that side.
3. With a **mouse**, moving the pointer toward the left or right edge of the hand **slides the hand** that way (faster nearer the edge) and stops when the pointer moves away.
4. The indicator can be **tapped or clicked** to move the hand by about half a screen.
5. On a **phone**, swiping still works, the indicator shows on both sides while swiping, and nothing makes the page scroll sideways.
6. The selected card, keyboard arrows and screen readers keep working; screen readers hear how many cards are hidden and on which side.

## 5. Impact

- Players miss cards in a large hand, especially Nope (which has a time limit) and Defuse.
- Larger hands become common with the Cat card pairs ([US-065](../user-stories/release-1.0.2/US-065-cat-card-pairs.md)): 20 more cards in the deck.
- Looks unfinished, which hurts the "game for families" goal.

## 6. Root cause (summary)

The hand is one row with horizontal overflow. It relied on the browser's own scrollbar, with scroll snapping on. There was no component that measures what is cut off. Scroll snapping would also pull any small mouse-driven slide back to its starting point, so a mouse "slide" could not work without changing it.

## 7. Fix (what was done)

- The scrollbar is hidden on the hand and on the player row; the row still scrolls by touch, wheel, keyboard and code.
- The hand counts the cards cut off on each side (when it scrolls, resizes or changes) and shows an indicator with the count and an arrow on a soft fade. The indicator is a button that scrolls by about 60 % of the hand's width.
- A mouse near the left or right edge slides the hand (zone about 20 % of the width, at most 120 px; speed grows toward the edge). Only a mouse does this, so touch is not affected.
- Scroll snapping stays for touch and is turned off for mouse devices, because it fought the slide.
- Screen readers get "N more cards to the left/right" on the indicators (both languages).
- Layout detail: the indicator sits below the "N cards" counter so it does not hide it.

Code: `Hand.tsx`, `game.module.css`, `copy/en.ts`, `copy/vi.ts`.

### 7.1 Reopened: the first fix was incomplete

The product owner reported that the indicator and the sliding **worked only the first time**, and afterwards the hand would not move left or right. A second pass found these causes:

| # | Cause | Effect |
| --- | --- | --- |
| 1 | The slide and the indicator were driven by "cards whose **middle** is cut off". A card cut off by less than half did not count | The slide stopped short of the real end (for example at 11 of 951 px), and the indicator vanished while part of a card was still hidden. The next attempt had nothing to slide to, so it looked broken |
| 2 | The slide read the scroll position back every frame and added a fixed amount per frame | On screens scaled to 125 % or 150 % the browser rounds small scroll steps, so a slow slide could stall; it also ran faster on fast monitors |
| 3 | Only a mouse at the edge could move the hand; the mouse wheel did nothing | Mouse users expect the wheel to slide a sideways list |

Second fix:
- The slide and the indicator now use the **real scroll position**: the hand slides until it truly reaches the end, and an indicator shows while any part of a card is cut off on that side.
- The position is **accumulated** and the speed is in **pixels per second** (150 at the start of the edge zone, up to 700 at the very edge), so it is smooth on any screen scale or refresh rate.
- The **mouse wheel** slides the hand sideways while there is more to see that way, and lets the page scroll normally at the ends.
- The edge zone is a little larger (22 % of the width, up to 140 px).

## 8. Acceptance criteria for the fix

| AC | Description |
| --- | --- |
| AC01 | Given a hand wider than its area, then no scrollbar is shown on the hand or the player row, on desktop and phone |
| AC02 | Given cards are cut off on the right, then an indicator with the number of hidden cards and an arrow shows on the right; given none are cut off on a side, then no indicator shows on that side |
| AC03 | Given the hand is scrolled, then both indicators update and show the correct counts |
| AC04 | Given a mouse, when the pointer moves into the left or right edge zone, then the hand slides that way, faster nearer the edge, and stops when the pointer leaves or the end is reached |
| AC05 | Given the indicator, when it is tapped or clicked, then the hand moves by about half its width |
| AC06 | Given a phone, then swiping scrolls the hand, indicators show on both sides while in the middle, and the page does not scroll sideways |
| AC07 | Given any hand size, then every card can be reached and selected, including the last card |
| AC08 | Given a screen reader, then each indicator reads how many cards are hidden and on which side, in the selected language |
| AC09 | Given reduced motion, then taps move the hand without smooth animation |
| AC10 | Given the "N cards" counter, then it stays visible and is not covered by an indicator |
| AC11 | Given a mouse at an edge, then the hand slides until the true end (first and last card fully visible) every time, not only the first time, including after cards are drawn or played and after a card is selected |
| AC12 | Given a mouse wheel over the hand, then it slides the hand sideways while there is more to see, and scrolls the page normally at the ends |
| AC13 | Given a screen scaled to 125 % or 150 %, then the slide and the indicator behave the same as at 100 % |

## 9. Verification

| Check | Result |
| --- | --- |
| Desktop, 15 cards: scrollbar hidden, "9 ›" indicator shown, none on the left | Pass |
| Desktop: pointer to the right edge slides the hand (0 to 832 px in under a second), left indicator appears ("‹ 8") | Pass |
| Desktop: pointer to the left edge slides it back; moving away stops it | Pass |
| Desktop and phone: tapping the right indicator moves the hand | Pass |
| Phone (390 px): both indicators after swiping ("‹ 4", "6 ›"); page does not scroll sideways (390 of 390 px) | Pass |
| Far end: only the left indicator remains; the last card can be selected | Pass |
| Evidence after the fix: [desktop](assets/BUG-001-after-desktop.png), [phone](assets/BUG-001-after-mobile.png) | |
| Second pass, desktop 100 % and 125 %: three slides right and left, each reaching the true ends (951 of 951 px, then 0) with the indicator on the right side only at the start and on the left side only at the end | Pass |
| Second pass: a slow slide with the pointer just inside the edge zone | Pass (0 to 284 px in 1.5 s) |
| Second pass: mouse wheel slides the hand and back | Pass |
| Second pass: after drawing a card and a full turn, slides, taps and wheel still work (hand grew from 15 to 16 cards) | Pass |
| Regression: pair play, fan, timer and names tests still pass | Pass |
| Not covered | Real touch swiping: the automated browser could not simulate a swipe (even a plain test box would not scroll), so touch relies on the browser's own scrolling; real phones and touch trackpads; screen readers; 320 px with 150 % text and 20+ cards (see Notes) |

## 10. Related changes to stories

- [US-009](../user-stories/release-1.0.1/US-009-view-my-hand.md) now has two acceptance criteria for this behaviour (no scrollbar with an indicator; mouse-to-edge sliding).
- The first row of [US-033](../user-stories/release-1.0.1/US-033-responsive-layouts-across-device-classes.md) ("scrolling row") is unchanged in behaviour for touch.

## 11. Notes and open points

- The same hidden-scrollbar rule was applied to the player row (up to four chips), as the same problem could appear on very narrow screens.
- On phones the hand is small (cards about 76 px wide) and the board has unused space above and below the piles. A bigger hand on phones (using that space) is a possible later improvement and is **not** part of this fix.
- With very large hands (more than about 20 cards) a "position" indicator (a short bar showing where you are in the hand) could help; the count and arrows were enough for 15 cards.
