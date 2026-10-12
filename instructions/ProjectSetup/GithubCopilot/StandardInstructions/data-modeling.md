# Data Modeling and Database Design Guide

> Data modeling patterns and database design best practices for scalable, maintainable data layers

## Table of Contents

- [Project Data Context](#project-data-context)
- [Entity/Model Design](#entitymodel-design)
- [Database Schema Design](#database-schema-design)
- [Relationships](#relationships)
- [Indexing Strategy](#indexing-strategy)
- [Query Optimization](#query-optimization)
- [Migration Management](#migration-management)
- [Data Integrity](#data-integrity)
- [Performance Best Practices](#performance-best-practices)
- [Common Anti-Patterns](#common-anti-patterns)

## Project Data Context

**Customize this section for your project:**

- **Database**: [PostgreSQL, MySQL, MongoDB, SQL Server, etc.]
- **ORM/ODM**: [Sequelize, TypeORM, Django ORM, Entity Framework, Mongoose, etc.]
- **Migration Tool**: [Alembic, Flyway, EF Core Migrations, Sequelize, etc.]
- **Architecture**: [Code-First, Database-First, Repository Pattern, etc.]

## Entity/Model Design

### Base Entity Pattern

**Common Fields for All Entities:**
```javascript
// Base model with common fields
class BaseModel {
  id: UUID;           // Primary key
  createdAt: Date;    // Creation timestamp
  updatedAt: Date;    // Last update timestamp
  isDeleted: boolean; // Soft delete flag (optional)
  version: number;    // Optimistic concurrency (optional)
}

// Example implementation
export class User extends BaseModel {
  email: string;
  name: string;
  // User-specific fields
}
```

### Primary Key Strategies

**Auto-Increment Integers:**
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL
);
```
- **Pros**: Simple, sequential, compact
- **Cons**: Predictable, reveals record count, not globally unique
- **Use for**: Internal systems, low-scale applications

**UUIDs/GUIDs:**
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL
);
```
- **Pros**: Globally unique, non-sequential, distributed-friendly
- **Cons**: Larger storage, harder to debug, index performance considerations
- **Use for**: Distributed systems, public APIs, security-sensitive applications

**Composite Keys:**
```sql
CREATE TABLE user_roles (
  user_id INT,
  role_id INT,
  PRIMARY KEY (user_id, role_id)
);
```
- **Pros**: Natural relationships, referential integrity
- **Cons**: Complex joins, harder to maintain
- **Use for**: Junction tables, multi-tenancy

## Database Schema Design

### Normalization

**First Normal Form (1NF):**
- Atomic values (no arrays/lists in columns)
- Each row is unique
- Each column has a unique name

```sql
-- ❌ Bad - Violates 1NF
CREATE TABLE users (
  id INT PRIMARY KEY,
  phone_numbers TEXT -- "555-1234, 555-5678"
);

-- ✅ Good - 1NF compliant
CREATE TABLE users (
  id INT PRIMARY KEY,
  name VARCHAR(100)
);

CREATE TABLE phone_numbers (
  id INT PRIMARY KEY,
  user_id INT,
  phone_number VARCHAR(20),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

**Second Normal Form (2NF):**
- Meets 1NF
- No partial dependencies on composite keys

**Third Normal Form (3NF):**
- Meets 2NF
- No transitive dependencies
- Non-key attributes depend only on primary key

### When to Denormalize

Consider denormalization when:
- Read performance is critical
- Data is read-heavy, write-light
- Aggregations are frequent
- Joins are expensive
- Acceptable trade-off for your use case

```sql
-- Denormalized: Store calculated order total
CREATE TABLE orders (
  id INT PRIMARY KEY,
  user_id INT,
  total_amount DECIMAL(10,2), -- Denormalized for performance
  created_at TIMESTAMP
);

-- Keep normalized order_items for detail
CREATE TABLE order_items (
  id INT PRIMARY KEY,
  order_id INT,
  product_id INT,
  quantity INT,
  unit_price DECIMAL(10,2),
  subtotal DECIMAL(10,2)
);
```

## Relationships

### One-to-One (1:1)

```sql
-- User and Profile
CREATE TABLE users (
  id INT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE profiles (
  id INT PRIMARY KEY,
  user_id INT UNIQUE NOT NULL,
  bio TEXT,
  avatar_url VARCHAR(500),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### One-to-Many (1:N)

```sql
-- User has many Posts
CREATE TABLE users (
  id INT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE posts (
  id INT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_posts_user_id ON posts(user_id);
```

### Many-to-Many (M:N)

```sql
-- Students and Courses (with junction table)
CREATE TABLE students (
  id INT PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);

CREATE TABLE courses (
  id INT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  code VARCHAR(20) UNIQUE NOT NULL
);

CREATE TABLE student_courses (
  student_id INT,
  course_id INT,
  enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  grade CHAR(2),
  PRIMARY KEY (student_id, course_id),
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);
```

## Indexing Strategy

### When to Create Indexes

✅ **Index these:**
- Primary keys (automatic)
- Foreign keys (manual, usually needed)
- Frequently queried columns
- Columns in WHERE clauses
- Columns in JOIN conditions
- Columns in ORDER BY
- Columns in GROUP BY
- Unique constraints

❌ **Don't index:**
- Small tables (< 1000 rows)
- Columns rarely used in queries
- Columns with very low selectivity (e.g., boolean flags)
- Tables with frequent writes and rare reads

### Index Types

```sql
-- B-Tree Index (default, most common)
CREATE INDEX idx_users_email ON users(email);

-- Unique Index
CREATE UNIQUE INDEX idx_users_email_unique ON users(email);

-- Composite Index (order matters!)
CREATE INDEX idx_posts_user_created ON posts(user_id, created_at DESC);

-- Partial Index (PostgreSQL) - index only active users
CREATE INDEX idx_active_users ON users(email) WHERE is_active = true;

-- Full-Text Index
CREATE FULLTEXT INDEX idx_posts_content ON posts(title, content);

-- JSON Index (PostgreSQL)
CREATE INDEX idx_metadata ON products USING GIN (metadata);
```

### Composite Index Best Practices

```sql
-- Order matters: most selective column first
CREATE INDEX idx_orders_status_date ON orders(status, created_at);

-- Good for queries like:
SELECT * FROM orders WHERE status = 'pending' ORDER BY created_at DESC;

-- Not effective for:
SELECT * FROM orders WHERE created_at > '2024-01-01'; -- created_at not first
```

## Query Optimization

### Avoid N+1 Queries

```javascript
// ❌ Bad - N+1 query problem
const users = await User.findAll();
for (const user of users) {
  user.posts = await Post.findAll({ where: { userId: user.id } });
}

// ✅ Good - Single query with join
const users = await User.findAll({
  include: [{ model: Post }]
});

// ✅ Good - Two queries (better than N+1)
const users = await User.findAll();
const userIds = users.map(u => u.id);
const posts = await Post.findAll({ where: { userId: userIds } });
```

### Use Pagination

```sql
-- Always paginate large result sets
SELECT * FROM users
ORDER BY created_at DESC
LIMIT 20 OFFSET 0;

-- Better: Use cursor-based pagination for large datasets
SELECT * FROM users
WHERE created_at < '2024-01-15T10:00:00Z'
ORDER BY created_at DESC
LIMIT 20;
```

### Select Only Needed Columns

```sql
-- ❌ Bad - Select everything
SELECT * FROM users WHERE id = 123;

-- ✅ Good - Select specific columns
SELECT id, email, name FROM users WHERE id = 123;
```

### Use EXPLAIN to Analyze Queries

```sql
EXPLAIN ANALYZE
SELECT u.name, COUNT(p.id) as post_count
FROM users u
LEFT JOIN posts p ON u.id = p.user_id
GROUP BY u.id, u.name
ORDER BY post_count DESC;
```

## Migration Management

### Migration Best Practices

**1. Always Create Reversible Migrations:**
```javascript
// Good migration structure
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      }
    });
  },
  
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('users');
  }
};
```

**2. Test Migrations:**
```bash
# Test up migration
npm run migrate

# Test down migration
npm run migrate:undo

# Re-run up migration
npm run migrate
```

**3. Handle Data Migrations Carefully:**
```javascript
// Adding a column with default value
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add column with default
    await queryInterface.addColumn('users', 'status', {
      type: Sequelize.STRING,
      defaultValue: 'active',
      allowNull: false
    });
    
    // Update existing rows if needed
    await queryInterface.sequelize.query(
      `UPDATE users SET status = 'active' WHERE status IS NULL`
    );
  },
  
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users', 'status');
  }
};
```

## Data Integrity

### Constraints

```sql
-- Primary Key
id INT PRIMARY KEY AUTO_INCREMENT

-- Foreign Key with cascading
user_id INT NOT NULL,
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE

-- Unique Constraint
email VARCHAR(255) UNIQUE NOT NULL

-- Check Constraint
age INT CHECK (age >= 18 AND age <= 120)
price DECIMAL(10,2) CHECK (price > 0)

-- Not Null
created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP

-- Default Values
status VARCHAR(20) DEFAULT 'pending'
```

### Soft Deletes

```sql
-- Add is_deleted column instead of actually deleting
ALTER TABLE users ADD COLUMN is_deleted BOOLEAN DEFAULT false;

-- "Delete" operation
UPDATE users SET is_deleted = true WHERE id = 123;

-- Query active records
SELECT * FROM users WHERE is_deleted = false;

-- Index for performance
CREATE INDEX idx_users_active ON users(id) WHERE is_deleted = false;
```

### Audit Trail

```sql
-- Audit table pattern
CREATE TABLE user_audit (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  action VARCHAR(20) NOT NULL, -- INSERT, UPDATE, DELETE
  old_values JSON,
  new_values JSON,
  changed_by INT,
  changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

## Performance Best Practices

### Connection Pooling

```javascript
// Configure connection pool
const pool = new Pool({
  host: 'localhost',
  database: 'mydb',
  user: 'dbuser',
  password: 'password',
  max: 20,           // Maximum pool size
  min: 5,            // Minimum pool size
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000
});
```

### Batch Operations

```javascript
// ❌ Bad - Individual inserts
for (const user of users) {
  await User.create(user);
}

// ✅ Good - Bulk insert
await User.bulkCreate(users);
```

### Use Transactions

```javascript
// Ensure data consistency with transactions
const transaction = await sequelize.transaction();

try {
  await User.create({ email: 'user@example.com' }, { transaction });
  await Profile.create({ userId: user.id }, { transaction });
  
  await transaction.commit();
} catch (error) {
  await transaction.rollback();
  throw error;
}
```

### Caching Strategy

```javascript
// Cache frequently accessed data
const cache = new Redis();

async function getUser(id) {
  // Check cache first
  const cached = await cache.get(`user:${id}`);
  if (cached) return JSON.parse(cached);
  
  // Query database
  const user = await User.findByPk(id);
  
  // Store in cache
  await cache.set(`user:${id}`, JSON.stringify(user), 'EX', 3600);
  
  return user;
}
```

## Common Anti-Patterns

### ❌ Don't Do This

1. **Using SELECT * **
```sql
-- Bad
SELECT * FROM users;

-- Good
SELECT id, email, name FROM users;
```

2. **No Indexes on Foreign Keys**
```sql
-- Bad
CREATE TABLE posts (
  id INT PRIMARY KEY,
  user_id INT -- Missing index
);

-- Good
CREATE TABLE posts (
  id INT PRIMARY KEY,
  user_id INT,
  INDEX idx_user_id (user_id)
);
```

3. **Storing JSON Blobs for Searchable Data**
```sql
-- Bad - Can't query efficiently
CREATE TABLE products (
  id INT PRIMARY KEY,
  details JSON -- All product info in JSON
);

-- Good - Normalize searchable fields
CREATE TABLE products (
  id INT PRIMARY KEY,
  name VARCHAR(255),
  price DECIMAL(10,2),
  additional_details JSON -- Only non-searchable extras
);
```

4. **Not Using Transactions for Related Operations**
```javascript
// Bad - Race condition possible
await User.create({ email: 'user@example.com' });
await Profile.create({ userId: user.id });

// Good - Use transaction
await sequelize.transaction(async (t) => {
  const user = await User.create({ email: 'user@example.com' }, { transaction: t });
  await Profile.create({ userId: user.id }, { transaction: t });
});
```

## Schema Design Checklist

- [ ] Primary keys defined for all tables
- [ ] Foreign keys with appropriate constraints
- [ ] Indexes on frequently queried columns
- [ ] Unique constraints where needed
- [ ] Not null constraints for required fields
- [ ] Default values for applicable columns
- [ ] Check constraints for data validation
- [ ] Proper data types (avoid TEXT for everything)
- [ ] Timestamp columns (created_at, updated_at)
- [ ] Soft delete column if needed
- [ ] Migrations are reversible
- [ ] Naming conventions followed

---

**Remember**: Good database design is crucial for application performance and maintainability. Plan your schema carefully and optimize based on actual usage patterns.

## Additional Resources

- [Coding Standards](implementation-core.md)
- [API Guidelines](api-design.md)
- [Security Guidelines](security.md)
- [Project Guide](PROJECT_GUIDE_TEMPLATE.md)


