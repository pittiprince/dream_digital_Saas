# Dream Digital System Design

## 1. Project Overview

Dream Digital is a curated, single-vendor marketplace for digital creative assets, starting with Photoshop PSD files. The platform allows creators to sell their digital assets directly to customers through a subscription-based or purchase-based model.

### 1.1 Product Vision
- Curated marketplace ensuring quality assets
- Single-vendor model (initially) with potential for expansion
- Focus on Photoshop PSD files as starting point
- Subscription memberships may be introduced later
- Not a multi-vendor marketplace or SaaS workflow product

### 1.2 Target Users
- Digital creators (designers, artists) who produce PSD assets
- Customers (designers, marketers, businesses) seeking high-quality digital assets
- Initially focused on the creator's own assets, with potential curation approach

## 2. Architecture Overview

### 2.1 High-Level Architecture
```text
┌─────────────────┐    ┌──────────────────┐    ┌───────────────────┐
│   Frontend      │    │    Backend       │    │   Third-party     │
│ (React/Vite)    │◄──►│ (Node/Express)   │◄──►│ Services          │
└─────────────────┘    └──────────────────┘    └───────────────────┘
         │                         │                         │
         ▼                         ▼                         ▼
┌─────────────────┐    ┌──────────────────┐    ┌───────────────────┐
│   CDN/Assets    │    │   Database       │    │   Payment         │
│   Storage       │    │ (MongoDB/Mongoose)│   │   Processor       │
└─────────────────┘    └──────────────────┘    └───────────────────┘
         │                         │                         │
         ▼                         ▼                         ▼
┌─────────────────┐    ┌──────────────────┐    ┌───────────────────┐
│   Redis Cache   │    │   Search         │    │   Email Service   │
│                 │    │   (Optional)     │    │                   │
└─────────────────┘    └──────────────────┘    └───────────────────┘
```

### 2.2 Architectural Decisions

#### 2.2.1 Monolith-first Approach
- Starting with a monolithic architecture for simplicity
- Clear separation of concerns between frontend and backend
- Easy deployment and debugging during early stages
- Potential for microservices extraction later if needed

#### 2.2.2 Technology Stack Justification
- **Frontend**: React with Vite for fast development, TypeScript for type safety, Tailwind for rapid UI development
- **Backend**: Node.js with Express for familiarity and ecosystem, MongoDB for flexible document storage of asset metadata
- **Caching**: Redis for session storage and frequent asset queries
- **Package Manager**: pnpm for efficient dependency management and faster installs

#### 2.2.3 Bounded Contexts
1. **Asset Management** - Creation, categorization, pricing of digital assets
2. **Customer Management** - User accounts, profiles, purchase history
3. **Order Processing** - Cart, checkout, payment processing, delivery
4. **Subscription Management** - Membership plans, recurring billing
5. **Admin/Curation** - Content approval, quality control, vendor management

## 3. System Components

### 3.1 Frontend Application (`apps/web`)
#### 3.1.1 Core Features
- Asset browsing and discovery
- Asset detail views with previews
- Shopping cart and checkout
- User account management
- Subscription management
- Admin dashboard (for content curation)

#### 3.1.2 Technical Specifications
- **Framework**: React 18+ with Vite 4+
- **Language**: TypeScript 5+
- **Styling**: Tailwind CSS 3+
- **State Management**: Zustand or React Query (to be determined)
- **Routing**: React Router v6
- **Form Handling**: React Hook Form with Zod validation
- **UI Components**: Custom component library with shadcn/ui inspiration
- **Icons**: Lucide React or Heroicons
- **Testing**: Vitest + React Testing Library
- **Linting**: ESLint with TypeScript plugin
- **Formatting**: Prettier

### 3.2 Backend API (`apps/api`)
#### 3.2.1 Core Features
- RESTful API for asset management
- User authentication and authorization
- Order processing and payment integration
- Subscription handling
- Search and filtering capabilities
- Admin operations
- Webhook handling for payment providers

