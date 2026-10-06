# OpsFlow — API Documentation

## 1. API purpose
The NestJS API is the authoritative application boundary. It exposes REST endpoints for normal request/response operations and WebSockets for real-time events.

The README specifies REST API, WebSockets and OpenAPI/Swagger. Exact endpoint names below are a proposed contract for implementation and should be finalized with the codebase.

## 2. API conventions
Base URL examples:
```text
/api/v1
```

Use JSON for normal request/response bodies.

Recommended response shape:
```json
{
  "data": {},
  "meta": {}
}
```

Recommended error shape:
```json
{
  "error": {
    "code": "FORBIDDEN",
    "message": "You do not have permission to perform this action.",
    "requestId": "..."
  }
}
```

Do not expose stack traces, secrets, SQL text or internal infrastructure details to clients.

## 3. Authentication endpoints
```text
POST   /auth/login
POST   /auth/logout
POST   /auth/refresh              (if refresh-token/session design uses it)
GET    /auth/me
```

Authentication may use secure session/token management and OAuth where applicable. The final mechanism must be selected and documented before production.

## 4. Organization endpoints
```text
POST   /organizations
GET    /organizations
GET    /organizations/:organizationId
PATCH  /organizations/:organizationId
```

All organization operations must verify the caller's relationship to the organization.

## 5. Member endpoints
```text
GET    /organizations/:organizationId/members
POST   /organizations/:organizationId/members/invitations
PATCH  /organizations/:organizationId/members/:memberId
DELETE /organizations/:organizationId/members/:memberId
```

Member role changes require appropriate permission.

## 6. Project endpoints
```text
GET    /projects
POST   /projects
GET    /projects/:projectId
PATCH  /projects/:projectId
DELETE /projects/:projectId
```

Project listing must be tenant-scoped and should support filtering/sorting where required.

## 7. Task endpoints
```text
GET    /projects/:projectId/tasks
POST   /projects/:projectId/tasks
GET    /tasks/:taskId
PATCH  /tasks/:taskId
DELETE /tasks/:taskId
POST   /tasks/:taskId/assignees
DELETE /tasks/:taskId/assignees/:userId
POST   /tasks/:taskId/comments
GET    /tasks/:taskId/comments
```

Task updates should validate status, priority, assignee and due-date fields. State-changing operations should generate audit/activity records where required.

## 8. Notification endpoints
```text
GET    /notifications
POST   /notifications/:notificationId/read
POST   /notifications/read-all
```

Notifications can also arrive in real time through WebSockets.

## 9. Attachment endpoints
```text
POST   /attachments/presign
POST   /attachments/complete
GET    /attachments/:attachmentId/download-url
DELETE /attachments/:attachmentId
```

The API must verify organization/resource access before creating presigned URLs.

## 10. Search endpoint
```text
GET /search?q=<query>&type=<resourceType>
```

Initial search can use PostgreSQL full-text search. OpenSearch is a future scaling option.

## 11. Reports
```text
GET /reports/projects
GET /reports/tasks
GET /reports/activity
```

Reports should enforce the caller's organization scope and role permissions.

## 12. Audit endpoints
```text
GET /audit-logs
GET /audit-logs/:id
```

Audit records are read-only from the normal application API.

## 13. WebSocket events
Suggested event names:
```text
task.updated
task.assigned
comment.created
notification.created
activity.created
presence.updated
project.updated
```

Event payloads should contain identifiers and the minimum data required by clients. Avoid broadcasting confidential fields.

Example:
```json
{
  "event": "task.updated",
  "data": {
    "taskId": "task_123",
    "projectId": "project_10",
    "organizationId": "org_1",
    "changedFields": ["status"],
    "version": 4
  }
}
```

## 14. Idempotency
For operations likely to be retried, consider an idempotency key. Background jobs should also be designed to tolerate retries.

## 15. Pagination
Use cursor pagination for large/high-volume resources where appropriate. A simple first implementation may use page/limit, but the contract should define maximum page size and stable ordering.

## 16. Validation
Validate all external input at the API boundary. Validate IDs, enums, dates, strings, array lengths, upload metadata and query parameters.

## 17. HTTP status guidance
```text
200 OK
201 Created
204 No Content
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
409 Conflict
422 Unprocessable Entity
429 Too Many Requests
500 Internal Server Error
503 Service Unavailable
```

Use `404` carefully when resource existence itself is sensitive; sometimes a uniform authorization response is preferable.

## 18. Swagger/OpenAPI
Document request schemas, response schemas, authentication, error responses and examples. Keep generated API documentation aligned with the actual controllers/DTOs.
