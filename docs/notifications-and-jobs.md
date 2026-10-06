# OpsFlow — Notifications and Background Jobs

## 1. Why asynchronous processing exists
The API should not make users wait for non-critical work such as email delivery, analytics updates or activity processing.

## 2. Flow
```text
User request
   ↓
NestJS API
   ↓
Primary database change
   ↓
Queue event
   ↓
Redis / BullMQ
   ↓
Worker
   ├── Notification
   ├── Email
   ├── Analytics
   └── Activity processing
```

## 3. Job design
Every job should have:
- stable job type
- tenant context where needed
- resource identifiers
- retry policy
- timeout
- structured logs
- idempotency strategy
- failure handling

Do not put passwords, access tokens or unnecessary private content into queue payloads.

## 4. Example job
```json
{
  "type": "notification.task-assigned",
  "organizationId": "org_123",
  "taskId": "task_456",
  "recipientUserId": "user_789"
}
```

The worker retrieves authoritative data rather than trusting mutable text copied into a job payload.

## 5. Retry behavior
Transient failures may be retried with backoff. Permanent failures should not retry indefinitely.

Examples:
- temporary email provider failure → retry
- invalid recipient → terminal failure
- database timeout → retry within limits
- malformed job payload → reject and alert

## 6. Notifications
Notification triggers described in the supplied README include:
- task assigned
- task completed
- comment mention
- project updated
- deadline approaching
- user invited
- approval requested

A notification can have an in-app database record plus optional external delivery.

## 7. Real-time + persistent notifications
Use both when appropriate:
```text
Event
 ├── persist notification record
 └── emit WebSocket event
```

This means a disconnected user can still see the notification later.

## 8. Observability
Track:
- queue depth
- job duration
- success/failure count
- retry count
- oldest pending job
- dead-letter/terminal failures
