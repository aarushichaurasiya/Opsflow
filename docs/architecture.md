# OpsFlow — System Architecture

## 1. System purpose
OpsFlow is a production-oriented, multi-tenant B2B operations SaaS platform for projects, tasks, teams, collaboration, files, workflows, notifications, operational reporting and AI-assisted workflows.

The architecture intentionally goes beyond CRUD. It covers frontend, API, relational data, authorization, asynchronous processing, real-time communication, testing, CI/CD, cloud infrastructure and observability.

## 2. High-level architecture
```text
                         ┌──────────────────────┐
                         │       Browser        │
                         │   Next.js / React    │
                         └──────────┬───────────┘
                                    │
                       REST + WebSocket
                                    │
                         ┌──────────▼───────────┐
                         │       NestJS         │
                         │ Controllers/Guards   │
                         │ Services/WebSockets  │
                         └──────────┬───────────┘
                                    │
             ┌──────────────────────┼──────────────────────┐
             │                      │                      │
      ┌──────▼──────┐        ┌──────▼──────┐        ┌──────▼──────┐
      │ PostgreSQL  │        │    Redis    │        │     S3      │
      │   Prisma    │        │ Cache/Queue │        │   Objects   │
      └─────────────┘        └──────┬──────┘        └─────────────┘
                                    │
                               ┌────▼────┐
                               │ BullMQ  │
                               │ Workers │
                               └─────────┘

                         ┌──────────────────────┐
                         │     AI Services      │
                         │ LLM + Tools / RAG    │
                         └──────────┬───────────┘
                                    │
                              Approved APIs
```

## 3. Architectural boundaries
### Web application
Responsible for presentation, routing, client state, forms, accessibility and user interaction. It must not be treated as the security boundary.

### API application
Responsible for authentication, authorization, tenant isolation, validation, business rules, persistence orchestration, WebSocket events and API contracts.

### PostgreSQL
System of record for relational business data.

### Redis
Fast shared infrastructure for caching, rate limiting, pub/sub and queue support where appropriate.

### S3
Durable object storage for files. PostgreSQL stores metadata, not file bodies.

### Workers
Asynchronous execution for email/notification work, analytics updates, activity processing and future AI/file workers.

## 4. Multi-tenant request model
Every organization-owned resource must be scoped to `organization_id`.

```text
HTTP request
   ↓
Authenticate user
   ↓
Resolve organization membership
   ↓
Authorize role/permission
   ↓
Apply organization scope
   ↓
Check resource ownership/access
   ↓
Execute service method
   ↓
Persist / publish events
```

The frontend may hide unavailable actions, but the backend remains authoritative.

## 5. Module boundaries
Recommended NestJS modules:
- Auth
- Organizations
- Members
- Roles/Permissions
- Projects
- Tasks
- Comments
- Attachments
- Notifications
- Audit
- Search
- Reports
- AI
- Health/Observability

Each module should expose application-level services rather than allowing controllers to contain business logic.

## 6. Request lifecycle
1. Request enters the API.
2. Authentication identifies the user/session.
3. Tenant context identifies the organization.
4. Validation rejects malformed input.
5. Guards enforce permissions.
6. Service applies business rules.
7. Prisma executes a scoped transaction/query.
8. Domain/application events are created when needed.
9. Background work is queued instead of blocking the request where appropriate.
10. WebSocket events notify connected clients when real-time behavior is required.
11. Audit records are written for important state-changing operations.

## 7. Real-time architecture
WebSockets are used for task status changes, comments, assignment changes, notifications, activity updates and online presence.

A recommended logical room model is:
```text
organization:{organizationId}
project:{projectId}
task:{taskId}
user:{userId}
```

Membership and authorization must be checked before a client joins a protected room or receives protected events.

## 8. Background jobs
The API should perform only work needed to complete the user-visible request. Expensive/non-critical work is queued:
```text
API → Redis/BullMQ → Worker → External service/database → completion event
```

Jobs should be idempotent where practical, have retry policies, structured logs, and failure/dead-letter handling.

## 9. File architecture
```text
Browser → API → presigned upload URL → S3
                     ↓
               attachment metadata
                     ↓
                 PostgreSQL
```

The API authorizes access before generating upload/download URLs.

## 10. Scalability strategy
### Stage 1 — Monolith
Next.js + NestJS + PostgreSQL + Redis.

### Stage 2 — Horizontal API scaling
Place multiple API instances behind a load balancer. Shared state required for real-time communication, caching or queues must not depend on local process memory.

### Stage 3 — Independent workers
Extract notification, analytics, AI and file processing into workers as scale requires.

Avoid premature microservices. Clear module boundaries allow later extraction.

## 11. Failure handling
Examples:
- PostgreSQL unavailable → fail request safely, expose health status, retry only where appropriate.
- Redis unavailable → degrade cache-dependent features where safe; queue-dependent operations must fail visibly rather than silently disappearing.
- S3 unavailable → upload/download error with no false success state.
- Worker failure → retry idempotent jobs and surface terminal failures.
- WebSocket disconnect → client reconnects and refetches authoritative state.

## 12. Repository architecture
```text
opsflow/
├── apps/
│   ├── web/
│   └── api/
├── packages/
│   ├── ui/
│   ├── types/
│   ├── config/
│   └── eslint/
├── infrastructure/
│   ├── terraform/
│   └── docker/
├── docs/
├── tests/
│   ├── integration/
│   └── e2e/
├── .github/workflows/
├── docker-compose.yml
├── package.json
└── README.md
```

## 13. Architectural principles
- Server-side authorization is mandatory.
- Tenant scope is mandatory for organization-owned data.
- PostgreSQL remains the source of truth for business state.
- Redis is an accelerator/infrastructure component, not a replacement for durable relational state.
- Files belong in object storage.
- AI accesses approved application tools, never unrestricted database access.
- Observability is designed alongside features.
- Performance claims must be measured, not invented.
