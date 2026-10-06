# OpsFlow — DevOps, CI/CD and Deployment

## 1. Local prerequisites
The supplied README lists:
- Node.js 20+
- pnpm
- Docker
- Docker Compose
- PostgreSQL or Docker
- Redis or Docker
- AWS account for cloud features
- AI provider API key for AI features

## 2. Local setup
```bash
pnpm install
cp .env.example .env
docker compose up -d
pnpm prisma migrate dev
pnpm prisma generate
pnpm dev
```

Never commit real secrets.

## 3. Environment variables
The supplied README lists examples:
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

Production secrets should come from a managed secret/configuration mechanism rather than source control.

## 4. CI/CD pipeline
```text
Developer
  ↓
Git push / pull request
  ↓
GitHub Actions
  ├── lint
  ├── type check
  ├── unit tests
  ├── integration tests
  ├── E2E tests
  ├── security checks
  ├── build
  └── Docker build
          ↓
       Deployment
```

## 5. Environment model
Use separate configuration for:
- development
- test/CI
- staging
- production

Do not copy production secrets into developer machines unnecessarily.

## 6. Docker
Docker should provide reproducible environments across development, CI, staging and production.

Recommended container principles:
- small runtime image
- non-root process where practical
- health check
- deterministic dependency installation
- no secrets baked into image

## 7. AWS target architecture
The supplied target includes:
- CloudFront
- AWS network
- web application
- API service
- RDS PostgreSQL
- Redis
- S3

ECS/Fargate is listed as the target container platform or equivalent.

## 8. Terraform
Terraform should define infrastructure such as networking, compute, databases, storage and monitoring where practical.

Keep state secured and use an appropriate remote backend for team environments.

## 9. Deployment strategy
A production deployment should:
1. Build immutable artifacts.
2. Run tests/checks.
3. Apply infrastructure changes where required.
4. Run database migrations using controlled tooling.
5. Deploy the application.
6. Run health checks.
7. Monitor errors/latency.
8. Roll back application version if required.

Database migrations must be backward-compatible with the deployment sequence when rolling updates are used.

## 10. Backup/recovery
Document:
- PostgreSQL backup policy
- recovery point objective (RPO)
- recovery time objective (RTO)
- restore test frequency
- S3 versioning/retention policy if required

Do not claim backup guarantees until they are configured and tested.