#### 3.2.2 Technical Specifications
- **Runtime**: Node.js 18+
- **Framework**: Express 4+
- **Language**: TypeScript 5+
- **Database**: MongoDB with Mongoose ODM
- **Caching**: Redis client (ioredis)
- **Validation**: Zod for request/response validation
- **Authentication**: JWT with refresh tokens, bcrypt for password hashing
- **File Upload**: Multer with streaming to storage
- **Email**: Nodemailer with template support
- **Testing**: Jest + Supertest
- **Linting**: ESLint with TypeScript plugin
- **Formatting**: Prettier
- **API Documentation**: Swagger/OpenAPI 3.0

### 3.3 Shared Packages (`packages/shared`)
#### 3.3.1 Purpose
- Shared TypeScript interfaces and types
- Common utility functions
- API client types
- Validation schemas
- Constants and enumerations
- Database connection utilities

#### 3.3.2 Contents
- `types/` - Shared TypeScript interfaces
- `utils/` - Common utility functions
- `constants/` - Application-wide constants
- `validators/` - Shared validation schemas
- `db/` - Database connection and utility functions

### 3.4 End-to-End Tests (`e2e`)
#### 3.4.1 Purpose
- Critical user journey testing
- Cross-browser compatibility validation
- Performance benchmarking
- Accessibility testing

#### 3.4.2 Technical Specifications
- **Framework**: Playwright or Cypress (to be determined)
- **Language**: TypeScript
- **Reporting**: HTML reports with video/screenshots on failure
- **CI Integration**: GitHub Actions compatible

## 4. Data Model

### 4.1 Core Entities

#### 4.1.1 User
```typescript
interface User {
  _id: ObjectId;
  email: string; // unique, indexed
  passwordHash: string;
  firstName: string;
  lastName: string;
  role: 'customer' | 'creator' | 'admin';
  isVerified: boolean;
  emailVerifiedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt: Date | null;
  subscription: Subscription | null;
}
```

#### 4.1.2 Asset
```typescript
interface Asset {
  _id: ObjectId;
  creatorId: ObjectId; // references User
  title: string;
  description: string;
  category: string; // e.g., "ui-kits", "icons", "textures"
  tags: string[]; // for search and filtering
  price: number; // in cents or smallest currency unit
  currency: string; // e.g., "USD"
  fileUrl: string; // URL to stored asset
  previewUrls: string[]; // URLs to preview images/thumbnails
  fileSize: number; // in bytes
  dimensions?: { width: number; height: number }; // for image/assets
  isActive: boolean;
  isFeatured: boolean;
  downloadCount: number;
  purchaseCount: number;
  rating: number; // average rating
  ratingCount: number;
  createdAt: Date;
  updatedAt: Date;
}
```

#### 4.1.3 Order
```typescript
interface Order {
  _id: ObjectId;
  userId: ObjectId; // references User
  items: OrderItem[];
  subtotal: number; // in cents
  tax: number; // in cents
  total: number; // in cents
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled' | 'refunded';
  paymentId: string; // reference to payment processor
  createdAt: Date;
  updatedAt: Date;
}

interface OrderItem {
  assetId: ObjectId; // references Asset
  quantity: number;
  price: number; // price at time of purchase
  title: string; // denormalized for historical accuracy
}
```

