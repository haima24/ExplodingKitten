---
name: plan
description: "Produce a review-ready implementation plan BEFORE any build verb runs — scope, resources, execution steps, cost, risks, rollback, and an approval log — for TL/client sign-off. Use before /infrastructure, /ci-cd, /alerting, or any outward change (/service-connection is covered by the infrastructure plan, /sre-agent by the alerting plan; /monitoring is telemetry-only and needs none). The plan template is embedded in this skill and materialized on demand; the build verbs require a named-approved plan."
---

# rnd-devops · plan

`/rnd-devops plan <verb> [target]` — write the implementation plan for a build verb (`infrastructure`, `ci-cd <service>` or `alerting <service>`; `service-connection` needs **no plan of its own** — the infrastructure plan covers the identity it wires, it just needs a named go-ahead) as a reviewable document, get it **named-approved by the TL/client**, and only then hand off to the build verb. This runbook is fully **self-contained**: it *materializes* the embedded template into a real plan file, fills it from the target verb's own runbook (never from imagination), and routes it for review.

**Why this exists:** `terraform apply`, `az pipelines create`, and service connections are shared-state, billable, outward actions. A chat go-ahead is consent; a reviewed plan is *informed* consent — the TL/client sees exactly what will be created, what it costs, and how it rolls back, before anything runs.

## How it works (the whole trick in 3 lines)
1. **Materialize** — write the template in *§ Embedded plan template* to `docs/plans/<yyyy-mm-dd>-<verb>-<target>.md` and fill every section **from the build verb's runbook** (its resource table, its steps, its guardrails) + the live context (`.rnd-devops/infra-state.json`, the service repo).
2. **Review** — the plan stays **local**: show it to the TL/client (in chat, or as the file on disk) and record their named approval in the Approval log. Publishing it (branch → commit → push → PR) is the operator's own call, with commands you hand them. **You never push and never open the PR.**
3. **Hand off** — run the matching build verb, referencing the plan. Any deviation discovered during execution goes back into the plan as a delta + re-review.

## Step 1 — Gather inputs (don't invent, ask)
- **Verb + target**: which build verb, which service/env (e.g. `plan infrastructure dev`, `plan ci-cd simplcommerce`, `plan alerting simplcommerce`).
- **Live context**: read `.rnd-devops/infra-state.json` if present (existing RG/ACR/AKS names); check for an existing pipeline/service connection so the plan says *modify* instead of *create* where true.
- **The source of truth**: open the target verb's own `SKILL.md`. The plan's resource list, steps, and guardrails are **copied from there** — a plan that drifts from what the runbook will actually do is worse than no plan.
- Anything you can't determine → an entry in **Open questions**, not a guess.

### Step 1b — Design knobs: ask the operator, never default silently
The build verbs ship safe defaults, but a plan that silently inherits them hides the very decisions the reviewer is signing off on (which VM, how many nodes, SRE Agent or not). **Before writing the file**, settle every knob below with the operator — auto mode: run the lookup commands yourself; guided mode: show them and wait for the pasted output. Each answer lands in **three places with the same value** — the plan header, §3, and §3a *tfvars overrides* — so the plan and the eventual `terraform.tfvars` cannot drift.

For `infrastructure`:

| Knob | tfvars key | Default | How to decide / verify |
|---|---|---|---|
| Subscription | `subscription_id` | — | `az account show --query "{id:id,name:name}" -o json`. Wrong sub → `az account set --subscription <id>` and re-check. **Never leave a placeholder** in the header. |
| Resource group | `existing_resource_group_name` | empty → create `<prefix>-<env>-<suffix>-rg` | **Ask:** was the operator *given* a resource group (shared subscription, one per team)? Then its name goes here, Owner on that group is enough, and `location` is ignored — the stack follows the group's region. Add an *Open question* unless the admin has confirmed the **14 resource providers** in GETTING-STARTED §1.3 are `Registered` — the team account can't register (or usually read) them and a miss kills the apply at the AKS step. Otherwise leave empty (needs subscription-level Owner/UAA). |
| Region | `location` | `southeastasia` | must have quota for the VM family chosen next; irrelevant when deploying into an existing group (its region wins) |
| Node VM size | `node_vm_size` | `Standard_B2ms` | `az vm list-usage --location <region> -o table` — read the `Standard <Family> vCPUs` row of the candidate family: its limit must be ≥ vCPU-per-node × max nodes. A family at limit `0` (e.g. DSv5 on small subs) is out, whatever the docs say. |
| Node pool sizing | `node_count` / `node_min_count` / `node_max_count` | 2 / 2 / 4 | vCPU at max nodes must fit the `Total Regional vCPUs` row of the same output |
| Control-plane tier | `sku_tier` | `Free` | prod → `Standard` (uptime SLA) |
| SRE Agent | `create_sre_agent` | `false` | on/off is a **reviewer decision** (bills agent units). If **on**, also settle `sre_agent_location` (`eastus2` / `uksouth` / `swedencentral` / `australiaeast` — the agent RP is not in SEA; cross-region is fine), `sre_agent_access_level` (`Low`), `sre_agent_action_mode` (`Review`), `sre_agent_monthly_unit_limit` (`10000`). |

