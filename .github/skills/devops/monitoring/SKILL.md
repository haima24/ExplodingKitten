---
name: monitoring
description: "Wire TELEMETRY for a deployed service — an App Insights resource on the stack's Log Analytics workspace, its connection string into the app's Secret + a restart, and an honest check of which signal actually flows (SDK present → the requests table; no SDK → ContainerLogV2 from Container Insights). That declared path is what alerting builds its 5xx rule on. Commands embedded. Runs auto or guided. Not plan-gated — named go-ahead only. Use right after a service's first green deploy; then plan alerting → alerting → sre-agent."
---

# rnd-devops · monitoring

`/rnd-devops monitoring [service]` — give a deployed service **telemetry**: App Insights on the stack's LAW, the connection string into the app, and an honest answer to *"which signal do we actually have?"* That answer — **Path A** (`requests` table, SDK wired) or **Path B** (`ContainerLogV2`, no SDK) — is recorded in `infra-state.json` and is what `/rnd-devops alerting` builds its 5xx rule on. Default service: `simplcommerce`.

This verb is deliberately **narrow**. Alert rules + the drills that prove them live in **`alerting`** (plan-gated); the SRE Agent's portal configuration lives in **`sre-agent`**. The flow after a green deploy is:

`monitoring` (telemetry) → `plan alerting <service>` → `alerting` (rules + proof) → `sre-agent` (response plan) — *then optionally* → `operations`

## How it works (3 steps)
1. **App Insights** `<service>-ai` on the stack's Log Analytics workspace.
2. **Wire it in** — connection string → Secret → env var → rollout restart.
3. **Verify + declare** — prove data flows, write `services.<service>.telemetry.path` (`A`|`B`) into `infra-state.json`.

## Prerequisites
- **Infra exists** — `.rnd-devops/infra-state.json` holds the RG/AKS/LAW names (`/rnd-devops infrastructure` wrote it). Container Insights is already flowing to the LAW (`<prefix>-<env>-<suffix>-law` — `.log_analytics_workspace_name` in the state file; names carry a random per-stack suffix, so always read them from the file).
- **Container Insights log schema is out-of-band vs Terraform.** Which table stdout lands in is decided by the `container-azm-ms-agentconfig` ConfigMap in `kube-system` (`[log_collection_settings.schema] containerlog_schema_version = "v1"|"v2"`), which the `oms_agent` block does **not** manage. Older stacks ship `ContainerLog` (v1); `ContainerLogV2` needs that ConfigMap plus an `ama-logs` restart. If you switch it, **reconcile it into `tf/`** — otherwise the next cluster rebuild silently reverts the schema and every rule built on `ContainerLogV2` goes quiet. Check the live value before assuming: `kubectl -n kube-system get configmap container-azm-ms-agentconfig -o jsonpath='{.data.log-data-collection-settings}'`.
- **Service deployed & green** — `/rnd-devops ci-cd <service>` has a green run; the app is reachable (its URL is in `infra-state.json` → `services.<service>.url`).
- **No plan of its own.** One App Insights resource plus a Secret change in the service's namespace — the ci-cd plan already covers the service, and `alerting` has its own plan. A **named go-ahead** before the `create` and before the `rollout restart` is enough.

## Mode — ask this FIRST

Ask the operator: **auto** (you execute each step) or **guided** (training — you never execute: print each command with every placeholder resolved, explain it, wait for the operator to run it and paste the output, verify, then next step). Full contract: *Execution modes* in `copilot-instructions.md` (auto-loaded). Guardrails apply in both modes.

