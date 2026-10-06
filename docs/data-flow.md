# OpsFlow — End-to-End Data Flows

## Flow A: Create a project
```text
Manager
 ↓
Next.js form
 ↓
POST /projects
 ↓
NestJS authentication
 ↓
Organization membership
 ↓
Manager permission check
 ↓
Validation
 ↓
Prisma transaction
 ↓
PostgreSQL project record
 ↓
Audit/activity event
 ↓
HTTP 201 response
```

## Flow B: Assign a task
```text
Manager
 ↓
PATCH/assignment endpoint
 ↓
Authenticate
 ↓
Organization check
 ↓
Permission check
 ↓
Validate target user membership
 ↓
Update task assignment
 ↓
Create audit/activity record
 ↓
Queue notification
 ↓
BullMQ worker
 ↓
Persist notification
 ↓
WebSocket notification to connected user
```

## Flow C: Update task status
```text
Employee
 ↓
Next.js
 ↓
PATCH /tasks/:id
 ↓
NestJS
 ↓
Tenant + resource authorization
 ↓
Business rule validation
 ↓
PostgreSQL
 ↓
Audit log
 ↓
WebSocket task.updated
 ↓
Manager UI updates without refresh
```

## Flow D: Upload file
```text
Browser
 ↓
POST /attachments/presign
 ↓
Authorization + metadata validation
 ↓
S3 presigned URL
 ↓
Browser uploads directly to S3
 ↓
POST /attachments/complete
 ↓
PostgreSQL metadata
```

## Flow E: Search
```text
User
 ↓
GET /search
 ↓
Authentication
 ↓
Tenant/resource authorization
 ↓
PostgreSQL full-text search
 ↓
Filtered results
```

## Flow F: AI query
```text
User
 ↓
AI assistant
 ↓
Intent/tool selection
 ↓
Approved tool
 ↓
NestJS service
 ↓
Authorization
 ↓
PostgreSQL
 ↓
Structured result
 ↓
AI response
```

## Flow G: Failure/recovery
### WebSocket disconnect
```text
Connection lost
 ↓
Client reconnect
 ↓
Authenticate again
 ↓
Rejoin authorized rooms
 ↓
Refetch authoritative state
```

### Background job failure
```text
Worker
 ↓
Failure
 ↓
Retry with backoff
 ↓
Success OR terminal failure
 ↓
Metrics/logs/alert
```
