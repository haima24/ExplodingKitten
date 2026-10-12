/**
 * K6 Script Template
 *
 * Replace all [PLACEHOLDER] values before use.
 * Do not copy this template verbatim — adapt to your scenario.
 */

import http from 'k6/http';
import { check, sleep } from 'k6';
import { SharedArray } from 'k6/data';
import { Trend, Rate } from 'k6/metrics';
import papaparse from 'https://jslib.k6.io/papaparse/5.1.1/index.js';

// ---------------------------------------------------------------------------
// Environment Configuration
// ---------------------------------------------------------------------------
const BASE_URL = __ENV.BASE_URL || '[DEFAULT_STAGING_URL]';

// ---------------------------------------------------------------------------
// Parameterization
// ---------------------------------------------------------------------------
const users = new SharedArray('users', function () {
  return papaparse.parse(open('./data/users.csv'), { header: true }).data;
});

// ---------------------------------------------------------------------------
// Custom Metrics
// ---------------------------------------------------------------------------
const [ENDPOINT_NAME]Duration = new Trend('[endpoint_name]_duration', true);
const errorRate = new Rate('error_rate');

// ---------------------------------------------------------------------------
// Options — Load Profile + Thresholds
// ---------------------------------------------------------------------------
export const options = {
  stages: [
    { duration: '[RAMP_UP_DURATION]', target: [TARGET_VUS] },   // ramp-up
    { duration: '[STEADY_STATE_DURATION]', target: [TARGET_VUS] }, // steady state
    { duration: '[RAMP_DOWN_DURATION]', target: 0 },             // ramp-down
  ],
  thresholds: {
    http_req_duration: ['p(95)<[P95_THRESHOLD_MS]', 'p(99)<[P99_THRESHOLD_MS]'],
    http_req_failed: ['rate<[ERROR_RATE_THRESHOLD]'],
    '[endpoint_name]_duration': ['p(95)<[ENDPOINT_P95_MS]'],
  },
};

// ---------------------------------------------------------------------------
// Setup — Runs once before all VUs start
// ---------------------------------------------------------------------------
export function setup() {
  // Perform any global setup (e.g., seeding, warm-up, or fetching a shared token)
  // Return value is passed to default() and teardown() as `data`
  return {};
}

// ---------------------------------------------------------------------------
// VU Function — Runs per virtual user
// ---------------------------------------------------------------------------
export default function (data) {
  // Pick user from parameterized data
  const user = users[__VU % users.length];

  // ── Step 1: Authentication ──────────────────────────────────────────────
  const loginPayload = JSON.stringify({
    username: user.username,
    password: user.password,
  });

  const loginHeaders = { 'Content-Type': 'application/json' };

  const loginRes = http.post(`${BASE_URL}/auth/login`, loginPayload, {
    headers: loginHeaders,
    tags: { name: 'Login' },
  });

  check(loginRes, {
    'login status is 200': (r) => r.status === 200,
    'login returns token': (r) => r.json('access_token') !== undefined,
  });

  const authToken = loginRes.json('access_token');
  errorRate.add(loginRes.status !== 200);

  sleep(Math.random() * 2 + 1); // 1–3 seconds

  // ── Step 2: [NEXT STEP NAME] ────────────────────────────────────────────
  const authHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${authToken}`,
  };

  const step2Res = http.get(`${BASE_URL}/[ENDPOINT_PATH]`, {
    headers: authHeaders,
    tags: { name: '[StepName]' },
  });

  check(step2Res, {
    '[step description] status is 200': (r) => r.status === 200,
  });

  [ENDPOINT_NAME]Duration.add(step2Res.timings.duration);
  errorRate.add(step2Res.status >= 400);

  sleep(Math.random() * 2 + 1);

  // ── Add more steps following the same pattern ───────────────────────────
}

// ---------------------------------------------------------------------------
// Teardown — Runs once after all VUs finish
// ---------------------------------------------------------------------------
export function teardown(data) {
  // Cleanup if needed
}
