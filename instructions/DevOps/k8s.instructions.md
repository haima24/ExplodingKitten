---
applyTo: "**/k8s/**/*.yaml,**/k8s/**/*.yml,**/manifests/**/*.yaml,**/manifests/**/*.yml,**/deploy/**/*.yaml"
---
# Kubernetes manifest conventions

## Security
- Run containers as non-root (`runAsNonRoot: true`, `runAsUser: 1000`).
- Set `readOnlyRootFilesystem: true` where possible.
- Drop all capabilities, add only what's needed.
- No secrets in manifests — use Kubernetes Secrets mounted from Key Vault via CSI driver.

## Resource management
- Always set `resources.requests` and `resources.limits` (CPU + memory).
- Use `PodDisruptionBudget` for production workloads.
- Set `topologySpreadConstraints` or anti-affinity for HA.

## Labels & naming
```yaml
metadata:
  labels:
    app.kubernetes.io/name: <service-name>
    app.kubernetes.io/version: <version>
    app.kubernetes.io/component: <api|worker|frontend>
    app.kubernetes.io/managed-by: <helm|kustomize|manual>
```

## Health checks
- Every Deployment must have `livenessProbe` and `readinessProbe`.
- Use `startupProbe` for slow-starting containers.
- Probes should hit a lightweight health endpoint, not the main API.

## Deployment strategy
- Default: `RollingUpdate` with `maxSurge: 1`, `maxUnavailable: 0`.
- Set `terminationGracePeriodSeconds` appropriate to the workload.

## Observability
- Set `deployment.environment` and `service.name` annotations/labels for telemetry correlation.
- Ensure containers export OTLP telemetry to the collector.

## Namespace
- One namespace per service per environment.
- NetworkPolicy to restrict cross-namespace traffic.
