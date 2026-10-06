# OpsFlow

> Production-oriented, multi-tenant operations SaaS platform for managing projects, tasks, teams, collaboration, files, workflows, and operational insights.

**Status:** 🚧 In active development  
**Type:** Full-Stack SaaS / SDE Portfolio Project  
**Focus:** Production-grade software engineering, cloud deployment, security, scalability, observability, and AI-assisted workflows

---

## 🚀 Overview

OpsFlow is a modern B2B operations platform designed to bring project management, task tracking, team collaboration, files, notifications, audit trails, and operational reporting into one system.

The project is intentionally designed beyond a basic CRUD application. It demonstrates how a real-world full-stack product can be designed from the **frontend and API layer through database architecture, authorization, asynchronous processing, real-time communication, testing, CI/CD, cloud infrastructure, and observability**.

The platform supports multiple organizations (tenants), each with isolated users, projects, tasks, files, and operational data.

### Core idea

```text
Organizations
      │
      ├── Teams
      │    └── Members & Roles
      │
      ├── Projects
      │    ├── Tasks
      │    ├── Comments
      │    ├── Files
      │    └── Activity
      │
      ├── Notifications
      │
      ├── Reports
      │
      └── Audit Logs
```

---

## 🎯 Problem

Teams frequently use multiple disconnected tools for:

- Project management
- Task tracking
- Team communication
- File sharing
- Notifications
- Operational reporting
- Activity tracking
- Access management

This creates fragmented information and makes it difficult to understand what is happening across an organization.

OpsFlow aims to provide a unified operational workspace while demonstrating production-quality engineering practices.

---

## 💡 Solution

OpsFlow provides a centralized workspace where organizations can:

- Create and manage projects
- Assign and track tasks
- Collaborate through comments
- Share files securely
- Receive real-time notifications
- Manage users and roles
- Track operational activity
- Search across organizational data
- Generate reports
- Maintain complete audit trails
- Use AI-assisted workflows

---

# ✨ Key Features

## 🏢 Multi-Tenant Architecture

Organizations are isolated from each other.

```text
Organization A
├── Users
├── Projects
├── Tasks
└── Files

Organization B
├── Users
├── Projects
├── Tasks
└── Files
```

Every organization-owned resource is associated with an `organization_id`.

This prevents users from accessing data belonging to another organization.

---

## 👥 Role-Based Access Control

OpsFlow supports permission-based access using organizational roles.

Example:

| Role | Permissions |
|---|---|
| Super Admin | Platform-wide administration |
| Organization Admin | Manage organization, users, projects |
| Manager | Create projects, assign tasks, view reports |
| Employee | Work on assigned tasks and collaborate |
| Client | View approved projects and communicate |

Authorization is enforced at the API/service layer rather than relying only on frontend restrictions.

---

## 📋 Project & Task Management

Users can:

- Create projects
- Create tasks and subtasks
- Assign tasks
- Set priorities
- Set due dates
- Track status
- Add comments
- Attach files
- Track activity
- Filter and sort tasks
- View project progress

Example workflow:

```text
Backlog
   ↓
Todo
   ↓
In Progress
   ↓
Review
   ↓
Completed
```

---

## ⚡ Real-Time Collaboration

WebSockets are used for real-time updates.

Examples:

- Task status changes
- New comments
- Assignment changes
- Notifications
- Activity updates
- Online presence

Example:

```text
User A updates task
        │
        ▼
    WebSocket
        │
        ▼
     Backend
        │
   ┌────┼────┐
   ▼    ▼    ▼
 User B  Manager  Dashboard
```

---

## 🔔 Notifications

The system supports event-driven notifications.

Examples:

- Task assigned
- Task completed
- Comment mentioned
- Project updated
- Deadline approaching
- User invited
- Approval requested

Background processing is used for operations that do not need to block the HTTP request.

---

## 📁 Secure File Management

Files are stored using object storage rather than directly inside the relational database.

Architecture:

```text
Browser
   │
   ▼
Backend
   │
   ▼
Presigned URL
   │
   ▼
Object Storage
   │
   ▼
Database Metadata
```

The database stores metadata such as:

- File name
- File type
- Size
- Storage key
- Owner
- Organization
- Related resource
- Created timestamp

---

## 🔎 Search

Users can search across organizational resources such as:

- Projects
- Tasks
- Comments
- Users
- Files

The initial implementation can use PostgreSQL full-text search, with OpenSearch as a future scaling option.

---

## 🧾 Audit Logging

Important actions are recorded in an immutable activity/audit trail.

Example:

