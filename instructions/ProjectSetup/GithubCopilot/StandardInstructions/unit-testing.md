# Testing Guide

> Comprehensive testing standards and patterns for writing effective, maintainable tests

## Table of Contents

- [Project Testing Context](#project-testing-context)
- [Test Organization](#test-organization)
- [Test Structure Patterns](#test-structure-patterns)
- [Test Naming Conventions](#test-naming-conventions)
- [Unit Testing](#unit-testing)
- [Integration Testing](#integration-testing)
- [End-to-End Testing](#end-to-end-testing)
- [Test Data Management](#test-data-management)
- [Mocking and Stubbing](#mocking-and-stubbing)
- [Code Coverage](#code-coverage)
- [Testing Best Practices](#testing-best-practices)
- [Common Testing Anti-Patterns](#common-testing-anti-patterns)

## Project Testing Context

**Customize this section for your project:**

- **Framework**: [e.g., Jest, pytest, xUnit, JUnit, Go testing]
- **Mocking**: [e.g., Moq, unittest.mock, Jest mocks, Mockito]
- **Assertions**: [e.g., FluentAssertions, Chai, assert, Hamcrest]
- **Test Data**: [e.g., Fixtures, Factories, Builders]
- **Coverage Tool**: [e.g., Istanbul, Coverage.py, coverlet]

## Test Organization

### Test Directory Structure

```
tests/ or __tests__/
├── unit/                    # Unit tests
│   ├── services/
│   ├── models/
│   └── utils/
├── integration/             # Integration tests
│   ├── api/
│   └── database/
├── e2e/                     # End-to-end tests
├── fixtures/                # Test data
├── helpers/                 # Test utilities
└── mocks/                   # Mock objects/data
```

### Test File Naming

- **Test files**: `[FileName].test.[ext]` or `test_[filename].[ext]`
- **Integration tests**: `[Feature].integration.test.[ext]`
- **E2E tests**: `[Flow].e2e.test.[ext]`
- **Match source structure**: Mirror your source code structure

## Test Structure Patterns

### Arrange-Act-Assert (AAA) Pattern

```javascript
describe('UserService', () => {
  let userService;
  let userRepository;
  
  beforeEach(() => {
    // Common setup
    userRepository = createMockRepository();
    userService = new UserService(userRepository);
  });

  test('getUserById_withValidId_returnsUser', async () => {
    // Arrange - Set up test data and dependencies
    const userId = '123';
    const expectedUser = { id: userId, name: 'John Doe' };
    userRepository.findById.mockResolvedValue(expectedUser);
    
    // Act - Execute the code under test
    const result = await userService.getUserById(userId);
    
    // Assert - Verify the outcome
    expect(result).toEqual(expectedUser);
    expect(userRepository.findById).toHaveBeenCalledWith(userId);
  });
  
  afterEach(() => {
    // Cleanup
    jest.clearAllMocks();
  });
});
```

### Given-When-Then (BDD Style)

```javascript
describe('Feature: User Registration', () => {
  test('Given valid user data, When registering, Then user is created', async () => {
    // Given (Arrange)
    const validUserData = {
      email: 'user@example.com',
      password: 'SecurePass123!'
    };
    const mockRepository = createMockRepository();
    const userService = new UserService(mockRepository);
    
    // When (Act)
    const result = await userService.register(validUserData);
    
    // Then (Assert)
    expect(result).toBeDefined();
    expect(result.email).toBe(validUserData.email);
    expect(mockRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        email: validUserData.email
      })
    );
  });
});
```

## Test Naming Conventions

### Descriptive Test Names

**Pattern:** `methodName_scenario_expectedOutcome`

✅ **Good Examples:**
```javascript
test('calculateTotal_withValidItems_returnsCorrectSum')
test('getUserById_whenUserExists_returnsUser')
test('getUserById_whenUserNotFound_throwsNotFoundException')
test('processPayment_withInsufficientFunds_returnsFalse')
test('validateEmail_withInvalidFormat_returnsValidationError')
```

❌ **Bad Examples:**
```javascript
test('test1')
test('testGetUser')
test('itWorks')
test('basicTest')
```

### Behavior-Focused Names (BDD Style)

```javascript
describe('Calculator', () => {
  describe('add', () => {
    it('should return the sum of two positive numbers', () => {...});
    it('should handle negative numbers correctly', () => {...});
    it('should return zero when adding zero', () => {...});
  });
});
```

## Unit Testing

### What to Unit Test

- Pure functions and business logic
- Service layer methods
- Utility functions
- Data transformations
- Validation logic
- Error handling

### Unit Test Example

```javascript
describe('OrderCalculator', () => {
  describe('calculateTotal', () => {
    it('should calculate total with tax', () => {
      // Arrange
      const items = [
        { price: 10, quantity: 2 },
        { price: 5, quantity: 3 }
      ];
      const taxRate = 0.1;
      const calculator = new OrderCalculator();
      
      // Act
      const total = calculator.calculateTotal(items, taxRate);
      
      // Assert
      expect(total).toBe(38.5); // (20 + 15) * 1.1
    });

    it('should handle empty cart', () => {
      const calculator = new OrderCalculator();
      const total = calculator.calculateTotal([], 0.1);
      expect(total).toBe(0);
    });

    it('should throw error for negative quantities', () => {
      const calculator = new OrderCalculator();
      const items = [{ price: 10, quantity: -1 }];
      
      expect(() => calculator.calculateTotal(items, 0.1))
        .toThrow('Quantity must be positive');
    });
  });
});
```

## Integration Testing

### What to Integration Test

- API endpoints (request/response)
- Database operations
- External service integrations
- Authentication/authorization flows
- Multi-component interactions

### Integration Test Example

```javascript
describe('POST /api/users', () => {
  let app;
  let database;

  beforeAll(async () => {
    // Setup test database
    database = await setupTestDatabase();
    app = createApp(database);
  });

  afterAll(async () => {
    await database.close();
  });

  beforeEach(async () => {
    await database.clear();
  });

  it('should create a new user', async () => {
    // Arrange
    const newUser = {
      email: 'test@example.com',
      name: 'Test User'
    };

    // Act
    const response = await request(app)
      .post('/api/users')
      .send(newUser)
      .expect(201);

    // Assert
    expect(response.body).toMatchObject({
      id: expect.any(String),
      email: newUser.email,
      name: newUser.name,
      createdAt: expect.any(String)
    });

    // Verify in database
    const userInDb = await database.users.findOne({ email: newUser.email });
    expect(userInDb).toBeDefined();
  });

  it('should return 400 for invalid email', async () => {
    const invalidUser = {
      email: 'invalid-email',
      name: 'Test User'
    };

    const response = await request(app)
      .post('/api/users')
      .send(invalidUser)
      .expect(400);

    expect(response.body.error.code).toBe('VALIDATION_ERROR');
  });
});
```

## End-to-End Testing

### E2E Test Example

```javascript
describe('User Registration Flow', () => {
  let page;

  beforeAll(async () => {
    page = await browser.newPage();
  });

  afterAll(async () => {
    await page.close();
  });

  it('should allow user to register successfully', async () => {
    // Navigate to registration page
    await page.goto('http://localhost:3000/register');

    // Fill in the form
    await page.type('#email', 'newuser@example.com');
    await page.type('#password', 'SecurePass123!');
    await page.type('#confirmPassword', 'SecurePass123!');

    // Submit form
    await page.click('button[type="submit"]');

    // Wait for success message
    await page.waitForSelector('.success-message');
    const message = await page.$eval('.success-message', el => el.textContent);
    expect(message).toContain('Registration successful');

    // Verify redirection
    const url = page.url();
    expect(url).toBe('http://localhost:3000/dashboard');
  });
});
```

## Test Data Management

### Fixtures

```javascript
// fixtures/users.js
export const validUser = {
  email: 'user@example.com',
  name: 'John Doe',
  age: 30
};

export const adminUser = {
  email: 'admin@example.com',
  name: 'Admin User',
  role: 'admin'
};

// Usage in tests
import { validUser } from './fixtures/users';

test('creates user with valid data', async () => {
  const result = await userService.create(validUser);
  expect(result.email).toBe(validUser.email);
});
```

### Factory Pattern

```javascript
// factories/userFactory.js
class UserFactory {
  static create(overrides = {}) {
    return {
      id: generateId(),
      email: `user${Date.now()}@example.com`,
      name: 'Test User',
      createdAt: new Date(),
      ...overrides
    };
  }

  static createMany(count, overrides = {}) {
    return Array.from({ length: count }, () => this.create(overrides));
  }
}

// Usage
const user = UserFactory.create({ name: 'Alice' });
const users = UserFactory.createMany(5);
```

## Mocking and Stubbing

### Mocking Dependencies

```javascript
// Mock external service
jest.mock('./emailService');

describe('UserService', () => {
  it('sends welcome email on user creation', async () => {
    // Setup
    const emailService = require('./emailService');
    emailService.sendWelcome.mockResolvedValue(true);
    
    const userService = new UserService(userRepository, emailService);
    
    // Test
    await userService.createUser({ email: 'user@example.com' });
    
    // Verify
    expect(emailService.sendWelcome).toHaveBeenCalledWith('user@example.com');
  });
});
```

### Stubbing Responses

```javascript
describe('API Integration', () => {
  it('handles API timeout', async () => {
    // Stub API to timeout
    nock('https://api.example.com')
      .get('/data')
      .delayConnection(5000)
      .reply(200, { data: 'success' });

    const client = new APIClient({ timeout: 1000 });
    
    await expect(client.getData()).rejects.toThrow('Timeout');
  });
});
```

## Code Coverage

### Coverage Goals

- **Overall Coverage**: Aim for 80%+ overall
- **Critical Code**: 90%+ for business logic
- **New Code**: 90%+ for new features
- **UI Code**: Lower thresholds acceptable (60-70%)

### Coverage Configuration

```json
{
  "coverage": {
    "branches": 80,
    "functions": 80,
    "lines": 80,
    "statements": 80
  },
  "coveragePathIgnorePatterns": [
    "/node_modules/",
    "/tests/",
    "/dist/"
  ]
}
```

### What NOT to Test

- Framework/library code
- Configuration files
- Simple getters/setters
- Generated code
- Third-party integrations (use integration tests instead)

## Testing Best Practices

### 1. Test Independence

✅ **Good:**
```javascript
beforeEach(() => {
  database.clear();
  // Each test starts with clean state
});

test('test 1', () => {
  const user = createUser();
  expect(user).toBeDefined();
});

test('test 2', () => {
  const user = createUser();
  expect(user).toBeDefined();
});
```

❌ **Bad:**
```javascript
let user; // Shared state

test('test 1', () => {
  user = createUser(); // Modifies shared state
});

test('test 2', () => {
  expect(user).toBeDefined(); // Depends on test 1
});
```

### 2. One Assertion Concept Per Test

```javascript
// Each test validates one concept
test('user creation sets correct fields', () => {
  const user = createUser({ name: 'Alice', email: 'alice@example.com' });
  expect(user.name).toBe('Alice');
  expect(user.email).toBe('alice@example.com');
  expect(user.createdAt).toBeInstanceOf(Date);
});

test('user creation generates unique ID', () => {
  const user1 = createUser();
  const user2 = createUser();
  expect(user1.id).not.toBe(user2.id);
});
```

### 3. Test Edge Cases

```javascript
describe('divide', () => {
  it('should divide positive numbers', () => {
    expect(divide(10, 2)).toBe(5);
  });

  it('should handle negative numbers', () => {
    expect(divide(-10, 2)).toBe(-5);
  });

  it('should handle zero numerator', () => {
    expect(divide(0, 5)).toBe(0);
  });

  it('should throw error for division by zero', () => {
    expect(() => divide(10, 0)).toThrow('Division by zero');
  });

  it('should handle decimal results', () => {
    expect(divide(10, 3)).toBeCloseTo(3.333, 2);
  });
});
```

### 4. Use Descriptive Error Messages

```javascript
expect(result.status).toBe(200); // Generic

expect(result.status).toBe(200); // Better: use custom matcher
expect(result).toHaveStatus(200);

// Or add custom message
expect(result.status).toBe(200, 'Expected successful API response');
```

## Common Testing Anti-Patterns

### ❌ Don't Do This

1. **Testing Implementation Details**
```javascript
// Bad - tests internal implementation
expect(userService._hashPassword).toHaveBeenCalled();

// Good - tests behavior
expect(storedUser.password).not.toBe(rawPassword);
```

2. **Overly Complex Tests**
```javascript
// Bad - too complex
test('complex flow', () => {
  // 100 lines of setup and assertions
});

// Good - break into smaller tests
test('step 1: validates input', () => {...});
test('step 2: processes data', () => {...});
test('step 3: returns result', () => {...});
```

3. **Fragile Tests**
```javascript
// Bad - breaks if order changes
expect(users[0].name).toBe('Alice');

// Good - finds specific user
expect(users.find(u => u.name === 'Alice')).toBeDefined();
```

4. **Not Testing Error Cases**
```javascript
// Bad - only tests happy path
test('creates user', () => {
  const user = createUser(validData);
  expect(user).toBeDefined();
});

// Good - tests error cases too
test('throws error for invalid email', () => {
  expect(() => createUser({ email: 'invalid' }))
    .toThrow('Invalid email');
});
```

## Test Checklist

Before considering tests complete:

- [ ] All critical paths tested
- [ ] Edge cases covered
- [ ] Error conditions tested
- [ ] Tests are independent
- [ ] Tests are repeatable
- [ ] Tests have clear names
- [ ] No test interdependencies
- [ ] Mocks are appropriate
- [ ] Coverage meets requirements
- [ ] Tests run quickly
- [ ] No flaky tests
- [ ] CI/CD integration working

---

**Remember**: Good tests are fast, independent, repeatable, self-validating, and timely (F.I.R.S.T principles).

## Additional Resources

- [Coding Standards](implementation-core.md) - Code quality guidelines
- [API Guidelines](api-design.md) - API testing standards
- [Project Guide](PROJECT_GUIDE_TEMPLATE.md) - Project documentation
- [Contributing](../CONTRIBUTING_TEMPLATE.md) - How to contribute


