# `deploy/aks/k8s/app.yaml` — deploy-kit file

The app Deployment/Service. __IMAGE__ is substituted by the pipeline; the migrate initContainer applies the EF schema before the web container starts.

**Templated names, SimplCommerce container spec.** Every Kubernetes *name* (namespace, Deployment, Service, labels, the `-secret`) is `__SERVICE__`; the *contents* — the migrate initContainer, the `SimplCommerce` database, port 8080, the ASP.NET Core env — are this app's. Another app → keep the skeleton, replace the spec (see [docs/BRING-YOUR-OWN-SERVICE.md](../../../../../docs/BRING-YOUR-OWN-SERVICE.md)).

Write the block below, verbatim, to `deploy/aks/k8s/app.yaml` in the target repo (demo: `ci/deploy/aks/k8s/app.yaml`):

```yaml
# SimplCommerce app. __IMAGE__ is substituted by the pipeline with the ACR image
# for this build. The migrate initContainer applies the EF schema (sqlcmd + the
# baked dbscript.sql) before the web container starts — the app reads config from
# the DB at boot, so the schema must exist first.
apiVersion: v1
kind: Secret
metadata:
  name: __SERVICE__-secret
  namespace: __SERVICE__
type: Opaque
stringData:
  # Keep the password in sync with mssql-secret (or source both from Key Vault CSI).
  ConnectionStrings__DefaultConnection: "Server=mssql;Database=SimplCommerce;User Id=sa;Password=Ch@ngeMe_Demo123!;TrustServerCertificate=true;MultipleActiveResultSets=true"
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: __SERVICE__
  namespace: __SERVICE__
  labels: { app: __SERVICE__ }
spec:
  replicas: 1
  selector:
    matchLabels: { app: __SERVICE__ }
  template:
    metadata:
      labels: { app: __SERVICE__ }
    spec:
      initContainers:
        # Apply the EF migration schema before the app boots (the app reads config
        # from the DB at startup). sqlcmd waits for SQL Server, ensures the DB exists,
        # then runs the idempotent script baked into the image at /app/dbscript.sql.
        - name: migrate
          image: __IMAGE__
          command: ["/bin/bash", "-c"]
          args:
            - |
              set -e
              SQLCMD=/opt/mssql-tools18/bin/sqlcmd
              echo "waiting for SQL Server..."
              for i in $(seq 1 40); do
                $SQLCMD -S mssql -U sa -P "$SA_PASSWORD" -C -l 5 -Q "SELECT 1" >/dev/null 2>&1 && break || sleep 5
              done
              echo "ensuring database exists..."
              $SQLCMD -S mssql -U sa -P "$SA_PASSWORD" -C -Q "IF DB_ID('SimplCommerce') IS NULL CREATE DATABASE [SimplCommerce];"
              echo "applying migration script..."
              # -I: SET QUOTED_IDENTIFIER ON (sqlcmd defaults it OFF, unlike SSMS) —
              #     required or SimplCommerce's filtered-index CREATEs fail (Msg 1934),
              #     aborting the batch so no tables get created.
              # -b: exit non-zero on any SQL error (else sqlcmd swallows failures and the
              #     app boots against an empty DB → EFConfigProvider "Invalid object name").
              $SQLCMD -S mssql -U sa -P "$SA_PASSWORD" -C -I -b -d SimplCommerce -i /app/dbscript.sql
              echo "migration done."
          env:
            - name: SA_PASSWORD
              valueFrom:
                secretKeyRef: { name: mssql-secret, key: SA_PASSWORD }
      containers:
        - name: web
          image: __IMAGE__
          ports:
            - containerPort: 8080
          env:
            - name: ASPNETCORE_HTTP_PORTS
              value: "8080"
            - name: ASPNETCORE_ENVIRONMENT
              value: "Production"
            - name: ConnectionStrings__DefaultConnection
              valueFrom:
                secretKeyRef: { name: __SERVICE__-secret, key: ConnectionStrings__DefaultConnection }
          readinessProbe:
            tcpSocket: { port: 8080 }
            initialDelaySeconds: 20
            periodSeconds: 10
          livenessProbe:
            tcpSocket: { port: 8080 }
            initialDelaySeconds: 60
            periodSeconds: 20
          resources:
            requests: { cpu: "250m", memory: "512Mi" }
            limits: { memory: "1Gi" }
---
apiVersion: v1
kind: Service
metadata:
  name: __SERVICE__
  namespace: __SERVICE__
spec:
  type: LoadBalancer # gives a public IP for the demo; swap for ClusterIP + Ingress in prod
  selector: { app: __SERVICE__ }
  ports:
    - port: 80
      targetPort: 8080
```