```text
10:42 AM
Aarushi changed Task #182

Status:
"In Progress" → "Completed"

10:38 AM
Rahul uploaded:
api-documentation.pdf

10:31 AM
Priya assigned Task #182
to Aarushi
```

Example audit schema:

```text
audit_logs
├── id
├── organization_id
├── user_id
├── action
├── resource
├── resource_id
├── old_value
├── new_value
├── ip_address
└── created_at
```

---

# 🤖 AI-Assisted Workflows

AI is an additional capability rather than the foundation of the application.

The AI assistant can interact with approved application tools.

Example:

> "Show me all overdue tasks assigned to the frontend team."

Possible workflow:

```text
User Request
     ↓
AI Assistant
     ↓
Intent Detection
     ↓
Tool Selection
     ↓
Application API
     ↓
Authorization Check
     ↓
Database
     ↓
Structured Result
     ↓
AI Response
```

Other possible AI features:

- Project summaries
- Task summaries
- Meeting/action-item extraction
- Natural-language operational queries
- Report generation
- Workflow recommendations

The AI layer should never receive unrestricted database access.

---

# 🏗️ Architecture

High-level architecture:

```text
                         ┌──────────────────┐
                         │     Browser      │
                         └────────┬─────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │    Next.js       │
                         │ React + TS       │
                         └────────┬─────────┘
                                  │
                         REST / WebSocket
                                  │
                                  ▼
                         ┌──────────────────┐
                         │     NestJS       │
                         │    API Layer     │
                         └────────┬─────────┘
                                  │
              ┌───────────────────┼───────────────────┐
              │                   │                   │
              ▼                   ▼                   ▼
       ┌────────────┐      ┌────────────┐      ┌────────────┐
       │ PostgreSQL │      │   Redis    │      │   S3       │
       │  + Prisma  │      │ Cache/Queue│      │  Storage   │
       └────────────┘      └─────┬──────┘      └────────────┘
                                 │
                                 ▼
                           ┌────────────┐
                           │  BullMQ    │
                           │ Background │
                           │   Jobs     │
                           └────────────┘

                         ┌──────────────────┐
                         │   AI Services    │
                         │ LLM + Tools/RAG  │
                         └──────────────────┘
```

---

# 🧰 Technology Stack

## Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- TanStack Query

## Backend

- Node.js
- NestJS
- TypeScript
- REST API
- WebSockets
- OpenAPI / Swagger

## Database

- PostgreSQL
- Prisma ORM
- Redis

## Background Processing

- BullMQ
- Redis

## Authentication & Security

- OAuth 2.0
- JWT/session-based authentication
- RBAC
- Multi-tenant authorization
- Rate limiting
- Input validation
- Secure cookies
- Audit logging

## Storage

- AWS S3
- Presigned URLs

## AI

- LLM API
- Tool/function calling
- RAG / pgvector where required
- Structured outputs
- AI evaluation and usage tracking

## Testing

- Jest
- Supertest
- Playwright

## DevOps

- Docker
- Docker Compose
- GitHub Actions
- Terraform

## Cloud

- AWS
- ECS/Fargate or equivalent container platform
- RDS PostgreSQL
- S3
- CloudFront
- CloudWatch

## Observability

- OpenTelemetry
- Prometheus
- Grafana
- Structured logging

---

# 🔐 Security Architecture

Security is treated as a first-class concern.

## Authentication

- Secure authentication flow
- Session/token management
- Password hashing where password auth is used
- OAuth integration where applicable
- Refresh/session protection

## Authorization

Authorization is enforced server-side.

```text
Request
  ↓
Authentication
  ↓
Identify User
  ↓
Identify Organization
  ↓
Check Role/Permission
  ↓
Resource Ownership Check
  ↓
Execute Operation
```

## Security Controls

- Tenant isolation
- RBAC
- Input validation
- Rate limiting
- Secure headers
- CORS configuration
- SQL injection protection through ORM/parameterized queries
- XSS mitigation
- CSRF protection where applicable
- Secrets stored outside source code
- Audit logging
- File access validation

---

# 🗄️ Database Design

Core entities:

```text
users
organizations
organization_members
roles
permissions
projects
tasks
task_assignees
comments
attachments
notifications
audit_logs
sessions
```

Simplified relationship:

```text
Organization
    │
    ├── Organization Members
    │          │
    │          └── Users
    │
    ├── Projects
    │      │
    │      ├── Tasks
    │      │    ├── Comments
    │      │    └── Attachments
    │      │
    │      └── Activity
    │
    ├── Notifications
    │
    └── Audit Logs
```

Indexes should be added for frequently queried fields such as:

- `organization_id`
- `project_id`
- `assignee_id`
- `status`
- `created_at`
- `due_date`

