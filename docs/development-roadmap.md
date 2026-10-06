# OpsFlow — Development Roadmap

## Phase 1 — Foundation
Goal: establish a runnable monorepo and secure application skeleton.

Deliverables:
- monorepo
- Next.js application
- NestJS API
- PostgreSQL
- Prisma
- authentication
- base UI system
- local Docker setup

Definition of done:
- developer can install dependencies
- services start locally
- database migrations work
- sign-in works
- frontend can call authenticated API

## Phase 2 — Core SaaS
Deliver:
- organizations
- members
- roles
- projects
- tasks
- comments
- dashboard

Definition of done:
- a user can create organization/project/task data
- tenant boundaries are enforced
- role permissions work
- basic collaboration flow works

## Phase 3 — Production features
Deliver:
- multi-tenant authorization hardening
- audit logs
- Redis caching/infrastructure
- BullMQ jobs
- notifications
- file uploads
- search
- WebSockets

Definition of done:
- asynchronous work is reliable
- notifications persist and can be real-time
- file access is authorized
- live task/comment updates work
- audit history is visible to authorized users

## Phase 4 — Engineering quality
Deliver:
- unit tests
- integration tests
- E2E tests
- API documentation
- error handling
- rate limiting
- security hardening

Definition of done:
- CI validates every pull request
- critical workflows have automated coverage
- security boundaries have negative tests

## Phase 5 — Cloud
Deliver:
- Docker
- GitHub Actions
- AWS deployment
- Terraform
- monitoring
- logging
- backup strategy

Definition of done:
- staging environment is reproducible
- production deployment is automated/controlled
- observability is active
- restore procedure is documented/tested

## Phase 6 — AI
Deliver:
- AI assistant
- tool calling
- project summarization
- natural-language queries
- RAG where useful
- AI evaluation
- usage/cost tracking

Definition of done:
- AI tools are authorization-aware
- no unrestricted DB access exists
- usage is observable
- important workflows have evaluations

## Recommended build order
Do not begin with AI, Terraform or microservices. First build the smallest complete vertical slice:
```text
Auth → Organization → Project → Task → Comment
```
Then add production infrastructure around proven application behavior.
