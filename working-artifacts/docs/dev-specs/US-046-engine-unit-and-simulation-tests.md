# Dev spec — US-046 Engine unit and simulation tests

| Item | Value |
| --- | --- |
| Story | [US-046](../user-stories/US-046-engine-unit-and-simulation-tests.md) · Must · Testing and quality |
| Status | Draft v0.1 (proposed) · [Baseline](README.md) |
| Refs | F-16, metric M8, [engine contract](README.md#22-engine-contract-packagesengine-spec-in-us-051) |
| Area | `packages/engine/test`, `apps/server/test` |

## 1. Goal

Automated proof that every rule works, illegal actions change nothing, invariants always hold, and no hidden data leaks. The suite runs in CI on every change.

## 2. Technical design

### 2.1 Test layout

| Path | Content |
| --- | --- |
| `packages/engine/test/deal.test.ts` | Deal and deck counts for 2, 3, 4 players (US-014) |
| `.../cards/*.test.ts` | One file per card (US-018 – US-022): happy paths and negatives |
| `.../boom.test.ts` | Treat decision, re-insert, elimination, two Treats, last two players (US-015 – US-017) |
| `.../turns.test.ts` | Turn units, Pass It On chains, elimination of the current player |
| `.../illegal.test.ts` | Table-driven illegal actions: wrong player, missing card, Cozy Cat, Treat, out player, wrong phase, bad target |
| `.../determinism.test.ts` | Same seed and actions give identical states and events |
| `.../immutability.test.ts` | Deep-frozen inputs; no mutation |
| `.../projection.test.ts` | `viewFor` and `visibleEvents` leak scans (US-008) |
| `.../sim.test.ts` | Simulation harness (2.2) |
| `apps/server/test/*.test.ts` | Room lifecycle, join limits, host-only actions, host transfer, reconnect, absent skip, expiry, leak guard (US-055, US-056, US-058, US-059, US-060, US-061) |

### 2.2 Simulation harness

- Seeded `Rng`; for each seed play a full game with 2, 3, or 4 players choosing uniformly among **legal** actions (including leaves and skips at low probability).
- After every action assert invariants I1–I8 (`checkInvariants`) and run the leak scanner on every `PlayerView` and `visibleEvents` result.
- Each game must terminate within a bounded number of actions (guard against infinite loops).
- Run 10,000 seeds in CI (target under about 60 s); a nightly job may run 100,000. A failing seed is printed so the case is reproducible.
- Output summary statistics (turns per game, Boom Cats defused) to inform balance (not asserted).

### 2.3 Server leak test

An integration test creates a room with a host and two players over real WebSockets, plays scripted and random games, captures every outbound frame per client, and applies the leak scanner using the server-side state (test hook in `TEST_MODE`).

### 2.4 Coverage and mutation

- Engine branch coverage threshold **≥ 90 %**, enforced in CI.
- Mutation spot-check: a small mutation run on `game.ts`, `turn.ts`, and `eliminate.ts` (for example with a mutation testing tool); at least one test must fail for each mutant class (flip comparison, remove a push, swap positions). Non-blocking at first, reported in CI.

## 3. Edge cases and errors

- Flaky tests: forbidden; all randomness is seeded and all time is a fake clock.
- Long runs: sharded across workers.
- Test data builders create hands and piles directly for focused scenarios (not only via random deals).

## 4. Verification (of the tests themselves)

| Check | Level |
| --- | --- |
| Coverage report fails the build under 90 % branches | CI |
| Deliberately broken rule fails at least one test (mutation sample) | CI (report) |
| Seeds reproduce failures | U |

## 5. Tasks

1. Build test builders, deep-freeze, event and leak scanners, and the simulation runner.
2. Write the engine suites listed above, alongside each card spec.
3. Write the server integration suites alongside each server spec.
4. Configure coverage thresholds and the mutation report.

## 6. Dependencies and risks

- Depends on US-051 and US-060; grows with every rules story.
- Risk: simulation too slow. Mitigation: pure functions, no I/O, worker sharding.
