---
name: operations
description: "OPTIONAL verb — one idempotent tick of the SRE loop: firing critical alert → tracked incident → auto hotfix PR → review. Designed to run on a schedule. Never merges a PR or moves a ticket past In Progress. Use to operate a live service — alert triage, RCA, minimal hotfix, diff-only review. The platform path is complete without it: alerting + sre-agent already give a proven alert → incident loop, and this verb is the code-facing downstream on top."
---

# rnd-devops · operations

`/rnd-devops operations` (alias `ops`) — one tick of the **SRE loop**: firing critical alert → tracked incident → auto hotfix PR → review. Designed to run **on a schedule** (a scheduled pipeline), so each invocation does **one idempotent poll cycle** and exits. It composes existing skills; read each before its phase runs.

> **This verb is OPTIONAL, and still being finished (as of 2026-09-09).** The platform is complete and demonstrable without it: `alerting` proves the rules fire and `sre-agent` proves a fired alert becomes an investigated incident — that is the loop working. What this verb adds is the **code-facing downstream** (ADO ticket → hotfix PR → review), which is the part still being built out. So: never present it as the step that finishes the platform, don't schedule it yet, and run it **manually, one tick at a time** with every outward action approved (the *Crawl* stage below). Skipping it entirely is a valid choice — say so plainly instead of leaving it looking unfinished.

## Who does what (don't rebuild Azure's part)

```
Azure Monitor  ──fires──▶  Azure SRE Agent  ──investigates + posts──▶  Microsoft Teams
   (5xx / pod crash,            (always-on Azure product;                 (humans see it)
    service down)                configured in the portal)
                                          │ (may also open an ADO item)
                                          ▼
        ══════════════ this loop starts here ══════════════
   Phase 1 triage  ──▶  Phase 2 work (hotfix)  ──▶  Phase 3 review
```

**Azure SRE Agent + Azure Monitor own the observing and the Teams push** — this loop does NOT sit and watch alerts. Wire that side once: **`/rnd-devops monitoring <service>`** wires telemetry, **`/rnd-devops alerting <service>`** creates + proves the alert rules (pod crash / 5xx); the SRE Agent itself + its Azure Monitor connector come from `/rnd-devops infrastructure`'s optional block, and **`/rnd-devops sre-agent`** finishes the portal half (response plan, Teams + ADO connectors, teammate RBAC; keep prod response plans in **Review** mode). This loop owns the durable, code-facing downstream.

## SRE Agent MCP integration (VS Code / Copilot)

The operations loop can query Azure SRE Agent **directly from VS Code** via the `mcp_azure_mcp_se2_sreagent` MCP tool. This gives Phase 1 richer context than Azure Monitor alerts alone:

