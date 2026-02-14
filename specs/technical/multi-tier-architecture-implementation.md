# Technical Spec: Multi-Tier Architecture Implementation

**Author:** Engineering Team  
**Date:** 2026-02-14  
**Status:** Approved  
**Priority:** P0

---

## 1. Overview

### 1.1 Summary
Implement a modular multi-tier architecture that separates the application into distinct layers: Presentation, Business Logic, Data Access, and Infrastructure. This refactoring will improve maintainability, testability, and scalability.

### 1.2 Goals
- Establish clear separation of concerns
- Improve code maintainability and testability
- Enable independent scaling of layers
- Reduce coupling between components
- Standardize development patterns

### 1.3 Non-Goals
- Rewrite entire codebase at once
- Change external APIs or user-facing features
- Migrate to different frameworks

---

## 2. Current State

### 2.1 Problems
- Business logic mixed with API routes
- Direct database access from multiple places
- Difficult to test components in isolation
- Code duplication across features
- Unclear data flow

### 2.2 Example Current Code

```typescript
// Current problematic pattern
export async function POST(request: Request) {
  const body = await request.json();
  
  // Validation in API route
  if (!body.title) return Response.json({ error: 'Invalid' }, { status: 400 });
  
  // Direct DB access
  const [result] = await db.insert(interviews).values(body).returning();
  
  return Response.json(result);
}
```

---

## 3. Proposed Architecture

### 3.1 Layer Definitions

**Presentation Layer** (`src/app`, `src/components`, `src/hooks`)
- UI components and pages
- User interaction handling
- Display logic only

**Business Logic Layer** (`src/services`, `src/use-cases`, `src/validators`)
- Domain logic and rules
- Data validation
- Workflow orchestration

**Data Access Layer** (`src/repositories`, `src/queries`, `src/clients`)
- Database operations
- External API calls
- Data mapping

**Infrastructure Layer** (`src/lib`)
- Logging, caching, auth
- Cross-cutting concerns
- Utilities

### 3.2 Communication Rules
- Presentation → Business Logic ✅
- Business Logic → Data Access ✅
- Any Layer → Infrastructure ✅
- Presentation → Data Access ❌

---

## 4. Implementation Plan

### 4.1 Phase 1: Infrastructure Setup (Week 1)


**Tasks:**
- [ ] Create directory structure
- [ ] Set up error handling classes
- [ ] Implement logger utility
- [ ] Create base repository class
- [ ] Set up dependency injection pattern

**Deliverables:**
- Infrastructure layer utilities
- Base classes and interfaces
- Documentation

### 4.2 Phase 2: Data Access Layer (Week 2)

**Tasks:**
- [ ] Create repository interfaces
- [ ] Implement user repository
- [ ] Implement interview repository
- [ ] Implement subscription repository
- [ ] Add unit tests for repositories

**Deliverables:**
- All repository classes
- Database query optimization
- Repository tests (>80% coverage)

### 4.3 Phase 3: Business Logic Layer (Week 3)

**Tasks:**
- [ ] Create service classes
- [ ] Implement validators
- [ ] Create use cases
- [ ] Add business logic tests
- [ ] Document business rules

**Deliverables:**
- Service layer implementation
- Validation logic
- Use case orchestration
- Service tests (>80% coverage)

### 4.4 Phase 4: Presentation Layer Refactor (Week 4)

**Tasks:**
- [ ] Create custom hooks
- [ ] Refactor components
- [ ] Update API routes
- [ ] Add component tests
- [ ] Update documentation

**Deliverables:**
- Clean presentation components
- Custom hooks for data fetching
- Updated API routes
- Component tests

### 4.5 Phase 5: Integration & Testing (Week 5)

**Tasks:**
- [ ] Integration tests
- [ ] E2E tests for critical flows
- [ ] Performance testing
- [ ] Security audit
- [ ] Documentation review

**Deliverables:**
- Full test suite
- Performance benchmarks
- Security report
- Complete documentation

---

## 5. Technical Details

### 5.1 Repository Pattern

