---
name: ba-functional-decomposition
description: Business analysis functional decomposition for breaking down a product, system, domain, module, epic, or vague business requirement into capabilities, functions, features, user stories, integrations, data/reporting needs, and release slices. Use for discovery, SRS scoping, backlog shaping, story mapping, estimation preparation, WBS alignment, or checking whether a system has been decomposed completely without mixing business functions with technical components.
---

# BA Functional Decomposition

## Core idea

Decompose business behavior before decomposing screens or technical components. A good decomposition shows what the system must enable, how work flows across users, and where each function becomes a feature, user story, API, data object, report, or operational process.

## Decomposition levels

Use these levels consistently:

| Level | Meaning | Example |
| --- | --- | --- |
| Business outcome | Why the product exists | Reduce manual order processing |
| Capability | Stable business ability | Manage orders |
| Function | Business activity inside a capability | Create order, approve order, cancel order |
| Feature | Product/system behavior that supports a function | Bulk order upload |
| User story/use case | Deliverable slice for one actor and value | As Sales Ops, I want to upload orders so that... |
| Task/subtask | Delivery work, not BA scope definition | Build parser, add DB migration |

Do not jump from outcome directly to tasks. Do not mix "Payment Service", "Database", or "API Gateway" as functional nodes unless the decomposition is explicitly technical.

## Workflow

1. Set boundaries.
   - Define product/system/module name.
   - State business objective and target users.
   - List in-scope and out-of-scope areas.
   - Identify external systems and organizational boundaries.

2. Create a context view.
   - Actors: users, admins, support, external systems, scheduled jobs.
   - Inputs: forms, files, API requests, events, master data.
   - Outputs: confirmations, records, reports, notifications, exports, API responses.

3. Identify top-level capabilities.
   - Use business nouns and verbs: Manage customer, Process claim, Register course, Reconcile payment.
   - Keep capabilities stable and independent of UI.
   - Group by business lifecycle, not by menu structure unless menus already reflect real business boundaries.

4. Break each capability into functions.
   - Use CRUD only as a starting point; add workflow, approval, validation, search, import/export, reporting, notification, audit, and exception handling.
   - Separate user-facing functions from background/system functions.
   - Mark source of truth and integration owner where relevant.

5. Convert functions into deliverable features/stories.
   - Identify actor, trigger, value, preconditions, data, rules, and acceptance focus.
   - Slice by workflow step, role, data variant, channel, integration dependency, or release priority.

6. Validate completeness.
   - Main path, alternate path, exception path.
   - Data create/read/update/delete lifecycle.
   - Permission and audit.
   - Import/export/report.
   - Notifications.
   - Integration handoff.
   - Configuration/master data.
   - Operational support/admin.

7. Prioritize and plan.
   - Arrange functions horizontally by user journey/story backbone.
   - Arrange depth vertically by must/should/could/later or release.
   - Identify MVP, dependencies, risks, and open questions.

## Output formats

Functional tree:

```text
System
  Capability 1
    Function 1.1
      Feature/User story
      Data/report/API implication
      Rule/exception
```

Decomposition table:

| ID | Level | Parent | Name | Actor/system | Trigger | Input | Output | Rule/data/integration notes | Priority | Open question |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

Story mapping view:

| Backbone step | Activity/function | MVP slice | Later slice | Notes/dependencies |
| --- | --- | --- | --- | --- |

## Slicing heuristics

- Slice by user role when roles have different goals or permissions.
- Slice by lifecycle state when behavior changes by status.
- Slice by data complexity when one variant is simpler than another.
- Slice by integration dependency when external readiness affects delivery.
- Slice by risk when a function must be proven early.
- Slice by release value when a smaller workflow can be used end to end.

## Quality bar

- Each child must belong to exactly one parent unless explicitly cross-cutting.
- Each function must have a business verb, actor/system, and outcome.
- Avoid decomposing only by UI screen.
- Keep NFRs and technical components linked as notes, not as functional branches.
- Preserve traceability from business objective to capability to story.
- Mark assumptions and gaps rather than forcing a neat tree.

## Saved Artifact Location

When the user asks to save this as a file, write it under `working-artifacts/functional-decomposition/<topic-or-task-name>/` at the workspace root (per the BA Agent's Artifact Output Location rule). Do not ask for confirmation before creating the folder; use a different location only if the user requests one.

## Source notes

Read `references/source-notes.md` for bundled source patterns used to shape this workflow.
