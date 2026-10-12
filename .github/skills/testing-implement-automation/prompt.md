# Prompt Pattern: AI Implement Automation

Use this skill to implement automation scripts for approved cases.

## Template
Implement automation for: <requirement-or-feature>
Test cases: <paths>
Scope: <smoke|regression|functional|api|e2e>
Data: <optional datasets>
Approach: <A1 live browser|A2 frontend source|A3 static HTML|A4 design/spec|A5 existing page objects|A6 API contract|A7 recorder>
Approach input: <url|repo path|html file|contract path optional>

## Example
Implement automation for: customer login flow
Test cases: test-cases/TC-US-001-Customer-Login.md
Scope: smoke
Data: src/test-data/login-data.ts
Approach: A1 live browser
Approach input: https://app.example.com/login

## Note
If `Approach` is omitted, the skill asks you to pick one from Section 6 of SKILL.md before generating any script.