#### 4.1.4 Subscription
```typescript
interface Subscription {
  _id: ObjectId;
  userId: ObjectId; // references User
  planId: string; // references SubscriptionPlan
  status: 'active' | 'cancelled' | 'past_due' | 'unpaid';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

#### 4.1.5 SubscriptionPlan
```typescript
interface SubscriptionPlan {
  _id: ObjectId;
  name: string; // e.g., "Basic", "Pro", "Enterprise"
  description: string;
  price: number; // monthly in cents
  currency: string;
  interval: 'month' | 'year';
  features: string[]; // list of included features
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### 4.2 Database Indexing Strategy
- Users: email (unique), createdAt
- Assets: creatorId, category, isActive, createdAt, price
- Orders: userId, status, createdAt
- Subscription: userId, status
- Text indexes for asset search on title, description, tags

### 4.3 Relationships
- User 1:N Asset (creator)
- User 1:N Order
- User 1:1 Subscription (optional)
- SubscriptionPlan 1:N Subscription
- Asset N:M Order (through OrderItem)

## 5. API Design

### 5.1 RESTful API Structure
```text
GET    /api/health                    # Health check
GET    /api/assets                    # List assets with filtering
GET    /api/assets/:id                # Get asset details
POST   /api/assets                    # Create new asset (creator/admin)
PUT    /api/assets/:id                # Update asset (creator/admin)
DELETE /api/assets/:id                # Delete asset (creator/admin)
GET    /api/assets/:id/download       # Download asset (after purchase)

POST   /api/auth/register             # User registration
POST   /api/auth/login                # User login
POST   /api/auth/logout               # User logout
POST   /api/auth/refresh              # Refresh access token
GET    /api/auth/me                   # Get current user

GET    /api/cart                      # Get user's cart
POST   /api/cart/items                # Add item to cart
PUT    /api/cart/items/:itemId        # Update cart item quantity
DELETE /api/cart/items/:itemId        # Remove item from cart

POST   /api/orders                    # Create order from cart
GET    /api/orders                    # Get user's orders
GET    /api/orders/:id                # Get order details

GET    /api/subscription              # Get user's subscription
POST   /api/subscription              # Create/update subscription
DELETE /api/subscription              # Cancel subscription

GET    /api/plans                     # Get available subscription plans

POST   /api/webhooks/stripe           # Stripe webhook handler
```

### 5.2 Authentication Flow
1. User registers with email and password
2. System sends verification email
3. User logs in to receive JWT access token and refresh token
4. Access token used for API requests (15-minute expiry)
5. Refresh token used to obtain new access token (7-day expiry)
6. Tokens stored in HTTP-only, secure cookies

### 5.3 Error Handling
- Consistent error response format:
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Description of the error",
    "details": [] // optional field-specific errors
  }
}
```
- HTTP status codes:
  - 200: Success
  - 201: Created
  - 400: Bad Request
  - 401: Unauthorized
  - 403: Forbidden
  - 404: Not Found
  - 409: Conflict
  - 422: Unprocessable Entity
  - 429: Too Many Requests
  - 500: Internal Server Error
  - 503: Service Unavailable

### 5.4 Rate Limiting
- Per IP: 100 requests/minute for general endpoints
- Per IP: 10 requests/minute for auth endpoints
- Per user: 1000 requests/hour for API endpoints
- Burst allowance: 20 requests

### 5.5 CORS Policy
- Development: Allow localhost:5173 (Vite dev server)
- Production: Allow approved domains only
- Credentials: true for cookie-based auth

## 6. Security Considerations

### 6.1 Authentication Security
- Password hashing with bcrypt (cost factor 12)
- JWT tokens with short expiration (15m access, 7d refresh)
- HTTP-only, secure, same-site cookies for token storage
- Refresh token rotation to prevent replay attacks
- Rate limiting on auth endpoints
- Account lockout after 5 failed attempts (30-minute lockout)

### 6.2 Data Protection
- SSL/TLS enforcement in production
- Environment-specific configuration (no secrets in code)
- File upload validation (MIME types, size limits)
- Secure file storage with signed URLs for downloads
- Database injection prevention through Mongoose/ODM
- Input validation and sanitization on all endpoints

### 6.3 API Security
- CORS properly configured
- Helmet.js for HTTP headers
- Rate limiting to prevent abuse
- Input validation with Zod
- Output encoding where applicable
- API versioning through URL path (/api/v1/)
- Request size limits (10mb for JSON, 50mb for file uploads)

### 6.4 File Upload Security
- MIME type validation (allow only .psd, .jpg, .png for previews)
- File size limits (50mb for PSD files, 5mb for previews)
- Virus scanning integration (ClamAV or similar)
- File name sanitization
- Storage in secure bucket/CDN with private access
- Signed URLs for temporary download access

### 6.5 Payment Security
- Never store raw payment details
- Use PCI-compliant payment processors (Stripe)
- Webhook signature verification
- Idempotency keys for payment operations
- Audit trail for all financial transactions

## 7. Performance Optimization

### 7.1 Frontend Optimization
- Code splitting with dynamic imports
- Lazy loading of routes and components
- Image optimization and lazy loading
- CSS purging with Tailwind
- Bundle analysis and optimization
- Prefetching of likely next pages
- Service worker for offline capabilities (future)

### 7.2 Backend Optimization
- Database indexing strategy
- Query projection to fetch only needed fields
- Connection pooling for MongoDB and Redis
- Caching layer for frequent queries (asset listings, categories)
- Pagination for large result sets
- Compression (gzip/brotli) for API responses
- ETag headers for conditional requests
- Async/await for non-blocking operations

### 7.3 Caching Strategy
#### 7.3.1 Redis Usage
- Session storage (user sessions)
- Asset listing cache (5-10 minute TTL)
- Category listing cache (1 hour TTL)
- User profile cache (15 minute TTL)
- Rate limiting counters
- Temporary OTP storage

#### 7.3.2 CDN/Assets
- Asset files served through CDN
- Preview images optimized and served via CDN
- Cache headers for static assets
- Versioned filenames for cache busting

### 7.4 Database Optimization
- Read replicas for horizontal scaling (future)
- Connection pooling
- Query optimization and monitoring
- Index usage analysis
- Archive old orders to cheaper storage

## 8. Deployment Architecture

### 8.1 Environment Structure
```text
Development:   localhost (individual developer machines)
Staging:       staging.dreamdigital.com (identical to prod)
Production:    dreamdigital.com
```

### 8.2 Containerization
- Docker multi-stage builds for both frontend and backend
- Separate containers for:
  - Frontend (React/Vite dev server in dev, static server in prod)
  - Backend (Node/Express API)
  - Redis (caching layer)
  - MongoDB (primary database)
- Docker Compose for local development
- Kubernetes manifests for production (future)

### 8.3 CI/CD Pipeline
#### 8.3.1 Continuous Integration
- Pull request validation:
  - Linting (ESLint, Prettier)
  - Type checking (tsc)
  - Unit tests (frontend + backend)
  - Security scanning (dependencies)
  - Build validation
- Main branch protection:
  - All CI checks must pass
  - Manual approval required for production deployments

#### 8.3.2 Continuous Deployment
- Staging: Auto-deploy on merge to main
- Production: Manual trigger after staging validation
- Blue-green deployment strategy
- Rollback capability
- Database migration handling

### 8.4 Infrastructure Components
#### 8.4.1 Compute
- Frontend: CDN (Cloudflare/AWS CloudFront) for static assets
- Backend: Container orchestration (AWS ECS/EKS or similar)
- Database: Managed MongoDB (MongoDB Atlas or similar)
- Cache: Managed Redis (Redis Labs or AWS Elasticache)

#### 8.4.2 Networking
- Load balancer for traffic distribution
- SSL/TLS termination at load balancer
- WAF (Web Application Firewall) for DDoS protection
- Geographic routing for global users

#### 8.4.3 Storage
- Asset storage: S3-compatible storage with CDN
- Backup: Automated daily backups with point-in-time recovery
- Logging: Centralized logging (ELK stack or similar)
- Monitoring: Metrics collection (Prometheus/Grafana)

## 9. Development Workflow

### 9.1 Local Development Setup
1. Fork and clone repository
2. Install pnpm: `corepack enable && pnpm install`
3. Copy `.env.example` to `.env` and configure
4. Start services: `pnpm dev:all` (runs frontend, backend, redis, mongo)
5. Access frontend at http://localhost:5173
6. Access backend API at http://localhost:3000/api

### 9.2 Development Commands
```bash
# Install dependencies
pnpm install

