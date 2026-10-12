# [PROJECT_NAME] Project Guide

This guide helps developers understand, set up, develop, test, and operate [PROJECT_NAME]. Replace bracketed placeholders with project-specific information.

## 1. Project Overview

### Purpose

[Describe the problem the project solves and its primary users.]

### Goals

- [Business or product goal]
- [Technical or operational goal]
- [Quality, security, or compliance goal]

### Scope

**In scope:**

- [Capability or module]
- [Capability or module]

**Out of scope:**

- [Excluded capability]
- [Excluded integration]

## 2. Technology Stack

| Area | Technology | Version | Notes |
| --- | --- | --- | --- |
| Language | [Language] | [Version] | [Purpose] |
| Framework | [Framework] | [Version] | [Purpose] |
| Database | [Database] | [Version] | [Purpose] |
| Frontend | [Technology] | [Version] | [Purpose] |
| Testing | [Framework] | [Version] | [Test levels] |
| Deployment | [Platform] | [Version] | [Environment] |

## 3. Architecture

### Overview

[Describe the architecture style, major components, and how data moves through the system.]

```text
[Client]
   |
[API or Gateway]
   |
[Application Services] --- [External Services]
   |
[Database]
```

### Major Components

| Component | Responsibility | Key Dependencies |
| --- | --- | --- |
| [Component] | [Responsibility] | [Dependencies] |
| [Component] | [Responsibility] | [Dependencies] |

### Important Design Decisions

See [design-notes.md](design-notes.md) for architecture decision records.

## 4. Repository Structure

```text
MyApp/
│
├── .github/
│   ├── copilot-instructions.md
│   │
│   ├── instructions/
│   │   ├── api-design.md
│   │   ├── data-modeling.md
│   │   ├── implementation-core.md
│   │   ├── coding-standards.md
│   │   ├── security.md
│   │   ├── accessibility.md
│   │   ├── unit-testing.md
│   │   └── testing.md
│   │
│   └── agents/
│       ├── ba.agent.md
│       ├── dev.agent.md
│       └── test.agent.md
│
├── skills/
│   ├── requirement-analysis/
│   │   ├── SKILL.md
│   │   └── references/
│   ├── user-story-generation/
│   │   ├── SKILL.md
│   │   └── references/
│   ├── traceability-matrix/
│   │   ├── SKILL.md
│   │   └── references/
│   ├── test-design/
│   │   ├── SKILL.md
│   │   └── references/
│   ├── generate-test-code/
│   │   ├── SKILL.md
│   │   └── references/
│   ├── accessibility-testing/
│   │   ├── SKILL.md
│   │   └── references/
│   ├── security-testing/
│   │   ├── SKILL.md
│   │   └── references/
│   └── code-review/
│       ├── SKILL.md
│       └── references/
│
├── working-artifacts/
│   ├── requirements/
│   │   ├── product-brief.md
│   │   ├── business-requirements.md
│   │   ├── scope.md
│   │   └── user-stories/
│   │       ├── epic-01-user-management/
│   │       └── epic-02-order-management/
│   ├── architecture/
│   │   ├── solution-architecture.md
│   │   ├── system-architecture.md
│   │   ├── deployment-architecture.md
│   │   ├── database-design.md
│   │   ├── api-specification.md
│   │   └── sequence-diagrams.md
│   ├── development/
│   │   ├── coding-guidelines.md
│   │   ├── branching-strategy.md
│   │   ├── pull-request-guidelines.md
│   │   └── development-standards.md
│   └── testing/
│       ├── test-strategy.md
│       ├── test-cases/
│       │   ├── test-cases-001-login.md
│       │   └── test-cases-002-manage-user.md
│       ├── test-results/
│       │   ├── test-result-001-login-20260911-010101.md
│       │   └── test-result-002-manage-user-20260911-010103.md
│       └── test-status/
│
├── workspace/
│   ├── .env
│   ├── .env.example
│   ├── src/
│   │   └── MyApp/
│   │       ├── Controllers/
│   │       ├── Services/
│   │       ├── Repositories/
│   │       ├── Models/
│   │       ├── DTOs/
│   │       ├── Validators/
│   │       ├── Configuration/
│   │       ├── Helpers/
│   │       └── Shared/
│   ├── testing/
│   │   ├── non-functional-test/
│   │   │   ├── PerformanceTests/
│   │   │   ├── AccessibilityTests/
│   │   │   └── SecurityTests/
│   │   ├── playwright/
│   │   │   ├── tests/
│   │   │   │   ├── smoke/
│   │   │   │   ├── regression/
│   │   │   │   └── e2e/
│   │   │   │   └── API/
│   │   │   ├── pages/
│   │   │   ├── components/
│   │   │   ├── fixtures/
│   │   │   ├── test-data/
│   │   │   ├── utils/
│   │   │   ├── constants/
│   │   │   ├── hooks/
│   │   │   ├── reporters/
│   │   │   ├── screenshots/
│   │   │   ├── videos/
│   │   │   ├── traces/
│   │   │   ├── playwright.config.ts
│   │   │   └── package.json
│   │   └── automation-test-results/
│   └── MyApp.sln
│
├── README.md
├── CHANGELOG.md
├── LICENSE
└── .gitignore
```

