# JMeter Script Example

> Reference only. Do not copy verbatim into outputs.
> This demonstrates the E-Commerce Checkout Load Test JMX structure.

---

## Element Hierarchy

```
Test Plan: E-Commerce - Load Test
│
└── Thread Group: Load Test - Checkout Flow
    │   Threads: ${__P(target_vus,500)}
    │   Ramp-Up: 300 seconds
    │   Scheduler: Duration = 900 seconds
    │
    ├── HTTP Request Defaults
    │       Server: ${__P(base_url,staging-api.example.com)}
    │       Protocol: https
    │
    ├── HTTP Cookie Manager
    │
    ├── HTTP Header Manager
    │       Content-Type: application/json
    │
    ├── CSV Data Set Config
    │       Filename: ./data/users.csv
    │       Variable Names: username,password
    │       Recycle: true
    │
    ├── HTTP Sampler: POST Login
    │   │   Path: /auth/login
    │   │   Body: {"username":"${username}","password":"${password}"}
    │   │
    │   ├── JSON Extractor
    │   │       Variable: access_token
    │   │       JSON Path: $.access_token
    │   │       Default: TOKEN_NOT_FOUND
    │   │
    │   └── Response Assertion → Code 200
    │
    ├── HTTP Header Manager (update Authorization)
    │       Authorization: Bearer ${access_token}
    │
    ├── Gaussian Random Timer (1000ms ± 500ms)
    │
    ├── HTTP Sampler: GET Products
    │   │   Path: /api/products
    │   └── Response Assertion → Code 200
    │
    ├── Gaussian Random Timer
    │
    ├── HTTP Sampler: GET Product Detail
    │   │   Path: /api/products/${product_id}
    │   └── Response Assertion → Code 200
    │
    ├── Gaussian Random Timer
    │
    ├── HTTP Sampler: POST Add to Cart
    │   │   Path: /api/cart
    │   │   Body: {"product_id":"${product_id}","qty":1}
    │   │
    │   ├── JSON Extractor
    │   │       Variable: cart_id
    │   │       JSON Path: $.cart_id
    │   └── Response Assertion → Code 201
    │
    ├── Gaussian Random Timer
    │
    ├── HTTP Sampler: POST Checkout
    │   │   Path: /api/checkout
    │   │   Body: {"cart_id":"${cart_id}","payment":"mock"}
    │   └── Response Assertion → Code 201
    │
    ├── Gaussian Random Timer
    │
    ├── jp@gc - AutoStop Listener
    │       Error rate > 5% for 10 seconds → Stop test
    │
    └── Backend Listener: InfluxDB2
            URL: http://localhost:8086
            Bucket: jmeter
```

---

## user.properties

```properties
base_url=staging-api.example.com
target_vus=500
influxdb_url=http://localhost:8086
influxdb_token=
```

---

## Run Commands

```bash
# Non-GUI run (CI/CD)
jmeter -n \
  -t jmeter/load-test.jmx \
  -Jbase_url=staging-api.example.com \
  -Jtarget_vus=500 \
  -l results/load-test.jtl \
  -e -o results/load-test-html-report/

# Generate HTML report from existing .jtl
jmeter -g results/load-test.jtl -o results/html-report/
```

---

## Threshold Post-Processing (CI Pipeline)

Parse the `.jtl` or aggregate report to enforce thresholds:

```bash
# Example: fail build if p95 > 500ms or error rate > 1%
# Use jmeter-analysis plugin, Azure Load Testing, or custom parser
```
