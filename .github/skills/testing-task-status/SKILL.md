---
name: testing-task-status

description: "Generate a traceable Markdown testing-status report when users ask to summarize requirements, user stories, test cases, scripts, manual or automated results, test runs, dates, times, durations, or per-run status from testing artifacts. Do not use to design cases, execute tests, debug failures, or implement automation; use the linked sibling skills instead."
---

# Testing Task Status

## Purpose
Generate an evidence-based portfolio report that rolls up testing artifacts and execution results without duplicating large case-level datasets.

## Context First
Start with the supplied result file or folder, or inspect the default roots below when they exist. Read supported files recursively and inspect content, not filenames alone. Exclude the output folder to prevent re-ingestion. Ask only when the source is missing or unreadable; mark unavailable metadata and traceability instead of inventing them.

| Source area | Default path |
|---|---|
| Requirements and cases | `working-artifacts/requirements/`, `working-artifacts/test-cases/` |
| Results and automation | `working-artifacts/testing/test-results/`, `working-artifacts/e2e/` |
| Supporting reports | `working-artifacts/testing/accessibility-test-reports/`, `working-artifacts/testing/test-analysis-reports/`, `working-artifacts/testing/test-reviews/`, `working-artifacts/testing/page-object-reviews-report/`, `working-artifacts/testing/skill-evaluator-reports/` |
| Report output to exclude | `working-artifacts/testing/testing-status/` |

## Workflow
| Step | Input | Action | Output |
|---|---|---|---|
| 1. Inventory | Supplied paths or default roots | Classify and read requirements, stories, cases, scripts, results, reports, and Playwright artifacts; flag unreadable or unsupported files. | Complete artifact inventory |
| 2. Extract | Inventory | Normalize IDs, outcomes, run metadata, timing, environment, commands, and evidence links. | Evidence records and one record per discovered run |
| 3. Trace | Normalized records | Merge requirements, use cases, and user stories into one source category; group by source, feature, acceptance criterion, case, script, and run; link detail instead of repeating large tables. | Portfolio roll-ups |
| 4. Calculate | Roll-ups and selected run scope | Calculate source and case done/not-done counts, result availability, manual/automated counts, result percentages, and run totals without double-counting. | Reconciled completion metrics |
| 5. Generate | Metrics, roll-ups, and links | Populate the [report template](references/test-tracking-template.md), apply the quality gate, and expose missing evidence. | Final report or marked `Draft` |

## Output Contract

| Artifact or rule | Contract |
|---|---|
| Input | One supplied result file or folder. Supported content includes Markdown, JSON, XML/JUnit, Playwright metadata, console or HTML-report data, and plain-text runner output when outcomes are exposed. |
| Default report | `working-artifacts/testing/testing-status/Test-Status-<YYYYMMDD-HHmmss>.md`, using the [report template](references/test-tracking-template.md) |
| Required sections | Portfolio, completion metrics, combined coverage, readiness summary, AI summary and suggestions, script, run, result-file, traceability, failure/blocker, detailed-evidence, assumptions/risks/questions, and quality-gate summaries |
| Run evidence | One row/record per run with ID, source, runner and case-level statuses, scope, command, timing, duration, environment, and evidence; absent fields are `Not Available`. |
| Source model | Treat each requirement, use case, or user story as one merged `Source`. Report total sources, sources with linked test cases, tested sources, and untested sources. |
| Done/not-done metrics | A source is `Tested` only when at least one linked test case has an observed execution result. A test case is `Tested` only when an observed result exists. Planned, skipped without result evidence, not-run, or unavailable cases are `Not Tested`. |
| Percentages | Report `tested sources / total sources` and `tested cases / total cases`. Report result percentages as `passed, failed, blocked, skipped, or not run / tested cases` only when the denominator is greater than zero; otherwise use `Not Available`. |
| Manual/automated | Report manual and automated case counts and percentages against total distinct cases, and identify cases executed by both methods without double-counting the portfolio total. |
| Result vocabulary | `Passed`, `Failed`, `Blocked`, `Skipped`, `Not Run`, `Not Available` |
| Evidence rules | Separate observed, planned, and unavailable results. Never convert skipped, not-run, or unavailable cases into passes. Keep large case datasets linked or partitioned. |

## Decisions and Quality Gate

| Condition | Required decision or check |
|---|---|
| Source missing | Request a result file or folder before generating. |
| File unreadable or unsupported | Record path and reason, then continue with other files. |
| Story or case context missing | Set traceability to `Not Available`; do not invent requirements. |
| Playwright evidence present | Prefer per-test reporter results; keep runner status separate from case outcomes. A passed runner with skipped or unavailable cases is incomplete execution. |
| Manual and automated execution of one case | Count one distinct case and show both outcomes in roll-ups or linked detail. |
| Multiple runs | Show each run and label totals as `latest-run`, `selected-run`, or `all-run`. |
| More than 100 cases or 20 stories | Summarize by story, script, and run; link partitioned case detail. |
| Unexplained failure | Link evidence and route investigation to [testing-analyze-bug](../testing-analyze-bug/SKILL.md); do not diagnose here. |
| Existing output path | Offer `Rerun fully`, `Modify existing report`, or `Stop`; default to `Rerun fully`. |
| Final validation | Confirm source and case done/not-done counts, percentage denominators, manual/automated breakdown, acceptance-criteria coverage, complete file inspection, reconciled totals, run timing/evidence, visible assumptions and risks, and evidence-supported readiness commentary. |
| Readiness summary | State `Ready to Go`, `Needs More Testing`, or `Blocked`, explain the evidence-based reason, and describe the release risk of proceeding with the current status. |
| Artifact handling | Inspect and report the supplied input without modifying source artifacts. |

## Related Skills
- [testing-design-test-case](../testing-design-test-case/SKILL.md)
- [testing-review-test-case](../testing-review-test-case/SKILL.md)
- [testing-review-automation](../testing-review-automation/SKILL.md)
- [testing-analyze-bug](../testing-analyze-bug/SKILL.md)
- [testing-implement-automation](../testing-implement-automation/SKILL.md)
- [Shared testing standard](../testing-design-test-case/references/standards/testing-standard.md)
