import { neon } from '@neondatabase/serverless';

export function isDbConfigured(): boolean {
  const url =
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.NEON_DATABASE_URL ||
    process.env.POSTGRES_URL_NON_POOLING;
  return Boolean(url && !url.includes('placeholder'));
}

export function sqlClient() {
  const connectionString =
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.NEON_DATABASE_URL ||
    process.env.POSTGRES_URL_NON_POOLING;

  if (!connectionString) {
    throw new Error(
      'Neon connection string is missing. Please set DATABASE_URL in your .env.local or Vercel Environment Variables.'
    );
  }

  return neon(connectionString);
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
