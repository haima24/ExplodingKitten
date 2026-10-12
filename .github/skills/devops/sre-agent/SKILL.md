---
name: sre-agent
description: "Finish the Azure SRE Agent BY HAND — everything Terraform cannot declare: the response plan scoped to a service's alerts (the piece that turns a Fired alert into an incident), the ADO + Teams connectors (OAuth), per-teammate RBAC, and the functional verify (a drill shows up as an incident at sre.azure.com). Portal-only: in both modes you walk the operator through each click with placeholders resolved and verify what they report back. Use after alerting has CREATED the rules — on a stack with an agent, alerting holds its drills until this verb's Step 5, so one drill proves the rule AND the incident; operations consumes the incidents this produces. No plan of its own — covered by the alerting plan."
---

# rnd-devops · sre-agent

`/rnd-devops sre-agent [service]` — the **manual half** of the Azure SRE Agent. Terraform (`/rnd-devops infrastructure`, `create_sre_agent = true`) creates the agent, its App Insights, the Log Analytics + Azure Monitor connectors and the RBAC. What it **cannot** declare — because these are data-plane objects on the agent's endpoint or OAuth consents — is done here, on **https://sre.azure.com**:

1. the **response plan** scoped to the service's alerts — *the* piece that makes a `Fired` alert become an incident,
2. the **ADO** and **Teams** connectors (so investigations reach tickets and chat),
3. **RBAC** for each teammate (the apply only covers whoever ran Terraform),
4. the **functional verify**: a drill → an incident appears with the plan attached.

**Why a separate verb:** *"the agent didn't detect it"* is the #1 confusion in this platform, and it is never detection — the agent *ingests* every fired alert via its Azure Monitor connector but only **opens and investigates** an incident when a response plan covers the alert. Bundled at the end of the alerting runbook, this step got skipped as "portal-only". It is not optional and it has its own definition of done.

## Portal-only means WALKED, not skipped
You cannot click for the operator in either mode. You still **run** every step: print the numbered items with the placeholders resolved from `.rnd-devops/infra-state.json`, explain what each does, **wait** for the operator to confirm (or paste what they see), then verify what you can from the CLI. Ending with "the rest is in the portal" is not done.

## Prerequisites
- **Agent provisioned** — `/rnd-devops infrastructure` applied with `create_sre_agent = true` (Step 0 checks).
- **Rules exist** — `/rnd-devops alerting <service>` recorded `services.<service>.alerts` in `infra-state.json`. A response plan scopes by **rule name**, so `"proven": false` is enough to start: on a stack with an agent, `alerting` deliberately holds its drills until Step 5 here, and that one drill proves the rule *and* the incident. If the drills already ran, nothing changes — Step 5 just re-runs one.
- **No plan of its own** — the alerting plan's *Alert set* row names the response plan and its approval mode. A **named go-ahead** before creating the plan is still required (it decides what the agent may do to a live service).

## Step 0 — Does this stack have an agent? Decide out loud
```bash
AGENT=$(jq -r '.sre_agent_name // empty' .rnd-devops/infra-state.json)
RG=$(jq -r .resource_group .rnd-devops/infra-state.json)
[ -n "$AGENT" ] || AGENT=$(az resource list -g "$RG" --resource-type Microsoft.App/agents --query "[0].name" -o tsv)   # pre-2026-09-07 state files
```
- **A name** → continue.
- **Empty** → the stack was applied with `create_sre_agent = false`. **Say so in plain words:** *"this stack has no SRE Agent — alerts page the action group only. To get the SRE loop: set `create_sre_agent = true` (+ `sre_agent_location`) in `tf/terraform.tfvars`, re-plan/re-apply via `/rnd-devops infrastructure` (its *Optional — Azure SRE Agent* section), then run this verb."* Record it as an open item in the alerting plan / runbook and stop here. Never let this verb vanish silently.

Confirm the ARM side is healthy before touching the portal:
```bash
AGENT_ID=$(az resource show -g "$RG" -n "$AGENT" --resource-type Microsoft.App/agents --query id -o tsv)
az resource show --ids "$AGENT_ID" --query "{state:properties.provisioningState, incidents:properties.incidentManagementConfiguration.type}" -o json
```
→ `state: Succeeded`, `incidents: AzMonitor` (the incident platform is already wired by the apply).

## Step 1 — Open the agent
1. Open **https://sre.azure.com** → pick **`<AGENT>`**. The knowledge graph should show the stack's RG (`<RG>`).
2. *"Access requirement: … requires an SRE Agent Reader role or higher"* → the operator lacks RBAC on the agent (the apply grants it only to whoever ran Terraform). Fix from the CLI, then reload:
   ```bash
   az role assignment create --assignee <operator-object-id> --role "SRE Agent Administrator" --scope "$AGENT_ID"
   ```

## Step 2 — Connectors

