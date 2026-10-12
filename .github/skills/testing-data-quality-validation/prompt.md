# Data-Quality Validation Prompt

Use this prompt to invoke the `testing-data-quality-validation` skill.

```text
Analyze the data quality for <DATASET_OR_REPORT> using the approved requirements and available data artifacts.

Inputs:
- Requirements / acceptance criteria: <PATH_OR_CONTENT>
- Data dictionary / schema: <PATH_OR_CONTENT>
- Source-to-target mapping: <PATH_OR_CONTENT>
- Transformation rules: <PATH_OR_CONTENT>
- Dataset, extract, report, or execution result: <PATH_OR_CONTENT>
- Quality thresholds / control totals: <PATH_OR_CONTENT_OR_VALUE>
- Baseline or comparison period: <VALUE_OR_NOT_AVAILABLE>
- Environment and batch / time window: <VALUE>

Scope:
- Dimensions: <COMPLETENESS, ACCURACY, VALIDITY, UNIQUENESS, CONSISTENCY, INTEGRITY, TIMELINESS, RECONCILIATION, ANOMALIES>
- Sampling method: <FULL_DATASET_OR_METHOD>
- Severity policy: <POLICY>
- Threshold owner: <OWNER>

Produce a Markdown report using `references/data-quality-validation.template.md` and save it under `working-artifacts/data-quality-validation/` with the `DQV-<DATASET-OR-REQUIREMENT-ID>-<NAME>.md` naming convention.

For each rule, provide:
1. Rule ID, dimension, field or population, measurable condition, threshold, severity, and evidence method.
2. Expected value, actual value, tolerance, status, and evidence.
3. A finding for each failed or warning check with affected data, impact, severity, suspected cause, and recommended action.
4. A summary by quality dimension and any anomaly or trend observations.
5. A final `PASS`, `CONDITIONAL PASS`, `FAIL`, or `NEEDS CLARIFICATION` decision.

Do not invent thresholds, baselines, expected values, or business rules. Record missing information as assumptions, risks, or `NEEDS CLARIFICATION`. Do not modify source data. If evidence is missing, do not claim PASS.
```

## Invocation Notes

- Use [`data-quality-validation.template.md`](data-quality-validation.template.md) for the output structure.
- Use [`data-quality-validation.example.md`](data-quality-validation.example.md) as a completed example.
- Replace every angle-bracket placeholder before execution.
- Provide evidence paths or query outputs for every reported check.
