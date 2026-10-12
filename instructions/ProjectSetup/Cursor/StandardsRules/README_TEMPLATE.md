# Cursor Rules Index

This directory contains detailed implementation guidance for [PROJECT_NAME]. These rules complement **AGENTS.md** (quick reference) with in-depth patterns, best practices, and domain-specific knowledge.

## Quick Reference

**Start Here**: [`AGENTS.md`](../../AGENTS.md) for commands and quick patterns  
**Then Dive Deeper**: Use specific rules below for detailed implementation guidance

## Available Rules

### **Architecture & Design**

#### [design-notes.mdc](./design-notes.mdc)
**When to use:** Writing architectural decision records (ADRs) or design documentation

**Contains:**
- ADR format and templates
- API design documentation standards
- Data model design guidelines
- Service layer design principles
- Quality checklists for design docs

**Use for:** Documenting new features, architectural changes, major refactoring

---

#### [api-design.mdc](./api-design.mdc)
**When to use:** Creating or modifying API endpoints

**Contains:**
- RESTful URL design principles
- HTTP status code usage
- Request/Response patterns
- Input validation strategies
- Error handling patterns
- File upload security
- API versioning strategies
- Documentation standards

**Use for:** New endpoints, API changes, improving error responses, file uploads

---

#### [data-modeling.mdc](./data-modeling.mdc)
**When to use:** Working with database entities, schemas, or queries

**Contains:**
- Entity/Model design patterns
- Database schema design
- ORM configurations and patterns
- Migration best practices
- Query optimization techniques
- Indexing strategies
- Performance anti-patterns

**Use for:** Adding entities/models, database migrations, query optimization, data relationships

---

### **Implementation**

#### [implementation-core.mdc](./implementation-core.mdc)
**When to use:** Writing any code (default rule for general development)

**Contains:**
- Code organization standards
- Naming conventions
- Error handling standards
- Logging patterns
- Async/await conventions
- Performance guidelines
- Common patterns for your stack
- Anti-patterns to avoid

**Use for:** General coding tasks, refactoring, code reviews, establishing patterns

---

#### [security.mdc](./security.mdc)
**When to use:** Implementing security features or handling sensitive data

**Contains:**
- Input validation & sanitization
- File upload security
- Data encryption patterns
- Secure logging practices
- API security (rate limiting, authentication)
- Request validation
- Safe error responses
- Security headers configuration
- Audit logging patterns
- Data retention policies
- PII/sensitive data handling

**Use for:** Authentication, payment processing, file uploads, PII handling, security reviews

---

### **Testing & Quality**

#### [unit-testing.mdc](./unit-testing.mdc)
**When to use:** Writing or fixing unit tests

**Contains:**
- Testing framework patterns
- Test structure and organization
- Arrange-Act-Assert structure
- Test naming conventions
- Mocking patterns
- Test data management
- Exception testing
- Integration test patterns
- Test coverage strategies

**Use for:** Writing tests, improving test coverage, test refactoring

---

### **DevOps & Deployment**

#### [deployment.mdc](./deployment.mdc)
**When to use:** Setting up CI/CD, deployment, or infrastructure

**Contains:**
- Containerization patterns (Docker)
- Cloud deployment configurations
- CI/CD pipeline examples
- Environment configuration
- Infrastructure as Code
- Health check implementation
- Monitoring and logging
- Rollback strategies
- Secrets management
- Network security

**Use for:** Deployment setup, CI/CD configuration, infrastructure changes, monitoring

---

## Decision Matrix: Which Rule to Use?

| Task | Primary Rule | Supporting Rules |
|------|-------------|------------------|
| **New API endpoint** | api-design | implementation-core, security |
| **New service/business logic** | implementation-core | data-modeling, security |
| **Database schema changes** | data-modeling | implementation-core |
| **Adding migrations** | data-modeling | - |
| **Writing tests** | unit-testing | implementation-core |
| **File upload feature** | security | api-design, implementation-core |
| **Payment processing** | security | api-design, implementation-core |
| **Query optimization** | data-modeling | implementation-core |
| **Error handling** | api-design | implementation-core |
| **Logging** | implementation-core | security |
| **Deployment setup** | deployment | security |
| **CI/CD pipeline** | deployment | - |
| **Architecture decisions** | design-notes | api-design, data-modeling |
| **Security review** | security | ALL |

## Usage in Cursor

### Explicit Rule Reference
```
@rules implementation-core

// Cursor will load implementation-core.mdc for context
```

### Multiple Rules
```
@rules api-design @rules security

// Load multiple rules for complex features
```

### Auto-Detection
Cursor automatically uses:
1. **AGENTS.md** - Always loaded (quick reference)
2. **Relevant cursor rules** - Based on file type and context
3. **User instructions** - Your explicit prompts (highest priority)

## Rule Priority & Hierarchy

