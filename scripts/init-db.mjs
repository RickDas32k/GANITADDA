import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import postgres from 'postgres';

// Load local env files when invoked directly via `npm run db:init`
for (const envFile of ['.env.local', '.env']) {
  if (existsSync(envFile) && typeof process.loadEnvFile === 'function') {
    process.loadEnvFile(envFile);
  }
}

// Prefer direct/unpooled connection for schema migrations and DDL
const connectionString =
  process.env.DATABASE_URL_UNPOOLED ||
  process.env.POSTGRES_URL_NON_POOLING ||
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.NEON_DATABASE_URL ||
  process.env.SUPABASE_DATABASE_URL;

if (!connectionString) {
  console.error(
    'Error: Set DATABASE_URL_UNPOOLED or DATABASE_URL to your Neon/PostgreSQL connection string.'
  );
  process.exit(1);
}

const isLocalhost = connectionString.includes('localhost') || connectionString.includes('127.0.0.1');
const isNeon = connectionString.includes('neon.tech');
console.log(
  `Connecting to ${isNeon ? 'Neon Lakebase Postgres' : 'PostgreSQL'} (${
    connectionString.includes('-pooler') ? 'pooled' : 'direct'
  })...`
);

const sql = postgres(connectionString, {
  ssl: isLocalhost ? false : 'require',
  max: 1,
});

try {
  const schema = await readFile(new URL('../db/schema.sql', import.meta.url), 'utf8');
  console.log('Executing db/schema.sql...');
  await sql.unsafe(schema);
  console.log('Ganit Adda database schema and seed data installed successfully.');
} finally {
  await sql.end();
}
