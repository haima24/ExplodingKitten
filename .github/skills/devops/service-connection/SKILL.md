---
name: service-connection
description: "Give the CI pipeline a secretless identity into Azure — the Azure DevOps ARM service connection (UAMI + Workload Identity Federation) by default, or a GitHub Actions OIDC federated credential on the same UAMI when the service's CI provider is GitHub — that pipelines deploy through. Reads .rnd-devops/infra-state.json. Runs in two modes — auto (the copilot executes each step) or guided (training: it shows each resolved command and the operator runs it themselves). Use after infrastructure and before ci-cd."
---

# rnd-devops · service-connection

`/rnd-devops service-connection` (alias `svc-conn`) — create the Azure DevOps **ARM service connection** that pipelines authenticate through to **push images to ACR** and **deploy to AKS**. It reads the infra from **`.rnd-devops/infra-state.json`** (written by **`/rnd-devops infrastructure`**) and wires the ADO endpoint onto the **CI/CD identity infra already provisioned** — no Terraform directory, no code to embed.

Creating a service connection is an **outward, shared-state action** → prepare it, show it, and register only on a named go-ahead.

## The questions — in this order, one provider's worth only
Ask **at most three things, in sequence**, and only what the chosen provider needs. Never bundle them into one form: the provider answer decides what the next question even is.

