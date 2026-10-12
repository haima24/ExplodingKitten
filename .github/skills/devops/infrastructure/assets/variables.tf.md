# `variables.tf` — materialize to `tf/variables.tf`

All input variables with safe defaults — naming (incl. the anti-collision `name_suffix`), region, node pool sizing, upgrade channels, and the SRE Agent knobs.

Write the block below, verbatim, to `tf/variables.tf`:

```hcl
variable "subscription_id" {
  type        = string
  description = "Azure subscription to provision into."
}

variable "prefix" {
  type        = string
  description = "Naming prefix for all resources, e.g. \"rnd\". Kept short; ACR name strips non-alphanumerics."
  default     = "rnd"

  validation {
    condition     = can(regex("^[a-z][a-z0-9]{1,10}$", var.prefix))
    error_message = "prefix must be 2-11 chars, lowercase alphanumeric, starting with a letter (ACR names are restrictive)."
  }
}

variable "env" {
  type        = string
  description = "Environment slug baked into resource names (dev|staging|prod)."
  default     = "dev"
}

variable "name_suffix" {
  type        = string
  description = "Short lowercase-alphanumeric suffix baked into EVERY resource name: <prefix>-<env>-<suffix>-*, ACR <prefix><env><suffix>acr. null (default) = Terraform generates a random 4-char suffix on the first apply and keeps it in state, so several people provisioning into one subscription never collide on rnd-dev-rg, the globally-unique rnddevacr, or the subscription-unique AKS node RG rnd-dev-aks-nodes-rg. Set it explicitly only to pin a name or to re-attach a fresh working dir to a known stack (`terraform output -raw name_suffix`)."
  default     = null

  validation {
    condition     = var.name_suffix == null || can(regex("^[a-z0-9]{2,6}$", var.name_suffix))
    error_message = "name_suffix must be 2-6 lowercase alphanumeric chars (it lands inside the ACR name)."
  }
}

variable "location" {
  type        = string
  description = "Azure region. Ignored when existing_resource_group_name is set — the stack then follows that resource group's region."
  default     = "southeastasia"
}

variable "existing_resource_group_name" {
  type        = string
  description = <<-EOT
    Leave empty (default) to CREATE the resource group "<prefix>-<env>-<suffix>-rg".
    Set it to the name of a resource group that already exists — e.g. one an admin
    pre-created for your team on a shared subscription — to deploy INTO it instead:
    Terraform then never creates, tags or destroys that group, and Owner on that
    resource group alone is enough (no subscription-level rights needed). The
    other resources keep their <prefix>-<env>-<suffix>-* names inside the group.
  EOT
  default     = ""

  validation {
    condition     = var.existing_resource_group_name == "" || can(regex("^[a-zA-Z0-9._()-]{1,90}$", var.existing_resource_group_name))
    error_message = "existing_resource_group_name must be empty or a valid Azure resource group name."
  }
}

variable "kubernetes_version" {
  type        = string
  description = "AKS control-plane version. Leave null to take the region default (recommended for a basic cluster)."
  default     = null
}

variable "node_count" {
  type        = number
  description = "Initial node count for the system pool. The autoscaler then moves it between node_min_count and node_max_count."
  default     = 2
}

variable "node_min_count" {
  type        = number
  description = "Autoscaler minimum for the system pool."
  default     = 2
}

variable "node_max_count" {
  type        = number
  description = "Autoscaler maximum for the system pool. Caps scale-up cost."
  default     = 4
}

variable "node_vm_size" {
  type        = string
  description = "VM size for the system node pool. Small burstable default (2 vCPU / 8 GB) — cheap and fits constrained subscriptions; note some subs have 0 quota for newer families (e.g. DSv5) in a region, check `az vm list-usage --location <region>` before overriding."
  default     = "Standard_B2ms"
}

variable "vnet_cidr" {
  type        = string
  description = "Address space for the VNet."
  default     = "10.40.0.0/16"
}

variable "aks_subnet_cidr" {
  type        = string
  description = "Address prefix for the AKS node subnet (inside vnet_cidr)."
  default     = "10.40.0.0/22"
}

variable "acr_sku" {
  type        = string
  description = "ACR SKU. Basic is enough to start; Standard/Premium add geo-replication + throughput."
  default     = "Basic"

  validation {
    condition     = contains(["Basic", "Standard", "Premium"], var.acr_sku)
    error_message = "acr_sku must be one of Basic, Standard, Premium."
  }
}

variable "log_retention_days" {
  type        = number
  description = "Log Analytics workspace retention (Container Insights feeds Azure Monitor)."
  default     = 30
}

variable "tags" {
  type        = map(string)
  description = "Tags applied to every resource."
  default = {
    managed-by = "terraform"
    stack      = "rnd-devops"
  }
}

variable "sku_tier" {
  type        = string
  description = "AKS control-plane tier. Free has no uptime SLA (fine for dev); use Standard for prod (financially-backed SLA), Premium for long-term support."
  default     = "Free"

  validation {
    condition     = contains(["Free", "Standard", "Premium"], var.sku_tier)
    error_message = "sku_tier must be one of Free, Standard, Premium."
  }
}

variable "local_account_disabled" {
  type        = bool
  description = "Disable the shared local admin kubeconfig so all access is via Entra ID + Azure RBAC. Best practice ON — but you MUST hold an AKS RBAC role on the cluster first, or you lock yourself out."
  default     = true
}

variable "automatic_upgrade_channel" {
  type        = string
  description = "AKS control-plane auto-upgrade channel. 'patch' applies patch releases safely; 'none' to pin."
  default     = "patch"

  validation {
    condition     = contains(["none", "patch", "stable", "rapid", "node-image"], var.automatic_upgrade_channel)
    error_message = "automatic_upgrade_channel must be one of none, patch, stable, rapid, node-image."
  }
}

variable "node_os_upgrade_channel" {
  type        = string
  description = "Node OS image upgrade channel. 'NodeImage' tracks the weekly AKS node image; 'SecurityPatch' applies security patches; 'None' to pin."
  default     = "NodeImage"

  validation {
    condition     = contains(["None", "Unmanaged", "SecurityPatch", "NodeImage"], var.node_os_upgrade_channel)
    error_message = "node_os_upgrade_channel must be one of None, Unmanaged, SecurityPatch, NodeImage."
  }
}

# enable_control_plane_logs removed — Azure auto-creates the diagnostic
# setting when Container Insights (oms_agent) is enabled on the cluster.

variable "create_sre_agent" {
  type        = bool
  description = "Provision an Azure SRE Agent (Microsoft.App/agents via azapi) PLUS its own App Insights, its Log Analytics + Azure Monitor connectors, and least-privilege RBAC — Terraform is now an OFFICIAL path (Microsoft ships production recipes: github.com/microsoft/sre-agent → sreagent-templates; this section mirrors them). Bills agent-units (capped by sre_agent_monthly_unit_limit); the agent RP is region-limited (sre_agent_location). ADO/Teams connectors + incident response plans are still wired in the sre.azure.com portal. Default off (cost)."
  default     = false
}

variable "sre_agent_location" {
  type        = string
  description = "Region for the SRE Agent itself. The agent RP is region-limited and does NOT need to match var.location — an agent in eastus2 manages resources in southeastasia fine."
  default     = "eastus2"

  validation {
    condition     = contains(["swedencentral", "uksouth", "eastus2", "australiaeast"], var.sre_agent_location)
    error_message = "sre_agent_location must be one of swedencentral, uksouth, eastus2, australiaeast (the SRE Agent RP's supported regions)."
  }
}

variable "sre_agent_access_level" {
  type        = string
  description = "SRE Agent access level. Low = read-only investigation (default). High = the agent may take actions — also grants its identities Contributor on the managed RG."
  default     = "Low"

  validation {
    condition     = contains(["High", "Low"], var.sre_agent_access_level)
    error_message = "sre_agent_access_level must be High or Low."
  }
}

variable "sre_agent_action_mode" {
  type        = string
  description = "SRE Agent action mode. Review = a human approves every proposed action (keep this for prod); Automatic = the agent acts on its own."
  default     = "Review"

  validation {
    condition     = contains(["Review", "Automatic"], var.sre_agent_action_mode)
    error_message = "sre_agent_action_mode must be Review or Automatic."
  }
}

variable "sre_agent_monthly_unit_limit" {
  type        = number
  description = "Monthly agent-unit spend cap for the SRE Agent."
  default     = 10000
}

variable "grant_operator_sre_admin" {
  type        = bool
  description = "Grant the identity running Terraform (data.azurerm_client_config.current.object_id) the 'SRE Agent Administrator' role ON the agent resource, so they can open/use it in the portal without hitting 'Access requirement: … requires an SRE Agent Reader role or higher'. Assumes a HUMAN operator (principal_type User) — set false if Terraform runs as a service principal, and grant humans the role per-person instead. For teams, grant additional people separately (this only covers the provisioning operator)."
  default     = true
}

variable "create_cicd_identity" {
  type        = bool
  description = "Provision a user-assigned managed identity for CI/CD (ADO Workload Identity Federation target) with the roles a build+deploy pipeline needs. The ADO service connection + federated credential are wired afterward (see /rnd-devops service-connection)."
  default     = true
}
```