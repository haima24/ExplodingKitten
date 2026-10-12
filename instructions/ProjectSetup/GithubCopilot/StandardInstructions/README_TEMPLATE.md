# GitHub Instructions - Standard Documentation Templates

> Comprehensive GitHub documentation templates for professional software projects

## Overview

This directory contains **standardized, reusable GitHub documentation templates** designed to help you create professional, well-structured documentation for your repositories. These templates are adapted from Cursor Rules to work seamlessly with GitHub repositories.

## What's Included

| File | Description | Use When |
|------|-------------|----------|
| **[HOW_TO_USE.md](HOW_TO_USE.md)** | Complete setup guide | Setting up documentation for a new repository |
| **[CONTRIBUTING_TEMPLATE.md](CONTRIBUTING.md)** | Contribution guidelines | Accepting contributions from others |
| **[PROJECT_GUIDE_TEMPLATE.md](PROJECT_GUIDE.md)** | Comprehensive project documentation | Onboarding new developers |
| **[implementation-core.md](implementation-core.md)** | Core coding standards and patterns | Establishing code quality guidelines |
| **[api-design.md](api-design.md)** | REST API design standards | Building or documenting APIs |
| **[unit-testing.md](unit-testing.md)** | Testing patterns and best practices | Defining testing standards |
| **[security.md](security.md)** | Security best practices | Implementing security measures |
| **[data-modeling.md](data-modeling.md)** | Database design patterns | Working with databases |
| **[deployment.md](deployment.md)** | Deployment and DevOps guidelines | Setting up CI/CD and deployments |
| **[design-notes.md](design-notes.md)** | ADR templates and design docs | Documenting architectural decisions |

## Quick Start

### 1. Copy Files to Your Repository

```bash
# From your repository root
mkdir -p instructions

# Copy core documentation
cp StandardInstructions/CONTRIBUTING_TEMPLATE.md ./CONTRIBUTING.md
cp StandardInstructions/PROJECT_GUIDE_TEMPLATE.md ./instructions/PROJECT_GUIDE.md

# Copy development guides
cp StandardInstructions/implementation-core.md ./instructions/
cp StandardInstructions/api-design.md ./instructions/
cp StandardInstructions/unit-testing.md ./instructions/
cp StandardInstructions/security.md ./instructions/
cp StandardInstructions/data-modeling.md ./instructions/
cp StandardInstructions/deployment.md ./instructions/
cp StandardInstructions/design-notes.md ./instructions/
```

### 2. Customize for Your Project

Replace placeholders in each file:
- `[PROJECT_NAME]` → Your project name
- `[OWNER]` → Repository owner
- `[install-command]` → Your installation command (e.g., `npm install`, `pip install -r requirements.txt`)
- `[test-command]` → Your test command (e.g., `npm test`, `pytest`)
- Technology stack references → Your actual stack
- Example code → Code matching your language/framework

### 3. Link Documentation in README

Add to your main `README.md`:

```markdown
## Documentation

- **[Contributing Guide](./CONTRIBUTING.md)** - How to contribute to this project
- **[Project Guide](./.github/PROJECT_GUIDE.md)** - Comprehensive project documentation
- **[Coding Standards](./.github/instructions/implementation-core.md)** - Code style and best practices
- **[API Guidelines](./.github/instructions/api-design.md)** - API design and documentation
- **[Testing Guide](./.github/instructions/unit-testing.md)** - Testing standards and patterns
- **[Security Guidelines](./.github/instructions/security.md)** - Security best practices
- **[Data Modeling](./.github/instructions/data-modeling.md)** - Database design patterns
- **[Deployment Guide](./.github/instructions/deployment.md)** - Deployment procedures
- **[Architecture Decisions](./.github/instructions/design-notes.md)** - ADRs and design docs
```

## Documentation Templates Guide

### Core Documentation

#### CONTRIBUTING_TEMPLATE.md
**Purpose**: Guide contributors through the process of contributing to your project

**Includes**:
- Setup instructions
- Development workflow
- Coding standards reference
- Commit message guidelines
- PR process
- Testing requirements

**Place in**: Repository root (`./CONTRIBUTING.md`)

#### PROJECT_GUIDE_TEMPLATE.md
**Purpose**: Comprehensive developer documentation

**Includes**:
- Project overview and architecture
- Technology stack details
- Project structure explanation
- Common development tasks
- Code patterns and examples
- Configuration guide
- Troubleshooting

**Place in**: `./.github/instructions/PROJECT_GUIDE.md`

### Development Guides

#### implementation-core.md
**Purpose**: Define code quality standards and implementation patterns

**Includes**:
- Code organization standards
- Naming conventions
- Error handling patterns
- Logging guidelines
- Performance considerations
- Security basics
- Anti-patterns to avoid

**Use for**: Establishing team coding standards, code reviews

#### api-design.md
**Purpose**: REST API design and documentation standards

**Includes**:
- RESTful design principles
- URL structure conventions
- HTTP methods and status codes
- Request/response formats
- Error handling
- Versioning strategies
- API documentation standards

**Use for**: API development, API documentation, consistency

#### unit-testing.md
**Purpose**: Testing standards and patterns

**Includes**:
- Test organization
- Unit testing patterns
- Integration testing
- E2E testing
- Test naming conventions
- Mocking strategies
- Coverage requirements

**Use for**: Establishing testing practices, improving test quality

#### security.md
**Purpose**: Security best practices and implementation

**Includes**:
- Input validation and sanitization
- Authentication and authorization
- Data protection
- Common vulnerabilities (XSS, CSRF, SQL Injection)
- Security headers
- Secure logging
- Security checklist

