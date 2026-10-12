---
name: documentation
description: "Generate and maintain the platform's living documentation — a service runbook (what it is, how it deploys, its alerts, how it fails), release notes between two deploys, or an architecture diagram. Templates are embedded in this skill; output goes to docs/ via PR (default) or the ADO wiki. Use after wiring a service (runbook), before/after a release (release notes), or when onboarding someone (diagram)."
---

# rnd-devops · documentation

`/rnd-devops documentation <what> [target]` — produce one of three documents from the embedded templates: `runbook <service>`, `release-notes <service> [from <buildId|date>]`, or `diagram <scope>`. This runbook is fully **self-contained**: templates and data-collection commands are embedded below.

**Why this exists:** the platform's knowledge otherwise lives in chat scrollback and one operator's head. A runbook is what lets a teammate handle the 2am alert; release notes are what the client actually reads.

## Where output goes
- **Default: the service repo's `docs/` folder, via PR** — branch `docs/<what>-<target>`, TL as reviewer, **never merge it yourself**. Review-by-PR keeps docs honest the same way it keeps code honest.
- **ADO wiki** (team-facing, cross-repo): `az devops wiki page create --wiki <wiki> --path "/<Service>/<What>" --file-path <generated>.md` (or `update` with the returned ETag if the page exists). *GitHub-hosted service:* the repo's `docs/` via PR is the team-facing place (the GitHub wiki is a separate git repo — use it only if the team already does).

## `runbook <service>` — the 2am document
Fill the embedded template from live sources, not memory:
- Deploy shape: the service's `azure-pipelines.aks.yml` + `deploy/aks/` manifests.
- Infra names: `.rnd-devops/infra-state.json`.
- Alerts: `az monitor scheduled-query list -g <rg> -o table` (what `/rnd-devops alerting` wired; telemetry from `monitoring`, response plan from `sre-agent`).
- Endpoints: `kubectl -n <service> get svc,ingress`.
Anything unknown → a `TBD(owner)` marker, never an invented value. **Verify:** every command in the runbook's *Common failures* section has been run once against the real service — a runbook with untested commands is fiction.

## `release-notes <service> [from <buildId|date>]` — what shipped
1. Find the range — latest successful main deploy vs the previous one (or the given start):
   ```bash
   # Azure Pipelines
   az pipelines runs list --pipeline-ids <id> --branch main --status completed \
     --result succeeded --top 2 -o table   # take the two builds' source versions
   git log <oldSha>..<newSha> --oneline --no-merges
   ```
   *GitHub Actions:* `gh run list -R <owner>/<repo> --workflow deploy-aks.yml --branch main --status success --limit 2 --json headSha,createdAt,url` — the two `headSha` values are the range.
2. Enrich each commit: PR link (`az repos pr list --source-branch ...` or the `!<id>` in the merge commit; GitHub: `gh api repos/<owner>/<repo>/commits/<sha>/pulls --jq '.[].html_url'`), linked work items (`AB#<id>`; GitHub: the `#<id>` / `Fixes #<id>` in the PR body).
3. Fill the template: categorize as **Features / Fixes / Ops & security / Dependencies** (Conventional Commit prefixes make this mechanical), one line each, in the reader's language — what changed *for them*, not internal jargon.
**Verify:** every line links to a PR or work item; the range's first/last commits both appear; nothing in the log is silently dropped (an uncategorizable commit goes under *Other*, not nowhere).

## `diagram <scope>` — one picture, current
Author Mermaid per `.github/instructions/mermaid.instructions.md` (it auto-applies to `.md`/`.mmd` here). Scope examples: platform overview (verbs + shared state), a service's deploy path (PR → pipeline stages → AKS), the operations loop. Rules: draw what exists **today** (from the repo + `infra-state.json`), one diagram per concern, and place it inside the runbook or `docs/` page it explains — a diagram nobody opens is dead weight.

## Guardrails
- **Docs go through PR review like code** — never self-merge; the TL/client merge is the sign-off.
- **Live sources only** (repo files, `az`/`kubectl` output, work items) — a doc written from memory is wrong the day it lands.
- **Update in place**: re-running a `<what>` for the same target updates the existing doc/page (new dated file only for release notes, which are inherently per-release).
- No secrets in docs — connection strings, SA passwords, and tokens are referenced by *where they live* (Key Vault, k8s Secret name), never by value.

---

## § Embedded templates

### Runbook — `docs/runbook-<service>.md`
```markdown
# Runbook — <service> (<env>)

| | |
|---|---|
| **Owner / on-call** | <team, contact> |
| **Last verified** | <yyyy-mm-dd> (every command below ran against the real service on this date) |

## What it is
<2-3 sentences: purpose, users, criticality.>

## Where it runs
| | |
|---|---|
| URL | <public endpoint> |
| AKS | `<aks-name>` · namespace `<service>` · RG `<rg>` |
| Image | `<acr>.azurecr.io/<service>:<tag>` |
| Pipeline | <ADO pipeline link — or GitHub Actions workflow link> (Build → Security → Deploy) |
| Data | <db + where its secret lives (name, not value)> |

## How to deploy / roll back
- Deploy: merge to `main` → pipeline runs; or `az pipelines run --name <service> --branch main` / `gh workflow run deploy-aks.yml --ref main`.
- Roll back: `kubectl -n <service> rollout undo deployment/<service>` (image-level), or re-run the pipeline from the last good commit.

## Telemetry & alerts
| Alert | Fires when | First response |
|---|---|---|
| `<service>-pod-crash` | pod CrashLoopBackOff/OOM/ImagePull | `kubectl -n <service> get pods` → `describe` the bad pod |
| `<service>-5xx` | >5 HTTP 5xx / 5 min | check mssql pod first (common cause), then app logs |
- Logs: LAW `<prefix>-<env>-<suffix>-law` (`.log_analytics_workspace_name` in `infra-state.json`) → `ContainerLogV2 | where PodNamespace == '<service>'`
- App Insights: `<service>-ai` (<Path A: requests live / Path B: SDK not yet wired>)

## Common failures (each verified)
| Symptom | Likely cause | Fix |
|---|---|---|
| 5xx storm | mssql pod down / not ready | `kubectl -n <service> get pods; kubectl -n <service> rollout status deploy/mssql` |
| Pods Pending | node pool at max | check autoscaler: `kubectl get nodes`, `az aks nodepool show ...` |
| ImagePullBackOff | AcrPull missing / bad tag | `az role assignment list --scope <acr-id>`; check the tag exists in ACR |

## Escalation
<who to page when the runbook doesn't cover it; link the incident process (/rnd-devops operations).>
```

### Release notes — `docs/release-notes/<service>-<yyyy-mm-dd>.md`
```markdown
# <service> — release <yyyy-mm-dd>

**Range:** build <old#> (<oldSha7>) → build <new#> (<newSha7>) · deployed <date>

## Features
- <what the user can now do> (PR !<id>, AB#<id>)

## Fixes
- <what stopped being broken> (PR !<id>)

## Ops & security
- <infra/pipeline/dependency-security changes worth knowing> (PR !<id>)

## Dependencies
- <package bumps with a reason if security-driven>

## Other
- <anything that fit no category — never silently dropped>
```

---

> This runbook is standalone — the embedded templates above are its own source. Edit them directly in the blocks above.