---
name: ci-cd
description: "Author, register, trigger, or check the CI/CD pipeline for a service — Azure Pipelines by default, or GitHub Actions when the plan's CI provider says so — Build → Security scan → Deploy to AKS. The deploy kit (pipeline YAML, Dockerfile, k8s manifests, gitleaks config) is carried in this skill's assets/*.md files and materialized on demand. The security scans are a per-run choice — securityScan: gate (blocks Deploy), report (warnings only, the demo default) or skip (no Security stage), declared in the plan. Runs auto (copilot executes) or guided (training — operator runs each shown command). Use to wire a service's pipeline and ship it to AKS."
---

# rnd-devops · ci-cd

`/rnd-devops ci-cd [service]` — author + run the build → security → deploy pipeline for a service, on the **CI provider the plan settled** — **Azure Pipelines** (default) or **GitHub Actions** (for operators without an Azure DevOps agent; see *CI provider* below) — with the **whole deploy kit carried in this skill's [`assets/`](assets/)** as markdown files (the pipeline YAML, the Dockerfile, the k8s manifests, and the gitleaks config — one asset file per kit file, each holding a single fenced block). This runbook is fully **self-contained**: it *materializes* each asset's block into a real file at its target path, then follows the ordinary `author → validate → register → run` flow. Everything you need lives in this skill folder; nothing outside it is required.

The `assets/*.md` files are the source for THIS runbook: the copilot reads them, writes the files, and wires the pipeline. Progressive disclosure applies — open them at Step 0 (or the one file you need when changing/explaining the kit), not to run the rest of the flow.

> **NEVER copy kit files from another directory.** The fenced blocks in `assets/*.md` are the single source of truth. Extract them verbatim — do not substitute files from elsewhere, and do not retype code from memory.

> **Note.** The kit's manifests carry **demo placeholder secrets** (`Ch@ngeMe_Demo123!`, sample OAuth values). Replace them before any shared/real use; never treat them as production secrets.

## How it works (the whole trick in 3 lines)
1. **Materialize** — for each `assets/*.md`, write its single fenced block to the target path named in its title, into the target service repo (or a demo dir).
2. **Author** — parameterize the pipeline `variables:` to the infra (`.rnd-devops/infra-state.json`) + the service, settle the **`securityScan` posture** (`gate` / `report` / `skip`) with the operator, and confirm the YAML parses.
3. **Register + run** — `az pipelines create` on a **named go-ahead**, push the kit to a branch in the service repo and open a PR (never to `main` directly, never merge it), trigger the first run, verify → if red, triage the failing step (timeline → log → classify → fix).

The action flow (`create` / `check` / `run`), the Security-stage rules, and the report-only adoption playbook are all covered in the steps below; the kit code is in `assets/`.

## CI provider — one decision, made in the plan
| | **Azure Pipelines** (default) | **GitHub Actions** |
|---|---|---|
| When | the operator has an ADO org with a hosted parallel job or an online self-hosted agent | no ADO agent available (new org, no billing link, no laptop agent) — or the team simply works on GitHub |
| Pipeline file | `azure-pipelines.aks.yml` ([asset](assets/azure-pipelines.aks.yml.md)) | `.github/workflows/deploy-aks.yml` ([asset](assets/github-workflow.deploy-aks.yml.md)) |
| Auth to Azure | ADO service connection (WIF on the infra UAMI) | OIDC federated credential on the **same** UAMI + 3 repo variables — `/rnd-devops service-connection`, GitHub path |
| Infra values | `<infra-state: …>` placeholders filled into the YAML | repository **variables** (`gh variable set`), nothing in the file |
| Register | `az pipelines create` | nothing — the workflow registers itself when the file lands on `main` |
| Run / watch | `az pipelines run` / `az pipelines runs show` | `gh workflow run` / `gh run watch` |
| Runner | ADO hosted or self-hosted agent | GitHub-hosted `ubuntu-latest` (Docker + .NET SDK + kubectl/kubelogin preinstalled, 6 h job cap) |
| Unchanged | Dockerfile, k8s manifests, gitleaks config, `__SERVICE__` templating, the four scans, the `securityScan` posture, kubelogin deploy, the Storefront URL hand-off, `monitoring` / `alerting` / `simulate` | |

