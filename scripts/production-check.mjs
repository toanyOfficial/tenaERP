import fs from 'node:fs/promises';
import path from 'node:path';
import mysql from 'mysql2/promise';

function required(name) {
  const v = process.env[name];
  if (!v || !String(v).trim()) throw new Error(`Missing env: ${name}`);
  return String(v);
}

async function main() {
  const dbHost = required('DB_HOST');
  const dbPort = Number(required('DB_PORT'));
  const dbName = required('DB_NAME');
  const dbUser = required('DB_USER');
  const dbPassword = required('DB_PASSWORD');
  required('SESSION_SECRET');
  required('AES_SECRET_KEY');

  if (!Number.isInteger(dbPort) || dbPort <= 0) throw new Error('Invalid DB_PORT');

  const uploadsContracts = path.join(process.cwd(), 'uploads', 'contracts');
  await fs.mkdir(uploadsContracts, { recursive: true });
  await fs.access(uploadsContracts);

  const conn = await mysql.createConnection({
    host: dbHost,
    port: dbPort,
    database: dbName,
    user: dbUser,
    password: dbPassword,
  });

  await conn.query('SELECT 1');
  await conn.end();

  console.log('[production-check] ok');
}

main().catch((err) => {
  console.error('[production-check] failed:', err.message);
  process.exit(1);
});
