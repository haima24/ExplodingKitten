# K6 Scripting Standard

## Purpose

Defines how K6 scripts shall be written to ensure quality, maintainability, and correctness.

---

## Script Structure

Every K6 script must follow this structure:

```
Imports
Constants / Config
SharedArray (if parameterization needed)
export const options (stages + thresholds)
export function setup() (if auth/pre-test needed)
export default function (VU function)
export function teardown() (if cleanup needed)
```

---

## Imports

Use only official K6 built-in modules:

```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';
import { SharedArray } from 'k6/data';
import { Trend, Rate, Counter } from 'k6/metrics';
```

Do not use Node.js-specific modules (`fs`, `path`, etc.) — K6 is not Node.js.

---

## Options — Stages

Define stages matching the scenario load profile exactly:

```javascript
export const options = {
  stages: [
    { duration: '5m', target: 500 },   // ramp-up
    { duration: '15m', target: 500 },  // steady state
    { duration: '2m', target: 0 },     // ramp-down
  ],
  thresholds: { ... },
};
```

---

## Options — Thresholds

Every threshold must:
- Reference the metric by exact K6 name
- Use the correct operator (`<`, `>`, `rate<`, `count<`)
- Match the SLA from the scenario

```javascript
thresholds: {
  http_req_duration: ['p(95)<500', 'p(99)<1000'],
  http_req_failed: ['rate<0.01'],
}
```

Custom metric thresholds for specific endpoints:

```javascript
const checkoutDuration = new Trend('checkout_duration', true);
// In VU function: checkoutDuration.add(res.timings.duration);
thresholds: {
  checkout_duration: ['p(95)<800'],
}
```

---

## Requests

### Headers
- Always set `Content-Type` where applicable
- Always set `Authorization` header using extracted token, never hardcoded

```javascript
const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${authToken}`,
};
```

### Tags
Tag requests to enable per-endpoint thresholds:

```javascript
const res = http.post(url, payload, {
  headers,
  tags: { name: 'PostCheckout' },
});
```

---

## Check Assertions

Every response must be validated with `check()`:

```javascript
check(res, {
  'status is 200': (r) => r.status === 200,
  'response time < 500ms': (r) => r.timings.duration < 500,
  'response has body': (r) => r.body.length > 0,
});
```

Never silently ignore failed responses.

---

## Parameterization

Use `SharedArray` for CSV data (loaded once, shared across VUs):

```javascript
import { SharedArray } from 'k6/data';
import papaparse from 'https://jslib.k6.io/papaparse/5.1.1/index.js';

const users = new SharedArray('users', function () {
  return papaparse.parse(open('./data/users.csv'), { header: true }).data;
});

// In VU function:
const user = users[__VU % users.length];
```

---

## Correlation (Token Extraction)

Extract dynamic tokens from responses:

```javascript
const loginRes = http.post(`${BASE_URL}/auth/login`, payload, { headers });
check(loginRes, { 'login successful': (r) => r.status === 200 });
const authToken = loginRes.json('access_token');
```

Pass the token in subsequent requests via headers.

---

## Environment Variables

Never hardcode credentials or base URLs. Use `__ENV`:

```javascript
const BASE_URL = __ENV.BASE_URL || 'https://staging-api.example.com';
const USERNAME = __ENV.USERNAME; // fail fast if not set
```

---

## Think Time

Always add `sleep()` between steps, using randomized values:

```javascript
import { sleep } from 'k6';

sleep(Math.random() * 2 + 1); // 1–3 seconds
```

---

## Security Rules

- No hardcoded passwords, tokens, or API keys
- No PII in script source code
- CSV data files with credentials must be excluded from version control (`.gitignore`)

---

## File Naming

| Script | Filename |
|---|---|
| Load test | `load-test.js` |
| Stress test | `stress-test.js` |
| Soak test | `soak-test.js` |
| Spike test | `spike-test.js` |
| Auth helper | `helpers/auth.js` |
| Thresholds | `thresholds.js` |

---

## Anti-Patterns

✗ Hardcoded credentials in script
✗ Missing `check()` assertions
✗ Missing `thresholds` in options
✗ Using `require()` (Node.js — not supported in K6)
✗ `sleep(0)` in a realistic load test
✗ Single script combining multiple test types
✗ Not using `SharedArray` for large CSV files
