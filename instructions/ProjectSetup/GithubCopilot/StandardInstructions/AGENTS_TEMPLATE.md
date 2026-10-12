# AGENTS.md

## Project Overview

**[PROJECT_NAME]** - [Brief project description: what it does, main purpose]

- **Framework**: [Primary framework and version, e.g., .NET 8, Node.js 20, Python 3.11]
- **Architecture**: [Architecture pattern, e.g., Microservices, Monolith, Clean Architecture]
- **Database**: [Database system, e.g., PostgreSQL, MongoDB, SQL Server]
- **Cloud/Hosting**: [Cloud provider or hosting, e.g., AWS, Azure, GCP, Heroku]
- **Testing**: [Testing frameworks, e.g., Jest, pytest, xUnit]
- **Key Dependencies**: [Major third-party services/libraries]

## Quick Start

```bash
# Navigate to project
cd [path-to-project]

# Setup & run
[install-command]      # e.g., npm install, pip install -r requirements.txt, dotnet restore
[database-setup]       # e.g., npm run db:migrate, python manage.py migrate
[run-command]          # e.g., npm start, python manage.py runserver, dotnet run

# Development with hot reload
[dev-command]          # e.g., npm run dev, dotnet watch run
```

**Access:**
- Application: [URL, e.g., http://localhost:3000]
- API Documentation: [Swagger/OpenAPI URL if applicable]
- Admin Panel: [Admin URL if applicable]
- Health Check: [Health endpoint if applicable]

## Common Commands

### Build & Test
```bash
# Build
[build-command]               # e.g., npm run build, dotnet build
[build-production-command]    # e.g., npm run build:prod, dotnet build -c Release

# Test
[test-command]                # e.g., npm test, pytest, dotnet test
[test-with-coverage]          # e.g., npm test -- --coverage, pytest --cov
[test-filter]                 # e.g., npm test -- --testNamePattern=User, pytest -k "test_user"

# Lint/Format
[lint-command]                # e.g., npm run lint, flake8, dotnet format
[format-command]              # e.g., npm run format, black ., dotnet format
```

### Database Operations
```bash
# Migrations
[create-migration]            # e.g., npm run migration:create, alembic revision, dotnet ef migrations add
[run-migrations]              # e.g., npm run migrate, alembic upgrade head, dotnet ef database update
[rollback-migration]          # e.g., npm run migrate:rollback, alembic downgrade, dotnet ef database update [previous]
[migration-status]            # e.g., npm run migrate:status, alembic current

# Database management
[seed-database]               # e.g., npm run db:seed, python manage.py loaddata
[reset-database]              # e.g., npm run db:reset, python manage.py flush
```

### Deployment
```bash
# Docker
[docker-build]                # e.g., docker build -t myapp .
[docker-run]                  # e.g., docker run -p 3000:3000 myapp
[docker-compose]              # e.g., docker-compose up

# Cloud deployment
[deploy-command]              # e.g., npm run deploy, serverless deploy, kubectl apply
[deployment-status]           # e.g., kubectl get pods, az webapp show
```

### Code Quality
```bash
# Linting
[lint-command]

# Type checking (if applicable)
[type-check-command]          # e.g., tsc --noEmit, mypy .

# Security scanning
[security-scan-command]       # e.g., npm audit, safety check

# Check compilation
[compile-check]
```

## Project Structure

```
[project-root]/
├── [source-folder]/              # Main source code (e.g., src/, app/, lib/)
│   ├── [controllers/routes]/    # API endpoints or route handlers
│   ├── [services/business]/     # Business logic layer
│   ├── [models/entities]/       # Data models or domain entities
│   ├── [repositories/data]/     # Data access layer
│   ├── [middleware/filters]/    # Middleware or request filters
│   ├── [config]/                # Configuration files
│   └── [utils/helpers]/         # Utility functions
├── [test-folder]/               # Test files (e.g., tests/, __tests__/)
│   ├── [unit-tests]/            # Unit tests
│   ├── [integration-tests]/     # Integration tests
│   └── [helpers]/               # Test utilities and fixtures
├── [migrations-folder]/         # Database migrations
├── [public-static]/             # Static assets (if applicable)
├── [config-files]               # Root config files
└── [dependency-file]            # Dependencies (package.json, requirements.txt, etc.)
```

## Code Patterns

### [Controller/Route Handler Pattern]
```[language]
[Example code showing typical controller/route handler pattern]
// Include:
// - Dependency injection
// - Error handling
// - Request validation
// - Response formatting
// - Logging
```

### [Service/Business Logic Pattern]
```[language]
[Example code showing service layer pattern]
// Include:
// - Interface definition (if applicable)
// - Service implementation
// - Error handling
// - Transaction management
// - Business rule validation
```

### [Test Pattern]
```[language]
[Example code showing test pattern]
// Include:
// - Test setup/teardown
// - Arrange-Act-Assert structure
// - Mocking dependencies
// - Assertions
// - Test naming convention
```

## Coding Conventions

### Naming & Style
- **Variables**: [Convention, e.g., camelCase, snake_case]
- **Functions/Methods**: [Convention, e.g., camelCase, verb_noun]
- **Classes**: [Convention, e.g., PascalCase]
- **Constants**: [Convention, e.g., UPPER_SNAKE_CASE]
- **Files**: [Convention, e.g., kebab-case, PascalCase]
- **Test Methods**: [Convention, e.g., test_methodName_scenario_expectedOutcome]
- **Async Operations**: [Pattern, e.g., always use async/await]
- **Error Handling**: [Pattern, e.g., try/catch blocks, Result types]

### Code Organization
```[language]
// [Show standard file structure for a typical module]
// Include:
// - Imports organization
// - Type definitions
// - Constants
// - Main implementation
// - Exports
```

### Database Queries
```[language]
// [Show patterns for database operations]
// Include:
// - Read operations
// - Write operations
// - Transaction handling
// - Query optimization tips
```

### Error Handling
```[language]
// [Show error handling patterns]
// Include:
// - Validation errors
// - Business logic errors
// - Infrastructure errors
// - Error logging
// - User-friendly error messages
```

## Core Business Flows

[Document 2-3 main business flows in your application]

**[Flow 1 Name]**: [Step 1] → [Step 2] → [Step 3] → [Result]  
**[Flow 2 Name]**: [Step 1] → [Step 2] → [Step 3] → [Result]  
**[Flow 3 Name]**: [Step 1] → [Step 2] → [Step 3] → [Result]

## Configuration

### Required Environment Variables
```[format]
{
  // Development
  "[ENV_VAR_1]": "[description or example value]",
  "[ENV_VAR_2]": "[description or example value]",
  
  // Database
  "[DB_CONNECTION_STRING]": "[format example]",
  
  // External Services
  "[API_KEY_1]": "[service name - get from admin]",
  "[API_KEY_2]": "[service name - get from admin]",
  
  // Feature Flags (if applicable)
  "[FEATURE_FLAG_1]": "[true/false]"
}
```

### Configuration Files
- **[config-file-1]**: [Purpose and what it configures]
- **[config-file-2]**: [Purpose and what it configures]
- **[environment-specific]**: [How environment-specific config works]

## API Endpoints (if applicable)

**[Resource 1]**
- `[METHOD] [endpoint]` - [Description]
- `[METHOD] [endpoint]` - [Description]

**[Resource 2]**
- `[METHOD] [endpoint]` - [Description]
- `[METHOD] [endpoint]` - [Description]

**[Resource 3]**
- `[METHOD] [endpoint]` - [Description]
- `[METHOD] [endpoint]` - [Description]

## Security Guidelines

- [Security practice 1, e.g., Validate all user inputs]
- [Security practice 2, e.g., Never log sensitive data (passwords, tokens, PII)]
- [Security practice 3, e.g., Use parameterized queries for database access]
- [Security practice 4, e.g., Implement rate limiting on public endpoints]
- [Security practice 5, e.g., Use environment variables for secrets]
- [Security practice 6, e.g., Keep dependencies updated]

## Performance Tips

- [Performance tip 1, e.g., Use connection pooling for database]
- [Performance tip 2, e.g., Implement caching for expensive operations]
- [Performance tip 3, e.g., Use pagination for large datasets]
- [Performance tip 4, e.g., Optimize database queries with indexes]
- [Performance tip 5, e.g., Use async operations for I/O]
- [Performance tip 6, e.g., Implement lazy loading where appropriate]

## Troubleshooting

**[Common Issue 1]**: [Solution or debugging steps]  
**[Common Issue 2]**: [Solution or debugging steps]  
**[Common Issue 3]**: [Solution or debugging steps]  
**[Common Issue 4]**: [Solution or debugging steps]

## Detailed Documentation

For in-depth implementation guidance, see `.cursor/rules/`:

- **implementation-core.mdc** - Core coding standards & patterns
- **api-design.mdc** - REST API design & documentation (if applicable)
- **unit-testing.mdc** - Comprehensive testing strategies
- **security.mdc** - Security best practices & compliance
- **data-modeling.mdc** - Database design patterns (if applicable)
- **deployment.mdc** - Deployment & DevOps
- **design-notes.mdc** - Architecture decision records

**See `.cursor/rules/README.md`** for the complete rule index and when to use each rule.

## Before Committing

```bash
[lint-command]           # Lint code
[format-command]         # Format code
[type-check]             # Type check (if applicable)
[test-command]           # Run tests
[build-command]          # Verify build works
```

**Commit Message Format**: [Your convention, e.g., Conventional Commits, verb-first present tense]

**Examples:**
- `feat: Add user authentication endpoint`
- `fix: Resolve database connection timeout`
- `docs: Update API documentation`
- `refactor: Simplify payment processing logic`

---

**Need help?** Reference the cursor rules for detailed implementation guidance!

**New to the project?** Start with the Quick Start section and read through the Coding Conventions.

**Deploying?** Check the Deployment section and `.cursor/rules/deployment.mdc` for detailed instructions.

