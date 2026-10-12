# JMeter Script Template

> This template describes the required JMX element structure. Generate the actual JMX XML based on this blueprint.
> Replace all [PLACEHOLDER] values.

---

## Test Plan Blueprint

```
Test Plan: [SYSTEM_NAME] - [TEST_TYPE] Test
│
└── Thread Group: [TEST_TYPE] - [SCENARIO_NAME]
    │   Number of Threads: ${__P(target_vus,[DEFAULT_VUS])}
    │   Ramp-Up Period: [RAMP_UP_SECONDS]
    │   Loop Count: -1 (infinite) + Scheduler OR calculated loops
    │   Scheduler Duration: [STEADY_STATE_SECONDS]
    │
    ├── HTTP Request Defaults
    │       Server: ${__P(base_url,[DEFAULT_BASE_URL])}
    │       Protocol: https
    │       Port: 443
    │
    ├── HTTP Cookie Manager
    │       Policy: standard
    │
    ├── HTTP Header Manager
    │       Content-Type: application/json
    │
    ├── CSV Data Set Config (if parameterization needed)
    │       Filename: ./data/users.csv
    │       Variable Names: username,password
    │       Delimiter: ,
    │       Recycle: true
    │
    ├── User Defined Variables
    │       BASE_URL: ${__P(base_url,[DEFAULT_BASE_URL])}
    │
    ├── HTTP Sampler: Login
    │   │   Method: POST
    │   │   Path: /auth/login
    │   │   Body: {"username":"${username}","password":"${password}"}
    │   │
    │   ├── JSON Extractor: Extract access_token
    │   │       Variable: access_token
    │   │       JSON Path: $.access_token
    │   │       Default: TOKEN_NOT_FOUND
    │   │
    │   └── Response Assertion
    │           Field: Response Code
    │           Value: 200
    │
    ├── Gaussian Random Timer
    │       Deviation: 500
    │       Constant Delay: 1000
    │
    ├── HTTP Sampler: [STEP_2_NAME]
    │   │   Method: [METHOD]
    │   │   Path: [ENDPOINT]
    │   │   Headers: Authorization: Bearer ${access_token}
    │   │
    │   └── Response Assertion
    │           Field: Response Code
    │           Value: [EXPECTED_STATUS]
    │
    ├── Gaussian Random Timer
    │
    ├── HTTP Sampler: [STEP_N_NAME]
    │   └── Response Assertion
    │
    └── Backend Listener: InfluxDB2
            URL: ${__P(influxdb_url,http://localhost:8086)}
            Token: ${__P(influxdb_token,)}
            Org: [ORG]
            Bucket: k6 (or jmeter)
```

---

## user.properties

```properties
# Default JMeter property overrides
# Override at runtime: jmeter -n -t load-test.jmx -Jbase_url=https://...

base_url=https://staging-api.example.com
target_vus=500
ramp_up_seconds=300
steady_state_seconds=900
influxdb_url=http://localhost:8086
```

---

## Run Command (non-GUI / CI)

```bash
jmeter -n \
  -t jmeter/load-test.jmx \
  -Jbase_url=https://staging-api.example.com \
  -Jtarget_vus=500 \
  -l results/load-test-results.jtl \
  -e -o results/load-test-report/
```