For `ci-cd`:

| Knob | Where it lands | Default | How to decide |
|---|---|---|---|
| **CI provider** | which pipeline file the kit materializes — `azure-pipelines.aks.yml` **or** `.github/workflows/deploy-aks.yml` — and which auth `service-connection` wires | `azure-pipelines` | **Ask.** `azure-pipelines` needs an ADO org with a hosted parallel job (or an online self-hosted agent). `github-actions` needs only a GitHub account — pick it when the operator has no ADO agent (new org, no billing link, no laptop agent) or already works on GitHub. One provider per service; write it in the header so `service-connection` and `ci-cd` read the same answer. |
| **Security scans** | `securityScan` pipeline parameter (`az pipelines run --parameters securityScan=<value>`) | `report` | **Ask outright — this is the reviewer's call, not yours.** `gate` = a finding fails the stage and Deploy never runs (mandatory for shared/prod). `report` = the four scans run and log warnings, Deploy proceeds (the training default). `skip` = **no Security stage at all**, `Build → Deploy`, for demo/dev when the exercise is purely build-and-ship. Anything other than `gate` also needs the *Risks* line below. **Refuse `skip` for a shared or production target** — offer `report`. |
| Agent pool | *(azure-pipelines only — GitHub Actions uses hosted `ubuntu-latest`; write `GitHub-hosted (ubuntu-latest)` and skip the grant check)* the kit's three `pool:` lines | `vmImage: ubuntu-latest` (**Microsoft-hosted — the default; do NOT ask**) | Write `Microsoft-hosted (ubuntu-latest)` into the header unless the operator explicitly asks for self-hosted. Check the grant with `az devops invoke --area distributedtask --resource resourceusage --query-parameters parallelismTag=Private poolIsHosted=true includeRunningRequests=true --api-version 7.1-preview -o json --query resourceLimit.totalCount` (**`--query-parameters`**, not `--route-parameters` — the latter yields `resourceLimit: null`, which means the check is malformed, not that the grant is missing). `≥ 1` → nothing to note. `0` → still plan hosted, and add a *Risk* + *Open question*: "org has no Microsoft-hosted parallel job yet — request the free grant (aka.ms/azpipelines-parallelism-request) or link Billing and set Microsoft-hosted paid = 1 before the first run". Self-hosted (`pool: { name: <pool> }`, host needs Docker + .NET SDK, `az pipelines agent list --pool-id <id>` must show an **online** agent) is an operator-initiated alternative, never a question you raise because a check returned `null`. |
| Service identity | `imageName` / `k8sNamespace` | the service slug (`simplcommerce`) | keep them equal to the service name unless the operator renames it consistently |
| Target repo + branch | `az pipelines create --repository/--branch` — or, on GitHub, the `<owner>/<repo>` the workflow lands in | the operator's own ADO or GitHub repo, `main` | never the demo org — the pipeline lives where the operator can write |

Write each decided value into the plan as-is. A knob the operator can't decide yet still gets the proposed value in the header, tagged `(proposed)`, **plus** an Open-questions entry — the reviewer must see a concrete number, not a blank. **Exception — ADO org / project / repo (or the GitHub `<owner>/<repo>`):** these are never proposed and never taken from docs, examples or the SimplCommerce source URL. Resolve them **per service** — `services.<service>.ado.{project,repo}`, flat `service_connection` only as legacy fallback (the resolver in *ADO organization / project* in `copilot-instructions.md`) — or **ask the operator before filling the plan**; a plan for a service in a second ADO project must name *that* project, not whichever one another service uses; if still unknown, the header row says `<ask operator>` and the Open question has no candidate value (see *ADO organization / project* in `copilot-instructions.md`).

