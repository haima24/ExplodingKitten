# Test Scenario Design Standard

## Purpose

Defines how test scenarios shall be structured to ensure they are scripting-ready and traceable to requirements.

---

## Scenario Structure Rules

### 1. One Scenario per Test Type
Each test type (load, stress, soak, spike) must be a separate scenario with its own load profile and thresholds.

### 2. VU Journey Definition
- List each step in execution order
- Include: step number, HTTP method, endpoint, payload description, expected response code
- Include think time between steps

### 3. Load Profile Completeness
Every scenario must define:
- Start VU count (always 0 for ramp-up)
- Target VU count (peak)
- Ramp-up duration
- Steady-state duration
- Ramp-down duration

### 4. Threshold Derivation
- Thresholds must come directly from the PRD
- Do not invent thresholds not in the PRD
- If PRD threshold is vague, flag and ask for clarification

---

## Load Profile Patterns by Test Type

### Load Test
```
0 VUs → [target VUs] over [ramp-up]
Hold [target VUs] for [steady-state duration]
[target VUs] → 0 over [ramp-down]
```

### Stress Test
```
0 VUs → [target VUs] over [ramp-up]
[target VUs] → [target * 1.5] over [step duration]
[target * 1.5] → [target * 2] over [step duration]
Continue until failure or max defined
```

### Soak Test
```
0 VUs → [target VUs] over [ramp-up]
Hold [target VUs] for [minimum 60 minutes, typically 2–4 hours]
[target VUs] → 0 over [ramp-down]
```

### Spike Test
```
0 VUs → [spike VUs] in [< 30 seconds]
Hold for [2–5 minutes]
[spike VUs] → [normal VUs] immediately
Hold for [recovery period]
Observe recovery
```

---

## Think Time Rules

- Think time must be randomized within a defined range
- Default: 1–3 seconds between steps
- Never use 0 think time unless testing maximum throughput capacity
- State the distribution (uniform random or Gaussian)

---

## Parameterization Rules

- Any field that differs per virtual user must be parameterized
- List each parameterized field and its data source

---

## Correlation Rules

- Any dynamic token extracted from a response must be documented
- State: source endpoint → token name → destination usage

---

## Anti-Patterns

✗ Missing ramp-down in scenario
✗ Think time set to 0 for realistic load test
✗ Thresholds not from PRD
✗ Single scenario covering multiple test types
✗ VU journey not ordered