---

# 🔄 Background Job Architecture

Long-running or non-critical operations are processed asynchronously.

Example:

```text
HTTP Request
     │
     ▼
Create Task
     │
     ├──────► PostgreSQL
     │
     ▼
Queue Event
     │
     ▼
BullMQ
     │
 ┌───┼─────────────┐
 ▼   ▼             ▼
Email Notification
Analytics Update
Activity Processing
```

This prevents unnecessary latency in the main API request.

---

# 🧪 Testing Strategy

The application uses multiple levels of testing.

## Unit Testing

Test:

- Services
- Utility functions
- Authorization logic
- Business rules

## Integration Testing

Test:

- API endpoints
- Database interactions
- Authentication
- Authorization
- Queue processing

## End-to-End Testing

Use Playwright to test critical workflows:

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

---

# 🚀 CI/CD

Every pull request should go through automated checks.

```text
Developer
   │
   ▼
Git Push
   │
   ▼
GitHub Actions
   │
   ├── Lint
   ├── Type Check
   ├── Unit Tests
   ├── Integration Tests
   ├── E2E Tests
   ├── Security Checks
   ├── Build
   └── Docker Build
            │
            ▼
        Deployment
```

Production deployments should use environment-specific configuration and protected secrets.

---

# ☁️ Deployment

Target deployment architecture:

```text
                     CloudFront
                         │
                         ▼
                    AWS Network
                         │
             ┌───────────┴───────────┐
             ▼                       ▼
        Web Application          API Service
             │                       │
             │              ┌────────┼────────┐
             │              ▼        ▼        ▼
             │            RDS      Redis      S3
             │
             └──────────────► API
```

Infrastructure should be managed using Terraform where practical.

---

# 📊 Observability

The application tracks:

### Application metrics

- Request count
- Error rate
- Request latency
- Background job failures
- Queue depth

### Infrastructure metrics

- CPU
- Memory
- Database connections
- Cache usage

### Business metrics

- Active organizations
- Active users
- Tasks completed
- Projects created
- Notification delivery
- AI usage

Example dashboard:

```text
API P95 Latency       180ms
Error Rate             0.3%
Queue Depth             12
Active Organizations    48
Active Users           420
```

Only publish performance numbers after they have been measured in a reproducible test/deployment environment.

---

# 📈 Scalability Strategy

OpsFlow is designed to scale incrementally.

### Stage 1 — Monolithic application

```text
Next.js
   +
NestJS
   +
PostgreSQL
   +
Redis
```

### Stage 2 — Horizontal scaling

```text
Load Balancer
      │
 ┌────┼────┐
 ▼    ▼    ▼
API  API   API
      │
      ▼
PostgreSQL
```

### Stage 3 — Independent workers

```text
API
 │
 ▼
Redis / Queue
 │
 ├── Notification Worker
 ├── Analytics Worker
 ├── AI Worker
 └── File Worker
```

The architecture intentionally avoids premature microservices while keeping clear boundaries for future extraction.

---

# 📁 Suggested Repository Structure

```text
opsflow/
│
├── apps/
│   ├── web/
│   └── api/
│
├── packages/
│   ├── ui/
│   ├── types/
│   ├── config/
│   └── eslint/
│
├── infrastructure/
│   ├── terraform/
│   └── docker/
│
├── docs/
│   ├── architecture.md
│   ├── database.md
│   ├── api.md
│   └── security.md
│
├── tests/
│   ├── integration/
│   └── e2e/
│
├── .github/
│   └── workflows/
│
├── docker-compose.yml
├── package.json
└── README.md
```

---

# 🛠️ Local Development

## Prerequisites

- Node.js 20+
- pnpm
- Docker
- Docker Compose
- PostgreSQL (or Docker)
- Redis (or Docker)
- AWS account for cloud features
- Required AI provider API key for AI features

## Clone

```bash
git clone https://github.com/<your-username>/opsflow.git
cd opsflow
```

## Install

```bash
pnpm install
```

## Environment

Create environment files from the provided examples:

```bash
cp .env.example .env
```

Never commit real secrets.

Example variables:

```env
DATABASE_URL=
REDIS_URL=
JWT_SECRET=
AWS_REGION=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_S3_BUCKET=
AI_API_KEY=
```

## Start dependencies

```bash
docker compose up -d
```

## Database

```bash
pnpm prisma migrate dev
pnpm prisma generate
```

## Run development

```bash
pnpm dev
```

---

# 🧑‍💻 Development Roadmap

## Phase 1 — Foundation

