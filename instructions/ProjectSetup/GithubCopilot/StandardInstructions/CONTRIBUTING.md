# Contributing to [PROJECT_NAME]

Thank you for contributing to [PROJECT_NAME]. This guide explains how to set up the project, make changes, and submit them for review.

## Before You Start

- Read the project documentation and applicable instructions under `.github/`.
- Search existing issues and pull requests before opening a new one.
- For significant changes, open an issue or discussion first to confirm the approach.
- Do not include credentials, tokens, secrets, or confidential data in commits or issues.

## Development Setup

### Prerequisites

Install the tools required by the project:

- [Runtime and version]
- [Package manager]
- [Database or service dependencies]
- [Other required tools]

### Installation

```bash
# Clone the repository
git clone [REPOSITORY_URL]
cd [PROJECT_DIRECTORY]

# Install dependencies
[INSTALL_COMMAND]

# Configure local settings
cp [ENVIRONMENT_TEMPLATE] [ENVIRONMENT_FILE]

# Start the application
[START_COMMAND]
```

Keep local configuration and secrets out of source control.

## Branching and Commits

- Create branches from the default branch.
- Use a short, descriptive branch name, for example:
  - `feature/add-search-filter`
  - `fix/handle-expired-session`
  - `docs/update-setup-guide`
- Keep commits focused and related to one change.
- Use clear commit messages, for example:
  - `feat: add search filter`
  - `fix: handle expired session`
  - `docs: update setup guide`
- Do not commit generated files, local settings, build output, or secrets unless explicitly required.

## Code and Documentation Standards

Follow the project instructions for:

- Code style and architecture
- API design
- Data modeling
- Security
- Testing
- Deployment
- Documentation

Prefer small, readable changes that match existing patterns. Update documentation when behavior, setup, or public interfaces change.

## Testing Requirements

Before opening a pull request:

1. Add or update tests for the change.
2. Run the relevant unit, integration, API, UI, and security checks.
3. Run formatting, linting, and type checks where applicable.
4. Confirm that existing tests still pass.
5. Record any known limitations or untested areas.

Use the project's documented commands, for example:

```bash
[FORMAT_COMMAND]
[LINT_COMMAND]
[TYPECHECK_COMMAND]
[TEST_COMMAND]
```

Do not weaken or remove tests only to make a build pass. Test data must not contain real sensitive information.

## Pull Requests

A pull request should:

- Explain what changed and why.
- Reference the related issue, requirement, or user story.
- Describe testing performed and its results.
- Include screenshots or logs for user-visible changes when useful.
- Call out migrations, configuration changes, breaking changes, risks, and follow-up work.
- Keep the scope focused and avoid unrelated refactoring.

Use this checklist:

- [ ] The change follows project coding and security standards.
- [ ] Tests were added or updated.
- [ ] Relevant checks pass locally.
- [ ] Documentation was updated where needed.
- [ ] No secrets or sensitive data are included.
- [ ] Review feedback has been addressed.

Maintainers may request changes, additional tests, or clarification before merging.

## Issue Reports

When reporting a bug, include:

- A clear summary
- Environment and version information
- Preconditions
- Steps to reproduce
- Expected behavior
- Actual behavior
- Logs, screenshots, or other evidence
- Severity and business impact, when known

Do not include sensitive data in issue reports.

## Security Reports

Do not disclose security vulnerabilities in public issues. Report them through [SECURITY_CONTACT_OR_PROCESS]. Include only the information needed to reproduce and assess the issue.

## Code of Conduct

Contributors must follow [CODE_OF_CONDUCT_LINK] and communicate respectfully. Harassment, discrimination, and abusive behavior are not acceptable.

## License

By contributing, you agree that your contributions are provided under [LICENSE_NAME].
