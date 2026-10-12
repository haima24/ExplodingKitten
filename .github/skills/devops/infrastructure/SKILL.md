---
name: infrastructure
description: "Provision the basic AKS stack (resource group, VNet + subnet, ACR, AKS, Log Analytics, ACR-pull role) with the Terraform carried in this skill's assets/*.tf.md files. Materialize each file's HCL block to a fresh tf/ dir, then plan → review → apply on a named go-ahead (never -auto-approve). Writes .rnd-devops/infra-state.json for the other skills. Runs auto (copilot executes) or guided (training — operator runs each shown command). Use to build the platform's infrastructure layer."
---

# rnd-devops · infrastructure

`/rnd-devops infrastructure` (alias `infra`) — provision the basic AKS stack (RG, VNet + subnet, ACR, AKS, Log Analytics, ACR-pull role) with the **Terraform code carried in this skill's [`assets/`](assets/)** as `*.tf.md` files. This runbook is fully **self-contained**: it *materializes* each file's HCL block into a real `.tf` file, then runs the ordinary `init → plan → review → apply → save-state` flow. Everything you need — preflight, the code, the guardrails — lives in this skill folder; nothing outside it is required.

The `assets/*.tf.md` files are the source of truth for THIS runbook — the mapping is in the name: **each `assets/<name>.md` holds exactly one `hcl` block that becomes `tf/<name>`**. Progressive disclosure applies — open them at Step 0 (or the one file you need when changing/explaining code), not to run the rest of the flow.

> **NEVER copy `.tf` files from another directory.** The HCL blocks in `assets/*.tf.md` are the single source of truth. Extract them verbatim — do not substitute files from elsewhere, and do not retype code from memory.

## How it works (the whole trick in 3 lines)
1. **Materialize** — for each `assets/<name>.md`, write its single `hcl` block to `tf/<name>`, in a fresh working dir.
2. **Provision** — `terraform init / fmt / validate / plan -out tfplan`, review the plan (flag any destroy/replace of stateful resources), get a **named go-ahead**, `apply tfplan`.
3. **Save state** — `terraform output -json infra_state > ../.rnd-devops/infra-state.json` so the other verbs can read it.

Full preflight, the lockout guard, and the complete guardrail set are below; the code is in `assets/`. The resource set it builds:

| Resource | Name pattern | Notes |
|---|---|---|
| Name suffix | `<suffix>` = 4 random lowercase alphanumerics | `random_string` kept in state — makes every name below unique per stack, so many people can provision into one subscription (RG, the globally-unique ACR, the subscription-unique AKS node RG) without colliding. Pin with `name_suffix` in tfvars only to re-attach to a known stack |
| Resource group | `<prefix>-<env>-<suffix>-rg` — **or** the pre-existing group named in `existing_resource_group_name` | holds everything below. Pre-existing → read-only data source, never created/deleted, its region wins; the resources inside still carry the suffixed names (shared-subscription workshops, see Preflight) |
| Log Analytics workspace | `<prefix>-<env>-<suffix>-law` | Container Insights → Azure Monitor |
| Virtual network + subnet | `<prefix>-<env>-<suffix>-vnet` / `-aks-subnet` | `10.40.0.0/16` · `/22` node subnet |
| Container registry | `<prefix><env><suffix>acr` | admin creds **off** |
| AKS cluster | `<prefix>-<env>-<suffix>-aks` | autoscaling system pool (2–4), Azure CNI overlay + network policy, AAD + Azure RBAC (local accounts off), Workload Identity (OIDC), Key Vault CSI, weekly auto-patch, Container Insights |
| *(auto)* AKS node resource group | `<prefix>-<env>-<suffix>-aks-nodes-rg` | created by AKS for the VMSS/LB/disks; subscription-unique, which is why it carries the suffix too |
| *(auto)* Diagnostic setting | `<prefix>-<env>-<suffix>-aks-diag` | auto-created by Azure when Container Insights is enabled; NOT managed by Terraform |
| Role assignment | AKS kubelet → `AcrPull` | secretless image pulls |
| CI/CD identity (opt) | `id-<prefix>-<env>-<suffix>-cicd` | ADO WIF target + build/deploy roles |
| SRE Agent (opt, off) | `<prefix>-<env>-<suffix>-sre-agent` | preview, via azapi — **official IaC recipes** (agent + its App Insights + LAW/Azure Monitor connectors + least-privilege RBAC); agent RP is region-limited, see `sre_agent_location` |

---

## Mode — ask this FIRST

Ask the operator: **auto** (you execute each step) or **guided** (training — you never execute: print each command with every placeholder resolved, explain it, wait for the operator to run it and paste the output, verify, then next step). Full contract: *Execution modes* in `copilot-instructions.md` (auto-loaded). Guardrails apply in both modes.

