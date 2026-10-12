---
name: test-report-template
description: 'Defines a scalable portfolio Markdown test-report structure for many user stories, test cases, scripts, runs, and result files.'
---

# Test Report: <Release, Product, Project, or Result Set>

## Report Metadata

| Item | Value |
| --- | --- |
| Report scope | <release/product/project/result folder> |
| Scope type | <functional, non-functional, or both> |
| Report status | <Draft or Final> |
| Report generated date/time | <YYYY-MM-DD HH:mm timezone> |
| Result input | <file or folder path> |
| Result files inspected | <count> |
| Requirements/use cases in scope | <count> |
| User stories in scope | <count> |
| Summary basis | <latest-run, selected-runs, or all-runs> |
| Detailed evidence location | <path, index, or Not Available> |

## Report Conventions

| Area | Required convention | Evidence or reference |
|---|---|---|
| Counting | Count each distinct test case once in portfolio totals. Show both manual and automated outcomes without adding a second case. Do not sum repeated runs unless the metric is labeled run-execution count. | [Task-status skill](../SKILL.md) |
| Source model | Merge requirements, use cases, and user stories into one `Source` category. Count each source once. | [Task-status skill](../SKILL.md) |
| Done/not-done | A source is `Tested` when at least one linked case has an observed result. A case is `Tested` only when an observed result exists. Planned-only, skipped without evidence, not-run, and unavailable cases are `Not Tested`. | [Task-status skill](../SKILL.md) |
| Percentages | Use `tested sources / total sources` and `tested cases / total cases`. Use each result count divided by tested cases. Show `Not Available` when the denominator is zero. | [Task-status skill](../SKILL.md) |
| Manual/automated | Count distinct manual and automated cases and calculate each as a percentage of total distinct cases. Identify cases run by both methods without double-counting. | [Task-status skill](../SKILL.md) |
| Run scope | Show every run separately and label totals as `latest-run`, `selected-runs`, or `all-runs`. | [Task-status skill](../SKILL.md) |
| Result status | Use `Passed`, `Failed`, `Blocked`, `Skipped`, `Not Run`, or `Not Available`. Preserve source statuses. | [Task-status skill](../SKILL.md) |
| Evidence | Distinguish observed, planned, and unavailable results. Link large case-level datasets, source files, logs, screenshots, or partitioned detail instead of duplicating them. | [Task-status skill](../SKILL.md) |
| Playwright | Keep runner status separate from case-level outcomes. A passed runner does not mean every discovered test passed. Prefer per-test reporter results; use `.last-run.json` or console output only for statuses they expose. | [Task-status skill](../SKILL.md) |
| Large portfolios | When there are more than 100 cases or 20 user stories, summarize by story, script, and run and link partitioned detail. | [Task-status skill](../SKILL.md) |
| Missing data | Use `Not Available` for absent metadata, traceability, or evidence. List unreadable or unsupported files with the reason. | [Task-status skill](../SKILL.md) |
| Shared policy | Apply the shared testing quality and traceability rules. | [Testing standard](../../testing-design-test-case/references/standards/testing-standard.md) |

## Portfolio Summary

| Metric | Total |
| --- | ---: |
| User stories | <count> |
| Features/modules | <count> |
| Acceptance criteria/requirements | <count> |
| Total merged sources (requirements/use cases/user stories) | <count> |
| Sources with linked test cases | <count> |
| Sources tested (at least one case has an observed result) | <count> |
| Sources not tested | <count> |
| Source tested percentage | <tested sources / total sources * 100%> |
| Total distinct test cases | <count> |
| Test cases with an observed result | <count> |
| Test cases without an observed result | <count> |
| Test-case result percentage | <tested cases / total distinct cases * 100%> |
| Automated test cases | <count> |
| Automated case percentage | <automated cases / total distinct cases * 100%> |
| Manual test cases | <count> |
| Manual case percentage | <manual cases / total distinct cases * 100%> |
| Cases executed by both methods | <count> |
| Test scripts | <count> |
| Test runs | <count> |
| Passed | <count> |
| Passed percentage of tested cases | <passed / tested cases * 100% or Not Available> |
| Failed | <count> |
| Failed percentage of tested cases | <failed / tested cases * 100% or Not Available> |
| Blocked | <count> |
| Blocked percentage of tested cases | <blocked / tested cases * 100% or Not Available> |
| Skipped | <count> |
| Skipped percentage of tested cases | <skipped / tested cases * 100% or Not Available> |
| Not Run | <count> |
| Not Available | <count> |
| Execution start | <YYYY-MM-DD HH:mm:ss timezone or Not Available> |
| Execution end | <YYYY-MM-DD HH:mm:ss timezone or Not Available> |
| Total execution duration | <HH:mm:ss or Not Available> |
| Overall status | <Passed, Failed, Blocked, Incomplete, or Draft> |

