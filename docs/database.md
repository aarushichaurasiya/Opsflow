# OpsFlow — Database Design

## 1. Database choice
PostgreSQL is the primary relational database because OpsFlow has strongly related organizations, members, roles, projects, tasks, comments, permissions and audit records. The supplied design also expects transactions, constraints, indexing and mature production tooling.

Prisma is the ORM/data access layer.

## 2. Core entities
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

## 3. Relationship model
```text
Organization
 ├── Organization Members ── User
 ├── Projects
 │    └── Tasks
 │         ├── Task Assignees ── User
 │         ├── Comments
 │         └── Attachments
 ├── Notifications
 └── Audit Logs
```

## 4. Suggested entity responsibilities
### users
Identity profile and account-level information. Authentication secrets should be stored only in an appropriately protected representation when password authentication exists.

### organizations
Tenant boundary and organization-level settings.

### organization_members
Join entity connecting users to organizations, including organization role/membership state.

### roles / permissions
Represent organizational access control. The README names Super Admin, Organization Admin, Manager, Employee and Client as example roles.

### projects
Organization-owned work containers.

### tasks
Organization/project-owned work items. Include status, priority, due date, creator and project references.

### task_assignees
Supports assignment relationships and future multi-assignee behavior without duplicating user fields on the task itself.

### comments
Collaboration content associated with projects/tasks and author identity.

### attachments
Metadata for files stored in S3/object storage.

### notifications
User-facing notification records, including type, read state and target/reference information.

### audit_logs
Important immutable operational history: actor, tenant, action, resource, old/new values, IP and timestamp.

### sessions
Session/token-related persistence where the selected authentication design requires it.

## 5. Tenant isolation rules
Every tenant-owned table should carry `organization_id` directly or have an unambiguous relation that allows secure tenant scoping. For high-risk queries, prefer explicit organization filters instead of relying on implicit assumptions.

Bad:
```text
find task by task_id
```

Preferred:
```text
find task where task_id = X AND organization_id = currentOrganization
```

The same principle applies to update, delete and attachment/download authorization.

## 6. Important indexes
The supplied design calls out indexes for:
- `organization_id`
- `project_id`
- `assignee_id`
- `status`
- `created_at`
- `due_date`

Recommended composite indexes should be based on actual query patterns. Example:
```text
(organization_id, status)
(organization_id, project_id)
(organization_id, due_date)
(organization_id, created_at)
```

Do not create every possible index. Validate with query plans and production-like data.

## 7. Transactions
Use database transactions when multiple changes must succeed or fail together. Examples:
- create project + initial membership/configuration records
- assign a task + write related state
- state transition + audit record when atomicity is required

External operations such as sending email should generally not be placed inside a long database transaction. Use a durable job/event pattern instead.

## 8. Audit data
Audit records should be append-oriented. Do not allow normal users to rewrite historical audit entries.

Example:
```text
id
organization_id
user_id
action
resource
resource_id
old_value
new_value
ip_address
created_at
```

`old_value` and `new_value` may be structured JSON when appropriate, while avoiding accidental storage of secrets or sensitive credentials.

## 9. Soft deletion
The supplied README does not mandate soft deletion. If introduced, document it explicitly and ensure every query respects deletion state. For compliance/audit requirements, decide separately whether records must be retained rather than deleted.

## 10. Migration policy
Use Prisma migrations as versioned schema history.

Development:
```bash
pnpm prisma migrate dev
pnpm prisma generate
```

Production migration execution must be part of a controlled deployment process and must be tested against a production-like database before release.

## 11. Data integrity checklist
- Foreign keys for relational ownership.
- Unique constraints where business identity requires uniqueness.
- Non-null constraints for required fields.
- Valid enum/status transitions in service logic.
- Organization scope in queries.
- Timestamps for lifecycle tracking.
- Appropriate indexes.
- Transaction boundaries documented for multi-write operations.
