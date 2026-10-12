Use the agent-skill-evaluator skill to evaluate the testing-implement-automation skill.

Target skill:
../testing-implement-automation

Evaluation file:
/references/evals/evals-testing-implement-automation.json

Output workspace:
/outputs

Run each eval case twice:
1. Without the target skill as baseline
2. With the target skill

For each run:
- Save generated outputs
- Capture timing and token usage
- Grade all assertions with evidence
- Create evaluation-results.json and timing.json

After all runs:
- Compare skill_enabled vs skill_disabled
- Create benchmark.json
- Add feedback.json for human review
- Recommend how to improve the target skill

Important:
Do not approve the skill automatically. The final output must clearly state that human review is required before adoption.


Use the testing-agent-skill-evaluator skill to evaluate the playwright-test-generator skill.

Target skill path:
../testing-implement-automation

Evaluation file:
/references/evals/evals-testing-implement-automation.json

Workspace output path:
workspace/skill-evaluation-workspace/iteration-1


For each eval case:
1. Run the prompt without the target skill and save output to without_skill/outputs.
2. Run the same prompt with the playwright-test-generator skill and save output to with_skill/outputs.
3. Grade each output against the assertions.
4. Create grading.json, timing.json, feedback.json, and benchmark.json.
5. Compare with_skill vs without_skill.
6. Recommend improvements for the playwright-test-generator skill.

Do not approve the target skill automatically. Include human review notes before final acceptance.