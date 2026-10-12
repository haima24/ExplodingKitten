# `.github/workflows/deploy-aks.yml` — deploy-kit file (GitHub Actions provider)

The **GitHub Actions twin** of [`azure-pipelines.aks.yml`](azure-pipelines.aks.yml.md): the same Build → Security → Deploy flow, the same four scans, the same `securityScan` posture, the same kubelogin deploy and the same boxed *Storefront URL* hand-off — for services whose **CI provider is GitHub Actions** (plan header *CI provider*, `services.<service>.github` in `infra-state.json`). Materialize **one** of the two pipeline files, never both.

**Templated.** `__SERVICE__` → the service slug at materialization (ci-cd Step 0, same `sed` as the rest of the kit). The infra values are **not** placeholders here: the workflow reads them as repository **variables** (`${{ vars.* }}`), set once from `infra-state.json` at ci-cd Step 1 — so nothing stack-specific is ever hard-coded in the file. One SimplCommerce-specific line remains: the SCA step's `dotnet restore SimplCommerce.sln` (see [docs/BRING-YOUR-OWN-SERVICE.md](../../../../docs/BRING-YOUR-OWN-SERVICE.md)).

Auth is an **OIDC federated credential on the infra UAMI** (`/rnd-devops service-connection`, GitHub path) — `permissions: id-token: write` + `azure/login`; no secret is stored anywhere. `securityScan` is the `workflow_dispatch` input — `gate` (scans block Deploy), `report` (findings as warnings, the demo default), `skip` (no Security job). A push to `main` has no input and runs `report`. `skip` is demo/dev only, must be declared in the approved plan, and stamps a warning into the run.

Write the block below, verbatim, to `.github/workflows/deploy-aks.yml` in the target repo (demo: `ci/.github/workflows/deploy-aks.yml`):

