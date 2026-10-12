# `terraform.tfvars` — materialize to `tf/terraform.tfvars`

Starter tfvars. Fill in `subscription_id` before planning. Do **not** commit the real file with a live subscription id.

Write the block below, verbatim, to `tf/terraform.tfvars`:

```hcl
# Copy to terraform.tfvars and fill in. Do NOT commit the real file.
subscription_id = "00000000-0000-0000-0000-000000000000"
prefix          = "rnd"
env             = "dev"
location        = "southeastasia"

# Anti-collision suffix: leave it UNSET and Terraform picks a random 4-char one on the
# first apply (names become <prefix>-<env>-<suffix>-*, ACR <prefix><env><suffix>acr).
# Set it only to pin / re-attach to a known stack (`terraform output -raw name_suffix`).
# name_suffix = "x7k2"

# Were you GIVEN a resource group (shared subscription, one group per team)?
# Put its name here — Terraform deploys into it and never creates/deletes it;
# `location` above is then ignored (the stack follows the group's region).
# Leave commented to create "<prefix>-<env>-<suffix>-rg" yourself (needs subscription Owner).
# existing_resource_group_name = "team03-rg"

# Optional overrides (defaults are sensible for a basic cluster):
# kubernetes_version = "1.30"
# node_count         = 2          # initial size; autoscaler moves it between min/max
# node_min_count     = 2
# node_max_count     = 4
# node_vm_size       = "Standard_B2ms"  # small burstable default; DSv5 may have 0 quota on small subs
# vnet_cidr          = "10.40.0.0/16"
# aks_subnet_cidr    = "10.40.0.0/22"
# acr_sku            = "Basic"
# log_retention_days = 30

# Best-practice knobs (safe defaults; change per environment):
# sku_tier                  = "Free"       # prod: "Standard" for the uptime SLA
# local_account_disabled    = true         # requires you hold an AKS RBAC role — else lockout
# automatic_upgrade_channel = "patch"      # "none" to pin the control-plane version
# node_os_upgrade_channel   = "NodeImage"  # "SecurityPatch" or "None" to slow node-image churn

# Azure SRE Agent (official Terraform path — agent + connectors + RBAC):
# create_sre_agent             = true       # bills agent-units; ADO/Teams connectors stay portal-wired
# sre_agent_location           = "eastus2"  # agent RP regions: eastus2 | uksouth | swedencentral | australiaeast
# sre_agent_access_level       = "Low"      # "High" lets it act (adds Contributor on the RG)
# sre_agent_action_mode        = "Review"   # human approves actions; "Automatic" = full autonomy
# sre_agent_monthly_unit_limit = 10000
```