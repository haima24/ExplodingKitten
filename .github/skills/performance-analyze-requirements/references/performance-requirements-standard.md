# Performance Requirements Standard

## Purpose

Defines how performance requirements shall be extracted, classified, and documented.

---

## Requirement Categories

Every performance requirement must be classified into one of:

| Category | Description |
|---|---|
| Throughput | RPS, TPS, or VU targets |
| Latency | Response time thresholds by percentile |
| Availability | Uptime / error rate limits |
| Capacity | Maximum load the system must sustain |
| Scalability | Behavior under increasing load |

---

## SLA Specification Rules

### Mandatory Fields
Every SLA entry must include:
- Metric (e.g., `p95 response time`)
- Threshold (e.g., `< 500ms`)
- Scope (e.g., `POST /api/orders`)
- Test type (e.g., `Load Test`)

### Percentile Requirements
At minimum, define:
- `p95` response time
- Error rate threshold

Recommended:
- `p50`, `p90`, `p95`, `p99`

### Error Rate
- Must be expressed as a percentage
- Must specify which HTTP status codes count as errors (default: 4xx + 5xx)

---

## Load Profile Rules

| Field | Description | Example |
|---|---|---|
| Target VUs | Peak concurrent virtual users | 500 |
| Ramp-up period | Time to reach target VUs | 5 minutes |
| Steady state duration | Time at peak VUs | 15 minutes |
| Ramp-down period | Time to reduce VUs to 0 | 2 minutes |
| Total test duration | Sum of all phases | 22 minutes |

---

## Scope Definition Rules

- List each endpoint explicitly: `GET /api/products`, `POST /api/checkout`
- Explicitly state what is **out of scope**
- Note any third-party services that must be mocked or excluded

---

## Environment Requirements

- Document the exact environment (staging, UAT, prod-mirror)
- Record environment specs (CPU, memory, instance count)
- Note whether autoscaling is enabled during the test

---

## Assumptions Documentation

All assumptions must be:
1. Clearly labeled as assumptions
2. Assigned an owner for validation
3. Tracked as open questions if unvalidated

---

## Anti-Patterns

✗ Vague thresholds: "response time should be fast"
✗ Missing percentile: "response time < 500ms" without specifying p50/p95/p99
✗ No error rate threshold
✗ Environment not specified
✗ Scope not defined per endpoint
