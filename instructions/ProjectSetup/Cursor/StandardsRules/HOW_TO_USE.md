# How to Use These Standard Rules in Your New Project

## Overview

This folder contains **standardized, reusable templates** for project rules and documentation that can be adapted for any software project. These templates are based on proven patterns and best practices.

## What's Included

- **AGENTS_TEMPLATE.md** - Template for AI agent quick reference guide
- **README_TEMPLATE.md** - Template for rules folder index
- **implementation-core.mdc** - Generic coding standards
- **api-design.mdc** - REST API design principles
- **unit-testing.mdc** - Unit testing patterns
- **security.mdc** - Security best practices
- **data-modeling.mdc** - Database design patterns
- **deployment.mdc** - Deployment and DevOps guidelines
- **design-notes.mdc** - Architecture documentation template

## Quick Start: Setting Up a New Project

### Step 1: Copy Files to Your Project

```bash
# From your new project root
mkdir -p .cursor/rules
cp StandardsRules/implementation-core.mdc .cursor/rules/
cp StandardsRules/api-design.mdc .cursor/rules/
cp StandardsRules/unit-testing.mdc .cursor/rules/
cp StandardsRules/security.mdc .cursor/rules/
cp StandardsRules/data-modeling.mdc .cursor/rules/
cp StandardsRules/deployment.mdc .cursor/rules/
cp StandardsRules/design-notes.mdc .cursor/rules/
cp StandardsRules/README_TEMPLATE.md .cursor/rules/README.md

# Copy AGENTS.md template to project root
cp StandardsRules/AGENTS_TEMPLATE.md ./AGENTS.md
```

### Step 2: Customize for Your Project

#### A. Update AGENTS.md

1. **Project Overview Section**
   - Replace `[PROJECT_NAME]` with your project name
   - Update the project description
   - Modify technology stack list
   - Update framework versions

2. **Quick Start Commands**
   - Adjust commands for your specific framework
   - Update port numbers
   - Modify database setup commands

3. **Project Structure**
   - Reflect your actual folder structure
   - Update file naming conventions

4. **Code Patterns**
   - Keep generic patterns that apply
   - Add project-specific patterns
   - Update example code to match your tech stack

5. **Configuration Section**
   - List your environment variables
   - Document your configuration files
   - Update service integrations

6. **API Endpoints Section** (if applicable)
   - List your actual API endpoints
   - Document request/response formats

7. **Core Business Flows**
   - Document your specific business processes
   - Update workflow descriptions

#### B. Update Cursor Rules (.cursor/rules/)

For each rule file:

1. **Update the `description` frontmatter**
   - Replace project name references
   - Update specific tool/framework references

2. **Customize Project Context sections**
   - Framework versions
   - Architecture choices
   - Technology stack

3. **Update Code Examples**
   - Replace generic examples with project-specific ones
   - Update namespaces, class names
   - Reflect your actual patterns

4. **Modify External Service References**
   - Update cloud provider (Azure/AWS/GCP)
   - Change third-party services
   - Update authentication methods

#### C. Update .cursor/rules/README.md

1. Update the decision matrix with your actual use cases
2. Add or remove rules based on your tech stack
3. Update rule descriptions to reflect customizations

### Step 3: Technology-Specific Adaptations

#### For .NET Projects
- Keep .NET-specific examples in code patterns
- Update namespace conventions
- Customize Entity Framework sections
- Update NuGet package references

#### For Node.js/TypeScript Projects
- Replace C# examples with TypeScript/JavaScript
- Update package.json references
- Modify testing frameworks (Jest, Mocha, etc.)
- Update API framework (Express, Fastify, NestJS)

#### For Python Projects
- Replace examples with Python code
- Update package manager (pip, poetry)
- Modify testing frameworks (pytest, unittest)
- Update web frameworks (Django, FastAPI, Flask)

#### For Java Projects
- Update examples to Java syntax
- Change build tools (Maven, Gradle)
- Update testing frameworks (JUnit, TestNG)
- Modify framework references (Spring Boot, etc.)

#### For Go Projects
- Replace examples with Go code
- Update module references
- Modify testing patterns
- Update deployment configurations

### Step 4: Add Project-Specific Rules

If your project has unique requirements:

1. **Create new rule files** for specialized domains:
   ```bash
   .cursor/rules/mobile-development.mdc
   .cursor/rules/machine-learning.mdc
   .cursor/rules/real-time-systems.mdc
   ```

2. **Follow the template structure**:
   ```markdown
   ---
   description: Brief description of this rule
   ---
   
   # Rule Name
   
   You are implementing [specific area] following established patterns.
   
   ## Project Context
   - Framework/tool specifics
   
   ## Patterns and Examples
   - Code examples
   - Best practices
   
   ## Anti-Patterns
   - What to avoid
   ```

3. **Update .cursor/rules/README.md** to include new rules

## Customization Examples

### Example 1: Node.js/Express API Project

