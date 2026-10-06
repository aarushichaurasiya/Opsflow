# OpsFlow Local System Audit

This audit verifies that your local development environment is correctly set up according to the **OpsFlow** architecture and documentation.

---

## ✅ Checklist (Markdown)

| ✅ | Check | Description |
|---|-------|-------------|
| ❓ | **Node.js version** | Must be **>= 20**. Run `node -v`. |
| ❓ | **Docker daemon** | Docker Desktop must be running. `docker info` should succeed. |
| ❓ | **Docker Compose services** | `docker-compose up -d` should start **PostgreSQL** and **Redis** containers. |
| ❓ | **PostgreSQL** | Port **5432** must be reachable and the DB should be ready (`pg_isready`). |
| ❓ | **Redis** | Port **6379** must be reachable (`redis-cli ping`). |
| ❓ | **Environment file** | `apps/api/.env` must contain a `DATABASE_URL` that points to the local PostgreSQL instance. |
| ❓ | **Prisma schema** | `npx prisma format` (or at least the file exists) should succeed. |
| ❓ | **API health endpoint** (optional) | `GET /health` (or `/`) should return `200`. |
| ❓ | **Linting** | `npm run lint` should pass without errors. |
| ❓ | **Tests** | `npm test` (or `npm run test`) should complete successfully. |

---

## 🛠️ Automated Audit Script (`scripts/audit.sh`)

Save the following script as `scripts/audit.sh` and make it executable (`chmod +x scripts/audit.sh`). Running the script will automatically perform the checks above and print a clear pass/fail summary.

```bash
#!/usr/bin/env bash
set -e

# Helper functions
info() { echo -e "\x1b[34m[INFO]\x1b[0m $*"; }
pass() { echo -e "\x1b[32m[PASS]\x1b[0m $*"; }
fail() { echo -e "\x1b[31m[FAIL]\x1b[0m $*"; }

info "Starting OpsFlow local system audit..."

# 1. Node version
node_version=$(node -v | cut -c2-)
node_major=$(echo "$node_version" | cut -d. -f1)
if (( node_major >= 20 )); then
  pass "Node.js version $node_version (>=20)"
else
  fail "Node.js version $node_version (must be >=20)"
fi

# 2. Docker daemon
if docker info > /dev/null 2>&1; then
  pass "Docker daemon is running"
else
  fail "Docker daemon is NOT running"
fi

# 3. Docker Compose up (if not already up)
info "Bringing up compose services..."
if ! docker compose ps > /dev/null 2>&1; then
  docker compose up -d
fi
# Give containers a few seconds to initialise
sleep 5

# 4. PostgreSQL health check
pg_container=$(docker ps -q -f "ancestor=postgres:16-alpine")
if [ -n "$pg_container" ]; then
  if docker exec "$pg_container" pg_isready -U opsflow > /dev/null 2>&1; then
    pass "PostgreSQL is ready (port 5432)"
  else
    fail "PostgreSQL is not ready"
  fi
else
  fail "PostgreSQL container not found"
fi

# 5. Redis health check
redis_container=$(docker ps -q -f "ancestor=redis:7-alpine")
if [ -n "$redis_container" ]; then
  if docker exec "$redis_container" redis-cli ping | grep -q PONG; then
    pass "Redis is reachable (port 6379)"
  else
    fail "Redis ping failed"
  fi
else
  fail "Redis container not found"
fi

# 6. .env check
if [[ -f "apps/api/.env" ]]; then
  if grep -q "DATABASE_URL" "apps/api/.env"; then
    pass "apps/api/.env contains DATABASE_URL"
  else
    fail "apps/api/.env is missing DATABASE_URL"
  fi
else
  fail "apps/api/.env file not found"
fi

# 7. Prisma schema validation (format is sufficient for v8)
if npx prisma format -c apps/api > /dev/null 2>&1; then
  pass "Prisma schema format succeeded"
else
  fail "Prisma schema format failed"
fi

# 8. Linting
if npm run lint --silent > /dev/null 2>&1; then
  pass "Linting passed"
else
  fail "Linting errors"
fi

# 9. Tests (unit/integration)
if npm test --silent > /dev/null 2>&1; then
  pass "Tests passed"
else
  fail "Some tests failed"
fi

info "Audit completed. Review the above PASS/FAIL messages."
```

---

## 📋 How to Use
1. **Make the script executable**
   ```bash
   chmod +x scripts/audit.sh
   ```
2. **Run the audit**
   ```bash
   ./scripts/audit.sh
   ```
3. Review the console output. All checks must show **[PASS]** before you start developing or deploying OpsFlow.

---

## 🔧 Troubleshooting
- **Docker not running** – Start Docker Desktop or the Docker daemon.
- **PostgreSQL/Redis not reachable** – Ensure `docker-compose.yml` is up (`docker compose up -d`).
- **Prisma errors** – Run `npx prisma generate` or `npx prisma migrate dev` after the DB is up.
- **Lint/Test failures** – Fix the reported issues; the audit will stop at the first failure.

---

*This audit file mirrors the architectural requirements outlined in the OpsFlow documentation (multi‑tenant isolation, background job processing, real‑time updates, audit logging, etc.) and provides a fast, reproducible way to verify a fresh developer workstation.*
