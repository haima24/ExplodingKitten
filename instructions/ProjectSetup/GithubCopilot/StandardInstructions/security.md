# Security Guidelines

> Security best practices and implementation guidelines for building secure applications

## Table of Contents

- [Project Security Context](#project-security-context)
- [Security Principles](#security-principles)
- [Input Validation and Sanitization](#input-validation-and-sanitization)
- [Authentication and Authorization](#authentication-and-authorization)
- [Data Protection](#data-protection)
- [API Security](#api-security)
- [Secure Logging](#secure-logging)
- [Security Headers](#security-headers)
- [Common Vulnerabilities](#common-vulnerabilities)
- [Security Checklist](#security-checklist)

## Project Security Context

**Customize this section for your project:**

- **Framework**: [Specify framework and version]
- **Data Sensitivity**: [PII, financial, health data, etc.]
- **Compliance**: [GDPR, HIPAA, PCI-DSS, SOC 2, etc.]
- **Authentication**: [JWT, OAuth2, Session-based, etc.]
- **Deployment**: [AWS, Azure, GCP, On-premise, etc.]

## Security Principles

### Core Security Principles (CIA Triad)

1. **Confidentiality**: Protect data from unauthorized access
2. **Integrity**: Ensure data accuracy and prevent unauthorized modification
3. **Availability**: Ensure systems and data are accessible when needed

### Additional Principles

- **Defense in Depth**: Multiple layers of security
- **Least Privilege**: Minimum necessary access
- **Fail Securely**: Default to secure state on failure
- **Separation of Duties**: No single point of control
- **Keep It Simple**: Complexity is the enemy of security
- **Never Trust User Input**: Validate everything

## Input Validation and Sanitization

### Validation Rules

**Always Validate:**
- Data type and format
- Length and size limits
- Allowed characters (use allow-lists)
- Value ranges
- Required vs. optional fields

**Validation Layers:**
- Client-side (user experience)
- Server-side (security - ALWAYS required)
- Database constraints (data integrity)

### Common Validation Patterns

```javascript
// Email validation
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Phone number (US)
const phoneRegex = /^\+?1?\d{10}$/;

// Strong password
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// URL validation
const urlRegex = /^https?:\/\/[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;

// Alphanumeric only
const alphanumericRegex = /^[a-zA-Z0-9]+$/;
```

### Input Sanitization

**HTML Sanitization:**
```javascript
import DOMPurify from 'dompurify';

// Sanitize user HTML input
const clean = DOMPurify.sanitize(userInput, {
  ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p'],
  ALLOWED_ATTR: []
});
```

**SQL Injection Prevention:**
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

**Command Injection Prevention:**
```javascript
// ✅ Good - Use safe APIs
const file = fs.readFileSync(path.join(UPLOAD_DIR, filename));

// ❌ Bad - Shell command with user input
exec(`cat ${filename}`); // NEVER DO THIS
```

**Path Traversal Prevention:**
```javascript
// ✅ Good - Validate and canonicalize paths
const safePath = path.resolve(UPLOAD_DIR, filename);
if (!safePath.startsWith(UPLOAD_DIR)) {
  throw new Error('Invalid file path');
}

// ❌ Bad - Direct use of user input
fs.readFile(`./uploads/${filename}`); // Vulnerable to ../../../etc/passwd
```

## Authentication and Authorization

### Password Security

**Password Requirements:**
- Minimum 8 characters (12+ recommended)
- Require complexity (uppercase, lowercase, numbers, symbols)
- Check against common password lists
- Implement password strength meter
- Don't enforce frequent password changes

**Password Storage:**
```javascript
const bcrypt = require('bcrypt');

// ✅ Good - Hash with salt
const hashedPassword = await bcrypt.hash(password, 10);

// Verify password
const isValid = await bcrypt.compare(password, hashedPassword);

// ❌ Bad - Plain text or weak hashing
const password = userData.password; // NEVER STORE PLAIN TEXT
const md5Hash = md5(password); // MD5 IS NOT SECURE
```

**Password Reset:**
```javascript
// Generate secure reset token
const resetToken = crypto.randomBytes(32).toString('hex');
const tokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');

// Store token hash with expiration (15-60 minutes)
await db.users.update({
  resetTokenHash: tokenHash,
  resetTokenExpires: Date.now() + 3600000 // 1 hour
}, { where: { email } });

// Send token via email (send resetToken, store tokenHash)
await emailService.sendPasswordReset(email, resetToken);

// Don't hint whether email exists
return { message: 'If that email exists, you will receive a reset link' };
```

### Session Management

**Secure Session Configuration:**
```javascript
app.use(session({
  secret: process.env.SESSION_SECRET,
  name: 'sessionId', // Don't use default name
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,      // Prevent XSS access
    secure: true,        // HTTPS only
    sameSite: 'strict',  // CSRF protection
    maxAge: 3600000      // 1 hour
  }
}));
```

### JWT (JSON Web Tokens)

**JWT Best Practices:**
```javascript
const jwt = require('jsonwebtoken');

// ✅ Good - Create token with expiration
const token = jwt.sign(
  { userId: user.id, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: '1h', algorithm: 'HS256' }
);

// Verify token
try {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
} catch (err) {
  // Token invalid or expired
  throw new UnauthorizedError('Invalid token');
}

// ❌ Bad - No expiration, weak secret
const token = jwt.sign({ userId: user.id }, 'secret123');
```

**Token Storage:**
- **Server-side**: Secure, encrypted storage
- **Client-side**: HttpOnly cookies (not localStorage)
- **Mobile**: Secure storage (Keychain, Keystore)

### OAuth 2.0 Best Practices

```javascript
// Use authorization code flow with PKCE
const codeVerifier = generateCodeVerifier();
const codeChallenge = generateCodeChallenge(codeVerifier);

// Authorization request
const authUrl = `${authServer}/authorize?` +
  `client_id=${clientId}&` +
  `redirect_uri=${redirectUri}&` +
  `response_type=code&` +
  `state=${state}&` +
  `code_challenge=${codeChallenge}&` +
  `code_challenge_method=S256`;

// Token exchange
const tokenResponse = await fetch(`${authServer}/token`, {
  method: 'POST',
  body: new URLSearchParams({
    grant_type: 'authorization_code',
    code: authCode,
    redirect_uri: redirectUri,
    code_verifier: codeVerifier,
    client_id: clientId
  })
});
```

## Data Protection

### Encryption at Rest

**What to Encrypt:**
- Passwords (use hashing, not encryption)
- Personal Identifiable Information (PII)
- Financial data
- Health information
- API keys and secrets

**Encryption Example:**
```javascript
const crypto = require('crypto');

// Encrypt sensitive data
function encrypt(text, key) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-gcm', Buffer.from(key, 'hex'), iv);
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const authTag = cipher.getAuthTag();
  
  return {
    iv: iv.toString('hex'),
    encryptedData: encrypted,
    authTag: authTag.toString('hex')
  };
}

// Decrypt sensitive data
function decrypt(encrypted, key) {
  const decipher = crypto.createDecipheriv(
    'aes-256-gcm',
    Buffer.from(key, 'hex'),
    Buffer.from(encrypted.iv, 'hex')
  );
  
  decipher.setAuthTag(Buffer.from(encrypted.authTag, 'hex'));
  
  let decrypted = decipher.update(encrypted.encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}
```

### Encryption in Transit

**Always Use HTTPS:**
```javascript
// Redirect HTTP to HTTPS
app.use((req, res, next) => {
  if (!req.secure && process.env.NODE_ENV === 'production') {
    return res.redirect('https://' + req.headers.host + req.url);
  }
  next();
});

// Enforce HTTPS with HSTS
app.use(helmet.hsts({
  maxAge: 31536000, // 1 year
  includeSubDomains: true,
  preload: true
}));
```

## API Security

### Rate Limiting

```javascript
const rateLimit = require('express-rate-limit');

// General API rate limit
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
});

// Stricter limit for sensitive endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // 5 login attempts per 15 minutes
  skipSuccessfulRequests: true
});

app.use('/api/', apiLimiter);
app.use('/api/auth/', authLimiter);
```

### CORS Configuration

```javascript
const cors = require('cors');

// ✅ Good - Specific origins
app.use(cors({
  origin: ['https://example.com', 'https://app.example.com'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ❌ Bad - Allow all origins
app.use(cors({ origin: '*' })); // DON'T DO THIS
```

### Input Validation Middleware

```javascript
const { body, validationResult } = require('express-validator');

app.post('/api/users',
  [
    body('email').isEmail().normalizeEmail(),
    body('age').isInt({ min: 18, max: 120 }),
    body('password').isLength({ min: 8 }).matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)/)
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // Process request
  }
);
```

## Secure Logging

### What NOT to Log

❌ **Never log:**
- Passwords
- API keys / tokens
- Credit card numbers
- Social Security Numbers
- Session IDs
- Private keys
- Personal health information

### Safe Logging Practices

```javascript
// ✅ Good - Sanitized logging
logger.info('User login', {
  userId: user.id,
  email: maskEmail(user.email),
  ip: req.ip,
  timestamp: new Date()
});

// ❌ Bad - Logging sensitive data
logger.info('User login', {
  password: password,  // NEVER LOG PASSWORDS
  token: authToken     // NEVER LOG TOKENS
});

// Mask sensitive data
function maskEmail(email) {
  const [name, domain] = email.split('@');
  return `${name[0]}***@${domain}`;
}

function maskCreditCard(card) {
  return `****-****-****-${card.slice(-4)}`;
}
```

## Security Headers

### Essential Security Headers

```javascript
const helmet = require('helmet');

app.use(helmet({
  // Content Security Policy
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"]
    }
  },
  // Strict Transport Security
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  // X-Frame-Options
  frameguard: {
    action: 'deny'
  },
  // X-Content-Type-Options
  noSniff: true,
  // X-XSS-Protection
  xssFilter: true
}));
```

## Common Vulnerabilities

### XSS (Cross-Site Scripting) Prevention

```javascript
// ✅ Good - Escape output
function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Use templating engines that auto-escape
// React, Vue, Angular auto-escape by default
```

### CSRF Prevention

```javascript
const csrf = require('csurf');

// Use CSRF protection middleware
app.use(csrf({ cookie: true }));

// Include CSRF token in forms
app.get('/form', (req, res) => {
  res.render('form', { csrfToken: req.csrfToken() });
});

// Validate token on submission
app.post('/submit', (req, res) => {
  // CSRF middleware validates automatically
  // Process form
});
```

### SQL Injection Prevention

```javascript
// ✅ Good - Parameterized queries
const users = await db.query(
  'SELECT * FROM users WHERE email = ? AND status = ?',
  [email, status]
);

// ✅ Good - ORM
const users = await User.findAll({
  where: { email, status }
});

// ❌ Bad - String concatenation
const query = `SELECT * FROM users WHERE email = '${email}'`; // VULNERABLE
```

## Security Checklist

### Development Phase

- [ ] Input validation on all user inputs
- [ ] Output encoding/escaping
- [ ] Parameterized queries for database
- [ ] Secure password hashing (bcrypt, Argon2)
- [ ] HTTPS enforced
- [ ] Security headers configured
- [ ] CORS properly configured
- [ ] Rate limiting implemented
- [ ] Authentication & authorization tested
- [ ] Sensitive data encrypted
- [ ] Secure session management
- [ ] No sensitive data in logs
- [ ] No secrets in code (use environment variables)

### Deployment Phase

- [ ] SSL/TLS certificate configured
- [ ] Security headers verified
- [ ] Rate limiting active
- [ ] Logging and monitoring configured
- [ ] Regular security updates scheduled
- [ ] Backup and recovery tested
- [ ] Access controls reviewed
- [ ] Security scan performed
- [ ] Penetration testing completed
- [ ] Incident response plan documented

### Ongoing Maintenance

- [ ] Regular dependency updates
- [ ] Security patches applied promptly
- [ ] Access reviews performed
- [ ] Logs monitored for suspicious activity
- [ ] Security audits scheduled
- [ ] Team security training updated

---

**Remember**: Security is not a one-time task but an ongoing process. Stay informed about new vulnerabilities and best practices.

## Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
- [Coding Standards](implementation-core.md)
- [API Guidelines](api-design.md)
- [Project Guide](PROJECT_GUIDE_TEMPLATE.md)