# Start development servers
pnpm dev:all          # Frontend + Backend + DB + Cache
pnpm dev:web          # Frontend only
pnpm dev:api          # Backend only
pnpm dev:db           # Database only
pnpm dev:cache        # Redis only

# Testing
pnpm test             # Run all tests
pnpm test:web         # Frontend tests
pnpm test:api         # Backend tests
pnpm test:e2e         # End-to-end tests

# Linting and formatting
pnpm lint             # ESLint check
pnpm lint:fix         # ESLint auto-fix
pnpm format           # Prettier format
pnpm typecheck        # TypeScript compilation

# Database
pnpm db:migrate       # Run migrations
pnpm db:seed          # Seed database with sample data
```

### 9.3 Code Quality Standards
- TypeScript strict mode enabled
- ESLint with recommended rules + TypeScript plugin
- Prettier for consistent formatting
- Jest/Vitest for unit testing with 80%+ coverage target
- Conventional commits for changelog generation
- Pull request template for consistent descriptions
- Code owners for automatic reviewer assignment

### 9.4 Branching Strategy
- `main`: Production-ready code
- `develop`: Integration branch for features
- Feature branches: `feature/description`
- Bug fix branches: `bug/description`
- Release branches: `release/v1.0.0`
- Hotfix branches: `hotfix/description`
- Merge strategy: Squash and merge for feature branches

## 10. Monitoring and Observability

### 10.1 Metrics Collection
#### 10.1.1 Application Metrics
- Request rate, latency, error rates (RED metrics)
- Database query performance
- Cache hit/miss ratios
- External API call performance
- Business metrics: conversion rates, revenue, active users

#### 10.1.2 Infrastructure Metrics
- CPU, memory, disk usage
- Network I/O
- Container orchestration health
- Database connection pool usage
- Redis memory usage

### 10.2 Logging Strategy
- Structured JSON logging
- Correlation IDs for request tracing
- Log levels: error, warn, info, debug
- Centralized log aggregation
- Retention: 30 days for application logs, 90 days for audit logs
- PII redaction in logs

### 10.3 Distributed Tracing
- OpenTelemetry instrumentation
- Trace propagation across services
- Span attributes for key operations
- Integration with monitoring backend (Jaeger/Tempo)

### 10.4 Health Checks
- Liveness probe: Application responsiveness
- Readiness probe: Dependency availability (DB, cache)
- Startup probe: Application initialization
- Custom health endpoints for business metrics

### 10.5 Alerting Strategy
- Critical: System downtime, high error rates (>5%)
- Warning: Elevated latency (>2s p95), high resource usage
- Info: Deployment events, scaling activities
- Notification channels: Slack, email, SMS for critical alerts
- Escalation policies based on severity and time

## 11. Backup and Disaster Recovery

### 11.1 Backup Strategy
#### 11.1.1 Database
- Automated daily full backups
- Hourly incremental backups
- Point-in-time recovery capability
- Cross-region backup storage
- Backup retention: 30 days

#### 11.1.2 Asset Storage
- Versioned storage with lifecycle policies
- Cross-region replication
- Backup retention: 90 days
- Regular integrity checks

#### 11.1.3 Configuration
- Infrastructure as code (Terraform/CDK)
- Version-controlled configuration
- Regular backups of key management systems

### 11.2 Disaster Recovery Plan
- RTO (Recovery Time Objective): 4 hours
- RPO (Recovery Point Objective): 1 hour
- Regular DR testing (quarterly)
- Runbook documentation
- Geographic redundancy for critical services

## 12. Scalability Considerations

### 12.1 Horizontal Scaling
- Stateless backend services behind load balancer
- Database read replicas for scaling reads
- Redis clustering for cache distribution
- CDN for static asset delivery
- Microservice extraction potential for high-load components

### 12.2 Vertical Scaling
- Database instance sizing based on workload
- Memory optimization for caching layers
- CPU optimization for compute-intensive operations
- Storage performance tuning for asset delivery

### 12.3 Bottleneck Identification
- Database query performance monitoring
- Cache effectiveness measurement
- External API latency tracking
- Frontend bundle analysis

## 13. Legal and Compliance

### 13.1 Data Protection
- GDPR compliance for EU users
- CCPA compliance for California users
- Data processing agreements with third parties
- Privacy policy and terms of service
- Cookie consent mechanism
- Data subject access request procedures

### 13.2 Intellectual Property
- Copyright notice and DMCA policy
- License terms for asset usage
- Creator warranty and indemnification
- Platform liability limitations
- Content moderation procedures

### 13.3 Payment Compliance
- PCI DSS compliance through payment processor
- Secure handling of payment data

## 14. Future Enhancements

### 14.1 Phase 1: MVP (Minimum Viable Product)
- Basic asset marketplace with PSD files
- User registration and authentication
- Shopping cart and checkout
- Basic search and filtering
- Admin dashboard for asset management

### 14.2 Phase 2: Enhanced Features
- Subscription models
- Enhanced search with faceted filtering
- User reviews and ratings
- Wishlist and favorites
- Asset bundles and collections
- Affiliate/referral program

### 14.3 Phase 3: Advanced Features
- Multi-vendor marketplace
- Asset preview enhancement (PSD layer viewing)
- Collaboration tools for creators
- Analytics dashboard for sellers
- Mobile applications
- AI-powered asset recommendations
- Internationalization (i18n)

### 14.4 Technical Evolution
- Microservices extraction (order service, user service)
- GraphQL API alongside REST
- Real-time features (WebSocket for notifications)

## 15. Acceptance Criteria

### 15.1 Functional Requirements
- Users can browse and search assets
- Users can purchase assets securely
- Creators can upload and manage their assets
- Admin can moderate and curate content
- Subscription system works correctly
- Email notifications are sent appropriately
- All data is persisted and recoverable

### 15.2 Non-Functional Requirements
- Page load time < 3 seconds for 95% of requests
- API response time < 200ms for 95% of requests
- System availability 99.9% monthly uptime
- Support for 1000 concurrent users
- Secure handling of sensitive data
- GDPR/CCPA compliance
- Accessibility WCAG 2.1 AA compliance

### 15.3 Operational Requirements
- Automated deployment pipeline
- Comprehensive monitoring and alerting
- Backup and disaster recovery tested
- Documentation for operations and development
- Runbooks for common operational procedures
- Capacity planning documentation
- Advanced analytics and reporting
- Machine learning for personalization
- Progressive Web App (PWA) capabilities
- Receipt and invoice generation
- Tax calculation and reporting
- Refund and chargeback procedures
- Third-party service dependency monitoring

## 16. Risks and Mitigations

### 16.1 Technical Risks
- **Risk**: Performance degradation with scale
  **Mitigation**: Implement caching early, monitor performance, plan for horizontal scaling
  
- **Risk**: Database bottlenecks
  **Mitigation**: Proper indexing, query optimization, read replicas, connection pooling
  
- **Risk**: Third-party service dependencies
  **Mitigation**: Circuit breaker patterns, fallback mechanisms, vendor diversification

### 16.2 Business Risks
- **Risk**: Low creator adoption
  **Mitigation**: Competitive pricing, easy upload process, marketing support
  
- **Risk**: Copyright infringement
  **Mitigation**: DMCA process, content verification, creator warranty system
  
- **Risk**: Payment fraud
  **Mitigation**: PCI-compliant processor, fraud detection tools, manual review for high-value

### 16.3 Operational Risks
- **Risk**: Deployment failures
  **Mitigation**: Automated testing, blue-green deployments, rollback procedures
  
- **Risk**: Data loss
  **Mitigation**: Regular backups, point-in-time recovery, backup testing
  
- **Risk**: Security vulnerabilities
  **Mitigation**: Regular security scans, penetration testing, dependency updates

## 17. Glossary

- **PSD**: Photoshop Document file format
- **CDN**: Content Delivery Network
- **REST**: Representational State Transfer
- **JWT**: JSON Web Token
- **DTO**: Data Transfer Object
- **TLS**: Transport Layer Security
- **WAF**: Web Application Firewall
- **RTO**: Recovery Time Objective
- **RPO**: Recovery Point Objective
- **PII**: Personally Identifiable Information
- **DMCA**: Digital Millennium Copyright Act
- **GDPR**: General Data Protection Regulation
- **CCPA**: California Consumer Privacy Act
- **PCI DSS**: Payment Card Industry Data Security Standard

## 18. Approval and Revision History

| Version | Date | Author | Description |
|---------|------|--------|-------------|
| 1.0 | 2026-10-14 | System Architect | Initial system design specification |

---
*This document represents the complete system design for Dream Digital as of October 14, 2026. It should be reviewed and approved by the Chief Engineer before implementation begins.*