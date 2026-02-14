# Multi-Tier Architecture Design

**Version:** 1.0  
**Last Updated:** February 14, 2026  
**Status:** Active

---

## 1. Architecture Overview

The AI Interview Assistant platform follows a modular multi-tier architecture that separates concerns into distinct layers:

1. **Presentation Layer** - UI components and user interactions
2. **Business Logic Layer** - Domain logic, validation, and orchestration
3. **Data Access Layer** - Database operations and external API integrations
4. **Infrastructure Layer** - Cross-cutting concerns (logging, auth, caching)

---

## 2. Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Pages      │  │  Components  │  │    Hooks     │      │
│  │  (Next.js)   │  │   (React)    │  │   (React)    │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
└─────────┼──────────────────┼──────────────────┼─────────────┘
          │                  │                  │
          └──────────────────┼──────────────────┘
                             │
┌─────────────────────────────┼─────────────────────────────────┐
│                    BUSINESS LOGIC LAYER                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │   Services   │  │  Validators  │  │   Use Cases  │       │
│  │  (Domain)    │  │   (Rules)    │  │ (Orchestrate)│       │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘       │
└─────────┼──────────────────┼──────────────────┼──────────────┘
          │                  │                  │
          └──────────────────┼──────────────────┘
                             │
┌─────────────────────────────┼─────────────────────────────────┐
│                     DATA ACCESS LAYER                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │ Repositories │  │   Queries    │  │  External    │       │
│  │  (Database)  │  │  (Drizzle)   │  │     APIs     │       │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘       │
└─────────┼──────────────────┼──────────────────┼──────────────┘
          │                  │                  │
          └──────────────────┼──────────────────┘
                             │
┌─────────────────────────────┼─────────────────────────────────┐
│                   INFRASTRUCTURE LAYER                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │   Logging    │  │     Auth     │  │   Caching    │       │
│  │    (Pino)    │  │   (Clerk)    │  │   (Redis)    │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
└────────────────────────────────────────────────────────────────┘
                             │
                    ┌────────┴────────┐
                    │   PostgreSQL    │
                    │    Database     │
                    └─────────────────┘
```

---

## 3. Layer Responsibilities

### 3.1 Presentation Layer

**Purpose:** Handle user interface and user interactions

**Components:**
- **Pages** (`src/app/**/page.tsx`) - Next.js route pages
- **Components** (`src/components/**`) - Reusable UI components
- **Hooks** (`src/hooks/**`) - Custom React hooks for UI logic
- **Layouts** (`src/app/**/layout.tsx`) - Page layouts and shells

**Responsibilities:**
- Render UI components
- Handle user input
- Display data from business layer
- Route navigation
- Client-side state management (UI state only)

**Rules:**
- ❌ NO direct database access
- ❌ NO business logic
- ❌ NO data validation (except UI validation)
- ✅ Call business layer services
- ✅ Handle presentation state
- ✅ Manage user interactions

**Example:**
```typescript
// src/components/InterviewCard.tsx
'use client';

import { useInterview } from '@/hooks/useInterview';
import { Button } from '@/components/ui/Button';