**Use for**: Security reviews, implementing security features

#### data-modeling.md
**Purpose**: Database design patterns and best practices

**Includes**:
- Entity/model design
- Schema design
- Relationship patterns
- Indexing strategies
- Query optimization
- Migration management
- Performance best practices

**Use for**: Database design, schema changes, query optimization

#### deployment.md
**Purpose**: Deployment and DevOps practices

**Includes**:
- Containerization (Docker)
- CI/CD pipeline configuration
- Environment management
- Deployment strategies
- Monitoring and logging
- Backup and recovery
- Incident response

**Use for**: Setting up deployments, DevOps practices

#### design-notes.md
**Purpose**: Document architectural decisions and design notes

**Includes**:
- ADR template
- API design documentation template
- Data model documentation
- Service design documentation
- Design review checklist

**Use for**: Recording architectural decisions, design documentation

## Customization Tips

### For Different Project Types

**Web Application**:
- Keep all guides
- Emphasize API_GUIDELINES and SECURITY_GUIDELINES
- Add frontend-specific patterns to CODING_STANDARDS

**Backend API**:
- Focus on API_GUIDELINES, DATA_MODELING_GUIDE
- Emphasize SECURITY_GUIDELINES
- May skip some frontend-related content

**Library/Package**:
- Focus on CODING_STANDARDS, TESTING_GUIDE
- Add API documentation for public interfaces
- Include usage examples in PROJECT_GUIDE

**CLI Tool**:
- Focus on CODING_STANDARDS, TESTING_GUIDE
- Add command documentation to PROJECT_GUIDE
- May skip API_GUIDELINES

### For Different Languages/Frameworks

**JavaScript/TypeScript (Node.js)**:
- Update code examples to JS/TS syntax
- Reference npm, Jest, ESLint
- Update package.json references

**Python**:
- Update code examples to Python syntax
- Reference pip, pytest, pylint
- Update requirements.txt references

**Java/C#**:
- Update code examples to Java/C# syntax
- Reference Maven/Gradle or NuGet
- Update build tool references

**Go**:
- Update code examples to Go syntax
- Reference go modules, go test
- Update Go-specific tooling

## GitHub-Specific Features

### Pull Request Templates

Create `.github/PULL_REQUEST_TEMPLATE.md`:

```markdown
## Description
[Describe your changes]

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Checklist
- [ ] I have read the [CONTRIBUTING](../CONTRIBUTING.md) guide
- [ ] My code follows the [coding standards](./.github/instructions/implementation-core.md)
- [ ] I have added tests that prove my fix/feature works
- [ ] All tests pass locally
- [ ] I have updated the documentation accordingly
```

### Issue Templates

Create `.github/ISSUE_TEMPLATE/bug_report.md`:

```markdown
---
name: Bug Report
about: Create a report to help us improve
title: '[BUG] '
labels: bug
assignees: ''
---

## Bug Description
[Clear description of the bug]

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. See error

## Expected Behavior
[What you expected to happen]

## Actual Behavior
[What actually happened]

## Environment
- OS: [e.g., Windows 11]
- Version: [e.g., 1.2.3]
```

## Best Practices

### Documentation Maintenance

1. **Keep Documentation Updated**
   - Update docs with code changes
   - Review documentation in PRs
   - Schedule regular documentation reviews

2. **Make Documentation Discoverable**
   - Link from README.md
   - Reference in code comments
   - Include in onboarding

3. **Use Consistent Formatting**
   - Follow Markdown best practices
   - Use clear headers
   - Include code examples
   - Add tables for quick reference

4. **Version Your Documentation**
   - Tag documentation with releases
   - Document breaking changes
   - Maintain migration guides

## Integration with CI/CD

### Documentation Linting

```yaml
# .github/workflows/docs-check.yml
name: Documentation Check
on: [pull_request]
jobs:
  lint-docs:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Lint Markdown
        uses: nosborn/github-action-markdown-cli@v3.2.0
        with:
          files: "**/*.md"
```

## Relationship to Cursor Rules

These GitHub instructions are derived from the StandardsRules (Cursor Rules) but optimized for GitHub repositories:

| Cursor Rules (`.cursor/rules/`) | GitHub Instructions (`instructions/`) |
|----------------------------------|-------------------------------|
| `.mdc` files for AI context | `.md` files for human readers |
| Concise, AI-focused | Detailed, developer-focused |
| Tool-specific instructions | Platform-agnostic guidelines |
| Used by Cursor AI | Used by all developers |

**Use Both**:
- **Cursor Rules**: For AI-assisted development in Cursor
- **GitHub Instructions**: For human developers and repository documentation

## Support and Contributions

### Getting Help

If you need help customizing these templates:
1. Review the HOW_TO_USE.md guide
2. Check the original Cursor Rules in StandardsRules/
3. Consult with your team's technical writer

### Contributing

To improve these templates:
1. Fork the repository
2. Make your improvements
3. Submit a pull request
4. Describe how your changes help

## License

These templates are provided as-is for use in your projects. Customize freely to match your needs.

## Additional Resources

- [GitHub Docs on Documentation](https://docs.github.com/en/communities)
- [Write the Docs](https://www.writethedocs.org/)
- [Markdown Guide](https://www.markdownguide.org/)
- [Technical Writing Guidelines](https://developers.google.com/tech-writing)
- [Architecture Decision Records](https://adr.github.io/)

---

**Remember**: Good documentation is an investment in your project's success. It helps onboard new developers, reduces support burden, and ensures knowledge continuity.