## Readiness Summary

| Metric or decision | Value |
|---|---|
| Sources done / not done | <tested sources> / <untested sources> |
| Test cases done / not done | <tested cases> / <cases without observed result> |
| Result summary | <passed, failed, blocked, skipped, not-run counts and percentages> |
| Manual / automated | <manual count and percentage> / <automated count and percentage> |
| AI status comment | <Ready to Go / Needs More Testing / Blocked, with evidence-based rationale> |
| Release risk at current status | <risk if released now, including affected scope and impact> |
| Suggested next actions | <prioritized actions, owners, and dependencies> |

## Coverage Summary

Use one row per requirement, user story, or use case source. This combined table replaces separate requirement and user-story summaries; link to case-level or acceptance-criteria detail when needed.

| Source ID | Type | Name | Source Artifact | ACs/Rules | Test Cases | Automated | Manual | Passed | Failed | Blocked | Skipped | Not Run | Coverage | Latest Run | Status | Evidence/Detail Link |
| --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- | --- | --- |
| <ID> | <Requirement/User Story/Use Case> | <name> | <path> | <count> | <count> | <count> | <count> | <count> | <count> | <count> | <count> | <count> | <Covered/Partial/Uncovered> | <run ID or Not Run> | <status> | <path or URL> |

## AI Summary and Suggestions

| Item | Assessment |
|---|---|
| Overall assessment | <evidence-based status and readiness summary> |
| Evidence basis | <artifacts, result files, and runs used; distinguish observed from unavailable data> |
| Strengths | <what is complete or working well> |
| Key gaps and risks | <highest-impact coverage, execution, data, or environment gaps> |
| Suggested next actions | <prioritized actions with owner or dependency where known> |
| Readiness recommendation | <Proceed / Proceed with conditions / Hold, with rationale> |

## Result Files Inspected

| File | Format | Read Status | User Stories Found | Test Cases Found | Runs Found | Notes |
| --- | --- | --- | ---: | ---: | ---: | --- |
| <path> | <JSON/XML/Markdown/Text/HTML> | <Read/Unreadable/Unsupported> | <count or N/A> | <count or N/A> | <count or N/A> | <summary or reason> |

## Playwright Run Summary

| Run ID | Evidence Source | Command/Reporter | Runner Status | Case-Level Statuses | Discovered | Passed | Failed | Skipped | Duration | Date/Time | Environment | Evidence |
| --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | --- | --- | --- | --- |
| <run ID> | <console/.last-run.json/HTML/JUnit/test-results> | <command or reporter> | <status> | <Yes/No/Partial> | <count> | <count> | <count> | <count> | <duration> | <date/time> | <environment> | <path> |

## Automation Script Summary

One row represents one script, suite, or generated automation artifact. Link the full script-to-case mapping when large.

| Script ID/Path | Framework | User Stories | Test Cases | Latest Run | Passed | Failed | Skipped | Not Run | Duration | Status | Detail Link |
| --- | --- | --- | ---: | --- | ---: | ---: | ---: | ---: | --- | --- | --- |
| <path> | <Playwright/JMeter/etc.> | <IDs or count> | <count> | <run ID> | <count> | <count> | <count> | <count> | <duration> | <status> | <path or URL> |

## Manual Execution Summary