```typescript
// src/repositories/base.repository.ts
export abstract class BaseRepository<T> {
  abstract create(data: Partial<T>): Promise<T>;
  abstract findById(id: string): Promise<T | null>;
  abstract update(id: string, data: Partial<T>): Promise<T>;
  abstract delete(id: string): Promise<void>;
}

// src/repositories/interview.repository.ts
export class InterviewRepository extends BaseRepository<Interview> {
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
  
  // ... other methods
}
```

### 5.2 Service Pattern

```typescript
// src/services/interview.service.ts
export class InterviewService {
  constructor(
    private interviewRepo: InterviewRepository,
    private userRepo: UserRepository
  ) {}
  
  async createInterview(input: CreateInterviewInput): Promise<Interview> {
    // Validate
    const validated = validateInterviewInput(input);
    
    // Check user exists
    const user = await this.userRepo.findById(validated.userId);
    if (!user) throw new NotFoundError('User', validated.userId);
    
    // Create interview
    return await this.interviewRepo.create({
      ...validated,
      status: 'pending',
      createdAt: new Date(),
    });
  }
}
```

### 5.3 Use Case Pattern

```typescript
// src/use-cases/start-interview.use-case.ts
export class StartInterviewUseCase {
  constructor(
    private interviewService: InterviewService,
    private subscriptionService: SubscriptionService,
    private logger: Logger
  ) {}
  
  async execute(interviewId: string, userId: string): Promise<Interview> {
    this.logger.info({ interviewId, userId }, 'Starting interview');
    
    // Check subscription
    const hasAccess = await this.subscriptionService.hasActiveSubscription(userId);
    if (!hasAccess) {
      throw new UnauthorizedError('Active subscription required');
    }
    
    // Start interview
    const interview = await this.interviewService.startInterview(interviewId, userId);
    
    this.logger.info({ interviewId }, 'Interview started successfully');
    
    return interview;
  }
}
```

### 5.4 API Route Pattern

```typescript
// src/app/api/interviews/[id]/start/route.ts
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await requireAuth();
    
    // Dependency injection
    const interviewRepo = new InterviewRepository();
    const userRepo = new UserRepository();
    const subscriptionRepo = new SubscriptionRepository();
    
    const interviewService = new InterviewService(interviewRepo, userRepo);
    const subscriptionService = new SubscriptionService(subscriptionRepo);
    
    const useCase = new StartInterviewUseCase(
      interviewService,
      subscriptionService,
      logger
    );
    
    const interview = await useCase.execute(params.id, userId);
    
    return Response.json(interview);
  } catch (error) {
    return handleApiError(error);
  }
}
```

### 5.5 Custom Hook Pattern

```typescript
// src/hooks/useInterview.ts
export function useInterview(interviewId: string) {
  const { data: interview, isLoading, error } = useQuery({
    queryKey: ['interview', interviewId],
    queryFn: () => fetchInterview(interviewId),
  });
  
  const startMutation = useMutation({
    mutationFn: () => startInterview(interviewId),
    onSuccess: () => {
      queryClient.invalidateQueries(['interview', interviewId]);
    },
  });
  
  return {
    interview,
    isLoading,
    error,
    startInterview: startMutation.mutate,
    isStarting: startMutation.isPending,
  };
}
```

---

## 6. Migration Strategy

### 6.1 Feature-by-Feature Migration

Start with one feature and migrate completely:

1. **Interview Feature** (Week 2-4)
   - Create repositories
   - Create services
   - Update API routes
   - Refactor components

2. **User/Auth Feature** (Week 5-6)
   - User repository
   - Auth service
   - Update auth flows

3. **Subscription Feature** (Week 7-8)
   - Subscription repository
   - Payment service
   - Update payment flows

### 6.2 Backward Compatibility

- Keep old code until migration complete
- Use feature flags for gradual rollout
- Run both old and new code in parallel initially
- Monitor for issues

---

## 7. Testing Strategy

### 7.1 Unit Tests

**Repository Tests:**
```typescript
describe('InterviewRepository', () => {
  it('should create interview', async () => {
    const repo = new InterviewRepository();
    const data = { title: 'Test', userId: '123' };
    const interview = await repo.create(data);
    expect(interview.title).toBe('Test');
  });
});
```

