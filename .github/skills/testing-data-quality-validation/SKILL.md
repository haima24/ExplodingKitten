---
name: testing-data-quality-validation
description: 'Use when defining or evaluating data-quality rules and checks for datasets, pipelines, reports, migrations, or interfaces. Cover completeness, accuracy, validity, uniqueness, consistency, integrity, timeliness, reconciliation, anomalies, and outliers. Produce quality rules, thresholds, defect findings, a data-quality summary, and a pass/fail assessment. Do not use for discovering business requirements, designing detailed ETL scenarios, executing pipelines, or implementing automation.'
---

# Testing Data Quality Validation

## Purpose

Define and evaluate measurable data-quality rules so that defects, thresholds, trends, and release decisions are visible and traceable to requirements and data expectations.

## Context First

Read the approved data requirements, data dictionary, source-to-target mappings, transformation rules, quality standards, schema, sample or execution data, reconciliation expectations, and reporting requirements. Confirm the dataset, environment, batch or time window, sampling method, severity policy, and threshold ownership. Ask when an expected value, threshold, population, or comparison baseline is missing; do not silently infer quality rules.

## Inputs

- Data requirements and acceptance criteria
- Data dictionary, schema, and field definitions
- Source-to-target mappings and transformation rules
- Dataset, extract, report, migration, or pipeline execution results
- Quality thresholds, baselines, control totals, and reconciliation rules
- Data profile, anomaly history, and known defect information when available

## Coverage

Evaluate applicable quality dimensions:

- **Completeness:** required fields, records, files, partitions, and expected populations are present.
- **Accuracy:** values match approved sources, calculations, reference data, or business expectations.
- **Validity:** values conform to data types, formats, domains, ranges, patterns, and business rules.
- **Uniqueness:** keys and records are not duplicated beyond approved duplicate rules.
- **Consistency:** the same data agrees across fields, sources, systems, reports, and time periods.
- **Integrity:** relationships, referential constraints, key dependencies, and source-to-target links are preserved.
- **Timeliness:** data arrives within the agreed freshness, processing, and effective-date windows.
- **Reconciliation:** counts, totals, balances, measures, and control values agree within approved tolerances.
- **Anomalies and outliers:** unusual distributions, spikes, drops, drift, missing patterns, and extreme values are identified and assessed.

## Workflow

1. **Set the validation context.** Input: requirements, dataset, and execution metadata. Action: define population, fields, batch, time window, baseline, environment, and comparison scope. Output: validation boundary.
2. **Define quality rules.** Input: data definitions and approved expectations. Action: express each applicable dimension as a measurable rule with rule ID, field or population, condition, threshold, severity, owner, and evidence query or method. Output: quality-rule catalogue.
3. **Profile and evaluate.** Input: quality-rule catalogue and data. Action: calculate completeness, accuracy, validity, uniqueness, consistency, integrity, timeliness, reconciliation, and anomaly measures. Output: check results with actual values, expected values, tolerances, and evidence.
4. **Classify findings.** Input: failed or warning checks. Action: identify affected records, fields, batches, systems, and business impact; classify defect severity, probable cause, recurrence, and containment needs. Output: defect findings and risks.
5. **Assess the quality gate.** Input: all check results and findings. Action: apply thresholds, critical-rule policy, unresolved-risk policy, and waiver or exception evidence. Output: pass, fail, conditional pass, or `NEEDS CLARIFICATION` assessment.
6. **Summarize and trace.** Input: rules, results, and findings. Action: map checks to requirements, report coverage, summarize trends and limitations, and list remediation or follow-up actions. Output: review-ready data-quality report.

## Output Contract

Save the Markdown artifact under `working-artifacts/data-quality-validation/` using `DQV-<DATASET-OR-REQUIREMENT-ID>-<NAME>.md`.

The document must contain:

1. Validation metadata: dataset, source, target, environment, batch or time window, population, and execution date.
2. Scope, assumptions, exclusions, baseline, sampling method, and threshold owner.
3. A quality-rule catalogue with rule ID, dimension, field or population, condition, threshold, severity, and evidence method.
4. Data-quality check results with expected value, actual value, tolerance, status, and evidence.
5. Defect findings with affected data, impact, severity, suspected cause, and recommended action.
6. A data-quality summary by dimension, including limitations and trend observations where available.
7. A final assessment: `PASS`, `CONDITIONAL PASS`, `FAIL`, or `NEEDS CLARIFICATION`.
8. Traceability to requirements, mappings, acceptance criteria, or approved quality standards.

## Decision Rules

1. Ask for an approved threshold or baseline when a pass/fail decision depends on one and none is provided.
2. Treat missing required data, invalid schema, broken keys, unreconciled totals, and expired data as failures when the rule applies.
3. Distinguish warnings from failures only when the quality policy defines the distinction; otherwise mark the decision `NEEDS CLARIFICATION`.
4. Do not remove, correct, or overwrite source data while validating it. Record remediation separately.
5. Investigate anomalies and outliers with business context before classifying them as defects.
6. Report both record-level and aggregate impact when a check fails.
7. Do not claim `PASS` when a critical rule failed, evidence is missing, or an unresolved assumption affects the decision.
8. Route requirement discovery to `testing-data-requirement-analysis`, ETL scenario design to `testing-etl-test-design`, detailed generic test cases to `testing-design-test-case`, and automation implementation to the relevant testing skill.

## Quality Gate

The assessment is ready for review when applicable quality dimensions are covered, rules and thresholds are explicit, checks have evidence, failures and warnings are classified, affected data and business impact are visible, limitations are documented, and the final pass/fail assessment follows the approved policy.

## Knowledge Sources

- Template: [`data-quality-validation.template.md`](references/data-quality-validation.template.md)
- Example: [`data-quality-validation.example.md`](references/data-quality-validation.example.md)
- Invocation prompt: [`prompt.md`](prompt.md)

## Related Skills

- `testing-data-requirement-analysis`
- `testing-etl-test-design`
- `testing-design-test-case`
- `testing-analyze-bug`
