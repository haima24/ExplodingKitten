# `outputs.tf` — materialize to `tf/outputs.tf`

Outputs, including the `infra_state` blob the other rnd-devops verbs consume.

Write the block below, verbatim, to `tf/outputs.tf`:

```hcl
output "subscription_id" {
  value = var.subscription_id
}

output "name_suffix" {
  description = "The per-stack name suffix (random unless var.name_suffix pinned it). This is what identifies YOUR stack in a shared subscription; pin it in tfvars to re-attach a fresh working dir."
  value       = local.suffix
}

output "resource_group" {
  value = local.rg_name
}

output "location" {
  value = local.rg_location
}

output "acr_name" {
  value = azurerm_container_registry.acr.name
}

output "acr_login_server" {
  value = azurerm_container_registry.acr.login_server
}

output "aks_name" {
  value = azurerm_kubernetes_cluster.aks.name
}

output "aks_id" {
  value = azurerm_kubernetes_cluster.aks.id
}

output "aks_node_resource_group" {
  value = azurerm_kubernetes_cluster.aks.node_resource_group
}

output "kubelet_identity_object_id" {
  value = azurerm_kubernetes_cluster.aks.kubelet_identity[0].object_id
}

output "oidc_issuer_url" {
  description = "Cluster OIDC issuer — the trust anchor for Workload Identity federated credentials."
  value       = azurerm_kubernetes_cluster.aks.oidc_issuer_url
}

output "cicd_identity_client_id" {
  description = "Client ID of the CI/CD identity — pass as the ADO service connection's serviceprincipalid."
  value       = var.create_cicd_identity ? azurerm_user_assigned_identity.cicd[0].client_id : null
}

output "cicd_identity_principal_id" {
  description = "Principal (object) ID of the CI/CD identity."
  value       = var.create_cicd_identity ? azurerm_user_assigned_identity.cicd[0].principal_id : null
}

output "sre_agent_endpoint" {
  description = "Azure SRE Agent endpoint (manage at https://sre.azure.com)."
  value       = var.create_sre_agent ? try(azapi_resource.sre_agent[0].output.properties.agentEndpoint, null) : null
}

output "log_analytics_workspace_id" {
  value = azurerm_log_analytics_workspace.law.id
}

output "log_analytics_workspace_name" {
  value = azurerm_log_analytics_workspace.law.name
}

# Consumed by `/rnd-devops service-connection` and `ci-cd`'s deploy step.
# Emit as a single blob so the operator can write .rnd-devops/infra-state.json:
#   terraform output -json infra_state > ../.rnd-devops/infra-state.json   (from tf/)
output "infra_state" {
  description = "Everything the other rnd-devops verbs need. Write to .rnd-devops/infra-state.json."
  value = {
    subscription_id              = var.subscription_id
    name_suffix                  = local.suffix
    resource_group               = local.rg_name
    location                     = local.rg_location
    acr_name                     = azurerm_container_registry.acr.name
    acr_login_server             = azurerm_container_registry.acr.login_server
    aks_name                     = azurerm_kubernetes_cluster.aks.name
    aks_node_resource_group      = azurerm_kubernetes_cluster.aks.node_resource_group
    kubelet_identity_object_id   = azurerm_kubernetes_cluster.aks.kubelet_identity[0].object_id
    oidc_issuer_url              = azurerm_kubernetes_cluster.aks.oidc_issuer_url
    log_analytics_workspace_id   = azurerm_log_analytics_workspace.law.id
    log_analytics_workspace_name = azurerm_log_analytics_workspace.law.name
    cicd_identity_name           = var.create_cicd_identity ? azurerm_user_assigned_identity.cicd[0].name : null
    sre_agent_name               = var.create_sre_agent ? azapi_resource.sre_agent[0].name : null
    env                          = var.env
    # What `service-connection` reads. It fills in name/id/org/project after registering the endpoint.
    service_connection = {
      cicd_identity_client_id    = var.create_cicd_identity ? azurerm_user_assigned_identity.cicd[0].client_id : null
      cicd_identity_principal_id = var.create_cicd_identity ? azurerm_user_assigned_identity.cicd[0].principal_id : null
    }
  }
}
```