# Coding Standards and Best Practices

> Core implementation patterns and coding standards for professional software development.

## Table of Contents

- [Project Context](#project-context)
- [Code Organization](#code-organization)
- [Core Implementation Patterns](#core-implementation-patterns)
- [Coding Standards](#coding-standards)
- [Error Handling](#error-handling)
- [Logging](#logging)
- [Performance Guidelines](#performance-guidelines)
- [Security Guidelines](#security-guidelines)
- [Testing Considerations](#testing-considerations)
- [Anti-Patterns to Avoid](#anti-patterns-to-avoid)
- [Code Review Checklist](#code-review-checklist)
- [Best Practices Summary](#best-practices-summary)

## Project Context

**Customize this section for your project:**

- **Framework**: [Specify your framework, e.g., .NET, Node.js, Django, Spring Boot]
- **Architecture**: [Specify architecture pattern, e.g., Layered, Clean Architecture, Microservices]
- **Patterns**: [Specify patterns used, e.g., Repository, Service Layer, CQRS]
- **Dependency Injection**: [Specify DI approach if applicable]

## Code Organization

### Directory and File Structure

```
[Adapt to your project structure]
src/
├── controllers/     # HTTP handlers or route controllers
├── services/        # Business logic layer
├── models/          # Data models or domain entities
├── repositories/    # Data access layer
├── middleware/      # Request/response processing
├── utils/           # Utility functions
└── config/          # Configuration files
```

### File Naming Conventions

- **Classes/Components**: `PascalCase` or language convention
- **Files**: Match language standards
  - TypeScript: `UserService.ts`
  - Python: `user_service.py`
  - C#: `UserService.cs`
  - Java: `UserService.java`
- **Test files**: `[FileName].test.[ext]` or `test_[filename].[ext]`
- **Configuration**: `config.[ext]`, `settings.[ext]`, or `appsettings.json`

### Module/Package Organization

✅ **Best Practices:**
- **Single Responsibility**: Each file/module has one clear purpose
- **Clear Dependencies**: Import/require statements at the top
- **Explicit Exports**: Export only what's needed by other modules
- **Avoid Circular Dependencies**: Structure imports hierarchically

## Core Implementation Patterns

### Controller/Route Handler Pattern

**Purpose**: Handle HTTP requests and delegate to business logic

```javascript
// Example (adapt for your framework)
class UserController {
  constructor(userService, validator) {
    this.userService = userService;
    this.validator = validator;
  }

  async getUser(req, res) {
    try {
      // 1. Validate input
      const { id } = this.validator.validateId(req.params);
      
      // 2. Delegate to service
      const user = await this.userService.getUserById(id);
      
      // 3. Return formatted response
      return res.status(200).json({ data: user });
    } catch (error) {
      // 4. Handle errors
      return this.handleError(error, res);
    }
  }
}
```

**Key Principles:**
- Controllers should be thin - delegate to services
- Validate input at the boundary
- Return consistent response formats
- Handle errors gracefully
- Log important operations

### Service Layer Pattern

**Purpose**: Implement business logic and orchestrate operations

```javascript
// Example (adapt for your framework)
class UserService {
  constructor(userRepository, emailService, logger) {
    this.userRepository = userRepository;
    this.emailService = emailService;
    this.logger = logger;
  }

  async createUser(userData) {
    // 1. Validate business rules
    await this.validateUniqueEmail(userData.email);
    
    // 2. Perform business logic
    const hashedPassword = await this.hashPassword(userData.password);
    
    // 3. Persist data
    const user = await this.userRepository.create({
      ...userData,
      password: hashedPassword
    });
    
    // 4. Trigger side effects
    await this.emailService.sendWelcome(user.email);
    
    this.logger.info('User created', { userId: user.id });
    
    return user;
  }
}
```

**Key Principles:**
- Services contain business logic
- Services orchestrate data operations
- Each service has single responsibility
- Services are testable (mockable dependencies)
- Clear error handling strategy

### Repository/Data Access Pattern

**Purpose**: Abstract database operations

```javascript
// Example (adapt for your framework)
class UserRepository {
  constructor(database) {
    this.db = database;
  }

  async findById(id) {
    return this.db.users.findOne({ where: { id } });
  }

  async create(userData) {
    return this.db.users.create(userData);
  }

  async findByEmail(email) {
    return this.db.users.findOne({ where: { email } });
  }

  async update(id, userData) {
    return this.db.users.update(userData, { where: { id } });
  }
}
```

**Key Principles:**
- Abstract database specifics
- Use parameterized queries (prevent SQL injection)
- Implement connection pooling
- Handle transactions appropriately
- Return domain models, not database models

## Coding Standards

### Naming Conventions

**Variables**:
- Descriptive names, avoid abbreviations
- Use camelCase or snake_case per language convention
```javascript
✅ const userEmailAddress = 'user@example.com';
❌ const usrEmlAddr = 'user@example.com';
```

**Functions**:
- Verb-noun format
- Describe what the function does
```javascript
✅ getUserById(id)
✅ calculateTotalPrice(items)
❌ get(id)
❌ process(data)
```

**Constants**:
- UPPER_SNAKE_CASE or language convention
```javascript
✅ const MAX_RETRY_ATTEMPTS = 3;
✅ const API_BASE_URL = 'https://api.example.com';
```

**Classes**:
- PascalCase
- Noun or noun phrase
```javascript
✅ class UserService {}
✅ class PaymentProcessor {}
❌ class HandleUsers {}
```

### Code Style

- **Indentation**: Consistent (2 or 4 spaces, never tabs)
- **Line Length**: Maximum 80-120 characters
- **Statements**: One per line
- **Formatting**: Use language formatter (Prettier, Black, gofmt, etc.)

```javascript
// Use your project's formatter
npm run format    // or
black .           // or
dotnet format     // or
go fmt ./...
```

### Comments

**Guidelines**:
- Explain **why**, not **what**
- Document public APIs
- Keep comments up-to-date
- Remove commented-out code (use version control)

```javascript
✅ Good - explains WHY
// Retry 3 times to handle transient network errors
const MAX_RETRIES = 3;

❌ Bad - explains WHAT (code already shows this)
// Set max retries to 3
const MAX_RETRIES = 3;

✅ Good - explains complex business logic
// Apply discount only for orders placed on weekdays
// to encourage weekday shopping per marketing strategy
if (isWeekday(order.date)) {
  applyDiscount(order);
}
```

## Error Handling

### Error Handling Strategy

```javascript
// Create custom error types
class AppError extends Error {
  constructor(message, statusCode, code) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;
  }
}

class NotFoundError extends AppError {
  constructor(message) {
    super(message, 404, 'NOT_FOUND');
  }
}

class ValidationError extends AppError {
  constructor(message) {
    super(message, 400, 'VALIDATION_ERROR');
  }
}

// Usage
async function getUser(id) {
  const user = await userRepository.findById(id);
  if (!user) {
    throw new NotFoundError(`User with id ${id} not found`);
  }
  return user;
}

// Error handler middleware
function errorHandler(err, req, res, next) {
  logger.error(err.message, { error: err, requestId: req.id });
  
  if (err.isOperational) {
    // Known operational error
    return res.status(err.statusCode).json({
      error: {
        message: err.message,
        code: err.code
      }
    });
  }
  
  // Unknown error - don't leak details
  return res.status(500).json({
    error: {
      message: 'Internal server error',
      code: 'INTERNAL_ERROR'
    }
  });
}
```

**Principles**:
- **Input Validation Errors**: Return 400-level HTTP status
- **Business Logic Errors**: Return specific error codes
- **Infrastructure Errors**: Log and return 500-level status
- **Never swallow exceptions** without logging
- **Fail fast** for critical errors
- **Catch specific exceptions**, not generic
- **Provide meaningful error messages**
- **Don't expose internal details** to users
- **Clean up resources** (use try-finally or context managers)

## Logging

### Logging Levels

```javascript
// DEBUG - Detailed debugging information (development only)
logger.debug('Processing user data', { userId, data });

// INFO - General informational messages
logger.info('User created successfully', { userId: user.id });

// WARN - Warning messages (recoverable issues)
logger.warn('Cache miss for user', { userId });

// ERROR - Error messages (exceptions, failures)
logger.error('Failed to send email', { userId, error: err.message });

// FATAL/CRITICAL - Critical errors (system crash)
logger.fatal('Database connection lost', { error: err });
```

### Logging Best Practices

✅ **Do**:
- Use structured logging (JSON format)
- Include correlation/request IDs for tracking
- Log at appropriate levels
- Include relevant context
- Log errors with stack traces

❌ **Don't**:
- Log sensitive data (passwords, tokens, PII, credit cards)
- Log in hot paths (high-frequency loops)
- Use `console.log` in production
- Log without context

```javascript
// Good - structured logging with context
logger.info('User login', {
  userId: user.id,
  ipAddress: req.ip,
  userAgent: req.headers['user-agent'],
  timestamp: new Date().toISOString()
});

// Bad - unstructured, no context
console.log('User logged in');
```

## Performance Guidelines

### General Performance

- **Avoid Premature Optimization**: Measure before optimizing
- **Use Profiling Tools**: Identify actual bottlenecks
- **Cache Expensive Operations**: Use caching layers appropriately
- **Lazy Loading**: Load data only when needed
- **Batch Operations**: Reduce network/database round trips

### Database Performance

```javascript
// ✅ Good - Single query with joins
const users = await db.users.findAll({
  include: [{ model: db.posts }]
});

// ❌ Bad - N+1 query problem
const users = await db.users.findAll();
for (const user of users) {
  user.posts = await db.posts.findAll({ where: { userId: user.id } });
}
```

**Best Practices**:
- **Use Indexes**: Index frequently queried fields
- **Avoid N+1 Queries**: Use eager loading or joins
- **Limit Result Sets**: Implement pagination
- **Use Connection Pooling**: Reuse database connections
- **Query Optimization**: Analyze and optimize slow queries

### Memory Management

- **Avoid Memory Leaks**: Clean up resources, remove event listeners
- **Stream Large Data**: Don't load everything into memory
- **Use Appropriate Data Structures**: Choose based on access patterns
- **Dispose Resources**: Close files, connections, streams

```javascript
// ✅ Good - Stream large files
const stream = fs.createReadStream('large-file.txt');
stream.pipe(res);

// ❌ Bad - Load entire file into memory
const content = fs.readFileSync('large-file.txt');
res.send(content);
```

## Security Guidelines

### Input Validation

```javascript
// ✅ Good - Validate all inputs
function createUser(data) {
  const schema = {
    email: { type: 'string', format: 'email', required: true },
    age: { type: 'number', min: 18, max: 120 },
    username: { type: 'string', minLength: 3, maxLength: 20, pattern: /^[a-zA-Z0-9_]+$/ }
  };
  
  const errors = validate(data, schema);
  if (errors.length > 0) {
    throw new ValidationError('Invalid input', { errors });
  }
}
```

**Principles**:
- Validate all user inputs
- Use allow-lists, not deny-lists
- Validate on the server-side (never trust client)
- Sanitize HTML/SQL/shell inputs
- Enforce length limits

### Authentication & Authorization

- Never store passwords in plain text
- Use established libraries for auth (don't roll your own)
- Implement proper session management
- Use secure password hashing (bcrypt, Argon2)
- Implement rate limiting

```javascript
// ✅ Good - Hash passwords
const bcrypt = require('bcrypt');
const hashedPassword = await bcrypt.hash(password, 10);

// ❌ Bad - Store plain text
const password = userData.password; // Never do this!
```

### SQL Injection Prevention

```javascript
// ✅ Good - Parameterized query
const user = await db.query(
  'SELECT * FROM users WHERE email = $1',
  [email]
);

// ❌ Bad - String concatenation
const user = await db.query(
  `SELECT * FROM users WHERE email = '${email}'`
);
```

**Principles**:
- Use parameterized queries/prepared statements
- Use ORM query builders
- Never concatenate user input into queries
- Validate and sanitize all inputs

See [Security Guidelines](security.md) for comprehensive security practices.

## Testing Considerations

### Testability Principles

- **Write Testable Code**: Keep functions small and focused
- **Dependency Injection**: Allow dependencies to be mocked
- **Avoid Static Dependencies**: Use interfaces/abstractions
- **Pure Functions**: Favor functions without side effects
- **Clear Separation**: Separate I/O from business logic

```javascript
// ✅ Good - Testable with dependency injection
class UserService {
  constructor(userRepository, emailService) {
    this.userRepository = userRepository;
    this.emailService = emailService;
  }
  
  async createUser(userData) {
    const user = await this.userRepository.create(userData);
    await this.emailService.sendWelcome(user.email);
    return user;
  }
}

// ❌ Bad - Hard to test due to hard-coded dependencies
class UserService {
  async createUser(userData) {
    const user = await new UserRepository().create(userData);
    await new EmailService().sendWelcome(user.email);
    return user;
  }
}
```

See [Testing Guide](unit-testing.md) for comprehensive testing practices.

## Anti-Patterns to Avoid

### ❌ Don't Do This

1. **God Objects**: Classes that do too much
```javascript
// Bad - Does everything
class UserManager {
  createUser() {}
  deleteUser() {}
  sendEmail() {}
  processPayment() {}
  generateReport() {}
}
```

2. **Magic Numbers**: Hardcoded values without explanation
```javascript
❌ if (user.age > 18) { ... }
✅ const MINIMUM_AGE = 18; if (user.age > MINIMUM_AGE) { ... }
```

3. **Deep Nesting**: Too many levels of indentation
```javascript
// Bad
if (user) {
  if (user.isActive) {
    if (user.hasPermission) {
      if (user.emailVerified) {
        // Finally do something
      }
    }
  }
}

// Good - Early returns
if (!user) return;
if (!user.isActive) return;
if (!user.hasPermission) return;
if (!user.emailVerified) return;
// Do something
```

4. **Long Methods**: Methods spanning hundreds of lines
5. **Global State**: Mutable global variables
6. **Premature Optimization**: Optimizing before measuring
7. **Copy-Paste Code**: Duplicating logic across files
8. **Swallowing Exceptions**: Catching without handling or logging
9. **Mixed Concerns**: Mixing business logic with presentation
10. **Tight Coupling**: Direct dependencies on concrete implementations

### ✅ Do This Instead

1. **Single Responsibility**: One class/function, one purpose
2. **Named Constants**: Use descriptive constant names
3. **Early Returns**: Reduce nesting with guard clauses
4. **Extract Methods**: Break large methods into smaller ones
5. **Dependency Injection**: Pass dependencies, don't create them
6. **Measure First**: Profile, then optimize
7. **DRY Principle**: Extract common logic into reusable functions
8. **Proper Error Handling**: Log errors with context, handle gracefully
9. **Separation of Concerns**: Keep layers independent
10. **Depend on Abstractions**: Use interfaces/protocols

## Code Review Checklist

Before submitting code for review:

- [ ] Code follows project conventions and style guide
- [ ] All new code has appropriate test coverage
- [ ] No commented-out code (use version control)
- [ ] No debugging statements (console.log, print, etc.)
- [ ] Error handling is comprehensive
- [ ] Security considerations addressed (input validation, etc.)
- [ ] Performance implications considered
- [ ] Documentation updated (if needed)
- [ ] No linter warnings or errors
- [ ] Code is self-documenting with clear naming
- [ ] Dependencies are justified and documented
- [ ] Backward compatibility maintained (if applicable)

## Best Practices Summary

### SOLID Principles (for OOP)

1. **S**ingle Responsibility: One class, one reason to change
2. **O**pen/Closed: Open for extension, closed for modification
3. **L**iskov Substitution: Subtypes must be substitutable for base types
4. **I**nterface Segregation: Many specific interfaces > one general interface
5. **D**ependency Inversion: Depend on abstractions, not concretions

### Clean Code Principles

1. **Meaningful Names**: Use intention-revealing names
2. **Small Functions**: Functions should do one thing well
3. **Comments**: Good code is self-documenting
4. **Formatting**: Consistent, readable formatting
5. **Error Handling**: Don't ignore errors
6. **DRY**: Don't Repeat Yourself
7. **KISS**: Keep It Simple, Stupid
8. **YAGNI**: You Aren't Gonna Need It
9. **Composition over Inheritance**: Favor composition
10. **Boy Scout Rule**: Leave code cleaner than you found it

### Professional Practices

1. **Version Control**: Commit often with meaningful messages
2. **Code Reviews**: Participate in peer reviews
3. **Testing**: Write tests as you code
4. **Refactoring**: Regularly improve code structure
5. **Continuous Learning**: Stay updated with best practices
6. **Documentation**: Document decisions and complex logic
7. **Pair Programming**: Collaborate when tackling complex problems
8. **Technical Debt**: Address it regularly, don't accumulate
9. **Monitoring**: Implement observability from the start
10. **Security**: Think security first, not as an afterthought

---

**Remember**: These are guidelines, not laws. Use judgment based on your specific context, but understand the reasoning behind each practice before breaking from it.

## Additional Resources

- [Project Guide](PROJECT_GUIDE_TEMPLATE.md) - Comprehensive project documentation
- [API Guidelines](api-design.md) - API design standards
- [Testing Guide](unit-testing.md) - Testing best practices
- [Security Guidelines](security.md) - Security practices
- [Contributing Guide](../CONTRIBUTING_TEMPLATE.md) - How to contribute


