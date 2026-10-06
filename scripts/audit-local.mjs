import { execSync } from 'child_process';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import net from 'net';

const color = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  reset: '\x1b[0m',
};

const pass = (msg) => console.log(`${color.green}[PASS]${color.reset} ${msg}`);
const fail = (msg) => console.log(`${color.red}[FAIL]${color.reset} ${msg}`);
const warn = (msg) => console.log(`${color.yellow}[WARN]${color.reset} ${msg}`);

async function checkPort(port, host = '127.0.0.1') {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    socket.setTimeout(2000);
    socket.on('connect', () => {
      socket.destroy();
      resolve(true);
    });
    socket.on('timeout', () => {
      socket.destroy();
      resolve(false);
    });
    socket.on('error', () => {
      socket.destroy();
      resolve(false);
    });
    socket.connect(port, host);
  });
}

async function runAudit() {
  console.log('Starting OpsFlow Local System Audit...\n');
  let hasErrors = false;

  // 1. Check Node.js version
  const nodeVersion = process.version;
  if (parseInt(nodeVersion.replace('v', '').split('.')[0]) >= 20) {
    pass(`Node.js version is ${nodeVersion} (>= 20)`);
  } else {
    fail(`Node.js version is ${nodeVersion}. Recommended >= 20`);
    hasErrors = true;
  }

  // 2. Check Docker
  try {
    execSync('docker info', { stdio: 'ignore' });
    pass('Docker daemon is running');
  } catch (e) {
    fail('Docker daemon is NOT running or accessible. Please start Docker Desktop.');
    hasErrors = true;
  }

  // 3. Check Database (Postgres)
  const isPostgresUp = await checkPort(5432);
  if (isPostgresUp) {
    pass('PostgreSQL is accessible on port 5432');
  } else {
    warn('PostgreSQL is NOT accessible on port 5432. Did you run `docker-compose up -d`?');
  }

  // 4. Check Redis
  const isRedisUp = await checkPort(6379);
  if (isRedisUp) {
    pass('Redis is accessible on port 6379');
  } else {
    warn('Redis is NOT accessible on port 6379. Did you run `docker-compose up -d`?');
  }

  // 5. Check API .env
  const apiEnvPath = join(process.cwd(), 'apps', 'api', '.env');
  if (existsSync(apiEnvPath)) {
    const envContent = readFileSync(apiEnvPath, 'utf8');
    if (envContent.includes('DATABASE_URL')) {
      pass('API .env file contains DATABASE_URL');
    } else {
      fail('API .env file is missing DATABASE_URL');
      hasErrors = true;
    }
  } else {
    fail('API .env file is missing');
    hasErrors = true;
  }

  // 6. Check Prisma Schema
  try {
    const schemaPath = join(process.cwd(), 'apps', 'api', 'prisma', 'schema.prisma');
    if (existsSync(schemaPath) && readFileSync(schemaPath, 'utf8').includes('model')) {
      pass('Prisma schema exists and contains models');
    } else {
      fail('Prisma schema is missing or empty');
      hasErrors = true;
    }
  } catch (e) {
    fail('Prisma schema validation failed');
    hasErrors = true;
  }

  console.log('\nAudit Complete.');
  if (hasErrors) {
    console.log(`${color.red}Some mandatory checks failed. Please fix them before starting the application.${color.reset}`);
    process.exit(1);
  } else {
    console.log(`${color.green}Your local system appears ready to run OpsFlow!${color.reset}`);
  }
}

runAudit();
