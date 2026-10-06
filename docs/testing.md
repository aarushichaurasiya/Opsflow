# OpsFlow — Testing Strategy

## 1. Testing pyramid
```text
              E2E
             /   \
       Integration
        /       \
      Unit Tests
```

Use many fast unit tests, targeted integration tests, and a smaller set of high-value E2E tests.

## 2. Unit tests
Test:
- service methods
- authorization rules
- validation/business rules
- utility functions
- status transition logic
- permission evaluation

## 3. Integration tests
Test:
- API endpoints
- Prisma/database interactions
- authentication
- authorization
- queue processing
- tenant isolation

Critical security test:
```text
User from ORG_A
attempts to access resource owned by ORG_B
→ must be denied
```

## 4. E2E tests
Use Playwright for critical journeys:
```text
Sign in
 ↓
Create organization
 ↓
Invite member
 ↓
Create project
 ↓
Create task
 ↓
Assign task
 ↓
Update status
 ↓
Verify notification
```

## 5. WebSocket tests
Verify:
- authorized clients receive correct events
- unauthorized clients do not receive protected events
- reconnect behavior
- event payload shape

## 6. File tests
Test:
- allowed file types
- size limits
- unauthorized download
- expired URL behavior
- metadata consistency

## 7. AI tests
Test:
- correct tool selection
- schema validation
- authorization enforcement
- prompt injection resistance
- failure/fallback behavior

## 8. Performance tests
The supplied README says performance numbers should only be published after reproducible measurement. Define target SLOs only after choosing workload and infrastructure, then benchmark using representative data.

## 9. CI test order
Recommended:
```text
Lint
 ↓
Type check
 ↓
Unit
 ↓
Integration
 ↓
E2E
 ↓
Security checks
 ↓
Build
 ↓
Docker build
```