## Step 0 — Materialize the code from assets/

Pick a **fresh** working dir. Default: `tf/` at the repo root (git-ignore it; it's generated output, not source).

> **Fresh means no `terraform.tfstate` in it.** Never materialize these assets over a `tf/` that already holds the state of a stack applied **before the name suffix** (names like `rnd-dev-rg-01`, `rnddevacr01`): the new names differ, so the plan would **destroy + recreate the RG, ACR, AKS and LAW** — `prevent_destroy` blocks it, the plan goes red, and the fix is *not* to remove `prevent_destroy`. An old stack keeps its old `tf/` (and its `-01` patch) for its whole life; the suffixed code is for **new** stacks only. Check before you write: `ls tf/terraform.tfstate 2>/dev/null && echo "STOP — existing stack; use another dir"`.

```bash
mkdir -p tf
```

For **each** `assets/<name>.md`, write its single `hcl` block verbatim to `tf/<name>`:

- [`assets/versions.tf.md`](assets/versions.tf.md) → `tf/versions.tf`
- [`assets/variables.tf.md`](assets/variables.tf.md) → `tf/variables.tf`
- [`assets/main.tf.md`](assets/main.tf.md) → `tf/main.tf`
- [`assets/outputs.tf.md`](assets/outputs.tf.md) → `tf/outputs.tf`
- [`assets/terraform.tfvars.md`](assets/terraform.tfvars.md) → `tf/terraform.tfvars`  ← fill in `subscription_id` (and any overrides) before planning

The blocks are pure, verbatim HCL — no markers to strip. `terraform fmt -check && terraform validate` in Step 2 is your transcription check: if either fails, re-extract the block instead of hand-patching. After materializing, `tf/` is a normal Terraform module and everything from here on is the ordinary flow.

## Step 1 — Preflight
- **Approved plan exists** — `/rnd-devops plan infrastructure <env>` has produced a plan in `docs/plans/` whose Approval log shows a named **Approved** (TL/client, via PR). No plan or `Pending review` → stop and run `/rnd-devops plan` first.
- `az account show` — confirm the subscription; grab its id into `terraform.tfvars`.
- **Resource group — ask which case this is** (guided: ask outright; auto: check tfvars):
  - **Create it** (default) → `existing_resource_group_name` stays empty; the module creates `<prefix>-<env>-<suffix>-rg`. Operator needs **Owner** or (Contributor + User Access Administrator) **on the subscription**: the `AcrPull` role assignment needs `Microsoft.Authorization/roleAssignments/write`, and azurerm registers resource providers at subscription scope.
  - **Given one** (shared subscription, one group per team) → `existing_resource_group_name = "<their-rg>"`. Terraform reads it (data source), never creates, tags or deletes it, and `location` is ignored — the stack lands in the group's region. **Owner on that resource group is enough.** Confirm first: `az group show -n <their-rg> --query "{name:name,location:location}" -o table` and `az role assignment list --scope $(az group show -n <their-rg> --query id -o tsv) --assignee <upn> --query "[].roleDefinitionName" -o tsv` → `Owner`. Provider registration is skipped in this case (`resource_provider_registrations = "none"`), so the **admin must have registered every namespace the workshop touches** — and you **gate the plan on it**, because the miss surfaces late (mid-apply at the AKS resource, `Microsoft.OperationsManagement` = the Container Insights solution is the one everybody hits) after RG contents already exist:
    ```bash
    for p in Microsoft.Resources Microsoft.Authorization Microsoft.Network Microsoft.Compute Microsoft.Storage Microsoft.ContainerService Microsoft.ContainerRegistry Microsoft.OperationalInsights Microsoft.OperationsManagement Microsoft.ManagedIdentity Microsoft.KeyVault Microsoft.Insights Microsoft.AlertsManagement Microsoft.App; do
      printf '%-34s %s\n' $p "$(az provider show -n $p --query registrationState -o tsv 2>&1 | head -1)"; done
    ```
    **Every line must read `Registered` before `terraform plan`.** `AuthorizationFailed` on the read → the team account can't see subscription-level state either; have the admin run the same loop (GETTING-STARTED §1.3 step 1b) and paste it — do not proceed on assumption. A `MissingSubscriptionRegistration` at apply → admin registers that namespace (`az provider register -n <ns> --wait`), then simply re-run plan/apply; nothing to clean up.
  - Not sure which? `az role assignment list --assignee <upn> --query "[?scope=='/subscriptions/<sub>'].roleDefinitionName" -o tsv` — a subscription-level Owner can take either path; anyone else takes the second.
- **Lockout guard:** the module ships `local_account_disabled = true`. Right after apply, grant yourself an AKS RBAC role or you can't reach the cluster:
  ```bash
  az role assignment create --assignee <your-object-id> \
    --role "Azure Kubernetes Service RBAC Cluster Admin" --scope <aks-id>
  az aks get-credentials -g <resource_group> -n <aks_name>   # both from .rnd-devops/infra-state.json (Step 5); NOT --admin (disabled)
  ```
- Decide `prefix` / `env` / `location` (defaults `rnd` / `dev` / `southeastasia`). One env per apply. Prod → `sku_tier = "Standard"`.
- **Leave `name_suffix` unset** — Terraform generates the random 4-char suffix on the first apply, so a shared subscription and the global ACR namespace are safe by default. Set it only to re-attach a fresh working dir to an existing stack (value: `terraform output -raw name_suffix`, or `.name_suffix` in that stack's `infra-state.json`). **Never** "fix" an *already exists* collision by hand-patching `-01` into `main.tf` — that is exactly what the suffix is for.

## Step 2 — Init + static-check
```bash
cd tf
terraform init
terraform fmt -recursive        # canonical formatting
terraform validate              # syntax + provider schema (no creds needed) — cheap gate
```

## Step 3 — Plan → review (do NOT skip)
> Re-running on a **state applied before this version** (the resource group was at `azurerm_resource_group.rg`, no index)? Expect one line `azurerm_resource_group.rg has moved to azurerm_resource_group.rg[0]` and **zero** destroys — the `moved` block renames it in state. A plan that wants to destroy/create the group means `main.tf` wasn't re-materialized; stop and re-extract it.

```bash
terraform plan -out tfplan
terraform show -no-color tfplan > tfplan.txt
```
Review `tfplan.txt`. First apply → everything is a *create* (no destroy/replace yet); confirm the resource set matches the table above. Show the summary in chat. **Expected:** with `name_suffix` unset, every resource *name* shows as `(known after apply)` on the first plan — the suffix is generated at apply time. That is normal, not a transcription error; the concrete names appear in the apply output and in Step 5's `infra-state.json`.

## Step 4 — Apply — on a named go-ahead only
`terraform apply` is an outward, shared-state action. Present the plan summary, get the operator's explicit **"apply `<prefix>-<env>`"**, then:
```bash
terraform apply tfplan
```
**RULE — never `terraform apply -auto-approve`** (nor `-auto-approve` on a bare `apply`). Plan → show → named confirmation → apply the plan file. Every time, even for a one-line change.

Watch the two slow/failure-prone resources: the **AKS cluster** (5–10 min) and the **AcrPull role assignment** (fails without `roleAssignments/write` — see preflight).

## Step 5 — Save the state (what the other verbs read)
```bash
# from tf/
mkdir -p ../.rnd-devops
terraform output -json infra_state > ../.rnd-devops/infra-state.json
jq .service_connection.cicd_identity_client_id ../.rnd-devops/infra-state.json   # must be a GUID, not null
jq -r '.name_suffix, .resource_group, .acr_name, .aks_name' ../.rnd-devops/infra-state.json   # YOUR stack's names — quote these, never the rnd-dev-* pattern
```
If that last line prints `null` or the key is missing, your `outputs.tf` predates the `service_connection` block: re-materialize `assets/outputs.tf.md` → `tf/outputs.tf`, run `terraform apply` (outputs-only, no resource changes — still read the plan), and export again.
Stamp `provisioned_at` (ISO-8601) into the JSON. Ensure `.rnd-devops/` is git-ignored. Also record a durable memory: what was provisioned (the `name_suffix`, `<prefix>-<env>-<suffix>-aks`, ACR `<prefix><env><suffix>acr`, RG, subscription), when, and that `service-connection` + `ci-cd` depend on it.

## Step 6 — Verify
- `az aks show -g "$(jq -r .resource_group ../.rnd-devops/infra-state.json)" -n "$(jq -r .aks_name ../.rnd-devops/infra-state.json)" --query provisioningState` → `Succeeded`.
- Connect (`az aks get-credentials`), then check the cluster is reachable and system pods are healthy (`kubectl get nodes`, `kubectl get pods -A`).
- `az role assignment list --assignee <kubelet_identity_object_id> --scope <acr-id> --query "[].roleDefinitionName"` → `AcrPull` present.
- Deployed **into a given group**? Also confirm nothing landed outside it: `az resource list --resource-group <their-rg> --query "[].{type:type,name:name}" -o table` lists the ACR, AKS, VNet, Log Analytics and UAMI — and `terraform state list | grep azurerm_resource_group` shows `data.azurerm_resource_group.existing[0]` only (no managed `azurerm_resource_group.rg[0]`).

## Optional — Azure SRE Agent, self-service in one pass

The agent + its App Insights + LAW/Azure Monitor connectors + RBAC are **all in the `assets/` code** (mirrors Microsoft's official recipes: `github.com/microsoft/sre-agent` → `sreagent-templates`). To enable it you only add tfvars lines and re-run the normal flow — no special procedure:

1. **Enable in `terraform.tfvars`** (copy-paste, defaults are the safe ones):
   ```hcl
   create_sre_agent   = true
   sre_agent_location = "eastus2"   # agent RP regions: eastus2 | uksouth | swedencentral | australiaeast — NOT southeastasia; cross-region management is fine
   # sre_agent_access_level = "Low"     # keep Low until you trust it; "High" adds Contributor
   # sre_agent_action_mode  = "Review"  # keep Review — a human approves every action
   ```
2. **Plan → review → apply** exactly like Steps 3–4 (same guardrails, named go-ahead). Expect the connector resources to be slow — a **10-minute timeout on a connector is SAFE**: it keeps provisioning in the background; just re-run `terraform apply` later to reconcile.
3. **Verify** (each with its expected result):
   - `terraform output sre_agent_endpoint` → non-empty URL.
   - `az resource show --ids <agent-id> --query "properties.provisioningState"` → `Succeeded` (agent id: `.../resourceGroups/<prefix>-<env>-<suffix>-rg/providers/Microsoft.App/agents/<prefix>-<env>-<suffix>-sre-agent` — both names are in `infra-state.json`: `.resource_group`, `.sre_agent_name`).
   - Open **https://sre.azure.com** → the agent loads (your apply granted you SRE Agent Administrator) and its knowledge graph shows the stack's RG.
4. **Finish by hand — with `/rnd-devops sre-agent`.** Response plans, the ADO + Teams connectors (OAuth) and per-teammate RBAC are data-plane / portal objects Terraform cannot declare. They have their **own runbook** (`.github/skills/sre-agent/SKILL.md`), run **after** `alerting` has proven the rules a response plan will scope to. Don't improvise them here — hand off.

   > Two portal quirks, so you don't re-diagnose them: the **incident platform is already wired by the apply** (`incidentManagementConfiguration.type = AzMonitor` on the agent ARM resource — verify with `az resource show`), and the **`azure-monitor` connector shows "Failed"** with *"Status not available for connector type 'AzureMonitor'"* — a preview-UI limitation, NOT a real failure (ARM shows `Succeeded`; the portal also can't re-create this connector type — if it's ever deleted, PUT it back via ARM using the recipe in `assets/main.tf.md`). The only trustworthy check is functional: a drill → an incident appears (`sre-agent` Step 5).

Once `sre-agent` has wired the response plan, `/rnd-devops operations` consumes what this agent produces (alert → incident → hotfix PR).

## Next
- `/rnd-devops service-connection` — ADO → Azure connection (reads `.rnd-devops/infra-state.json`). No plan of its own — this infrastructure plan covers the identity it wires.
- `/rnd-devops plan ci-cd <service>` → `/rnd-devops ci-cd <service>` — the pipeline is **plan-gated**: write and get the ci-cd plan approved first, then wire the service's pipeline to deploy here.
- After the deploy: `monitoring` → `plan alerting` → `alerting` → `sre-agent` (the SRE Agent's portal half, if `create_sre_agent` was on).

## Guardrails
- **`apply` always needs the operator's confirmation — never `-auto-approve`.** Plan → show → named go-ahead → apply the plan file.
- **`prevent_destroy` is on the stateful resources** (RG, AKS, ACR, Log Analytics). A plan that would destroy/replace any of them **fails by design**.
- **One env per apply.** Never point one state at both dev and prod, and don't share a state file across modules.
- **Names come from state, not from a pattern.** Every resource carries the per-stack `<suffix>`; downstream verbs and docs must read `.rnd-devops/infra-state.json` (`.resource_group`, `.acr_name`, `.aks_name`, `.log_analytics_workspace_name`, `.cicd_identity_name`, `.sre_agent_name`) — never reconstruct `rnd-dev-*` by hand. An *"already exists"* error on RG / ACR / node RG means a stale or pinned `name_suffix`, not a reason to append `-01`.
- **Out-of-band CLI changes** must be reconciled back into the code (here: the `hcl` block in the matching `assets/*.tf.md`, then re-materialize) — else the next `apply` reverts them.
- **Teardown is deliberate, human-only.** Remove the `prevent_destroy = true` blocks first, then `terraform destroy` with explicit env confirmation. **Given a resource group** (`existing_resource_group_name` set)? The group is a data source, so destroy removes **only what this stack created** and leaves the group — and anything else the team put in it — untouched; verify with `az resource list --resource-group <their-rg> -o table`. **Never `az group delete` a group you were given**; the admin cleans up after the workshop.

---

> This runbook is standalone — the `assets/*.tf.md` files carry the complete Terraform source for it. Edit the code there (in their `hcl` blocks); never fork the `.tf` files elsewhere.