Update this tree to match the actual repository. Document important directories and naming conventions here.

## 5. Getting Started

### Prerequisites

Install the following before starting:

- [Runtime and version]
- [Package manager]
- [Database or service dependency]
- [Container or cloud tooling, if required]

### Installation

```bash
git clone [REPOSITORY_URL]
cd [PROJECT_DIRECTORY]
[INSTALL_COMMAND]
```

### Configuration

1. Copy the example configuration:

   ```bash
   cp [ENVIRONMENT_TEMPLATE] [ENVIRONMENT_FILE]
   ```

2. Set the required values:

   | Variable | Required | Description |
   | --- | --- | --- |
   | `[VARIABLE_NAME]` | Yes | [Description] |
   | `[VARIABLE_NAME]` | No | [Description and default] |

3. Never commit credentials, tokens, or environment files containing secrets.

### Run Locally

```bash
[START_COMMAND]
```

The application is available at [LOCAL_URL].

## 6. Development Workflow

1. Review the requirement, acceptance criteria, and related design notes.
2. Create a branch from the default branch.
3. Implement the smallest maintainable change that matches existing patterns.
4. Add or update tests and documentation.
5. Run formatting, linting, type checks, and relevant tests.
6. Open a pull request using the repository template.
7. Address review feedback and confirm all checks pass before merging.

Follow [CONTRIBUTING.md](../../../../CONTRIBUTING.md) for contribution and pull-request rules.

## 7. Common Commands

| Task | Command |
| --- | --- |
| Install dependencies | `[INSTALL_COMMAND]` |
| Start development server | `[START_COMMAND]` |
| Build | `[BUILD_COMMAND]` |
| Format | `[FORMAT_COMMAND]` |
| Lint | `[LINT_COMMAND]` |
| Type check | `[TYPECHECK_COMMAND]` |
| Run unit tests | `[UNIT_TEST_COMMAND]` |
| Run integration tests | `[INTEGRATION_TEST_COMMAND]` |
| Run end-to-end tests | `[E2E_TEST_COMMAND]` |

## 8. Testing

Testing must be traceable to requirements and acceptance criteria. Use the project's testing guidance in [testing.md](../../../../instructions/testing/testing.md) or the project copy under `.github/instructions/`.

At minimum:

- Cover positive, negative, boundary, business-rule, and integration scenarios where applicable.
- Cover all acceptance criteria with the minimum meaningful number of test cases.
- Remove duplicate and orphan test cases.
- Prefer automation for stable, repeatable scenarios; test non-automatable scenarios manually.
- Keep test data controlled and free of real sensitive information.

## 9. API and Data Changes

Before changing a public API or data model:

- Review [api-design.md](api-design.md) and [data-modeling.md](data-modeling.md).
- Document request, response, validation, authorization, and error behavior.
- Assess backward compatibility and migration impact.
- Add or update contract, integration, and regression tests.
- Document required rollout and rollback steps.

## 10. Deployment and Operations

See [deployment.md](deployment.md) for deployment standards.

| Environment | URL | Deployment Method | Owner |
| --- | --- | --- | --- |
| Development | [URL] | [Method] | [Team] |
| Test | [URL] | [Method] | [Team] |
| Production | [URL] | [Method] | [Team] |

Before release, confirm required tests, security checks, migrations, monitoring, backups, and rollback procedures are ready.

## 11. Troubleshooting

### [Common Problem]

**Symptoms:** [What the developer sees]

**Checks:**

1. [Check]
2. [Check]

**Resolution:** [Resolution or escalation path]

### Logs and Diagnostics

- Application logs: [Location or command]
- Test reports: [Location]
- Monitoring dashboard: [URL]
- Incident channel: [Link or team]

Do not include secrets or personal data in logs, screenshots, or support requests.

## 12. Security and Compliance

Follow [security.md](security.md) and the project security policy. Report vulnerabilities through the private process described in `CONTRIBUTING.md`, not through public issues.

Required controls may include:

- Authentication and authorization
- Input validation and secure error handling
- Secret management
- Dependency and vulnerability scanning
- Audit logging and data retention
- Backup and recovery

## 13. Documentation and Ownership

| Area | Owner | Location |
| --- | --- | --- |
| Product requirements | [Team or person] | [Location] |
| Architecture | [Team or person] | [Location] |
| Operations | [Team or person] | [Location] |
| Security | [Team or person] | [Location] |

Update this guide when setup, architecture, commands, interfaces, or operational procedures change.

## 14. Related Documentation

- [Contributing Guide](../../../../CONTRIBUTING.md)
- [Coding Standards](implementation-core.md)
- [API Guidelines](api-design.md)
- [Testing Guidelines](../../../../instructions/testing/testing.md)
- [Security Guidelines](security.md)
- [Data Modeling](data-modeling.md)
- [Deployment Guide](deployment.md)
- [Architecture Decisions](design-notes.md)
