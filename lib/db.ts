import { neon } from '@neondatabase/serverless';
import postgres from 'postgres';

export function isDbConfigured(): boolean {
  const url =
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.NEON_DATABASE_URL ||
    process.env.SUPABASE_DATABASE_URL ||
    process.env.POSTGRES_URL_NON_POOLING;
  return Boolean(url && !url.includes('placeholder'));
}

// Cache postgres client for serverless environments
let cachedPgSql: any = null;

export function sqlClient(): any {
  const connectionString =
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.NEON_DATABASE_URL ||
    process.env.SUPABASE_DATABASE_URL ||
    process.env.POSTGRES_URL_NON_POOLING;

  if (!connectionString) {
    throw new Error(
      'Database connection string is missing. Please set DATABASE_URL in your .env.local or Vercel Environment Variables.'
    );
  }

  // If using Neon serverless HTTP endpoint
  if (connectionString.includes('neon.tech')) {
    return neon(connectionString);
  }

  // For Supabase and all standard PostgreSQL instances (direct or connection pooler)
  if (!cachedPgSql) {
    cachedPgSql = postgres(connectionString, {
      ssl: connectionString.includes('localhost') ? false : 'require',
      prepare: false, // Essential for Supabase PgBouncer/Supavisor transaction pooler
      max: 10,
      idle_timeout: 20,
      connect_timeout: 15,
    });
  }

  return cachedPgSql;
}

/**
 * Safe query execution helper with logging
 */
export async function executeQuery<T = any>(
  queryFn: (sql: any) => Promise<T>
): Promise<{ data: T | null; error: Error | null }> {
  try {
    const sql = sqlClient();
    const data = await queryFn(sql);
    return { data, error: null };
  } catch (err: any) {
    console.error('[Database Error]', err?.message || err);
    return { data: null, error: err instanceof Error ? err : new Error(String(err)) };
  }
}