```yaml
# __SERVICE__ → AKS deploy workflow (build image in ACR, scan, deploy to AKS).
# GitHub Actions twin of azure-pipelines.aks.yml — same stages, same posture, same
# kubelogin deploy. Infra values come from repository VARIABLES set by
# `/rnd-devops ci-cd` (Step 1); auth from the OIDC federated credential wired by
# `/rnd-devops service-connection` (GitHub path). No secrets anywhere.
name: deploy-aks

on:
  push:
    branches: [main, master]
    paths:
      - "src/**"
      - "deploy/aks/**"
      - ".github/workflows/deploy-aks.yml"
  workflow_dispatch:
    inputs:
      # Security posture for THIS run. Choose it up front (and record it in the plan) —
      # this is a declared choice, not a way to turn a red run green after the fact.
      #   gate   → scans BLOCK Deploy (production posture)
      #   report → findings logged as warnings, Deploy proceeds (demo default)
      #   skip   → no Security job at all: Build → Deploy
      securityScan:
        description: "Security scans: gate | report | skip"
        type: choice
        options: [gate, report, skip]
        default: report

permissions:
  id-token: write # OIDC token for azure/login — the whole "no secrets" trick
  contents: read

env:
  # Repository VARIABLES (not secrets — none of these values is confidential):
  #   AZURE_*   → set by /rnd-devops service-connection (GitHub path)
  #   ACR_/AKS_ → set at ci-cd Step 1 from .rnd-devops/infra-state.json
  # Every stack carries a random name suffix (rnd-dev-<suffix>-rg, rnddev<suffix>acr, …),
  # so there is no meaningful default — the variables ARE the wiring.
  AZURE_CLIENT_ID: ${{ vars.AZURE_CLIENT_ID }} # infra UAMI (id-<prefix>-<env>-<suffix>-cicd) client id
  AZURE_TENANT_ID: ${{ vars.AZURE_TENANT_ID }}
  AZURE_SUBSCRIPTION_ID: ${{ vars.AZURE_SUBSCRIPTION_ID }}
  ACR_NAME: ${{ vars.ACR_NAME }} # infra-state .acr_name
  ACR_LOGIN_SERVER: ${{ vars.ACR_LOGIN_SERVER }} # infra-state .acr_login_server
  AKS_RESOURCE_GROUP: ${{ vars.AKS_RESOURCE_GROUP }} # infra-state .resource_group
  AKS_NAME: ${{ vars.AKS_NAME }} # infra-state .aks_name
  # __SERVICE__ is replaced with the service slug when the kit is materialized
  # (ci-cd Step 0). namespace == image == service name is the contract the
  # alert rules rely on (they filter by namespace).
  SERVICE_NAME: __SERVICE__
  K8S_NAMESPACE: __SERVICE__
  IMAGE_NAME: __SERVICE__
  TAG: ${{ github.run_number }}
  # A push-triggered run has no input → report (the demo default).
  SECURITY_SCAN: ${{ github.event.inputs.securityScan || 'report' }}

jobs:
  build:
    name: Build & push image (ACR)
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: azure/login@v2
        with:
          client-id: ${{ env.AZURE_CLIENT_ID }}
          tenant-id: ${{ env.AZURE_TENANT_ID }}
          subscription-id: ${{ env.AZURE_SUBSCRIPTION_ID }}
      # `az acr build` builds inside ACR — no docker daemon needed on the runner,
      # and it authenticates as the UAMI azure/login just signed in.
      - name: az acr build
        run: |
          set -euo pipefail
          az acr build \
            --registry "$ACR_NAME" \
            --image "$IMAGE_NAME:$TAG" \
            --image "$IMAGE_NAME:latest" \
            -f deploy/aks/Dockerfile .

  # Runs only when securityScan != skip (posture=skip → this job is *skipped*).
  security:
    name: Security scans (gate Deploy)
    needs: build
    if: ${{ (github.event.inputs.securityScan || 'report') != 'skip' }}
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      # Translate the posture into the three knobs the scans read. Done in bash on
      # purpose: a `cond && '' || x` expression would silently pick x for both cases.
      - name: Resolve posture
        run: |
          if [ "$SECURITY_SCAN" = "gate" ]; then
            echo "BLOCK_ON_FINDINGS=true"  >> "$GITHUB_ENV"
            echo "TRIVY_EXIT_CODE=1"       >> "$GITHUB_ENV"
            echo "CHECKOV_SOFT_FAIL="      >> "$GITHUB_ENV"
          else
            echo "BLOCK_ON_FINDINGS=false" >> "$GITHUB_ENV"
            echo "TRIVY_EXIT_CODE=0"       >> "$GITHUB_ENV"
            echo "CHECKOV_SOFT_FAIL=--soft-fail" >> "$GITHUB_ENV"
          fi
          echo "posture=$SECURITY_SCAN"

      # 1) SCA — vulnerable NuGet packages. Blocks when securityScan=gate,
      #    warns when =report. (This gate already proved itself on the ADO twin:
      #    it caught 8+ High-severity transitive CVEs.)
      - uses: actions/setup-dotnet@v4
        with:
          dotnet-version: "8.0.x"
      - name: SCA — dotnet vulnerable packages
        run: |
          set -euo pipefail
          dotnet restore SimplCommerce.sln
          dotnet list package --vulnerable --include-transitive 2>&1 | tee vuln.txt
          if grep -Eiq 'Critical|High' vuln.txt; then
            if [ "$BLOCK_ON_FINDINGS" = "true" ]; then
              echo "::error::High/Critical vulnerable dependencies found — see log."
              exit 1
            fi
            echo "::warning::High/Critical vulnerable dependencies found — see log (report-only)."
          else
            echo "No High/Critical vulnerable dependencies."
          fi

      # 2) Secret scan — gitleaks. Upstream SimplCommerce sample OAuth keys are
      #    allowlisted in .gitleaks.toml. Blocks when securityScan=gate.
      - name: Secret scan — gitleaks
        run: |
          docker run --rm -v "$GITHUB_WORKSPACE:/repo" zricethezav/gitleaks:latest \
            detect --source=/repo --no-git --config=/repo/.gitleaks.toml --redact -v \
            || { if [ "$BLOCK_ON_FINDINGS" = "true" ]; then echo "::error::gitleaks findings — see log."; exit 1; fi; echo "::warning::gitleaks findings — see log (report-only)."; }

      # 3) IaC scan — checkov on the k8s manifests + Dockerfile. --soft-fail is
      #    dropped when securityScan=gate (a fresh manifest set trips many baseline rules).
      - name: IaC scan — checkov (deploy/aks)
        run: |
          docker run --rm -v "$GITHUB_WORKSPACE:/src" bridgecrew/checkov:latest \
            -d /src/deploy/aks --framework kubernetes dockerfile $CHECKOV_SOFT_FAIL --compact

      # 4) Container image scan — Trivy. --exit-code follows the posture: 1 when
      #    securityScan=gate (blocks on FIXABLE High/Critical), 0 when =report.
      - uses: azure/login@v2
        with:
          client-id: ${{ env.AZURE_CLIENT_ID }}
          tenant-id: ${{ env.AZURE_TENANT_ID }}
          subscription-id: ${{ env.AZURE_SUBSCRIPTION_ID }}
      - name: Image scan — Trivy
        run: |
          set -euo pipefail
          az acr login -n "$ACR_NAME"
          mkdir -p bin
          curl -sfL https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/install.sh | sh -s -- -b ./bin
          ./bin/trivy image --severity HIGH,CRITICAL --ignore-unfixed --exit-code "$TRIVY_EXIT_CODE" \
            "$ACR_LOGIN_SERVER/$IMAGE_NAME:$TAG"

  deploy:
    name: Deploy to AKS
    needs: [build, security]
    # Build passed AND Security either passed or was skipped (posture=skip).
    # A FAILED Security job (posture=gate) leaves this condition false → no deploy.
    if: ${{ always() && needs.build.result == 'success' && (needs.security.result == 'success' || needs.security.result == 'skipped') }}
    runs-on: ubuntu-latest
    outputs:
      storefront_url: ${{ steps.apply.outputs.storefront_url }}
    steps:
      - uses: actions/checkout@v4
      - name: Security scans skipped (declared)
        if: ${{ needs.security.result == 'skipped' }}
        run: echo "::warning::Security scans were SKIPPED for this run (securityScan=skip). Demo/dev only — never for a shared or production deploy."
      - uses: azure/login@v2
        with:
          client-id: ${{ env.AZURE_CLIENT_ID }}
          tenant-id: ${{ env.AZURE_TENANT_ID }}
          subscription-id: ${{ env.AZURE_SUBSCRIPTION_ID }}
      - name: kubectl apply
        id: apply
        run: |
          set -euo pipefail
          az aks get-credentials -g "$AKS_RESOURCE_GROUP" -n "$AKS_NAME" --overwrite-existing
          # Cluster has AAD + local accounts disabled → convert kubeconfig to
          # non-interactive auth as the identity azure/login signed in (the UAMI).
          # ubuntu-latest already ships kubectl + kubelogin; only download them when
          # missing, into a user-writable dir, and retry (dl.k8s.io / github.com
          # time out now and then — that must not fail the whole deploy).
          if ! command -v kubectl >/dev/null || ! command -v kubelogin >/dev/null; then
            mkdir -p "$HOME/.local/bin"; export PATH="$HOME/.local/bin:$PATH"
            for attempt in 1 2 3; do
              az aks install-cli --install-location "$HOME/.local/bin/kubectl" \
                                 --kubelogin-install-location "$HOME/.local/bin/kubelogin" && break
              echo "az aks install-cli attempt ${attempt} failed — retrying in 15s"; sleep 15
            done
          fi
          kubectl version --client=true
          kubelogin --version
          kubelogin convert-kubeconfig -l azurecli

          IMG="$ACR_LOGIN_SERVER/$IMAGE_NAME:$TAG"

          kubectl apply -f deploy/aks/k8s/namespace.yaml
          kubectl apply -f deploy/aks/k8s/mssql.yaml
          kubectl -n "$K8S_NAMESPACE" rollout status deployment/mssql --timeout=300s

          # Substitute the built image into the app manifest, then apply.
          sed "s|__IMAGE__|${IMG}|g" deploy/aks/k8s/app.yaml | kubectl apply -f -
          kubectl -n "$K8S_NAMESPACE" rollout status "deployment/${SERVICE_NAME}" --timeout=420s

          # The deliverable of this job is a URL the operator can open. The
          # LoadBalancer IP is assigned asynchronously (often 1-2 min after the
          # rollout), so wait for it instead of printing an empty string.
          IP=""
          for attempt in {1..24}; do
            IP=$(kubectl -n "$K8S_NAMESPACE" get svc "$SERVICE_NAME" \
              -o jsonpath='{.status.loadBalancer.ingress[0].ip}' 2>/dev/null || true)
            [ -n "$IP" ] && break
            echo "waiting for the LoadBalancer public IP (${attempt}/24)..."
            sleep 10
          done
          if [ -z "$IP" ]; then
            echo "::warning::Deployment is healthy but the LoadBalancer IP is still pending — check: kubectl -n ${K8S_NAMESPACE} get svc ${SERVICE_NAME}"
            exit 0
          fi
          URL="http://${IP}"
          HTTP=$(curl -s -o /dev/null -w '%{http_code}' --max-time 20 "$URL" || echo "000")
          echo ""
          echo "=================================================================="
          echo "  Storefront URL : ${URL}   (HTTP ${HTTP})"
          echo "  Image          : ${IMG}"
          echo "  Namespace      : ${K8S_NAMESPACE}   Cluster: ${AKS_NAME}"
          echo "=================================================================="
          # Surface it outside the log too: the run's Summary tab + a job output.
          {
            echo "## ${SERVICE_NAME} is live"
            echo ""
            echo "| | |"
            echo "|---|---|"
            echo "| **Storefront URL** | ${URL} (HTTP ${HTTP}) |"
            echo "| **Image** | \`${IMG}\` |"
            echo "| **Cluster / namespace** | \`${AKS_NAME}\` / \`${K8S_NAMESPACE}\` |"
          } >> "$GITHUB_STEP_SUMMARY"
          echo "storefront_url=${URL}" >> "$GITHUB_OUTPUT"
```