- [ ] Monorepo setup
- [ ] Next.js application
- [ ] NestJS API
- [ ] PostgreSQL
- [ ] Prisma
- [ ] Authentication
- [ ] Base UI system

## Phase 2 — Core SaaS

- [ ] Organizations
- [ ] Members
- [ ] Roles
- [ ] Projects
- [ ] Tasks
- [ ] Comments
- [ ] Dashboard

## Phase 3 — Production Features

- [ ] Multi-tenant authorization
- [ ] Audit logs
- [ ] Redis caching
- [ ] BullMQ jobs
- [ ] Notifications
- [ ] File uploads
- [ ] Search
- [ ] WebSockets

## Phase 4 — Engineering Quality

- [ ] Unit tests
- [ ] Integration tests
- [ ] E2E tests
- [ ] API documentation
- [ ] Error handling
- [ ] Rate limiting
- [ ] Security hardening

## Phase 5 — Cloud

- [ ] Docker
- [ ] GitHub Actions
- [ ] AWS deployment
- [ ] Terraform
- [ ] Monitoring
- [ ] Logging
- [ ] Backup strategy

## Phase 6 — AI

- [ ] AI assistant
- [ ] Tool calling
- [ ] Project summarization
- [ ] Natural-language queries
- [ ] RAG where useful
- [ ] AI evaluation
- [ ] Usage/cost tracking

---

# 🧠 Engineering Decisions

## Why PostgreSQL?

The application has strongly relational data:

- Organizations
- Members
- Roles
- Projects
- Tasks
- Comments
- Permissions
- Audit records

PostgreSQL provides strong consistency, relational constraints, indexing, transactions, and mature production tooling.

## Why Redis?

Redis is useful for:

- Caching
- Sessions where appropriate
- Rate limiting
- Pub/sub
- Queue infrastructure

## Why NestJS?

NestJS provides a structured architecture for a TypeScript backend and encourages separation of:

- Controllers
- Services
- Modules
- Guards
- Interceptors
- Validation
- Dependency injection

## Why Next.js?

Next.js provides:

- React-based UI
- Server-side capabilities
- Routing
- Performance optimization
- Strong TypeScript support
- Flexible deployment options

## Why Docker?

Docker provides reproducible application environments across:

```text
Development
     ↓
CI
     ↓
Staging
     ↓
Production
```

---

# 🏆 What This Project Demonstrates

OpsFlow is designed to demonstrate practical knowledge of:

- Full-stack application architecture
- TypeScript
- React / Next.js
- Node.js / NestJS
- REST API design
- WebSockets
- PostgreSQL
- Database modelling
- Redis
- Background jobs
- Authentication
- Authorization
- Multi-tenancy
- Secure file uploads
- Cloud architecture
- AWS
- Docker
- CI/CD
- Terraform
- Automated testing
- Observability
- AI integration
- System design

---

# 📌 Portfolio Positioning

### Short description

> **OpsFlow is a production-oriented multi-tenant operations SaaS built with Next.js, TypeScript, NestJS, PostgreSQL, Redis, WebSockets, AWS, Docker, and CI/CD. It demonstrates secure multi-tenancy, RBAC, real-time collaboration, background processing, audit logging, automated testing, observability, and AI-assisted workflows.**

### Resume bullet

> **Built a multi-tenant B2B operations SaaS using Next.js, TypeScript, NestJS, PostgreSQL, Redis, WebSockets, Docker and AWS, implementing RBAC, tenant isolation, background jobs, audit logging, real-time collaboration, automated testing, CI/CD and AI-assisted workflows.**

---

# 🔗 Project Links

- **Live Demo:** Coming soon
- **API Documentation:** Coming soon
- **GitHub:** Coming soon
- **Architecture Documentation:** `/docs/architecture.md`

---

# 👤 Author

**Aarushi Chaurasiya**

Full-Stack Developer · AI Application Engineer

- Portfolio: https://aarushichaurasiya.com.np/
- GitHub: Add your GitHub URL
- LinkedIn: Add your LinkedIn URL

---

# 📄 License

Choose a license appropriate for your intended use.

For a public portfolio project, MIT is a common option:

```text
MIT License
```

---

## ⭐ Why OpsFlow?

The purpose of OpsFlow is not to build another CRUD application.

The goal is to demonstrate the complete lifecycle of a modern software product:

```text
Product Idea
     ↓
System Design
     ↓
Frontend
     ↓
Backend
     ↓
Database
     ↓
Security
     ↓
Async Processing
     ↓
Real-Time Systems
     ↓
Testing
     ↓
CI/CD
     ↓
Cloud
     ↓
Observability
     ↓
AI Integration
```

**Build software that works. Build systems that scale. Build with engineering discipline.**