## Step 1 — App Insights on the stack's workspace
```bash
RG=$(jq -r .resource_group .rnd-devops/infra-state.json)
LOC=$(jq -r .location .rnd-devops/infra-state.json)
LAW_ID=$(jq -r .log_analytics_workspace_id .rnd-devops/infra-state.json)
if [ -z "$LAW_ID" ] || [ "$LAW_ID" = "null" ]; then
  # infra-state.json predates this key (stack applied before 2026-09-07) — the RG holds exactly one workspace.
  # Preferred fix: re-export the outputs (infrastructure Step 5); quick fallback:
  LAW_ID=$(az monitor log-analytics workspace list -g "$RG" --query "[0].id" -o tsv)
fi

az monitor app-insights component create \
  --app "<service>-ai" -g "$RG" -l "$LOC" \
  --workspace "$LAW_ID" --application-type web

AI_ID=$(az monitor app-insights component show --app "<service>-ai" -g "$RG" --query id -o tsv)
AI_CONN=$(az monitor app-insights component show --app "<service>-ai" -g "$RG" --query connectionString -o tsv)
```
**Verify:** `az monitor app-insights component show --app "<service>-ai" -g "$RG" --query provisioningState` → `Succeeded`. Re-running is idempotent (`create` on an existing component updates it).

## Step 2 — Wire the connection string into the app
The ASP.NET Core SDK reads `APPLICATIONINSIGHTS_CONNECTION_STRING`:
```bash
kubectl -n <service> create secret generic <service>-appinsights \
  --from-literal=APPLICATIONINSIGHTS_CONNECTION_STRING="$AI_CONN" \
  --dry-run=client -o yaml | kubectl apply -f -
# Reference it from the web container's env (deploy/aks/k8s/app.yaml → secretKeyRef; commit via PR in the service repo), then:
kubectl -n <service> rollout restart deployment/<service>
kubectl -n <service> rollout status deployment/<service> --timeout=300s
```
**Verify the wiring actually landed — creating the Secret proves nothing on its own:**
```bash
kubectl -n <service> get secret <service>-appinsights >/dev/null 2>&1 \
  && echo "secret: yes" || echo "secret: NO"
kubectl -n <service> get deploy <service> \
  -o jsonpath='{range .spec.template.spec.containers[*].env[*]}{.name}{"\n"}{end}' \
  | grep -qx APPLICATIONINSIGHTS_CONNECTION_STRING \
  && echo "env var: yes" || echo "env var: NO — Step 2 is NOT done"
```
`env var: NO` means the connection string never reached the app — the `secretKeyRef` PR in the service repo is still missing. For Path B that is a legitimate stopping point (without an SDK the connection string does nothing anyway), but you must then record `"connection_string_wired": false` in Step 3 and say in plain words that `<service>-ai` is a **placeholder resource until the SDK lands**. Never report "telemetry is wired" on the strength of Step 1 alone — that leaves an orphan App Insights resource and a false green.

