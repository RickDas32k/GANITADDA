import { readFile } from 'node:fs/promises';
import { neon } from '@neondatabase/serverless';
import postgres from 'postgres';

const connectionString =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.NEON_DATABASE_URL ||
  process.env.SUPABASE_DATABASE_URL ||
  process.env.POSTGRES_URL_NON_POOLING;

if (!connectionString) {
  console.error('Error: Set DATABASE_URL or POSTGRES_URL to your Supabase/PostgreSQL connection string.');
  process.exit(1);
}

const isNeon = connectionString.includes('neon.tech');
console.log(`Connecting to ${isNeon ? 'Neon Serverless' : 'Supabase / PostgreSQL'} database...`);

const sql = isNeon
  ? neon(connectionString)
  : postgres(connectionString, { ssl: 'require', prepare: false });

const schema = await readFile(new URL('../db/schema.sql', import.meta.url), 'utf8');

const statements = schema
  .split(';')
  .map((s) => s.trim())
  .filter(Boolean);

console.log(`Executing ${statements.length} schema statements...`);

for (const statement of statements) {
  if (isNeon) {
    await sql.query(statement);
  } else {
    await sql.unsafe(statement);
  }
}

if (!isNeon) {
  await sql.end();
}

console.log('Ganit Adda database schema and seed data installed successfully.');
