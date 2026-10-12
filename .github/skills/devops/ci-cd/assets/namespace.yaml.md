# `deploy/aks/k8s/namespace.yaml` — deploy-kit file

The service namespace.

**Generic — templated.** `__SERVICE__` is replaced with the service slug when the kit is materialized (ci-cd Step 0); `__IMAGE__` is replaced by the pipeline at deploy time. CamelCase `SimplCommerce` (the database name, the app's own identifiers) is the app's, not the slug's — it stays. Other app → see [docs/BRING-YOUR-OWN-SERVICE.md](../../../../../docs/BRING-YOUR-OWN-SERVICE.md).

Write the block below, verbatim, to `deploy/aks/k8s/namespace.yaml` in the target repo (demo: `ci/deploy/aks/k8s/namespace.yaml`):

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: __SERVICE__
```
