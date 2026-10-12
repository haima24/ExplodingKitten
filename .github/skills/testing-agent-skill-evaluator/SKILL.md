---
name: testing-agent-skill-evaluator

description: 'Use when evaluating another AI agent skill through baseline versus skill-enabled cases, assertion grading, benchmarking, and human-review feedback. Do not use to modify the target skill, evaluate without cases, or omit an output workspace; route authoring to agent-skill-authoring.'
---

# Testing Agent Skill Evaluator

## Purpose
Evaluate a target skill with repeatable cases, compare baseline and skill-enabled outputs, grade assertions with evidence, and produce adoption-review artifacts.

## Context First
Read the target skill, evaluation JSON, templates, scripts, and output workspace requirements. Ask when cases, baseline, or output location is missing; default baseline is no skill and label inconclusive assertions.

## Workflow
1. **Baseline.** Input: target skill, cases, and templates. Action: validate cases and prepare the output workspace. Output: evaluation inventory.
2. **Run baseline.** Input: each case. Action: execute without the target skill or with the supplied baseline. Output: baseline outputs and timing.
3. **Run skill.** Input: the same cases. Action: execute with the target skill enabled. Output: skill-enabled outputs and timing.
4. **Grade and compare.** Input: both result sets and assertions. Action: grade with evidence and calculate the actual comparison. Output: `evaluation-results.json`, `grading.json`, `timing.json`, and `benchmark.json`.
5. **Feedback and gate.** Input: comparison and findings. Action: create `feedback.json`, validate templates and evidence, and require human review. Output: adoption-review package.

## Output Contract
Save `evaluation-results.json`, `grading.json`, `timing.json`, `benchmark.json`, and `feedback.json` under `working-artifacts/skill-evaluator-reports/`. Every case and assertion must have evidence for both runs; final output must state that human review is required.

## Decision Rules
1. Missing or malformed cases block evaluation.
2. Vague cases are `needs-improvement`, not forced pass/fail.
3. Missing baseline defaults to no target skill.
4. Ambiguous assertions are `inconclusive` with the ambiguity as evidence.
5. Create the output workspace when absent.
6. Never auto-approve the target skill.

## Quality Gate
- [ ] All cases run in both modes and all assertions have evidence-based grades.
- [ ] Required JSON artifacts follow their templates and reflect actual results.
- [ ] Benchmark comparison is grounded in the two runs.
- [ ] Feedback is actionable and human review is explicitly required.

## Knowledge Sources
- Templates: `references/templates/evaluation-results-template.json`, `grading-template.json`, `feedback-template.json`, `benchmark.json`
- Validator: `references/scripts/validate_output.py`

## Related Skills
- `agent-skill-authoring`
- Any testing skill may be the evaluation target.
