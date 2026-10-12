# `versions.tf` — materialize to `tf/versions.tf`

Terraform + provider requirements (azurerm 4.x, azapi 2.x, random 3.x), local-state default, and the provider `features` teardown behavior.

Write the block below, verbatim, to `tf/versions.tf`:

```hcl
terraform {
  required_version = ">= 1.5.0"

  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 4.0"
    }
    # azapi: for ARM resource types azurerm doesn't cover yet — here the
    # preview Azure SRE Agent (Microsoft.App/agents). See create_sre_agent.
    azapi = {
      source  = "Azure/azapi"
      version = "~> 2.0"
    }
    # random: the per-stack name suffix that keeps RG / ACR / AKS node-RG
    # names from colliding when several people provision into one
    # subscription. See random_string.suffix in main.tf.
    random = {
      source  = "hashicorp/random"
      version = "~> 3.6"
    }
  }

  # Basic default: local state (fine for a first cluster / a single operator).
  # For team use switch to a remote azurerm backend (uncomment + fill in below).
  # backend "azurerm" {
  #   resource_group_name  = "<tfstate-rg>"
  #   storage_account_name = "<tfstatesa>"
  #   container_name       = "tfstate"
  #   key                  = "rnd-aks.tfstate"
  # }
}

provider "azurerm" {
  features {
    resource_group {
      # Azure auto-creates resources Terraform never managed (the
      # ContainerInsights solution, App Insights Smart Detection rules...).
      # Without this, a deliberate teardown always fails at the RG step and
      # forces a manual cleanup. prevent_destroy on the RG still guards
      # against ACCIDENTAL deletion — this only affects intentional destroys.
      prevent_deletion_if_contains_resources = false
    }
  }
  subscription_id = var.subscription_id

  # azurerm registers resource providers at SUBSCRIPTION scope on first use.
  # An operator who only holds Owner on a pre-created resource group gets a 403
  # on that step before creating anything — so when deploying into an existing
  # group, skip it; the admin registers the providers once (see the
  # infrastructure skill's Preflight / GETTING-STARTED §1.3). Creating the group
  # ourselves implies subscription-level rights, so keep the default there.
  resource_provider_registrations = var.existing_resource_group_name != "" ? "none" : "core"
}

provider "azapi" {
  subscription_id = var.subscription_id
}
```