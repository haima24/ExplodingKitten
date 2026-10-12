---
applyTo: "**/azure-pipelines*.yml,**/.azure-pipelines/**/*.yml,**/pipelines/**/*.yml"
---
# Azure Pipelines conventions

## Template consumption
- Consume shared templates; don't inline logic that belongs in a template.
- On Azure Repos the YAML `pr:` trigger block is **IGNORED** (PR validation is configured via branch policy) — don't flag its absence.

## Security
- No hardcoded credentials, secrets, or connection strings — use pipeline variables or variable groups backed by Key Vault.
- Service connections use managed identity + Workload Identity Federation (no secrets).

## Reliability
- Set `timeoutInMinutes` on every job.
- Notify on both success AND failure.

## Deploy conventions
- DB migrations run BEFORE the app deployment.
- Deploy must be reversible (rollback plan).
- Post-deploy: run smoke test to verify health.
- AKS deploy that creates namespace + Secrets requires **AKS RBAC Cluster Admin** role.
- Apply EF Core SQL migrations with `sqlcmd -I -b` (QUOTED_IDENTIFIER on, fail-on-error).

## Docker build
- `az acr build` needs **Contributor** on the ACR (AcrPush is data-plane only).
- Multi-arch builds (arm64 + amd64).
- Non-root user in runtime image.
- No secrets baked into images.

## Stage ordering
```yaml
stages:
  - stage: Build        # restore, build, test, publish artifact
  - stage: Security     # gitleaks, dependency scan
  - stage: Deploy_Dev   # deploy to dev AKS
  - stage: Deploy_Prod  # deploy to prod AKS (manual approval gate)
```
