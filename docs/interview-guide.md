# OpsFlow — Interview & Presentation Guide

## 1. 30-second explanation
OpsFlow is a production-oriented multi-tenant B2B operations SaaS built with Next.js, TypeScript, NestJS and PostgreSQL, with Redis and BullMQ for caching/background processing, WebSockets for real-time collaboration, S3 for files, and AWS/Docker/CI/CD for deployment. The key engineering focus is tenant isolation, RBAC, secure file access, auditability, asynchronous processing, observability and controlled AI tool integration.

## 2. One-minute architecture explanation
The browser uses a Next.js frontend. It communicates with a NestJS API over REST and WebSockets. NestJS authenticates requests, resolves organization context, checks permissions and applies business rules. PostgreSQL through Prisma stores durable relational state. Redis supports caching, rate limiting and queue infrastructure. BullMQ workers handle asynchronous jobs. S3 stores files while PostgreSQL stores metadata. AI capabilities call approved application tools rather than accessing the database directly.

## 3. Why PostgreSQL?
Because the application is highly relational: organizations, members, roles, projects, tasks, comments and audit records have strong relationships and require consistency, constraints, transactions and indexes.

## 4. Why Redis?
Redis is useful for fast cache access, distributed rate limiting, pub/sub and queue infrastructure. It complements rather than replaces PostgreSQL.

## 5. Why NestJS?
NestJS gives the backend a structured TypeScript architecture with modules, controllers, services, guards, interceptors, validation and dependency injection.

## 6. Why Next.js?
Next.js provides the React-based UI, routing, server-side capabilities and TypeScript-friendly application framework required by the frontend.

## 7. Explain multi-tenancy
Every organization is a tenant. Organization-owned data is scoped by `organization_id`. The backend identifies the authenticated user's organization membership and includes tenant scope in data access. A user from organization A cannot access organization B's resources even if they know a resource ID.

## 8. Explain RBAC
Roles represent what a user can do in an organization. The backend enforces permissions through guards/service checks. Frontend visibility is only a UX feature, not authorization.

## 9. Why WebSockets?
For events that should appear immediately without polling: task changes, comments, assignments, notifications, activity and presence.

## 10. Why BullMQ?
To move non-critical or long-running work out of the request path, reducing latency and enabling retries and independent worker scaling.

## 11. Why S3 instead of PostgreSQL for files?
Object storage is designed for large binary objects. The relational database stores metadata and authorization relationships.

## 12. How is AI secured?
The model gets approved tools with structured schemas. Each tool calls normal application services, which enforce authentication and authorization. The model cannot issue unrestricted SQL.

## 13. What would you scale first?
Measure first. Then scale the bottleneck: database/query/index improvements, API horizontal scaling, Redis/queue capacity and independent workers as actual workload requires.

## 14. What would you monitor?
API latency/error rate, request count, worker failures, queue depth, database connections, cache usage and business signals such as active organizations/users, task completion and notification delivery.

## 15. Strong project statement
Built a multi-tenant B2B operations SaaS using Next.js, TypeScript, NestJS, PostgreSQL, Redis, WebSockets, Docker and AWS, implementing RBAC, tenant isolation, background jobs, audit logging, real-time collaboration, automated testing, CI/CD and AI-assisted workflows.

## 16. Be honest about implementation status
The supplied README marks the project as active development. During interviews, distinguish clearly between:
- implemented and tested
- implemented locally but not production-deployed
- designed/planned
- future scaling option

Never present planned architecture as measured production behavior.