1. **Mode** — auto or guided (below).
2. **CI provider** — read the approved ci-cd plan's *CI provider* row, or `services.<service>.github` / `.ado` in `infra-state.json`; only if neither exists, ask: *"Azure Pipelines or GitHub Actions?"*
3. **Where the repo is — for that provider only:**
   - **Azure Pipelines** → *"Your Azure DevOps org URL and project?"* — then Preflight + Steps 0–4 create the ADO service connection.
   - **GitHub Actions** → don't ask for a name cold: first make sure `gh` is logged in (hand over `gh auth login` if not — it's a browser flow only the operator can do), read the login (`gh api user --jq .login`) and **propose `<that-login>/SimplCommerce`** for confirmation — *"Wire `<login>/SimplCommerce`? (or give `<org>/<repo>` if the mirror lives under a GitHub org)"*. GitHub has no project layer: the **owner** (user or org) is the ADO org, the **repo** is the ADO project+repo, and the OIDC trust is bound to that exact repo — which is why this path needs the repo name where ADO needs org+project. **Do not ask for an ADO org or project at all**; do Preflight steps 1–2, then jump to **[GitHub path](#github-path--oidc-federated-credential-no-service-connection-object)**: same UAMI, a federated credential for GitHub's issuer, three repo variables, no service-connection object.

The **service to bind** is not a question in the workshop: it is `simplcommerce` (the one slug every verb uses) — state it, record it, and ask only if `services` in state already holds several services or the operator gave a different slug on the command line. Word it for the provider: *"recording `services.simplcommerce.github`"* on the GitHub path, `.ado` on the ADO path.

**Placeholders only in questions and examples** — `<your-org>`, `<project>`, `<owner>/<repo>`. Never a real org, project or repo name as an "e.g.": an example is a proposal, and proposing the read-only source org is exactly the failure this rule exists to prevent.

## Mode — ask this FIRST

Ask the operator: **auto** (you execute each step) or **guided** (training — you never execute: print each command with every placeholder resolved, explain it, wait for the operator to run it and paste the output, verify, then next step). Full contract: *Execution modes* in `copilot-instructions.md` (auto-loaded). Guardrails apply in both modes.

## The one rule that keeps this fast

**This tenant (NashTech) BLOCKS service-principal / app-registration creation.** So **do NOT create an SP.** `/rnd-devops infrastructure` already provisioned a **user-assigned managed identity (UAMI)** with every role a build+deploy pipeline needs (`create_cicd_identity` → **Contributor** on ACR, **AKS Cluster User**, **AKS RBAC Cluster Admin**). This runbook only:

1. **reuses that UAMI** (`service_connection.cicd_identity_client_id` in infra-state), and
2. wires an ADO **Workload Identity Federation (WIF)** endpoint onto it — secretless, nothing to rotate.

No SP, no client secret, **no re-granting roles** (infra owns them). The SP-secret path — for tenants that *do* allow SP creation — is a short fallback at the bottom. Leading with the SP path is exactly what made past runs fail on step 1 and drag on; don't.

## Preflight
1. Load `.rnd-devops/infra-state.json` — need `subscription_id`, `resource_group`, `acr_name`, `aks_name`, and **`service_connection.cicd_identity_client_id`** (the UAMI). Missing file → stop, point at `/rnd-devops infrastructure`. Missing **only** `service_connection.cicd_identity_client_id` → the state was exported with an older `outputs.tf`; don't re-apply infra for that. From `tf/` run `terraform output -raw cicd_identity_client_id`: a GUID → write it into the state and continue —
   ```bash
   CID=$(cd tf && terraform output -raw cicd_identity_client_id)
   jq --arg c "$CID" '.service_connection.cicd_identity_client_id = $c' .rnd-devops/infra-state.json > .rnd-devops/tmp && mv .rnd-devops/tmp .rnd-devops/infra-state.json
   ```
   `null`/empty → infra really was applied with `create_cicd_identity = false`; **re-apply infra with it `true`** rather than hand-creating an SP.
2. `az account show` — confirm the same subscription as `subscription_id` in state. Grab `tenantId`.
3. *(Azure Pipelines only — skip on the GitHub path)* **Resolve the ADO org + the project you are wiring** — the org comes from `service_connection.org`, but the **project must be the one this run targets**, which is *not* automatically the one already in state. Resolve it in this order: the project of the `<service>` argument if one was given (`services.<service>.ado.project`); else, if `service_connections` already has entries, **ask which project** and list the existing keys so the operator can see what is already wired; else the flat `service_connection.project`; else ask. Never infer these (see *ADO organization / project* in `copilot-instructions.md`).
   > **Reading the project straight off the flat key is the known failure.** State carries whichever project was wired first, so re-running this verb to add a *second* project silently re-reports the first one and creates nothing new. If the resolved project already has a ready endpoint, say so and confirm before continuing — the operator may have meant a different project. This verb needs **no plan of its own** — the infrastructure plan covers the UAMI it wires; a named go-ahead at Step 3 is the gate.
3. **Settle ONE canonical name: `rnd-<env>-azure`** (this is the default `serviceConnection` in the `ci-cd` skill). Use it everywhere. Never invent a second name — a `rnd-<env>-azure` vs `rnd-<env>-conn` drift is what spawned duplicate connections and inconsistent state before.

## Step 0 — Idempotency: is a ready connection already there?

> `<org>` / `<Project>` below are **the operator's own** ADO org and project — the ones the SimplCommerce mirror lives in (GETTING-STARTED §2.1). Preflight step 3 resolves them (state, else ask). Never infer them from docs, examples, `az devops configure -l`, or the org the source was cloned from — that one is read-only and the operator cannot create service endpoints there.

Before creating anything:
```bash
az devops service-endpoint list --org "https://dev.azure.com/<org>" --project "<Project>" \
  --query "[?name=='rnd-<env>-azure'].{id:id,ready:isReady}" -o json
```
- **Exactly one, `ready:true`** → **DONE.** Record it (Step 4) and exit — do NOT recreate.
- **Present but `ready:false`** → almost always a half-wired federated credential. Go to **Step 2** and fix the FC on the *existing* endpoint; don't make a new one.
- **Duplicates / stray-named leftovers** (e.g. an old `rnd-<env>-conn`) → flag them for the operator to delete. Never leave two ready connections for one env.

## Step 1 — Create the WIF endpoint (after go-ahead)
A WIF endpoint bound to the infra UAMI, `creationMode = Manual` (we own the federated credential), **no secret**. Build the body, then PUT it:
```bash
UAMI_CLIENT_ID=$(jq -r .service_connection.cicd_identity_client_id .rnd-devops/infra-state.json)
SUB=$(jq -r .subscription_id .rnd-devops/infra-state.json)
TENANT=$(az account show --query tenantId -o tsv)
SUBNAME=$(az account show --query name -o tsv)

cat > .rnd-devops/svc-conn-body.json <<JSON
{
  "name": "rnd-<env>-azure",
  "type": "azurerm",
  "url": "https://management.azure.com/",
  "authorization": {
    "scheme": "WorkloadIdentityFederation",
    "parameters": { "serviceprincipalid": "$UAMI_CLIENT_ID", "tenantid": "$TENANT" }
  },
  "data": {
    "subscriptionId": "$SUB", "subscriptionName": "$SUBNAME",
    "environment": "AzureCloud", "scopeLevel": "Subscription", "creationMode": "Manual"
  },
  "serviceEndpointProjectReferences": [
    { "projectReference": { "id": "<project-guid>", "name": "<Project>" }, "name": "rnd-<env>-azure" }
  ]
}
JSON

# Manual/WIF endpoints are most reliable via REST (the az devops CLI's azurerm create
# targets the automatic/SP-key flows). Get <project-guid> from `az devops project show`.
az devops invoke --area serviceendpoint --resource endpoints \
  --route-parameters project="<Project>" --api-version 7.1 \
  --http-method POST --in-file .rnd-devops/svc-conn-body.json \
  --org "https://dev.azure.com/<org>" -o json > .rnd-devops/svc-conn-response.json
```
Capture the returned endpoint **`id`** — Step 2 needs it. (`az rest --method post --url ".../<org>/<Project>/_apis/serviceendpoint/endpoints?api-version=7.1" --body @.rnd-devops/svc-conn-body.json` is an equivalent fallback if `az devops invoke` misbehaves.)

## Step 2 — Read the endpoint's issuer/subject, THEN create the matching federated credential
This is the gate every past run tripped on (**`AADSTS700211`**). The endpoint, once created, **tells you the exact issuer + subject** the UAMI must trust — and it depends on the org type, so **read it, never hardcode**:
```bash
EP_ID=$(jq -r .id .rnd-devops/svc-conn-response.json)
az devops invoke --area serviceendpoint --resource endpoints \
  --route-parameters project="<Project>" endpointId="$EP_ID" --api-version 7.1 \
  --org "https://dev.azure.com/<org>" -o json \
  | jq '.authorization.parameters | {workloadIdentityFederationIssuer, workloadIdentityFederationSubject}'
```
- **Entra ID orgs (this one):** issuer `https://login.microsoftonline.com/<tenant>/v2.0`, subject `/eid1/c/pub/t/.../sc/<org-guid>/<endpoint-id>`.
- **Classic ADO OIDC orgs:** issuer `https://vstoken.dev.azure.com/<org-guid>`, subject `sc://<org>/<project>/rnd-<env>-azure`.

Create the federated credential on the UAMI with those values **verbatim**:
```bash
RG=$(jq -r .resource_group .rnd-devops/infra-state.json)
ENV=$(jq -r .env .rnd-devops/infra-state.json)
UAMI_NAME=$(jq -r .cicd_identity_name .rnd-devops/infra-state.json)   # id-<prefix>-<env>-<suffix>-cicd — read it, never reconstruct it (the suffix is random per stack)
if [ -z "$UAMI_NAME" ] || [ "$UAMI_NAME" = "null" ]; then
  # infra-state.json predates the cicd_identity_name key (stack applied before 2026-09-07).
  # Preferred: re-materialize assets/outputs.tf.md → tf/outputs.tf, `terraform apply` (outputs
  # only — still read the plan), `terraform output -json infra_state > .rnd-devops/infra-state.json`.
  # Quick fallback — the RG holds exactly one CI/CD identity:
  UAMI_NAME=$(az identity list -g "$RG" --query "[?starts_with(name,'id-') && ends_with(name,'-cicd')].name | [0]" -o tsv)
  [ -n "$UAMI_NAME" ] || { echo "no CI/CD identity found in $RG — run /rnd-devops infrastructure Step 5 first"; exit 1; }
fi

az identity federated-credential create \
  --name "ado-rnd-${ENV}-azure" \
  --identity-name "$UAMI_NAME" --resource-group "$RG" \
  --issuer  "<workloadIdentityFederationIssuer  — copied verbatim>" \
  --subject "<workloadIdentityFederationSubject — copied verbatim>" \
  --audiences "api://AzureADTokenExchange"
```
**One character off (issuer or subject) = `AADSTS700211`.** Copy from the Step-2 output, don't retype. FC propagation is ~seconds — if the first pipeline run 700211s, **wait and retry; do not recreate the endpoint** (a new endpoint = a new subject = you start over).

## Step 3 — Verify
- `az devops service-endpoint show --id "$EP_ID" --org "https://dev.azure.com/<org>" --project "<Project>" --query "{name:name,ready:isReady}"` → `ready: true`.
- Sharing: per-pipeline authorization for prod; `az devops service-endpoint update --id "$EP_ID" --enable-for-all true` is fine for a shared dev project.
- Smoke-test both capabilities from a pipeline run: `az acr login -n <acr>` (push path) and `az aks get-credentials … && kubectl auth can-i create deploy` (deploy path).

## Step 4 — Record it (single source of truth)
Endpoints are **project-scoped**, and one stack can serve several ADO projects, so the record is a **map keyed by project** — `service_connections[<Project>]`. Write it, and keep the flat `service_connection` in step as the legacy fallback readers still use:
```bash
jq --arg p "<Project>" --argjson conn '{
  "name": "rnd-<env>-azure",
  "id": "<endpoint-id>",
  "org": "https://dev.azure.com/<org>",
  "project": "<Project>",
  "cicd_identity_client_id": "<UAMI client id>",
  "scheme": "WorkloadIdentityFederation"
}' '
    .service_connections = ((.service_connections // {}) + { ($p): $conn })
  | .service_connection = (.service_connection // $conn)     # set once; never repoint an existing one
' .rnd-devops/infra-state.json > .rnd-devops/infra-state.tmp && mv .rnd-devops/infra-state.tmp .rnd-devops/infra-state.json
jq -e . .rnd-devops/infra-state.json > /dev/null    # never leave invalid JSON behind
```
Then bind the services that use it, so later verbs resolve without asking (`<repo>` is the ADO repo, which **need not equal the slug** — `shop-loc-a` deploys from the `SimplCommerce` repo):
```bash
jq --arg s "<service>" --arg p "<Project>" --arg r "<repo>" \
   '.services[$s].ado = { project: $p, repo: $r }' \
   .rnd-devops/infra-state.json > .rnd-devops/infra-state.tmp && mv .rnd-devops/infra-state.tmp .rnd-devops/infra-state.json
```
Confirm `name` matches `ci-cd.md`'s `serviceConnection` default (`rnd-<env>-azure`). With WIF there is **no secret** to print or store — that's the whole point.

> **Back up before you touch state, and never repoint the flat key.** `cp .rnd-devops/infra-state.json .rnd-devops/infra-state.json.bak` first. Overwriting `service_connection` with a second project's endpoint is the failure this map exists to prevent: it silently sends every later verb — for **every** service, including ones already live — at the wrong project. Add to the map; leave the flat key pointing where it always pointed.

## GitHub path — OIDC federated credential (no service-connection object)
GitHub Actions authenticates to Azure with `azure/login` + `permissions: id-token: write`: the runner presents a GitHub-issued OIDC token and Entra exchanges it for a UAMI token **if a federated credential on the UAMI trusts that exact issuer + subject**. Nothing to store, nothing to rotate. Same UAMI, same roles as the ADO path (infra granted them).

**Preflight (in place of Step 0) — login, owner, repo, in that order:**
```bash
gh auth status || echo "not logged in → operator runs: gh auth login   (GitHub.com · HTTPS · browser; needs scopes repo + workflow)"
LOGIN=$(gh api user --jq .login)                 # the account gh is using — show it; it must be the one that owns the mirror
REPO="${LOGIN}/SimplCommerce"                     # proposed default; operator confirms, or gives <org>/<repo>
```
Show `LOGIN` and ask the operator to confirm it is the intended account — a machine often carries a *different* GitHub login (work vs personal), and then every `gh` call below targets the wrong account; `gh auth switch` / `gh auth login` fixes it. `services.<service>.github.repo` in `infra-state.json`, if present, wins over the proposal. Never infer the repo from docs or from `git remote -v` of some other checkout.

**On this path the app repo lives on GitHub** — the pipeline, the PRs and the deploy kit all go there — so the repo must **exist and hold the app** before anything is wired to it (a federated credential for an empty or missing repo is a dangling trust):
```bash
gh repo view "$REPO" --json nameWithOwner,defaultBranchRef --jq '{repo:.nameWithOwner,branch:.defaultBranchRef.name}'   && gh api "repos/$REPO/contents/SimplCommerce.sln" --jq .name
```
- **Both succeed** → continue.
- **`Could not resolve to a Repository`** → the repo isn't there under this login (or gh is on the wrong account). Offer to do §2.1's GitHub path right now — it is an outward action on the operator's account, so **named go-ahead first** ("create `<owner>/SimplCommerce` and mirror the app into it"):
  ```bash
  gh repo create "$REPO" --private
  git clone --mirror https://dev.azure.com/loctad/application/_git/SimplCommerce /tmp/simplcommerce.git
  git -C /tmp/simplcommerce.git push "https://github.com/${REPO}.git" --all    # branches + tags only — --mirror would also push
  git -C /tmp/simplcommerce.git push "https://github.com/${REPO}.git" --tags   # the source's refs/pull/*, which GitHub rejects as hidden refs
  ```
  Then re-run the two checks. Guided mode: hand over the three commands, wait for the paste.
- **Repo exists but `SimplCommerce.sln` is missing** → an empty repo or the wrong one; same mirror step (into the existing repo), or the operator names the right repo.

Idempotency:
```bash
RG=$(jq -r .resource_group .rnd-devops/infra-state.json)
UAMI_NAME=$(jq -r .cicd_identity_name .rnd-devops/infra-state.json)      # id-<prefix>-<env>-<suffix>-cicd
REPO="<owner>/<repo>"
# The subject GitHub will ACTUALLY send. Newer repos/orgs default to IMMUTABLE ids —
# repo:<owner>@<owner-id>/<repo>@<repo-id>:ref:refs/heads/main — not repo:<owner>/<repo>:…
# Never hand-build it: ask GitHub for the prefix this repo uses.
PREFIX=$(gh api "repos/${REPO}/actions/oidc/customization/sub" --jq '.sub_claim_prefix // empty' 2>/dev/null)
PREFIX=${PREFIX:-repo:${REPO}}
SUBJECT="${PREFIX}:ref:refs/heads/main"; echo "subject → $SUBJECT"
az identity federated-credential list --identity-name "$UAMI_NAME" -g "$RG" \
  --query "[?subject=='${SUBJECT}'].name" -o tsv     # one hit → already wired, go to Record
```

**Step G1 — federated credential (after go-ahead).** Subject = `$SUBJECT` from the idempotency block — **exactly what GitHub sends**, which on newer repos is the immutable-id form `repo:<owner>@<owner-id>/<repo>@<repo-id>:ref:refs/heads/main` (`use_immutable_subject: true` in that API response), on older ones the plain `repo:<owner>/<repo>:ref:refs/heads/main`. Hand-typing the plain form on an immutable-id repo is the #1 failure: `AADSTS700213 No matching federated identity record found`. Deploys run from `main` only; a run from another branch, a tag or a fork carries a different subject and fails the same way — that is the guardrail, not a bug.
```bash
az identity federated-credential create \
  --name "github-$(echo "$REPO" | tr '/' '-')-main" \
  --identity-name "$UAMI_NAME" --resource-group "$RG" \
  --issuer  "https://token.actions.githubusercontent.com" \
  --subject "$SUBJECT" \
  --audiences "api://AzureADTokenExchange"
```
Need PR-triggered runs too (not in the kit)? Add a **second** credential with subject `${PREFIX}:pull_request` — never widen the first one.

**Already failing with `AADSTS700213`?** The `azure/login` log prints the truth on its `subject claim - …` line. Create a credential with **that string verbatim** (new `--name`, e.g. `…-main-immutable`), re-run the workflow, then delete the stale one. Never add a client secret to get past it.

**Step G2 — the three repo variables** (plain variables, **not** secrets — none of these ids is confidential, and visible values are what let a reviewer check the wiring):
```bash
gh variable set AZURE_CLIENT_ID       -R "$REPO" --body "$(jq -r .service_connection.cicd_identity_client_id .rnd-devops/infra-state.json)"
gh variable set AZURE_TENANT_ID       -R "$REPO" --body "$(az account show --query tenantId -o tsv)"
gh variable set AZURE_SUBSCRIPTION_ID -R "$REPO" --body "$(jq -r .subscription_id .rnd-devops/infra-state.json)"
gh variable list -R "$REPO"
```

**Step G3 — verify.** `az identity federated-credential show --name "<fc-name>" --identity-name "$UAMI_NAME" -g "$RG" --query "{issuer:issuer,subject:subject}"` prints the GitHub issuer and the exact subject; `gh variable list` shows the three names. The real proof is the first workflow run's `azure/login` step going green (`ci-cd` Step 4) — an `AADSTS700213` there means subject mismatch: compare the log's `subject claim` line with the credential's subject, fix the credential, don't add a secret.

**Record (in place of Step 4)** — same map, keyed by the repo instead of a project, plus the service binding, so `ci-cd` and the later verbs know the provider without asking:
```bash
cp .rnd-devops/infra-state.json .rnd-devops/infra-state.json.bak
jq --arg s "<service>" --arg r "$REPO" --arg fc "github-$(echo "$REPO" | tr '/' '-')-main" \
   --arg cid "$(jq -r .service_connection.cicd_identity_client_id .rnd-devops/infra-state.json)" '
    .service_connections = ((.service_connections // {}) + { ($r): { provider: "github-actions", repo: $r, federated_credential: $fc, cicd_identity_client_id: $cid, scheme: "GitHubOIDC" } })
  | .services[$s].github = { repo: $r }
' .rnd-devops/infra-state.json > .rnd-devops/infra-state.tmp && mv .rnd-devops/infra-state.tmp .rnd-devops/infra-state.json
jq -e . .rnd-devops/infra-state.json > /dev/null
```
Never write `services.<service>.ado` for a GitHub service, and never touch the flat `service_connection` here — the ADO keys are simply absent on this path.

## Guardrails
- **One connection per environment *per project*, one canonical name** (`rnd-<env>-azure`). The same name in two projects is correct and expected — they are different endpoints with different ids. Delete stray duplicates **within** a project; never let two ready connections for the same env coexist there.
- **A missing endpoint is a hard stop, not a borrow.** If a service's project has no entry in `service_connections`, run this verb for that project — never fall back to another project's endpoint because the name matches (see *ADO organization / project* in `copilot-instructions.md`).
- **Reuse the infra UAMI; don't create SPs or re-grant roles** — infra owns them via `create_cicd_identity`. Any out-of-band role edit → reconcile into the infra HCL, not here.
- **WIF has no secret** to expire/rotate/leak. If auth breaks later it's a **federated-credential subject mismatch**, not an expired secret — re-read the endpoint's issuer/subject (Step 2) and re-match the FC.
- Everything under the operator's identity; register only on a **named go-ahead**.

## What the UAMI already carries (from infra — for reference)
`/rnd-devops infrastructure`'s `create_cicd_identity` grants exactly what a build+deploy pipeline needs, so you don't:
- **Contributor on the ACR** — not just `AcrPush`. `az acr build` (server-side ACR Tasks) needs `registries/read` + `scheduleRun`, which `AcrPush` (data-plane only) lacks → otherwise *"registry could not be found"*.
- **AKS Cluster User Role** — pulls the kubeconfig.
- **AKS RBAC Cluster Admin** — applies manifests. NOT `RBAC Writer`: Writer is namespace-scoped and **can't create Namespaces (cluster-scoped) or Secrets**, so a pipeline that makes its own namespace + Secrets fails with *"cannot create namespaces at the cluster scope"*. (To keep the identity narrower: pre-create the namespace and grant `RBAC Admin` scoped to `.../managedClusters/<aks>/namespaces/<ns>` instead.)

## Fallback — SP + client secret (ONLY if your tenant allows SP creation)
NashTech's tenant blocks this; kept for portability to tenants that don't. It trades WIF's secretless model for a **secret that expires** (~1–2 yr) — the first suspect when a connection stops authing months later.
```bash
# Requires app-registration + roleAssignments/write. Skip on tenants that block SP creation.
SP_JSON=$(az ad sp create-for-rbac --name "sp-rnd-<env>-cicd")   # no --role/--scopes → no auto grant
APP_ID=$(jq -r .appId <<<"$SP_JSON"); SP_KEY=$(jq -r .password <<<"$SP_JSON"); TENANT=$(jq -r .tenant <<<"$SP_JSON")
ACR_ID=$(az acr show -n "$(jq -r .acr_name .rnd-devops/infra-state.json)" --query id -o tsv)
AKS_ID=$(az aks show -g "$(jq -r .resource_group .rnd-devops/infra-state.json)" -n "$(jq -r .aks_name .rnd-devops/infra-state.json)" --query id -o tsv)
az role assignment create --assignee "$APP_ID" --role "Contributor" --scope "$ACR_ID"
az role assignment create --assignee "$APP_ID" --role "Azure Kubernetes Service Cluster User Role" --scope "$AKS_ID"
az role assignment create --assignee "$APP_ID" --role "Azure Kubernetes Service RBAC Cluster Admin" --scope "$AKS_ID"
export AZURE_DEVOPS_EXT_AZURE_RM_SERVICE_PRINCIPAL_KEY="$SP_KEY"
az devops service-endpoint azurerm create --name "rnd-<env>-azure" \
  --azure-rm-service-principal-id "$APP_ID" --azure-rm-tenant-id "$TENANT" \
  --azure-rm-subscription-id "$(jq -r .subscription_id .rnd-devops/infra-state.json)" \
  --azure-rm-subscription-name "$(az account show --query name -o tsv)" \
  --org "https://dev.azure.com/<org>" --project "<Project>"
```
- `az role assignment create` may fail `MissingSubscription` (a CLI-wrapper quirk) → fall back to a direct ARM PUT: `az rest --method put --url ".../providers/Microsoft.Authorization/roleAssignments/<uuid>?api-version=2022-04-01" --body @body.json`.
- Never print or store `SP_KEY` — it lives only in the ADO connection. Set a reminder before it expires; rotate via `az ad sp credential reset` + `az devops service-endpoint update`.

## Next
1. `/rnd-devops plan ci-cd <service>` — **first**: the ci-cd verb is plan-gated (its preflight refuses to run without a named-**Approved** plan in `docs/plans/`). Write it, get the TL/client approval into the Approval log.
2. `/rnd-devops ci-cd <service>` — then wire the deploy stage to `rnd-<env>-azure`, referencing that plan.