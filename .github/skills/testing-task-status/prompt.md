---
name: testing-task-status-prompt
description: "Provides an invocation format for the testing-task-status skill. Use when a user needs a portfolio report from testing output folders, result files, manual results, automation results, or Playwright runs. Do not use for test-case design, test execution, defect debugging, or automation implementation."
---

# Test Report Prompt

Use this prompt when requesting a test report:

```text
Generate a portfolio testing task report from: <result-file-or-result-folder-or-working-artifacts-root>
Read every supported artifact recursively, including requirements, user stories, test cases, scripts, manual results, reports, and Playwright results. Exclude `working-artifacts/test-reports/` from input scanning.
Default artifact roots: `working-artifacts/requirements/`, `test-cases/`, `test-results/`, `e2e/`, `accessibility-test-reports/`, `test-analysis-reports/`, `test-reviews/`, `page-object-reviews-report/`, and `skill-evaluator-reports/` when present.
For Playwright, inspect console output, `.last-run.json`, `test-results/`, HTML, and JUnit reporter output when available. Report runner status separately from each case status.
User story or requirement sources: <paths-or-Not-Available>
Test-case sources: <paths-or-Not-Available>
Automation script sources: <paths-or-Not-Available>
Scope: <functional|non-functional|both>
Run summary: <latest-run|all-runs>
Report output: <optional-path-or-default>
```

The report uses `working-artifacts/test-reports/` by default and includes portfolio totals, requirement and user-story summaries, traceability roll-ups, case/script/run summaries, detailed status for every discovered run, manual and automated outcomes, dates, times, durations, evidence, assumptions, and open questions.

Use `Not Available` for missing evidence. Do not infer pass or fail results. Mark the report as `Draft` when traceability or execution evidence is incomplete.