> **The preview portal moves these panels. Verify the path, don't recite it.** If a path below isn't where the operator is looking, have them search the agent's own settings for the integration by name and **tell you what they actually see** — then fix this table. Observed drift: the ADO integration left *Connectors* for *Code access configuration* between 2026-08 and 2026-09-09.

| Connector | Who creates it | Check |
|---|---|---|
| **Log Analytics** | Terraform | portal → *Connectors* shows it; ARM `Succeeded` |
| **Azure Monitor** | Terraform | **shows "Failed"** with *"Status not available for connector type 'AzureMonitor'"* — a preview-UI limitation, **not** a real failure. ARM `Succeeded` is the truth. The portal also **cannot re-create** this type — if it is ever deleted, PUT it back via ARM using the recipe in `infrastructure/assets/main.tf.md`. |
| **Azure DevOps** | **operator, portal** | **Not under *Connectors* — verified 2026-09-09 on `rnd-dev-4ueh-sre-agent`:** it lives at **Code access configuration → tab *Azure DevOps* → *Add repository***, and ADO is wired per **repository as a knowledge source**, not as one org-wide connector. Org from `service_connection.org`, repo + project from `services.<service>.ado.{project,repo}` (flat `service_connection.project` only as legacy fallback — see *ADO organization / project* in `copilot-instructions.md`); the operator's own, never the read-only demo org. **Add one entry per repo/project** whose services this agent covers — an incident can only reach a project the agent is connected to. |
| ↳ **its sign-in method** | operator's choice — **recommend in this order** | **1. Managed Identity** — no secret at all; reuses the agent UAMI Terraform already created, but the UAMI must first be added to the ADO org as a member with repo/work-item access. **2. Your account** — OAuth consent; the pragmatic workshop path. **3. PAT** — last resort: a long-lived personal secret that **expires and breaks the integration silently** (no alert tells you), is tied to one person, and needs manual rotation. If a PAT is unavoidable: shortest workable expiry, scopes `Code (Read)` + `Work Items (Read & Write)`, **never** pasted into chat or a repo, and its **expiry date written into the service runbook**. |
| **Teams** | operator, portal (OAuth) — optional | *Connectors → Add → Microsoft Teams* → pick the ops channel — **path unverified since the ADO panel moved**; if *Connectors* has no *Add*, have the operator find it and report back. Skip in a workshop if no tenant admin consent is available; say so. |

> **Unconfirmed — where work-item linking is switched on.** The *Code access configuration* panel carries **Capabilities** toggles (a `Code` toggle is visible; others were cut off in the only observation so far). Whether ADO **work-item** create/link is enabled by a toggle there, or configured somewhere else entirely, is **not yet established** — do not assert either way. Have the operator expand that panel, record what the toggles are, and update this file. Either way it is **not blocking**: the incident proof in Step 5 needs the response plan, not the ADO integration, so finish Step 3 and note this as an open item.

## Step 3 — Response plan (the piece that opens incidents)
Do this once per environment — one plan can cover every alert in the env. Read the intended scope and approval mode **from the alerting plan's Alert set row**; don't invent them.

**The wizard — two pages, fields as verified 2026-09-09** on `rnd-dev-4ueh-sre-agent` (`Incidents` → `Create incident response plan`):

| Page 1 field | What to put | Why |
|---|---|---|
| **Incident response plan name** | `<service>-response` | the name the alerting plan declared |
| **Severity** | the rules' severity (**`Sev1`** for the standard set) — **not** the `All severity` default | `All severity` + no title filter makes the plan swallow every incident the agent sees, including services added later. That is broader than what the reviewer approved. |
| **Title contains** | the service prefix, e.g. `<service>` | **This is the only scoping mechanism — there is no resource-group or alert-rule picker.** Scope is *severity + incident-title keywords*. Since the standard rules are `<service>-pod-crash` and `<service>-5xx`, one prefix keyword covers exactly those two and nothing else in the stack. |
| **Title does not contain** | usually empty | exclusions only if a matching rule must be kept out |
| **Response subagent** | `Meta Agent` | only option offered (2026-09-09); not a decision |
| **Agent autonomy level** | **`Review`** — the default is **`Autonomous`** | ⚠️ see the warning below |
| **Alert reinvestigation cooldown** | default `Enable` + `3` hours | skips reinvestigation when the same plan already started one inside the window — a **drill hazard**, see Step 5 |

> ⚠️ **`Agent autonomy level` defaults to `Autonomous` — change it to `Review` before you Create.** `Autonomous` lets the agent *independently perform mitigation or resource modifications* on a live service. The field is easy to miss: it sits **below** the Subagent section, off-screen until you scroll.
>
> **Two independent switches, and this one defaults wrong.** Terraform's `sre_agent_action_mode = Review` governs the **agent**; every response plan carries its **own** autonomy level that defaults to `Autonomous` regardless. Setting the agent to Review does **not** make its plans Review. Check the plan's field, every plan, every time.

> **There is no playbook field.** Earlier versions of this runbook told the operator to type an investigation playbook ("check pod status → read logs → correlate → propose"). No such input exists — the investigation logic lives in the subagent. Don't promise it; put the human-facing procedure in the service runbook instead (`/rnd-devops documentation runbook <service>`).

