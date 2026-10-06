# OpsFlow — Secure File Storage

## 1. Design
Files are stored in object storage such as AWS S3. PostgreSQL stores file metadata.

```text
Browser
  ↓
NestJS API
  ↓
Authorization
  ↓
Presigned URL
  ↓
S3
  ↓
Attachment metadata in PostgreSQL
```

## 2. Metadata
Store:
- attachment ID
- original filename
- content type
- size
- storage key
- owner
- organization ID
- related project/task/resource
- created timestamp

## 3. Upload sequence
1. User selects file.
2. Browser sends metadata to API.
3. API authenticates and authorizes access.
4. API validates type/size.
5. API generates unique S3 key.
6. API returns short-lived presigned upload URL.
7. Browser uploads directly to S3.
8. Browser/API confirms completion.
9. API creates/updates attachment metadata.

## 4. Download sequence
1. User requests attachment.
2. API verifies organization/resource access.
3. API generates short-lived download URL.
4. Browser downloads from S3.

## 5. Storage key design
A logical structure can be:
```text
organizations/{organizationId}/projects/{projectId}/attachments/{attachmentId}
```

Do not use raw user filenames as storage keys.

## 6. Security
- Keep bucket private.
- Use short-lived presigned URLs.
- Enforce size/type policy.
- Validate resource authorization.
- Consider malware scanning as a future production enhancement where the threat model requires it.
- Avoid storing secrets or sensitive credentials as ordinary attachments.
