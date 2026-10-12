---
name: simulate
description: "SimplCommerce-specific demo (login/signup routes and log markers are this app's — see docs/BRING-YOUR-OWN-SERVICE.md before pointing it at another). Demo the SRE loop end to end by injecting APP-LEVEL failures into a deployed service — failed logins and failed signups on SimplCommerce — until an alert fires and the Azure SRE Agent opens an incident. Two honest paths: auth-failure-rate on app logs (realistic) or break the auth dependency for 5xx (fast). Runs auto (copilot executes) or guided (training — operator runs each shown command). Demo environments ONLY, always with the stop/rollback run."
---

# rnd-devops · simulate

`/rnd-devops simulate <scenario>` (scenarios: `login` · `signup` · `both`, default `both`) — drive **application-level** failures into a **deployed** service so a real alert fires and the **Azure SRE Agent** picks it up as an incident. Where `monitoring` Step 4 proves *infra* alerts (pod crash, DB down), this proves the **user-facing** path: a burst of failed logins / failed signups on **SimplCommerce**, caught and investigated.

This is a **demo/training drill**, not a test suite. It runs only against a demo environment, always ends with the failure undone, and never touches shared/prod.

## Mode — ask this FIRST

Ask the operator: **auto** (you execute each step) or **guided** (training — you never execute: print each command with every placeholder resolved, explain it, wait for the operator to run it and paste the output, verify, then next step). Full contract: *Execution modes* in `copilot-instructions.md` (auto-loaded). Guardrails apply in both modes.

## The honesty check — why there are two paths

**A failed login on SimplCommerce is an HTTP 200** — the login form simply redisplays with "email or password is incorrect". So a wrong-password flood produces **no 5xx and no error status** for infra telemetry to see. To make failed auth *observable* you need an app-level signal. Pick ONE path and be honest about which:

