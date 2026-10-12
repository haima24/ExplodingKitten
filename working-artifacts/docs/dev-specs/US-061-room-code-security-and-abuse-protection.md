# Dev spec — US-061 Room-code security and abuse protection

| Item | Value |
| --- | --- |
| Story | [US-061](../user-stories/US-061-room-code-security-and-abuse-protection.md) · Must · Error handling, reliability, connection, and privacy |
| Status | Draft v0.1 (proposed) · [Baseline](README.md) |
| Refs | F-15, FR-26, DAC-33, OQ-19, risk R10 |
| Area | `apps/server` (`codes`, `limits`, gateway) |

## 1. Goal

Strangers must not be able to guess or flood rooms. The code and link are the only access control, so they are strong, rate-limited, and backed by host controls.

## 2. Technical design

### 2.1 Code generation (`codes.ts`)

- Alphabet `23456789ABCDEFGHJKMNPQRSTVWXYZ` (30 symbols), length 6 → 729,000,000 codes.
- Draw each symbol with the platform's cryptographically secure integer generator using rejection sampling (no modulo bias).
- A code must be unique among active rooms and tombstones (24 h quarantine, US-056); regenerate on collision (bounded retries, then `SERVER_ERROR`).

### 2.2 Rate limiting (`limits.ts`)

| Limit | Default | Keyed by |
| --- | --- | --- |
| Failed joins and rejoins | 10 per 60 s, then blocked 60 s | client IP **and** connection id |
| Messages | 20/s sustained, burst 40 | connection |
| Message size | 4096 bytes | connection |
| Rooms created | 5 active rooms | client IP |
| Total rooms | 500 | process |
| New connections | 30 per minute (proposed) | client IP |

- Client IP comes from the socket address, or from `X-Forwarded-For` **only** when the request arrives from a configured trusted proxy.
- Counters live in memory with sliding windows and are pruned automatically.

### 2.3 Responses that do not help attackers

- All failed joins pass through a constant-time path with a small random delay (100–200 ms) and identical response shape; the message does not reveal whether a code is "close".
- The server never reveals members, avatars, or phase for a code before a successful join.
- Join success needs a valid code **and** a legal identity (US-004).

### 2.4 Room-level controls

- Full (4) or started rooms reject joins server-side regardless of the client.
- A removed player's token hash is on the room ban list; that device cannot rejoin the same room (US-055). IP bans are **not** used (shared networks).
- Join approval is not in the MVP (OQ-18); the host can remove players.

### 2.5 Transport protections

Origin allow-list on the WebSocket upgrade; schema validation of every message with unknown fields ignored; connections closed on repeated violations.

### 2.6 Risk note (sizing)

At 10 failed attempts per minute per IP, one IP can try about 14,400 codes per day. With 200 active rooms the chance of hitting **some** open lobby is roughly 14,400 × 200 / 729,000,000 ≈ 0.4 % per IP per day. Consequences are limited (a lobby that has not started; the host can remove the guest; no chat; locked once started). A distributed attacker multiplies this. If the abuse review is not comfortable, increase the code to 7 characters (21.9 billion codes) or lower the failed-attempt limit. Open question OQ-19.

## 3. Edge cases and errors

- Shared school or office networks: limits are per IP and could affect many users; the blocked message is friendly ("Too many tries. Wait a minute and try again.").
- A legitimate host mistyping a code a few times stays below the limit.
- Proxy misconfiguration (all users share one IP): configuration test warns at startup if every client IP is identical in a probe.

## 4. Verification

| Check | Level |
| --- | --- |
| Alphabet and length; distribution test (chi-square on many codes); no excluded characters | U |
| Collision handling and quarantine | U |
| Rate limits trigger at the thresholds; windows slide and reset | I |
| Failed-join responses are uniform (shape and timing bucket) | I |
| Full, started, and banned cases rejected regardless of client claims | I |
| Enumeration, tampered message, role spoofing, replayed or stolen token tests | I (security suite) |
| Origin check rejects foreign origins | I |

## 5. Tasks

1. Implement secure code generation and quarantine integration.
2. Implement limiters with injectable clock.
3. Add uniform-failure path and trusted-proxy handling.
4. Add the security test suite and the sizing note to the review pack.

## 6. Dependencies and risks

- Depends on US-060, US-055, US-056.
- Risk: weak code space. Mitigation: configurable length; review before launch.
