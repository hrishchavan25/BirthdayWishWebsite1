import { sql } from '@vercel/postgres';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const keyPattern = /^[a-zA-Z0-9_-]{1,100}$/;

export default async function handler(request: VercelRequest, response: VercelResponse) {
  const key = typeof request.query.key === 'string' ? request.query.key : request.body?.key;

  if (!key || !keyPattern.test(key)) {
    return response.status(400).json({ error: 'A valid data key is required.' });
  }

  try {
    await sql`
      CREATE TABLE IF NOT EXISTS birthday_site_data (
        data_key TEXT PRIMARY KEY,
        data_value JSONB NOT NULL,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `;

    if (request.method === 'GET') {
      const result = await sql`
        SELECT data_value AS value
        FROM birthday_site_data
        WHERE data_key = ${key}
      `;
      return response.status(200).json({ value: result.rows[0]?.value ?? null });
    }

    if (request.method === 'PUT') {
      if (request.body?.value === undefined) {
        return response.status(400).json({ error: 'A value is required.' });
      }

      await sql`
        INSERT INTO birthday_site_data (data_key, data_value, updated_at)
        VALUES (${key}, ${JSON.stringify(request.body.value)}::jsonb, NOW())
        ON CONFLICT (data_key)
        DO UPDATE SET data_value = EXCLUDED.data_value, updated_at = NOW()
      `;
      return response.status(204).end();
    }

    response.setHeader('Allow', 'GET, PUT');
    return response.status(405).json({ error: 'Method not allowed.' });
  } catch (error) {
    console.error('Shared storage error:', error);
    return response.status(500).json({ error: 'Database is not configured or unavailable.' });
  }
}
