# US-049 — Performance budget check

[Back to story index](README.md) | Source: [user-stories.md](../../user-stories.md)

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
- **Dependencies:** [US-050](US-050-project-scaffold-and-design-tokens.md), [US-060](US-060-real-time-room-server-authoritative.md).
- **Notes:** Budgets are proposed with no baseline; revisit after the first build.
