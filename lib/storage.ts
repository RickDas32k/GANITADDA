import crypto from 'crypto';
import { sqlClient, isDbConfigured } from './db';

const STORAGE_SECRET =
  process.env.SESSION_SECRET || 'ganit-adda-storage-encryption-key-32-chars';

/**
 * Generate a short-lived (15-minute) signed token for secure PDF downloads.
 */
export function generateSignedDownloadToken(params: {
  userId: string;
  entitlementId: string;
  worksheetId: string;
  expiresInMinutes?: number;
}): string {
  const expiresIn = (params.expiresInMinutes || 15) * 60 * 1000;
  const expiresAt = Date.now() + expiresIn;

  const payload = `${params.userId}:${params.entitlementId}:${params.worksheetId}:${expiresAt}`;
  const signature = crypto
    .createHmac('sha256', STORAGE_SECRET)
    .update(payload)
    .digest('hex');

  const tokenData = Buffer.from(`${payload}:${signature}`).toString('base64url');
  return tokenData;
}

/**
 * Verify a short-lived signed download token.
 */
export function verifySignedDownloadToken(token: string): {
  valid: boolean;
  userId?: string;
  entitlementId?: string;
  worksheetId?: string;
  error?: string;
} {
  try {
    const raw = Buffer.from(token, 'base64url').toString('utf8');
    const parts = raw.split(':');
    if (parts.length !== 5) {
      return { valid: false, error: 'Malformed download token' };
    }

    const [userId, entitlementId, worksheetId, expiresAtStr, signature] = parts;
    const expiresAt = parseInt(expiresAtStr, 10);

    if (Date.now() > expiresAt) {
      return { valid: false, error: 'Download token has expired' };
    }

    const payload = `${userId}:${entitlementId}:${worksheetId}:${expiresAtStr}`;
    const expectedSignature = crypto
      .createHmac('sha256', STORAGE_SECRET)
      .update(payload)
      .digest('hex');

    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
      return { valid: false, error: 'Invalid download signature' };
    }

    return { valid: true, userId, entitlementId, worksheetId };
  } catch (err: any) {
    return { valid: false, error: err?.message || 'Token verification failed' };
  }
}

/**
 * Verify if a customer is entitled to download a specific worksheet.
 */
export async function verifyCustomerEntitlement(
  userId: string,
  worksheetId: string
): Promise<{ entitled: boolean; entitlementId?: string; error?: string }> {
  if (!isDbConfigured()) {
    // Development sandbox mode
    return { entitled: true, entitlementId: 'sandbox-entitlement' };
  }

  try {
    const sql = sqlClient();
    const rows = await sql`
      SELECT id, is_active, download_count, max_downloads, expires_at 
      FROM download_entitlements 
      WHERE user_id = ${userId} AND worksheet_id = ${worksheetId} AND is_active = true
      LIMIT 1
    `;

    if (!rows || rows.length === 0) {
      return { entitled: false, error: 'No active purchase entitlement found for this worksheet.' };
    }

    const ent = rows[0];
    if (ent.expires_at && new Date(ent.expires_at).getTime() < Date.now()) {
      return { entitled: false, error: 'Download entitlement has expired.' };
    }

    if (ent.download_count >= ent.max_downloads) {
      return { entitled: false, error: 'Maximum download limit reached for this resource.' };
    }

    return { entitled: true, entitlementId: ent.id };
  } catch (err: any) {
    console.error('[Storage Entitlement Check Failed]', err);
    return { entitled: false, error: 'Database check failed' };
  }
}
