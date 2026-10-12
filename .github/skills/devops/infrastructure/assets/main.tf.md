# `main.tf` — materialize to `tf/main.tf`

The stack itself: the random name suffix, RG (created — or an admin-provided one via `existing_resource_group_name`), Log Analytics, VNet/subnet, ACR, AKS, ACR-pull + CI/CD identity RBAC, and the optional Azure SRE Agent (azapi) with its connectors.

Write the block below, verbatim, to `tf/main.tf`:

```hcl
data "azurerm_client_config" "current" {}

# ------------------------------------------------------------------
# Name suffix — the anti-collision knob. Several people provisioning into
# ONE subscription (a workshop) used to race for `rnd-dev-rg`, the
# globally-unique ACR `rnddevacr`, and the AKS node RG
# `rnd-dev-aks-nodes-rg` (subscription-unique, created by AKS itself) —
# the second apply died with "already exists" and got hand-patched to
# `-01`. A random 4-char suffix in every name removes that whole class.
# Generated once and kept in state, so re-plans/re-applies of the same
# stack never rename anything. Pin it with var.name_suffix to reproduce
# or to re-attach a fresh working dir to a known stack.
# ------------------------------------------------------------------
resource "random_string" "suffix" {
  count   = var.name_suffix == null ? 1 : 0
  length  = 4
  lower   = true
  upper   = false
  numeric = true
  special = false
}

locals {
  # <prefix>-<env>-<suffix>-*  naming. ACR must be globally unique + alphanumeric only.
  suffix     = var.name_suffix != null ? var.name_suffix : random_string.suffix[0].result
  base       = "${var.prefix}-${var.env}-${local.suffix}"
  acr_name   = replace("${var.prefix}${var.env}${local.suffix}acr", "-", "")
  aks_dns    = "${local.base}-aks"
  common_tag = merge(var.tags, { env = var.env, name_suffix = local.suffix })

  # Two ways to get a resource group — pick by var.existing_resource_group_name:
  #   ""       → create "<prefix>-<env>-<suffix>-rg" (needs subscription-level Owner/UAA)
  #   "<name>" → deploy into that pre-existing group (Owner on the RG is enough)
  # Everything below uses these three locals, never the resource/data directly.
  create_rg   = var.existing_resource_group_name == ""
  rg_name     = local.create_rg ? one(azurerm_resource_group.rg[*].name) : one(data.azurerm_resource_group.existing[*].name)
  rg_location = local.create_rg ? one(azurerm_resource_group.rg[*].location) : one(data.azurerm_resource_group.existing[*].location)
  rg_id       = local.create_rg ? one(azurerm_resource_group.rg[*].id) : one(data.azurerm_resource_group.existing[*].id)
}

# ------------------------------------------------------------------
# Resource group — created (default) …
# ------------------------------------------------------------------
resource "azurerm_resource_group" "rg" {
  count    = local.create_rg ? 1 : 0
  name     = "${local.base}-rg"
  location = var.location
  tags     = local.common_tag

  # Guard against accidental destroy/replace. Intentional teardown requires
  # removing this block first (a deliberate edit).
  lifecycle {
    prevent_destroy = true
  }
}

# States created before the count was added hold the group at the un-indexed
# address. This renames it in state — no destroy, no create, plan shows "moved".
moved {
  from = azurerm_resource_group.rg
  to   = azurerm_resource_group.rg[0]
}

# … or pre-existing (shared subscription, one group per team). Read-only:
# Terraform never modifies or deletes it; the stack's own resources still carry
# the <prefix>-<env>-<suffix>-* names inside it.
data "azurerm_resource_group" "existing" {
  count = local.create_rg ? 0 : 1
  name  = var.existing_resource_group_name
}

# ------------------------------------------------------------------
# Observability — Log Analytics workspace (Container Insights → Azure Monitor)
# ------------------------------------------------------------------
resource "azurerm_log_analytics_workspace" "law" {
  name                = "${local.base}-law"
  location            = local.rg_location
  resource_group_name = local.rg_name
  sku                 = "PerGB2018"
  retention_in_days   = var.log_retention_days
  tags                = local.common_tag

  lifecycle {
    prevent_destroy = true
  }
}

# ------------------------------------------------------------------
# Network — VNet + a single AKS node subnet (basic; Azure CNI overlay)
# ------------------------------------------------------------------
resource "azurerm_virtual_network" "vnet" {
  name                = "${local.base}-vnet"
  location            = local.rg_location
  resource_group_name = local.rg_name
  address_space       = [var.vnet_cidr]
  tags                = local.common_tag
}

resource "azurerm_subnet" "aks" {
  name                 = "${local.base}-aks-subnet"
  resource_group_name  = local.rg_name
  virtual_network_name = azurerm_virtual_network.vnet.name
  address_prefixes     = [var.aks_subnet_cidr]
}

# ------------------------------------------------------------------
# Container registry
# ------------------------------------------------------------------
resource "azurerm_container_registry" "acr" {
  name                = local.acr_name
  resource_group_name = local.rg_name
  location            = local.rg_location
  sku                 = var.acr_sku
  admin_enabled       = false # pipelines auth via the AKS/CI identity, not admin creds
  tags                = local.common_tag

  lifecycle {
    prevent_destroy = true # holds your images — never let a plan drop it
  }
}

# ------------------------------------------------------------------
# AKS — single autoscaling system pool, Azure CNI overlay, AAD + Azure
# RBAC (local accounts off), managed identity, Workload Identity (OIDC),
# Key Vault CSI, auto-patching in a maintenance window, Container
# Insights wired to the workspace above.
# "Full but basic": sane platform defaults, nothing exotic.
# ------------------------------------------------------------------
resource "azurerm_kubernetes_cluster" "aks" {
  name                = local.aks_dns
  location            = local.rg_location
  resource_group_name = local.rg_name
  dns_prefix          = local.aks_dns
  kubernetes_version  = var.kubernetes_version
  node_resource_group = "${local.base}-aks-nodes-rg" # subscription-unique — the suffix in local.base keeps it from colliding
  sku_tier            = var.sku_tier
  tags                = local.common_tag

  # All cluster access goes through Entra ID + Azure RBAC — no shared local
  # admin kubeconfig. NOTE: the operator must hold an AKS RBAC role (e.g.
  # "Azure Kubernetes Service RBAC Cluster Admin") or they lock themselves out.
  local_account_disabled = var.local_account_disabled

  # Keep the cluster patched automatically, inside the maintenance window below.
  automatic_upgrade_channel = var.automatic_upgrade_channel
  node_os_upgrade_channel   = var.node_os_upgrade_channel

  # Workload Identity — the modern, secretless way for pods to auth to Azure
  # (federated tokens, no mounted SP secret). Also underpins the WIF option in
  # /rnd-devops service-connection.
  oidc_issuer_enabled       = true
  workload_identity_enabled = true

  default_node_pool {
    name                 = "system"
    vm_size              = var.node_vm_size
    vnet_subnet_id       = azurerm_subnet.aks.id
    type                 = "VirtualMachineScaleSets"
    auto_scaling_enabled = true
    node_count           = var.node_count # initial; the autoscaler moves it between min/max
    min_count            = var.node_min_count
    max_count            = var.node_max_count

    upgrade_settings {
      max_surge = "33%"
    }
  }

  identity {
    type = "SystemAssigned"
  }

  network_profile {
    network_plugin      = "azure"
    network_plugin_mode = "overlay"
    network_policy      = "azure"
    load_balancer_sku   = "standard"
  }

  azure_active_directory_role_based_access_control {
    azure_rbac_enabled = true
    tenant_id          = data.azurerm_client_config.current.tenant_id
  }

  key_vault_secrets_provider {
    secret_rotation_enabled = true
  }

  oms_agent {
    log_analytics_workspace_id = azurerm_log_analytics_workspace.law.id
  }

  maintenance_window_auto_upgrade {
    frequency   = "Weekly"
    interval    = 1
    duration    = 4
    day_of_week = "Sunday"
    start_time  = "03:00"
    utc_offset  = "+00:00"
  }

  lifecycle {
    prevent_destroy = true # the cluster — guard against accidental destroy/replace
    ignore_changes = [
      default_node_pool[0].node_count, # managed by the autoscaler
      kubernetes_version,              # bumped by the auto-upgrade channel
    ]
  }
}

# ------------------------------------------------------------------
# Control-plane diagnostics → Log Analytics. oms_agent above covers
# NOTE: diagnostic setting for AKS control-plane logs is NOT managed here.
# Azure auto-creates one when Container Insights (oms_agent) is enabled on
# the cluster. Managing it in Terraform causes "already exists" errors on
# fresh applies. If you need custom log categories, import the existing
# setting first or manage it outside Terraform.
# ------------------------------------------------------------------

# ------------------------------------------------------------------
# ACR ↔ AKS integration (the Terraform-native equivalent of
# `az aks update --attach-acr`): grant the cluster's KUBELET identity
# AcrPull on the registry so nodes pull `image: <acr>.azurecr.io/...`
# with NO imagePullSecret. Pull only — CI push access is a separate
# AcrPush grant on the pipeline's service principal (see
# /rnd-devops service-connection). Needs roleAssignments/write on the
# operator; RBAC takes ~tens of seconds to propagate after apply.
# ------------------------------------------------------------------
resource "azurerm_role_assignment" "aks_acr_pull" {
  scope                            = azurerm_container_registry.acr.id
  role_definition_name             = "AcrPull"
  principal_id                     = azurerm_kubernetes_cluster.aks.kubelet_identity[0].object_id
  skip_service_principal_aad_check = true
}

# ------------------------------------------------------------------
# CI/CD identity — the target for the Azure DevOps Workload Identity
# Federation service connection (no SP secret; the NashTech tenant blocks
# app-registration creation anyway). /rnd-devops service-connection wires
# the ADO endpoint + the federated credential onto this identity using the
# client_id output below.
# ------------------------------------------------------------------
resource "azurerm_user_assigned_identity" "cicd" {
  count               = var.create_cicd_identity ? 1 : 0
  name                = "id-${local.base}-cicd"
  resource_group_name = local.rg_name
  location            = local.rg_location
  tags                = local.common_tag
}

# Contributor on the ACR — REQUIRED for `az acr build` (server-side ACR Tasks):
# it needs registries/read + scheduleRun/action to resolve the registry and
# queue the build. AcrPush alone is DATA-PLANE ONLY (push/pull) and fails with
# "registry could not be found". (Learned on the first pipeline run.)
resource "azurerm_role_assignment" "cicd_acr_contributor" {
  count                = var.create_cicd_identity ? 1 : 0
  scope                = azurerm_container_registry.acr.id
  role_definition_name = "Contributor"
  principal_id         = azurerm_user_assigned_identity.cicd[0].principal_id
}

# Deploy to AKS via Azure RBAC:
#  - Cluster User Role → pull the kubeconfig (listClusterUserCredential).
#  - RBAC Cluster Admin → apply the manifests. NOT "RBAC Writer": Writer is
#    namespace-scoped and cannot create Namespaces (cluster-scoped) or Secrets, so a
#    pipeline that creates its own namespace + Secrets fails ("cannot create
#    namespaces at the cluster scope"). To keep the CI identity narrower, pre-create
#    the namespace and grant RBAC Admin scoped to that namespace instead.
resource "azurerm_role_assignment" "cicd_aks_user" {
  count                = var.create_cicd_identity ? 1 : 0
  scope                = azurerm_kubernetes_cluster.aks.id
  role_definition_name = "Azure Kubernetes Service Cluster User Role"
  principal_id         = azurerm_user_assigned_identity.cicd[0].principal_id
}

resource "azurerm_role_assignment" "cicd_aks_cluster_admin" {
  count                = var.create_cicd_identity ? 1 : 0
  scope                = azurerm_kubernetes_cluster.aks.id
  role_definition_name = "Azure Kubernetes Service RBAC Cluster Admin"
  principal_id         = azurerm_user_assigned_identity.cicd[0].principal_id
}

# ------------------------------------------------------------------
# Azure SRE Agent (Microsoft.App/agents) — the always-on first responder.
# Terraform is now an OFFICIAL path: Microsoft ships production-ready recipes
# (github.com/microsoft/sre-agent → sreagent-templates) and Learn documents the
# ARM/azapi schema. This section mirrors that module: the agent + its own App
# Insights (agent telemetry) + connectors (Log Analytics, Azure Monitor) +
# least-privilege RBAC — all declared here, no portal wizard for the core setup.
# knowledgeGraphConfiguration.managedResources replaces the old portal
# "Add resource group" wizard.
#
# Still portal/manual AFTER apply:
#   - ADO + Teams connectors, incident platform + response plans (OAuth).
#   - Data-plane extras (hooks, repos, skills/subagents) via the data-plane API.
#
# Region: the agent RP is region-limited (sre_agent_location, default eastus2 —
# NOT southeastasia). The agent still manages this stack's RG across regions.
# API version: 2025-05-01-preview — the version the official recipes pin;
# properties like monthlyAgentUnitLimit aren't in the 2026-01-01 GA schema yet.
# ------------------------------------------------------------------
resource "azurerm_user_assigned_identity" "sre_agent" {
  count               = var.create_sre_agent ? 1 : 0
  name                = "${local.base}-sre-agent-id"
  resource_group_name = local.rg_name
  location            = var.sre_agent_location
  tags                = local.common_tag
}

# The agent's own telemetry sink (logConfiguration below) — workspace-based,
# reusing the stack's LAW.
resource "azurerm_application_insights" "sre_agent" {
  count               = var.create_sre_agent ? 1 : 0
  name                = "${local.base}-sre-agent-ai"
  resource_group_name = local.rg_name
  location            = var.sre_agent_location
  application_type    = "web"
  workspace_id        = azurerm_log_analytics_workspace.law.id
  tags                = local.common_tag
}

# Least-privilege RBAC for the agent's UAMI on the managed RG, mirrored from the
# official module. Granted BEFORE the agent is created (see depends_on on the
# agent) so its first knowledge-graph build can already read the RG.
resource "azurerm_role_assignment" "sre_uami_reader" {
  count                = var.create_sre_agent ? 1 : 0
  scope                = local.rg_id
  role_definition_name = "Reader"
  principal_id         = azurerm_user_assigned_identity.sre_agent[0].principal_id
  principal_type       = "ServicePrincipal"
}

resource "azurerm_role_assignment" "sre_uami_log_reader" {
  count                = var.create_sre_agent ? 1 : 0
  scope                = local.rg_id
  role_definition_name = "Log Analytics Reader"
  principal_id         = azurerm_user_assigned_identity.sre_agent[0].principal_id
  principal_type       = "ServicePrincipal"
}

resource "azurerm_role_assignment" "sre_uami_monitoring_reader" {
  count                = var.create_sre_agent ? 1 : 0
  scope                = local.rg_id
  role_definition_name = "Monitoring Reader"
  principal_id         = azurerm_user_assigned_identity.sre_agent[0].principal_id
  principal_type       = "ServicePrincipal"
}

# Contributor ONLY when the agent may take actions (High) — Low stays read-only.
resource "azurerm_role_assignment" "sre_uami_contributor" {
  count                = var.create_sre_agent && var.sre_agent_access_level == "High" ? 1 : 0
  scope                = local.rg_id
  role_definition_name = "Contributor"
  principal_id         = azurerm_user_assigned_identity.sre_agent[0].principal_id
  principal_type       = "ServicePrincipal"
}

resource "azapi_resource" "sre_agent" {
  count     = var.create_sre_agent ? 1 : 0
  type      = "Microsoft.App/agents@2025-05-01-preview"
  name      = "${local.base}-sre-agent"
  parent_id = local.rg_id
  location  = var.sre_agent_location
  tags      = local.common_tag

  identity {
    type         = "SystemAssigned, UserAssigned"
    identity_ids = [azurerm_user_assigned_identity.sre_agent[0].id]
  }

  body = {
    properties = {
      # What the agent watches/manages: this whole stack's RG (AKS, ACR, LAW).
      knowledgeGraphConfiguration = {
        identity         = azurerm_user_assigned_identity.sre_agent[0].id
        managedResources = [local.rg_id]
      }
      actionConfiguration = {
        accessLevel = var.sre_agent_access_level
        identity    = azurerm_user_assigned_identity.sre_agent[0].id
        mode        = var.sre_agent_action_mode # Review = human approves; keep for prod
      }
      logConfiguration = {
        applicationInsightsConfiguration = {
          appId            = azurerm_application_insights.sre_agent[0].app_id
          connectionString = azurerm_application_insights.sre_agent[0].connection_string
        }
      }
      defaultModel = {
        provider = "Anthropic"
        name     = "Automatic"
      }
      upgradeChannel        = "Preview"
      monthlyAgentUnitLimit = var.sre_agent_monthly_unit_limit
    }
  }

  schema_validation_enabled = false # preview type — azapi carries no schema for it
  response_export_values    = ["properties.agentEndpoint"]

  # RBAC first, so the agent's initial knowledge-graph build can read the RG.
  depends_on = [
    azurerm_role_assignment.sre_uami_reader,
    azurerm_role_assignment.sre_uami_log_reader,
    azurerm_role_assignment.sre_uami_monitoring_reader,
    azurerm_role_assignment.sre_uami_contributor,
  ]
}

# The agent's SYSTEM-assigned MI runs the connector queries (Log Analytics /
# Azure Monitor) — it needs the same read roles on the managed RG as the UAMI.
resource "azurerm_role_assignment" "sre_smi_reader" {
  count                = var.create_sre_agent ? 1 : 0
  scope                = local.rg_id
  role_definition_name = "Reader"
  principal_id         = azapi_resource.sre_agent[0].identity[0].principal_id
  principal_type       = "ServicePrincipal"
}

resource "azurerm_role_assignment" "sre_smi_log_reader" {
  count                = var.create_sre_agent ? 1 : 0
  scope                = local.rg_id
  role_definition_name = "Log Analytics Reader"
  principal_id         = azapi_resource.sre_agent[0].identity[0].principal_id
  principal_type       = "ServicePrincipal"
}

# ── Connectors — ARM child resources, exactly as the official recipes deploy
# them. The PUT triggers an extension install that can take 10-30+ min; the
# timeouts cap the wait so `terraform apply` doesn't hang. A timeout error is
# SAFE — provisioning finishes in the background; the next apply reconciles.
resource "azapi_resource" "sre_agent_connector_law" {
  count                     = var.create_sre_agent ? 1 : 0
  type                      = "Microsoft.App/agents/connectors@2025-05-01-preview"
  name                      = "log-analytics"
  parent_id                 = azapi_resource.sre_agent[0].id
  schema_validation_enabled = false

  body = {
    properties = {
      dataConnectorType = "LogAnalytics"
      dataSource        = azurerm_log_analytics_workspace.law.id
      extendedProperties = {
        armResourceId = azurerm_log_analytics_workspace.law.id
        resource      = { name = azurerm_log_analytics_workspace.law.name }
      }
      identity = "system"
    }
  }

  timeouts {
    create = "10m"
    update = "10m"
    delete = "10m"
  }
}

# Azure Monitor connector — subscription-scoped alerts. This is the signal that
# feeds `/rnd-devops operations` (fired alert → incident → hotfix PR).
resource "azapi_resource" "sre_agent_connector_azmon" {
  count                     = var.create_sre_agent ? 1 : 0
  type                      = "Microsoft.App/agents/connectors@2025-05-01-preview"
  name                      = "azure-monitor"
  parent_id                 = azapi_resource.sre_agent[0].id
  schema_validation_enabled = false

  body = {
    properties = {
      dataConnectorType = "AzureMonitor"
      dataSource        = "/subscriptions/${var.subscription_id}"
      extendedProperties = {
        armResourceId = "/subscriptions/${var.subscription_id}"
        lookbackDays  = 7
      }
      identity = "system"
    }
  }

  timeouts {
    create = "10m"
    update = "10m"
    delete = "10m"
  }
}

# The agent's UAMI also gets "SRE Agent Administrator" ON the agent itself
# (official-module parity — the agent operates parts of itself through it).
resource "azurerm_role_assignment" "sre_agent_uami_admin" {
  count                = var.create_sre_agent ? 1 : 0
  scope                = azapi_resource.sre_agent[0].id
  role_definition_name = "SRE Agent Administrator"
  principal_id         = azurerm_user_assigned_identity.sre_agent[0].principal_id
  principal_type       = "ServicePrincipal"
}

# The HUMAN operator running Terraform gets "SRE Agent Administrator" ON the agent so
# they can open/use it in the portal right after apply — otherwise the portal shows
# "Access requirement: … requires an SRE Agent Reader role or higher" and nothing loads.
# Only Administrators can approve the agent's proposed actions (Review mode).
# Per-person by nature — this covers ONLY the operator who runs the apply; grant
# teammates their own role in the portal. Toggle via grant_operator_sre_admin; set it
# false if Terraform runs as a service principal (not a human) and grant a human instead.
resource "azurerm_role_assignment" "sre_agent_operator" {
  count                = var.create_sre_agent && var.grant_operator_sre_admin ? 1 : 0
  scope                = azapi_resource.sre_agent[0].id
  role_definition_name = "SRE Agent Administrator"
  principal_id         = data.azurerm_client_config.current.object_id
  principal_type       = "User"
}

# NOTE — what stays manual after apply: the ADO + Teams connectors, the incident
# platform + response plans (OAuth, wired at sre.azure.com), and data-plane extras
# (hooks, repos, skills/subagents — data-plane REST API, needs `az login --scope`).
# Everything else about the agent — identity, managed resources, action mode,
# telemetry, LAW/Azure Monitor connectors, RBAC — is code, right here.
```