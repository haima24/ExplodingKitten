# `deploy/aks/k8s/mssql.yaml` — deploy-kit file

In-cluster SQL Server for the demo (single replica, one PVC). DEMO placeholder SA password — replace for anything shared; prefer Azure SQL + Key Vault CSI.

**Generic names, SimplCommerce dependency.** Namespaces are templated (`__SERVICE__`); the resource itself exists because SimplCommerce needs SQL Server. Another app with another database → drop or replace this file (see [docs/BRING-YOUR-OWN-SERVICE.md](../../../../../docs/BRING-YOUR-OWN-SERVICE.md)).

Write the block below, verbatim, to `deploy/aks/k8s/mssql.yaml` in the target repo (demo: `ci/deploy/aks/k8s/mssql.yaml`):

```yaml
# SQL Server for the demo — in-cluster, single replica, one PVC.
# For anything real, use Azure SQL / SQL MI (managed, backed up, HA) instead and
# point the connection string there. The SA password below is a DEMO placeholder;
# replace it, and prefer the AKS Key Vault CSI addon (already enabled by the
# rnd-devops terraform) over a literal Secret.
apiVersion: v1
kind: Secret
metadata:
  name: mssql-secret
  namespace: __SERVICE__
type: Opaque
stringData:
  SA_PASSWORD: "Ch@ngeMe_Demo123!" # DEMO ONLY — replace before any shared use
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: mssql-data
  namespace: __SERVICE__
spec:
  accessModes: ["ReadWriteOnce"]
  storageClassName: managed-csi # Azure Disk (AKS default)
  resources:
    requests:
      storage: 8Gi
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mssql
  namespace: __SERVICE__
spec:
  replicas: 1
  selector:
    matchLabels: { app: mssql }
  strategy:
    type: Recreate # single RWO disk — never run two pods against it
  template:
    metadata:
      labels: { app: mssql }
    spec:
      securityContext:
        fsGroup: 10001 # mssql image runs as uid 10001; let it own the volume
      containers:
        - name: mssql
          image: mcr.microsoft.com/mssql/server:2022-latest
          ports:
            - containerPort: 1433
          env:
            - name: ACCEPT_EULA
              value: "Y"
            - name: MSSQL_PID
              value: "Developer"
            - name: MSSQL_SA_PASSWORD
              valueFrom:
                secretKeyRef: { name: mssql-secret, key: SA_PASSWORD }
          volumeMounts:
            - name: data
              mountPath: /var/opt/mssql
          resources:
            requests: { cpu: "250m", memory: "1Gi" }
            limits: { memory: "2Gi" }
          readinessProbe:
            tcpSocket: { port: 1433 }
            initialDelaySeconds: 15
            periodSeconds: 10
      volumes:
        - name: data
          persistentVolumeClaim:
            claimName: mssql-data
---
apiVersion: v1
kind: Service
metadata:
  name: mssql
  namespace: __SERVICE__
spec:
  selector: { app: mssql }
  ports:
    - port: 1433
      targetPort: 1433
```