## Step 2 — Materialize + fill the plan
Write the template below to `docs/plans/<yyyy-mm-dd>-<verb>-<target>.md`. Filling rules:
- **Header**: fill `Resource group`, `Region`, `Node pool`, `SRE Agent` (infrastructure) or `CI provider`, `Security scans`, `Agent pool` (ci-cd) from Step 1b — these rows are how a reviewer sees the design at a glance. `SRE Agent: off` and `Security scans: skip` are valid, explicit answers; a missing row is not. Drop the rows that don't apply to the verb.
- **Resources & changes**: for `infrastructure`, copy the resource-set table from that skill, then:
  - give the **node pool its own row** (`system` pool · `<vm_size>` · `<min>–<max>` autoscaling · vCPU at max) instead of burying it in the AKS row's Notes;
  - **SRE Agent on** → list its full resource set as rows (agent UAMI, App Insights, `Microsoft.App/agents` resource, Log Analytics connector, Azure Monitor connector, the RBAC assignments), so the reviewer sees the 12 extra resources they are approving. **Off** → one line in *Out of scope* naming the follow-up.
  - fill **§3a tfvars overrides** with exactly the non-default lines the operator will write into `tf/terraform.tfvars` — this block is what the build verb copies at its Step 0, so it must match the header and §3 verbatim.
  For `ci-cd`, list the file set it materializes + the three pipeline stages and what gates what — **including the `securityScan` posture being asked for** (`gate` · `report` · `skip`) and, if it isn't `gate`, one line in *Risks* saying what that leaves unguarded and when it flips back. A `skip` that isn't in the approved plan is not a choice the build verb may make on its own.
  For `alerting`, list every Azure resource the verb creates — the action group (+ its receiver e-mail) and the alert rules `<service>-pod-crash` and `<service>-5xx` with the **5xx path** taken from `infra-state.json` → `services.<service>.telemetry.path` (`A` = `requests`, `B` = `ContainerLogV2`; `monitoring` declared it — if it's missing, the plan says "run monitoring first", it doesn't guess) — plus the **drills** that will prove each alert and their rollbacks. This plan also covers the `sre-agent` verb that follows: name the **response plan**, its scope (RG or the two rules) and its approval mode (**Review**). Cost is small but not zero (alert-rule evaluations, App Insights ingestion already created by `monitoring`): give the number.

  **Then settle the drill order — it changes §4's shape.** Read `jq -r '.sre_agent_name // "none"' .rnd-devops/infra-state.json`:
  - **A name** → the stack has an SRE Agent, so the plan interleaves two verbs: `alerting` creates the rules and records them at `"proven": false`, **`sre-agent` wires the response plan**, and only then do the drills run — one drill proving the rule `Fired` *and* the incident. Give §4 a **`Verb`** column so the reviewer sees the hand-off, add the **`Order`** header row, and say in §2 that state is written twice (`proven: false` → `proven: true`). Never write a plan whose drills sit before the response plan: `sre-agent`'s own definition of done needs a drill, so that order pays for the breakage twice.
  - **`none`** → single-verb plan, drills right after the rules; drop the `Order` row and the `Verb` column, and put "no SRE Agent on this stack — alerts page the action group only" in *Out of scope* with what enabling it takes.

  **Re-planning a service whose alert set already exists** (`services.<service>.alerts` present in `infra-state.json`): verify against Azure first — `az monitor scheduled-query list -g <RG> -o table` and `az monitor action-group show` — then write those rows as **Exists**, not *Create*, and scope §4 to what is genuinely left. If the rules were already drill-proven under the old order but no response plan covered them, say so plainly: the incident half is unproven and one more drill is needed to close it.
- **Execution steps**: numbered, each with its **verify** (command + expected output) — lift them from the runbook's own steps.
- **Cost estimate**: honest monthly figures (node VMs at baseline **and** at max nodes, load balancer, ACR, Log Analytics ingestion, SRE Agent units + its App Insights if enabled). Ranges are fine; "TBD" is not — put a number or an open question.
- **Risks**: include the runbook's known failure modes (e.g. AKS RBAC lockout, AcrPull needs `roleAssignments/write`, connector PUT timeouts).
- Status starts at `Pending review`.

## Step 3 — Review (the plan stays local — you never push it)

**Write the file, then stop touching git.** Plans live under `docs/plans/` in the **skills repo (`ai-workshop-devops`)** — the one repo you never push to. (The service repo is different: there, `ci-cd` and `operations` do push, on a named go-ahead.) A training operator typically has no write access here anyway, and the review that matters is a human reading the plan.

**Default — local review:**
1. Show the plan: the file path, plus the header + §2 Scope + §5 Cost + §6 Risks inline in chat, so the reviewer can read it without opening anything.
2. The TL/client replies with a named approval (or asks for changes — edit the file in place and show it again).
3. Record it in the **Approval log**: who, when, and *how* (“approved in chat by <name>, <date>”). Set Status to `Approved`. **That log entry is the go-ahead the build verb checks** — a PR link is one valid form of it, not the only one.

