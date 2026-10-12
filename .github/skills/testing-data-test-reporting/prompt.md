# Data Test Reporting Prompt

Consolidate the supplied data-testing evidence into one traceable report for `<RELEASE_OR_PIPELINE>`.

Inputs:
- Requirements and acceptance criteria: `<PATH_OR_CONTENT>`
- Test cases and execution results: `<PATH_OR_CONTENT>`
- ETL logs and rejected records: `<PATH_OR_CONTENT>`
- Data-quality findings: `<PATH_OR_CONTENT>`
- SQL validation outputs: `<PATH_OR_CONTENT>`
- Dashboard defects and evidence: `<PATH_OR_CONTENT>`
- Release criteria and reporting period: `<PATH_OR_CONTENT>`

Use `references/data-test-reporting.template.md` and save the report under `working-artifacts/testing/data-test-reports/` as `DTR-<RELEASE-OR-PIPELINE-ID>-<NAME>.md`.

Reconcile distinct requirements and cases without double-counting. Keep PASS, FAIL, BLOCKED, NOT RUN, SKIPPED, and NOT AVAILABLE separate. Include execution, data-quality, defect, traceability, failed-record, risk, and release sections. Do not invent evidence or root causes.
