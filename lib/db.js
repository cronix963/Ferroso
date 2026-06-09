import dotenv from 'dotenv';
import { join } from 'path';
import { existsSync } from 'fs';

// Load .env.local — works in both standalone Node.js and Next.js API routes
const envPath = join(process.cwd(), '.env.local');
if (existsSync(envPath)) {
  dotenv.config({ path: envPath });
}

import pg from 'pg';

const { Pool } = pg;

// Support both individual vars (local dev) and DATABASE_URL (Supabase/cloud)
let poolConfig;

if (process.env.DATABASE_URL) {
  poolConfig = {
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    max: 10,
    idleTimeoutMillis: 30000,
  };
} else {
  poolConfig = {
    user: process.env.PGUSER || 'postgres',
    password: process.env.PGPASSWORD || '',
    host: process.env.PGHOST || 'localhost',
    port: parseInt(process.env.PGPORT || '5432', 10),
    database: process.env.PGDATABASE || 'ferrotech_db',
    max: 10,
    idleTimeoutMillis: 30000,
  };
}

const pool = new Pool(poolConfig);

pool.on('error', (err) => {
  console.error('[DB] Unexpected pool error:', err.message);
});

export function getPool() {
  return pool;
}

export async function query(text, params = []) {
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return { rows: result.rows, rowCount: result.rowCount };
  } finally {
    client.release();
  }
}

export { Pool };
export default getPool;
