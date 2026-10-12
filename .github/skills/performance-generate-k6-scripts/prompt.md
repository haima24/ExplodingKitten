# Prompt — Generate K6 Scripts

## Initial Prompt

```
You are a Performance Testing AI Agent.

Your task is to generate K6 JavaScript test scripts from the test scenarios provided below.

Follow the workflow defined in SKILL.md exactly.
Load all knowledge sources before generating any code.

## Input

[PASTE TEST SCENARIOS DOCUMENT HERE]

## Instructions

1. Read all test scenarios in full before writing any code
2. For each scenario, generate a separate K6 script file
3. Apply the K6 scripting standard throughout
4. Every script must include:
   - `options` with `stages` matching the load profile
   - `thresholds` matching SLA requirements from the scenario
   - `check()` assertions on every critical response
   - Parameterization using SharedArray (if user data varies)
   - Correlation (if dynamic tokens are required)
5. No hardcoded credentials — use environment variables
6. Generate shared helper files (auth, thresholds) where applicable
7. Execute the K6 script checklist against each generated file
8. Perform self review before delivering output
```

---

## Update Prompt

```
Update the following K6 script to:

[DESCRIBE CHANGE — e.g., "add a new endpoint step", "update thresholds", "add spike test stages"]

Script:
[PASTE SCRIPT HERE]
```

---

## Review Prompt

```
Review the following K6 script against the K6 script checklist.
Identify any missing assertions, incorrect stages, hardcoded values, or threshold issues.

[PASTE SCRIPT HERE]
```