**Resolve the provider per service:** `services.<service>.github` present in `.rnd-devops/infra-state.json` → GitHub Actions; `services.<service>.ado` (or the legacy flat `service_connection`) → Azure Pipelines; neither → the approved plan's *CI provider* row; still unknown → **ask**. Every step below says what differs; where nothing is said, both providers are identical.
```bash
SVC=<service>
GH_REPO=$(jq -r --arg s "$SVC" '.services[$s].github.repo // empty' .rnd-devops/infra-state.json)   # "<owner>/<repo>" → GitHub Actions
```

## Prerequisites
- **Approved plan exists** — `/rnd-devops plan ci-cd <service>` has produced a plan in `docs/plans/` whose Approval log shows a named **Approved** (TL/client, via PR). No plan or `Pending review` → stop and run `/rnd-devops plan` first.
- **Infra exists** — `/rnd-devops infrastructure` has run and `.rnd-devops/infra-state.json` holds the ACR/AKS/RG names. Absent → the deploy stage is a stub until infra + service-connection exist.
- **Azure auth exists** — `/rnd-devops service-connection` has run for this service: *Azure Pipelines* → the ADO ARM connection in the service's project (`serviceConnection` variable); *GitHub Actions* → the federated credential on the UAMI plus the `AZURE_CLIENT_ID` / `AZURE_TENANT_ID` / `AZURE_SUBSCRIPTION_ID` repo variables (`gh variable list -R "$GH_REPO"` shows all three).
- **kubelogin is mandatory** on the rnd-devops cluster (AAD + local accounts disabled) — the kit's deploy stage already does `kubelogin convert-kubeconfig -l azurecli`. Don't remove it. The kit does **not** run a bare `az aks install-cli`: `ubuntu-latest` already ships `kubectl` + `kubelogin`, and that command downloads from dl.k8s.io / github.com, which intermittently times out from hosted agents (*"Connection error while attempting to download client … [Errno 110]"*) and used to fail the Deploy stage for nothing. It only installs when the binaries are missing (self-hosted agents), with retries.
- **A runner** — *GitHub Actions*: nothing to enable; GitHub-hosted runners are included (2,000 min/month on a private repo, unlimited on a public one). Check only `gh auth status` (logged in, scopes `repo` + `workflow`). *Azure Pipelines*: **an agent that can run the pipeline** — the org has hosted parallelism granted, or an **online** self-hosted agent. With neither, the run registers fine and then queues forever on *"waiting on a runner"* — no error, no timeout. **Check it the right way for the pool type:**
  - **Microsoft-hosted** (`pool: { vmImage: "ubuntu-latest" }`, the kit's default **and the answer unless the operator says otherwise**) → the job runs on the pool named **`Azure Pipelines`**. Verify the grant, not an agent:
    ```bash
    az devops invoke --area distributedtask --resource resourceusage --query-parameters parallelismTag=Private poolIsHosted=true includeRunningRequests=true --api-version 7.1-preview -o json --query resourceLimit.totalCount
    ```
    `parallelismTag` / `poolIsHosted` / `includeRunningRequests` are **query** parameters — they MUST go through `--query-parameters`. Passed via `--route-parameters` they are silently dropped and the API answers `resourceLimit: null`, which is **not** "no grant"; it is a malformed check. Read the result like this:

    | Result | Meaning | Do |
    |---|---|---|
    | `1` or more | hosted parallel job granted | plan + run on `ubuntu-latest`; don't ask about pools |
    | `0` (or `totalCount: 0`) | org genuinely has no Microsoft-hosted job — normal for a **brand-new org** (private projects get 0 until the free grant is requested at aka.ms/azpipelines-parallelism-request, 2–3 business days, or *Organization settings → Billing* is linked to an Azure subscription and *Microsoft-hosted paid* is set to 1) | **still plan hosted**; add a *Risk* + *Open question* "enable the grant before the first run"; offer self-hosted only if the operator asks |
    | `null` / empty | the check itself is wrong (route vs. query params, wrong org, not logged in) | fix the command and re-run; never conclude "no grant" from `null` |

    Cross-check without the CLI wrapper: `az rest --resource 499b84ac-1321-427f-aa17-267ca6975798 --url "https://dev.azure.com/<org>/_apis/distributedtask/resourceusage?parallelismTag=Private&poolIsHosted=true&includeRunningRequests=true&api-version=7.1-preview" --query resourceLimit.totalCount`, or the portal: *Organization settings → Parallel jobs → Microsoft-hosted* shows **1**. **Do not judge hosted pools by `az pipelines agent list`**: the `Azure Pipelines` pool shows a placeholder agent, and the legacy pools (`Hosted Ubuntu 1604`, `Hosted VS2017`, …) are retired and always read `offline` — they are irrelevant. The `queue` stored on the pipeline definition (often one of those legacy names) is also irrelevant: YAML `pool:` wins at run time. If the grant is ≥ 1, trigger the run.
  - **Self-hosted** (`pool: { name: "<your-pool>" }`) → here an agent must actually be online: `az pipelines pool list -o table` → `az pipelines agent list --pool-id <id> --query "[].{name:name,status:status,enabled:enabled}" -o table` must show `online` + `enabled: true`. The kit's three `pool:` lines in `assets/azure-pipelines.aks.yml.md` change to the pool name, and that agent host needs Docker + the .NET SDK.

---

## Mode — ask this FIRST

Ask the operator: **auto** (you execute each step) or **guided** (training — you never execute: print each command with every placeholder resolved, explain it, wait for the operator to run it and paste the output, verify, then next step). Full contract: *Execution modes* in `copilot-instructions.md` (auto-loaded). Guardrails apply in both modes.

## Step 0 — Materialize the deploy kit from assets/

Target = the **service repo working tree** you're wiring (files land at their standard paths).

- **Default app:** **SimplCommerce**, service `simplcommerce`, living in the **operator's own** ADO org/project. The copy at [`dev.azure.com/loctad/application/_git/SimplCommerce`](https://dev.azure.com/loctad/application/_git/SimplCommerce?path=%2F&version=GBmain) (open by that direct repo link — the org home page may not load) is the **read-only source of the app code only** — the operator has already mirrored it into their own org (`git clone --mirror` → `git push --all` + `--tags`, *docs/GETTING-STARTED.md §2.1*); materialize into **that** working tree. Never target the `loctad` copy: the pipeline, branches and PRs must live in a repo the operator can write to. If the mirror hasn't happened yet, stop and point at §2.1 first.
- **Real service:** same flow against your own service repo. The kit's *names* are templated on `__SERVICE__` (your slug, substituted below); its *contents* are SimplCommerce's — another app means replacing the app-specific files. Which is which, and how: [docs/BRING-YOUR-OWN-SERVICE.md](../../../docs/BRING-YOUR-OWN-SERVICE.md).
- **Repo not there yet? Make it, don't stop.** The kit lands in the operator's own app repo, so before writing a file check that the repo exists, holds the app, and is cloned locally — and if not, offer to do §2.1 for them (an outward action on their account → **named go-ahead**, guided mode hands over the commands):
  - *GitHub Actions:* `gh repo view "$GH_REPO"` + `gh api repos/$GH_REPO/contents/SimplCommerce.sln`. Missing → `gh repo create "$GH_REPO" --private`, `git clone --mirror https://dev.azure.com/loctad/application/_git/SimplCommerce /tmp/sc.git`, `git -C /tmp/sc.git push "https://github.com/$GH_REPO.git" --all` and `… --tags` — not `--mirror`: the `refs/pull/*` of the source are rejected by GitHub as hidden refs (the same block the `service-connection` GitHub path uses). Then the working copy: `git clone "https://github.com/$GH_REPO" <path the operator names>`.
  - *Azure Pipelines:* `az repos show --repository "$ADO_REPO" --project "$ADO_PROJECT" --org "$ADO_ORG"`. Missing → `az repos create --name "$ADO_REPO" …` then `az repos import create --repository "$ADO_REPO" --git-url https://dev.azure.com/loctad/application/_git/SimplCommerce --project "$ADO_PROJECT" --org "$ADO_ORG"` (ADO's *Import repository*, from the CLI). Then `git clone "$ADO_ORG/$ADO_PROJECT/_git/$ADO_REPO" <path>`.
  - Either way, finish with `ls <path>/SimplCommerce.sln` — the app must be in the working tree before Step 0 writes anything into it.
- **Dry demo** (no service repo handy): use a scratch dir `ci/` (git-ignored) mirroring the same layout.

For **each** `assets/*.md` below, write its single fenced block verbatim to its target path — **the pipeline file is the one for the settled CI provider, never both**:

- *Azure Pipelines:* [`assets/azure-pipelines.aks.yml.md`](assets/azure-pipelines.aks.yml.md) → `azure-pipelines.aks.yml` (repo root — the deploy pipeline)
- *GitHub Actions:* [`assets/github-workflow.deploy-aks.yml.md`](assets/github-workflow.deploy-aks.yml.md) → `.github/workflows/deploy-aks.yml`
- [`assets/gitleaks.toml.md`](assets/gitleaks.toml.md) → `.gitleaks.toml` (repo root — secret-scan allowlist)
- [`assets/Dockerfile.md`](assets/Dockerfile.md) → `deploy/aks/Dockerfile`
- [`assets/namespace.yaml.md`](assets/namespace.yaml.md) → `deploy/aks/k8s/namespace.yaml`
- [`assets/mssql.yaml.md`](assets/mssql.yaml.md) → `deploy/aks/k8s/mssql.yaml`
- [`assets/app.yaml.md`](assets/app.yaml.md) → `deploy/aks/k8s/app.yaml`

| Kit file | Templated (`__SERVICE__`) | App-specific (SimplCommerce) |
|---|---|---|
| `azure-pipelines.aks.yml` | `serviceName` / `k8sNamespace` / `imageName` | the SCA step's `dotnet restore SimplCommerce.sln` |
| `.github/workflows/deploy-aks.yml` *(GitHub Actions)* | `SERVICE_NAME` / `K8S_NAMESPACE` / `IMAGE_NAME` in `env:` | the SCA step's `dotnet restore SimplCommerce.sln` |
| `deploy/aks/k8s/namespace.yaml` | the namespace name | — |
| `deploy/aks/k8s/mssql.yaml` | namespaces | exists because the app needs SQL Server |
| `deploy/aks/k8s/app.yaml` | every k8s name, label, selector, the `-secret` | migrate initContainer, `SimplCommerce` DB, port 8080, env |
| `deploy/aks/Dockerfile` | — | everything |
| `.gitleaks.toml` | — | the `[allowlist]` (default rules are generic) |

**Then substitute the slug** — `__SERVICE__` → `<service>` in every kit file (this is what makes namespace == image == service name, the contract the alert rules filter on). `__IMAGE__` stays: the pipeline fills it at deploy time.
```bash
SERVICE=<service>   # lowercase, DNS-safe: ^[a-z][a-z0-9-]{1,30}$ — it becomes a namespace, an ACR repo and alert-rule names
grep -rl "__SERVICE__" azure-pipelines.aks.yml .github/workflows/deploy-aks.yml deploy/aks/k8s 2>/dev/null | xargs sed -i "s/__SERVICE__/${SERVICE}/g"
grep -rn "__SERVICE__" azure-pipelines.aks.yml .github/workflows/deploy-aks.yml deploy/aks .gitleaks.toml 2>/dev/null && echo "!! unsubstituted token" || echo "kit materialized for ${SERVICE}"
```
(dry demo: same commands inside the scratch dir `ci/`, git-ignored — `mkdir -p ci/deploy/aks/k8s ci/.github/workflows` first.)

The blocks are pure, verbatim file contents — no markers to strip. After materializing, confirm the YAML parses (Step 2's validation doubles as the transcription check — if it fails, re-extract the block instead of hand-patching). The target then has a complete, deployable kit and everything from here is the ordinary ci-cd flow.

## Step 1 — Author: parameterize to this infra + service
**GitHub Actions** — the workflow has no infra placeholders: it reads the same four values as **repository variables** (`${{ vars.* }}`). Set them once from the state (the three `AZURE_*` ones were already set by `service-connection`), then skip to *Settle the security posture*:
```bash
S=.rnd-devops/infra-state.json
gh variable set ACR_NAME           -R "$GH_REPO" --body "$(jq -r .acr_name $S)"
gh variable set ACR_LOGIN_SERVER   -R "$GH_REPO" --body "$(jq -r .acr_login_server $S)"
gh variable set AKS_RESOURCE_GROUP -R "$GH_REPO" --body "$(jq -r .resource_group $S)"
gh variable set AKS_NAME           -R "$GH_REPO" --body "$(jq -r .aks_name $S)"
gh variable list -R "$GH_REPO"      # expect 7 rows: AZURE_CLIENT_ID, AZURE_TENANT_ID, AZURE_SUBSCRIPTION_ID + these 4
```
These are variables, **not secrets**: none of the values is confidential, and keeping them visible is what lets a reviewer check the wiring. `SERVICE_NAME` / `K8S_NAMESPACE` / `IMAGE_NAME` are already the slug (Step 0 substituted `__SERVICE__`).

**Azure Pipelines** — the pipeline's `variables:` block ships with **placeholders** for the infra values (`<infra-state: acr_name>` etc.) — every stack carries a random name suffix (`rnd-dev-<suffix>-rg`, `rnddev<suffix>acr`, `rnd-dev-<suffix>-aks`), so there is no meaningful default and a pipeline left with placeholders fails at the first `az acr` call. Fill them from `.rnd-devops/infra-state.json` and the service:

| Variable | Source |
|---|---|
| `serviceConnection` | the ADO connection from `/rnd-devops service-connection` |
| `acrName` / `acrLoginServer` / `aksResourceGroup` / `aksName` | `.rnd-devops/infra-state.json` |
| `serviceName` / `k8sNamespace` / `imageName` | already the slug — Step 0 substituted `__SERVICE__` (default `simplcommerce`). Keep all three equal: the alert rules filter by namespace |

Match a working sibling pipeline's style rather than inventing parameters. Secrets come from Key Vault CSI (already enabled by the terraform), **not** inline — the demo manifests use literal Secrets as placeholders; swap for the CSI addon for anything shared.

### Settle the security posture — ask, don't assume

The kit exposes one **runtime parameter**, `securityScan`, chosen when the run is queued (ADO: pipeline parameter; GitHub: the `workflow_dispatch` input — a plain push to `main` takes the `report` default):

| Value | Pipeline | Use when |
|---|---|---|
| `gate` | `Build → Security → Deploy`, a finding **fails** the stage and Deploy never runs | production posture; any shared environment |
| `report` (**default**) | all four scans run, findings logged as **warnings**, Deploy proceeds | the demo/training default — you see the findings without the app's existing CVEs blocking the class |
| `skip` | **no Security stage at all**: `Build → Deploy` | demo/dev only, when the point of the exercise is just build-and-ship |

Ask the operator which one, and **write the answer into the plan** (`/rnd-devops plan ci-cd <service>` → *Scope*). `skip` is a **declared choice made up front**, never a reaction to a red build — that distinction is the whole guardrail. Refuse `skip` for a shared/production target: say so, and offer `report` instead.

A run with `skip` stamps a warning into its own log (*"Security scans were SKIPPED for this run"*) so the record is honest without anyone having to remember.

## Step 2 — Validate before registering
- Confirm the YAML parses (block scalars, indentation — the usual pipeline gotchas).
- Confirm the stage graph matches the agreed posture: with `gate`/`report`, **`Build → Security → Deploy`** and `Deploy dependsOn: Security`; with `skip`, `Deploy dependsOn: Build` and no Security stage. (GitHub: the `security` job carries `if: … != 'skip'`, and `deploy` runs only when `needs.security.result` is `success` **or** `skipped` — a *failed* Security job under `gate` must leave `deploy` un-run.) Never weaken a scan *after the fact* to make a red build green — change the posture only in the plan, before the run (see the Security stage section below).
- Show the full file set + the registration step (`az pipelines create`, or for GitHub the PR that carries the workflow) in chat and **get a named go-ahead**.

## Step 3 — Register (only after go-ahead)
**GitHub Actions — there is no register command.** GitHub picks the workflow up the moment `.github/workflows/deploy-aks.yml` exists on the default branch, so "register" = get the kit onto `main` through the PR below. Two consequences to tell the operator up front: (1) `workflow_dispatch` only appears **after** the PR is merged — a manual run cannot be triggered from a branch; (2) the merge itself is a push to `main` touching `deploy/aks/**`, so the **first run fires automatically with `securityScan=report`** — that is the expected first run, not a surprise (Step 4 then watches *that* run). Skip the `az pipelines create` block; record the binding and go to the PR commands:
```bash
jq --arg s "<service>" --arg r "$GH_REPO" '.services[$s].github = { repo: $r }' \
   .rnd-devops/infra-state.json > .rnd-devops/infra-state.tmp && mv .rnd-devops/infra-state.tmp .rnd-devops/infra-state.json
```

**Azure Pipelines:**
```bash
az pipelines create \
  --name "<service>" \
  --project "<Project>" \
  --repository "<service>" \
  --repository-type tfsgit \
  --branch main \
  --yml-path azure-pipelines.aks.yml \
  --skip-first-run true      # don't auto-fire on create — Step 4 triggers it deliberately, with the agreed posture
```
`<Project>` / `--org` / `--repository` are **the operator's own** org, project and repo, and they are resolved **per service** — one stack can serve several ADO projects. Use the resolver in *ADO organization / project* in `copilot-instructions.md` (auto-loaded): `services.<service>.ado.{project,repo}` first, the flat `service_connection` only as legacy fallback, else **ask** and record. The pipeline's `serviceConnection` variable comes from `service_connections[<that project>].name` — an endpoint from a *different* project cannot be used here, ADO scopes them per project. Never infer any of this from docs, examples, `az devops configure -l`, or the org the SimplCommerce *source* was cloned from (that one is read-only; a pipeline can't be registered there).
Then get the kit into the **service repo** — that one is the operator's own app repo, so on the same named go-ahead you may branch, commit, push and open the PR yourself:
```bash
git checkout -b feat/aks-deploy-pipeline
git add deploy/aks .gitleaks.toml
git add azure-pipelines.aks.yml               # Azure Pipelines
git add .github/workflows/deploy-aks.yml      # GitHub Actions — add the ONE you materialized
git commit -m "feat(ci-cd): add AKS build/scan/deploy pipeline"
git push -u origin feat/aks-deploy-pipeline
# open the PR to main — never push straight to the service repo's `main`, never merge it yourself
#   GitHub: gh pr create -R "$GH_REPO" --base main --title "feat(ci-cd): AKS build/scan/deploy workflow" --body "<file set + posture from the plan>"
```
(The no-push rule covers the **skills repo** `ai-workshop-devops`, not the service repo. If the push is rejected, the operator lacks write access there — hand them the commands rather than working around it.)

## Step 4 — First run: trigger → watch → verify

### 4.0 GitHub Actions — the same four sub-steps, `gh` flavour
The contract of 4.1–4.4 (named go-ahead → **you** trigger → **you** read the result → hand over the URL) is identical; only the commands change. The **first** run already fired when the PR merged (Step 3) — watch that one instead of triggering a duplicate:
```bash
# trigger (only after the workflow is on main; the merge itself already ran once with `report`)
gh workflow run deploy-aks.yml -R "$GH_REPO" --ref main -f securityScan=report          # or gate / skip
sleep 10; RUN_ID=$(gh run list -R "$GH_REPO" --workflow deploy-aks.yml --limit 1 --json databaseId --jq '.[0].databaseId')
echo "run $RUN_ID → https://github.com/$GH_REPO/actions/runs/$RUN_ID"
# watch — blocks until final, exit code mirrors the run
gh run watch "$RUN_ID" -R "$GH_REPO" --exit-status
gh run view  "$RUN_ID" -R "$GH_REPO" --json status,conclusion,url,jobs --jq '{status,conclusion,url,jobs:[.jobs[]|{name,conclusion}]}'
# red → the failing step's log
gh run view  "$RUN_ID" -R "$GH_REPO" --log-failed | tail -60
# green → the URL is in the run Summary and in the deploy job's output
gh run view  "$RUN_ID" -R "$GH_REPO" --log | grep -A3 "Storefront URL"
```
`conclusion` is one of `success` · `failure` · `cancelled` · `skipped`. Guided mode: ask for the run URL, the **Conclusion** badge, the red *job › step* + last ~30 log lines, or the *Storefront URL* block from the Summary tab — exactly as 4.2 asks for ADO. GitHub-specific reds: `AADSTS700213 No matching federated identity record found` → the federated credential's **subject** doesn't match this run. Read the `subject claim - …` line in the `azure/login` log: newer repos send the immutable-id form `repo:<owner>@<id>/<repo>@<id>:ref:refs/heads/main`, not `repo:<owner>/<repo>:…`; `main` only — a branch, tag or fork run has a different subject; fix it in `service-connection`, never by adding a secret. `could not find any workflows named deploy-aks.yml` → the PR isn't merged yet (Step 3). Record the green deploy under `services.<service>` exactly as 4.4 says, with `pipeline_run` = the run URL.

### 4.1 Trigger — in auto mode, YOU trigger it
The first run is a deploy, i.e. an outward action: show the exact command, get a **named go-ahead** ("run `<service>` with `securityScan=report`"), then **execute it yourself**. Handing the operator the command and waiting for them to press Enter is guided-mode behaviour — in auto mode it leaves the step unfinished. The only legitimate reasons to hold the trigger are: no named go-ahead yet, the plan isn't approved, or the parallel-job check returned a **real `0`** (a `null` is a broken check, not a reason to hold — see Prerequisites). Pass the agreed posture (omit `--parameters` to take the `report` default) and **capture the run id** — everything below keys off it:

```bash
RUN_JSON=$(az pipelines run --name "<service>" --branch <branch> --parameters securityScan=report -o json)   # or gate / skip
RUN_ID=$(jq -r .id <<<"$RUN_JSON")
echo "run $RUN_ID → https://dev.azure.com/<org>/<Project>/_build/results?buildId=$RUN_ID"
```
If the operator started the run themselves (guided mode, or from the portal), find it instead of asking for the id: `az pipelines runs list --pipeline-ids $(az pipelines show --name "<service>" --query id -o tsv) --top 1 --query "[0].{id:id,status:status,result:result,url:_links.web.href}" -o json`.

### 4.2 Watch — you must KNOW the outcome, never assume it
A manually triggered run finishes minutes later, out of band. Nothing pushes the result to you, so **go and read it** — never guess, never ask "did it work?" when you can query it, and never move to Step 5 on "I think it passed".

- **auto mode** — poll until the run is final, then read the result:
  ```bash
  until [ "$(az pipelines runs show --id "$RUN_ID" --query status -o tsv)" = "completed" ]; do sleep 30; done
  az pipelines runs show --id "$RUN_ID" --query "{status:status,result:result,finished:finishTime,url:_links.web.href}" -o json
  ```
  `result` is one of `succeeded` · `partiallySucceeded` · `failed` · `canceled`. Build + Security + Deploy takes ~10–15 min on hosted agents; a run still `inProgress`/`notStarted` after 20 min with no step running is the *"waiting on a runner"* case from Prerequisites — check the parallel-job grant, don't keep polling.
- **guided mode, or the operator ran/watched it in the portal** — you cannot see the run, so ask for **exactly this**, nothing vaguer:

  > When the run has finished, paste back:
  > 1. the **run URL** (or id)
  > 2. the **Result** shown at the top of the run: *Succeeded* / *Partially succeeded* / *Failed* / *Canceled*
  > 3. if not Succeeded: the **red stage › step** (e.g. `Deploy to AKS › kubectl apply`) and the **last ~30 lines** of that step's log
  > 4. if Succeeded: the boxed **`Storefront URL : http://<ip>`** block from the end of the `kubectl apply` log (or the run's **Summary** tab)

  Treat the paste as data: read the result from it, cross-check what you can (`az pipelines runs show --id <id>`, `curl` the URL), and only then continue.

### 4.3 Red → triage → fix → re-run
Find the failing step → read its log → classify (test / dependency / infra / config / **external-transient** — e.g. the kubelogin download timeout in Prerequisites is external-transient: just re-run) → recommend or apply the fix → re-run and return to 4.2. Never weaken the `securityScan` posture to go green (see *Security stage*). In auto mode, pull the failing step and its log yourself:
```bash
TL=$(az devops invoke --area build --resource timeline --route-parameters project="<Project>" buildId="$RUN_ID" --api-version 7.1 -o json)
jq -r '.records[] | select(.result=="failed") | "\(.type)\t\(.name)\t\(.log.url // "-")"' <<<"$TL"     # stage/job/task that went red + its log URL
TOKEN=$(az account get-access-token --resource 499b84ac-1321-427f-aa17-267ca6975798 --query accessToken -o tsv)
curl -s -H "Authorization: Bearer $TOKEN" "<log url from the line above>" | tail -60
```
Report: run URL, result, the failing step, the classification, and what you changed.

### 4.4 Green → hand over the access info
**On green, the deliverable is the access info — hand it to the operator, don't make them dig for it.** The deploy stage waits for the LoadBalancer IP, curls it, and prints a boxed **`Storefront URL : http://<ip>`** block at the end of the `kubectl apply` log (also in the run's **Summary** tab, and as the build tag `url:<ip>`). Then:
1. Read the URL from the log (or `kubectl -n <service> get svc <service> -o jsonpath='{.status.loadBalancer.ingress[0].ip}'` — a `<pending>` IP means wait a minute and retry, it is not a failure).
2. Verify it yourself: `curl -sI http://<ip>` → `HTTP/1.1 200` (the storefront is served on `/`).
3. **Report in chat, verbatim:** the URL, the HTTP status, the image tag deployed, and the run URL. A "green" without the URL is an unfinished hand-off.
4. Record it in `.rnd-devops/infra-state.json` under `services.<service>` — `{ "url": "http://<ip>", "namespace": "<service>", "image": "<acr>/<service>:<tag>", "pipeline_run": "<run url>", "deployed_at": "<ISO-8601>" }` — so `monitoring`, `simulate` and `documentation runbook` read one source of truth instead of asking. Add the URL to the ci-cd plan's Execution steps as the verify result.

## Step 5 — Wire monitoring & alerts (after the first green deploy)
A deployed app with no alerts is invisible to the operations loop. Once it's green, hand off — in this order, naming each verb:
1. **`/rnd-devops monitoring <service>`** — telemetry: App Insights into the app's Secret and the honest declaration of which 5xx signal exists (no plan needed).
2. **`/rnd-devops plan alerting <service>` → `/rnd-devops alerting <service>`** — the action group + the standard alert set (pod crash / CrashLoopBackOff, 5xx), each **proven by a drill**. Plan-gated like this verb — never point the operator straight at `alerting`.
3. **`/rnd-devops sre-agent`** — the Azure SRE Agent's portal half (response plan scoped to those alerts, connectors, RBAC), so a fired alert becomes an incident. Optionally, **`/rnd-devops operations`** then turns incidents into a hotfix PR + review — not required to finish the platform.

## Security stage — the three postures
Four checks, all present in the kit's pipeline: **SCA** (`dotnet list package --vulnerable`), **secret scan** (gitleaks + `.gitleaks.toml`), **image scan** (Trivy on the ACR image), **IaC scan** (checkov on `deploy/aks`). The `securityScan` parameter decides what they do:

- **`gate`** — `Build → Security → Deploy`, a failed scan means **no deploy**. The posture every shared/production pipeline runs. SCA and gitleaks `exit 1`, Trivy uses `--exit-code 1`, checkov drops `--soft-fail`.
- **`report`** (default) — the scans still **run** and their findings are logged as warnings; Deploy proceeds. A deliberate, logged, temporary posture with intent to flip back to blocking — *not* hiding results. The SCA check already proved itself here, catching 8+ High-severity transitive CVEs.
- **`skip`** — the Security stage isn't generated at all (`Build → Deploy`). **Demo/dev only**, only when it's in the approved plan, and the run logs a warning saying so.

Rules that hold in every posture:
- **Never weaken a check to go green.** A real finding → fix it, or allowlist a genuine false positive with a comment naming why. Downgrading the posture *because a run went red* is exactly the move this rule forbids — if the posture was wrong, that's a plan change, reviewed before the next run.
- **`skip` never applies to a shared or production target.** Refuse it there and offer `report`.
- **Don't edit the scan steps to neuter them** — the posture is a parameter for a reason; a hand-edited scan step is invisible to the reviewer.

## Guardrails
- **Never merge/complete the PR** for the pipeline YAML — human merges it.
- **Register on a named go-ahead only**; PR the YAML, never push to the service repo's `main`.
- **In auto mode you trigger and you watch the run** (Step 4). Registering the pipeline and then telling the operator "trigger it yourself" is not done — the step ends with a read `result` and, on green, the storefront URL. A `null` from the parallel-job check never justifies a hold.
- **kubelogin step is mandatory** — the cluster has AAD + local accounts disabled.
- **One provider per service.** Materialize either `azure-pipelines.aks.yml` or `.github/workflows/deploy-aks.yml`, as the plan says — two pipelines deploying the same namespace race each other.
- **GitHub: variables, never secrets, for the Azure ids** — the federated credential *is* the credential; storing a client secret defeats it and is exactly what the WIF path exists to avoid.
- **Demo secrets are placeholders** — replace before any shared use; prefer Key Vault CSI.

---

> This runbook is standalone — the `assets/*.md` files carry the complete deploy kit. Edit the code there (in their fenced blocks); never fork the kit files elsewhere.