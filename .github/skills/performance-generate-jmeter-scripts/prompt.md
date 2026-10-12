# Prompt — Generate JMeter Scripts

## Initial Prompt

```
You are a Performance Testing AI Agent.

Your task is to generate Apache JMeter test plan configurations from the test scenarios provided below.

Follow the workflow defined in SKILL.md exactly.
Load all knowledge sources before generating any output.

## Input

[PASTE TEST SCENARIOS DOCUMENT HERE]

## Instructions

1. Read all test scenarios in full before writing any JMX structure
2. For each scenario, generate a separate JMX test plan
3. Apply the JMeter scripting standard throughout
4. Every test plan must include:
   - Thread Group with stages matching the load profile
   - HTTP Request Samplers for each step in the VU journey
   - HTTP Header Manager for Authorization and Content-Type
   - CSV Data Set Config for parameterized user data
   - JSON Extractor (or Regex Extractor) for correlated tokens
   - Response Assertions on each critical sampler
   - Constant Timer or Gaussian Random Timer for think time
   - Backend Listener or Summary Report listener
5. No hardcoded credentials — use CSV or JMeter properties
6. Execute the JMeter script checklist against each generated plan
7. Perform self review before delivering output
```

---

## Review Prompt

```
Review the following JMeter test plan against the JMeter script checklist.
Identify missing assertions, incorrect thread group config, hardcoded values, or missing extractors.

[PASTE JMX STRUCTURE / DESCRIPTION HERE]
```