```markdown
# AGENTS.md Updates

## Project Overview
**My Express API** - A Node.js REST API using Express, TypeScript, and PostgreSQL

- **Framework**: Node.js 20 + Express 4.x
- **Language**: TypeScript 5.x
- **Database**: PostgreSQL 15
- **Testing**: Jest + Supertest
- **ORM**: Prisma

## Quick Start
```bash
npm install
npm run db:migrate
npm run dev
```

### Example 2: Python/Django Project

```markdown
# AGENTS.md Updates

## Project Overview
**Django CRM** - A Django-based CRM system with REST API

- **Framework**: Django 5.0 + Django REST Framework
- **Database**: PostgreSQL
- **Testing**: pytest + pytest-django
- **Task Queue**: Celery + Redis

## Quick Start
```bash
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Example 3: Go Microservice

```markdown
# AGENTS.md Updates

## Project Overview
**Payment Service** - A Go microservice for payment processing

- **Language**: Go 1.21
- **Framework**: Gin + GORM
- **Database**: PostgreSQL
- **Testing**: testify
- **Deployment**: Docker + Kubernetes

## Quick Start
```bash
go mod download
go run cmd/server/main.go
```

## Rule Selection Guide

### Essential Rules (Include in Every Project)
- ✅ **implementation-core.mdc** - Always needed
- ✅ **security.mdc** - Always needed
- ✅ **unit-testing.mdc** - Always needed

### Conditional Rules (Include Based on Project Type)
- **api-design.mdc** - For REST API projects
- **data-modeling.mdc** - For database-backed applications
- **deployment.mdc** - For production deployments
- **design-notes.mdc** - For team projects requiring documentation

### Optional Rules (Add as Needed)
- Frontend-specific rules for UI projects
- Mobile development rules for iOS/Android
- Machine learning rules for ML/AI projects
- Real-time systems rules for WebSocket/streaming apps

## Maintenance Guidelines

### Keep Rules Updated
1. **After adopting new patterns** - Document them in rules
2. **When refactoring** - Update examples to reflect changes
3. **After code reviews** - Add patterns discovered during reviews
4. **Quarterly reviews** - Ensure rules still reflect current practices

### Version Control
1. Commit AGENTS.md and rules together
2. Use descriptive commit messages: "Update API design patterns for GraphQL"
3. Review rules during PR reviews
4. Keep rules synced across team members

## Testing Your Setup

After customization, verify:

1. **AGENTS.md is accurate**
   ```bash
   # Try the commands in Quick Start section
   # Verify they work
   ```

2. **Code examples compile/run**
   - Copy example code from rules
   - Verify it works in your project

3. **Paths are correct**
   - File paths in examples exist
   - Import statements are valid

4. **Links work**
   - Internal documentation links
   - External resource links

## Common Customization Patterns

### Replace Project Name Globally
```bash
# Find all references
grep -r "CarPro Insurance" .cursor/rules/
grep -r "CarPro Insurance" AGENTS.md

# Replace (be careful!)
find .cursor/rules/ -type f -exec sed -i 's/CarPro Insurance/YourProject/g' {} +
sed -i 's/CarPro Insurance/YourProject/g' AGENTS.md
```

### Update Technology Stack
1. Search for framework names (e.g., ".NET 8", "Entity Framework Core")
2. Replace with your framework (e.g., "Express 4.x", "Prisma")
3. Update all code examples accordingly

### Adjust Folder Structure
1. Update "Project Structure" section in AGENTS.md
2. Update file path references in rules
3. Update import examples

## Advanced: Multi-Project Setup

For organizations with multiple projects:

### Create a Shared Rules Repository
```
company-standards-rules/
├── common/
│   ├── implementation-core.mdc
│   ├── security.mdc
│   └── unit-testing.mdc
├── backend/
│   ├── dotnet/
│   ├── nodejs/
│   └── python/
├── frontend/
│   ├── react/
│   └── vue/
└── HOW_TO_USE.md
```

### Use Git Submodules
```bash
# In each project
git submodule add <company-standards-repo-url> .cursor/rules/standards

# Reference shared rules
ln -s .cursor/rules/standards/common/security.mdc .cursor/rules/security.mdc
```

## Troubleshooting

### Issue: Rules too generic
**Solution**: Add project-specific examples after each generic pattern

### Issue: Rules conflict with existing code
**Solution**: Update rules to document actual patterns, not ideal ones

### Issue: Too many rules, overwhelming
**Solution**: Start with 3-4 essential rules, add others as needed

### Issue: Rules get outdated
**Solution**: Set calendar reminder for quarterly reviews

## Getting Help

1. **Review the source project** - See how CarPro Insurance implemented these
2. **Check examples in this folder** - Technology-specific adaptations
3. **Ask team members** - Collaborate on customizations
4. **Iterate** - Rules improve over time with use

## Success Criteria

Your rules setup is successful when:

✅ New team members can onboard using AGENTS.md  
✅ AI assistants provide accurate, project-specific help  
✅ Code patterns are consistent across the project  
✅ Rules reflect actual code, not aspirations  
✅ Team refers to rules during development  

---

**Remember**: Rules are living documents. They should evolve with your project. Start simple, iterate based on feedback, and keep them accurate!

