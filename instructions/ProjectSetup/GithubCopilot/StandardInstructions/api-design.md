# API Design Guidelines

> Standards and best practices for building professional REST APIs

## Table of Contents

- [Project API Context](#project-api-context)
- [RESTful Design Principles](#restful-design-principles)
- [HTTP Methods and Status Codes](#http-methods-and-status-codes)
- [Request and Response Design](#request-and-response-design)
- [Input Validation](#input-validation)
- [Error Handling](#error-handling)
- [API Documentation](#api-documentation)
- [File Upload Handling](#file-upload-handling)
- [API Versioning](#api-versioning)
- [Pagination](#pagination)
- [Filtering, Sorting, and Searching](#filtering-sorting-and-searching)
- [Rate Limiting](#rate-limiting)
- [Security Best Practices](#security-best-practices)
- [Testing Considerations](#testing-considerations)
- [Anti-Patterns to Avoid](#anti-patterns-to-avoid)

## Project API Context

**Customize this section for your project:**

- **Framework**: [e.g., Express, FastAPI, ASP.NET Core, Spring Boot]
- **Documentation**: [e.g., Swagger/OpenAPI, API Blueprint]
- **Architecture**: [e.g., RESTful, GraphQL, gRPC]
- **Response Format**: [e.g., JSON, XML, Protocol Buffers]
- **Authentication**: [e.g., JWT, OAuth2, API Keys]

## RESTful Design Principles

### Resource-Based URL Design

✅ **Good Examples:**
```
GET    /api/users                     # List users
GET    /api/users/{id}                # Get specific user
POST   /api/users                     # Create new user
PUT    /api/users/{id}                # Update entire user
PATCH  /api/users/{id}                # Partial update user
DELETE /api/users/{id}                # Delete user

GET    /api/users/{id}/posts          # Get user's posts
POST   /api/users/{id}/posts          # Create post for user
GET    /api/posts/{id}/comments       # Get post's comments
```

❌ **Avoid:**
```
GET    /api/getUser/{id}              # Don't use verbs in URLs
POST   /api/users/create              # POST implies creation
GET    /api/user-by-id/{id}           # Use resource names
POST   /api/deleteUser                # Use DELETE method
GET    /api/users/list                # GET /api/users is sufficient
```

## HTTP Methods and Status Codes

### HTTP Methods Usage

| Method | Purpose | Idempotent | Safe | Request Body | Response Body |
|--------|---------|-----------|------|--------------|---------------|
| GET | Retrieve resources | Yes | Yes | No | Yes |
| POST | Create resource | No | No | Yes | Yes |
| PUT | Replace resource | Yes | No | Yes | Yes |
| PATCH | Update resource partially | No | No | Yes | Yes |
| DELETE | Remove resource | Yes | No | Optional | Optional |
| HEAD | GET without body | Yes | Yes | No | No |
| OPTIONS | Get allowed methods | Yes | Yes | No | Yes |

### HTTP Status Codes

**Success Responses:**
- `200 OK` - Successful GET, PUT, PATCH, or DELETE
- `201 Created` - Successful POST that creates a resource
- `202 Accepted` - Request accepted but processing not complete
- `204 No Content` - Successful DELETE or PUT with no response body

**Client Error Responses:**
- `400 Bad Request` - Invalid request syntax or validation error
- `401 Unauthorized` - Authentication required or failed
- `403 Forbidden` - Authenticated but not authorized
- `404 Not Found` - Resource doesn't exist
- `405 Method Not Allowed` - HTTP method not supported
- `409 Conflict` - Request conflicts with current state
- `422 Unprocessable Entity` - Validation errors (business rules)
- `429 Too Many Requests` - Rate limit exceeded

**Server Error Responses:**
- `500 Internal Server Error` - Generic server error
- `502 Bad Gateway` - Invalid response from upstream server
- `503 Service Unavailable` - Temporary overload or maintenance
- `504 Gateway Timeout` - Upstream server timeout

## Request and Response Design

### Request Structure

**Query Parameters** (filtering, sorting, pagination):
```
GET /api/users?status=active&sort=created_at&order=desc&page=1&limit=20
```

**Path Parameters** (resource identification):
```
GET /api/users/{userId}/posts/{postId}
```

**Request Body** (creating/updating):
```json
POST /api/users
{
  "email": "user@example.com",
  "fullName": "John Doe",
  "age": 30,
  "preferences": {
    "newsletter": true,
    "notifications": false
  }
}
```

### Response Structure

**Single Resource:**
```json
{
  "id": "123",
  "email": "user@example.com",
  "fullName": "John Doe",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-20T14:45:00Z"
}
```

**Collection Response:**
```json
{
  "data": [
    { "id": "1", "name": "Item 1" },
    { "id": "2", "name": "Item 2" }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "totalItems": 150,
    "totalPages": 8
  },
  "links": {
    "self": "/api/users?page=1",
    "next": "/api/users?page=2",
    "last": "/api/users?page=8"
  }
}
```

## Input Validation

### Validation Levels

**Format Validation:**
- Data types (string, number, boolean, date)
- String length constraints
- Number ranges
- Date formats
- Regular expression patterns
- Email addresses, URLs

**Business Rule Validation:**
- Unique constraints (email must be unique)
- Cross-field validation (end date after start date)
- Status transitions (can't cancel completed order)
- Resource existence (referenced user must exist)
- Permissions and authorization

### Validation Response Pattern

```json
HTTP/1.1 400 Bad Request
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed",
    "details": [
      {
        "field": "email",
        "value": "invalid-email",
        "message": "Must be a valid email address",
        "code": "INVALID_FORMAT"
      }
    ]
  }
}
```

## Error Handling

### Consistent Error Format

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": [/* Additional context */],
    "documentation_url": "https://docs.api.com/errors/ERROR_CODE"
  },
  "requestId": "unique-request-id",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Error Response Examples

**Validation Error (400):**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "One or more fields are invalid",
    "details": [
      {"field": "email", "message": "Invalid email format"},
      {"field": "age", "message": "Must be at least 18"}
    ]
  }
}
```

**Authentication Error (401):**
```json
{
  "error": {
    "code": "AUTHENTICATION_REQUIRED",
    "message": "Authentication token is missing or invalid"
  }
}
```

**Authorization Error (403):**
```json
{
  "error": {
    "code": "INSUFFICIENT_PERMISSIONS",
    "message": "You don't have permission to perform this action"
  }
}
```

**Not Found Error (404):**
```json
{
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "User with ID '123' not found"
  }
}
```

**Server Error (500):**
```json
{
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "An unexpected error occurred. Please try again later.",
    "requestId": "abc-123"
  }
}
```

## API Documentation

### Endpoint Documentation Template

```markdown
### [Endpoint Name]

**Endpoint:** `[METHOD] /api/[resource]`

**Description:** [What this endpoint does]

**Authentication:** [Required/Optional, method]

**Request Headers:**
- `Authorization`: Bearer {token}
- `Content-Type`: application/json

**Path Parameters:**
- `id` (string, required): Resource identifier

**Query Parameters:**
- `page` (integer, optional): Page number (default: 1)
- `limit` (integer, optional): Items per page (default: 20)

**Request Body:**
```json
{
  "field1": "string (required)",
  "field2": "number (optional)"
}
```

**Success Response (200 OK):**
```json
{
  "id": "123",
  "field1": "value"
}
```

**Error Responses:**
- `400 Bad Request`: Invalid input
- `401 Unauthorized`: Missing authentication
- `404 Not Found`: Resource not found

**Example Request:**
```bash
curl -X POST https://api.example.com/api/users \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com"}'
```
```

### OpenAPI/Swagger Documentation

Use OpenAPI specification:
- Define all endpoints, parameters, and responses
- Include examples
- Document authentication requirements
- Provide schema definitions
- Generate interactive documentation

## File Upload Handling

### File Upload Endpoint

```
POST /api/documents/upload
Content-Type: multipart/form-data

Fields:
- file: binary file data
- metadata: JSON string with file metadata
```

### File Upload Security Checklist

- [ ] Validate file size (enforce maximum)
- [ ] Validate file type (MIME type and extension)
- [ ] Scan file content headers
- [ ] Sanitize filename
- [ ] Use virus scanning (if applicable)
- [ ] Store files outside web root
- [ ] Generate unique filenames
- [ ] Implement rate limiting

**Response:**
```json
{
  "id": "file_123",
  "filename": "document.pdf",
  "size": 1048576,
  "mimeType": "application/pdf",
  "url": "https://cdn.example.com/files/abc123.pdf",
  "uploadedAt": "2024-01-15T10:30:00Z"
}
```

## API Versioning

### 1. URL Path Versioning (Recommended)
```
GET /api/v1/users
GET /api/v2/users
```
**Pros:** Clear, easy to route  
**Cons:** URL proliferation

### 2. Header Versioning
```
GET /api/users
Accept: application/vnd.api.v2+json
```
**Pros:** Clean URLs  
**Cons:** Less visible

### 3. Query Parameter Versioning
```
GET /api/users?version=2
```
**Pros:** Simple  
**Cons:** Can be overlooked

## Pagination

### Offset-Based Pagination
```
GET /api/users?page=2&limit=20

Response:
{
  "data": [...],
  "pagination": {
    "page": 2,
    "pageSize": 20,
    "totalItems": 150,
    "totalPages": 8
  }
}
```

### Cursor-Based Pagination (for large datasets)
```
GET /api/users?cursor=eyJpZCI6MTAwfQ&limit=20

Response:
{
  "data": [...],
  "pagination": {
    "nextCursor": "eyJpZCI6MTIwfQ",
    "hasMore": true
  }
}
```

## Filtering, Sorting, and Searching

### Filtering
```
GET /api/users?status=active&role=admin&created_after=2024-01-01
```

### Sorting
```
GET /api/users?sort=created_at&order=desc
GET /api/users?sort=-created_at  # Minus for descending
```

### Searching
```
GET /api/users?q=john&search_fields=name,email
```

### Field Selection
```
GET /api/users?fields=id,name,email
```

## Rate Limiting

### Rate Limit Headers
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1705320600
Retry-After: 3600
```

### Rate Limit Exceeded Response
```
HTTP/1.1 429 Too Many Requests
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "API rate limit exceeded. Try again in 1 hour.",
    "retryAfter": 3600
  }
}
```

## Security Best Practices

### Authentication
- Use industry-standard methods (OAuth 2.0, JWT)
- Implement token expiration and refresh
- Use HTTPS for all API calls
- Store tokens securely
- Implement logout/revocation

### Authorization
- Implement role-based access control (RBAC)
- Validate permissions on every request
- Use least privilege principle
- Don't trust client-provided user IDs

### Input Security
- Validate all inputs
- Sanitize user-provided data
- Use parameterized queries
- Implement CSRF protection
- Validate content-type headers

### Rate Limiting and Throttling
- Implement per-user rate limits
- Use stricter limits for expensive operations
- Implement DDoS protection
- Monitor for abuse patterns

See [Security Guidelines](security.md) for comprehensive security practices.

## Testing Considerations

### Test Scenarios
- Happy path tests (valid inputs)
- Invalid input tests (validation)
- Authentication/authorization tests
- Rate limiting tests
- Error handling tests
- Performance/load tests

### Test Documentation
- Provide example requests and responses
- Document test data requirements
- Include authentication setup
- Provide test environment details

See [Testing Guide](unit-testing.md) for testing best practices.

## Anti-Patterns to Avoid

### ❌ Don't Do This

1. Exposing internal implementation details in URLs
2. Using different response structures for same resource
3. Ignoring HTTP methods and status codes
4. Returning 200 OK for errors
5. Including sensitive data in error messages
6. Not implementing proper pagination
7. Inconsistent naming conventions
8. Missing or poor error messages
9. No API versioning strategy
10. Ignoring security headers

### ✅ Do This Instead

1. Use resource-based URLs
2. Maintain consistent response structure
3. Use appropriate HTTP methods and status codes
4. Return correct status codes for errors
5. Sanitize error messages for production
6. Implement pagination for all list endpoints
7. Follow consistent naming (camelCase or snake_case)
8. Provide clear, actionable error messages
9. Plan versioning from day one
10. Implement security best practices

## API Documentation Checklist

- [ ] All endpoints documented
- [ ] Request/response examples provided
- [ ] Authentication requirements specified
- [ ] Error responses documented
- [ ] Rate limits documented
- [ ] Versioning strategy explained
- [ ] Example code provided (curl, SDK)
- [ ] Change log maintained
- [ ] Migration guides for breaking changes
- [ ] Interactive API explorer (Swagger UI)

---

**Remember**: A well-designed API is intuitive, consistent, well-documented, and follows RESTful principles. Think from the API consumer's perspective.

## Additional Resources

- [Coding Standards](implementation-core.md) - Core implementation patterns
- [Security Guidelines](security.md) - Security best practices
- [Testing Guide](unit-testing.md) - Testing standards
- [Project Guide](PROJECT_GUIDE_TEMPLATE.md) - Comprehensive documentation


