---
applyTo: "**/*.tf,**/*.tfvars"
---
# Terraform conventions

## Planning & review
- Review the **plan output**, not just the code — any destroy/replace of a stateful resource is a blocking finding unless explicitly intended.
- Never `terraform apply -auto-approve`; always require operator confirmation.
- Never hand-edit remote state.

## Code rules
- Pin provider versions (`required_providers` with `version = "~> x.y"`).
- `prevent_destroy = true` on stateful resources (AKS cluster, ACR, Log Analytics workspace, managed disks).
- No secrets in `.tf` or `.tfvars` — reference Key Vault or pipeline variables.
- Use `azapi` provider for resource types `azurerm` doesn't support yet (e.g. `Microsoft.App/agents`).

## Naming
- Resources: `<resource-type>-<project>-<env>` (e.g. `aks-rnddevops-dev`).
- Terraform names: snake_case, descriptive (e.g. `azurerm_kubernetes_cluster.main`).

## Structure
```
main.tf          # provider, backend, data sources
variables.tf     # all input variables with descriptions
outputs.tf       # exported values
aks.tf           # AKS cluster + node pool
network.tf       # VNet, subnet, NSG
acr.tf           # Container registry
monitoring.tf    # Log Analytics, App Insights
```

## State & backend
- Use Azure Storage backend with state locking.
- One state file per environment (dev/staging/prod).
