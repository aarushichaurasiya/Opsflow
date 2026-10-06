# OpsFlow — Observability

## 1. Purpose
Observability helps answer:
- Is the system healthy?
- What is slow?
- What is failing?
- Which background jobs are stuck?
- Are users experiencing errors?
- Is business activity behaving as expected?

## 2. Three pillars
### Logs
Use structured logs with:
- timestamp
- level
- service
- request ID/trace ID
- user/organization identifiers when safe
- event name
- duration
- error code

Never log secrets or sensitive credentials.

### Metrics
The supplied README calls out:
- request count
- error rate
- request latency
- background job failures
- queue depth
- CPU
- memory
- database connections
- cache usage
- active organizations
- active users
- tasks completed
- projects created
- notification delivery
- AI usage

### Traces
OpenTelemetry can trace a request across:
```text
Browser/API request
 → NestJS controller
 → service
 → Prisma/database
 → Redis/queue
 → worker/external provider
```

## 3. Dashboards
Recommended dashboards:
1. API health
2. Database health
3. Redis/queue health
4. Worker health
5. Business activity
6. AI usage/cost

## 4. Alerts
Alert on symptoms that require action, for example:
- sustained high error rate
- elevated API latency
- worker failures
- queue backlog growth
- database connection exhaustion
- infrastructure resource exhaustion

Avoid alerting on every isolated transient error.

## 5. Request correlation
Generate/propagate a request or trace ID so an API error can be connected to downstream logs and worker activity.

## 6. Performance claims
The README explicitly says performance numbers should be published only after reproducible testing/deployment. Any dashboard number shown in documentation should therefore be labeled as measured data or example data.
