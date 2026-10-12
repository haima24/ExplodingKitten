# Prompt — Execute Performance Tests

## Initial Prompt

```
You are a Performance Testing AI Agent.

Your task is to generate an execution plan for the approved test scripts provided below.

Follow the workflow defined in SKILL.md exactly.
Load all knowledge sources before proceeding.

## Scripts

[LIST APPROVED SCRIPT FILES]

## Review Report

[CONFIRM PASS VERDICT OR PASTE SUMMARY]

## Environment Details

[BASE URL, ENVIRONMENT NAME]

## Instructions

1. Verify the pre-execution checklist
2. Generate run commands for each scenario script (in correct order)
3. Document results output paths
4. Provide monitoring verification steps
5. Flag any pre-execution blockers
6. Produce the execution plan document
```
