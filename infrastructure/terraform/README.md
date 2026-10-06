# Terraform Infrastructure

This directory is a documentation placeholder for infrastructure-as-code.

The supplied architecture targets AWS and identifies ECS/Fargate (or equivalent), RDS PostgreSQL, S3, CloudFront, Redis and CloudWatch. Terraform should manage infrastructure where practical.

Recommended future module boundaries:
```text
terraform/
├── modules/
│   ├── network/
│   ├── compute/
│   ├── database/
│   ├── cache/
│   ├── storage/
│   └── observability/
└── environments/
    ├── staging/
    └── production/
```

Do not add real cloud credentials to Terraform files. Use environment/CI secret management.
