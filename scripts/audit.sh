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
