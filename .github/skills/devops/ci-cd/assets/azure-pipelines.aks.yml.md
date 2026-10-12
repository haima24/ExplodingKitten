# `azure-pipelines.aks.yml` — deploy-kit file

The Build → Security → Deploy pipeline: ACR image build, gated scans (SCA, gitleaks, Trivy, checkov), AKS deploy via kubelogin.

**Templated.** `__SERVICE__` → the service slug at materialization (ci-cd Step 0); the four `<infra-state: …>` placeholders → `infra-state.json` (Step 1). One SimplCommerce-specific line remains: the SCA step's `dotnet restore SimplCommerce.sln` — change it for another app (see [docs/BRING-YOUR-OWN-SERVICE.md](../../../../../docs/BRING-YOUR-OWN-SERVICE.md)).

The **`securityScan` runtime parameter** picks the posture per run — `gate` (scans block Deploy, the production posture), `report` (findings logged as warnings, the demo default), or `skip` (no Security stage at all: Build → Deploy). `skip` is for demo/dev only, must be declared in the approved plan, and stamps a warning into the run.

Write the block below, verbatim, to `azure-pipelines.aks.yml` in the target repo (demo: `ci/azure-pipelines.aks.yml`):

```yaml
# SimplCommerce → AKS deploy pipeline (build image in ACR, deploy to AKS).
# This is the deploy pipeline the repo's original azure-pipelines.yml (build+test only)
# lacked. Wire the variables to the infra from `/rnd-devops infrastructure` and the
# service connection from `/rnd-devops service-connection`.
parameters:
  # Security posture for THIS run. Choose it up front (and record it in the plan) —
  # this is a declared choice, not a way to turn a red build green after the fact.
  #   gate   → scans BLOCK Deploy (production posture)
  #   report → findings logged as warnings, Deploy proceeds (demo default)
  #   skip   → Security stage is not generated at all: Build → Deploy
  - name: securityScan
    displayName: "Security scans"
    type: string
    default: report
    values: [gate, report, skip]

trigger:
  branches:
    include: [main, master]
  paths:
    include:
      - src/*
      - deploy/aks/*
      - azure-pipelines.aks.yml

variables:
  # The four infra values are PLACEHOLDERS — every stack carries a random name
  # suffix (rnd-dev-<suffix>-rg, rnddev<suffix>acr, ...), so there is no valid
  # default. Fill them from .rnd-devops/infra-state.json (ci-cd Step 1).
  serviceConnection: "rnd-dev-azure" # ADO ARM service connection (/rnd-devops service-connection → infra-state .service_connection.name)
  acrName: "<infra-state: acr_name>" # e.g. rnddevx7k2acr
  acrLoginServer: "<infra-state: acr_login_server>" # e.g. rnddevx7k2acr.azurecr.io
  aksResourceGroup: "<infra-state: resource_group>" # e.g. rnd-dev-x7k2-rg
  aksName: "<infra-state: aks_name>" # e.g. rnd-dev-x7k2-aks
  # __SERVICE__ is replaced with the service slug when the kit is materialized
  # (ci-cd Step 0). namespace == image == service name is the contract the
  # alert rules rely on (they filter by namespace).
  serviceName: "__SERVICE__"
  k8sNamespace: "__SERVICE__"
  imageName: "__SERVICE__"
  tag: "$(Build.BuildId)"

stages:
  - stage: Build
    displayName: Build & push image (ACR)
    jobs:
      - job: acr_build
        pool: { vmImage: "ubuntu-latest" }
        steps:
          # `az acr build` builds inside ACR — no docker daemon needed on the agent,
          # and it authenticates through the ARM service connection.
          - task: AzureCLI@2
            displayName: az acr build
            inputs:
              azureSubscription: "$(serviceConnection)"
              scriptType: bash
              scriptLocation: inlineScript
              inlineScript: |
                set -euo pipefail
                az acr build \
                  --registry "$(acrName)" \
                  --image "$(imageName):$(tag)" \
                  --image "$(imageName):latest" \
                  -f deploy/aks/Dockerfile .

  # Generated only when securityScan != skip.
  - ${{ if ne(parameters.securityScan, 'skip') }}:
      - stage: Security
        displayName: Security scans (gate Deploy)
        dependsOn: Build
        variables:
          ${{ if eq(parameters.securityScan, 'gate') }}:
            blockOnFindings: "true"
            trivyExitCode: "1"
            checkovSoftFail: ""
          ${{ if eq(parameters.securityScan, 'report') }}:
            blockOnFindings: "false"
            trivyExitCode: "0"
            checkovSoftFail: "--soft-fail"
        jobs:
          - job: scan
            pool: { vmImage: "ubuntu-latest" }
            steps:
              # 1) SCA — vulnerable NuGet packages. Blocks when securityScan=gate,
              #    warns when =report. (This gate already proved itself: it caught
              #    8+ High-severity transitive CVEs.)
              - task: UseDotNet@2
                inputs: { packageType: sdk, version: "8.0.x" }
              - script: |
                  set -euo pipefail
                  dotnet restore SimplCommerce.sln
                  dotnet list package --vulnerable --include-transitive 2>&1 | tee vuln.txt
                  if grep -Eiq 'Critical|High' vuln.txt; then
                    if [ "$(blockOnFindings)" = "true" ]; then
                      echo "##vso[task.logissue type=error]High/Critical vulnerable dependencies found — see log."
                      exit 1
                    fi
                    echo "##vso[task.logissue type=warning]High/Critical vulnerable dependencies found — see log (report-only)."
                  else
                    echo "No High/Critical vulnerable dependencies."
                  fi
                displayName: "SCA — dotnet vulnerable packages"

              # 2) Secret scan — gitleaks. Upstream SimplCommerce sample OAuth keys are
              #    allowlisted in .gitleaks.toml. Blocks when securityScan=gate.
              - script: |
                  docker run --rm -v "$(Build.SourcesDirectory):/repo" zricethezav/gitleaks:latest \
                    detect --source=/repo --no-git --config=/repo/.gitleaks.toml --redact -v \
                    || { if [ "$(blockOnFindings)" = "true" ]; then echo "##vso[task.logissue type=error]gitleaks findings — see log."; exit 1; fi; echo "##vso[task.logissue type=warning]gitleaks findings — see log (report-only)."; }
                displayName: "Secret scan — gitleaks"

              # 3) IaC scan — checkov on the k8s manifests + Dockerfile. --soft-fail is
              #    dropped when securityScan=gate (a fresh manifest set trips many baseline rules).
              - script: |
                  docker run --rm -v "$(Build.SourcesDirectory):/src" bridgecrew/checkov:latest \
                    -d /src/deploy/aks --framework kubernetes dockerfile $(checkovSoftFail) --compact
                displayName: "IaC scan — checkov (deploy/aks)"

              # 4) Container image scan — Trivy. --exit-code follows the posture: 1 when
              #    securityScan=gate (blocks on FIXABLE High/Critical), 0 when =report.
              - task: AzureCLI@2
                displayName: "Image scan — Trivy"
                inputs:
                  azureSubscription: "$(serviceConnection)"
                  scriptType: bash
                  scriptLocation: inlineScript
                  inlineScript: |
                    set -euo pipefail
                    az acr login -n "$(acrName)"
                    mkdir -p bin
                    curl -sfL https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/install.sh | sh -s -- -b ./bin
                    ./bin/trivy image --severity HIGH,CRITICAL --ignore-unfixed --exit-code $(trivyExitCode) \
                      "$(acrLoginServer)/$(imageName):$(tag)"

  - stage: Deploy
    displayName: Deploy to AKS
    # With securityScan=skip there is no Security stage to depend on.
    ${{ if eq(parameters.securityScan, 'skip') }}:
      dependsOn: Build
    ${{ else }}:
      dependsOn: Security
    jobs:
      # Plain job (not a deployment job) — this org restricts creating ADO
      # Environments. For deployment history/approvals, switch to
      # `- deployment: deploy` + `environment: <name>` once you can create one.
      - job: deploy
        pool: { vmImage: "ubuntu-latest" }
        steps:
          - ${{ if eq(parameters.securityScan, 'skip') }}:
              - script: |
                  echo "##vso[task.logissue type=warning]Security scans were SKIPPED for this run (securityScan=skip). Demo/dev only — never for a shared or production deploy."
                displayName: "Security scans skipped (declared)"
          - task: AzureCLI@2
            displayName: kubectl apply
            inputs:
              azureSubscription: "$(serviceConnection)"
              scriptType: bash
              scriptLocation: inlineScript
              inlineScript: |
                set -euo pipefail
                az aks get-credentials -g "$(aksResourceGroup)" -n "$(aksName)" --overwrite-existing
                # Cluster has AAD + local accounts disabled → convert kubeconfig to
                # non-interactive SP auth using the AzureCLI task's identity.
                # ubuntu-latest already ships kubectl + kubelogin. Only download them
                # when missing (self-hosted agents), and retry: `az aks install-cli`
                # pulls from dl.k8s.io + github.com, which time out from hosted agents
                # now and then ("Connection error while attempting to download client
                # ... [Errno 110]") and would fail the whole deploy for nothing.
                if ! command -v kubectl >/dev/null || ! command -v kubelogin >/dev/null; then
                  for attempt in 1 2 3; do
                    az aks install-cli && break
                    echo "az aks install-cli attempt ${attempt} failed — retrying in 15s"
                    sleep 15
                  done
                fi
                kubectl version --client=true
                kubelogin --version
                kubelogin convert-kubeconfig -l azurecli

                IMG="$(acrLoginServer)/$(imageName):$(tag)"

                kubectl apply -f deploy/aks/k8s/namespace.yaml
                kubectl apply -f deploy/aks/k8s/mssql.yaml
                kubectl -n "$(k8sNamespace)" rollout status deployment/mssql --timeout=300s

                # Substitute the built image into the app manifest, then apply.
                sed "s|__IMAGE__|${IMG}|g" deploy/aks/k8s/app.yaml | kubectl apply -f -
                SVC="$(serviceName)"
                kubectl -n "$(k8sNamespace)" rollout status "deployment/${SVC}" --timeout=420s

                # The deliverable of this stage is a URL the operator can open. The
                # LoadBalancer IP is assigned asynchronously (often 1-2 min after the
                # rollout), so wait for it instead of printing an empty string.
                # Pipeline macros ($(name)) are expanded by the agent BEFORE bash runs.
                # Copy them into shell variables first so no macro ever sits inside a
                # shell $(...) substitution — nesting the two is a classic footgun.
                NS="$(k8sNamespace)"
                AKS="$(aksName)"
                SUMMARY="$(Agent.TempDirectory)/deploy-summary.md"
                IP=""
                for attempt in {1..24}; do
                  IP=$(kubectl -n "$NS" get svc "$SVC" \
                    -o jsonpath='{.status.loadBalancer.ingress[0].ip}' 2>/dev/null || true)
                  [ -n "$IP" ] && break
                  echo "waiting for the LoadBalancer public IP (${attempt}/24)..."
                  sleep 10
                done
                if [ -z "$IP" ]; then
                  echo "##vso[task.logissue type=warning]Deployment is healthy but the LoadBalancer IP is still pending — check: kubectl -n ${NS} get svc ${SVC}"
                  exit 0
                fi
                URL="http://${IP}"
                HTTP=$(curl -s -o /dev/null -w '%{http_code}' --max-time 20 "$URL" || echo "000")
                echo ""
                echo "=================================================================="
                echo "  Storefront URL : ${URL}   (HTTP ${HTTP})"
                echo "  Image          : ${IMG}"
                echo "  Namespace      : ${NS}   Cluster: ${AKS}"
                echo "=================================================================="
                # Surface it outside the log too: run Summary tab + output variable.
                {
                  echo "## ${SVC} is live"
                  echo ""
                  echo "| | |"
                  echo "|---|---|"
                  echo "| **Storefront URL** | ${URL} (HTTP ${HTTP}) |"
                  echo "| **Image** | \`${IMG}\` |"
                  echo "| **Cluster / namespace** | \`${AKS}\` / \`${NS}\` |"
                } > "$SUMMARY"
                echo "##vso[task.uploadsummary]${SUMMARY}"
                echo "##vso[task.setvariable variable=storefrontUrl;isOutput=true]${URL}"
                echo "##vso[build.addbuildtag]url-${IP}"
```