| Path | Signal the alert watches | Needs | Use when |
|---|---|---|---|
| **A — auth-failure rate** (realistic) | app log lines the service emits on each failed sign-in / register (KQL over ContainerLogV2) | the app logs failed auth (a 1-line instrumentation if it doesn't yet) | you want a lifelike "suspicious auth activity" incident |
| **B — break the auth dependency** (fast) | HTTP 5xx on the login/signup path (the existing `<service>-5xx` rule) | nothing extra — reuses `alerting`'s 5xx alert | you need a green-to-red demo in minutes, no code change |

State which path you're taking before Step 1. Don't point an auth-failure-rate rule at logs the app never writes — a rule over an empty stream never fires and looks healthy forever (same trap as `monitoring`'s Path A/B).

## Preflight
- **Service is deployed and green** — `/rnd-devops ci-cd simplcommerce` has shipped it; `kubectl -n simplcommerce get pods` shows it Running. Absent → deploy first.
- **Alerts + action group exist** — `/rnd-devops alerting simplcommerce` has run (and `/rnd-devops sre-agent` if you expect an incident, not just a Fired alert) (Path B reuses its `simplcommerce-5xx` rule; Path A adds the auth rule in Step 1 below).
- **SRE Agent is wired** — `/rnd-devops infrastructure`'s optional SRE Agent block is on, with its Azure Monitor connector `Succeeded` (it sees fired alerts subscription-wide; no receiver needed).
- **Target**: org and project are **the operator's own**, resolved **per service** — `services.<service>.ado.{project,repo}` (or `services.<service>.github.repo` for a GitHub Actions service) from `infra-state.json`, flat `service_connection` only as legacy fallback (see *ADO organization / project* in `copilot-instructions.md`), else ask; never infer them from docs or the read-only source org. Service `simplcommerce`, namespace `simplcommerce`. Bringing your own service → substitute the slug throughout.
- **Confirm the login/register routes + field names first** (they differ across builds): open the storefront's `/login` and `/register`, View Source, and note the form action and the input names. SimplCommerce defaults: `POST /login` with `Email` + `Password`; `POST /register` with `Email` + `Password` + `ConfirmPassword`; both carry a hidden `__RequestVerificationToken`.

---

## Path A — auth-failure rate (realistic)

### A1 — Make failed auth observable (one-time)
If the service doesn't already log failed sign-ins to stdout, add a single marker line in its login/register handler so the rule has something to count. In SimplCommerce this is the account controller's failed-auth branch:
```csharp
// after a failed sign-in / failed registration (ILogger<T> _logger):
_logger.LogWarning("AUTH_FAILURE kind={Kind} email={Email}", "login", model.Email);
```
Ship it as a normal PR + redeploy (`/rnd-devops ci-cd simplcommerce`). This is the honest prerequisite — skip it and Path A can't fire; use Path B instead.

### A2 — Ensure the auth-failure-rate alert (named go-ahead)
Reuses `alerting`'s action group. Counts the marker over 5 minutes:
```bash
RG=$(jq -r .resource_group .rnd-devops/infra-state.json)
LAW_ID=$(jq -r .log_analytics_workspace_id .rnd-devops/infra-state.json)
AG_ID=$(az monitor action-group show -g "$RG" -n "rnd-ops-ag" --query id -o tsv)

az monitor scheduled-query create -g "$RG" -n "simplcommerce-auth-failures" \
  --scopes "$LAW_ID" --severity 2 \
  --window-size 5m --evaluation-frequency 5m \
  --action-groups "$AG_ID" \
  --condition "count 'AuthFails' > 20" \
  --condition-query AuthFails="ContainerLogV2
    | where PodNamespace == 'simplcommerce'
    | where LogMessage has 'AUTH_FAILURE'" \
  --description "simplcommerce saw >20 failed logins/signups in 5 minutes — possible credential-stuffing or a broken auth path."
```
> Paste the KQL into the LAW **Logs** blade first — it must parse and return rows once A3 is running. Threshold 20/5m is demo-friendly; tune for real traffic in a reviewed change.

### A3 — Generate the failed auth (named go-ahead)
`STORE` = the storefront's public URL from the deploy (`kubectl -n simplcommerce get svc`). This drives **real** failed logins (wrong password) and failed signups (mismatched/short password), antiforgery-aware:
```bash
STORE="http://<storefront-public-ip>"       # from `kubectl -n simplcommerce get svc`
SCN="${1:-both}"                             # login | signup | both

hit () {  # $1=path  $2..=extra --data-urlencode fields
  local path="$1"; shift
  local jar; jar=$(mktemp)
  local tok; tok=$(curl -s -c "$jar" "$STORE$path" \
    | sed -n 's/.*__RequestVerificationToken[^>]*value="\([^"]*\)".*/\1/p' | head -1)
  curl -s -o /dev/null -w "%{http_code} $path\n" -b "$jar" \
    -d "__RequestVerificationToken=$tok" "$@" "$STORE$path"
  rm -f "$jar"
}

for i in $(seq 1 60); do
  case "$SCN" in
    login|both)  hit /login  --data-urlencode "Email=nobody+$i@example.com" \
                             --data-urlencode "Password=wrong-$i" ;;
  esac
  case "$SCN" in
    signup|both) hit /register --data-urlencode "Email=nobody+$i@example.com" \
                              --data-urlencode "Password=short" \
                              --data-urlencode "ConfirmPassword=nope" ;;
  esac
done
```
Expect 200s (failed login redisplays) / 400s (invalid register) — the point is the **log markers**, not the status. Watch them land: `kubectl -n simplcommerce logs -l app=simplcommerce --tail=20 | grep AUTH_FAILURE`.

---

## Path B — break the auth dependency (fast, no code change)
Take down the identity store so login/signup return **5xx**; the existing `simplcommerce-5xx` rule catches it. Note this also fails the rest of the app that needs the DB — fine for a demo, say so.
```bash
kubectl -n simplcommerce scale deploy/mssql --replicas=0     # identity + catalog DB down
# hit the login/signup pages a few times — each now 5xx:
for i in $(seq 1 15); do curl -s -o /dev/null -w "%{http_code}\n" "$STORE/login"; done
```

---

## Verify — the loop actually closed
1. **Alert fired:** `az monitor scheduled-query show -g "$RG" -n "<rule>" --query "enabled"` and portal → **Monitor › Alerts** shows the rule **Fired** (Path A: `simplcommerce-auth-failures`; Path B: `simplcommerce-5xx`) within ~5–10 min. The action-group email arrives.
2. **SRE Agent caught it:** at **https://sre.azure.com** the agent shows an incident/investigation for the fired alert (its Azure Monitor connector picks it up automatically; in **Review** mode it proposes, a human approves). This is the payoff — the demo's whole point.
3. Screenshot both for the training recap. `/rnd-devops operations` is the same signal turned into a tracked incident + hotfix PR.

## Stop / rollback — NOT optional
- **Path A:** the load loop is bounded (60 iterations) and self-stops; no state changed. Optionally delete the demo rule afterward: `az monitor scheduled-query delete -g "$RG" -n "simplcommerce-auth-failures" -y`.
- **Path B:** `kubectl -n simplcommerce scale deploy/mssql --replicas=1` → wait for the pod Ready and the storefront to serve 200 again.
- Confirm recovery: the alert flips to **Resolved**, `curl "$STORE/login"` is 200, pods Running.

## Guardrails
- **Demo/training environments ONLY.** Never run this against a shared or production service — it deliberately degrades user-facing auth.
- **Named go-ahead** before creating the rule (A2), generating load (A3), or breaking the dependency (Path B) — each wakes the action group and the SRE Agent.
- **Always run the stop/rollback and verify recovery.** An open drill left running is an outage.
- **Never weaken or delete a real alert** to change what fires — this skill only *adds* a demo rule and *undoes* its own load.
- **No real credentials.** The load uses obviously-fake `nobody+N@example.com` addresses and wrong passwords — never real accounts.

## Next
- `/rnd-devops operations` — **optional** — turn the fired alert into a tracked incident → hotfix PR → review (the human-in-the-loop half of the SRE story). Not needed to call the demo complete; still being finished.
- `/rnd-devops documentation runbook simplcommerce` — record this drill (what fires it, how to recover) in the service runbook.