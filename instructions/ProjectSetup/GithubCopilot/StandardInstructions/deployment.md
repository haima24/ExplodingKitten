# Deployment and DevOps Guide

> Best practices for deploying and operating reliable, scalable applications

## Table of Contents

- [Project Deployment Context](#project-deployment-context)
- [Containerization](#containerization)
- [CI/CD Pipeline](#cicd-pipeline)
- [Environment Configuration](#environment-configuration)
- [Deployment Strategies](#deployment-strategies)
- [Monitoring and Logging](#monitoring-and-logging)
- [Backup and Recovery](#backup-and-recovery)
- [Security Considerations](#security-considerations)
- [Performance Optimization](#performance-optimization)
- [Incident Response](#incident-response)

## Project Deployment Context

**Customize this section for your project:**

- **Platform**: [AWS, Azure, GCP, Heroku, DigitalOcean, etc.]
- **Deployment Method**: [Docker, Kubernetes, Serverless, VM, etc.]
- **CI/CD**: [GitHub Actions, GitLab CI, Jenkins, CircleCI, etc.]
- **Monitoring**: [Datadog, New Relic, Application Insights, etc.]
- **Infrastructure**: [Terraform, CloudFormation, Pulumi, Manual, etc.]

## Containerization

### Multi-Stage Dockerfile

**Production-Ready Dockerfile:**
```dockerfile
# Build stage
FROM node:20-alpine AS builder
WORKDIR /app

# Copy dependency files first (leverage caching)
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine AS production
WORKDIR /app

# Create non-root user
RUN addgroup --gid 1001 appgroup && \
    adduser --disabled-password --gecos '' --uid 1001 --gid 1001 appuser

# Copy built application
COPY --from=builder --chown=appuser:appgroup /app/dist ./dist
COPY --from=builder --chown=appuser:appgroup /app/node_modules ./node_modules
COPY --chown=appuser:appgroup package*.json ./

# Switch to non-root user
USER appuser

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD node healthcheck.js

# Expose port
EXPOSE 3000

# Start application
CMD ["node", "dist/main.js"]
```

### Dockerfile Best Practices

- ✅ Use specific image versions (not `latest`)
- ✅ Use smaller base images (alpine variants)
- ✅ Minimize layers (combine RUN commands)
- ✅ Order instructions from least to most frequently changing
- ✅ Use .dockerignore to exclude unnecessary files
- ✅ Don't run as root user
- ✅ Include health checks
- ✅ Set proper environment variables

**.dockerignore:**
```
node_modules
npm-debug.log
.git
.env
.env.local
*.md
tests
.gitignore
Dockerfile
docker-compose.yml
```

### Docker Compose

**Development Environment:**
```yaml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile.dev
    ports:
      - "${APP_PORT:-3000}:3000"
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgres://user:pass@db:5432/myapp
      - REDIS_URL=redis://redis:6379
    volumes:
      - .:/app
      - /app/node_modules
    depends_on:
      - db
      - redis
    networks:
      - app-network
    command: npm run dev

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
      - POSTGRES_DB=myapp
    ports:
      - "5432:5432"
    volumes:
      - db-data:/var/lib/postgresql/data
    networks:
      - app-network

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    networks:
      - app-network

volumes:
  db-data:

networks:
  app-network:
    driver: bridge
```

## CI/CD Pipeline

### GitHub Actions Example

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Lint
      run: npm run lint
    
    - name: Type check
      run: npm run type-check
    
    - name: Run tests
      run: npm test
      env:
        DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test
    
    - name: Upload coverage
      uses: codecov/codecov-action@v3

  build-and-push:
    needs: test
    runs-on: ubuntu-latest
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    
    permissions:
      contents: read
      packages: write
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Log in to Container Registry
      uses: docker/login-action@v3
      with:
        registry: ${{ env.REGISTRY }}
        username: ${{ github.actor }}
        password: ${{ secrets.GITHUB_TOKEN }}
    
    - name: Extract metadata
      id: meta
      uses: docker/metadata-action@v5
      with:
        images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
        tags: |
          type=sha,prefix={{branch}}-
          type=ref,event=branch
          type=semver,pattern={{version}}
    
    - name: Build and push
      uses: docker/build-push-action@v5
      with:
        context: .
        push: true
        tags: ${{ steps.meta.outputs.tags }}
        labels: ${{ steps.meta.outputs.labels }}

  deploy:
    needs: build-and-push
    runs-on: ubuntu-latest
    environment: production
    
    steps:
    - name: Deploy to production
      run: |
        # Your deployment commands here
        echo "Deploying to production..."
```

### Pipeline Best Practices

**Pipeline Stages:**
1. **Build**: Compile/build application
2. **Test**: Run automated tests
3. **Security Scan**: Check for vulnerabilities
4. **Build Artifacts**: Create deployment artifacts
5. **Deploy to Staging**: Test in staging environment
6. **Deploy to Production**: Deploy to production
7. **Post-Deployment**: Smoke tests, monitoring

**Key Principles:**
- ✅ Fast feedback (fail fast)
- ✅ Build once, deploy many times
- ✅ Automated testing at every stage
- ✅ Environment parity
- ✅ Rollback capability
- ✅ Security scanning
- ✅ Deployment approval gates (for production)

## Environment Configuration

### Environment Variables

```bash
# .env.example
# Application
NODE_ENV=production
PORT=3000
LOG_LEVEL=info

# Database
DATABASE_URL=postgresql://user:password@host:5432/dbname
DB_POOL_SIZE=20

# Cache
REDIS_URL=redis://host:6379

# Authentication
JWT_SECRET=your-secret-key-here
JWT_EXPIRATION=1h

# External Services
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=us-east-1

# Feature Flags
FEATURE_NEW_UI=false
FEATURE_BETA_ACCESS=false
```

### Configuration Management

```javascript
// config/index.js
const dotenv = require('dotenv');

// Load environment-specific .env file
dotenv.config({ path: `.env.${process.env.NODE_ENV || 'development'}` });

module.exports = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 3000,
  
  database: {
    url: process.env.DATABASE_URL,
    pool: {
      min: parseInt(process.env.DB_POOL_MIN, 10) || 2,
      max: parseInt(process.env.DB_POOL_MAX, 10) || 10
    }
  },
  
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRATION || '1h'
  },
  
  // Validate required environment variables
  validate() {
    const required = ['DATABASE_URL', 'JWT_SECRET'];
    const missing = required.filter(key => !process.env[key]);
    
    if (missing.length > 0) {
      throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }
  }
};
```

## Deployment Strategies

### Blue-Green Deployment

```yaml
# Deploy new version (green) alongside old (blue)
# Switch traffic after verification
# Keep old version for quick rollback

steps:
  1. Deploy green environment
  2. Run smoke tests on green
  3. Switch load balancer to green
  4. Monitor for issues
  5. If issues: switch back to blue (instant rollback)
  6. If successful: decommission blue
```

### Rolling Deployment

```yaml
# Update instances gradually
# Maintain availability throughout

steps:
  1. Update first instance
  2. Wait for health check
  3. Update next instance
  4. Repeat until all updated
```

### Canary Deployment

```yaml
# Deploy to small subset of users first
# Gradually increase traffic

steps:
  1. Deploy new version to 5% of servers
  2. Monitor metrics
  3. If successful: increase to 25%
  4. Monitor metrics
  5. If successful: increase to 50%
  6. Continue until 100%
```

## Monitoring and Logging

### Application Monitoring

```javascript
// Setup application monitoring
const monitoring = require('@monitoring/client');

monitoring.init({
  serviceName: 'my-app',
  environment: process.env.NODE_ENV,
  version: process.env.APP_VERSION
});

// Track custom metrics
monitoring.gauge('active_users', getUserCount());
monitoring.increment('api.requests');
monitoring.histogram('api.response_time', responseTime);

// Track errors
monitoring.captureException(error, {
  user: { id: userId },
  extra: { requestId }
});
```

### Structured Logging

```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: {
    service: 'my-app',
    environment: process.env.NODE_ENV
  },
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// Log with context
logger.info('User login', {
  userId: user.id,
  ip: req.ip,
  userAgent: req.headers['user-agent']
});
```

### Health Checks

```javascript
// Health check endpoint
app.get('/health', async (req, res) => {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    checks: {}
  };
  
  // Check database
  try {
    await db.query('SELECT 1');
    health.checks.database = 'ok';
  } catch (error) {
    health.checks.database = 'error';
    health.status = 'degraded';
  }
  
  // Check Redis
  try {
    await redis.ping();
    health.checks.redis = 'ok';
  } catch (error) {
    health.checks.redis = 'error';
    health.status = 'degraded';
  }
  
  const statusCode = health.status === 'ok' ? 200 : 503;
  res.status(statusCode).json(health);
});
```

## Backup and Recovery

### Database Backup Strategy

```bash
# Automated daily backups
#!/bin/bash

BACKUP_DIR="/backups"
DATE=$(date +%Y-%m-%d-%H%M%S)
DB_NAME="myapp"

# Create backup
pg_dump $DB_NAME | gzip > "$BACKUP_DIR/backup-$DATE.sql.gz"

# Retain last 30 days
find $BACKUP_DIR -name "backup-*.sql.gz" -mtime +30 -delete

# Upload to S3
aws s3 cp "$BACKUP_DIR/backup-$DATE.sql.gz" s3://my-backups/database/
```

### Disaster Recovery Plan

1. **Regular Backups**: Automated daily backups
2. **Backup Testing**: Monthly restore tests
3. **Recovery Time Objective (RTO)**: Target recovery time
4. **Recovery Point Objective (RPO)**: Acceptable data loss
5. **Failover Procedures**: Documented steps
6. **Communication Plan**: Who to notify, how to communicate

## Security Considerations

### Production Security Checklist

- [ ] HTTPS enforced
- [ ] Security headers configured
- [ ] Secrets stored securely (not in code)
- [ ] Database credentials rotated regularly
- [ ] Least privilege access
- [ ] Regular security updates
- [ ] Vulnerability scanning enabled
- [ ] Audit logging enabled
- [ ] Rate limiting configured
- [ ] DDoS protection enabled

See [Security Guidelines](security.md) for comprehensive security practices.

## Performance Optimization

### Load Balancing

```nginx
# Nginx load balancer configuration
upstream app_servers {
    least_conn;
    server app1:3000 max_fails=3 fail_timeout=30s;
    server app2:3000 max_fails=3 fail_timeout=30s;
    server app3:3000 max_fails=3 fail_timeout=30s;
}

server {
    listen 80;
    server_name example.com;
    
    location / {
        proxy_pass http://app_servers;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### Caching Strategy

```javascript
// Multi-level caching
class CacheService {
  constructor() {
    this.memoryCache = new Map();
    this.redisCache = new Redis();
  }
  
  async get(key) {
    // Check memory cache first
    if (this.memoryCache.has(key)) {
      return this.memoryCache.get(key);
    }
    
    // Check Redis cache
    const value = await this.redisCache.get(key);
    if (value) {
      this.memoryCache.set(key, value);
      return value;
    }
    
    return null;
  }
}
```

## Incident Response

### Incident Response Plan

**1. Detection and Alert**
- Monitor alerts and dashboards
- Automated alerting for critical issues
- On-call rotation schedule

**2. Assessment**
- Determine severity (P1-P4)
- Identify affected systems
- Estimate impact

**3. Response**
- Assemble incident team
- Create incident channel/room
- Begin mitigation

**4. Communication**
- Notify stakeholders
- Update status page
- Regular updates

**5. Resolution**
- Implement fix
- Verify resolution
- Monitor for stability

**6. Post-Mortem**
- Document timeline
- Identify root cause
- Create action items
- Share learnings

---

**Remember**: Reliable deployments require planning, automation, and continuous monitoring. Always have a rollback plan.

## Additional Resources

- [Coding Standards](implementation-core.md)
- [Security Guidelines](security.md)
- [Data Modeling Guide](data-modeling.md)
- [Project Guide](PROJECT_GUIDE_TEMPLATE.md)