```
┌─────────────────────────────────────────┐
│  1. Your Explicit Instructions          │ ← Highest Priority
├─────────────────────────────────────────┤
│  2. Specific Cursor Rule (@rules X)     │
├─────────────────────────────────────────┤
│  3. AGENTS.md (Quick Reference)         │
├─────────────────────────────────────────┤
│  4. implementation-core.mdc (Fallback)  │
├─────────────────────────────────────────┤
│  5. General AI Knowledge                │ ← Lowest Priority
└─────────────────────────────────────────┘
```

## Rule Characteristics

| Rule | Scope | Detail Level | Update Frequency |
|------|-------|--------------|------------------|
| AGENTS.md | Universal | High-level | Low |
| implementation-core | Broad | Medium-High | Medium |
| api-design | Specific | High | Low-Medium |
| security | Specific | Very High | Low |
| data-modeling | Specific | High | Low-Medium |
| unit-testing | Specific | High | Low-Medium |
| deployment | Specific | High | Medium |
| design-notes | Meta | Medium | Low |

## Best Practices

### Do This ✅

- **Start with AGENTS.md** for commands and basic patterns
- **Reference specific rules** for detailed implementation
- **Combine rules** for complex features (e.g., @rules api-design @rules security for file uploads)
- **Update rules** when patterns evolve
- **Cross-reference** between rules and AGENTS.md
- **Keep examples realistic** and working

### Avoid This ❌

- **Don't duplicate** content between AGENTS.md and cursor rules
- **Don't make rules too generic** - be specific and actionable
- **Don't ignore rules** - they represent team conventions
- **Don't forget to update** when major patterns change
- **Don't add outdated examples** - verify they work

## Related Documentation

- **[AGENTS.md](../../AGENTS.md)** - Quick reference for all AI agents
- **[README.md](../../README.md)** - Project documentation for humans
- **[docs/](../../docs/)** - Additional project documentation

## Maintenance Guidelines

### When to Update Rules

1. **Pattern Changes** - When you establish a new pattern or modify existing ones
2. **Technology Updates** - When adopting new libraries or frameworks
3. **Team Decisions** - After architecture or design decisions
4. **Best Practices** - When industry best practices evolve
5. **Security Issues** - When security vulnerabilities are discovered or new threats emerge

### How to Update

1. **Update the specific rule file** with detailed context and examples
2. **Update AGENTS.md** with the quick reference (if needed)
3. **Update this README** if you add/remove rules
4. **Commit both together** to keep them in sync
5. **Test examples** to ensure they work with current codebase

### Update Checklist

- [ ] Rule file updated with examples
- [ ] Examples tested and verified working
- [ ] AGENTS.md updated (if command/pattern changed)
- [ ] README.md decision matrix updated (if applicable)
- [ ] Cross-references between files verified
- [ ] Team notified of significant changes

## Example Workflow

### Scenario: Adding a New API Endpoint with File Upload

1. **Check AGENTS.md** - Review basic controller/route handler pattern
2. **Reference api-design.mdc** - Follow REST conventions, status codes, documentation
3. **Reference security.mdc** - Validate file uploads, handle sensitive data
4. **Reference implementation-core.mdc** - Follow coding standards
5. **Reference unit-testing.mdc** - Write comprehensive tests

### Cursor Usage
```
I need to create a new endpoint POST /api/documents/upload that accepts 
multiple files and validates them before storing in cloud storage.

@rules api-design @rules security
```

## Learning Path

**For New Team Members:**

1. Read **AGENTS.md** - Get familiar with project setup and common commands
2. Read **implementation-core.mdc** - Understand core coding patterns
3. Explore **api-design.mdc** - Learn API conventions (if backend developer)
4. Review **unit-testing.mdc** - Learn testing approaches
5. Skim other rules - Know what exists for future reference

**For Experienced Developers:**

- Use this README as a quick reference
- Jump directly to relevant rules when needed
- Contribute updates when you discover better patterns

## Contributing to Rules

When you discover a better pattern or solve a tricky problem:

1. Update the relevant rule file with your solution
2. Add clear examples with comments
3. Explain the "why" behind the pattern
4. Update AGENTS.md if it's a common operation
5. Share with the team for review
6. Document any trade-offs or considerations

### Example Contribution

```markdown
# In security.mdc

## File Upload with Virus Scanning

When accepting file uploads, always scan for malware:

```[language]
[Code example showing virus scanning integration]
```

**Why**: Prevents malicious files from entering the system
**Trade-offs**: Adds 1-3 seconds to upload time
**Alternatives**: Client-side scanning (less secure), async scanning (delayed feedback)
```

---

**Questions?** Ask in team chat or create a discussion in the project repository.

**Found outdated content?** Please update it! These rules are living documents.

**Have a suggestion?** Open an issue or PR with your proposed changes.

