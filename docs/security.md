# OpsFlow — Security Architecture

## 1. Security objective
Security is a first-class concern because OpsFlow stores organization data, project information, files, audit history and potentially AI-related operational information.

## 2. Security model
```text
Request
  ↓
Authentication
  ↓
Identify user
  ↓
Identify organization
  ↓
Role/permission check
  ↓
Resource ownership/access check
  ↓
Business rule validation
  ↓
Operation
```

## 3. Authentication
The supplied design supports secure authentication with session/token management and OAuth where applicable.

Implementation requirements:
- Use secure cookies for browser sessions when session authentication is selected.
- Protect refresh/session tokens.
- Hash passwords using a modern password hashing approach if password authentication is offered.
- Never log passwords, access tokens or refresh tokens.
- Rotate/revoke sessions according to the chosen authentication model.
- Apply rate limits to login and sensitive authentication endpoints.

## 4. Authorization
RBAC roles include:
- Super Admin
- Organization Admin
- Manager
- Employee
- Client

Authorization must be evaluated server-side. A hidden frontend button is not a security control.

## 5. Tenant isolation
Every organization-owned query must be tenant-scoped.

Example conceptual policy:
```text
currentUser.organizationIds
       ↓
requested organization
       ↓
membership exists?
       ↓
permission granted?
       ↓
resource belongs to organization?
```

Never trust `organizationId` supplied by a client without checking that the authenticated user belongs to that organization.

## 6. Input validation
Validate:
- body fields
- path parameters
- query parameters
- enums/status values
- file metadata
- array sizes
- pagination limits

Reject unexpected or dangerous input early.

## 7. Injection protection
Use Prisma/parameterized queries. Never construct raw SQL by concatenating untrusted strings.

If raw SQL is required, use parameterized statements and review it as security-sensitive code.

## 8. XSS/CSRF/CORS
- Escape/render user content safely.
- Sanitize rich text if rich HTML is supported.
- Use secure cookie settings where applicable.
- Configure CORS to known application origins rather than `*` for authenticated production traffic.
- Apply CSRF protection when the authentication/cookie architecture requires it.
- Set secure HTTP headers.

## 9. Rate limiting
Protect authentication, search, AI, file presign, invitations and other abuse-sensitive endpoints. Redis can support distributed rate limiting when multiple API instances exist.

## 10. File security
Before generating S3 presigned URLs:
1. Authenticate the user.
2. Resolve organization membership.
3. Authorize the target resource.
4. Validate filename/type/size policy.
5. Generate a scoped storage key.
6. Return a short-lived URL.

Do not trust a client-provided storage key as proof of access.

## 11. Secrets
Never commit:
```text
DATABASE_URL
JWT_SECRET
AWS_SECRET_ACCESS_KEY
AI_API_KEY
```

Use environment variables/secrets management in deployed environments.

## 12. Audit logging
Record important security/business actions while avoiding sensitive secret material. Examples:
- role changes
- member invitations
- task state changes
- file actions
- organization settings changes
- sensitive administrative operations

## 13. AI security
The AI layer must not receive unrestricted database access.

Correct:
```text
AI → approved tool → authorized service → database
```

Incorrect:
```text
AI → arbitrary SQL → production database
```

The authorization check must remain in the application layer.

## 14. Security testing
Test:
- cross-tenant access attempts
- privilege escalation
- unauthorized task/project access
- IDOR-style resource access
- malformed tokens/sessions
- rate-limit behavior
- upload validation
- WebSocket room authorization
- AI tool authorization

## 15. Production checklist
- [ ] TLS enabled.
- [ ] Secure cookie configuration.
- [ ] Strong secrets outside source control.
- [ ] CORS restricted.
- [ ] Rate limits enabled.
- [ ] Database access restricted.
- [ ] S3 bucket access private by default.
- [ ] Audit logs enabled.
- [ ] Dependency/security scanning in CI.
- [ ] Error responses do not expose internals.
- [ ] Backups and recovery procedure documented.
