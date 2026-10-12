# JMeter Scripting Standard

## Purpose

Defines how JMeter test plans shall be structured to ensure quality, maintainability, and correctness.

---

## Test Plan Structure

Every JMeter test plan must follow this element hierarchy:

```
Test Plan
└── Thread Group
    ├── HTTP Request Defaults (Config Element)
    ├── HTTP Cookie Manager (Config Element)
    ├── HTTP Header Manager (Config Element)
    ├── CSV Data Set Config (Config Element — if parameterization needed)
    ├── User Defined Variables (Config Element)
    │
    ├── HTTP Sampler — Login
    │   ├── JSON Extractor (Post-Processor — correlation)
    │   └── Response Assertion
    │
    ├── Constant Timer / Gaussian Random Timer (Think Time)
    │
    ├── HTTP Sampler — [Next Step]
    │   └── Response Assertion
    │
    ├── (repeat for each step)
    │
    └── Backend Listener (InfluxDB) / Summary Report
```

---

## Thread Group Configuration

### Standard Load Test
- Number of Threads: `${__P(target_vus,500)}`
- Ramp-Up Period: Match scenario ramp-up (seconds)
- Loop Count: Calculated to match steady-state duration, or use Scheduler

### Stress Test Step-Up
Use **jp@gc - Stepping Thread Group** (JMeter plugins required):
- Start threads count: 0
- Add threads every: `[step_interval]` seconds, adding `[step_size]` threads
- Maximum threads: `[max_vus]`

### Soak Test
- Thread Group with Scheduler enabled
- Duration: `[soak_duration_seconds]`
- Loop Count: Infinite (with Scheduler)

### Spike Test
Use **jp@gc - Ultimate Thread Group**:
- Define start/stop/hold sequences to achieve instant surge and recovery

---

## HTTP Request Defaults

Set globally to avoid repetition:
- Server Name: `${BASE_URL}` (from User Defined Variables)
- Protocol: `https`
- Port: `443`
- Content encoding: `UTF-8`

---

## Parameterization — CSV Data Set Config

| Property | Value |
|---|---|
| Filename | `./data/users.csv` |
| Variable Names | `username,password` |
| Delimiter | `,` |
| Recycle on EOF | `True` |
| Stop thread on EOF | `False` |
| Sharing Mode | `All threads` |

---

## Correlation — Extractors

### JSON Extractor
- Apply to: Parent sampler (e.g., Login request)
- Names of created variables: `access_token`
- JSON Path expressions: `$.access_token`
- Default Value: `TOKEN_NOT_FOUND`

### Regex Extractor (for non-JSON responses)
- Reference Name: `csrf_token`
- Regular Expression: `"csrf":"([^"]+)"`
- Template: `$1$`
- Match No.: `1`

---

## Assertions

Every critical sampler must have a Response Assertion:
- Field to Test: `Response Code`
- Pattern Matching Rules: `Equals`
- Patterns to Test: `200` (or expected code)

For response body validation:
- Field to Test: `Response Body`
- Pattern Matching Rules: `Contains`
- Patterns to Test: Expected field name (e.g., `order_id`)

---

## Think Time

Use **Gaussian Random Timer**:
- Constant Delay Offset: `1000ms`
- Deviation: `500ms`

This produces think times normally distributed around 1000ms ±500ms.

Never use a 0 delay in realistic load tests.

---

## Listeners

### For CI/CD (non-GUI)
- **Backend Listener**: InfluxDB2 or Prometheus
- Do NOT use View Results Tree or Aggregate Graph in production runs (performance overhead)

### For local debugging
- **View Results Tree** (disable before CI run)
- **Summary Report**

---

## Properties and Variables

Never hardcode credentials. Use:

1. **User Defined Variables** for base URL, environment:
   ```
   BASE_URL = ${__P(base_url,https://staging-api.example.com)}
   ```

2. **CSV Data Set Config** for per-VU credentials

3. JMeter command-line properties (`-J` flag):
   ```
   jmeter -n -t load-test.jmx -Jbase_url=https://staging-api.example.com
   ```

---

## Threshold / Pass-Fail Criteria

JMeter does not natively enforce thresholds. Use one of:
1. **jp@gc - AutoStop Listener** — Stop test when error rate or response time threshold is breached
2. **JMeter Summary Report** — Parse `errors` and `avg` in CI pipeline post-processing
3. **External tool** — Analyze InfluxDB/Grafana results after run

Document the threshold enforcement mechanism in the execution plan.

---

## Security Rules

- No hardcoded passwords, tokens, or API keys in JMX files
- CSV files with credentials must be excluded from version control (`.gitignore`)
- Use properties or environment injection in CI

---

## File Naming

| Scenario | Filename |
|---|---|
| Load test | `load-test.jmx` |
| Stress test | `stress-test.jmx` |
| Soak test | `soak-test.jmx` |
| Spike test | `spike-test.jmx` |
| User data | `data/users.csv` |
| Properties | `user.properties` |

---

## Anti-Patterns

✗ Hardcoded credentials in JMX
✗ Missing Response Assertions
✗ No CSV Data Set Config when user data varies
✗ Missing extractors for correlated tokens
✗ Using View Results Tree in CI runs
✗ No think time between requests
✗ Single test plan combining multiple test types
✗ Thread count hardcoded instead of using properties
