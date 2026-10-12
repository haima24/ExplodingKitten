---
name: alerting
description: "Create and PROVE the standard alert set for a deployed service — an action group, the pod-crash/CrashLoopBackOff rule and the 5xx rule (on the telemetry path monitoring declared), then simulate one failure per rule, watch it Fired, and roll back. KQL + CLI embedded. Plan-gated (plan alerting <service>): rules page humans and the drills break a running service. Runs auto or guided. On a stack with an SRE Agent the drills run AFTER sre-agent's response plan exists, so one drill proves the rule AND the incident; without an agent they run here. Either way it hands off to sre-agent, because a Fired alert only becomes an incident once a response plan covers it."
---

# rnd-devops · alerting

`/rnd-devops alerting [service]` — put the **standard alert set** on a deployed service and **prove** it: an action group, `<service>-pod-crash` and `<service>-5xx` (both severity 1), then one simulated failure per rule → `Fired` → rollback. This runbook is fully **self-contained**: the CLI commands and KQL are embedded below. Default service: `simplcommerce`.

**Why this exists:** the SRE Agent and `/rnd-devops operations` only ever see what Azure Monitor fires. An alert that has never fired in a test is a hope, not an alert. And a `Fired` alert is still only half the loop — **`/rnd-devops sre-agent`** (next) makes the agent act on it.

