---
name: implementation-approaches
description: 'Bundled reference for selecting and applying Playwright automation implementation approaches A1 through A7.'
---

# Automation Implementation Approaches

Exactly one primary approach must be selected. Secondary approaches may supplement it.

| ID | Approach | How it works | Requires | Best for | Trade-offs |
| -- | -------- | ------------ | -------- | -------- | ---------- |
| A1 | Live browser exploration | Navigate the running application, capture accessibility or DOM snapshots, and derive locators and steps. | Reachable URL and valid test credentials | Highest locator accuracy and runtime-state flows | Slowest; needs environment and data |
| A2 | Frontend source analysis | Read component source to extract test IDs, roles, labels, and rendering conditions. | Frontend repository access | Stable semantic locators before deployment | Cannot confirm runtime content; do not modify app code |
| A3 | Static HTML or DOM artifact | Parse saved HTML, DOM snapshots, or exported markup. | HTML, DOM file, or snapshot | Offline work without environment access | May be stale and miss dynamic states |
| A4 | Design or specification driven | Derive steps from approved cases, mockups, or GUI specifications and mark placeholders `TODO-LOCATOR`. | Approved test case; optional mockups | Parallel work before UI exists | Locators require later confirmation; not runnable yet |
| A5 | Existing page-object reuse | Compose the spec from generated and reviewed page objects, components, fixtures, and utilities. | Reviewed page-object layer | Fast, consistent implementation | Blocked by page-object coverage gaps |
| A6 | API contract driven | Build API specs from OpenAPI, Swagger, Postman, or captured request traces. | Current contract or traces | API and integration coverage | Does not validate UI; contract can be stale |
| A7 | Recorder assisted | Start with Codegen or a trace, then refactor into project POM structure. | Reachable environment and recorder tooling | Rapid first draft of long flows | Raw output is unacceptable without refactoring |

Default when no preference or clarification is possible: A5 with A2, falling back to A4.

## Common Rules

1. Read approved cases and identify automation-eligible scenarios before choosing an approach.
2. Reuse page objects, components, fixtures, utilities, and test data before adding logic.
3. Keep arrange-act-assert flow traceable to expected results; do not add unsupported assertions.
4. Keep locators and page behavior in page objects or components.
5. Never modify system-under-test source code; automation assets may include specs, models, fixtures, data, and config.
6. Record the selected approach and locator evidence source in the spec header or handoff.
7. Mark A4 and A7 locators as unverified and flag locator confirmation as pending.
8. If missing hooks or unstable UI require an application change, report a recommendation or defect and hand off to development.