One row represents one user story, test cycle, or result batch. Link case-level evidence when needed.

| Batch/Cycle | Tester or Team | User Stories | Test Cases | Passed | Failed | Blocked | Skipped | Not Run | Execution Window | Duration | Environment | Evidence |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- | --- | --- |
| <cycle> | <name/team> | <IDs or count> | <count> | <count> | <count> | <count> | <count> | <count> | <start to end> | <duration> | <environment> | <path or URL> |

## Test Run Summary

One row represents one run, not one row per test case.

| Run ID | Run Type | Scope | User Stories | Scripts | Cases Executed | Result | Start | End | Duration | Environment | Command/Trigger | Evidence |
| --- | --- | --- | --- | ---: | ---: | --- | --- | --- | --- | --- | --- | --- |
| <run ID> | <Manual/Automated/Mixed> | <suite or release> | <count> | <count> | <count> | <status> | <date/time> | <date/time> | <duration> | <environment> | <command or trigger> | <path or URL> |

## Traceability Roll-up

One row represents one requirement or acceptance-criterion group. For very large matrices, save the full matrix separately and link it here.

| User Story | Requirement/AC Range | Test Cases | Covered | Passed | Failed | Blocked/Skipped | Coverage Status | Evidence/Detail Link |
| --- | --- | ---: | ---: | ---: | ---: | ---: | --- | --- |
| <US-ID> | <AC-1 to AC-n> | <count> | <count> | <count> | <count> | <count> | <Covered/Partial/Uncovered> | <path or URL> |

## Failure, Blocker, and Risk Summary

| ID | Severity | User Story/Run | Test Case or Script | Result | Summary | Evidence | Owner/Next Action |
| --- | --- | --- | --- | --- | --- | --- | --- |
| <finding ID> | <Critical/High/Medium/Low> | <scope> | <ID or path> | <Failed/Blocked> | <fact-based summary> | <path or URL> | <action or owner> |

## Detailed Evidence Index

| Detail Artifact | Covers | Format | Source Result Files | Purpose |
| --- | --- | --- | --- | --- |
| <path or URL> | <stories, scripts, or case range> | <Markdown/JSON/XML/HTML> | <paths> | <case-level results, full traceability, screenshots, or logs> |

## Assumptions, Risks, and Open Questions

- <Assumption, limitation, unreadable file, missing metadata, or owner action>

## Quality Gate

| Check | Status | Evidence |
|---|---|---|
| Every supplied result file is listed with read status and extracted counts. | [ ] | [Result Files Inspected](#result-files-inspected) |
| Every requirement, user story, or use case source is summarized or marked unavailable. | [ ] | [Coverage Summary](#coverage-summary) |
| Portfolio totals reconcile with story, script, manual-batch, and run summaries. | [ ] | [Portfolio Summary](#portfolio-summary) |
| Distinct-case and run-execution counting rules are applied consistently. | [ ] | [Report Conventions](#report-conventions) |
| Playwright runner status is separate from per-test outcomes. | [ ] | [Playwright Run Summary](#playwright-run-summary) |
| Large case-level datasets are linked or partitioned rather than duplicated. | [ ] | [Detailed Evidence Index](#detailed-evidence-index) |
| Manual and automated results have evidence or are marked `Not Available`. | [ ] | [Manual Execution Summary](#manual-execution-summary), [Automation Script Summary](#automation-script-summary) |
| Dates, times, durations, environments, scripts, runs, and evidence links are recorded. | [ ] | [Test Run Summary](#test-run-summary) |
| Failures, blockers, assumptions, risks, and open questions are visible. | [ ] | [Failure, Blocker, and Risk Summary](#failure-blocker-and-risk-summary), [Assumptions, Risks, and Open Questions](#assumptions-risks-and-open-questions) |
| AI summary and suggestions are supported by the report evidence and separated from observed results. | [ ] | [AI Summary and Suggestions](#ai-summary-and-suggestions) |
| Overall status is supported by the reported evidence. | [ ] | [Portfolio Summary](#portfolio-summary), [Detailed Evidence Index](#detailed-evidence-index) |