## How it works (4 steps)
1. **Action group** — who gets told.
2. **Rules** — pod-crash (Container Insights) + 5xx on the path `monitoring` declared (`requests` or `ContainerLogV2`).
3. **Prove** — one drill per rule, watch it `Fired`, roll back. **On a stack with an SRE Agent, record the rule names first and let `sre-agent` wire the response plan before you drill** — same drill, one run, two proofs (Step 3's order check).
4. **Record + hand off** — `infra-state.json`, runbook, then `sre-agent`.

## Prerequisites
- **Infra exists** — `.rnd-devops/infra-state.json` (RG / LAW). Names carry a random per-stack suffix — always read them from the file.
- **Service deployed & green** — `services.<service>.url` in `infra-state.json`.
- **`monitoring` has run** — `services.<service>.telemetry.path` is `A` or `B`, **and** `signal_predicate` names the exact `where` clause it proved. Missing either → run `/rnd-devops monitoring <service>` first; **never guess the 5xx source and never fall back to this file's default predicate**. If `signal_proven` is `false`, you may still create the rule, but the plan and the runbook must record it as unproven until Step 3's drill fires it.
- **Approved plan exists** — `/rnd-devops plan alerting <service>` has produced a plan in `docs/plans/` whose Approval log shows a named **Approved** (TL/client). No plan or `Pending review` → stop and run `/rnd-devops plan alerting <service>` first. Same gate as `infrastructure` and `ci-cd`: rules page humans, the action group is shared state, and the drills deliberately break a running service.
- Even with the plan, each command set below is an **outward action** — show it and get a **named go-ahead** before running.

## Mode — ask this FIRST

Ask the operator: **auto** (you execute each step) or **guided** (training — you never execute: print each command with every placeholder resolved, explain it, wait for the operator to run it and paste the output, verify, then next step). Full contract: *Execution modes* in `copilot-instructions.md` (auto-loaded). Guardrails apply in both modes.

## Step 0 — Load the context
```bash
RG=$(jq -r .resource_group .rnd-devops/infra-state.json)
LAW_ID=$(jq -r .log_analytics_workspace_id .rnd-devops/infra-state.json)
[ -n "$LAW_ID" ] && [ "$LAW_ID" != "null" ] || LAW_ID=$(az monitor log-analytics workspace list -g "$RG" --query "[0].id" -o tsv)   # pre-2026-09-07 state files
TELEMETRY_PATH=$(jq -r '.services.<service>.telemetry.path // empty' .rnd-devops/infra-state.json)
[ -n "$TELEMETRY_PATH" ] || { echo "monitoring has not declared the telemetry path — run /rnd-devops monitoring <service> first"; exit 1; }
# The 5xx where-clause is monitoring's to declare, not this verb's to invent.
SIGNAL_PRED=$(jq -r '.services.<service>.telemetry.signal_predicate // empty' .rnd-devops/infra-state.json)
SIGNAL_PROVEN=$(jq -r '.services.<service>.telemetry.signal_proven // empty' .rnd-devops/infra-state.json)
[ -n "$SIGNAL_PRED" ] || echo "WARN: no signal_predicate declared — do NOT fall back to the ' 500 ' default; re-run /rnd-devops monitoring <service> Step 3"
[ "$SIGNAL_PROVEN" = "true" ] || echo "WARN: signal_proven is not true — the 5xx rule is a hypothesis until the Step 3 drill fires it. Say this in the plan."
ACR=$(jq -r .acr_login_server .rnd-devops/infra-state.json)
```

## Step 1 — Action group (who gets told)
```bash
az monitor action-group create -g "$RG" -n "<prefix>-ops-ag" --short-name "<prefix>ops" \
  --action email oncall <oncall-email>
AG_ID=$(az monitor action-group show -g "$RG" -n "<prefix>-ops-ag" --query id -o tsv)
```
Teams/webhook receivers can be added later — email is enough to prove the pipe. The **SRE Agent needs no receiver here**: its Azure Monitor connector (wired by `/rnd-devops infrastructure`) sees fired alerts subscription-wide.

## Step 2 — The standard alert set (2 rules, both severity 1)

**Rule 1 — pod crash / CrashLoopBackOff** (KQL over Container Insights):
```bash
az monitor scheduled-query create -g "$RG" -n "<service>-pod-crash" \
  --scopes "$LAW_ID" --severity 1 \
  --window-size 5m --evaluation-frequency 5m \
  --action-groups "$AG_ID" \
  --condition "count 'Crashes' > 0" \
  --condition-query Crashes="KubePodInventory
    | where Namespace == '<service>'
    | where ContainerStatus == 'waiting'
    | extend CurReason = tostring(ContainerStatusReason)
    | extend LastReason = tostring(parse_json(ContainerLastStatus).reason)
    | where CurReason in ('CrashLoopBackOff','ImagePullBackOff','ErrImagePull','CreateContainerError') or LastReason in ('CrashLoopBackOff','Error','OOMKilled')
    | distinct Name" \
  --description "A pod in <service> is crash-looping / OOM / unable to pull."
```

**Rule 2 — 5xx spike** — pick by `$TELEMETRY_PATH`, never by hope.

Path **A** (`requests` table, App Insights scope):
```bash
AI_ID=$(jq -r '.services.<service>.telemetry.app_insights_id' .rnd-devops/infra-state.json)
az monitor scheduled-query create -g "$RG" -n "<service>-5xx" \
  --scopes "$AI_ID" --severity 1 \
  --window-size 5m --evaluation-frequency 5m \
  --action-groups "$AG_ID" \
  --condition "count 'Errors' > 5" \
  --condition-query Errors="requests | where toint(resultCode) >= 500" \
  --description "<service> served >5 HTTP 5xx in 5 minutes."
```
Path **B** (no SDK — stdout access logs in the LAW):
```bash
az monitor scheduled-query create -g "$RG" -n "<service>-5xx" \
  --scopes "$LAW_ID" --severity 1 \
  --window-size 5m --evaluation-frequency 5m \
  --action-groups "$AG_ID" \
  --condition "count 'Errors' > 5" \
  --condition-query Errors="ContainerLogV2
    | where PodNamespace == '<service>'
    | where LogMessage has_any (' 500 ',' 502 ',' 503 ',' 504 ')" \
  --description "<service> logged >5 HTTP 5xx lines in 5 minutes."
```
> **Path B is app-dependent — and the predicate above is NOT SimplCommerce's default.** The `has_any (' 500 ', …)` shape assumes the app prints a per-request access line carrying a status code. **A stock ASP.NET Core app does not**: `Microsoft.AspNetCore` sits at `Warning` by default, so nothing per-request reaches stdout. Verified on `shop-loc-a` 2026-09-08 — every stdout row was a `warn:` startup line, zero status codes, so this query would have returned 0 rows forever while the rule showed a healthy `Never fired`.
>
> Use `monitoring`'s declaration, never this default: read `services.<service>.telemetry.signal_predicate` from `infra-state.json` and put **that** in the `where`. The two shapes you will meet:
> - **request logging enabled** (`Logging__LogLevel__Microsoft.AspNetCore.Hosting.Diagnostics=Information`) → lines like `Request finished HTTP/1.1 GET ... - 500 - ... 12.3ms` → the `has_any` predicate above works.
> - **error-level only** (no config change) → `LogMessage has 'fail:' or LogMessage has 'crit:'`. Note in the runbook what this **misses**: 502/503/504 raised by the ingress before the app is reached, and any deliberate `StatusCode(500)` that logs nothing.
>
> If `signal_proven` is `false`, say so in the plan and treat Step 3's drill as the **only** thing that can promote the rule to trusted. An app that logs JSON, or logs no HTTP status lines at all, makes a status-code rule silent forever — for such a service, find the real 5xx signature in the Logs blade first, or wire the SDK and use Path A, which is app-agnostic.
>
> **Idle silence has no heartbeat.** A `count > N` rule over a stream that is normally empty cannot tell "no errors" from "telemetry is dead" — both look like zero rows. SimplCommerce is completely silent between requests, so do not read a quiet 5xx rule as proof the pipeline works. The `pod-crash` rule (over `KubePodInventory`, which flows continuously) is your liveness evidence; confirm inventory/`Perf` rows are still arriving before trusting a green 5xx rule.

**Predicate by runtime** — copy the one that matches what `monitoring` proved, never the one that matches what you hope:

| Runtime | `--condition-query` `where` clause |
|---|---|
| ASP.NET Core, request logging **off** | `LogLevel == 'error' or LogMessage has_cs 'fail:' or LogMessage has_any ('An unhandled exception','SqlException')` |
| ASP.NET Core, request logging **on** | `LogMessage matches regex @'Request finished.* - 5\\d\\d - '` |
| nginx access log on stdout | `LogMessage matches regex @'" 5\\d\\d '` |
| JSON logger | `extend p = parse_json(tostring(LogMessage)) \| where toint(p.status) >= 500 or tostring(p.level) in ('error','fatal')` |

> **Use `matches regex`, not `has`, for status codes.** `has ' 500 '` reads like a precise match but behaves like a substring one: on a storefront it matches `Order total 500 USD` and pages the on-call for a price. Verified 2026-09-08 — the `' 500 '` clause on `shop-loc-a-5xx` contributed **0** true matches across a full drill window while carrying that false-positive risk. Anchor on the log format's own delimiters instead (`" 500 ` for nginx, `- 500 - ` for ASP.NET request logging).
>
> **Threshold unit is log lines, not failed requests.** One unhandled exception writes a `fail:` header plus a multi-line stack trace, and each line is one `ContainerLogV2` row — so `> 5` can be tripped by a single exception or missed by five quiet ones. For a demo or a first proof use `> 0` (as `pod-crash` does); tune upward only once you have measured how many rows one real failure produces in *your* app.
>
> KQL first, rules second: paste each query into the LAW's **Logs** blade before creating the rule — it must parse and (for the crash rule) return rows during the Step 3 drill. Fix the query there, not in the rule. CLI flags drift across versions — `az monitor scheduled-query create --help` if a flag is rejected. Re-running this verb **updates** existing rules (`az monitor scheduled-query update`); it never duplicates them.

**Verify:** `az monitor scheduled-query list -g "$RG" -o table` → both rules `Enabled`.

## Step 3 — Prove it: one drill per rule (demo env only)

> **Order — settle this BEFORE you drill.** A drill deliberately breaks a running service, and `sre-agent` needs one too as its own functional verify. Don't pay for it twice:
> ```bash
> jq -r '.sre_agent_name // "none"' .rnd-devops/infra-state.json
> ```
> - **A name** → do Step 4's state write **now** with `"proven": false` (the response plan scopes by **rule name**, which is all it needs), run **`/rnd-devops sre-agent <service>`**, then come back here. The drill then proves both halves in one run: the rule reaches `Fired` **and** the incident opens at `sre.azure.com` with the plan attached.
> - **`none`** → drill now; there is no incident half to prove. Still say Step 4's plain sentence about what enabling the agent takes.
>
> The drills, the rollbacks and the verifies below are identical either way — only their position moves. And rules recorded `"proven": false` are **not done**: if `sre-agent` stalls (no portal access, no OAuth consent, the operator stops), come straight back and drill.

- **Pod crash:** `kubectl -n <service> set image deployment/<service> web=$ACR/<service>:does-not-exist` → wait for `ImagePullBackOff` (`kubectl -n <service> get pods -w`) → the pod-crash alert fires within ~5–10 min → **rollback:** `kubectl -n <service> rollout undo deployment/<service>` and `rollout status`.
- **5xx:** `kubectl -n <service> scale deploy/mssql --replicas=0` → hit the storefront URL a few times (each request 5xx) → the 5xx alert fires → **rollback:** `kubectl -n <service> scale deploy/mssql --replicas=1` and `rollout status`.

**Verify (each) — the alert actually fired:**
- Portal → **Monitor → Alerts**, or via Resource Graph. **Gotcha:** `properties.essentials.alertRule` holds the alert's **full resource ID**, not the short name — filter with `endswith`, never `== '<rule>'` (a name-equality filter silently returns 0 and looks exactly like "nothing fired", when the alert actually fired):
  ```bash
  az graph query -q "alertsmanagementresources
    | where type == 'microsoft.alertsmanagement/alerts'
    | extend rule = tostring(properties.essentials.alertRule)
    | where rule endswith '<service>-pod-crash'
    | project mon = tostring(properties.essentials.monitorCondition),
              fired = tostring(properties.essentials.startDateTime)
    | order by fired desc" --first 3 -o table
  ```
  → `monitorCondition = Fired`; the action-group email arrives too.
- **Do not skip the rollback**, verify the app is back (`curl -sI <services.<service>.url>` → 200), and never drill a shared/prod environment.

> **Crash-rule KQL gotcha (learned the hard way):** the reason for an `ImagePullBackOff` pod is in **`ContainerStatusReason`** (current status), NOT `ContainerLastStatus.reason` — the latter is `{}` for a pod that never ran, so a rule keyed on it returns 0 rows and never fires. The Step-2 crash query already uses `ContainerStatusReason`; if you hand-edit it, keep that column or validate rows appear in the Logs blade during the drill.
>
> **Two more KQL traps, both hit live:** `last` is a **reserved word**, so `summarize last=max(TimeGenerated)` fails with `SYN0002` — name it `newest`. And `LogMessage` in `ContainerLogV2` is typed `dynamic`, so string functions need `tostring(LogMessage)` first; `extract()` applied directly returns `SEM0202`. Both surface as a generic `BadArgumentError` from `az monitor log-analytics query`, which is easy to misread as a permissions or workspace problem.

## Step 4 — Record + hand off
- Write what exists into `.rnd-devops/infra-state.json` → `services.<service>.alerts`. On a stack with an SRE Agent this happens **twice**: once right after Step 2 with `"proven": false` (so `sre-agent` can read the rule names), then again after the drills with the proof:
  ```json
  { "action_group": "<prefix>-ops-ag", "rules": ["<service>-pod-crash", "<service>-5xx"], "fivexx_path": "B", "proven": true, "proven_at": "<ISO-8601>" }
  ```
  `"proven": false` means the rules exist and nothing more — never report that state as *alerts are done*.
- Record rules + action group in the service's runbook — `/rnd-devops documentation runbook <service>`.
- **Next — say it explicitly, every time:** `/rnd-devops sre-agent`. A `Fired` alert does **not** make the Azure SRE Agent open an incident; the agent only acts on alerts a **response plan** covers, and that plan is portal-only. If `jq -r .sre_agent_name .rnd-devops/infra-state.json` is `null`, tell the operator in plain words that this stack has no SRE Agent (alerts will page the action group only) and what enabling it takes (`create_sre_agent = true` → `/rnd-devops infrastructure`). Never end this verb on "alerts are done" without that sentence.

## Guardrails
- **Named go-ahead before creating/changing rules or action groups** — they page humans and wake the SRE Agent.
- **Never delete or silence an existing rule to make noise stop** — fix the cause, or tune the threshold in a reviewed change.
- **An unproven alert doesn't count.** Step 3 is part of the definition of done — whether it runs before or after `sre-agent`.
- **Never drill twice for the same proof.** With an agent on the stack, the response plan goes in first and one drill proves rule + incident (Step 3's order check). Drilling, then wiring, then drilling again is wasted breakage.
- **A `Fired` alert is the end of THIS verb, not of the loop.** The hand-off to `sre-agent` is part of done — either the operator hears "next: sre-agent" (or, on an agent stack, "`sre-agent` first, then we drill") or "this stack has no agent, here is how to add one".
- **The 5xx source comes from `monitoring`'s declared path**, never from an assumption. A rule over an empty table is a lie that looks green.
- **Drills are demo-env only**, always with the rollback run and verified.
- One alert set per service+env; re-running updates, never duplicates.