**If the operator does want it published** — client-facing work, or a repo they can write to — hand them these commands with the placeholders already resolved, and let them run them:
```bash
git checkout -b plan/<verb>-<target>
git add docs/plans/<yyyy-mm-dd>-<verb>-<target>.md
git commit -m "plan: <verb> <target> (<env>)"
git push -u origin plan/<verb>-<target>
# then open the PR with the TL/client as reviewer — and never merge it yourself
```
Reviewer approves the **PR** → Status `Approved`, Approval log gets who/when/the PR link. Changes requested → update the plan on the same branch, re-request review.

## Step 4 — Hand off to the build verb
- Only run `/rnd-devops <verb>` once the plan's Approval log shows a **named Approved**. Reference the plan file in the go-ahead (e.g. "apply rnd-dev per docs/plans/2026-08-28-infrastructure-dev.md").
- **Deviations during execution** (a resource renamed, an extra role needed, a cost surprise): stop, append a `## Delta` section to the plan describing the change, get it re-acknowledged, then continue. The merged plan must end up describing what actually happened.

## Guardrails
- **No build verb runs against a plan that isn't named-approved.** A missing plan or a `Pending review` status blocks execution — that's the point.
- **The plan mirrors the runbook.** Copy resource tables/steps from the build skill; never describe actions the runbook won't take.
- **Never push the plan and never open its PR** — write the file, hand over the commands. And if the operator does publish it, **never merge that PR yourself** — the human reviewer merges. Same rule as every PR in this suite.
- **Honest costs and risks.** An optimistic plan that gets approved is a lie with a signature.
- **No silent defaults.** Every Step 1b knob appears in the header with a concrete value (or `(proposed)` + an open question). A plan whose subscription reads `<fill in>`, whose SRE Agent row is missing, or whose ci-cd `Security scans` row was never put to the operator is not review-ready — inheriting `report` silently is exactly the hidden decision this rule exists to stop.
- **An `alerting` plan on a stack with an SRE Agent puts the drills AFTER the `sre-agent` step.** Drills are deliberate breakage and `sre-agent` needs one as its own verify — a plan that schedules them first has the operator break the service twice for one proof.
- **Re-planning over live resources says *Exists*, not *Create*.** Verify with `az` before writing the table; a plan that claims to create what is already there hides what the reviewer is actually approving.
- One plan per verb+target+env; a re-run of the same verb updates the existing plan (new dated file only for a genuinely new scope).

---

## § Embedded plan template

Write this block to `docs/plans/<yyyy-mm-dd>-<verb>-<target>.md` (Step 2) and fill every section.

```markdown
# Plan — <verb>: <target> (<env>)

| | |
|---|---|
| **Author** | <name> (via Copilot) |
| **Date** | <yyyy-mm-dd> |
| **Verb / target** | `/rnd-devops <verb> <target>` |
| **Environment** | <dev/staging/prod> · subscription `<id>` (`<name>`) · region `<location>` |
| **Resource group** | *(infrastructure)* **create** `<prefix>-<env>-<suffix>-rg` — or — **existing** `<name>` (pre-created by admin · Owner at RG scope · region follows the group) |
| **Node pool** | `<vm_size>` × <min>–<max> (autoscaling) · <n> vCPU at max · tier `<Free/Standard>` |
| **SRE Agent** | *(infrastructure)* **on** · region `<sre_agent_location>` · access `<Low/High>` · mode `<Review/Automatic>` · cap <units>/mo — or — **off** (follow-up plan) |
| **CI provider** | *(ci-cd)* `azure-pipelines` — ADO service connection + `azure-pipelines.aks.yml` — or — `github-actions` — OIDC federated credential + `.github/workflows/deploy-aks.yml` |
| **Security scans** | *(ci-cd)* `gate` — scans block Deploy — or — `report` — scans run, findings logged as warnings — or — `skip` — **no Security stage**, `Build → Deploy` (demo/dev only) |
| **Agent pool** | *(ci-cd)* `Microsoft-hosted (ubuntu-latest)` — or — `self-hosted: <pool>` |
| **Alert set** | *(alerting)* `<service>-pod-crash` · `<service>-5xx` via `requests` / `ContainerLogV2` · action group → `<email>` · SRE response plan `<name>` (Review mode, scope `<RG / the two rules>`) · proven by `<simulated failure(s)>` |
| **Order** | *(alerting, only when the stack has an SRE Agent)* rules → `sre-agent` response plan → **then** the drills — one drill proves the rule `Fired` *and* the incident |
| **ADO org / project — or GitHub repo** | *(ci-cd)* `https://dev.azure.com/<org>` · `<Project>` — or — `github.com/<owner>/<repo>` — the operator's own, from `infra-state.json` or asked; never proposed |
| **Status** | Pending review · Approved · Rejected |

