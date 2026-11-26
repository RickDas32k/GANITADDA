import { neon } from '@neondatabase/serverless';
import postgres from 'postgres';

function getPooledConnectionString(): string | undefined {
  return (
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.NEON_DATABASE_URL ||
    process.env.SUPABASE_DATABASE_URL ||
    process.env.POSTGRES_URL_NON_POOLING
  );
}

export function getUnpooledConnectionString(): string | undefined {
  return (
    process.env.DATABASE_URL_UNPOOLED ||
    process.env.POSTGRES_URL_NON_POOLING ||
    getPooledConnectionString()
  );
}

export function isDbConfigured(): boolean {
  const url = getPooledConnectionString();
  return Boolean(url && !url.includes('placeholder'));
}

// Cache database clients across serverless invocations
let cachedNeonUrl: string | null = null;
let cachedNeonSql: ReturnType<typeof neon> | null = null;
let cachedPgUrl: string | null = null;
let cachedPgSql: ReturnType<typeof postgres> | null = null;

export function sqlClient(): any {
  const connectionString = getPooledConnectionString();

  if (!connectionString) {
    throw new Error(
      'Database connection string is missing. Please set DATABASE_URL in your .env or .env.local file.'
    );
  }

  // Use Neon serverless HTTP driver for Neon pooled endpoints
  if (connectionString.includes('neon.tech')) {
    if (!cachedNeonSql || cachedNeonUrl !== connectionString) {
      cachedNeonUrl = connectionString;
      cachedNeonSql = neon(connectionString);
    }
    return cachedNeonSql;
  }

  // Standard PostgreSQL / PgBouncer fallback
  if (!cachedPgSql || cachedPgUrl !== connectionString) {
    cachedPgUrl = connectionString;
    cachedPgSql = postgres(connectionString, {
      ssl: connectionString.includes('localhost') ? false : 'require',
      prepare: false,
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
