---
name: sonarqube-cli
description: SonarQube CLI is a command-line tool for interacting with SonarQube, allowing you to list resources, analyze code, and verify issues.
allowed-tools: Bash(sonar:*)
model: gpt-5.4
---

# SonarQube CLI Skill

Purpose: provide fast, reliable SonarQube lookups and focused file analysis.

## When to use

- Find issues for a Sonar project, branch, or pull request.
- Discover available projects when project key is unknown.
- Scan files for hardcoded secrets.
- Verify or run Quality Assessment and Assurance (SQAA) analysis for a single file.

## Tool constraints

- Allowed tool scope: Bash commands matching sonar:\* only.
- Prefer structured outputs suitable for downstream parsing.
- Keep requests narrow (project, branch, severity, file) to reduce noise.

## Command selection guide

- Need project quality issues: use sonar list issues.
- Need to find project key/name: use sonar list projects.
- Need secret scan in local content: use sonar analyze secrets.
- Need SonarCloud SQAA for a file: use sonar analyze sqaa.
- Need file-level verification: use sonar verify.

## Command reference

### sonar list issues

Search issues in a SonarQube project.

Options:

| Option         | Type   | Required | Description                        | Default |
| -------------- | ------ | -------- | ---------------------------------- | ------- |
| --project, -p  | string | Yes      | Sonar project key                  | -       |
| --severity     | string | No       | Severity filter                    | -       |
| --format       | string | No       | Output format (prefer toon for AI) | json    |
| --branch       | string | No       | Branch name                        | -       |
| --pull-request | string | No       | Pull request ID                    | -       |
| --page-size    | number | No       | Page size, 1-500                   | 500     |
| --page         | number | No       | Page number                        | 1       |

Examples:

```bash
sonar list issues -p org-id_project-name
sonar list issues -p org-id_project-name --severity CRITICAL --format toon
sonar list issues -p org-id_project-name --branch main --page-size 100 --page 1
```

### sonar list projects

List/search accessible projects.

Options:

| Option      | Type   | Required | Description          | Default |
| ----------- | ------ | -------- | -------------------- | ------- |
| --query, -q | string | No       | Match by name or key | -       |
| --page      | number | No       | Page number          | 1       |
| --page-size | number | No       | Page size, 1-500     | 500     |

Examples:

```bash
sonar list projects
sonar list projects -q data-fusion
sonar list projects --page 2 --page-size 50
```

### sonar analyze secrets

Scan files or stdin for hardcoded secrets.

Options:

| Option  | Type    | Required | Description     | Default |
| ------- | ------- | -------- | --------------- | ------- |
| --stdin | boolean | No       | Read from stdin | false   |

Examples:

```bash
sonar analyze secrets src/config.ts
sonar analyze secrets src/file1.ts src/file2.ts
cat .env | sonar analyze secrets --stdin
```

### sonar analyze sqaa

Run SQAA server-side analysis on a single file (SonarQube Cloud only).

Options:

| Option    | Type   | Required | Description                     | Default       |
| --------- | ------ | -------- | ------------------------------- | ------------- |
| --file    | string | Yes      | File path to analyze            | -             |
| --branch  | string | No       | Analysis branch                 | -             |
| --project | string | No       | SonarCloud project key override | auto-detected |

Example:

```bash
sonar analyze sqaa --file ProjectDirectory/File.cs --branch main
```

### sonar verify

Analyze a single file for issues.

Options:

| Option    | Type   | Required | Description                     | Default       |
| --------- | ------ | -------- | ------------------------------- | ------------- |
| --file    | string | Yes      | File path to analyze            | -             |
| --branch  | string | No       | Analysis branch                 | -             |
| --project | string | No       | SonarCloud project key override | auto-detected |

Example:

```bash
sonar verify --file ProjectDirectory/File.cs --branch main
```

## AI execution pattern

1. Identify target scope: project, branch/PR, and severity or file path.
2. Run the smallest command that answers the user question.
3. If no project key is given, run sonar list projects first.
4. Prefer format toon for issue listing when output will be post-processed.
5. Return concise findings: count, highest severity, top impacted files, suggested next step.

## Failure handling

- If command fails due to missing project key, search projects and retry with best match.
- If branch or PR has no data, fallback to default branch and state fallback explicitly.
- If analysis is unsupported (for example SQAA unavailable), switch to sonar verify or sonar list issues.

## Output expectations for agents

- Keep summaries brief and actionable.
- Include exact command run.
- Report only relevant fields, avoid dumping unfiltered raw output unless requested.
