# Dev spec — US-049 Performance budget check

| Item | Value |
| --- | --- |
| Story | [US-049](../user-stories/release-1.0.1/US-049-performance-budget-check.md) · Should · Testing and quality |
| Status | Draft v0.1 (proposed) · [Baseline](README.md) |
| Refs | F-28, metric M5, DAC-28, DAC-38; `.github/skills/performance-generate-k6-scripts/` |
| Area | CI, `tests/load`, `apps/client` build |

## 1. Goal

Keep the game fast: small initial bundle, good Lighthouse scores, and real-time updates within 300 ms (p95) at the proposed capacity of 200 concurrent rooms.

## 2. Technical design

### 2.1 Bundle budget

- `pnpm build` then a script sums gzip sizes of the **initial** JS chunks of the client; fail above **200 KB**. Per-route chunks (Rules, Settings, Privacy) are budgeted separately (≤ 40 KB each, proposed).
- A report lists the largest modules for investigation. Large images and fonts are checked separately (images ≤ 50 KB each as SVG or compressed; fonts subsetted WOFF2).

### 2.2 Lighthouse

Lighthouse CI against a preview build with a mobile profile (mid-range phone, throttled network): Home must score Performance ≥ 90 and LCP ≤ 2.5 s. Run on pull requests (assert) and nightly (trend).

### 2.3 Real-time latency and capacity (k6 WebSocket scenario)

`tests/load/rooms.js` (written following the repository's k6 scripting standard):

- Each virtual user group is one room of 4: one creates, three join, then the group plays seeded actions.
- Ramp to **200 concurrent rooms (800 connections)**, hold 10 minutes.
- Latency is the time from a sender's `ack` to the receipt of the resulting `game.update` by another client in the room (timestamps in the client script); thresholds: **p95 ≤ 300 ms**, error rate < 1 %, no dropped rooms.
- Collect server process CPU and memory (from `/metrics`) and compare with the limits agreed with operations (OQ-20).

### 2.4 Animation smoothness

Card animations use `transform` and `opacity` only (CSS lint check). A Playwright trace on a throttled CPU profile checks long tasks during a draw and a shuffle; target ≥ 50 fps on a mid-range profile (reported, M for final sign-off).

### 2.5 CI

Bundle check and Lighthouse on pull requests; the load test runs nightly and before releases against a staging environment, not on every change.

## 3. Edge cases and errors

- Budgets are proposed without a baseline: record the first measurements, then ratchet.
- Load tests must never target production.
- Test mode (deterministic seed) is required to script the games; it is not available in production.

## 4. Verification (of the check)

| Check | Level |
| --- | --- |
| Adding a large dependency or image fails the bundle check | CI |
| Lighthouse thresholds enforced | CI |
| k6 thresholds fail the run when breached | P |
| Capacity report archived per release | P |

## 5. Tasks

1. Add the bundle size script and report.
2. Add Lighthouse CI config.
3. Write the k6 room scenario and the metrics endpoint scrape.
4. Add the animation lint and trace check.

## 6. Dependencies and risks

- Depends on US-050, US-060.
- Risk: single-instance limits. Mitigation: measured headroom; shared state is a later enhancement.