**Page 2 — `Incidents preview`: use it, it is the real scope check.** It lists the incidents matching your filter, pulled from the **incident platform** (Azure Monitor), which is *not* the same list as the *Incidents* page (that one shows only incidents with an agent investigation) — the dialog says so itself. So a stack whose alerts have fired before **will** show rows here even though no agent investigation ever ran. Read it as a filter validator:
- **Exactly the intended rules appear, nothing else** → the scope matches what was approved. (Verified 2026-09-09: `Sev1` + `Title contains projecttemplate-frontend` returned exactly `projecttemplate-frontend-5xx` and `projecttemplate-frontend-pod-crash`, both `Resolved` from the earlier drills.)
- **Something extra appears** → the keyword is too loose; go Back and narrow it.
- **Empty** → either nothing has ever fired (fine — a fresh stack), or the filter is wrong. Distinguish the two from the alert history before you accept it.

Then **Create**, and ask the operator to paste the plan's name exactly as shown.

## Step 4 — RBAC for teammates
The apply granted **SRE Agent Administrator** only to the identity that ran Terraform. For each teammate who will open incidents:
```bash
az role assignment create --assignee <teammate-object-id> --role "SRE Agent Administrator" --scope "$AGENT_ID"   # or "SRE Agent Reader" for read-only
```

## Step 5 — Verify functionally (the only real check)
Run the drill from `alerting` Step 3 (pod-crash is the most reliable) — on an agent stack this **is** `alerting`'s pending drill, not a second one — or `/rnd-devops simulate` (Path B is fastest). Within **~5–10 min** of the alert firing, **sre.azure.com → Incidents** shows a row for `<service>-pod-crash` with **Severity Sev1**, **Agent status: In progress**, and **your response plan attached**. That incident — not a `Fired` alert in Azure Monitor — is what `/rnd-devops operations` consumes.

> **Cooldown can eat a second drill.** The plan's *Alert reinvestigation cooldown* (default **3 h**) skips reinvestigation when that same plan already began one inside the window. So if the first drill shows no incident and you fix the filter and re-drill straight away, the silence may be the cooldown, **not** the fix failing. Either wait it out, or uncheck `Enable` on the plan while proving it and restore the setting afterwards. A first-ever drill is never affected — no investigation has begun yet.

The same drill is `alerting`'s proof, so **check both outcomes in this one run** (`Fired` in Resource Graph + the incident here), run `alerting`'s rollback, then go finish `alerting` Step 4: flip `alerts.proven` to `true` and record the `sre` block below.

| Symptom | Cause | Fix |
|---|---|---|
| Alert `Fired` in Azure Monitor, **no incident** | response-plan **scope doesn't match** the alert (wrong RG / rule names) | edit the plan's scope; re-drill |
| Same, and *Connectors* lacks Azure Monitor | connector deleted | PUT it back via ARM (Step 2) — the portal can't |
| Incident appears, agent status **Waiting for approval** | plan is in Review mode — **this is correct** | a human approves the proposed action, or leaves it |
| Portal shows Azure Monitor connector **Failed** | preview-UI label | ignore; ARM `Succeeded` |

## Hand off
- Record in `.rnd-devops/infra-state.json` → `services.<service>.sre`:
  ```json
  { "agent": "<AGENT>", "response_plan": "<name>", "approval_mode": "Review", "connectors": ["log-analytics", "azure-monitor", "azure-devops"], "verified_incident_at": "<ISO-8601>" }
  ```
- Add the plan + connectors to the service runbook — `/rnd-devops documentation runbook <service>`.
- **Done here.** With the response plan proven by a drill, the observe → alert → incident loop is complete — this verb is the end of the required path.
- **Optional next:** `/rnd-devops operations` — turns the incidents this produces into a tracked ticket → hotfix PR → review. It is **not** required to call the platform done, and is still being finished (2026-09-09): offer it, don't assume it.

## Guardrails
- **`Agent autonomy level: Review`, never `Autonomous`** — and it is the **per-plan** field that counts, not Terraform's agent-level `sre_agent_action_mode`. `Autonomous` is the portal default, sits below the fold, and lets the agent modify live resources on its own. Prod plans never leave Review.
- **Named go-ahead before creating the response plan** — it decides what an agent may do to a live service.
- **Don't fight the portal's "Failed" label** on the Azure Monitor connector, and never delete/re-create that connector from the portal.
- **Done = an incident with the plan attached**, observed after a drill. Not a saved plan, not a `Fired` alert.
- **One drill, both proofs.** Coming from `alerting` with rules at `"proven": false`, Step 5's drill closes both verbs — don't send the operator back to break the service a second time.
- **Stays manual no matter what:** creating/editing response plans, ADO + Teams connectors (OAuth consent), per-teammate agent RBAC. Don't promise to script them — the data-plane API is undocumented preview.