## 1. Summary
<3 sentences max: what will be built/changed, why, and when it should run.>

## 2. Scope & deliverables
- <deliverable 1 — e.g. "AKS stack rnd-dev: RG, VNet, ACR, AKS, Log Analytics">
- <deliverable 2>

## 3. Resources & changes
| Action | Resource | Name | Notes |
|---|---|---|---|
| Create | <type> | `<name>` | <sku/size/why> |
| Create | AKS node pool | `system` | `<vm_size>` · <min>–<max> autoscaling · <n> vCPU at max |
| Create | SRE Agent (+ UAMI, App Insights, 2 connectors, RBAC) | `<prefix>-<env>-<suffix>-sre-agent` | <only when on — one row per resource> |

> **Naming in this table:** the infrastructure verb bakes a random 4-char `<suffix>` into every name (`<prefix>-<env>-<suffix>-rg`, `<prefix><env><suffix>acr`, `<prefix>-<env>-<suffix>-aks`, node RG `…-aks-nodes-rg`). It is generated at apply time, so write the **pattern** with `<suffix>` here — never a literal `rnd-dev-rg` / `rnddevacr`, and never a hand-picked `-01`. The real names land in `.rnd-devops/infra-state.json` after apply.
| Modify | <type> | `<name>` | <what changes> |

### 3a. tfvars overrides (copy-paste into `tf/terraform.tfvars` at the build verb's Step 0)
```hcl
subscription_id = "<id>"
prefix          = "<prefix>"
env             = "<env>"
location        = "<location>"
# name_suffix   = "<suffix>"         # leave UNSET (random) unless re-attaching to a known stack
node_vm_size    = "<vm_size>"        # only the lines that differ from the defaults
# create_sre_agent   = true           # + sre_agent_location / access_level / action_mode when on
```

## 4. Execution steps
| # | Step | Verify (command → expected) |
|---|---|---|
| 1 | <step> | `<command>` → <expected output> |

<!-- alerting on a stack WITH an SRE Agent: add a Verb column and interleave, so the reviewer
     sees that the drills come after the response plan and prove both halves in one run:

| # | Verb | Step | Verify (command → expected) |
|---|---|---|---|
| 1 | `alerting` | action group + the two rules | rules `Enabled` |
| 2 | `alerting` | record `alerts` in state at `"proven": false` | rule names readable by `sre-agent` |
| 3 | **`sre-agent`** | response plan scoped to the two rules, Review mode (named go-ahead) | plan saved; agent `Succeeded` / `AzMonitor` |
| 4 | both | drill → rule `Fired` **and** incident with the plan attached | Resource Graph + sre.azure.com |
| 5 | `alerting` | rollback, then flip `alerts.proven` to `true` + record `sre` | app 200; state has both blocks |
-->

## 5. Cost estimate (monthly)
| Item | Est. cost | Basis |
|---|---|---|
| <e.g. 2× Standard_D2s_v5> | ~$<n> | <region, hours> |
| **Total** | **~$<n>/mo** | |

## 6. Risks & mitigations
| Risk | Impact | Mitigation |
|---|---|---|
| <risk> | <impact> | <mitigation> |

## 7. Rollback / teardown
<How to undo: e.g. "prevent_destroy blocks accidental destroy; deliberate teardown = remove lifecycle blocks + terraform destroy with env confirmation. Pipeline: az pipelines delete; deployed app: kubectl delete ns.">

## 8. Out of scope
- <explicitly not doing X>

## 9. Open questions
- [ ] <question the reviewer must answer before/at approval>

## 10. Approval log
| Date | Reviewer | Role | Decision | Record |
|---|---|---|---|---|
| <yyyy-mm-dd> | <name> | TL / client | Approved / Rejected / Changes requested | <PR link or chat ref> |

> Rule: no `terraform apply`, no `az pipelines create`, no service connection is created until this log shows a named **Approved**.

## Delta (post-approval changes, if any)
| Date | What changed vs. the approved plan | Acknowledged by |
|---|---|---|
```

---

> This runbook is standalone — the embedded template above is its own source. Edit it directly in the block above.