> **Honesty check — which 5xx signal do you actually have?**
> - **Path A (the app has the App Insights SDK):** the `requests` table fills up → `alerting` uses the `requests`-based 5xx rule.
> - **Path B (no SDK yet — SimplCommerce's default):** `requests` stays **EMPTY**; the connection string alone adds nothing. `alerting` must use a **ContainerLogV2** rule over the app's stdout. Add the SDK as a normal PR later, then re-run `alerting` to switch the rule.
>
> **Container Insights captures stdout — it does not invent access logs.** ASP.NET Core keeps `Microsoft.AspNetCore` at `Warning` by default, so a stock ASP.NET app (SimplCommerce included) prints **no per-request line at all**: no ` 200 `, no ` 500 `, nothing carrying a status code. Verified on `shop-loc-a` 2026-09-08 — 66 stdout rows, all of them `warn:` startup lines, zero status codes. Before planning any status-code rule, either
> - **enable request logging** — add `Logging__LogLevel__Microsoft.AspNetCore.Hosting.Diagnostics=Information` to the deployment, which yields `Request finished HTTP/1.1 GET ... - 500 - ... 12.3ms` lines; or
> - **key the rule on error-level lines** (`fail:` / `crit:` — these clear the default `Warning` floor). But see Step 3: a `fail:`-based rule is **not proven until a drill fires it**, and it misses 502/503/504 raised by the ingress as well as any deliberate `StatusCode(500)`.
>
> Pick **one** path and write it down (Step 3) — a rule on an empty table, or on a pattern the app never emits, never fires and looks green forever.

## Step 3 — Verify data flows, then declare the path

### 3a — Precheck at the source, BEFORE querying Log Analytics
Log Analytics can only show what the container actually printed. Check that first — it costs ten seconds and saves a quarter of an hour:
```bash
kubectl -n <service> logs -l app=<service> --tail=200 | grep -nE ' (500|502|503|504) |^fail:|^crit:|"(GET|POST|PUT|DELETE)[^"]*" [0-9]{3}' | head
```
- **Matches** → that grep pattern is your signal. Carry the *same predicate* into 3b and into the rule.
- **No match** → **stop. Do not start polling.** The app is not printing the line you would be waiting for, and no amount of ingestion time changes that. Pick a fix from the table below, apply it, and re-run this precheck.

**Where the 5xx signal lives, by runtime.** Two different apps can both be "silent" for completely different reasons, so identify yours before choosing a predicate:

| Runtime | Default behaviour | Signal to use | Fix if silent |
|---|---|---|---|
| **ASP.NET Core** (SimplCommerce and friends) | `Microsoft.AspNetCore` sits at `Warning` → **no per-request line at all** | `LogLevel == 'error'`, `fail:`/`crit:` prefixes, exception text (`SqlException`, `An unhandled exception`) | add `Logging__LogLevel__Microsoft.AspNetCore.Hosting.Diagnostics=Information` → `Request finished ... - 500 - ... 12.3ms` |
| **nginx-served static SPA** (CRA / Vite build behind nginx) | depends entirely on the base image: the **official `nginx` image symlinks** `/var/log/nginx/access.log → /dev/stdout`; nginx installed via `apt` on a custom base writes a **real file** nothing collects | the access line's `$status` field — richest of all these | set `access_log /dev/stdout <format>;` in `nginx.conf` (one line; the container-correct way) |
| **Node / Next.js SSR** | Node writes no access log unless the app does | error-level lines, or add a request-logging middleware (`morgan`, `pino-http`) | add the middleware and log status codes |
| **Any app with a JSON logger** (Serilog JSON, pino, zap) | lines are JSON, so term/substring matching is unreliable | parse first: `extend p = parse_json(tostring(LogMessage))` then filter `p.status >= 500` or `p.level == 'error'` | none needed — but **never** match JSON with `has ' 500 '` |

> **The base-image trap is invisible from the manifests.** `access_log /var/log/nginx/access.log` in a committed `nginx.conf` looks correct and works on the official image, so reviewing the repo tells you nothing. Only this precheck does — read the `FROM`/`--build-arg BASEIMG` the pipeline actually passes, then confirm with `kubectl logs`.

### 3b — Confirm it reached the workspace
- **Path A:** portal → the App Insights resource → **Live Metrics** shows the app; or
  `az monitor app-insights query --app "<service>-ai" -g "$RG" --analytics-query "requests | take 5"` → rows after a few storefront hits.
- **Path B:** query the LAW with **the exact `where` clause the rule will use** — never a looser one:
  ```bash
  LAW_CID=$(az monitor log-analytics workspace show --ids "$LAW_ID" --query customerId -o tsv)
  az monitor log-analytics query -w "$LAW_CID" \
    --analytics-query "ContainerLogV2 | where PodNamespace == '<service>' | where <THE RULE PREDICATE> | take 5" -o table
  ```
  Hit the storefront first; ingestion lags 2–5 min.

> **Bounded wait — poll at most twice, ~10 minutes total.** Then stop and diagnose. Never sit in a silent poll loop reporting "probably ingestion lag": if the operator has to ask "any update?" to make you look again, the wait was unbounded and the runbook failed. Idle apps make this trap worse — SimplCommerce prints nothing between requests, so an empty result may only mean nobody generated traffic.

### 3c — If 3b is still empty after the bounded wait, diagnose by layer
Run these top-down. The first one that fails is your answer.

| # | Question | Check |
|---|---|---|
| 1 | Is the pipeline alive at all? | `Perf` / `KubePodInventory` have rows since the agent restarted → mdsd and upload are fine; stop suspecting them |
| 2 | Does the table get data from **any** namespace? | drop every filter: `ContainerLogV2 \| where TimeGenerated > ago(30m) \| summarize count() by PodNamespace` |
| 3 | Is the agent on the declared schema? | `kubectl -n kube-system logs <ama-logs-pod> -c ama-logs \| grep -i schema` → `Container logs schema=v2`; and `tail /var/opt/microsoft/linuxmonagent/log/mdsd.err` is empty |
| 4 | Does fluent-bit see the file? | read the **process** env — `kubectl exec` starts a fresh shell that does **not** inherit it: `tr '\0' '\n' < /proc/$(pgrep -f fluent-bit \| head -1)/environ \| grep TAIL_PATH`, then `ls /var/log/containers \| grep <service>` **on the node the pod actually runs on** |
| 5 | Did the app print the line at all? | 3a — and this is usually the answer |

> **Gotchas that cost real time.** `last` is a KQL **reserved word** (`summarize last=max(...)` → `SYN0002`). `LogMessage` in `ContainerLogV2` is `dynamic`, so string functions need `tostring(LogMessage)` (`extract()` straight on it → `SEM0202`). And fluent-bit keeps a position DB (`/var/log/omsagent-fblogs.db`), so a **schema switch does not backfill** files it already consumed — only newly created/rotated logs appear. That reads exactly like ingestion lag but never resolves.

### 3d — Declare it
In `.rnd-devops/infra-state.json` under `services.<service>.telemetry`:
```json
{
  "app_insights": "<service>-ai",
  "app_insights_id": "<AI_ID>",
  "path": "B",
  "signal_table": "ContainerLogV2",
  "signal_predicate": "<the exact where clause proven in 3b>",
  "signal_proven": true,
  "connection_string_wired": false,
  "verified_at": "<ISO-8601>"
}
```
`alerting` reads `path` and `signal_predicate`, and refuses to guess either.
- Never write `A` on provisioningState alone — only on rows in `requests`.
- If you could **not** prove the predicate (3a found no match and you settled on a `fail:`-based signal), write `"signal_proven": false` with a `"signal_note": "<why>"`, and tell the operator in plain words that the 5xx rule stays **unproven until the alerting drill fires it**. Declaring a predicate you have never observed is the same failure as pointing at an empty table — one level deeper and harder to see.

## Hand off
- **Next:** `/rnd-devops plan alerting <service>` → `/rnd-devops alerting <service>` — the action group, the two alert rules on the path declared above, and the drills that prove them. `alerting` is plan-gated; this verb is not — don't skip the plan because you "just did monitoring".
- Later: adding the SDK (a normal PR in the service repo) moves Path B → A; re-run `alerting` to switch the 5xx rule.

## Guardrails
- **Named go-ahead** before creating the App Insights resource and before the rollout restart (it bounces a running service).
- **Never claim telemetry works from `provisioningState`.** Step 3 must show rows — and on the path you declared.
- **Never claim the app is wired from the Secret.** Step 2's env-var check must print `env var: yes`, or you record `connection_string_wired: false` and say so out loud.
- **One path, written down — proven at the predicate, not the table.** No downstream rule may use a `where` clause this verb has not seen return rows. Rows *somewhere* in the table are **not** enough: a namespace full of `warn:` startup lines satisfies a table-level check while the rule's own predicate matches nothing. The query you prove in 3b must be the query the rule runs.
- **Bounded wait, then diagnose.** Two polls / ~10 minutes maximum, then Step 3c. "Still waiting, probably ingestion lag" is not a status report.
- **This verb creates no alert rules and touches no SRE Agent.** If asked for alerts here, hand off to `alerting`; if asked about the agent, to `sre-agent`.
