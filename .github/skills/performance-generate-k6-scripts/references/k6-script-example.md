# K6 Script Example

> Reference only. Do not copy verbatim into outputs.
> This demonstrates the E-Commerce Checkout Load Test scenario.

---

## load-test.js

```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';
import { SharedArray } from 'k6/data';
import { Trend, Rate } from 'k6/metrics';
import papaparse from 'https://jslib.k6.io/papaparse/5.1.1/index.js';

const BASE_URL = __ENV.BASE_URL || 'https://staging-api.example.com';

const users = new SharedArray('users', function () {
  return papaparse.parse(open('./data/users.csv'), { header: true }).data;
});

const checkoutDuration = new Trend('checkout_duration', true);
const errorRate = new Rate('error_rate');

export const options = {
  stages: [
    { duration: '5m', target: 500 },
    { duration: '15m', target: 500 },
    { duration: '2m', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<500', 'p(99)<1000'],
    http_req_failed: ['rate<0.01'],
    checkout_duration: ['p(95)<800'],
  },
};

export default function () {
  const user = users[__VU % users.length];

  // Step 1: Login
  const loginRes = http.post(
    `${BASE_URL}/auth/login`,
    JSON.stringify({ username: user.username, password: user.password }),
    { headers: { 'Content-Type': 'application/json' }, tags: { name: 'Login' } }
  );

  check(loginRes, {
    'login status 200': (r) => r.status === 200,
    'has access_token': (r) => r.json('access_token') !== undefined,
  });

  errorRate.add(loginRes.status !== 200);
  const authToken = loginRes.json('access_token');
  const authHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${authToken}`,
  };

  sleep(Math.random() * 2 + 1);

  // Step 2: Browse products
  const productsRes = http.get(`${BASE_URL}/api/products`, {
    headers: authHeaders,
    tags: { name: 'GetProducts' },
  });

  check(productsRes, { 'products status 200': (r) => r.status === 200 });
  errorRate.add(productsRes.status >= 400);

  const products = productsRes.json();
  const productId = products[0]?.id || '1';

  sleep(Math.random() * 2 + 1);

  // Step 3: Product detail
  const detailRes = http.get(`${BASE_URL}/api/products/${productId}`, {
    headers: authHeaders,
    tags: { name: 'GetProductDetail' },
  });

  check(detailRes, { 'product detail status 200': (r) => r.status === 200 });
  errorRate.add(detailRes.status >= 400);

  sleep(Math.random() + 1);

  // Step 4: Add to cart
  const cartRes = http.post(
    `${BASE_URL}/api/cart`,
    JSON.stringify({ product_id: productId, qty: 1 }),
    { headers: authHeaders, tags: { name: 'AddToCart' } }
  );

  check(cartRes, {
    'add to cart status 201': (r) => r.status === 201,
    'has cart_id': (r) => r.json('cart_id') !== undefined,
  });

  errorRate.add(cartRes.status >= 400);
  const cartId = cartRes.json('cart_id');

  sleep(Math.random() * 2 + 1);

  // Step 5: Checkout
  const checkoutRes = http.post(
    `${BASE_URL}/api/checkout`,
    JSON.stringify({ cart_id: cartId, payment: 'mock' }),
    { headers: authHeaders, tags: { name: 'PostCheckout' } }
  );

  check(checkoutRes, {
    'checkout status 201': (r) => r.status === 201,
    'order_id present': (r) => r.json('order_id') !== undefined,
  });

  checkoutDuration.add(checkoutRes.timings.duration);
  errorRate.add(checkoutRes.status >= 400);

  sleep(Math.random() * 2 + 1);
}
```

---

## helpers/auth.js

```javascript
import http from 'k6/http';
import { check } from 'k6';

const BASE_URL = __ENV.BASE_URL || 'https://staging-api.example.com';

export function getAuthToken(username, password) {
  const res = http.post(
    `${BASE_URL}/auth/login`,
    JSON.stringify({ username, password }),
    { headers: { 'Content-Type': 'application/json' } }
  );

  check(res, { 'auth token retrieved': (r) => r.status === 200 });
  return res.json('access_token');
}
```

---

## data/users.csv (first 3 rows)

```
username,password
user001@example.com,Password1!
user002@example.com,Password2!
user003@example.com,Password3!
```

---

## How to Run

```bash
# Load test
BASE_URL=https://staging-api.example.com k6 run load-test.js

# With output to InfluxDB
k6 run --out influxdb=http://localhost:8086/k6 load-test.js

# With output to Grafana Cloud k6
K6_CLOUD_TOKEN=<token> k6 cloud load-test.js
```