**Service Tests:**
```typescript
describe('InterviewService', () => {
  it('should validate input before creating', async () => {
    const mockRepo = createMockRepository();
    const service = new InterviewService(mockRepo);
    
    await expect(
      service.createInterview({ title: '' })
    ).rejects.toThrow(ValidationError);
  });
});
```

### 7.2 Integration Tests

```typescript
describe('POST /api/interviews', () => {
  it('should create interview with valid data', async () => {
    const response = await fetch('/api/interviews', {
      method: 'POST',
      body: JSON.stringify({ title: 'Test Interview' }),
    });
    
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.title).toBe('Test Interview');
  });
});
```

---

## 8. Performance Considerations

### 8.1 Caching Strategy

- Cache frequently accessed data
- Use Redis for distributed caching
- Implement cache invalidation
- Monitor cache hit rates

### 8.2 Query Optimization

- Use indexes on frequently queried columns
- Implement pagination
- Use select only needed columns
- Batch operations where possible

### 8.3 Connection Pooling

```typescript
// src/lib/db/index.ts
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const client = postgres(process.env.DATABASE_URL!, {
  max: 10, // Connection pool size
  idle_timeout: 20,
  connect_timeout: 10,
});

export const db = drizzle(client);
```

---

## 9. Security Considerations

### 9.1 Input Validation

All user input validated in business logic layer:

```typescript
export function validateInterviewInput(input: unknown): CreateInterviewInput {
  const schema = z.object({
    title: z.string().min(3).max(100),
    description: z.string().max(500).optional(),
    userId: z.string().uuid(),
  });
  
  return schema.parse(input);
}
```

### 9.2 Authorization

Check permissions in service layer:

```typescript
async getInterview(id: string, userId: string): Promise<Interview> {
  const interview = await this.interviewRepo.findById(id);
  
  if (interview.userId !== userId) {
    throw new UnauthorizedError();
  }
  
  return interview;
}
```

---

## 10. Monitoring & Observability

### 10.1 Logging

```typescript
// Log at each layer
logger.info({ userId, interviewId }, 'Creating interview');
logger.error({ error, userId }, 'Failed to create interview');
```

### 10.2 Metrics

Track:
- API response times
- Database query times
- Error rates by layer
- Cache hit rates

---

## 11. Documentation

### 11.1 Required Documentation

- [ ] Architecture overview (ARCHITECTURE.md)
- [ ] Layer responsibilities
- [ ] Code examples for each pattern
- [ ] Migration guide
- [ ] Testing guide
- [ ] API documentation

### 11.2 Code Documentation

- JSDoc comments for all public methods
- README in each major directory
- Inline comments for complex logic

---

## 12. Success Criteria

### 12.1 Technical Metrics

- [ ] >80% test coverage
- [ ] API response time <500ms (p95)
- [ ] Zero direct DB access from presentation layer
- [ ] All business logic in service layer
- [ ] Clean separation of concerns

### 12.2 Quality Metrics

- [ ] Code review approval
- [ ] No critical security issues
- [ ] Documentation complete
- [ ] Team training completed

---

## 13. Risks & Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| Breaking existing features | High | Comprehensive testing, gradual rollout |
| Performance regression | Medium | Performance testing, monitoring |
| Team learning curve | Medium | Training sessions, pair programming |
| Timeline overrun | Medium | Phased approach, regular check-ins |

---

## 14. Timeline

| Phase | Duration | Completion Date |
|-------|----------|-----------------|
| Phase 1: Infrastructure | 1 week | Week 1 |
| Phase 2: Data Access | 1 week | Week 2 |
| Phase 3: Business Logic | 1 week | Week 3 |
| Phase 4: Presentation | 1 week | Week 4 |
| Phase 5: Integration | 1 week | Week 5 |

**Total Duration:** 5 weeks

---

## 15. Appendix

### 15.1 Directory Structure

See ARCHITECTURE.md for complete directory structure.

### 15.2 Code Examples

See ARCHITECTURE.md for detailed code examples.

### 15.3 References

- Clean Architecture by Robert C. Martin
- Domain-Driven Design by Eric Evans
- Next.js Documentation
- Drizzle ORM Documentation