export function InterviewCard({ interviewId }: { interviewId: string }) {
  const { interview, isLoading, startInterview } = useInterview(interviewId);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="card">
      <h3>{interview.title}</h3>
      <p>{interview.description}</p>
      <Button onClick={() => startInterview()}>
        Start Interview
      </Button>
    </div>
  );
}
```

---

### 3.2 Business Logic Layer

**Purpose:** Implement domain logic, validation, and orchestration

**Components:**
- **Services** (`src/services/**`) - Domain business logic
- **Use Cases** (`src/use-cases/**`) - Application workflows
- **Validators** (`src/validators/**`) - Business rule validation
- **DTOs** (`src/types/**`) - Data transfer objects

**Responsibilities:**
- Implement business rules
- Validate data
- Orchestrate operations
- Transform data
- Handle business errors
- Enforce domain constraints

**Rules:**
- ❌ NO UI rendering
- ❌ NO direct database queries
- ❌ NO HTTP request handling
- ✅ Call data access layer
- ✅ Implement domain logic
- ✅ Validate business rules

**Example:**
```typescript
// src/services/interview.service.ts
import { InterviewRepository } from '@/repositories/interview.repository';
import { validateInterviewInput } from '@/validators/interview.validator';
import { InterviewNotFoundError } from '@/errors';
import type { CreateInterviewInput, Interview } from '@/types';

export class InterviewService {
  constructor(private interviewRepo: InterviewRepository) {}

  async createInterview(input: CreateInterviewInput): Promise<Interview> {
    // Validate business rules
    const validatedInput = validateInterviewInput(input);

    // Check user subscription status
    if (!validatedInput.userId) {
      throw new Error('User must be authenticated');
    }

    // Create interview
    const interview = await this.interviewRepo.create({
      ...validatedInput,
      status: 'pending',
      createdAt: new Date(),
    });

    return interview;
  }

  async startInterview(interviewId: string, userId: string): Promise<Interview> {
    // Fetch interview
    const interview = await this.interviewRepo.findById(interviewId);
    
    if (!interview) {
      throw new InterviewNotFoundError(interviewId);
    }

    // Validate ownership
    if (interview.userId !== userId) {
      throw new Error('Unauthorized');
    }

    // Validate status
    if (interview.status !== 'pending') {
      throw new Error('Interview already started');
    }

    // Update status
    return await this.interviewRepo.update(interviewId, {
      status: 'in_progress',
      startedAt: new Date(),
    });
  }
}
```

---

### 3.3 Data Access Layer

**Purpose:** Handle data persistence and external API calls

**Components:**
- **Repositories** (`src/repositories/**`) - Database operations
- **Queries** (`src/queries/**`) - Complex database queries
- **API Clients** (`src/clients/**`) - External API integrations
- **Schemas** (`src/lib/db/schema.ts`) - Database schema definitions

**Responsibilities:**
- Execute database queries
- Handle database transactions
- Call external APIs
- Map database models to domain models
- Handle data access errors
- Implement caching strategies

**Rules:**
- ❌ NO business logic
- ❌ NO UI rendering
- ❌ NO validation (except data type validation)
- ✅ Database operations only
- ✅ External API calls
- ✅ Data mapping

**Example:**
```typescript
// src/repositories/interview.repository.ts
import { db } from '@/lib/db';
import { interviews } from '@/lib/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import type { Interview, CreateInterviewData } from '@/types';

export class InterviewRepository {
  async create(data: CreateInterviewData): Promise<Interview> {
    const [interview] = await db
      .insert(interviews)
      .values(data)
      .returning();
    
    return interview;
  }

  async findById(id: string): Promise<Interview | null> {
    const [interview] = await db
      .select()
      .from(interviews)
      .where(eq(interviews.id, id))
      .limit(1);
    
    return interview || null;
  }

  async findByUserId(userId: string, limit = 10): Promise<Interview[]> {
    return await db
      .select()
      .from(interviews)
      .where(eq(interviews.userId, userId))
      .orderBy(desc(interviews.createdAt))
      .limit(limit);
  }

  async update(id: string, data: Partial<Interview>): Promise<Interview> {
    const [updated] = await db
      .update(interviews)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(interviews.id, id))
      .returning();
    
    return updated;
  }

  async delete(id: string): Promise<void> {
    await db
      .delete(interviews)
      .where(eq(interviews.id, id));
  }
}
```

---

### 3.4 Infrastructure Layer

**Purpose:** Provide cross-cutting concerns and utilities

**Components:**
- **Logger** (`src/lib/logger.ts`) - Logging utility
- **Auth** (`src/lib/auth.ts`) - Authentication helpers
- **Cache** (`src/lib/cache.ts`) - Caching utilities
- **Config** (`src/lib/config.ts`) - Configuration management
- **Errors** (`src/lib/errors.ts`) - Custom error classes

**Responsibilities:**
- Logging and monitoring
- Authentication and authorization
- Caching
- Configuration management
- Error handling
- Utilities and helpers

**Example:**
```typescript
// src/lib/logger.ts
import pino from 'pino';

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  },
});

// src/lib/cache.ts
import { Redis } from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

export const cache = {
  async get<T>(key: string): Promise<T | null> {
    const value = await redis.get(key);
    return value ? JSON.parse(value) : null;
  },

  async set(key: string, value: any, ttl = 3600): Promise<void> {
    await redis.setex(key, ttl, JSON.stringify(value));
  },

  async del(key: string): Promise<void> {
    await redis.del(key);
  },
};
```

---

## 4. Directory Structure

```
src/
├── app/                          # Presentation Layer (Next.js)
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/
│   │   ├── dashboard/
│   │   ├── interviews/
│   │   └── analytics/
│   ├── api/                      # API Routes
│   │   ├── interviews/
│   │   ├── feedback/
│   │   └── webhooks/
│   ├── layout.tsx
│   ├── page.tsx
│   └── providers.tsx
│
├── components/                   # Presentation Layer
│   ├── ui/                       # Base UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   └── Input.tsx
│   ├── features/                 # Feature-specific components
│   │   ├── interview/
│   │   ├── feedback/
│   │   └── analytics/
│   └── layouts/
│       ├── Header.tsx
│       └── Footer.tsx
│
├── hooks/                        # Presentation Layer
│   ├── useInterview.ts
│   ├── useFeedback.ts
│   └── useAnalytics.ts
│
├── services/                     # Business Logic Layer
│   ├── interview.service.ts
│   ├── feedback.service.ts
│   ├── analytics.service.ts
│   └── subscription.service.ts
│
├── use-cases/                    # Business Logic Layer
│   ├── create-interview.use-case.ts
│   ├── start-interview.use-case.ts
│   └── generate-feedback.use-case.ts
│
├── validators/                   # Business Logic Layer
│   ├── interview.validator.ts
│   ├── feedback.validator.ts
│   └── user.validator.ts
│
├── repositories/                 # Data Access Layer
│   ├── interview.repository.ts
│   ├── user.repository.ts
│   ├── feedback.repository.ts
│   └── subscription.repository.ts
│
├── queries/                      # Data Access Layer
│   ├── interview.queries.ts
│   └── analytics.queries.ts
│
├── clients/                      # Data Access Layer
│   ├── openai.client.ts
│   ├── paddle.client.ts
│   └── clerk.client.ts
│
├── lib/                          # Infrastructure Layer
│   ├── db/
│   │   ├── index.ts
│   │   └── schema.ts
│   ├── logger.ts
│   ├── cache.ts
│   ├── auth.ts
│   ├── config.ts
│   └── errors.ts
│
├── types/                        # Shared Types
│   ├── interview.types.ts
│   ├── user.types.ts
│   ├── feedback.types.ts
│   └── api.types.ts
│
├── utils/                        # Shared Utilities
│   ├── date.utils.ts
│   ├── string.utils.ts
│   └── validation.utils.ts
│
└── middleware.ts                 # Next.js Middleware
```

---

## 5. Data Flow

### 5.1 Request Flow (Top-Down)

```
User Action (Browser)
    ↓
Presentation Layer (Component)
    ↓
Custom Hook (useInterview)
    ↓
API Route (/api/interviews)
    ↓
Business Logic Layer (InterviewService)
    ↓
Data Access Layer (InterviewRepository)
    ↓
Database (PostgreSQL)
```

### 5.2 Response Flow (Bottom-Up)

```
Database (PostgreSQL)
    ↓
Data Access Layer (Repository returns data)
    ↓
Business Logic Layer (Service transforms data)
    ↓
API Route (Returns JSON response)
    ↓
Custom Hook (Updates state)
    ↓
Presentation Layer (Re-renders UI)
    ↓
User sees updated UI
```

---

## 6. Communication Patterns

### 6.1 Layer Communication Rules

**Allowed:**
- Presentation → Business Logic ✅
- Business Logic → Data Access ✅
- Any Layer → Infrastructure ✅

**Not Allowed:**
- Presentation → Data Access ❌
- Data Access → Business Logic ❌
- Data Access → Presentation ❌

### 6.2 Dependency Injection

Use dependency injection to maintain loose coupling:

```typescript
// src/app/api/interviews/route.ts
import { InterviewService } from '@/services/interview.service';
import { InterviewRepository } from '@/repositories/interview.repository';

export async function POST(request: Request) {
  // Inject dependencies
  const interviewRepo = new InterviewRepository();
  const interviewService = new InterviewService(interviewRepo);

  const body = await request.json();
  const interview = await interviewService.createInterview(body);

  return Response.json(interview);
}
```

---

## 7. Error Handling

### 7.1 Error Flow

```
Error occurs in Data Access Layer
    ↓
Caught and wrapped in Business Logic Layer
    ↓
Transformed to API error in API Route
    ↓
Returned as JSON error response
    ↓
Handled in Presentation Layer
    ↓
Displayed to user
```

### 7.2 Custom Error Classes

```typescript
// src/lib/errors.ts
export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, id: string) {
    super(`${resource} with id ${id} not found`, 404, 'NOT_FOUND');
  }
}

export class ValidationError extends AppError {
  constructor(message: string, public errors: Record<string, string>) {
    super(message, 400, 'VALIDATION_ERROR');
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 401, 'UNAUTHORIZED');
  }
}
```

---

## 8. Testing Strategy

### 8.1 Unit Tests

**Presentation Layer:**
- Component rendering
- User interactions
- Hook behavior

**Business Logic Layer:**
- Service methods
- Validation logic
- Use case workflows

**Data Access Layer:**
- Repository methods
- Query correctness
- Data mapping

### 8.2 Integration Tests

- API endpoint tests
- Database integration tests
- External API integration tests

### 8.3 E2E Tests

- Critical user flows
- Multi-layer interactions
- Full stack scenarios

---

## 9. Performance Optimization

### 9.1 Caching Strategy

**Application Level:**
```typescript
// src/services/interview.service.ts
import { cache } from '@/lib/cache';

export class InterviewService {
  async getInterview(id: string): Promise<Interview> {
    // Check cache first
    const cached = await cache.get<Interview>(`interview:${id}`);
    if (cached) return cached;

    // Fetch from database
    const interview = await this.interviewRepo.findById(id);
    
    // Cache for 1 hour
    await cache.set(`interview:${id}`, interview, 3600);
    
    return interview;
  }
}
```

**Database Level:**
- Query result caching
- Connection pooling
- Prepared statements

### 9.2 Query Optimization

```typescript
// src/queries/interview.queries.ts
import { db } from '@/lib/db';
import { interviews, users, feedback } from '@/lib/db/schema';

export async function getInterviewWithDetails(id: string) {
  // Optimized join query
  return await db
    .select({
      interview: interviews,
      user: users,
      feedbackCount: sql<number>`count(${feedback.id})`,
    })
    .from(interviews)
    .leftJoin(users, eq(interviews.userId, users.id))
    .leftJoin(feedback, eq(feedback.interviewId, interviews.id))
    .where(eq(interviews.id, id))
    .groupBy(interviews.id, users.id);
}
```

---

## 10. Security Considerations

### 10.1 Authentication Flow

```typescript
// src/lib/auth.ts
import { auth } from '@clerk/nextjs/server';

export async function requireAuth() {
  const { userId } = await auth();
  
  if (!userId) {
    throw new UnauthorizedError();
  }
  
  return userId;
}

// Usage in API route
export async function GET(request: Request) {
  const userId = await requireAuth();
  // ... rest of handler
}
```

### 10.2 Authorization

```typescript
// src/services/interview.service.ts
export class InterviewService {
  async getInterview(id: string, userId: string): Promise<Interview> {
    const interview = await this.interviewRepo.findById(id);
    
    if (!interview) {
      throw new NotFoundError('Interview', id);
    }
    
    // Check ownership
    if (interview.userId !== userId) {
      throw new UnauthorizedError('You do not have access to this interview');
    }
    
    return interview;
  }
}
```

---

## 11. Migration Path

### 11.1 Current State Assessment

Identify existing code that violates architecture:
- Components with database queries
- API routes with business logic
- Mixed concerns

### 11.2 Refactoring Steps

**Phase 1: Extract Data Access**
1. Create repository classes
2. Move database queries to repositories
3. Update services to use repositories

**Phase 2: Extract Business Logic**
4. Create service classes
5. Move validation and business rules to services
6. Update API routes to use services

**Phase 3: Clean Presentation**
7. Remove business logic from components
8. Create custom hooks for data fetching
9. Simplify components to pure presentation

### 11.3 Example Refactoring

**Before:**
```typescript
// src/app/api/interviews/route.ts
export async function POST(request: Request) {
  const { userId } = await auth();
  const body = await request.json();
  
  // Validation in API route (bad)
  if (!body.title || body.title.length < 3) {
    return Response.json({ error: 'Invalid title' }, { status: 400 });
  }
  
  // Direct database access (bad)
  const [interview] = await db
    .insert(interviews)
    .values({ ...body, userId })
    .returning();
  
  return Response.json(interview);
}
```

**After:**
```typescript
// src/app/api/interviews/route.ts
export async function POST(request: Request) {
  const userId = await requireAuth();
  const body = await request.json();
  
  const interviewRepo = new InterviewRepository();
  const interviewService = new InterviewService(interviewRepo);
  
  try {
    const interview = await interviewService.createInterview({
      ...body,
      userId,
    });
    
    return Response.json(interview);
  } catch (error) {
    if (error instanceof ValidationError) {
      return Response.json({ error: error.message }, { status: 400 });
    }
    throw error;
  }
}
```

---

## 12. Best Practices

### 12.1 Do's ✅

- Keep layers independent
- Use dependency injection
- Write tests for each layer
- Document complex logic
- Use TypeScript strictly
- Handle errors appropriately
- Cache when beneficial
- Log important operations

### 12.2 Don'ts ❌

- Don't skip layers
- Don't mix concerns
- Don't use `any` types
- Don't ignore errors
- Don't duplicate logic
- Don't hardcode values
- Don't skip validation
- Don't expose internal details

---

## 13. Conclusion

This multi-tier architecture provides:
- **Maintainability:** Clear separation of concerns
- **Testability:** Each layer can be tested independently
- **Scalability:** Easy to scale individual layers
- **Flexibility:** Easy to swap implementations
- **Clarity:** Clear data flow and dependencies

Follow this architecture for all new features and gradually refactor existing code to align with these principles.

---

**Questions or Feedback?**  
Contact the architecture team or create an issue in the repository.