| Phase | MCP command | Purpose |
|---|---|---|
| Phase 0 (pre-triage) | `sreagent_incidents_active_list` | List active SRE Agent incidents — if the agent already investigated, skip re-investigation |
| Phase 0 (pre-triage) | `sreagent_threads_list` | Find recent investigation threads (agent's RCA reasoning) |
| Phase 1 (triage) | `sreagent_threads_get --thread-id <id>` | Read the agent's full investigation + proposed mitigation |
| Phase 2 (RCA) | `sreagent_threads_send_message` | Ask the agent follow-up questions during RCA (e.g. "what changed in the last deploy?") |
| Phase 2 (fix) | `sreagent_threads_investigate` | Trigger a deep investigation on a specific thread |
| Post-fix | `sreagent_docs_memories_add` | Store fix context so the agent learns for next time |

**Phase 0 — Consult SRE Agent first** (new, runs before Phase 1):
```
sreagent_incidents_active_list → for each active incident:
  sreagent_threads_get → read the investigation
  if agent already has RCA + proposed fix:
    skip triage for this alert (fold agent's findings into the ADO ticket)
  else:
    proceed to Phase 1 normally
```

This avoids duplicating work the agent already did. The agent's investigation becomes the **RCA input** for Phase 2 instead of running the RCA from scratch.

## What the operator must configure once (top of the run)

| Setting | What it is | Example |
|---|---|---|
| `LEADER` | ADO identity incidents are assigned to, and the required PR reviewer | `lead@company.com` |
| `AUTOMATION_ID` | identity whose In-Progress items this loop is allowed to work | the operator, or a dedicated bot account |
| `SCOPE` | which alert rules / services this loop owns | `payments-*`, `web-*` |
| `GRACE_MINUTES` | how long a PR must exist before Phase 3 reviews it | `2` |
| `ALLOWLIST` | the outward actions the scheduled run may take unattended | see Autonomy ladder |

Read these from a small config the operator maintains (e.g. a `rnd-ops.config` block in chat, or the routine's args). If `LEADER`/`AUTOMATION_ID` are unset, run **report-only** (Phases surface findings, take no outward action).

---

## The one-tick cycle

### Phase 1 — Triage: every firing critical alert has ONE tracked incident
Triage the firing alerts filtered to **critical** (`Sev0/Sev1`, or the 5xx/4xx/availability rules in `SCOPE`).
- Dedupe by fingerprint; fold in SRE Agent's Teams thread if it already investigated (link it, don't re-investigate).
- New incidents are created as an ADO work item **assigned to `LEADER`**, tagged `rnd-incident; <fingerprint>`, priority by severity. Hard cap 3 new tickets/tick — a burst is usually one incident (create one umbrella).
- The **leader then reassigns to a member and moves it to In Progress** — that human step is what arms Phase 2. This loop never assigns work to itself.

### Phase 2 — Work: pick up armed incidents and open a hotfix PR

> **Demo/training posture:** the hotfix lands in the **service repo**, which the operator owns — pushing a branch and opening a PR there is allowed (the no-push rule covers the skills repo `ai-workshop-devops`, not this one). What gates Phase 2 is **arming**, not the repo: until the operator has explicitly armed the loop (the crawl → walk → run ladder below), report the hotfix it *would* open — branch name, diff, PR title, target — and stop there. Merging is never yours, armed or not.
Find incidents that are **In Progress AND marked for auto-fix** (assigned to `AUTOMATION_ID`, or tagged `rnd-auto-fix`) that don't yet carry the `rnd-worked` marker:
```
ado_query_work_items(project: "<Project>", query:
  "SELECT [System.Id] FROM WorkItems
   WHERE [System.WorkItemType] = 'Task'
     AND [System.State] = 'In Progress'
     AND [System.AssignedTo] = '<AUTOMATION_ID>'
     AND [System.Tags] CONTAINS 'rnd-incident'
   ORDER BY [Microsoft.VSTS.Common.Priority] ASC")
```
For each (one at a time), run the hotfix flow:
1. Read the item; treat its description/acceptance-criteria as the intent.
2. **RCA first** — investigate over Azure Monitor to confirm the real cause before touching code (the alert name lies; a symptom that pattern-matches a known failure may have a different cause).
3. Branch off `main`: `fix/<id>-<slug>`. Implement the minimal safe fix.
4. Open the PR **to `main`** (the hotfix target you asked for) with **`LEADER` as a required reviewer**, work item linked (`AB#<id>`), and the RCA evidence in the description. Check `mergeStatus` right after.
   - *Suite default is twin PRs (main + develop); a straight-to-main hotfix is the deliberate exception for incidents. If the repo promotes develop→main normally, also open the develop twin so the fix doesn't regress on the next release.*
5. Comment the item (PR link + RCA summary), set/keep **In Progress** — **never beyond**. Add the `rnd-worked` marker (tag or ticket comment) so the next tick doesn't redo it.
6. **Never complete/merge the PR.** The loop's job ends at "PR open, CI running, leader requested."

### Phase 3 — Review: after the grace window, review the PR and comment
Find PRs opened by this loop that are **active**, **older than `GRACE_MINUTES`**, and not yet marked `rnd-reviewed`:
```bash
az repos pr list --project <Project> --creator <AUTOMATION_ID> --status active \
  --query "[?creationDate<='<now - GRACE_MINUTES, ISO8601>'].pullRequestId" -o tsv
```
For each:
1. Confirm the required reviewer is correct — `LEADER` is on the PR. If missing, add them (this is why the incident routed through the leader).
2. Review the PR on the **merge preview** (`lastMergeCommit`, not source tip), diff-only.
3. **Post the review comment regardless of whether there are findings** — an anchored thread per finding, or one informational `closed` LGTM thread when clean. This is the "sau 2 phút thì vào comment, có finding hay không cũng comment" behaviour.
4. Mark `rnd-reviewed`. Report verdict in the run summary. Humans still merge.

### End of tick
Emit a summary table: `alert → incident (#N created/updated) → PR (#M opened/skipped) → review (posted/none)`, plus anything gated to a human (ambiguous cause, HUMAN-GATE classification, out-of-scope alert). Then exit — the schedule fires the next tick.

---

## Scheduling it (run one tick on a cadence)

There is no always-on loop in Copilot — run one tick on a schedule instead:
- **Recommended:** a **scheduled Azure Pipeline** (cron trigger) that runs the loop's steps non-interactively, or the **Copilot coding agent** kicked off per incident. Cadence: every ~5 minutes is sane (the `GRACE_MINUTES` window covers the "2 minutes after the PR" part — no 2-minute cron needed).
- **Permission:** an unattended run must be constrained to a pre-agreed **allowlist** — nothing outward beyond it. Agree the allowlist with the operator **before** scheduling; an unattended run must never exceed the hard limits below.

## Autonomy ladder — do NOT jump straight to unattended (learned the hard way)

Mirrors the triage escalation and the SRE Agent's "keep prod plans in Review":
1. **Crawl** — run `/rnd-devops operations` **manually**, one tick at a time, approving each outward action. Watch the triage quality, the RCA accuracy, and the PR diffs for 1-2 weeks.
2. **Walk** — schedule it, but keep `ALLOWLIST` to *read + create-ticket + open-PR*; **PR comments and any Teams post still gate to a human**. Fix false RCAs and over-eager PRs here.
3. **Run** — once you consistently accept what it proposes, widen `ALLOWLIST` to include posting the review comment. Track created/fixed/reverted counts honestly — report the reverts, not just the wins.

## Hard guardrails (bind every tick, even fully autonomous)
- **Never merge/complete a PR. Never move a ticket beyond In Progress.** These are absolute.
- **Idempotency is safety here:** always check the `rnd-worked` / `rnd-reviewed` markers before acting. A cron loop that forgets it already opened a PR will open ten. When in doubt, skip and report — a missed tick is cheap, a duplicate PR storm is not.
- **HUMAN-GATE stays gated even unattended:** anything touching payments/auth/PII, schema/infra, or needing product judgment gets a ticket comment with the proposed approach and STOPS — no auto-code. Only the AUTO class of change (templated, CI-validated, explicit target) proceeds unattended.
- **Verify after the fix deploys:** once a hotfix merges (by a human) and deploys, verify via Azure Monitor that the error rate actually dropped — a fix that doesn't move the signal isn't a fix.
- Everything under the operator's / bot identity; write nothing you wouldn't sign as them.

## Provider mapping — when the service lives on GitHub (CI provider = GitHub Actions)
The loop's contract is identical; only the tracker and PR host change. `services.<service>.github.repo` in `infra-state.json` says so. Substitute one-for-one:

| ADO (default) | GitHub equivalent |
|---|---|
| work item, assigned to `LEADER`, tags `rnd-incident; <fingerprint>` | `gh issue create -R <owner>/<repo> --title "<alert>: <summary>" --assignee <LEADER> --label rnd-incident,<fingerprint> --body "<evidence>"` (create the labels once: `gh label create rnd-incident`) |
| state **In Progress** + assignee `AUTOMATION_ID` = *armed* | label **`rnd-armed`** added by the leader (GitHub Issues have no states) + assignee `AUTOMATION_ID`; the human adds the label, never the loop |
| `ado_query_work_items(...)` | `gh issue list -R <owner>/<repo> --label rnd-incident --label rnd-armed --assignee <AUTOMATION_ID> --state open --json number,title,body` |
| PR to `main`, `LEADER` required reviewer, `AB#<id>` link | `gh pr create -R <owner>/<repo> --base main --head fix/<id>-<slug> --reviewer <LEADER> --title "fix: <slug>" --body "Fixes #<id> — <RCA evidence>"` (`Fixes #` links the issue; **required** reviewers come from the branch-protection rule, not the PR) |
| `az repos pr list --creator … --status active` | `gh pr list -R <owner>/<repo> --author <AUTOMATION_ID> --state open --json number,createdAt,reviewDecision` |
| comment the item / PR; `rnd-worked`, `rnd-reviewed` markers | `gh issue comment` / `gh pr comment`; markers as labels (`gh issue edit --add-label rnd-worked`) |
| SRE Agent → ADO connector opens the ticket | the agent's GitHub connector, if wired in your region; otherwise this loop creates the Issue itself (Phase 1) and links the agent's Teams thread |

Hard guardrails hold unchanged: never `gh pr merge`, never close the Issue, never remove `rnd-armed` yourself.

## Related
- When a tick escalates to a real outage, switch to the human incident runbook: snapshot before any change → mitigate → verify recovery via Azure Monitor.